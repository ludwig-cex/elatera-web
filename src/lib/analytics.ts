import posthog from "posthog-js";
import { track as vercelTrack } from "@vercel/analytics";
import { taboola } from "./taboola";
import { outbrain } from "./outbrain";
import { meta } from "./meta";

type Props = Record<string, string | number | boolean | null>;

// Map our internal funnel events to Taboola's standard event names so
// campaigns can optimize toward them. intent_email_submitted is the real
// conversion in this pre-launch model (the email/intent capture).
const TABOOLA_EVENTS: Record<string, string> = {
  product_viewed: "view_content",
  add_to_cart: "add_to_cart",
  checkout_clicked: "start_checkout",
  intent_email_submitted: "lead",
};

// Same funnel mapped to Outbrain conversion event names. These names must
// match the custom conversions configured in the Outbrain dashboard.
const OUTBRAIN_EVENTS: Record<string, string> = {
  product_viewed: "View Content",
  add_to_cart: "Add to Cart",
  checkout_clicked: "Initiate Checkout",
  intent_email_submitted: "Lead",
};

// Same funnel mapped to Meta (Facebook) standard event names so the pixel
// can optimize toward them. intent_email_submitted is the real conversion
// in this pre-launch model (the email/intent capture = Lead).
const META_EVENTS: Record<string, string> = {
  product_viewed: "ViewContent",
  add_to_cart: "AddToCart",
  checkout_clicked: "InitiateCheckout",
  intent_email_submitted: "Lead",
};

// Single call site for product/cart funnel events. Fans out to PostHog
// (funnels, autocapture context), Vercel Web Analytics, Taboola and Outbrain.
// Every call is guarded so analytics can never break a user flow.
export function track(event: string, props?: Props) {
  try {
    posthog.capture(event, props);
  } catch {
    // ignore
  }
  try {
    vercelTrack(event, props);
  } catch {
    // ignore
  }
  try {
    const taboolaEvent = TABOOLA_EVENTS[event];
    if (taboolaEvent) taboola(taboolaEvent);
  } catch {
    // ignore
  }
  try {
    const outbrainEvent = OUTBRAIN_EVENTS[event];
    if (outbrainEvent) outbrain(outbrainEvent);
  } catch {
    // ignore
  }
  try {
    const metaEvent = META_EVENTS[event];
    if (metaEvent) meta(metaEvent);
  } catch {
    // ignore
  }
}
