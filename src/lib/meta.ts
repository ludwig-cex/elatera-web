// Meta (Facebook) Pixel. Defaults to the live pixel ID; set
// NEXT_PUBLIC_META_PIXEL_ID="" to kill the pixel via env.
const PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "1021981360359558";

type FbqApi = {
  (...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[][];
  push?: unknown;
  loaded?: boolean;
  version?: string;
};

declare global {
  interface Window {
    fbq?: FbqApi;
    _fbq?: FbqApi;
  }
}

// Inject fbevents.js once and init the pixel. Safe to call on every page.
export function loadMeta() {
  if (!PIXEL_ID || typeof window === "undefined") return;
  try {
    if (!window.fbq) {
      const n: FbqApi = function (...args: unknown[]) {
        n.callMethod
          ? n.callMethod.apply(n, args)
          : n.queue!.push(args);
      };
      if (!window._fbq) window._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = "2.0";
      n.queue = [];
      window.fbq = n;

      const tag = document.createElement("script");
      tag.async = true;
      tag.src = "https://connect.facebook.net/en_US/fbevents.js";
      const first = document.getElementsByTagName("script")[0];
      first?.parentNode?.insertBefore(tag, first);
    }
    window.fbq("init", PIXEL_ID);
  } catch {
    // never let the pixel break the page
  }
}

// Fire a Meta standard event (PageView on load/route change, or a conversion
// like ViewContent / AddToCart / InitiateCheckout / Lead).
export function meta(event: string, params?: Record<string, unknown>, eventId?: string) {
  if (!PIXEL_ID || typeof window === "undefined") return;
  try {
    // eventID lets the server-side CAPI event deduplicate against this pixel event.
    if (eventId) window.fbq?.("track", event, params, { eventID: eventId });
    else window.fbq?.("track", event, params);
  } catch {
    // ignore
  }
}
