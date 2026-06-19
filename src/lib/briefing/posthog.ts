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
 * Funnel as UNIQUE PERSONS per day per ad (utm_content), for [since, until]
 * inclusive — so multiple attempts by the same person (e.g. trying several
 * payment methods) count once per day, matching the PostHog funnel insights.
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
      count(DISTINCT if(event = 'product_viewed', person_id, NULL))        AS product_viewed,
      count(DISTINCT if(event = 'advertorial_cta_click', person_id, NULL)) AS lp_cta,
      count(DISTINCT if(event = 'add_to_cart', person_id, NULL))           AS add_to_cart,
      count(DISTINCT if(event = 'checkout_clicked', person_id, NULL))      AS checkout,
      count(DISTINCT if(event = 'payment_submitted', person_id, NULL))     AS pay_submit,
      count(DISTINCT if(event = 'payment_authorized', person_id, NULL))    AS purchased
    FROM events
    WHERE timestamp >= toDateTime('${since} 00:00:00')
      AND timestamp <  toDateTime('${untilExclusive} 00:00:00')
      AND event IN ('product_viewed','advertorial_cta_click','add_to_cart','checkout_clicked','payment_submitted','payment_authorized')
    GROUP BY day, source, campaign, ad, ad_id_tag
    ORDER BY day
    LIMIT 100000
  `.trim();
  // NB: HogQL applies a DEFAULT LIMIT of 100 when none is given. With ORDER BY day
  // ascending that silently drops the most recent days once there are >100 groups —
  // i.e. today's conversions vanish. The explicit high LIMIT prevents that.

  const res = await fetch(`${HOST}/api/projects/${PROJECT}/query/`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    // force_blocking = recompute, never serve a stale cached result. Without this
    // PostHog's query cache can return an older snapshot that misses conversions
    // captured since the last run (e.g. a fresh payment_submitted), so the daily
    // briefing would silently undercount.
    body: JSON.stringify({ query: { kind: "HogQLQuery", query: hogql }, refresh: "force_blocking" }),
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
    checkout: num(r[8]),
    pay_submit: num(r[9]),
    purchased: num(r[10]),
  }));
}

// Advertorial landings = fb/ig $pageview on the advertorial, per day per ad
// (utm_content). Kept as a SEPARATE, simple query (grouped only by day + ad) so
// it can't fragment across source/campaign/term groups like the funnel join did.
// This is the on-site "Klick" (the Meta click that actually arrived).
export type LandingDay = { date: string; ad: string; landings: number };

export async function fetchLandings(since: string, until: string): Promise<LandingDay[]> {
  const key = process.env.POSTHOG_PERSONAL_API_KEY;
  if (!key) throw new Error("POSTHOG_PERSONAL_API_KEY not configured");
  const untilExclusive = addDays(until, 1);
  const hogql = `
    SELECT toString(toDate(timestamp)) AS day, properties.utm_content AS ad,
           count(DISTINCT person_id) AS landings
    FROM events
    WHERE timestamp >= toDateTime('${since} 00:00:00')
      AND timestamp <  toDateTime('${untilExclusive} 00:00:00')
      AND event = '$pageview'
      AND properties.$host LIKE '%mein-apothekenrat%'
      AND properties.utm_source IN ('fb','ig')
    GROUP BY day, ad
    LIMIT 100000
  `.trim();
  const res = await fetch(`${HOST}/api/projects/${PROJECT}/query/`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query: { kind: "HogQLQuery", query: hogql }, refresh: "force_blocking" }),
  });
  if (!res.ok) throw new Error(`PostHog landings ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const json = (await res.json()) as { results?: unknown[][] };
  return (json.results ?? []).map((r): LandingDay => ({
    date: String(r[0] ?? ""),
    ad: String(r[1] ?? ""),
    landings: num(r[2]),
  }));
}

function addDays(ymd: string, days: number): string {
  const [y, m, d] = ymd.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + days);
  return dt.toISOString().slice(0, 10);
}
