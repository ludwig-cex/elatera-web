// Server-only Klaviyo helpers.

const KLAVIYO_BASE = "https://a.klaviyo.com/api";
const KLAVIYO_REVISION = "2024-10-15";

function headers(key: string) {
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

// Fires a Klaviyo "Out of Stock Order" metric event for `email`. Build a
// Klaviyo Flow triggered by this metric to send the apology mail. No-op if
// KLAVIYO_PRIVATE_API_KEY is unset, and never throws (best-effort).
export async function trackOutOfStockOrder(
  email: string,
  properties: Record<string, unknown>,
) {
  const key = process.env.KLAVIYO_PRIVATE_API_KEY;
  if (!key) return;
  try {
    const res = await withTimeout(`${KLAVIYO_BASE}/events/`, {
      method: "POST",
      headers: headers(key),
      body: JSON.stringify({
        data: {
          type: "event",
          attributes: {
            properties,
            metric: {
              data: { type: "metric", attributes: { name: "Out of Stock Order" } },
            },
            profile: {
              data: { type: "profile", attributes: { email } },
            },
          },
        },
      }),
    });
    if (!res.ok && res.status !== 202) {
      const txt = await res.text().catch(() => "");
      console.error("[klaviyo] out-of-stock event failed", res.status, txt.slice(0, 300));
    }
  } catch (err) {
    console.error("[klaviyo] out-of-stock event error", (err as Error)?.message);
  }
}
