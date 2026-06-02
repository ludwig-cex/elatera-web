import type { Metadata } from "next";
import Link from "next/link";
import { PRODUCTS } from "@/lib/products";

export const metadata: Metadata = {
  title: "Über Nutrasana",
  description:
    "Nutrasana entwickelt ehrliche Nahrungsergänzung für die Themen, die im Alltag zählen — gemeinsam mit Apothekern entwickelt, in Deutschland hergestellt und laborgeprüft.",
};

const PROMISES = [
  {
    title: "Wissenschaft zuerst.",
    body: "Jede Rezeptur baut auf den in der EU zugelassenen Health-Claims der enthaltenen Nährstoffe auf. Wir sagen nichts zu, was wir nicht belegen können.",
  },
  {
    title: "Apotheker-Qualität.",
    body: "Entwickelt und geprüft mit approbierten Apothekern. Jedes Produkt bekommt eine eigene Pharmazentralnummer (PZN) — wie man es aus der Apotheke kennt.",
  },
  {
    title: "Wirklich Made in Germany.",
    body: "Produktion ausschließlich in FSSC-22000-zertifizierten Anlagen in Deutschland, jede Charge laborgeprüft. Kein Outsourcing, kein Greenwashing.",
  },
];

export default function UeberUnsPage() {
  const products = Object.values(PRODUCTS);

  return (
    <div className="py-16 sm:py-24">
      <div className="container-content max-w-3xl">
        <div className="eyebrow mb-3">Über uns</div>
        <h1 className="serif text-4xl sm:text-6xl leading-tight mb-8">
          Gesundheit, einfach gemacht.
        </h1>

        <div
          className="prose-content space-y-6 text-lg leading-relaxed"
          style={{ color: "var(--color-ink-soft)" }}
        >
          <p>
            Nutrasana ist aus einer einfachen Beobachtung entstanden:
            Nahrungsergänzung wird meist entweder mit lauter Anti-Aging-Werbung
            verkauft — oder als nüchternes Pharmaprodukt, das niemanden erreicht.
            Wir wollten einen dritten Weg: ehrlich, ruhig und nah an den Themen,
            die im Alltag wirklich zählen.
          </p>
          <p>
            Dafür arbeiten wir mit approbierten Apothekern zusammen, formulieren
            in relevanten Dosierungen statt symbolischer Prisen und lassen
            ausschließlich in Deutschland produzieren. Kein Wundermittel-Versprechen,
            sondern nachvollziehbare Unterstützung, der man vertrauen kann.
          </p>

          <h2 className="serif text-3xl mt-12 mb-4" style={{ color: "var(--color-ink)" }}>
            Unsere drei Versprechen
          </h2>
          <ol className="space-y-4 list-decimal pl-5">
            {PROMISES.map((p) => (
              <li key={p.title}>
                <span className="font-medium" style={{ color: "var(--color-ink)" }}>
                  {p.title}
                </span>{" "}
                {p.body}
              </li>
            ))}
          </ol>

          <h2 className="serif text-3xl mt-12 mb-4" style={{ color: "var(--color-ink)" }}>
            Ein Sortiment, das mitgewachsen ist
          </h2>
          <p>
            Angefangen haben wir mit einer Handvoll Rezepturen. Heute deckt
            Nutrasana {products.length} konkrete Anliegen ab — jedes als
            eigenständige Intense-Formel, eine Kapsel am Tag:
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 mt-6">
          {products.map((p) => (
            <Link
              key={p.slug}
              href={`/products/${p.slug}`}
              className="block rounded-xl px-5 py-4 transition hover:opacity-90"
              style={{
                background: "var(--color-cream)",
                border: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              <div className="serif text-xl leading-tight" style={{ color: "var(--color-ink)" }}>
                {p.name}
              </div>
              <div className="text-sm mt-0.5" style={{ color: "var(--color-ink-soft)" }}>
                {p.tagline}
              </div>
            </Link>
          ))}
        </div>

        <div
          className="prose-content space-y-6 text-lg leading-relaxed mt-12"
          style={{ color: "var(--color-ink-soft)" }}
        >
          <h2 className="serif text-3xl mb-4" style={{ color: "var(--color-ink)" }}>
            Eine Kapsel statt eines Schranks voller Döschen
          </h2>
          <p>
            Hinter jeder Formel steckt derselbe Gedanke: pflanzliche Klassiker
            aus der Apothekentradition zusammen mit den Mikronährstoffen, deren
            Beitrag in der EU anerkannt ist — durchdacht kombiniert und sauber
            dosiert. Statt fünf Einzelpräparate eine Kapsel, die zusammenpasst.
          </p>
          <p>
            Eines bleibt uns wichtig, auch wenn es selten jemand so offen sagt:
            Ein Nahrungsergänzungsmittel ersetzt keine ausgewogene Ernährung und
            keinen ärztlichen Rat. Was es kann, ist eine ehrliche, alltagstaugliche
            Unterstützung. Genau dafür gibt es Nutrasana.
          </p>
          <p>Schön, dass Sie hier sind.</p>
        </div>
      </div>
    </div>
  );
}
