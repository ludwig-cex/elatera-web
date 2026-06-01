import posthog from "posthog-js";
import { track as vercelTrack } from "@vercel/analytics";
import { taboola } from "./taboola";

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

// Single call site for product/cart funnel events. Fans out to PostHog
// (funnels, autocapture context), Vercel Web Analytics, and Taboola.
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
}
