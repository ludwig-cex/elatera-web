// One-off pipeline validation with REAL pulled data (Meta 7d + PostHog 7d).
// Run: npx tsx scripts/test-briefing.ts
import { buildRawRows, aggregate } from "../src/lib/briefing/build";
import { ruleSignals } from "../src/lib/briefing/recommend";
import { formatBriefing } from "../src/lib/briefing/format";
import type { MetaDayRow, FunnelDayRow } from "../src/lib/briefing/types";

const D = "2026-06-17";

// Meta last_7d, ad level (via MCP). clicks = total clicks (cron uses link clicks).
const meta: MetaDayRow[] = [
  ["Mobilisana_Knie_Hotspot", "120243947872370009", 1006, 111, 37.21],
  ["Mobilisana_Gelenkschmerzen_Text", "120243947872400009", 927, 144, 52.51],
  ["Mobilisana_Textoverlay_Christina", "120243947872380009", 258, 26, 17.03],
  ["Arthrose LP4 – Ad2 Redaktionell", "120244371985380009", 100, 10, 2.78],
  ["Mobilisana_Apotheke", "120243948418950009", 32, 1, 0.99],
  ["Arthrose LP4 – Ad1 Community", "120244371974240009", 23, 3, 1.64],
  ["Arthrose LP4 – Ad3 Agitation", "120244372014500009", 19, 7, 2.82],
  ["Mobilisana_UGC_Schild", "120243915373460009", 16, 1, 1.07],
  ["Mobilisana_Preisvergleich", "120243947872390009", 9, 0, 0.25],
  ["Mobilisana_Anatomie_Knie", "120243947872360009", 6, 0, 0.17],
].map(([ad, adId, impressions, clicks, spend]) => ({
  date: D, adId: adId as string, campaign: "Mobilisana_test", adset: "",
  ad: ad as string, impressions: impressions as number, clicks: clicks as number, spend: spend as number,
  reach: 0, allClicks: 0, metaLpv: 0, revenue: 0,
}));

// PostHog 7d funnel rows: [utm_content, utm_term, lp_cta, atc, bought].
// Mix of: new standard (name + id), url-encoded dup, and legacy id-in-content.
const funnel: FunnelDayRow[] = [
  ["Mobilisana_Gelenkschmerzen_Text", "120243947872400009", 35, 1, 0], // new standard
  ["Mobilisana_Knie_Hotspot", "120243947872370009", 30, 4, 0], // new standard
  ["Arthrose LP4 – Ad1 Community", "", 3, 0, 0],
  ["Mobilisana_Textoverlay_Christina", "", 3, 1, 0],
  ["Arthrose LP4 – Ad3 Agitation", "", 3, 0, 0],
  ["Arthrose LP4 – Ad2 Redaktionell", "120244371985380009", 1, 1, 0], // name + id
  ["120244371985380009", "", 1, 0, 0], // legacy id-in-content → must merge into the row above
  ["Arthrose LP4 %E2%80%93 Ad1 Community", "", 0, 0, 0], // url-encoded dup of Ad1
].map(([ad, adIdTag, lp_cta, atc, bought]) => ({
  date: D, source: "fb", campaign: "Mobilisana_test", ad: ad as string, adIdTag: adIdTag as string,
  product_viewed: 0, product_viewed_direct: 0, lp_cta: lp_cta as number, add_to_cart: atc as number, checkout: 0, pay_submit: 0, purchased: bought as number,
}));

const { rows, unmatchedFunnel } = buildRawRows(meta, funnel);
const total = aggregate(rows, "account")[0];
const ads = aggregate(rows, "ad");
const signals = ruleSignals(ads, total);

console.log("=== JOIN CHECK (pro Ad) ===");
for (const r of rows) console.log(`${r.ad.padEnd(34)} impr=${r.impressions} clk=${r.clicks} cta=${r.lp_cta} wk=${r.add_to_cart} kauf=${r.purchased}`);
console.log(`\nunmatched funnel groups: ${unmatchedFunnel.length}`);
console.log("\n=== BRIEFING (Telegram-Format) ===\n");
console.log(formatBriefing({
  dateLabel: D, yTotal: total, wTotal: total, wAds: ads, signals, narrative: null,
  sheetLink: "https://docs.google.com/…", unmatchedNote: undefined,
}));
