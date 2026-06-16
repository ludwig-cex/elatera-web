export const runtime = "nodejs";

// Meta Conversions API (CAPI) bridge. The client mirrors every pixel event here
// with a shared event_id so Meta can deduplicate the browser pixel against the
// server event. Server-side delivery is far more reliable than the pixel alone
// (iOS ATT, ad blockers, redirect/checkout timing), which is exactly where the
// Lead event was getting lost.
const GRAPH = "https://graph.facebook.com/v21.0";
const PIXEL_ID =
  process.env.META_PIXEL_ID || process.env.NEXT_PUBLIC_META_PIXEL_ID || "1021981360359558";
const TOKEN = process.env.META_CAPI_ACCESS_TOKEN;
// When set, events are routed to Events Manager > Test Events instead of live.
const ENV_TEST_CODE = process.env.META_CAPI_TEST_CODE;

type Body = {
  event_name?: string;
  event_id?: string;
  event_source_url?: string;
  value?: number;
  currency?: string;
  content_ids?: string[];
  test_event_code?: string; // ad-hoc testing override
};

function readCookie(cookieHeader: string, name: string): string | undefined {
  const m = cookieHeader.match(new RegExp("(?:^|; )" + name + "=([^;]+)"));
  return m ? decodeURIComponent(m[1]) : undefined;
}

export async function POST(request: Request) {
  // Not configured -> silently no-op (never break the client; it's fire-and-forget).
  if (!TOKEN) return Response.json({ ok: false, error: "not_configured" });

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return Response.json({ ok: false, error: "bad_request" }, { status: 400 });
  }
  if (!body.event_name || !body.event_id) {
    return Response.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }

  // Matching signals from cookies + request headers (no PII).
  const cookie = request.headers.get("cookie") || "";
  const fbp = readCookie(cookie, "_fbp");
  const fbc = readCookie(cookie, "_fbc");
  const ua = request.headers.get("user-agent") || undefined;
  const ip =
    (request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "")
      .split(",")[0]
      .trim() || undefined;

  const user_data: Record<string, unknown> = {};
  if (fbp) user_data.fbp = fbp;
  if (fbc) user_data.fbc = fbc;
  if (ip) user_data.client_ip_address = ip;
  if (ua) user_data.client_user_agent = ua;

  const custom_data: Record<string, unknown> = {};
  if (typeof body.value === "number") {
    custom_data.value = body.value;
    custom_data.currency = body.currency || "EUR";
  }
  if (Array.isArray(body.content_ids) && body.content_ids.length > 0) {
    custom_data.content_ids = body.content_ids;
    custom_data.content_type = "product";
  }

  const testCode = body.test_event_code || ENV_TEST_CODE;
  const payload = {
    data: [
      {
        event_name: body.event_name,
        event_time: Math.floor(Date.now() / 1000),
        event_id: body.event_id,
        action_source: "website",
        ...(body.event_source_url ? { event_source_url: body.event_source_url } : {}),
        user_data,
        custom_data,
      },
    ],
    ...(testCode ? { test_event_code: testCode } : {}),
  };

  try {
    const res = await fetch(`${GRAPH}/${PIXEL_ID}/events?access_token=${encodeURIComponent(TOKEN)}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error("[capi] meta rejected", res.status, JSON.stringify(json).slice(0, 400));
      return Response.json({ ok: false, status: res.status, meta: json });
    }
    return Response.json({ ok: true, received: json?.events_received ?? null, fbtrace_id: json?.fbtrace_id });
  } catch (err) {
    console.error("[capi] error", (err as Error)?.message);
    return Response.json({ ok: false, error: "exception" });
  }
}
