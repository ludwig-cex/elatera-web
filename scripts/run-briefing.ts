// Local end-to-end runner — mirrors the cron route but standalone.
// Loads .env.local, fetches Meta + PostHog, joins, writes to the Sheet, prints
// the briefing. Usage: npx tsx scripts/run-briefing.ts [days]   (default 14)
import { readFileSync } from "node:fs";
import { fetchMetaDays } from "../src/lib/briefing/meta";
import { fetchFunnelDays, fetchLandings } from "../src/lib/briefing/posthog";
import { buildRawRows, aggregate } from "../src/lib/briefing/build";
import { pushRows } from "../src/lib/briefing/sheet";
import { ruleSignals } from "../src/lib/briefing/recommend";
import { formatBriefing } from "../src/lib/briefing/format";

// Minimal .env.local loader (no dep). Does not override already-set vars.
for (const line of readFileSync(new URL("../.env.local", import.meta.url), "utf8").split("\n")) {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}

function berlinDay(offset: number): string {
  const now = new Date();
  const berlin = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Berlin" }));
  berlin.setDate(berlin.getDate() - offset);
  return berlin.toISOString().slice(0, 10);
}

const days = Math.min(Math.max(parseInt(process.argv[2] || "14", 10), 1), 90);
const until = berlinDay(1);
const since = berlinDay(days);
const windowSince = berlinDay(7);

(async () => {
  console.log(`Zeitraum: ${since} … ${until} (${days} Tage)\n`);
  const [meta, funnel, landings] = await Promise.all([
    fetchMetaDays(since, until), fetchFunnelDays(since, until), fetchLandings(since, until),
  ]);
  console.log(`Meta-Zeilen: ${meta.length} · PostHog-Zeilen: ${funnel.length} · Landungen-Zeilen: ${landings.length}`);

  const { rows, unmatchedFunnel } = buildRawRows(meta, funnel, landings);
  const u = unmatchedFunnel.reduce(
    (a, g) => ({ cta: a.cta + g.lp_cta, wk: a.wk + g.add_to_cart, kauf: a.kauf + g.purchased }),
    { cta: 0, wk: 0, kauf: 0 }
  );
  console.log(
    `Raw-Zeilen: ${rows.length} · unmatched Funnel-Gruppen: ${unmatchedFunnel.length} ` +
      `(nicht-Ad-zugeordnet: ${u.cta} CTA, ${u.wk} WK, ${u.kauf} Kauf — organisch/direkt)`
  );

  const sheet = await pushRows(rows);
  console.log(`Sheet: ${JSON.stringify(sheet)}\n`);

  const wRows = rows.filter((r) => r.date >= windowSince);
  const yRows = rows.filter((r) => r.date === until);
  const wTotal = aggregate(wRows, "account")[0];
  const yTotal = aggregate(yRows, "account")[0];
  const wAds = aggregate(wRows, "ad");
  const signals = ruleSignals(wAds, wTotal ?? blankTotal());

  console.log(
    formatBriefing({
      dateLabel: until,
      yTotal: yTotal ?? blankTotal(),
      wTotal: wTotal ?? blankTotal(),
      wAds,
      signals,
      narrative: null,
      sheetLink: process.env.BRIEFING_DASHBOARD_LINK,
    })
  );
})().catch((e) => {
  console.error("FEHLER:", e.message);
  process.exit(1);
});

function blankTotal() {
  return {
    level: "account" as const, key: "GESAMT",
    impressions: 0, clicks: 0, spend: 0, lp_cta: 0, add_to_cart: 0, checkout: 0, pay_submit: 0, purchased: 0,
    ctr: 0, cta_rate: 0, atc_rate: 0, co_rate: 0, ps_rate: 0, buy_rate: 0, cpm: 0, cpc: 0, cost_per_cta: 0, cost_per_purchase: 0,
  };
}
