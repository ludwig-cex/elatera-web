// Shared types for the daily ad-performance briefing pipeline.
// One funnel row = one entity (ad / adset / campaign / total) for one period.

export type Period = "yesterday" | "last_7d";

export type Level = "ad" | "adset" | "campaign" | "account";

// A single day of Meta delivery for one ad (level=ad, time_increment=1).
export type MetaDayRow = {
  date: string; // YYYY-MM-DD
  adId: string; // Meta ad id (some ads carry this in utm_content instead of the name)
  campaign: string;
  adset: string;
  ad: string;
  impressions: number;
  clicks: number; // inline_link_clicks (the click that actually leaves to the LP)
  spend: number; // EUR
  reach: number; // unique people reached (impressions / reach = frequency)
  allClicks: number; // total clicks incl. likes/profile/expand (the `clicks` field)
  metaLpv: number; // Meta's own landing_page_view action (pixel-based "arrived")
  revenue: number; // purchase value from the Meta pixel (for ROAS); 0 in validation
};

// PostHog funnel counts for one day, keyed by the ad name carried in utm_content.
export type FunnelDayRow = {
  date: string; // YYYY-MM-DD
  source: string; // fb | ig | ...
  campaign: string; // utm_campaign (= LP variant, e.g. Mobilisana_test-lp3)
  ad: string; // utm_content (= Meta ad name)
  adIdTag: string; // utm_term (= Meta ad id, the stable join key; "" for legacy rows)
  product_viewed: number; // ADVERTORIAL-PATH only (person did advertorial_cta_click)
  product_viewed_direct: number; // direct-to-shop (no CTA) — shown separately
  lp_cta: number; // advertorial_cta_click
  add_to_cart: number;
  checkout: number; // checkout_clicked ("Zur Kasse")
  pay_submit: number; // payment_submitted ("Jetzt zahlungspflichtig bestellen")
  purchased: number; // payment_authorized
  direct_cart: number; // direct_cart_entry — Auto-Warenkorb (?addtocart=), Teilmenge von add_to_cart; zählt auch als product_viewed
  order_click: number; // Bestell-Klick INKL. retro: payment_submitted ODER Autocapture-Klick auf „zahlungspflichtig bestellen" (durchgehend ab Launch)
  checkout_seeded: number; // checkout_clicked der Seed-Kohorte (direct_cart_entry-Personen)
  order_click_seeded: number; // order_click der Seed-Kohorte
};

// The unified per-day-per-ad raw row that gets written to the "Rohdaten" sheet.
export type RawRow = {
  date: string;
  campaign: string;
  adset: string;
  ad: string;
  source: string;
  impressions: number;
  clicks: number;
  spend: number;
  lp_cta: number;
  add_to_cart: number;
  checkout: number;
  pay_submit: number;
  purchased: number;
  landings: number;
  // enrichment for the two-world dashboard (Meta delivery + ROAS + shop funnel)
  reach: number; // Meta unique reach
  all_clicks: number; // Meta total clicks (vs. link clicks in `clicks`)
  meta_lpv: number; // Meta landing_page_view (pixel-based "arrived")
  product_view: number; // PostHog shop product_viewed, ADVERTORIAL-PATH only (inkl. Auto-Warenkorb)
  revenue: number; // EUR purchase value (for ROAS); 0 while validating
  product_view_direct: number; // direct-to-shop product views (no advertorial CTA)
  direct_cart: number; // Auto-Warenkorb (?addtocart=) — Teilmenge von add_to_cart
  order_click: number; // Bestell-Klick inkl. retro (payment_submitted ODER Autocapture-Button), durchgehend ab Launch
  checkout_seeded: number; // Kasse der Seed-Kohorte (Teilmenge von checkout)
  order_click_seeded: number; // Bestell-Klick der Seed-Kohorte (Teilmenge von order_click)
};

// Aggregated funnel for a set of raw rows (a period × level group).
export type FunnelAgg = {
  level: Level;
  key: string; // entity name (ad/adset/campaign) or "GESAMT"
  impressions: number;
  clicks: number;
  spend: number;
  lp_cta: number;
  add_to_cart: number;
  checkout: number;
  pay_submit: number;
  purchased: number;
  // derived
  ctr: number; // clicks / impressions
  cta_rate: number; // lp_cta / clicks
  atc_rate: number; // add_to_cart / lp_cta
  co_rate: number; // checkout / add_to_cart
  ps_rate: number; // pay_submit / checkout
  buy_rate: number; // purchased / pay_submit
  cpm: number; // spend / impressions * 1000
  cpc: number; // spend / clicks
  cost_per_cta: number;
  cost_per_purchase: number;
};
