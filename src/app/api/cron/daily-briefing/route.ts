import { after } from "next/server";
import { notifyTelegram } from "@/lib/notify";
import { fetchMetaDays } from "@/lib/briefing/meta";
import { fetchFunnelDays, fetchLandings } from "@/lib/briefing/posthog";
import { buildRawRows, aggregate } from "@/lib/briefing/build";
import { pushRows } from "@/lib/briefing/sheet";
import { ruleSignals, claudeNarrative } from "@/lib/briefing/recommend";
import { formatBriefing } from "@/lib/briefing/format";
import type { FunnelAgg } from "@/lib/briefing/types";

export const runtime = "nodejs";
export const maxDuration = 60;

// Daily ad-performance briefing.
//   - Vercel Cron hits this GET with `Authorization: Bearer <CRON_SECRET>`.
//   - Pulls Meta delivery + PostHog funnel for the last N days, joins per ad,
//     upserts daily raw rows into the Google Sheet, computes yesterday/7d
//     aggregates + recommendations, and pushes a briefing to Telegram.
//   - `?days=30` backfills history; `?dry=1` skips the Telegram push (returns JSON only).

function berlinDay(offsetDays: number): string {
  // Today (or today-offset) as a YYYY-MM-DD calendar date in Europe/Berlin.
  const now = new Date();
  const berlin = new Date(now.getTime() + tzOffsetMs(now, "Europe/Berlin"));
  berlin.setUTCDate(berlin.getUTCDate() - offsetDays);
  return berlin.toISOString().slice(0, 10);
}

function tzOffsetMs(date: Date, tz: string): number {
  const s = date.toLocaleString("en-US", { timeZone: tz });
  return new Date(s).getTime() - new Date(date.toLocaleString("en-US", { timeZone: "UTC" })).getTime();
}

export async function GET(request: Request) {
  // Auth: Vercel Cron sends the secret as a Bearer token.
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (secret && auth !== `Bearer ${secret}`) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const days = Math.min(Math.max(parseInt(url.searchParams.get("days") || "7", 10), 1), 90);
  const dry = url.searchParams.get("dry") === "1";
  // ?includeToday=1 pulls through TODAY (partial) instead of stopping at
  // yesterday — for a mid-day snapshot. Tomorrow's cron overwrites it (upsert).
  const includeToday = url.searchParams.get("includeToday") === "1";

  const until = berlinDay(includeToday ? 0 : 1); // today or yesterday
  const since = berlinDay(days); // N days back (inclusive window of `days`)
  const windowSince = berlinDay(7); // for the 7d aggregates regardless of backfill size

  try {
    const [meta, funnel, landings] = await Promise.all([
      fetchMetaDays(since, until),
      fetchFunnelDays(since, until),
      fetchLandings(since, until),
    ]);

    const { rows, unmatchedFunnel } = buildRawRows(meta, funnel, landings);

    // Write everything we fetched to the sheet (idempotent upsert by date).
    const sheet = await pushRows(rows);

    // Aggregates for the briefing.
    const yRows = rows.filter((r) => r.date === until);
    const wRows = rows.filter((r) => r.date >= windowSince);
    const yTotal = ensureTotal(aggregate(yRows, "account")[0]);
    const wTotal = ensureTotal(aggregate(wRows, "account")[0]);
    const wAds = aggregate(wRows, "ad");

    const signals = ruleSignals(wAds, wTotal);
    const narrative = await claudeNarrative({
      period: "letzte 7 Tage",
      total: wTotal,
      topAds: wAds.slice(0, 6),
      signals,
    });

    const unmatchedBuys = unmatchedFunnel.reduce((s, f) => s + f.purchased, 0);
    const unmatchedNote =
      unmatchedFunnel.length > 0
        ? `ℹ️ ${unmatchedFunnel.length} Funnel-Gruppen ohne Ad-Zuordnung (organisch/direkt${unmatchedBuys ? `, ${unmatchedBuys} Käufe` : ""}).`
        : undefined;

    const message = formatBriefing({
      dateLabel: until,
      yTotal,
      wTotal,
      wAds,
      signals,
      narrative,
      sheetLink: process.env.BRIEFING_DASHBOARD_LINK,
      unmatchedNote,
    });

    if (!dry) after(() => notifyTelegram(message));

    return Response.json({
      ok: true,
      window: { since, until, days },
      counts: { metaRows: meta.length, funnelRows: funnel.length, rawRows: rows.length },
      sheet,
      preview: message,
    });
  } catch (err) {
    const msg = (err as Error)?.message ?? "unknown";
    if (!dry) after(() => notifyTelegram(`⚠️ Ads-Briefing fehlgeschlagen: ${msg}`));
    return Response.json({ ok: false, error: msg }, { status: 500 });
  }
}

// aggregate([]) returns an empty array; guard the account total against that.
function ensureTotal(g: FunnelAgg | undefined): FunnelAgg {
  return (
    g ?? {
      level: "account", key: "GESAMT",
      impressions: 0, clicks: 0, spend: 0, lp_cta: 0, add_to_cart: 0, checkout: 0, pay_submit: 0, purchased: 0,
      ctr: 0, cta_rate: 0, atc_rate: 0, co_rate: 0, ps_rate: 0, buy_rate: 0,
      cpm: 0, cpc: 0, cost_per_cta: 0, cost_per_purchase: 0,
    }
  );
}
