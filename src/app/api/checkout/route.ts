import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

type CheckoutBody = {
  email?: string;
  items?: { product: string; months: number; subscription: boolean }[];
  totalCents?: number;
  utm?: Record<string, string>;
};

function isEmail(v: unknown): v is string {
  return typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && v.length <= 254;
}

// Creates a manual-capture PaymentIntent: the card is authorized (real charge
// flow, real SCA), but the amount is NEVER captured. The webhook releases the
// authorization the moment it succeeds — no money ever moves.
export async function POST(request: Request) {
  let body: CheckoutBody;
  try {
    body = (await request.json()) as CheckoutBody;
  } catch {
    return Response.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  if (!isEmail(body.email)) {
    return Response.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }
  const email = body.email.trim().toLowerCase();

  // Amount is client-supplied but never captured (auth-hold only). Clamp to a
  // sane range so a tampered value can't create an absurd authorization.
  const amount = typeof body.totalCents === "number" ? Math.round(body.totalCents) : 0;
  if (!Number.isFinite(amount) || amount < 100 || amount > 100000) {
    return Response.json({ ok: false, error: "invalid_amount" }, { status: 400 });
  }

  const utm = body.utm ?? {};
  const products = (body.items ?? []).map((i) => i.product).join(",").slice(0, 450);

  try {
    const stripe = getStripe();
    const pi = await stripe.paymentIntents.create({
      amount,
      currency: "eur",
      capture_method: "manual", // authorize only — never captured
      receipt_email: email,
      automatic_payment_methods: { enabled: true },
      metadata: {
        funnel: "oos-validation",
        email,
        products,
        utm_source: (utm.utm_source ?? "").slice(0, 100),
        utm_content: (utm.utm_content ?? "").slice(0, 100),
      },
    });
    return Response.json({ ok: true, clientSecret: pi.client_secret });
  } catch (err) {
    console.error("[checkout] stripe create failed", (err as Error)?.message);
    return Response.json({ ok: false, error: "stripe" }, { status: 502 });
  }
}
