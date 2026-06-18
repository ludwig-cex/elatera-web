import { after } from "next/server";
import { notifyTelegram } from "@/lib/notify";

export const runtime = "nodejs";

// Leichtgewichtiger Ping beim Klick auf "Zur Kasse" — reine Betreiber-Info,
// keine PII. Antwortet immer ok, damit der Client nie blockiert/retried.

type CartPingBody = {
  products?: string[];
  totalCents?: number;
  utm?: Record<string, string>;
  stage?: string; // "order" = "Jetzt zahlungspflichtig bestellen" geklickt
  method?: string; // card | klarna | satispay | ...
};

export async function POST(request: Request) {
  let body: CartPingBody;
  try {
    body = (await request.json()) as CartPingBody;
  } catch {
    return Response.json({ ok: true });
  }

  const products = Array.isArray(body.products)
    ? body.products
        .filter((p) => typeof p === "string" && /^[a-z][a-z-]{2,29}$/.test(p))
        .slice(0, 10)
    : [];
  if (products.length === 0) return Response.json({ ok: true });

  const value =
    typeof body.totalCents === "number" && body.totalCents > 0 && body.totalCents < 1000000
      ? `${(body.totalCents / 100).toFixed(2).replace(".", ",")} €`
      : "—";
  const utm = body.utm ?? {};
  const source = typeof utm.utm_source === "string" ? utm.utm_source.slice(0, 50) : "";
  const adId = typeof utm.utm_content === "string" ? utm.utm_content.slice(0, 50) : "";

  const isOrder = body.stage === "order";
  const method = typeof body.method === "string" ? body.method.slice(0, 30) : "";
  const head = isOrder
    ? `💳 „Jetzt zahlungspflichtig bestellen" geklickt\nMethode: ${method || "—"}`
    : `🛒 „Zur Kasse" geklickt`;

  after(() =>
    notifyTelegram(
      `${head}\n` +
        `Produkte: ${products.join(", ")}\n` +
        `Warenkorbwert: ${value}\n` +
        `Quelle: ${source || "direkt"} · Ad: ${adId || "organisch"}`,
    ),
  );

  return Response.json({ ok: true });
}
