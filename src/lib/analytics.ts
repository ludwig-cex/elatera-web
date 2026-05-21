import posthog from "posthog-js";
import { track as vercelTrack } from "@vercel/analytics";

type Props = Record<string, string | number | boolean | null>;

// Single call site for product/cart funnel events. Fans out to both
// PostHog (funnels, autocapture context) and Vercel Web Analytics.
// Both calls are guarded so analytics can never break a user flow.
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
}
