// Push raw rows to the Google Sheet via a deployed Apps Script web app.
// The script upserts by date (idempotent re-runs) into the "Rohdaten" tab.
// No-ops cleanly if BRIEFING_SHEET_URL / BRIEFING_SHEET_SECRET are unset.
import type { RawRow } from "./types";

// Column order MUST match the header the Apps Script writes (see
// scripts/apps-script/Code.gs and docs/DAILY-BRIEFING.md).
export const RAW_HEADER = [
  "date", "campaign", "adset", "ad", "source",
  "impressions", "clicks", "spend",
  "lp_cta", "add_to_cart", "checkout_clicked", "payment_submitted", "purchased",
  "advertorial_landings",
  "reach", "all_clicks", "meta_lpv", "product_view", "revenue",
] as const;

export function rowToArray(r: RawRow): (string | number)[] {
  return [
    r.date, r.campaign, r.adset, r.ad, r.source,
    r.impressions, r.clicks, r.spend,
    r.lp_cta, r.add_to_cart, r.checkout, r.pay_submit, r.purchased,
    r.landings,
    r.reach, r.all_clicks, r.meta_lpv, r.product_view, r.revenue,
  ];
}

export async function pushRows(rows: RawRow[]): Promise<{ ok: boolean; detail: string }> {
  const url = process.env.BRIEFING_SHEET_URL;
  const secret = process.env.BRIEFING_SHEET_SECRET;
  if (!url || !secret) return { ok: false, detail: "sheet_not_configured" };
  if (rows.length === 0) return { ok: true, detail: "no_rows" };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      secret,
      header: RAW_HEADER,
      rows: rows.map(rowToArray),
    }),
    // Apps Script web apps answer behind a redirect; follow it.
    redirect: "follow",
  });
  const text = await res.text();
  if (!res.ok) return { ok: false, detail: `sheet_${res.status}: ${text.slice(0, 200)}` };
  return { ok: true, detail: text.slice(0, 200) };
}
