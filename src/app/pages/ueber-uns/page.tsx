import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Über Elatera",
  description: "Elatera entwickelt wissenschaftlich fundierte Nahrungsergänzung für die echten Bedürfnisse ab 55 — entwickelt von Apothekern, hergestellt in Deutschland.",
};

export default function UeberUnsPage() {
  return (
    <div className="py-16 sm:py-24">
      <div className="container-content max-w-3xl">
        <div className="eyebrow mb-3">Über uns</div>
        <h1 className="serif text-4xl sm:text-6xl leading-tight mb-8">
          Gesundheit, einfach gemacht.
        </h1>

        <div className="prose-content space-y-6 text-lg leading-relaxed" style={{ color: "var(--color-ink-soft)" }}>
          <p>
            Elatera entstand aus einer einfachen Beobachtung: Der Markt für Nahrungsergänzung wird entweder von schreiender Anti-Aging-Werbung beherrscht — oder von trockenen Pharmaprodukten, die keinen Menschen ansprechen.
          </p>
          <p>
            Wir glauben, dass es zwischen diesen beiden Extremen einen ruhigeren, ehrlicheren Weg gibt. Einen Weg, der die echten Themen ernst nimmt — Gleichgewicht, Beweglichkeit, Schlaf — und dabei ohne falsche Versprechen auskommt.
          </p>

          <h2 className="serif text-3xl mt-12 mb-4" style={{ color: "var(--color-ink)" }}>
            Unsere drei Versprechen
          </h2>
          <ol className="space-y-4 list-decimal pl-5">
            <li>
              <span className="font-medium" style={{ color: "var(--color-ink)" }}>Wissenschaft zuerst.</span> Unsere Produkte wurden auf aktuellsten wissenschaftlichen Studien und Erkenntnissen aufgebaut. Jede Rezeptur ist sorgfältig durchdacht.
            </li>
            <li>
              <span className="font-medium" style={{ color: "var(--color-ink)" }}>Apotheker-Qualität.</span> Jede Rezeptur wird von approbierten Apothekern entwickelt und getestet. Jedes Produkt erhält eine eigene PZN.
            </li>
            <li>
              <span className="font-medium" style={{ color: "var(--color-ink)" }}>Made in Germany, wirklich.</span> Produktion ausschließlich in FSSC-22000-zertifizierten Anlagen in Deutschland. Kein Outsourcing, kein Greenwashing.
            </li>
          </ol>

          <h2 className="serif text-3xl mt-12 mb-4" style={{ color: "var(--color-ink)" }}>
            Was Elatera einzigartig macht
          </h2>
          <p>
            Drei sorgfältig formulierte Produkte für konkrete Anliegen — Balance für innere Sicherheit und Gleichgewicht, Mobil für tägliche Beweglichkeit und Nox für ruhige Nächte. Wir wollen nichts beheben, was die Natur nicht vorgesehen hat. Aber wir möchten Ihnen die bestmögliche, ehrliche Unterstützung für Ihr Wohlbefinden geben.
          </p>
          <p>
            Wir freuen uns, dass Sie hier sind.
          </p>
        </div>
      </div>
    </div>
  );
}
