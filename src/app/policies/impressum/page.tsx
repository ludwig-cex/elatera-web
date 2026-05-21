import type { Metadata } from "next";

export const metadata: Metadata = { title: "Impressum" };

export default function Page() {
  return (
    <div className="py-16 sm:py-20">
      <div className="container-content max-w-2xl">
        <div className="eyebrow mb-3">Rechtliches</div>
        <h1 className="serif text-4xl sm:text-5xl leading-tight mb-6">Impressum</h1>
        <p className="text-muted leading-relaxed mb-8">Angaben gemäß § 5 DDG (Digitale-Dienste-Gesetz).</p>

        <div className="rounded-lg p-5 mb-10" style={{ background: "var(--color-cream)" }}>
          <p className="text-sm leading-relaxed">
            <strong>Hinweis:</strong> Die mit <code>[PLATZHALTER]</code> markierten Felder müssen vor
            Schaltung bezahlter Werbung mit den echten Daten des Betreibers ausgefüllt werden.
            Aktuell findet kein Verkauf statt — es werden lediglich unverbindliche
            Vorab-Interessensbekundungen erfasst.
          </p>
        </div>

        <h2 className="serif text-2xl mb-3">Diensteanbieter</h2>
        <p className="text-muted leading-relaxed mb-6">
          [PLATZHALTER — Firmierung / Name]<br />
          [PLATZHALTER — Straße und Hausnummer]<br />
          [PLATZHALTER — PLZ und Ort]<br />
          [PLATZHALTER — Land]
        </p>

        <h2 className="serif text-2xl mb-3">Vertreten durch</h2>
        <p className="text-muted leading-relaxed mb-6">
          [PLATZHALTER — vertretungsberechtigte Person(en), z.&nbsp;B. Geschäftsführer:in]
        </p>

        <h2 className="serif text-2xl mb-3">Kontakt</h2>
        <p className="text-muted leading-relaxed mb-6">
          Telefon: [PLATZHALTER]<br />
          E-Mail: [PLATZHALTER — z.&nbsp;B. kontakt@nutra-sana.de]
        </p>

        <h2 className="serif text-2xl mb-3">Registereintrag</h2>
        <p className="text-muted leading-relaxed mb-6">
          Registergericht: [PLATZHALTER]<br />
          Registernummer: [PLATZHALTER — z.&nbsp;B. HRB&nbsp;…]
        </p>

        <h2 className="serif text-2xl mb-3">Umsatzsteuer-Identifikationsnummer</h2>
        <p className="text-muted leading-relaxed mb-6">
          USt-IdNr. gemäß § 27&nbsp;a UStG: [PLATZHALTER]
        </p>

        <h2 className="serif text-2xl mb-3">Inhaltlich verantwortlich</h2>
        <p className="text-muted leading-relaxed mb-6">
          Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV:<br />
          [PLATZHALTER — Name und Anschrift]
        </p>

        <h2 className="serif text-2xl mb-3">EU-Streitschlichtung</h2>
        <p className="text-muted leading-relaxed mb-6">
          Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
          <a
            href="https://ec.europa.eu/consumers/odr/"
            className="underline"
            rel="noopener noreferrer"
            target="_blank"
          >
            https://ec.europa.eu/consumers/odr/
          </a>
          . Wir sind nicht verpflichtet und nicht bereit, an einem Streitbeilegungsverfahren
          vor einer Verbraucherschlichtungsstelle teilzunehmen. [Bei Verkaufsstart prüfen.]
        </p>

        <h2 className="serif text-2xl mb-3">Haftung für Inhalte und Links</h2>
        <p className="text-muted leading-relaxed">
          Trotz sorgfältiger Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links.
          Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.
        </p>
      </div>
    </div>
  );
}
