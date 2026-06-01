import posthog from "posthog-js";
import { loadTaboola, taboola } from "@/lib/taboola";
import { loadOutbrain, outbrain } from "@/lib/outbrain";

// Cookieless / anonymous analytics (DSGVO-conscious, pre-launch stage):
// - persistence: "memory" → no cookies, no localStorage, no device identifier
// - person_profiles: "never" → purely aggregate event analytics, no person profiles
// EU ingestion keeps data in the EU.
const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com";

if (key) {
  try {
    posthog.init(key, {
      api_host: host,
      ui_host: "https://eu.posthog.com",
      persistence: "memory",
      person_profiles: "never",
      capture_pageview: false, // captured manually below + on route changes
      capture_pageleave: true,
      autocapture: true,
    });
    posthog.capture("$pageview");
  } catch {
    // Never let analytics init break the app.
  }
}

// Taboola Universal Pixel (native-ad attribution). Conversions are fired
// from lib/analytics.ts; here we load the base pixel + initial page_view.
loadTaboola();
taboola("page_view");

// Outbrain Pixel (native-ad attribution). Base pixel + initial PAGE_VIEW.
loadOutbrain();
outbrain("PAGE_VIEW");

export function onRouterTransitionStart(url: string) {
  taboola("page_view");
  outbrain("PAGE_VIEW");
  if (!key) return;
  try {
    posthog.capture("$pageview", { $current_url: url });
  } catch {
    // ignore
  }
}
