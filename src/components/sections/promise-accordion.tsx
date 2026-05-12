"use client";

import * as Accordion from "@radix-ui/react-accordion";
import {
  Factory,
  FlaskConical,
  PillBottle,
  ShieldCheck,
  Truck,
  Award,
  Leaf,
  Plus,
} from "lucide-react";

const PROMISES = [
  {
    icon: Factory,
    title: "Direkt vom Hersteller",
    body: "Keine Zwischenhändler — der direkte Weg vom Labor zu Ihnen nach Hause. Das macht unsere Produkte transparent und nachvollziehbar.",
  },
  {
    icon: FlaskConical,
    title: "Laborgeprüfte Qualität",
    body: "Jede einzelne Charge unserer Produkte durchläuft eine unabhängige Laborprüfung. Wir geben Reinheit, Wirkstoffgehalt und Schadstofffreiheit unabhängig prüfen.",
  },
  {
    icon: PillBottle,
    title: "Bekannt aus der Apotheke",
    body: "Jedes Elatera-Produkt verfügt über eine eigene Pharmazentralnummer (PZN) und ist über Ihre Stamm-Apotheke beziehbar — ein Trust-Signal, dem Sie vertrauen können.",
  },
  {
    icon: ShieldCheck,
    title: "90 Tage Geld-zurück-Garantie",
    body: "Sollten Sie mit Ihrem Produkt nicht zufrieden sein, erstatten wir Ihnen ohne Wenn und Aber den vollen Kaufpreis zurück. 90 Tage lang.",
  },
  {
    icon: Truck,
    title: "Gratis Versand",
    body: "Ab 60 € Bestellwert versenden wir kostenfrei innerhalb von DACH. Im Spar-Abo ist der Versand dauerhaft inklusive.",
  },
  {
    icon: Award,
    title: "Zertifizierte Herstellung (FSSC 22000)",
    body: "Produktion ausschließlich in FSSC-22000-zertifizierten Anlagen — der höchste internationale Standard für Lebensmittelsicherheit.",
  },
  {
    icon: Leaf,
    title: "Ohne Gentechnik & künstliche Zusätze",
    body: "Wir verwenden ausschließlich natürliche Inhaltsstoffe ohne Gentechnik, ohne künstliche Aromen, ohne unnötige Zusatzstoffe.",
  },
];

export function PromiseAccordion() {
  return (
    <section className="py-20 sm:py-24">
      <div className="container-content">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="eyebrow mb-3">Unser Versprechen</div>
          <h2 className="serif text-4xl sm:text-5xl leading-tight mb-3">
            Sieben Punkte, auf die wir uns verpflichten
          </h2>
          <p style={{ color: "var(--color-muted)" }}>
            Jeder Punkt unten ist ein konkretes Versprechen, kein Marketing-Versprechen.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion.Root type="multiple" className="space-y-3">
            {PROMISES.map((p, i) => {
              const Icon = p.icon;
              const value = `promise-${i}`;
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
                    <Accordion.Trigger className="group w-full px-5 py-4 flex items-center gap-4 text-left transition hover:bg-[var(--color-cream)]">
                      <span
                        className="w-10 h-10 rounded-full flex-none flex items-center justify-center"
                        style={{ background: "var(--color-cream)", color: "var(--color-forest)" }}
                      >
                        <Icon className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
                      </span>
                      <span className="serif text-xl leading-tight flex-1">{p.title}</span>
                      <Plus
                        className="w-5 h-5 flex-none transition-transform group-data-[state=open]:rotate-45"
                        aria-hidden
                      />
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content className="overflow-hidden data-[state=open]:animate-[slideDown_220ms_ease-out] data-[state=closed]:animate-[slideUp_180ms_ease-in]">
                    <div
                      className="px-5 pb-5 pt-1 pl-[68px] text-[15px] leading-relaxed"
                      style={{ color: "var(--color-ink-soft)" }}
                    >
                      {p.body}
                    </div>
                  </Accordion.Content>
                </Accordion.Item>
              );
            })}
          </Accordion.Root>
        </div>
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
    </section>
  );
}
