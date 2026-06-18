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
};

// PostHog funnel counts for one day, keyed by the ad name carried in utm_content.
export type FunnelDayRow = {
  date: string; // YYYY-MM-DD
  source: string; // fb | ig | ...
  campaign: string; // utm_campaign (= LP variant, e.g. Mobilisana_test-lp3)
  ad: string; // utm_content (= Meta ad name)
  adIdTag: string; // utm_term (= Meta ad id, the stable join key; "" for legacy rows)
  product_viewed: number;
  lp_cta: number; // advertorial_cta_click
  add_to_cart: number;
  purchased: number; // payment_authorized
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
  purchased: number;
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
  purchased: number;
  // derived
  ctr: number; // clicks / impressions
  cta_rate: number; // lp_cta / clicks
  atc_rate: number; // add_to_cart / lp_cta
  buy_rate: number; // purchased / add_to_cart
  cpm: number; // spend / impressions * 1000
  cpc: number; // spend / clicks
  cost_per_cta: number;
  cost_per_purchase: number;
};
