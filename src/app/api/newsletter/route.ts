export const runtime = "nodejs";

// Newsletter signup → Klaviyo with marketing consent (double opt-in if the list
// has DOI enabled in Klaviyo, which matches the form's "bitte bestätigen Sie
// Ihre E-Mail" message). Separate from the transactional intent/checkout lists.
const KLAVIYO_BASE = "https://a.klaviyo.com/api";
const KLAVIYO_REVISION = "2024-10-15";

type Body = { email?: string; honeypot?: string; utm?: Record<string, string> };

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

export async function POST(request: Request) {
  const key = process.env.KLAVIYO_PRIVATE_API_KEY;
  const listId = process.env.KLAVIYO_NEWSLETTER_LIST_ID;
  if (!key || !listId) {
    console.error("[newsletter] KLAVIYO_PRIVATE_API_KEY / KLAVIYO_NEWSLETTER_LIST_ID not configured");
    return Response.json({ ok: false, error: "not_configured" }, { status: 500 });
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return Response.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  // Honeypot: silently accept so bots don't learn they were filtered.
  if (body.honeypot && body.honeypot.trim() !== "") {
    return Response.json({ ok: true });
  }
  if (!isEmail(body.email)) {
    return Response.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }
  const email = body.email.trim().toLowerCase();
  const utm = body.utm ?? {};

  try {
    // Subscribe with marketing consent + add to the newsletter list. With DOI
    // enabled on the list, Klaviyo sends the confirmation email itself.
    const res = await withTimeout(`${KLAVIYO_BASE}/profile-subscription-bulk-create-jobs/`, {
      method: "POST",
      headers: klaviyoHeaders(key),
      body: JSON.stringify({
        data: {
          type: "profile-subscription-bulk-create-job",
          attributes: {
            profiles: {
              data: [
                {
                  type: "profile",
                  attributes: {
                    email,
                    subscriptions: { email: { marketing: { consent: "SUBSCRIBED" } } },
                    properties: {
                      newsletter_source: "nutra-sana site",
                      ...(utm.utm_source ? { utm_source: String(utm.utm_source).slice(0, 100) } : {}),
                    },
                  },
                },
              ],
            },
          },
          relationships: { list: { data: { type: "list", id: listId } } },
        },
      }),
    });

    if (!res.ok && res.status !== 202 && res.status !== 204) {
      const txt = await res.text().catch(() => "");
      console.error("[newsletter] klaviyo subscribe failed", res.status, txt.slice(0, 300));
      return Response.json({ ok: false, error: "klaviyo" }, { status: 502 });
    }
    return Response.json({ ok: true });
  } catch (err) {
    console.error("[newsletter] unexpected error", (err as Error)?.message);
    return Response.json({ ok: false, error: "exception" }, { status: 502 });
  }
}
