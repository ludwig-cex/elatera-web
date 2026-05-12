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
            <h2 className="serif text-2xl mb-3">Wann sind die Produkte wieder verfügbar?</h2>
            <p style={{ color: "var(--color-muted)" }} className="leading-relaxed">
              Wer sich auf unsere Warteliste setzt, wird als Erste:r benachrichtigt, sobald das jeweilige Produkt wieder verfügbar ist — und erhält dazu einen exklusiven 10 %-Vorteil und kostenlosen Versand.
            </p>
          </div>
          <div>
            <h2 className="serif text-2xl mb-3">Berechnen Sie schon jetzt etwas?</h2>
            <p style={{ color: "var(--color-muted)" }} className="leading-relaxed">
              Nein. Wir berechnen erst, wenn das Produkt tatsächlich versendet wird. Die Anmeldung auf der Warteliste ist unverbindlich und zahlungslos.
            </p>
          </div>
          <div>
            <h2 className="serif text-2xl mb-3">Werden meine Daten weitergegeben?</h2>
            <p style={{ color: "var(--color-muted)" }} className="leading-relaxed">
              Nein. Wir nutzen Ihre E-Mail ausschließlich für Versand-Benachrichtigungen und unseren redaktionellen Newsletter. Sie können jederzeit widersprechen.
            </p>
          </div>
          <div>
            <h2 className="serif text-2xl mb-3">Können Apotheken Elatera beziehen?</h2>
            <p style={{ color: "var(--color-muted)" }} className="leading-relaxed">
              Ja — alle Elatera-Produkte verfügen über eine eigene PZN und sind über die großen Pharma-Großhändler (PHOENIX, NOWEDA, GEHE) beziehbar.
            </p>
          </div>
          <div>
            <h2 className="serif text-2xl mb-3">Wie lange dauert der Versand?</h2>
            <p style={{ color: "var(--color-muted)" }} className="leading-relaxed">
              In Deutschland 1–3 Werktage mit DHL. In Österreich und der Schweiz 2–5 Werktage. Versandkostenfrei ab 60&nbsp;€ Warenkorb oder dauerhaft im Spar-Abo.
            </p>
          </div>
          <div>
            <h2 className="serif text-2xl mb-3">Wie funktioniert das Spar-Abo?</h2>
            <p style={{ color: "var(--color-muted)" }} className="leading-relaxed">
              Sie wählen Ihren Liefer-Rhythmus (alle 30, 90 oder 180 Tage) und erhalten dauerhaft Rabatt sowie kostenlosen Versand. Pausieren und Kündigen jederzeit ohne Frist im Kundenkonto möglich.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
