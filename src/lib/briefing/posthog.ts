// Server-only: pull the on-site funnel from PostHog via HogQL, grouped by day
// and by the ad name carried in utm_content. Uses the existing
// POSTHOG_PERSONAL_API_KEY. Project 182794 (EU).
import type { FunnelDayRow } from "./types";

const HOST = process.env.POSTHOG_API_HOST || "https://eu.i.posthog.com";
const PROJECT = process.env.POSTHOG_PROJECT_ID || "182794";

function num(v: unknown): number {
  const n = typeof v === "number" ? v : parseInt(String(v ?? "0"), 10);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Funnel counts per day per ad (utm_content), for [since, until] inclusive.
 * "Gekauft" = payment_authorized (Stripe auth-hold), the strongest real
 * purchase-intent signal in the intent-capture storefront.
 */
export async function fetchFunnelDays(since: string, until: string): Promise<FunnelDayRow[]> {
  const key = process.env.POSTHOG_PERSONAL_API_KEY;
  if (!key) throw new Error("POSTHOG_PERSONAL_API_KEY not configured");

  // until is inclusive -> query strictly less than the day after.
  const untilExclusive = addDays(until, 1);
  const hogql = `
    SELECT
      toString(toDate(timestamp))      AS day,
      properties.utm_source            AS source,
      properties.utm_campaign          AS campaign,
      properties.utm_content           AS ad,
      properties.utm_term              AS ad_id_tag,
      countIf(event = 'product_viewed')          AS product_viewed,
      countIf(event = 'advertorial_cta_click')   AS lp_cta,
      countIf(event = 'add_to_cart')             AS add_to_cart,
      countIf(event = 'payment_authorized')      AS purchased
    FROM events
    WHERE timestamp >= toDateTime('${since} 00:00:00')
      AND timestamp <  toDateTime('${untilExclusive} 00:00:00')
      AND event IN ('product_viewed','advertorial_cta_click','add_to_cart','payment_authorized')
    GROUP BY day, source, campaign, ad, ad_id_tag
    ORDER BY day
  `.trim();

  const res = await fetch(`${HOST}/api/projects/${PROJECT}/query/`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query: { kind: "HogQLQuery", query: hogql } }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`PostHog query ${res.status}: ${body.slice(0, 300)}`);
  }
  const json = (await res.json()) as { results?: unknown[][] };

  return (json.results ?? []).map((r): FunnelDayRow => ({
    date: String(r[0] ?? ""),
    source: String(r[1] ?? ""),
    campaign: String(r[2] ?? ""),
    ad: String(r[3] ?? ""),
    adIdTag: String(r[4] ?? ""),
    product_viewed: num(r[5]),
    lp_cta: num(r[6]),
    add_to_cart: num(r[7]),
    purchased: num(r[8]),
  }));
}

function addDays(ymd: string, days: number): string {
  const [y, m, d] = ymd.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + days);
  return dt.toISOString().slice(0, 10);
}
