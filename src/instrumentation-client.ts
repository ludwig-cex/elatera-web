import posthog from "posthog-js";

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

export function onRouterTransitionStart(url: string) {
  if (!key) return;
  try {
    posthog.capture("$pageview", { $current_url: url });
  } catch {
    // ignore
  }
}
