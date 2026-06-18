// Server-only: pull daily ad-level delivery from the Meta Graph API.
// Needs an `ads_read` token (System User token recommended) in
// META_ADS_ACCESS_TOKEN. No-ops with a clear error if not configured.
import type { MetaDayRow } from "./types";

const GRAPH = "https://graph.facebook.com/v21.0";

function token(): string | undefined {
  return process.env.META_ADS_ACCESS_TOKEN;
}

function accountId(): string {
  // Default = Nutrasana ad account. Override per env if needed.
  return (process.env.META_AD_ACCOUNT_ID || "4534772073470536").replace(/^act_/, "");
}

// Meta returns spend/cpc as locale strings in some endpoints; insights via Graph
// API return plain decimal strings ("116.47"). Parse defensively.
function num(v: unknown): number {
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const n = parseFloat(v.replace(/\s/g, "").replace(",", "."));
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

type InsightRow = {
  date_start?: string;
  ad_id?: string;
  campaign_name?: string;
  adset_name?: string;
  ad_name?: string;
  impressions?: string;
  clicks?: string;
  inline_link_clicks?: string;
  spend?: string;
};

/**
 * Daily ad-level insights for [since, until] (inclusive, YYYY-MM-DD).
 * One row per ad per day. Follows pagination.
 */
export async function fetchMetaDays(since: string, until: string): Promise<MetaDayRow[]> {
  const t = token();
  if (!t) throw new Error("META_ADS_ACCESS_TOKEN not configured");

  const params = new URLSearchParams({
    level: "ad",
    time_increment: "1",
    time_range: JSON.stringify({ since, until }),
    fields: [
      "ad_id",
      "campaign_name",
      "adset_name",
      "ad_name",
      "impressions",
      "clicks",
      "inline_link_clicks",
      "spend",
    ].join(","),
    limit: "500",
    access_token: t,
  });

  const rows: MetaDayRow[] = [];
  let url: string | null = `${GRAPH}/act_${accountId()}/insights?${params.toString()}`;
  let guard = 0;

  while (url && guard++ < 50) {
    const res: Response = await fetch(url);
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Meta insights ${res.status}: ${body.slice(0, 300)}`);
    }
    const json = (await res.json()) as { data?: InsightRow[]; paging?: { next?: string } };
    for (const r of json.data ?? []) {
      rows.push({
        date: r.date_start ?? since,
        adId: r.ad_id ?? "",
        campaign: r.campaign_name ?? "",
        adset: r.adset_name ?? "",
        ad: r.ad_name ?? "",
        impressions: num(r.impressions),
        // inline_link_clicks = the outbound click to the LP, which is what the
        // funnel actually depends on. Fall back to clicks if missing.
        clicks: num(r.inline_link_clicks ?? r.clicks),
        spend: num(r.spend),
      });
    }
    url = json.paging?.next ?? null;
  }

  return rows;
}
