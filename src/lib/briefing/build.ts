// Join Meta delivery (spend/impressions/clicks) with the PostHog on-site funnel
// (CTA / add-to-cart / purchased) into one raw row per day per ad, then provide
// helpers to aggregate any slice (period × level) with derived funnel rates.
import type { FunnelAgg, FunnelDayRow, Level, MetaDayRow, RawRow } from "./types";
import type { LandingDay } from "./posthog";

// Ad names travel Meta -> URL -> PostHog and pick up URL-encoding and case
// drift on the way (e.g. "Arthrose LP4 – Ad1" becomes "Arthrose%20LP4%20%E2%80%93%20Ad1").
// Normalise both sides to the same key before joining.
export function normName(s: string): string {
  let v = s ?? "";
  try {
    // Decode possibly double-encoded values without throwing on stray %.
    v = decodeURIComponent(v.replace(/%(?![0-9a-fA-F]{2})/g, "%25"));
  } catch {
    /* keep raw */
  }
  return v
    .toLowerCase()
    .replace(/[‐-―]/g, "-") // unicode dashes -> hyphen
    .replace(/[\s_]+/g, " ")
    .trim();
}

type FunnelGroup = FunnelDayRow & { _used?: boolean };
const onlyDigits = (s: string) => /^\d{6,}$/.test(s);

/**
 * Build unified raw rows. Left-joins on Meta ads (the spend source) and attaches
 * the PostHog funnel.
 *
 * Identity model (after the Meta UTM standardisation):
 *   utm_term    = {{ad.id}}   → stable join key (preferred)
 *   utm_content = {{ad.name}} → display name
 * Legacy rows from before the change carry only utm_content, which may itself be
 * the ad name OR the ad id. We collapse all of that onto one group per ad/day and
 * register every identifier (id + name + numeric-content) so a Meta ad matches by
 * id first, then by name — without ever double-counting a funnel row.
 *
 * PostHog rows that match no Meta ad (organic / direct / stale ads) are returned
 * separately so nothing is silently dropped. `organicRows` re-shapes them as
 * zero-spend RawRows for the sheet (source = utm_source, z.B. copilot.com beim
 * Bing/Copilot-Referral) — sie gehören ins Rohdaten-Sheet, aber NICHT in die
 * Ad-Aggregate (Spend/CTR/CAC), sonst verwässern organische Conversions die
 * Ads-Auswertung.
 */
