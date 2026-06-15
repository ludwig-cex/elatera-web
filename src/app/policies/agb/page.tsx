import type { Metadata } from "next";

export const metadata: Metadata = { title: "Allgemeine Geschäftsbedingungen" };

export default function Page() {
  return (
    <div className="py-16 sm:py-20">
      <div className="container-content max-w-2xl">
        <div className="eyebrow mb-3">Rechtliches</div>
        <h1 className="serif text-4xl sm:text-5xl leading-tight mb-6">Allgemeine Geschäftsbedingungen</h1>
        <p className="text-muted leading-relaxed mb-8">
          Diese Allgemeinen Geschäftsbedingungen (AGB) regeln das Vertragsverhältnis zwischen der
          nachstehend genannten Anbieterin und Ihnen als Kundin oder Kunde.
        </p>

        <h2 className="serif text-2xl mb-3">§ 1 Geltungsbereich und Anbieterin</h2>
        <p className="text-muted leading-relaxed mb-6">
          Diese AGB gelten für alle Bestellungen, die über unseren Online-Shop unter www.nutra-sana.de
          getätigt werden. Verbraucher ist jede natürliche Person, die ein Rechtsgeschäft zu Zwecken
          abschließt, die überwiegend weder ihrer gewerblichen noch ihrer selbständigen beruflichen
          Tätigkeit zugerechnet werden können.
          <br />
          <br />
          Anbieterin:
          <br />
          HEALTH POINT MEDIA LTD
          <br />
          Laura Schneider
          <br />
          Suite A Bank House, 81 Judes Road
          <br />
          Egham, TW20 0DF, United Kingdom
          <br />
          E-Mail: kundenservice@nutra-sana.de
        </p>

        <h2 className="serif text-2xl mb-3">§ 2 Vertragsschluss</h2>
        <p className="text-muted leading-relaxed mb-6">
          Die Darstellung der Produkte im Online-Shop stellt kein rechtlich bindendes Angebot, sondern
          eine unverbindliche Aufforderung zur Bestellung dar. Mit dem Absenden Ihrer Bestellung über
          den Bestellbutton geben Sie ein verbindliches Angebot zum Kauf der im Warenkorb enthaltenen
          Waren ab. Der Kaufvertrag kommt erst zustande, wenn wir Ihre Bestellung durch eine
          Auftragsbestätigung per E-Mail oder durch Auslieferung der Ware annehmen.
        </p>

        <h2 className="serif text-2xl mb-3">§ 3 Preise und Versandkosten</h2>
        <p className="text-muted leading-relaxed mb-6">
          Alle Preise sind Endpreise und enthalten die gesetzliche Mehrwertsteuer. Etwaige
          Versandkosten werden im Bestellvorgang gesondert ausgewiesen und sind zusätzlich zu den
          angegebenen Produktpreisen zu tragen.
        </p>

        <h2 className="serif text-2xl mb-3">§ 4 Zahlung</h2>
        <p className="text-muted leading-relaxed mb-6">
          Die Zahlung erfolgt über die im Bestellvorgang angebotenen Zahlungsarten. Die
          Zahlungsabwicklung übernimmt unser Zahlungsdienstleister Stripe (Stripe Payments Europe,
          Ltd.).
        </p>

        <h2 className="serif text-2xl mb-3">§ 5 Lieferung</h2>
        <p className="text-muted leading-relaxed mb-6">
          Die Lieferung erfolgt an die von Ihnen angegebene Lieferadresse innerhalb der DACH-Region.
          Über die voraussichtliche Lieferzeit informieren wir im Bestellvorgang. Ist ein bestelltes
          Produkt nicht verfügbar, kommt kein Kaufvertrag zustande; eine bereits erfolgte Zahlung
          beziehungsweise Zahlungsvormerkung wird umgehend wieder freigegeben.
        </p>

        <h2 className="serif text-2xl mb-3">§ 6 Eigentumsvorbehalt</h2>
        <p className="text-muted leading-relaxed mb-6">
          Die gelieferte Ware bleibt bis zur vollständigen Bezahlung unser Eigentum.
        </p>

        <h2 className="serif text-2xl mb-3">§ 7 Widerrufsrecht</h2>
        <p className="text-muted leading-relaxed mb-6">
          Verbrauchern steht ein gesetzliches Widerrufsrecht zu. Die Einzelheiten und die Bedingungen
          ergeben sich aus unserer{" "}
          <a href="/policies/widerruf" className="underline">
            Widerrufsbelehrung
          </a>
          .
        </p>

        <h2 className="serif text-2xl mb-3">§ 8 Gewährleistung</h2>
        <p className="text-muted leading-relaxed mb-6">
          Es gelten die gesetzlichen Bestimmungen der Mängelhaftung.
        </p>

        <h2 className="serif text-2xl mb-3">§ 9 Haftung</h2>
        <p className="text-muted leading-relaxed mb-6">
          Für Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit sowie für Schäden,
          die auf einer vorsätzlichen oder grob fahrlässigen Pflichtverletzung beruhen, haften wir nach
          den gesetzlichen Bestimmungen. Bei der leicht fahrlässigen Verletzung wesentlicher
          Vertragspflichten ist unsere Haftung auf den vorhersehbaren, vertragstypischen Schaden
          begrenzt. Im Übrigen ist die Haftung ausgeschlossen.
        </p>

        <h2 className="serif text-2xl mb-3">§ 10 Online-Streitbeilegung</h2>
        <p className="text-muted leading-relaxed mb-6">
          Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
          <a
            href="https://ec.europa.eu/consumers/odr"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://ec.europa.eu/consumers/odr
          </a>
          . Zur Teilnahme an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
          sind wir nicht verpflichtet und grundsätzlich nicht bereit.
        </p>

        <h2 className="serif text-2xl mb-3">§ 11 Schlussbestimmungen</h2>
        <p className="text-muted leading-relaxed">
          Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts; bei
          Verbrauchern gelten zusätzlich die zwingenden Verbraucherschutzvorschriften ihres
          Aufenthaltsstaates. Sollten einzelne Bestimmungen dieser AGB unwirksam sein, bleibt die
          Wirksamkeit der übrigen Bestimmungen unberührt.
        </p>
      </div>
    </div>
  );
}
