// Day-to-day & week-to-date comparison for the daily Telegram review.
// Stichtag = last full day (yesterday). Week = Monday-of-Stichtag … Stichtag,
// compared to the same weekday span one week earlier (so Monday shows the full
// finished week, and today's incomplete data is never used). All on the
// ADVERTORIAL-PATH numbers from the Rohdaten (product_view already restricted).
import type { RawRow } from "./types";

export type DailyAgg = {
  impressions: number; clicks: number; spend: number; landings: number;
  lp_cta: number; product_view: number; add_to_cart: number; checkout: number;
  pay_submit: number; purchased: number; revenue: number; product_view_direct: number;
};

export type Comparison = {
  stichtag: string; vortag: string;
  weekStart: string; prevWeekStart: string; prevWeekEnd: string;
  dayCur: DailyAgg; dayPrev: DailyAgg;
  weekCur: DailyAgg; weekPrev: DailyAgg;
};

const blank = (): DailyAgg => ({
  impressions: 0, clicks: 0, spend: 0, landings: 0, lp_cta: 0, product_view: 0,
  add_to_cart: 0, checkout: 0, pay_submit: 0, purchased: 0, revenue: 0, product_view_direct: 0,
});

function sumRange(rows: RawRow[], from: string, to: string): DailyAgg {
  const a = blank();
  for (const r of rows) {
    if (r.date < from || r.date > to) continue;
    a.impressions += r.impressions; a.clicks += r.clicks; a.spend += r.spend;
    a.landings += r.landings; a.lp_cta += r.lp_cta; a.product_view += r.product_view;
    a.add_to_cart += r.add_to_cart; a.checkout += r.checkout; a.pay_submit += r.pay_submit;
    a.purchased += r.purchased; a.revenue += r.revenue; a.product_view_direct += r.product_view_direct;
  }
  return a;
}

const ymd = (d: Date) => d.toISOString().slice(0, 10);
const parse = (s: string) => { const [y, m, d] = s.split("-").map(Number); return new Date(Date.UTC(y, m - 1, d)); };
export function addDays(s: string, n: number): string { const d = parse(s); d.setUTCDate(d.getUTCDate() + n); return ymd(d); }
function mondayOf(s: string): string { const d = parse(s); const off = (d.getUTCDay() + 6) % 7; return addDays(s, -off); }

export function buildComparison(rows: RawRow[], stichtag: string): Comparison {
  const vortag = addDays(stichtag, -1);
  const weekStart = mondayOf(stichtag);
  const prevWeekStart = addDays(weekStart, -7);
  const prevWeekEnd = addDays(stichtag, -7);
  return {
    stichtag, vortag, weekStart, prevWeekStart, prevWeekEnd,
    dayCur: sumRange(rows, stichtag, stichtag),
    dayPrev: sumRange(rows, vortag, vortag),
    weekCur: sumRange(rows, weekStart, stichtag),
    weekPrev: sumRange(rows, prevWeekStart, prevWeekEnd),
  };
}

// ---- derived rates ----
const div = (n: number, d: number) => (d > 0 ? n / d : 0);
export const rates = (a: DailyAgg) => ({
  ctr: div(a.clicks, a.impressions),
  cta: div(a.lp_cta, a.landings),
  pv: div(a.product_view, a.lp_cta),
  atc: div(a.add_to_cart, a.product_view),
  cpc: div(a.spend, a.clicks),
  cac: div(a.spend, a.pay_submit),
});

// ---- formatting helpers ----
const de = (n: number, d = 0) => n.toLocaleString("de-DE", { minimumFractionDigits: d, maximumFractionDigits: d });
const eur = (n: number) => `${de(n, 2)} €`;
const pct = (n: number) => `${de(n * 100, 1)} %`;
function dPctCount(cur: number, prev: number): string {
  if (prev === 0) return cur === 0 ? "±0" : `+${cur}`;
  const p = ((cur - prev) / prev) * 100;
  return `${p >= 0 ? "+" : ""}${de(p, 0)} %`;
}
const dPP = (cur: number, prev: number) => `${cur - prev >= 0 ? "+" : ""}${de((cur - prev) * 100, 1)} pp`;
const dEur = (cur: number, prev: number) => `${cur - prev >= 0 ? "+" : "−"}${de(Math.abs(cur - prev), 2)} €`;
const pad = (s: string, n: number) => (s.length >= n ? s : s + " ".repeat(n - s.length));
const padL = (s: string, n: number) => (s.length >= n ? s : " ".repeat(n - s.length) + s);

const WD = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
const dm = (s: string) => `${s.slice(8, 10)}.${s.slice(5, 7)}.`;
const wdLabel = (s: string) => `${WD[parse(s).getUTCDay()]} ${dm(s)}`;

// One cur-vs-prev funnel table (HTML <pre> body, monospace) — used for Tag & Woche.
export function funnelTable(cur: DailyAgg, prev: DailyAgg): string {
  const rc = rates(cur), rp = rates(prev);
  const rows: [string, string, string][] = [
    ["Impressions", de(cur.impressions), dPctCount(cur.impressions, prev.impressions)],
    ["Link-Klicks", de(cur.clicks), dPctCount(cur.clicks, prev.clicks)],
    ["  CTR", pct(rc.ctr), dPP(rc.ctr, rp.ctr)],
    ["Landungen", de(cur.landings), dPctCount(cur.landings, prev.landings)],
    ["CTA → Shop", de(cur.lp_cta), dPctCount(cur.lp_cta, prev.lp_cta)],
    ["  CTA-Rate", pct(rc.cta), dPP(rc.cta, rp.cta)],
    ["Produktansicht", de(cur.product_view), dPctCount(cur.product_view, prev.product_view)],
    ["Warenkorb", de(cur.add_to_cart), dPctCount(cur.add_to_cart, prev.add_to_cart)],
    ["Bestellt", de(cur.pay_submit), dPctCount(cur.pay_submit, prev.pay_submit)],
    ["Gekauft", de(cur.purchased), dPctCount(cur.purchased, prev.purchased)],
    ["Spend", eur(cur.spend), dEur(cur.spend, prev.spend)],
    ["  CPC", eur(rc.cpc), dEur(rc.cpc, rp.cpc)],
  ];
  return rows.map(([l, v, d]) => `${pad(l, 15)}${padL(v, 9)}  ${d}`).join("\n");
}

// Full Telegram message (HTML parse_mode): ① Tag-Tabelle + ② Wochen-Tabelle.
export function formatDailyMessage(c: Comparison, dashboardLink?: string): string {
  const parts = [
    `📊 <b>Ads-Auswertung — ${wdLabel(c.stichtag)}</b>`,
    `<b>① Tag — ${wdLabel(c.stichtag)} vs. ${wdLabel(c.vortag)}</b>\n<pre>${funnelTable(c.dayCur, c.dayPrev)}</pre>`,
    `<b>② Woche — ${dm(c.weekStart)}–${dm(c.stichtag)} vs. Vorwoche ${dm(c.prevWeekStart)}–${dm(c.prevWeekEnd)}</b>\n<pre>${funnelTable(c.weekCur, c.weekPrev)}</pre>`,
  ];
  if (dashboardLink) parts.push(`📄 ${dashboardLink}`);
  return parts.join("\n\n");
}