export function buildRawRows(
  meta: MetaDayRow[],
  funnel: FunnelDayRow[],
  landings: LandingDay[] = []
): { rows: RawRow[]; unmatchedFunnel: FunnelGroup[]; organicRows: RawRow[] } {
  // Advertorial landings keyed by date|normalised-ad (summed across url-encoded
  // duplicates), looked up per Meta ad row — independent of the funnel join.
  const landingsByKey = new Map<string, number>();
  for (const l of landings) {
    const k = `${l.date}|${normName(l.ad)}`;
    landingsByKey.set(k, (landingsByKey.get(k) ?? 0) + l.landings);
  }

  const groups: FunnelGroup[] = [];
  const byKey = new Map<string, FunnelGroup>(); // many keys -> one group

  const idKey = (date: string, id: string) => `${date}|id:${id}`;
  const nameKey = (date: string, name: string) => `${date}|nm:${name}`;

  // A utm_term that maps to MORE THAN ONE distinct ad name is not a real per-ad
  // id — it's a stale/hardcoded constant from before the UTM standardisation
  // (one wrong id stamped across many ads). Using it as a join key would collapse
  // several ads into one group and double-count. Detect and ignore those tags.
  const namesPerTag = new Map<string, Set<string>>();
  for (const f of funnel) {
    if (!f.adIdTag) continue;
    (namesPerTag.get(f.adIdTag) ?? namesPerTag.set(f.adIdTag, new Set()).get(f.adIdTag)!).add(normName(f.ad));
  }
  const ambiguousTag = new Set([...namesPerTag].filter(([, s]) => s.size > 1).map(([t]) => t));
  const trust = (tag: string) => (tag && !ambiguousTag.has(tag) ? tag : "");

  for (const f of funnel) {
    const nName = normName(f.ad);
    const tag = trust(f.adIdTag);
    const kId = tag ? idKey(f.date, tag) : null;
    const kName = nameKey(f.date, nName);

    // Reuse an existing group reachable by this row's id, name, or — for legacy
    // rows whose utm_content IS the ad id — by that numeric id in the id index.
    let g =
      (kId && byKey.get(kId)) ||
      byKey.get(kName) ||
      (onlyDigits(nName) ? byKey.get(idKey(f.date, nName)) : undefined);
    if (!g) {
      g = { ...f, ad: f.ad || "", _used: false };
      groups.push(g);
    } else {
      g.product_viewed += f.product_viewed;
      g.product_viewed_direct += f.product_viewed_direct;
      g.lp_cta += f.lp_cta;
      g.add_to_cart += f.add_to_cart;
      g.checkout += f.checkout;
      g.pay_submit += f.pay_submit;
      g.purchased += f.purchased;
      g.direct_cart += f.direct_cart;
      g.order_click += f.order_click;
      g.checkout_seeded += f.checkout_seeded;
      g.order_click_seeded += f.order_click_seeded;
      if (!g.adIdTag && tag) g.adIdTag = tag;
      // Prefer a human-readable name over a numeric/empty one for display.
      if ((!g.ad || onlyDigits(g.ad)) && f.ad && !onlyDigits(f.ad)) g.ad = f.ad;
    }

    // Register every identifier this row exposes, all pointing at `g`.
    if (kId) byKey.set(kId, g);
    byKey.set(kName, g);
    if (onlyDigits(nName)) byKey.set(idKey(f.date, nName), g); // legacy id-in-content
  }

  const rows: RawRow[] = meta.map((m) => {
    // Match by stable id first (only trusted, non-ambiguous ids), then by name.
    const mid = trust(m.adId);
    const g =
      (mid ? byKey.get(idKey(m.date, mid)) : undefined) ??
      byKey.get(nameKey(m.date, normName(m.ad)));
    if (g) g._used = true;
    return {
      date: m.date,
      campaign: m.campaign,
      adset: m.adset,
      ad: m.ad,
      source: g?.source ?? "",
      impressions: m.impressions,
      clicks: m.clicks,
      spend: round2(m.spend),
      lp_cta: g?.lp_cta ?? 0,
      add_to_cart: g?.add_to_cart ?? 0,
      checkout: g?.checkout ?? 0,
      pay_submit: g?.pay_submit ?? 0,
      purchased: g?.purchased ?? 0,
      landings: landingsByKey.get(`${m.date}|${normName(m.ad)}`) ?? 0,
      reach: m.reach,
      all_clicks: m.allClicks,
      meta_lpv: m.metaLpv,
      product_view: g?.product_viewed ?? 0,
      revenue: round2(m.revenue),
      product_view_direct: g?.product_viewed_direct ?? 0,
      direct_cart: g?.direct_cart ?? 0,
      order_click: g?.order_click ?? 0,
      checkout_seeded: g?.checkout_seeded ?? 0,
      order_click_seeded: g?.order_click_seeded ?? 0,
    };
  });

  const unmatchedFunnel = groups.filter(
    (g) => !g._used && (g.lp_cta || g.add_to_cart || g.checkout || g.pay_submit || g.purchased)
  );

  const organicRows: RawRow[] = unmatchedFunnel.map((g) => ({
    date: g.date,
    campaign: g.campaign || "(ohne Kampagne)",
    adset: "(kein Meta-Match)",
    ad: g.ad || (g.source ? `(${g.source})` : "(organisch/direkt)"),
    source: g.source,
    impressions: 0,
    clicks: 0,
    spend: 0,
    lp_cta: g.lp_cta,
    add_to_cart: g.add_to_cart,
    checkout: g.checkout,
    pay_submit: g.pay_submit,
    purchased: g.purchased,
    landings: 0,
    reach: 0,
    all_clicks: 0,
    meta_lpv: 0,
    product_view: g.product_viewed,
    revenue: 0,
    product_view_direct: g.product_viewed_direct,
    direct_cart: g.direct_cart,
    order_click: g.order_click,
    checkout_seeded: g.checkout_seeded,
    order_click_seeded: g.order_click_seeded,
  }));

  return { rows, unmatchedFunnel, organicRows };
}

const keyForLevel = (r: RawRow, level: Level): string =>
  level === "ad" ? r.ad : level === "adset" ? r.adset : level === "campaign" ? r.campaign : "GESAMT";

/** Aggregate raw rows into one FunnelAgg per entity at the given level. */
export function aggregate(rows: RawRow[], level: Level): FunnelAgg[] {
  const groups = new Map<string, FunnelAgg>();
  for (const r of rows) {
    const key = keyForLevel(r, level) || "(ohne Name)";
    let g = groups.get(key);
    if (!g) {
      g = blank(level, key);
      groups.set(key, g);
    }
    g.impressions += r.impressions;
    g.clicks += r.clicks;
    g.spend += r.spend;
    g.lp_cta += r.lp_cta;
    g.add_to_cart += r.add_to_cart;
    g.checkout += r.checkout;
    g.pay_submit += r.pay_submit;
    g.purchased += r.purchased;
  }
  const out = [...groups.values()];
  out.forEach(derive);
  return out.sort((a, b) => b.spend - a.spend);
}

function blank(level: Level, key: string): FunnelAgg {
  return {
    level, key,
    impressions: 0, clicks: 0, spend: 0, lp_cta: 0, add_to_cart: 0, checkout: 0, pay_submit: 0, purchased: 0,
    ctr: 0, cta_rate: 0, atc_rate: 0, co_rate: 0, ps_rate: 0, buy_rate: 0,
    cpm: 0, cpc: 0, cost_per_cta: 0, cost_per_purchase: 0,
  };
}

function derive(g: FunnelAgg): void {
  const safe = (n: number, d: number) => (d > 0 ? n / d : 0);
  g.ctr = safe(g.clicks, g.impressions);
  g.cta_rate = safe(g.lp_cta, g.clicks);
  g.atc_rate = safe(g.add_to_cart, g.lp_cta);
  g.co_rate = safe(g.checkout, g.add_to_cart);
  g.ps_rate = safe(g.pay_submit, g.checkout);
  g.buy_rate = safe(g.purchased, g.pay_submit);
  g.cpm = safe(g.spend, g.impressions) * 1000;
  g.cpc = safe(g.spend, g.clicks);
  g.cost_per_cta = safe(g.spend, g.lp_cta);
  g.cost_per_purchase = safe(g.spend, g.purchased);
  g.spend = round2(g.spend);
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
