// Attribution params we keep across the funnel. Captured on first landing
// (sessionStorage snapshot) so they survive internal navigation before the
// visitor reaches the cart/checkout.
const KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "tblci", // Taboola
  "obclickid",
  "ob_click_id", // Outbrain
  "gclid",
  "fbclid",
  "msclkid",
];

const STORE_KEY = "nutrasana_utm";

export function captureUtm() {
  if (typeof window === "undefined") return;
  try {
    const url = new URLSearchParams(window.location.search);
    const found: Record<string, string> = {};
    for (const k of KEYS) {
      const v = url.get(k);
      if (v) found[k] = v.slice(0, 200);
    }
    if (Object.keys(found).length === 0) return; // don't overwrite an existing snapshot with nothing
    sessionStorage.setItem(STORE_KEY, JSON.stringify(found));
  } catch {
    // ignore
  }
}

export function readUtm(): Record<string, string> {
  if (typeof window === "undefined") return {};
  let snapshot: Record<string, string> = {};
  try {
    snapshot = JSON.parse(sessionStorage.getItem(STORE_KEY) || "{}");
  } catch {
    snapshot = {};
  }
  try {
    const url = new URLSearchParams(window.location.search);
    for (const k of KEYS) {
      const v = url.get(k);
      if (v) snapshot[k] = v.slice(0, 200);
    }
  } catch {
    // ignore
  }
  return snapshot;
}
