"use client";

import { useState, useEffect } from "react";

const CONSENT_KEY = "elatera-cookie-consent";

// localStorage can throw (Safari private mode, sandboxed iframes, embedded
// previews, storage disabled). Reading/writing is wrapped so a blocked store
// never prevents the banner from being dismissed on interaction — otherwise
// the banner would hang permanently in those contexts.
function readConsent(): string | null {
  try {
    return localStorage.getItem(CONSENT_KEY);
  } catch {
    return null;
  }
}

function writeConsent(level: string) {
  try {
    localStorage.setItem(CONSENT_KEY, level);
  } catch {
    // Storage blocked — the choice can't persist across reloads here, but the
    // banner is still dismissed for this session below.
  }
}

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!readConsent()) {
      const t = setTimeout(() => setShow(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  if (!show) return null;

  const accept = (level: "all" | "essential") => {
    // Dismiss first so interaction always works, even if persistence fails.
    setShow(false);
    writeConsent(level);
  };

  return (
    <div
      className="fixed bottom-4 left-4 right-4 md:left-6 md:bottom-6 md:right-auto md:max-w-md z-50 p-5 rounded-lg shadow-lg"
      style={{ background: "var(--color-ivory)", border: "1px solid rgba(0,0,0,0.08)" }}
      role="dialog"
      aria-label="Cookie-Einstellungen"
    >
      <p className="text-sm leading-relaxed">
        Wir verwenden Cookies, um diese Seite zu verbessern und Ihnen relevante Inhalte zu zeigen.
        Wir respektieren Ihre Privatsphäre und Sie können die Auswahl jederzeit ändern.
      </p>
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => accept("all")}
          className="px-4 py-2 rounded text-sm font-medium transition"
          style={{ background: "var(--color-forest)", color: "var(--color-on-dark)" }}
        >
          Alle akzeptieren
        </button>
        <button
          onClick={() => accept("essential")}
          className="px-4 py-2 rounded text-sm transition hover:bg-cream"
          style={{ border: "1px solid var(--color-forest)", color: "var(--color-forest)" }}
        >
          Nur essenzielle
        </button>
      </div>
    </div>
  );
}
