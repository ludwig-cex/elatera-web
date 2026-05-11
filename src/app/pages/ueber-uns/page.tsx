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
          Älterwerden, ohne Theater.
        </h1>

        <div className="prose-content space-y-6 text-lg leading-relaxed" style={{ color: "var(--color-ink-soft)" }}>
          <p>
            Elatera entstand aus einer einfachen Beobachtung: Der Markt für Nahrungsergänzung ab 55 wird entweder von schreiender Anti-Aging-Werbung beherrscht — oder von trockenen Pharmaprodukten, die keinen Menschen ansprechen.
          </p>
          <p>
            Wir glauben, dass es zwischen diesen beiden Extremen einen ruhigeren, ehrlicheren Weg gibt. Einen Weg, der die echten Themen ernst nimmt — Gleichgewicht, Beweglichkeit, Schlaf — und dabei ohne falsche Versprechen auskommt.
          </p>

          <h2 className="serif text-3xl mt-12 mb-4" style={{ color: "var(--color-ink)" }}>
            Unsere drei Versprechen
          </h2>
          <ol className="space-y-4 list-decimal pl-5">
            <li>
              <span className="font-medium text-ink">Wissenschaft zuerst.</span> Alle unsere Health-Claims sind EFSA-konform. Was wir nicht sagen dürfen, sagen wir nicht.
            </li>
            <li>
              <span className="font-medium text-ink">Apotheker-Qualität.</span> Jede Rezeptur wird von approbierten Apothekern entwickelt und getestet. Jede Charge erhält eine eigene PZN.
            </li>
            <li>
              <span className="font-medium text-ink">Made in Germany, wirklich.</span> Produktion ausschließlich in FSSC-22000-zertifizierten Anlagen in Deutschland. Kein Outsourcing, kein Greenwashing.
            </li>
          </ol>

          <h2 className="serif text-3xl mt-12 mb-4" style={{ color: "var(--color-ink)" }}>
            Was als Nächstes kommt
          </h2>
          <p>
            Aktuell bauen wir unser Sortiment vorsichtig auf. Die Premiere unserer ersten drei Produkte — Balance, Mobil und Nox — startet im Sommer 2026. Wer sich heute auf die Warteliste setzt, erhält zum Launch einen exklusiven Vorteil.
          </p>
          <p>
            Wir freuen uns, Sie an Bord zu haben.
          </p>
        </div>
      </div>
    </div>
  );
}
