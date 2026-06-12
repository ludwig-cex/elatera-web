"use client";

import { loadStripe, type Stripe } from "@stripe/stripe-js";

const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

// Load Stripe.js once (singleton promise). null while no publishable key is
// configured — in that case the cart drawer falls back to the legacy
// out-of-stock email-capture flow so the site never breaks.
export const stripePromise: Promise<Stripe | null> | null = pk
  ? loadStripe(pk)
  : null;

export const stripeEnabled = !!pk;
