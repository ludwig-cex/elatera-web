import { after } from "next/server";
import { notifyTelegram } from "@/lib/notify";

export const runtime = "nodejs";

const KLAVIYO_LIST_ID = "WPrLGr";
const KLAVIYO_BASE = "https://a.klaviyo.com/api";
const KLAVIYO_REVISION = "2024-10-15";

type IntentBody = {
  email?: string;
  honeypot?: string; // bots fill this; humans never see it
  items?: { product: string; months: number; subscription: boolean }[];
  totalCents?: number;
  utm?: Record<string, string>;
};

function isEmail(v: unknown): v is string {
  return typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && v.length <= 254;
}

function klaviyoHeaders(key: string) {
  return {
    Authorization: `Klaviyo-API-Key ${key}`,
    revision: KLAVIYO_REVISION,
    accept: "application/json",
    "content-type": "application/json",
  };
}

async function withTimeout(input: string, init: RequestInit, ms = 8000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(input, { ...init, signal: ctrl.signal });
  } finally {
    clearTimeout(t);
  }
}

// E-Mail für die Push-Nachricht maskieren (kein Klartext-PII an Telegram).
function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  return `${local.slice(0, 2)}***@${domain}`;
}

export async function POST(request: Request) {
  const key = process.env.KLAVIYO_PRIVATE_API_KEY;
  if (!key) {
    console.error("[intent] KLAVIYO_PRIVATE_API_KEY not configured");
    return Response.json({ ok: false, error: "not_configured" }, { status: 500 });
  }

  let body: IntentBody;
  try {
    body = (await request.json()) as IntentBody;
  } catch {
    return Response.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  // Honeypot: silently accept so bots don't learn they were filtered,
  // but never touch Klaviyo.
  if (body.honeypot && body.honeypot.trim() !== "") {
    return Response.json({ ok: true });
  }

  if (!isEmail(body.email)) {
    return Response.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }
  const email = body.email.trim().toLowerCase();

  const utm = body.utm ?? {};
  const properties: Record<string, unknown> = {
    intent_source: "nutra-sana cart out-of-stock",
    cart_products: (body.items ?? []).map((i) => i.product).join(","),
    cart_items: body.items?.length ?? 0,
    cart_value_eur:
      typeof body.totalCents === "number" ? body.totalCents / 100 : null,
    cart_subscription: (body.items ?? []).some((i) => i.subscription),
    first_intent_at: new Date().toISOString(),
    ...Object.fromEntries(
      Object.entries(utm)
        .filter(([, v]) => typeof v === "string" && v !== "")
        .slice(0, 12)
        .map(([k, v]) => [k, String(v).slice(0, 200)]),
    ),
  };

  try {
    // 1) Create profile (upsert on 409 duplicate).
    let profileId: string | null = null;
    const createRes = await withTimeout(`${KLAVIYO_BASE}/profiles/`, {
      method: "POST",
      headers: klaviyoHeaders(key),
      body: JSON.stringify({
        data: { type: "profile", attributes: { email, properties } },
      }),
    });

    if (createRes.status === 201) {
      const j = await createRes.json();
      profileId = j?.data?.id ?? null;
    } else if (createRes.status === 409) {
      const j = await createRes.json().catch(() => null);
      profileId =
        j?.errors?.[0]?.meta?.duplicate_profile_id ?? null;
      if (profileId) {
        // Refresh properties on the existing profile (best-effort).
        await withTimeout(`${KLAVIYO_BASE}/profiles/${profileId}/`, {
          method: "PATCH",
          headers: klaviyoHeaders(key),
          body: JSON.stringify({
            data: { type: "profile", id: profileId, attributes: { properties } },
          }),
        }).catch(() => null);
      }
    } else {
      const txt = await createRes.text().catch(() => "");
      console.error("[intent] klaviyo profile create failed", createRes.status, txt.slice(0, 300));
      return Response.json({ ok: false, error: "klaviyo_profile" }, { status: 502 });
    }

    if (!profileId) {
      return Response.json({ ok: false, error: "no_profile_id" }, { status: 502 });
    }

    // 2) Add profile to the pre-launch intent list (no marketing consent /
    // no DOI — purely collecting interest for now).
    const listRes = await withTimeout(
      `${KLAVIYO_BASE}/lists/${KLAVIYO_LIST_ID}/relationships/profiles/`,
      {
        method: "POST",
        headers: klaviyoHeaders(key),
        body: JSON.stringify({
          data: [{ type: "profile", id: profileId }],
        }),
      },
    );

    if (!listRes.ok && listRes.status !== 204 && listRes.status !== 409) {
      const txt = await listRes.text().catch(() => "");
      console.error("[intent] klaviyo list add failed", listRes.status, txt.slice(0, 300));
      return Response.json({ ok: false, error: "klaviyo_list" }, { status: 502 });
    }

    // 3) Push-Benachrichtigung nach der Response (blockiert den Nutzer nicht).
    const products = (body.items ?? []).map((i) => i.product).join(", ") || "—";
    const value =
      typeof body.totalCents === "number"
        ? `${(body.totalCents / 100).toFixed(2).replace(".", ",")} €`
        : "—";
    const adId = utm.utm_content || "organisch";
    after(() =>
      notifyTelegram(
        `🎉 Neuer Intent auf nutra-sana.de\n` +
          `Produkte: ${products}\n` +
          `Warenkorbwert: ${value}\n` +
          `Quelle: ${utm.utm_source || "direkt"} · Ad: ${adId}\n` +
          `E-Mail: ${maskEmail(email)}`,
      ),
    );

    return Response.json({ ok: true });
  } catch (err) {
    console.error("[intent] unexpected error", (err as Error)?.message);
    return Response.json({ ok: false, error: "exception" }, { status: 502 });
  }
}
