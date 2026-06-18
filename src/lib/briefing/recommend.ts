// Turn the aggregated funnel into concrete recommendations.
// Always produces rule-based signals (no external dependency). If
// ANTHROPIC_API_KEY is set, additionally asks Claude for a sharper narrative
// (new-ad ideas, LP A/B tests) grounded in the same numbers.
import type { FunnelAgg } from "./types";

export type Reco = { tag: string; text: string };

const pct = (n: number) => `${(n * 100).toFixed(1)}%`;
const eur = (n: number) => `${n.toFixed(2).replace(".", ",")} €`;

// Heuristic thresholds — deliberately conservative; tune as data grows.
const TH = {
  minImpr: 300, // ignore ads with too little delivery to judge
  lowCtr: 0.008, // < 0.8% CTR = weak hook/creative
  goodCtr: 0.015,
  lowCtaRate: 0.15, // clicks that don't reach the LP CTA = ad/LP mismatch
  lowAtcRate: 0.2, // CTA clickers who don't add to cart = offer/price friction
  spendNoBuy: 25, // € spent on an ad with 0 purchases = pause candidate
};

/**
 * Rule-based signals over the per-ad aggregation for a period (usually 7d).
 * `total` is the account aggregate for the same period, used to diagnose the
 * single biggest funnel drop-off and to pick the right success metric when the
 * intent-capture storefront produces few/no real purchases.
 */
export function ruleSignals(ads: FunnelAgg[], total: FunnelAgg): Reco[] {
  const out: Reco[] = [];
  const judged = ads.filter((a) => a.impressions >= TH.minImpr);
  if (judged.length === 0) return out;

  // When real purchases aren't flowing yet (out-of-stock / intent model), judge
  // and rank ads on add-to-cart instead of purchases; success = ATC, else CTA.
  const buysTracked = total.purchased > 0;
  const successOf = (a: FunnelAgg) =>
    buysTracked ? a.purchased : a.add_to_cart > 0 ? a.add_to_cart : a.lp_cta;
  const costOf = (a: FunnelAgg) => {
    const s = successOf(a);
    return s > 0 ? a.spend / s : Number.POSITIVE_INFINITY;
  };
  const ranked = [...judged].sort((a, b) => costOf(a) - costOf(b));
  const best = ranked[0];
  const successLabel = buysTracked ? "Kauf" : "Warenkorb-/CTA-Aktion";

  // 1) Biggest funnel drop-off across the whole account → where to focus.
  out.push(bottleneck(total));

  // 2) Scale the most efficient creative.
  if (best && successOf(best) > 0)
    out.push({
      tag: "SKALIEREN",
      text: `Bestes Creative „${best.key}": ${eur(costOf(best))}/${successLabel}, CTR ${pct(best.ctr)}. Budget erhöhen und 2–3 Varianten (Hook/Thumbnail/Opener) als neue Ads ableiten.`,
    });

  // 3) Per-ad diagnosis (one flag per ad, the most pressing).
  for (const a of judged) {
    if (a.ctr < TH.lowCtr) {
      out.push({
        tag: "CREATIVE",
        text: `„${a.key}": schwache CTR ${pct(a.ctr)} (Ziel >${pct(TH.goodCtr)}). Hook/Thumbnail in den ersten 3 Sek. testen oder pausieren.`,
      });
    } else if (a.cta_rate < TH.lowCtaRate && a.clicks >= 30) {
      out.push({
        tag: "AD↔LP",
        text: `„${a.key}": gute Klicks, aber nur ${pct(a.cta_rate)} erreichen den LP-CTA. Ad-Versprechen ↔ LP-Headline angleichen (Message Match).`,
      });
    } else if (a.atc_rate < TH.lowAtcRate && a.lp_cta >= 20) {
      out.push({
        tag: "LP A/B",
        text: `„${a.key}": ${a.lp_cta} CTA-Klicks, aber nur ${pct(a.atc_rate)} → Warenkorb. A/B-Test auf Preis-Anker / Trust-Badges / CTA-Text.`,
      });
    } else if (a !== best && a.spend >= TH.spendNoBuy && successOf(a) === 0) {
      out.push({
        tag: "UMSCHICHTEN",
        text: `„${a.key}": ${eur(a.spend)} ohne ${successLabel}. Budget Richtung „${best?.key ?? "Top-Ad"}" verschieben.`,
      });
    }
  }

  // De-dup by text, cap to keep the briefing readable.
  const seen = new Set<string>();
  return out.filter((r) => !seen.has(r.text) && seen.add(r.text)).slice(0, 8);
}

// Identify the weakest single funnel transition for the whole account. Only
// steps with enough upstream volume are eligible, so a 0% rate off a handful of
// events (e.g. 7 carts) doesn't masquerade as the headline bottleneck.
const MIN_DENOM = 20;
function bottleneck(t: FunnelAgg): Reco {
  const steps = [
    { name: "Ad→Klick (CTR)", rate: t.ctr, denom: t.impressions, hint: "Creatives/Hooks testen, Zielgruppe schärfen." },
    { name: "Klick→LP-CTA", rate: t.cta_rate, denom: t.clicks, hint: "Message Match Ad↔LP, Ladezeit & Above-the-fold prüfen." },
    { name: "LP-CTA→Warenkorb", rate: t.atc_rate, denom: t.lp_cta, hint: "Angebot/Preis-Anker, Produktklarheit, weniger Reibung im Add-to-Cart." },
    { name: "Warenkorb→Bezahlen", rate: t.co_rate, denom: t.add_to_cart, hint: "Sticky-CTA & 'Zur Kasse' prominenter, Versand/Trust früh zeigen, Express-Wallets oben." },
    { name: "Bezahlen→Kauf", rate: t.buy_rate, denom: t.checkout, hint: "Checkout-Reibung: Felder reduzieren, Express-Pay, Formular auf Mobile straffen." },
  ];
  const eligible = steps.filter((s) => s.denom >= MIN_DENOM);
  const pool = eligible.length ? eligible : steps;
  const worst = pool.reduce((m, s) => (s.rate < m.rate ? s : m), pool[0]);
  return {
    tag: "BOTTLENECK",
    text: `Größter Funnel-Verlust: ${worst.name} (${pct(worst.rate)}, n=${Math.round(worst.denom)}). ${worst.hint}`,
  };
}

/**
 * Optional Claude enrichment. Returns null if ANTHROPIC_API_KEY is unset or the
 * call fails — the rule-based signals always stand on their own.
 */
export async function claudeNarrative(
  context: { period: string; total: FunnelAgg; topAds: FunnelAgg[]; signals: Reco[] }
): Promise<string | null> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-opus-4-8",
        max_tokens: 700,
        system:
          "Du bist Performance-Marketing-Analyst für eine deutsche NEM-Marke (Mobilisana, Gelenke). " +
          "Antworte auf Deutsch, knapp, konkret, umsetzbar. Keine Floskeln. " +
          "Gib max. 4 priorisierte Maßnahmen: neue Ads, LP-Anpassungen, A/B-Tests, Budget. " +
          "Beziehe dich auf die echten Zahlen.",
        messages: [
          { role: "user", content: `Daten (${context.period}):\n${JSON.stringify(context, null, 0)}` },
        ],
      }),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { content?: { text?: string }[] };
    return json.content?.[0]?.text?.trim() ?? null;
  } catch {
    return null;
  }
}
