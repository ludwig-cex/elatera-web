import { notifyTelegram, notifyTelegramPhoto } from "@/lib/notify";
import { fetchMetaDays } from "@/lib/briefing/meta";
import { fetchFunnelDays, fetchLandings } from "@/lib/briefing/posthog";
import { buildRawRows } from "@/lib/briefing/build";
import { buildComparison, formatDailyMessage, addDays, weekdayLabel } from "@/lib/briefing/daily";
import { renderDailyImage } from "@/lib/briefing/daily-image";

export const runtime = "nodejs";
export const maxDuration = 60;

// Daily Telegram review as a PNG (forwardable to WhatsApp): yesterday vs the day
// before + week-to-date vs the same weekday span last week.
//   - GET with `Authorization: Bearer <CRON_SECRET>`.
//   - `?stichtag=YYYY-MM-DD` overrides the reference day (default = yesterday).
//   - `?img=1` returns the PNG directly (for viewing). `?dry=1` skips sending.

function berlinDay(offsetDays: number): string {
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
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (secret && auth !== `Bearer ${secret}`) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const dry = url.searchParams.get("dry") === "1";
  const stichtag = url.searchParams.get("stichtag") || berlinDay(1); // last full day
  const since = addDays(stichtag, -14); // covers week + previous-week span
  const until = stichtag;

  try {
    const [meta, funnel, landings] = await Promise.all([
      fetchMetaDays(since, until),
      fetchFunnelDays(since, until),
      fetchLandings(since, until),
    ]);
    const { rows } = buildRawRows(meta, funnel, landings);
    const comparison = buildComparison(rows, stichtag);

    // ?img=1 → return the PNG directly (for viewing/testing).
    if (url.searchParams.get("img") === "1") return renderDailyImage(comparison);

    const link = process.env.BRIEFING_DASHBOARD_LINK;
    const caption = `📊 <b>Ads-Auswertung — ${weekdayLabel(stichtag)}</b>${link ? `\n📄 ${link}` : ""}`;

    let mode = "photo";
    if (!dry) {
      try {
        const png = await renderDailyImage(comparison).arrayBuffer();
        await notifyTelegramPhoto(png, caption);
      } catch (imgErr) {
        // Bild-Rendering gescheitert → Text-Fallback, damit nie nichts ankommt.
        mode = "text-fallback";
        console.error("[daily-message] image failed", (imgErr as Error)?.message);
        await notifyTelegram(formatDailyMessage(comparison, link), { parseMode: "HTML" });
      }
    }
    return Response.json({ ok: true, stichtag, sent: !dry, mode });
  } catch (err) {
    const msg = (err as Error)?.message ?? "unknown";
    return Response.json({ ok: false, error: msg }, { status: 500 });
  }
}
