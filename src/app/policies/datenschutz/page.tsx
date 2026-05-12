import type { Metadata } from "next";

export const metadata: Metadata = { title: "Datenschutzerklärung" };

export default function Page() {
  return (
    <div className="py-16 sm:py-20">
      <div className="container-content max-w-2xl">
        <div className="eyebrow mb-3">Rechtliches</div>
        <h1 className="serif text-4xl sm:text-5xl leading-tight mb-6">Datenschutzerklärung</h1>
        <p className="text-muted leading-relaxed mb-8">Diese Datenschutzerklärung informiert Sie über Art, Umfang und Zweck der Verarbeitung personenbezogener Daten.</p>

        <div className="rounded-lg p-5 mb-10" style={{ background: "var(--color-cream)" }}>
          <p className="text-sm leading-relaxed">
            <strong>V0-Hinweis:</strong> Dieser Text ist ein Platzhalter und wird mit Verfügbarkeit der Produkte durch
            rechtssichere Texte (eRecht24 / Trusted Shops) ersetzt. Solange unser Shop im
            Wartelisten-Modus läuft, findet kein Verkauf statt.
          </p>
        </div>

        <h2 className="serif text-2xl mb-3">Verantwortlich</h2>
        <p className="text-muted leading-relaxed mb-6">
          [Platzhalter — Privatperson in der V0-Phase]<br />
          Anschrift auf Anfrage<br />
          E-Mail: kontakt@nutrasana.de
        </p>

        <h2 className="serif text-2xl mb-3">Haftung</h2>
        <p className="text-muted leading-relaxed">
          Trotz sorgfältiger Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links.
          Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.
        </p>
      </div>
    </div>
  );
}
