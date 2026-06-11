import { after } from "next/server";
import { notifyTelegram } from "@/lib/notify";

export const runtime = "nodejs";

// Leichtgewichtiger Ping bei "In den Warenkorb" — reine Betreiber-Info,
// keine PII. Antwortet immer ok, damit der Client nie blockiert/retried.

type CartPingBody = {
  product?: string;
  months?: number;
  priceCents?: number;
  subscription?: boolean;
  utm?: Record<string, string>;
};

export async function POST(request: Request) {
  let body: CartPingBody;
  try {
    body = (await request.json()) as CartPingBody;
  } catch {
    return Response.json({ ok: true });
  }

  const product =
    typeof body.product === "string" && /^[a-z][a-z-]{2,29}$/.test(body.product)
      ? body.product
      : null;
  if (!product) return Response.json({ ok: true });

  const months = [1, 3, 6].includes(body.months as number) ? (body.months as number) : null;
  const price =
    typeof body.priceCents === "number" && body.priceCents > 0 && body.priceCents < 100000
      ? `${(body.priceCents / 100).toFixed(2).replace(".", ",")} €`
      : "—";
  const utm = body.utm ?? {};
  const source = typeof utm.utm_source === "string" ? utm.utm_source.slice(0, 50) : "";
  const adId = typeof utm.utm_content === "string" ? utm.utm_content.slice(0, 50) : "";

  after(() =>
    notifyTelegram(
      `🛒 In den Warenkorb gelegt\n` +
        `Produkt: ${product}${months ? ` · ${months} Monat${months > 1 ? "e" : ""}` : ""}${body.subscription ? " · Spar-Abo" : ""}\n` +
        `Wert: ${price}\n` +
        `Quelle: ${source || "direkt"} · Ad: ${adId || "organisch"}`,
    ),
  );

  return Response.json({ ok: true });
}
