// Render the daily comparison (Tag + Woche tables) as a PNG via next/og (Satori),
// so it can be sent as a Telegram photo and forwarded to WhatsApp. Satori only
// supports flexbox + inline styles, so every container sets display:flex.
import { ImageResponse } from "next/og";
import type { Comparison, Cell } from "./daily";
import { tableCells, dmLabel } from "./daily";

const GREEN = "#1d8a5e", RED = "#c0392b", GREY = "#9a9a9a", BLUE = "#185FA5", INK = "#1a1a1a";

function Row({ c }: { c: Cell }) {
  const indent = c.label.startsWith(" ");
  const color = c.tone === 1 ? GREEN : c.tone === -1 ? RED : GREY;
  return (
    <div style={{ display: "flex", width: "100%", justifyContent: "space-between", padding: "3px 0", fontSize: 23 }}>
      <div style={{ display: "flex", flex: 1, color: INK, paddingLeft: indent ? 20 : 0 }}>{c.label.trim()}</div>
      <div style={{ display: "flex", width: 120, justifyContent: "flex-end", fontWeight: 600, color: "#000" }}>{c.value}</div>
      <div style={{ display: "flex", width: 150, justifyContent: "flex-end", color }}>{c.delta}</div>
    </div>
  );
}

function Section({ title, cells }: { title: string; cells: Cell[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", marginBottom: 22 }}>
      <div style={{ display: "flex", fontSize: 24, fontWeight: 700, color: BLUE, marginBottom: 8 }}>{title}</div>
      {cells.map((c, i) => <Row key={i} c={c} />)}
    </div>
  );
}

export function renderDailyImage(c: Comparison): ImageResponse {
  const D = dmLabel;
  return new ImageResponse(
    (
      <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", backgroundColor: "#ffffff", padding: 40, fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", fontSize: 31, fontWeight: 700, color: "#000", marginBottom: 20 }}>Ads-Auswertung — {D(c.stichtag)}</div>
        <Section title={`Tag — ${D(c.stichtag)} vs. ${D(c.vortag)}`} cells={tableCells(c.dayCur, c.dayPrev)} />
        <Section title={`Woche — ${D(c.weekStart)}-${D(c.stichtag)} vs. Vorwoche ${D(c.prevWeekStart)}-${D(c.prevWeekEnd)}`} cells={tableCells(c.weekCur, c.weekPrev)} />
      </div>
    ),
    { width: 720, height: 1120 }
  );
}
