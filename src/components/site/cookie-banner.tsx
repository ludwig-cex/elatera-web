"use client";

import { useState, useEffect } from "react";

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("elatera-cookie-consent");
    if (!consent) {
      setTimeout(() => setShow(true), 1200);
    }
  }, []);

  if (!show) return null;

  const accept = (level: "all" | "essential") => {
    localStorage.setItem("elatera-cookie-consent", level);
    setShow(false);
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
