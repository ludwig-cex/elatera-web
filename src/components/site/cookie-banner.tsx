"use client";

import { useState, useEffect } from "react";

const CONSENT_KEY = "elatera-cookie-consent";

// localStorage can throw (Safari private mode, sandboxed iframes, embedded
// previews, storage disabled). Reading/writing is wrapped so a blocked store
// never prevents the gate from being dismissed on interaction.
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
    // Storage blocked — the choice can't persist across reloads, but the gate
    // is still dismissed for this session below.
  }
}

// Blocking consent gate: shown immediately with a backdrop and a scroll lock so
// the visitor must make a choice before using the page. Avoids the "scroll past
// the open banner" behaviour that obscured the page in session recordings.
export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!readConsent()) setShow(true);
  }, []);

  // Lock background scroll while the gate is open.
  useEffect(() => {
    if (!show) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [show]);

  if (!show) return null;

  const accept = (level: "all" | "essential") => {
    setShow(false);
    writeConsent(level);
  };

  return (
    <>
      {/* Blocking backdrop — no click-to-dismiss, a choice is required. */}
      <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm" aria-hidden />
      <div
        className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-label="Datenschutz-Einstellungen"
      >
        <div
          className="w-full max-w-md rounded-xl p-6 shadow-xl"
          style={{ background: "var(--color-ivory)", border: "1px solid rgba(0,0,0,0.08)" }}
        >
          <h2 className="serif text-xl leading-tight mb-2">Datenschutz-Einstellungen</h2>
          <p className="text-sm leading-relaxed">
            Wir verwenden Cookies, um diese Seite zu verbessern und Ihnen relevante Inhalte zu
            zeigen. Bitte treffen Sie eine Auswahl, um fortzufahren. Sie können diese jederzeit
            ändern.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 mt-5">
            <button
              onClick={() => accept("all")}
              className="flex-1 px-4 py-3 rounded-lg text-sm font-medium transition hover:opacity-90"
              style={{ background: "var(--color-forest)", color: "var(--color-on-dark)" }}
            >
              Alle akzeptieren
            </button>
            <button
              onClick={() => accept("essential")}
              className="flex-1 px-4 py-3 rounded-lg text-sm transition hover:bg-cream"
              style={{ border: "1px solid var(--color-forest)", color: "var(--color-forest)" }}
            >
              Nur essenzielle
            </button>
          </div>
          <p className="text-xs text-muted mt-3">
            Mehr dazu in der{" "}
            <a href="/policies/datenschutz" className="underline underline-offset-2">
              Datenschutzerklärung
            </a>
            .
          </p>
        </div>
      </div>
    </>
  );
}
