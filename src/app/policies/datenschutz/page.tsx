import type { Metadata } from "next";

export const metadata: Metadata = { title: "Datenschutzerklärung" };

export default function Page() {
  return (
    <div className="py-16 sm:py-20">
      <div className="container-content max-w-2xl">
        <div className="eyebrow mb-3">Rechtliches</div>
        <h1 className="serif text-4xl sm:text-5xl leading-tight mb-6">Datenschutzerklärung</h1>
        <p className="text-muted leading-relaxed mb-8">
          Diese Datenschutzerklärung informiert Sie über Art, Umfang und Zweck der Verarbeitung
          personenbezogener Daten auf dieser Website.
        </p>

        <h2 className="serif text-2xl mb-3">Verantwortlicher</h2>
        <p className="text-muted leading-relaxed mb-6">
          HEALTH POINT MEDIA LTD<br />
          Laura Schneider<br />
          Suite A Bank House, 81 Judes Road<br />
          Egham, TW20 0DF, United Kingdom<br />
          E-Mail: kundenservice@nutra-sana.de
        </p>

        <h2 className="serif text-2xl mb-3">Hosting</h2>
        <p className="text-muted leading-relaxed mb-6">
          Diese Website wird bei der Vercel Inc. (USA) gehostet. Beim Aufruf werden technisch
          notwendige Server-Logdaten (u.&nbsp;a. gekürzte IP-Adresse, Zeitpunkt, abgerufene Seite,
          User-Agent) verarbeitet. Rechtsgrundlage ist das berechtigte Interesse am sicheren und
          stabilen Betrieb (Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;f DSGVO). Mit Vercel besteht ein
          Auftragsverarbeitungsvertrag; Datenübermittlung in die USA auf Basis der
          EU-Standardvertragsklauseln.
        </p>

        <h2 className="serif text-2xl mb-3">Reichweitenmessung (anonym, cookielos)</h2>
        <p className="text-muted leading-relaxed mb-6">
          Zur statistischen Auswertung der Nutzung setzen wir <strong>Vercel Web Analytics</strong>{" "}
          sowie <strong>PostHog</strong> (EU-Hosting) ein. Beide Dienste sind so konfiguriert, dass
          <strong> keine Cookies</strong> gesetzt werden und <strong>keine personenbezogenen
          Profile</strong> gebildet werden (kein geräteübergreifender Identifier). Es werden nur
          aggregierte, anonyme Nutzungsereignisse erfasst. Rechtsgrundlage ist unser berechtigtes
          Interesse an einer reichweitenstarken, datensparsamen Statistik
          (Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;f DSGVO).
        </p>

        <h2 className="serif text-2xl mb-3">Vorab-Registrierung / E-Mail-Erfassung</h2>
        <p className="text-muted leading-relaxed mb-6">
          Wenn Sie sich für eine Benachrichtigung bei Verfügbarkeit eintragen, verarbeiten wir die
          von Ihnen angegebene E-Mail-Adresse sowie die von Ihnen ausgewählten Produkt-/
          Bündelangaben. Zweck ist die einmalige Benachrichtigung sowie die Messung des
          Interesses vor Markteinführung. Rechtsgrundlage ist Ihre Einwilligung
          (Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;a DSGVO), die Sie jederzeit mit Wirkung für die
          Zukunft widerrufen können. Die Verarbeitung erfolgt über den Dienstleister{" "}
          <strong>Klaviyo</strong> (Klaviyo, Inc., USA). Es besteht ein
          Auftragsverarbeitungsvertrag; die Datenübermittlung in die USA erfolgt auf Basis der
          EU-Standardvertragsklauseln. Eine Weitergabe zu anderen Zwecken erfolgt nicht.
          Speicherung bis zum Widerruf Ihrer Einwilligung.
        </p>

        <h2 className="serif text-2xl mb-3">Ihre Rechte</h2>
        <p className="text-muted leading-relaxed mb-6">
          Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung,
          Datenübertragbarkeit und Widerspruch sowie das Recht, eine erteilte Einwilligung zu
          widerrufen. Zudem besteht ein Beschwerderecht bei einer Datenschutz-Aufsichtsbehörde.
          Anfragen richten Sie bitte an: kundenservice@nutra-sana.de.
        </p>

        <h2 className="serif text-2xl mb-3">Haftung für Links</h2>
        <p className="text-muted leading-relaxed">
          Trotz sorgfältiger Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links.
          Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.
        </p>
      </div>
    </div>
  );
}
