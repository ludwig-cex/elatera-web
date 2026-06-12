import { after } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { trackOutOfStockOrder } from "@/lib/klaviyo";
import { notifyTelegram } from "@/lib/notify";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = request.headers.get("stripe-signature");
  if (!secret || !sig) {
    return Response.json({ ok: false, error: "not_configured" }, { status: 400 });
  }

  // Signature verification needs the raw, unparsed body.
  const raw = await request.text();
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(raw, sig, secret);
  } catch (err) {
    console.error("[stripe-webhook] signature verification failed", (err as Error)?.message);
    return Response.json({ ok: false, error: "bad_signature" }, { status: 400 });
  }

  // For a manual-capture PaymentIntent this fires once the card authorization
  // succeeds — i.e. the customer completed a real payment flow.
  if (event.type === "payment_intent.amount_capturable_updated") {
    const pi = event.data.object as Stripe.PaymentIntent;
    const email = (pi.metadata?.email as string) || pi.receipt_email || "";
    const products = (pi.metadata?.products as string) || "";
    const valueEur = pi.amount / 100;

    after(async () => {
      // 1) Release the authorization immediately — nothing is ever captured.
      try {
        await getStripe().paymentIntents.cancel(pi.id, {
          cancellation_reason: "abandoned",
        });
      } catch (err) {
        console.error("[stripe-webhook] cancel failed", pi.id, (err as Error)?.message);
      }

      // 2) Trigger the "sorry, out of stock" mail via Klaviyo.
      if (email) {
        await trackOutOfStockOrder(email, {
          cart_products: products,
          order_value_eur: valueEur,
          payment_intent: pi.id,
          utm_source: pi.metadata?.utm_source ?? null,
          utm_content: pi.metadata?.utm_content ?? null,
        });
      }

      // 3) Operator ping.
      await notifyTelegram(
        `💳 Echte Zahlung autorisiert (Hold sofort freigegeben)\n` +
          `Produkte: ${products || "—"}\n` +
          `Wert: ${valueEur.toFixed(2).replace(".", ",")} €\n` +
          `PI: ${pi.id}`,
      );
    });
  }

  return Response.json({ received: true });
}
