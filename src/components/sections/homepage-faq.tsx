"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
import Link from "next/link";

const FAQS = [
  {
    q: "Sind die Produkte wissenschaftlich fundiert?",
    a: "Ja. Alle Nutrasana-Rezepturen basieren auf aktuellsten wissenschaftlichen Studien und EFSA-konformen Health-Claims. Jeder Inhaltsstoff wurde mit Blick auf Wirksamkeit und Bioverfügbarkeit ausgewählt.",
  },
  {
    q: "Werden die Produkte unabhängig laborgeprüft?",
    a: "Ja — jede Charge unserer Produkte durchläuft eine unabhängige Laborprüfung auf Reinheit, Wirkstoffgehalt und Schadstofffreiheit. Wir produzieren ausschließlich in FSSC-22000-zertifizierten Anlagen.",
  },
  {
    q: "Sind die Produkte wirklich Made in Germany?",
    a: "Ja. Sowohl die Produktion als auch die Qualitätssicherung finden ausschließlich in Deutschland statt. Kein Outsourcing, kein Greenwashing — Lieferanten und Hersteller sind dokumentiert nachvollziehbar.",
  },
  {
    q: "Werden die Produkte von Experten empfohlen?",
    a: "Jede Rezeptur wird gemeinsam mit approbierten Pharmazeuten entwickelt und fachlich begleitet. Zusätzlich verfügt jedes Nutrasana-Produkt über eine eigene Pharmazentralnummer (PZN).",
  },
  {
    q: "Was beinhaltet die 90-Tage-Geld-zurück-Garantie?",
    a: "Sollten Sie mit einem Produkt nicht zufrieden sein, schicken Sie es innerhalb von 90 Tagen zurück — wir erstatten Ihnen den vollen Kaufpreis ohne weitere Fragen. Sowohl Hin- als auch Rücksendung sind in diesem Fall für Sie kostenfrei.",
  },
];

export function HomepageFaq() {
  return (
    <section className="py-12 sm:py-20 lg:py-24" style={{ background: "var(--color-cream)" }}>
      <div className="container-content max-w-3xl">
        <div className="text-center mb-10">
          <div className="eyebrow mb-3">Häufige Fragen</div>
          <h2 className="serif text-3xl sm:text-4xl leading-tight">
            Antworten auf das, was Sie sich vermutlich fragen
          </h2>
        </div>

        <Accordion.Root type="multiple" className="space-y-2">
          {FAQS.map((f, i) => {
            const value = `home-faq-${i}`;
            return (
              <Accordion.Item
                key={value}
                value={value}
                className="rounded-lg overflow-hidden"
                style={{
                  background: "var(--color-ivory)",
                  border: "1px solid rgba(0,0,0,0.06)",
                }}
              >
                <Accordion.Header>
                  <Accordion.Trigger className="group w-full px-5 py-4 flex items-center justify-between gap-4 text-left transition hover:bg-[var(--color-paper)]">
                    <span className="serif text-lg leading-tight">{f.q}</span>
                    <Plus
                      className="w-5 h-5 flex-none transition-transform group-data-[state=open]:rotate-45"
                      aria-hidden
                    />
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="overflow-hidden data-[state=open]:animate-[slideDown_220ms_ease-out] data-[state=closed]:animate-[slideUp_180ms_ease-in]">
                  <div
                    className="px-5 pb-5 text-[15px] leading-relaxed"
                    style={{ color: "var(--color-ink-soft)" }}
                  >
                    {f.a}
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            );
          })}
        </Accordion.Root>

        <div className="text-center mt-8">
          <Link
            href="/pages/hilfe-kontakt"
            className="text-sm font-medium hover:opacity-70 underline-offset-4 hover:underline"
            style={{ color: "var(--color-forest)" }}
          >
            Alle Fragen in unserem Hilfe-Center →
          </Link>
        </div>

        <style jsx global>{`
          @keyframes slideDown {
            from { height: 0; opacity: 0; }
            to { height: var(--radix-accordion-content-height); opacity: 1; }
          }
          @keyframes slideUp {
            from { height: var(--radix-accordion-content-height); opacity: 1; }
            to { height: 0; opacity: 0; }
          }
        `}</style>
      </div>
    </section>
  );
}
