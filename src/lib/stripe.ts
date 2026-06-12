import Stripe from "stripe";

// Server-only Stripe client. Resolved lazily so a missing STRIPE_SECRET_KEY
// can never crash the build or unrelated routes — only the checkout/webhook
// handlers that actually call getStripe() will fail, and they guard for it.
let cached: Stripe | null = null;

export function getStripe(): Stripe {
  if (cached) return cached;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY not configured");
  cached = new Stripe(key);
  return cached;
}
