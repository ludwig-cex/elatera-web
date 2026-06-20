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
// can optimize toward them. payment_submitted ("Jetzt zahlungspflichtig
// bestellen"-Klick) = Lead — das ist die Conversion, auf die die Meta-
// Kampagnen (OUTCOME_LEADS) optimieren; der Bestell-Klick ist das stärkste
// echte Intent-Signal im Validierungs-Modell (Wert kommt aus props.value).
// intent_email_submitted = CompleteRegistration (E-Mail-Capture als eigenes
// Signal, belegt aber nicht mehr das "Lead"-Event).
const META_EVENTS: Record<string, string> = {
  product_viewed: "ViewContent",
  add_to_cart: "AddToCart",
  checkout_clicked: "InitiateCheckout",
  payment_submitted: "Lead",
  intent_email_submitted: "CompleteRegistration",
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
    if (metaEvent) {
      const eventId =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${event}-${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const value = typeof props?.value === "number" ? props.value : undefined;
      const productSlug = typeof props?.product === "string" ? props.product : undefined;

      const metaParams: Record<string, unknown> = {};
      if (value != null) {
        metaParams.value = value;
        metaParams.currency = "EUR";
      }
      if (productSlug) {
        metaParams.content_ids = [productSlug];
        metaParams.content_type = "product";
      }

      // Browser pixel (deduplicated against the CAPI event via eventID).
      meta(metaEvent, metaParams, eventId);

      // Server-side Conversions API mirror — fire-and-forget, never blocks the UI.
      try {
        void fetch("/api/meta", {
          method: "POST",
          headers: { "content-type": "application/json" },
          keepalive: true,
          body: JSON.stringify({
            event_name: metaEvent,
            event_id: eventId,
            event_source_url: typeof location !== "undefined" ? location.href : undefined,
            value,
            currency: value != null ? "EUR" : undefined,
            content_ids: productSlug ? [productSlug] : undefined,
          }),
        }).catch(() => {});
      } catch {
        // ignore
      }
    }
  } catch {
    // ignore
  }
}
