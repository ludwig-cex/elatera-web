import posthog from "posthog-js";
import { loadTaboola, taboola } from "@/lib/taboola";
import { loadOutbrain, outbrain } from "@/lib/outbrain";
import { loadMeta, meta } from "@/lib/meta";

// Cookieless / anonymous analytics (DSGVO-conscious, pre-launch stage):
// - persistence: "memory" → no cookies, no localStorage, no device identifier
// - person_profiles: "never" → purely aggregate event analytics, no person profiles
// EU ingestion keeps data in the EU.
const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com";

// Cross-domain identity hand-off: the advertorial (mein-apothekenrat) appends
// its anonymous distinct_id as ?ph_did=… on the shop CTA. We adopt it here via
// bootstrap so the advertorial->shop funnel is one connected identity, then
// strip the param so it never leaks into UTMs or the captured $current_url.
// Without this, memory-persistence mints a fresh distinct_id on landing and the
// cross-site funnel drops 100% at the shop step.
function readBootstrap() {
  try {
    const did = new URLSearchParams(window.location.search).get("ph_did");
    if (did) return { distinctID: did, isIdentifiedID: false };
  } catch {
    // ignore
  }
  return undefined;
}

function stripIdentityParams() {
  try {
    const u = new URL(window.location.href);
    if (u.searchParams.has("ph_did")) {
      u.searchParams.delete("ph_did");
      window.history.replaceState(window.history.state, "", u.toString());
    }
  } catch {
    // ignore
  }
}

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
      bootstrap: readBootstrap(),
    });
    // Clean the URL before the first capture so $current_url stays free of ph_did.
    stripIdentityParams();
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

// Meta Pixel. Base pixel + initial PageView. Conversions (ViewContent,
// AddToCart, InitiateCheckout, Lead) are fired from lib/analytics.ts.
loadMeta();
meta("PageView");

export function onRouterTransitionStart(url: string) {
  taboola("page_view");
  outbrain("PAGE_VIEW");
  meta("PageView");
  if (!key) return;
  try {
    posthog.capture("$pageview", { $current_url: url });
  } catch {
    // ignore
  }
}
