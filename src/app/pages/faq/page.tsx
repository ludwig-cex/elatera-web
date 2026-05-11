import type { Metadata } from "next";
import Link from "next/link";
import { PRODUCT_LIST } from "@/lib/products";

export const metadata: Metadata = {
  title: "Häufige Fragen",
};

export default function FaqPage() {
  return (
    <div className="py-16 sm:py-20">
      <div className="container-content max-w-3xl">
        <div className="eyebrow mb-3">Häufige Fragen</div>
        <h1 className="serif text-4xl sm:text-5xl leading-tight mb-6">
          Alles Wichtige zu Elatera
        </h1>
        <p className="text-lg mb-10" style={{ color: "var(--color-ink-soft)" }}>
          Spezifische Fragen zu einem einzelnen Produkt finden Sie auf der jeweiligen Produktseite. Allgemeine Fragen beantworten wir hier.
        </p>

        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          {PRODUCT_LIST.map((p) => (
            <Link
              key={p.slug}
              href={`/products/${p.slug}#faq`}
              className="rounded-lg p-5 transition hover:opacity-90"
              style={{ background: p.palette.bg }}
            >
              <div className="serif text-xl mb-1" style={{ color: p.palette.ink }}>
                {p.name}
              </div>
              <div className="text-xs" style={{ color: p.palette.subInk }}>
                Fragen zu {p.tagline}
              </div>
            </Link>
          ))}
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="serif text-2xl mb-3">Wann startet die Premiere?</h2>
            <p className="text-muted leading-relaxed">
              Wir planen die Premiere für Sommer 2026. Wer sich heute auf die Warteliste setzt, erhält 14 Tage Vorlauf und 10 % Pre-Order-Vorteil.
            </p>
          </div>
          <div>
            <h2 className="serif text-2xl mb-3">Berechnen Sie schon jetzt etwas?</h2>
            <p className="text-muted leading-relaxed">
              Nein. Wir berechnen erst, wenn das Produkt verfügbar und tatsächlich versendet wird. Die Anmeldung auf der Warteliste ist verbindlich, aber zahlungslos.
            </p>
          </div>
          <div>
            <h2 className="serif text-2xl mb-3">Werden meine Daten weitergegeben?</h2>
            <p className="text-muted leading-relaxed">
              Nein. Wir nutzen Ihre E-Mail ausschließlich für Premiere-Informationen und unseren redaktionellen Newsletter. Sie können jederzeit widersprechen.
            </p>
          </div>
          <div>
            <h2 className="serif text-2xl mb-3">Können Apotheken Elatera beziehen?</h2>
            <p className="text-muted leading-relaxed">
              Ja, ab Premiere über alle großen Pharma-Großhändler. Details auf der Seite <Link href="/pages/apotheken" className="underline">Apotheken</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
