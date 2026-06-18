// Format the briefing as a compact Telegram message (plain text, no Markdown
// so ad names with special chars never break parsing).
import type { FunnelAgg } from "./types";
import type { Reco } from "./recommend";

const eur = (n: number) => `${n.toFixed(2).replace(".", ",")} €`;
const pct = (n: number) => `${(n * 100).toFixed(1)}%`;
const int = (n: number) => Math.round(n).toLocaleString("de-DE");

function funnelLine(g: FunnelAgg): string {
  return (
    `${int(g.impressions)} Views → ${int(g.clicks)} Klicks (CTR ${pct(g.ctr)}) → ` +
    `${int(g.lp_cta)} LP-CTA → ${int(g.add_to_cart)} Warenkorb → ${int(g.purchased)} Gekauft`
  );
}

export function formatBriefing(args: {
  dateLabel: string;
  yTotal: FunnelAgg;
  wTotal: FunnelAgg;
  wAds: FunnelAgg[];
  signals: Reco[];
  narrative: string | null;
  sheetLink?: string;
  unmatchedNote?: string;
}): string {
  const { dateLabel, yTotal, wTotal, wAds, signals, narrative, sheetLink, unmatchedNote } = args;

  const topAds = [...wAds]
    .filter((a) => a.impressions > 0)
    .sort((a, b) => b.spend - a.spend)
    .slice(0, 5);

  const lines: string[] = [];
  lines.push(`📊 Ads-Briefing — ${dateLabel}`);
  lines.push("");
  lines.push(`▸ GESTERN  (Spend ${eur(yTotal.spend)})`);
  lines.push(`  ${funnelLine(yTotal)}`);
  if (yTotal.purchased > 0) lines.push(`  Kosten/Kauf: ${eur(yTotal.cost_per_purchase)}`);
  lines.push("");
  lines.push(`▸ LETZTE 7 TAGE  (Spend ${eur(wTotal.spend)})`);
  lines.push(`  ${funnelLine(wTotal)}`);
  lines.push(
    `  CPC ${eur(wTotal.cpc)} · Kosten/LP-CTA ${eur(wTotal.cost_per_cta)}` +
      (wTotal.purchased > 0 ? ` · Kosten/Kauf ${eur(wTotal.cost_per_purchase)}` : "")
  );
  lines.push("");

  if (topAds.length) {
    lines.push("▸ TOP-ADS (7d, nach Spend)");
    for (const a of topAds) {
      lines.push(
        `  • ${a.key}: ${eur(a.spend)} | CTR ${pct(a.ctr)} | ` +
          `${int(a.lp_cta)} CTA | ${int(a.add_to_cart)} WK | ${int(a.purchased)} Kauf`
      );
    }
    lines.push("");
  }

  if (narrative) {
    lines.push("▸ EMPFEHLUNG (Claude)");
    lines.push(narrative);
    lines.push("");
  } else if (signals.length) {
    lines.push("▸ EMPFEHLUNGEN");
    for (const s of signals) lines.push(`  [${s.tag}] ${s.text}`);
    lines.push("");
  }

  if (unmatchedNote) lines.push(unmatchedNote);
  if (sheetLink) lines.push(`📄 Dashboard: ${sheetLink}`);

  return lines.join("\n");
}
