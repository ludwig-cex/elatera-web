import Link from "next/link";
import type { Metadata } from "next";
import { PILLARS, getSpokes, ARTICLES } from "@/lib/ratgeber";

// Autorenseite = zentrales E-E-A-T-Signal für den YMYL-Ratgeber: jede
// Artikel-Byline verlinkt hierher, das Person-Schema macht den Autor für
// Google/Bing/KI-Suchmaschinen als Entität greifbar.
const RATGEBER = "https://ratgeber.nutra-sana.de";

export const metadata: Metadata = {
  title: "Jonas Gütermann, approbierter Pharmazeut — Autor des Nutrasana-Ratgebers",
  description:
    "Jonas Gütermann ist approbierter Pharmazeut und verantwortet die redaktionellen Gesundheitsinhalte des Nutrasana-Ratgebers: verständlich, EFSA-konform und mit Blick auf die Studienlage.",
  alternates: { canonical: "/ratgeber/autor/jonas-guetermann" },
};

export default function AutorPage() {
  const profileLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      "@id": `${RATGEBER}/ratgeber/autor/jonas-guetermann#person`,
      name: "Jonas Gütermann",
      jobTitle: "Approbierter Pharmazeut",
      description:
        "Approbierter Pharmazeut, verantwortlich für die redaktionellen Gesundheitsinhalte und die fachliche Prüfung der Rezepturen bei Nutrasana.",
      url: `${RATGEBER}/ratgeber/autor/jonas-guetermann`,
      worksFor: {
        "@type": "Organization",
        name: "Nutrasana",
        url: "https://www.nutra-sana.de",
      },
      knowsAbout: [
        "Nahrungsergänzungsmittel",
        "Mikronährstoffe",
        "Gesundheit im Alter",
        "Gedächtnis und Konzentration",
        "Schlaf",
        "Gelenke und Beweglichkeit",
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profileLd) }}
      />

      <div className="py-8 sm:py-14">
        <div className="container-content max-w-3xl">
          <nav className="text-xs text-muted mb-6">
            <Link href="/ratgeber" className="hover:opacity-70">
              Ratgeber
            </Link>{" "}
            <span aria-hidden>/</span> <span>Autor</span>
          </nav>

          <div className="eyebrow mb-3">Über den Autor</div>
          <h1 className="serif text-3xl sm:text-4xl lg:text-5xl leading-[1.1] mb-4">
            Jonas Gütermann
          </h1>
          <p className="text-sm font-medium mb-8" style={{ color: "var(--color-indigo)" }}>
            Approbierter Pharmazeut · Redaktionelle Leitung des Nutrasana-Ratgebers
          </p>

          <div className="space-y-4 text-lg leading-relaxed mb-10" style={{ color: "var(--color-ink-soft)" }}>
            <p>
              Jonas Gütermann ist approbierter Pharmazeut und begleitet bei Nutrasana die
              Entwicklung der Rezepturen sowie die redaktionellen Gesundheitsinhalte. Sein
              Anspruch: Gesundheitswissen so zu erklären, dass es im Alltag wirklich
              weiterhilft, ohne falsche Versprechen und ohne Fachchinesisch.
            </p>
            <p>
              Alle Artikel des Ratgebers werden von ihm verfasst oder fachlich geprüft. Dabei
              gelten feste Redaktionsgrundsätze: Aussagen zu Nährstoffen stützen sich auf die
              von der Europäischen Behörde für Lebensmittelsicherheit (EFSA) bestätigten
              Zusammenhänge, Nahrungsergänzungsmittel werden klar von Arzneimitteln abgegrenzt,
              und bei ernsten oder anhaltenden Beschwerden steht in jedem Artikel der Hinweis
              auf das ärztliche Gespräch.
            </p>
          </div>

          {/* Redaktionsgrundsätze als kompakte Karten */}
          <section className="mb-12">
            <h2 className="serif text-2xl sm:text-3xl leading-tight mb-5">
              So arbeitet die Redaktion
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                {
                  t: "EFSA-konform",
                  d: "Nährstoff-Aussagen folgen den offiziell zugelassenen Health Claims der EU.",
                },
                {
                  t: "Studienlage benannt",
                  d: "Wo Forschung zitiert wird, steht die Quelle direkt beim Artikel.",
                },
                {
                  t: "Klare Grenzen",
                  d: "Nahrungsergänzung ersetzt weder Diagnose noch Therapie beim Arzt.",
                },
              ].map((card) => (
                <div
                  key={card.t}
                  className="rounded-2xl p-5"
                  style={{ background: "var(--color-cream)", border: "1px solid rgba(12,43,99,0.14)" }}
                >
                  <div className="font-semibold text-sm mb-1.5" style={{ color: "var(--color-navy)" }}>
                    {card.t}
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--color-ink-soft)" }}>
                    {card.d}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Alle Artikel des Autors, nach Themen gruppiert */}
          <section>
            <h2 className="serif text-2xl sm:text-3xl leading-tight mb-2">
              Alle Artikel von Jonas Gütermann
            </h2>
            <p className="text-sm text-muted mb-6">
              {ARTICLES.length} Ratgeber-Artikel, gruppiert nach Themen.
            </p>
            <div className="space-y-8">
              {PILLARS.map((pillar) => (
                <div key={pillar.slug}>
                  <h3 className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: "var(--color-navy)" }}>
                    {pillar.eyebrow}
                  </h3>
                  <ul className="space-y-2">
                    {[pillar, ...getSpokes(pillar.slug)].map((a) => (
                      <li key={a.slug}>
                        <Link
                          href={`/ratgeber/${a.slug}`}
                          className="text-base hover:underline underline-offset-4"
                          style={{ color: "var(--color-forest)" }}
                        >
                          {a.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
