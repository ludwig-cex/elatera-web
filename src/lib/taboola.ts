// Taboola Universal Pixel. Master switch is NEXT_PUBLIC_TABOOLA_PIXEL_ID;
// when unset, every call here is a no-op so the pixel can be killed via env.
const PIXEL_ID = process.env.NEXT_PUBLIC_TABOOLA_PIXEL_ID;

declare global {
  interface Window {
    _tfa?: Array<Record<string, unknown>>;
  }
}

// Inject the tfa.js loader exactly once. Safe to call on every page.
export function loadTaboola() {
  if (!PIXEL_ID || typeof window === "undefined") return;
  try {
    window._tfa = window._tfa || [];
    const scriptId = "tb_tfa_script";
    if (document.getElementById(scriptId)) return;
    const s = document.createElement("script");
    s.async = true;
    s.src = `//cdn.taboola.com/libtrc/unip/${PIXEL_ID}/tfa.js`;
    s.id = scriptId;
    const first = document.getElementsByTagName("script")[0];
    first?.parentNode?.insertBefore(s, first);
  } catch {
    // never let the pixel break the page
  }
}

// Push a Taboola event onto the queue (base "page_view" or a conversion).
export function taboola(name: string) {
  if (!PIXEL_ID || typeof window === "undefined") return;
  try {
    window._tfa = window._tfa || [];
    window._tfa.push({ notify: "event", name, id: Number(PIXEL_ID) });
  } catch {
    // ignore
  }
}
