"use client";

import { useState } from "react";
import type { SelfTest } from "@/content/ratgeber/self-tests";

/*
 * Durchklick-Selbsttest auf Ratgeber-Artikeln: eine Frage pro Karte,
 * Fortschrittsanzeige, bewusst OHNE Auswertung (YMYL). Die Abschlusskarte
 * ist immer unterstützend und führt zum passenden Produkt im Shop.
 */

export function SelfTestWidget({
  test,
  productName,
  productSlug,
  articleSlug,
}: {
  test: SelfTest;
  productName: string;
  productSlug: string;
  articleSlug: string;
}) {
  const [step, setStep] = useState(-1); // -1 = Intro, 0..n-1 = Fragen, n = Ergebnis
  const total = test.questions.length;
  const done = step >= total;

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(12,43,99,0.16)" }}>
      <div
        className="px-6 py-4 flex items-center justify-between gap-4"
        style={{ background: "var(--color-navy)", color: "#fff" }}
      >
        <div className="font-semibold text-sm sm:text-base">
          Ihr 2-Minuten-Selbsttest: {test.title}
        </div>
        {step >= 0 && !done && (
          <div className="text-xs whitespace-nowrap" style={{ opacity: 0.85 }}>
            Frage {step + 1} von {total}
          </div>
        )}
      </div>

      {/* Fortschrittsbalken */}
      <div style={{ height: 5, background: "var(--color-cream)" }}>
        <div
          style={{
            height: "100%",
            width: `${done ? 100 : step < 0 ? 0 : (step / total) * 100}%`,
            background: "#1d9e57",
            transition: "width .3s",
          }}
        />
      </div>

      <div className="p-6" style={{ background: "#fff" }}>
        {step === -1 && (
          <div>
            <p className="text-base leading-relaxed mb-5" style={{ color: "var(--color-ink-soft)" }}>
              {test.intro}
            </p>
            <button
              onClick={() => setStep(0)}
              className="py-3.5 px-7 rounded-full font-semibold text-sm"
              style={{ background: "var(--color-navy)", color: "#fff" }}
            >
              Selbsttest starten
            </button>
          </div>
        )}

        {step >= 0 && !done && (
          <div>
            <p className="serif text-xl sm:text-2xl leading-snug mb-5" style={{ color: "var(--color-navy)" }}>
              {test.questions[step].q}
            </p>
            <div className="grid gap-2.5">
              {test.questions[step].options.map((o) => (
                <button
                  key={o}
                  onClick={() => setStep((s) => s + 1)}
                  className="py-3.5 px-5 rounded-xl text-left text-base font-medium transition-colors hover:opacity-85"
                  style={{
                    background: "var(--color-cream)",
                    color: "var(--color-ink)",
                    border: "1px solid rgba(12,43,99,0.12)",
                  }}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>
        )}

        {done && (
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span
                aria-hidden
                className="w-9 h-9 rounded-full flex items-center justify-center text-lg"
                style={{ background: "#eaf7f0", color: "#1d9e57" }}
              >
                ✓
              </span>
              <div className="serif text-xl sm:text-2xl leading-tight" style={{ color: "var(--color-navy)" }}>
                {test.result.headline}
              </div>
            </div>
            <p className="text-base leading-relaxed mb-4" style={{ color: "var(--color-ink-soft)" }}>
              {test.result.text}
            </p>
            <div className="flex items-center gap-2 mb-5 text-sm">
              <span aria-hidden style={{ color: "#f2b01e", letterSpacing: "1px" }}>★★★★★</span>
              <span className="font-semibold" style={{ color: "var(--color-ink)" }}>4,7/5</span>
              <span style={{ color: "var(--color-muted)" }}>· über 3.500 zufriedene Kundinnen und Kunden</span>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={`https://www.nutra-sana.de/products/${productSlug}?utm_source=ratgeber&utm_medium=content&utm_campaign=${articleSlug}&utm_content=selbsttest`}
                className="py-3.5 px-7 rounded-full font-semibold text-sm"
                style={{ background: "var(--color-navy)", color: "#fff" }}
              >
                {productName} ansehen
              </a>
              <button
                onClick={() => setStep(-1)}
                className="text-sm underline underline-offset-4"
                style={{ color: "var(--color-muted)" }}
              >
                Test wiederholen
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
