"use client";

import { useState, useEffect, useRef } from "react";
import { ShoppingBag } from "lucide-react";

// Shown only to advertorial readers (lp param present), once per session, when
// they try to leave: desktop via cursor leaving through the top edge, mobile via
// intercepting the first back-navigation. A soft "are you sure" retention prompt
// so a pre-sold visitor doesn't drop out by reflex.
export function ExitIntentModal() {
  const [open, setOpen] = useState(false);
  const shown = useRef(false);

  useEffect(() => {
    let isLp = false;
    try {
      isLp = new URLSearchParams(window.location.search).has("lp");
    } catch {}
    if (!isLp) return;
    try {
      if (sessionStorage.getItem("nutrasana-exit-shown")) return;
    } catch {}

    const trigger = () => {
      if (shown.current) return;
      shown.current = true;
      setOpen(true);
      try {
        sessionStorage.setItem("nutrasana-exit-shown", "1");
      } catch {}
    };

    // Desktop: cursor leaves through the top of the viewport.
    const onExitIntent = (e: MouseEvent) => {
      if (e.clientY <= 0) trigger();
    };
    document.documentElement.addEventListener("mouseleave", onExitIntent);

    // Mobile/all: intercept the first back-navigation with a guard history entry.
    let guardActive = false;
    try {
      window.history.pushState({ nsExitGuard: true }, "");
      guardActive = true;
    } catch {}
    const onPop = () => {
      if (shown.current) return;
      trigger();
      try {
        window.history.pushState({ nsExitGuard: true }, "");
      } catch {}
    };
    if (guardActive) window.addEventListener("popstate", onPop);

    return () => {
      document.documentElement.removeEventListener("mouseleave", onExitIntent);
      if (guardActive) window.removeEventListener("popstate", onPop);
    };
  }, []);

  if (!open) return null;

  const stay = () => setOpen(false);
  const leave = () => {
    setOpen(false);
    // We pushed one guard entry on top of the current page; two steps back
    // return to the previous site (the advertorial). Fall back if history short.
    try {
      if (window.history.length > 2) window.history.go(-2);
      else window.history.back();
    } catch {}
  };

  return (
    <>
      <div className="fixed inset-0 z-[55] bg-black/40 backdrop-blur-sm" onClick={stay} aria-hidden />
      <div
        className="fixed inset-0 z-[55] flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-label="Bestellung abbrechen?"
      >
        <div
          className="w-full max-w-md rounded-xl p-7 shadow-xl text-center"
          style={{ background: "var(--color-ivory)" }}
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="serif text-2xl leading-tight mb-2">Möchten Sie wirklich gehen?</h2>
          <p className="text-sm text-muted leading-relaxed mb-6">
            Ihre Auswahl bleibt für Sie reserviert. Sie sichern sich gerade{" "}
            <strong style={{ color: "var(--color-copper)" }}>bis zu 45 % im Vorrats-Bundle</strong> —
            der Abschluss dauert keine Minute.
          </p>
          <button
            onClick={stay}
            className="w-full py-3.5 rounded-lg font-medium inline-flex items-center justify-center gap-2 transition hover:opacity-90"
            style={{ background: "var(--color-forest)", color: "var(--color-on-dark)" }}
          >
            <ShoppingBag className="w-5 h-5" />
            Hier bleiben & abschließen
          </button>
          <button onClick={leave} className="w-full py-2 mt-2 text-xs text-muted hover:text-ink">
            Trotzdem verlassen
          </button>
        </div>
      </div>
    </>
  );
}
