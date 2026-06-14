import type { Metadata } from "next";

export const metadata: Metadata = { title: "Impressum" };

export default function Page() {
  return (
    <div className="py-16 sm:py-20">
      <div className="container-content max-w-2xl">
        <div className="eyebrow mb-3">Rechtliches</div>
        <h1 className="serif text-4xl sm:text-5xl leading-tight mb-6">Impressum</h1>
        <p className="text-muted leading-relaxed mb-8">
          Angaben gemäß § 5 DDG (Digitale-Dienste-Gesetz).
        </p>

        <h2 className="serif text-2xl mb-3">Diensteanbieter</h2>
        <p className="text-muted leading-relaxed mb-6">
          HEALTH POINT MEDIA LTD
          <br />
          Suite A Bank House, 81 Judes Road
          <br />
          Egham, TW20 0DF, United Kingdom
        </p>

        <h2 className="serif text-2xl mb-3">Vertretungsberechtigte Person</h2>
        <p className="text-muted leading-relaxed mb-6">Laura Schneider</p>

        <h2 className="serif text-2xl mb-3">Kontakt</h2>
        <p className="text-muted leading-relaxed mb-6">
          E-Mail: kundenservice@nutrasana.de
        </p>

        <h2 className="serif text-2xl mb-3">Registereintrag</h2>
        <p className="text-muted leading-relaxed">
          Company number: 16678730 (Companies House, United Kingdom)
          <br />
          USt-IdNr.: GB 123 456 789
        </p>
      </div>
    </div>
  );
}
