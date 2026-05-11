"use client";

import { useState } from "react";
import { MapPin, Check, Loader2 } from "lucide-react";

export function AvailabilityChecker({ accentColor }: { accentColor: string }) {
  const [zip, setZip] = useState("");
  const [state, setState] = useState<"idle" | "checking" | "ok">("idle");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!zip || zip.length < 4) return;
    setState("checking");
    setTimeout(() => setState("ok"), 950);
  };

  return (
    <div
      className="rounded-lg p-5 sm:p-6"
      style={{ background: "var(--color-ivory)", border: "1px solid rgba(0,0,0,0.06)" }}
    >
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="w-4 h-4 opacity-60" />
        <span className="text-xs uppercase tracking-widest text-muted">
          Lieferbarkeit zu Ihrer Postleitzahl
        </span>
      </div>
      {state === "ok" ? (
        <div className="flex items-center gap-3 py-2">
          <div
            className="w-8 h-8 rounded-full flex-none flex items-center justify-center"
            style={{ background: accentColor }}
          >
            <Check className="w-4 h-4" color="white" strokeWidth={3} />
          </div>
          <div>
            <div className="font-medium">Glückwunsch — wir liefern zu Ihnen.</div>
            <div className="text-sm text-muted">
              Versandkostenfrei mit DHL ab einem Warenkorb von 60&nbsp;€.
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="flex gap-2">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]{5}"
            value={zip}
            onChange={(e) => setZip(e.target.value.replace(/[^0-9]/g, "").slice(0, 5))}
            placeholder="z.B. 10115"
            className="flex-1 px-4 py-3 rounded text-base outline-none focus:ring-2"
            style={{
              background: "var(--color-paper)",
              border: "1px solid rgba(0,0,0,0.10)",
            }}
            aria-label="Postleitzahl"
          />
          <button
            type="submit"
            disabled={state === "checking" || zip.length < 4}
            className="px-5 rounded font-medium disabled:opacity-50 transition hover:opacity-90 inline-flex items-center gap-2"
            style={{ background: "var(--color-forest)", color: "var(--color-on-dark)" }}
          >
            {state === "checking" && <Loader2 className="w-4 h-4 animate-spin" />}
            Prüfen
          </button>
        </form>
      )}
    </div>
  );
}
