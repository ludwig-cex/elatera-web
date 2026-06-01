// Outbrain Pixel. Defaults to the live marketer ID; set
// NEXT_PUBLIC_OUTBRAIN_MARKETER_ID="" to kill the pixel via env.
const MARKETER_ID =
  process.env.NEXT_PUBLIC_OUTBRAIN_MARKETER_ID ??
  "00eb80a5b74b86488452e0519330bae19f";

type ObApi = {
  (...args: unknown[]): void;
  dispatch?: (...args: unknown[]) => void;
  queue?: unknown[][];
  version?: string;
  loaded?: boolean;
  marketerId?: string | string[];
};

declare global {
  interface Window {
    obApi?: ObApi;
  }
}

// Inject obtp.js once and initialise obApi. Safe to call on every page.
export function loadOutbrain() {
  if (!MARKETER_ID || typeof window === "undefined") return;
  try {
    if (window.obApi) {
      const toArray = (o: unknown) => (Array.isArray(o) ? o : [o]);
      window.obApi.marketerId = toArray(window.obApi.marketerId).concat(
        toArray(MARKETER_ID),
      ) as string[];
      return;
    }
    const api: ObApi = function (...args: unknown[]) {
      api.dispatch ? api.dispatch(...args) : api.queue!.push(args);
    };
    api.version = "1.1";
    api.loaded = true;
    api.marketerId = MARKETER_ID;
    api.queue = [];
    window.obApi = api;

    const tag = document.createElement("script");
    tag.async = true;
    tag.src = "//amplify.outbrain.com/cp/obtp.js";
    tag.type = "text/javascript";
    const first = document.getElementsByTagName("script")[0];
    first?.parentNode?.insertBefore(tag, first);
  } catch {
    // never let the pixel break the page
  }
}

// Fire an Outbrain event (PAGE_VIEW on load/route change, or a conversion).
export function outbrain(event: string) {
  if (!MARKETER_ID || typeof window === "undefined") return;
  try {
    window.obApi?.("track", event);
  } catch {
    // ignore
  }
}
