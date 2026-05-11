import type { Metadata } from "next";
import { PRODUCT_LIST } from "@/lib/products";
import { MapPin, Phone, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Apotheken-Bestellung",
  description: "Alle Elatera-Produkte sind auch über Ihre Stamm-Apotheke bestellbar. Jedes Produkt hat eine eigene Pharmazentralnummer (PZN).",
};

export default function ApothekenPage() {
  return (
    <div className="py-16 sm:py-20">
      <div className="container-content max-w-3xl">
        <div className="eyebrow mb-3">Bestellung über die Apotheke</div>
        <h1 className="serif text-4xl sm:text-5xl leading-tight mb-5">
          Alle Elatera-Produkte sind apothekenfähig
        </h1>
        <p className="text-lg leading-relaxed mb-10" style={{ color: "var(--color-ink-soft)" }}>
          Wenn Sie Ihre Bestellung lieber direkt über Ihre Apotheke vornehmen möchten, ist das problemlos möglich. Jedes Elatera-Produkt verfügt über eine eigene Pharmazentralnummer (PZN), unter der es bei allen großen Pharma-Großhändlern bestellbar ist.
        </p>

        <div
          className="rounded-2xl overflow-hidden mb-10"
          style={{ border: "1px solid rgba(0,0,0,0.08)" }}
        >
          <table className="w-full">
            <thead>
              <tr style={{ background: "var(--color-cream)" }}>
                <th className="text-left p-4 text-sm font-medium">Produkt</th>
                <th className="text-left p-4 text-sm font-medium">PZN</th>
                <th className="text-left p-4 text-sm font-medium hidden sm:table-cell">Packungsgröße</th>
              </tr>
            </thead>
            <tbody>
              {PRODUCT_LIST.map((p) => (
                <tr key={p.slug} style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                  <td className="p-4">
                    <div className="serif text-lg leading-tight">{p.name}</div>
                    <div className="text-xs text-muted">{p.tagline}</div>
                  </td>
                  <td className="p-4 font-mono text-sm">{p.pzn}</td>
                  <td className="p-4 text-sm hidden sm:table-cell">30 Kapseln</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="serif text-2xl mb-4">Für Apotheker-Kollegen</h2>
        <p className="leading-relaxed mb-6" style={{ color: "var(--color-ink-soft)" }}>
          Sie sind Apotheker und möchten Elatera in Ihr Sortiment aufnehmen? Wir freuen uns über Ihre Anfrage und beraten Sie zu unseren Konditionen und unserem Direktbestell-Programm.
        </p>

        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          <a
            href="mailto:apotheken@elatera.de"
            className="rounded-lg p-5 flex items-center gap-4 hover:bg-cream/40 transition"
            style={{ background: "var(--color-ivory)", border: "1px solid rgba(0,0,0,0.06)" }}
          >
            <Mail className="w-5 h-5 flex-none" style={{ color: "var(--color-forest)" }} />
            <div>
              <div className="font-medium text-sm">Per E-Mail</div>
              <div className="text-sm text-muted">apotheken@elatera.de</div>
            </div>
          </a>
          <a
            href="tel:+4900000000000"
            className="rounded-lg p-5 flex items-center gap-4 hover:bg-cream/40 transition"
            style={{ background: "var(--color-ivory)", border: "1px solid rgba(0,0,0,0.06)" }}
          >
            <Phone className="w-5 h-5 flex-none" style={{ color: "var(--color-forest)" }} />
            <div>
              <div className="font-medium text-sm">Telefonisch</div>
              <div className="text-sm text-muted">Telefonnummer folgt zur Premiere</div>
            </div>
          </a>
        </div>

        <div
          className="rounded-lg p-5 flex items-start gap-3"
          style={{ background: "var(--color-balance-bg)" }}
        >
          <MapPin className="w-5 h-5 mt-0.5 flex-none" style={{ color: "var(--color-forest)" }} />
          <div className="text-sm leading-relaxed">
            <span className="font-medium">Beziehbar über:</span> alle großen Pharma-Großhändler (PHOENIX, NOWEDA, GEHE) — ab Premiere 2026.
          </div>
        </div>
      </div>
    </div>
  );
}
