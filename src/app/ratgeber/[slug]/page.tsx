import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ARTICLES, getArticle, getSpokes, ARTICLE_BY_SLUG } from "@/lib/ratgeber";
import { PRODUCTS } from "@/lib/products";
import { EfsaDisclaimer } from "@/components/sections/efsa-disclaimer";
import { ExerciseWidget } from "@/components/ratgeber/exercise-widget";
import { SelfTestWidget } from "@/components/ratgeber/self-test-widget";
import { SELF_TESTS } from "@/content/ratgeber/self-tests";

const SITE = "https://www.nutra-sana.de";
const AUTHOR = "Jonas Gütermann";
const AUTHOR_TITLE = "Approbierter Pharmazeut";

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  const url = `/ratgeber/${article.slug}`;
  return {
    title: article.title,
    description: article.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      locale: "de_DE",
      siteName: "Nutrasana",
      url,
      title: article.title,
      description: article.metaDescription,
      images: [{ url: `/products/${article.productSlug}/solo.png` }],
    },
  };
}

export default async function RatgeberArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();
  const product = PRODUCTS[article.productSlug];
  const selfTest = SELF_TESTS[article.productSlug];
  const pillar = article.pillarSlug ? getArticle(article.pillarSlug) : undefined;
  const spokes = article.pillarSlug ? [] : getSpokes(article.slug);

  // Multi-Typ Article + MedicalWebPage: lastReviewed/reviewedBy machen die
  // fachliche Pruefung fuer YMYL maschinenlesbar (Bing/Google/KI-Suchen).
  const articleLd = {
    "@context": "https://schema.org",
    "@type": ["Article", "MedicalWebPage"],
    headline: article.title,
    description: article.metaDescription,
    image: [`${SITE}/products/${article.productSlug}/solo.png`],
    datePublished: article.updated,
    dateModified: article.updated,
    lastReviewed: article.updated,
    reviewedBy: {
      "@type": "Person",
      name: AUTHOR,
      jobTitle: AUTHOR_TITLE,
      url: "https://ratgeber.nutra-sana.de/ratgeber/autor/jonas-guetermann",
    },
    inLanguage: "de-DE",
    author: {
      "@type": "Person",
      name: AUTHOR,
      jobTitle: AUTHOR_TITLE,
      url: "https://ratgeber.nutra-sana.de/ratgeber/autor/jonas-guetermann",
    },
    ...(article.keyFacts && article.keyFacts.length > 0
      ? { abstract: article.keyFacts.join(" ") }
      : {}),
    publisher: { "@id": `${SITE}/#organization` },
    mainEntityOfPage: `${SITE}/ratgeber/${article.slug}`,
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: article.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      <article className="py-8 sm:py-14">
        <div className="container-content max-w-3xl">
          {/* Breadcrumb */}
          <nav className="text-xs text-muted mb-6">
            <Link href="/ratgeber" className="hover:opacity-70">
              Ratgeber
            </Link>{" "}
            <span aria-hidden>/</span>{" "}
            {pillar ? (
              <Link href={`/ratgeber/${pillar.slug}`} className="hover:opacity-70">
                {article.eyebrow}
              </Link>
            ) : (
              <span>{article.eyebrow}</span>
            )}
          </nav>

          {/* Header */}
          <div className="eyebrow mb-3">{article.eyebrow}</div>
          <h1 className="serif text-3xl sm:text-4xl lg:text-5xl leading-[1.1] mb-4">
            {article.title}
          </h1>
          <div className="flex items-center gap-2 text-sm text-muted mb-8">
            <Link
              href="/ratgeber/autor/jonas-guetermann"
              className="font-medium hover:underline underline-offset-4"
              style={{ color: "var(--color-ink-soft)" }}
            >
              {AUTHOR}
            </Link>
            <span aria-hidden>·</span>
            <span>{AUTHOR_TITLE}</span>
            <span aria-hidden>·</span>
            <span>Aktualisiert {formatDate(article.updated)}</span>
          </div>

          {/* Hero-Bild (optional pro Artikel) */}
          {article.heroImage && (
            <div className="mb-10 rounded-2xl overflow-hidden" style={{ aspectRatio: "16 / 9" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.heroImage}
                alt={article.title}
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
          )}

          {/* Das Wichtigste in Kürze: zitierfähiger Antwortblock für KI-Suchen */}
          {article.keyFacts && article.keyFacts.length > 0 && (
            <section
              className="mb-10 rounded-2xl p-6 sm:p-7"
              style={{ background: "var(--color-cream)", border: "1px solid rgba(12,43,99,0.14)" }}
            >
              <h2
                className="text-xs uppercase tracking-widest font-semibold mb-4"
                style={{ color: "var(--color-navy)" }}
              >
                Das Wichtigste in Kürze
              </h2>
              <ul className="space-y-3">
                {article.keyFacts.map((fact, i) => (
                  <li key={i} className="flex gap-3 leading-relaxed">
                    <span
                      aria-hidden
                      className="flex-none mt-[7px] w-2 h-2 rounded-full"
                      style={{ background: "var(--color-indigo)" }}
                    />
                    <span style={{ color: "var(--color-ink)" }}>{fact}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Intro */}
          <div className="space-y-4 text-lg leading-relaxed mb-10" style={{ color: "var(--color-ink-soft)" }}>
            {article.intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {/* Sections */}
          <div className="space-y-10">
            {article.sections.map((s, i) => (
              <section key={i}>
                <h2 className="serif text-2xl sm:text-3xl leading-tight mb-4">{s.heading}</h2>
                <div className="space-y-4 leading-relaxed">
                  {s.paragraphs.map((p, j) => (
                    <p key={j}>{p}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Mitmach-Uebungen */}
          {article.exercises && article.exercises.length > 0 && (
            <section className="mt-12">
              <h2 className="serif text-2xl sm:text-3xl leading-tight mb-2">
                Direkt ausprobieren
              </h2>
              <p className="text-sm mb-5" style={{ color: "var(--color-muted)" }}>
                Kein Stift, kein Heft: Diese Übungen funktionieren direkt hier auf der Seite.
              </p>
              <ExerciseWidget exercises={article.exercises} />
            </section>
          )}

          {/* Selbsttest: 5 Durchklick-Fragen, Abschlusskarte = Produkt-Bruecke */}
          {selfTest && (
            <section
              className="mt-12 -mx-4 sm:-mx-6 px-4 sm:px-6 py-8 rounded-3xl"
              style={{ background: "var(--color-cream)" }}
            >
              <div className="eyebrow mb-1" style={{ color: "var(--color-indigo)" }}>
                Kurz innehalten
              </div>
              <h2 className="serif text-2xl sm:text-3xl leading-tight mb-5">
                Machen Sie den 30-Sekunden-Selbsttest
              </h2>
              <SelfTestWidget
                test={selfTest}
                productName={product.name}
                productSlug={product.slug}
                articleSlug={article.slug}
              />
            </section>
          )}

          {/* Studienlage — nur auf Pillar-Artikeln (vermeidet Duplicate Content auf Spokes) */}
          {!article.pillarSlug && product.studies?.length > 0 && (
            <section className="mt-12">
              <h2 className="serif text-2xl sm:text-3xl leading-tight mb-2">Studienlage</h2>
              <p className="text-sm text-muted mb-5">{product.scientificIntro}</p>
              <ol className="space-y-3">
                {product.studies.map((st, i) => (
                  <li
                    key={i}
                    className="flex gap-4 p-4 rounded-lg"
                    style={{ background: "var(--color-ivory)", border: "1px solid rgba(0,0,0,0.05)" }}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex-none flex items-center justify-center text-sm font-medium"
                      style={{ background: "var(--color-cream)", color: "var(--color-forest)" }}
                    >
                      {i + 1}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{st.reference}</div>
                      <div className="text-sm text-muted mt-1 leading-relaxed">{st.finding}</div>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="text-xs text-muted mt-4 leading-relaxed">
                Die angeführten Studien beziehen sich auf einzelne Inhaltsstoffe und stellen keine
                Aussage über das Endprodukt dar.
              </p>
            </section>
          )}

          {/* Produkt-Support-Box: dezent werblich, mit Social Proof */}
          <aside
            className="mt-12 rounded-2xl overflow-hidden"
            style={{ border: "1px solid rgba(12,43,99,0.16)" }}
          >
            <div
              className="px-6 py-3 text-xs uppercase tracking-widest font-medium"
              style={{ background: "var(--color-navy)", color: "#fff" }}
            >
              Unterstützung aus der Apotheken-Rezeptur
            </div>
            <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6" style={{ background: "#fff" }}>
              <div
                className="w-28 h-28 rounded-xl flex-none overflow-hidden"
                style={{ background: "var(--color-cream)" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/products/${product.slug}/solo.png`}
                  alt={product.name}
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="serif text-2xl leading-tight" style={{ color: "var(--color-navy)" }}>
                  {product.name}
                </div>
                <div className="flex items-center gap-2 mt-1.5 text-sm">
                  <span aria-hidden style={{ color: "#f2b01e", letterSpacing: "1px" }}>★★★★★</span>
                  <span className="font-semibold" style={{ color: "var(--color-ink)" }}>4,7/5</span>
                  <span style={{ color: "var(--color-muted)" }}>· über 3.500 zufriedene Kundinnen und Kunden</span>
                </div>
                <p className="text-sm mt-2 leading-relaxed" style={{ color: "var(--color-ink-soft)" }}>
                  {product.name} wurde von approbierten Pharmazeuten entwickelt, um Menschen genau bei
                  diesem Thema im Alltag zu begleiten: 1 Kapsel täglich, PZN-registriert, in Deutschland
                  hergestellt und mit 90 Tagen Geld-zurück-Garantie.
                </p>
              </div>
              <a
                href={`https://www.nutra-sana.de/products/${product.slug}?utm_source=ratgeber&utm_medium=content&utm_campaign=${article.slug}`}
                className="flex-none py-3.5 px-7 rounded-full font-semibold text-sm whitespace-nowrap"
                style={{ background: "var(--color-navy)", color: "#fff" }}
              >
                {product.name} ansehen
              </a>
            </div>
          </aside>

          {/* Interne Verlinkung: Lesen Sie auch */}
          {article.relatedSlugs && article.relatedSlugs.length > 0 && (
            <section className="mt-12">
              <h2 className="serif text-2xl sm:text-3xl leading-tight mb-5">Lesen Sie auch</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {article.relatedSlugs.map((slug) => {
                  const rel = ARTICLE_BY_SLUG[slug];
                  if (!rel) return null;
                  return (
                    <Link
                      key={slug}
                      href={`/ratgeber/${rel.slug}`}
                      className="group block rounded-2xl overflow-hidden transition hover:opacity-95"
                      style={{ background: "#fff", border: "1px solid rgba(12,43,99,0.14)" }}
                    >
                      <div className="overflow-hidden" style={{ aspectRatio: "16 / 9", background: "var(--color-cream)" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={rel.heroImage ?? `/ratgeber-img/thema-${rel.productSlug}.png`}
                          alt={rel.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-[1.03]"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-4">
                        <div className="text-xs uppercase tracking-widest text-muted mb-1">{rel.eyebrow}</div>
                        <div className="serif text-lg leading-tight group-hover:underline underline-offset-4">
                          {rel.title}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* FAQ */}
          {article.faq.length > 0 && (
            <section className="mt-12">
              <h2 className="serif text-2xl sm:text-3xl leading-tight mb-5">Häufige Fragen</h2>
              <div style={{ borderTop: "1px solid rgba(12,43,99,0.14)" }}>
                {article.faq.map((f, i) => (
                  <details
                    key={i}
                    className="group"
                    style={{ borderBottom: "1px solid rgba(12,43,99,0.14)" }}
                  >
                    <summary
                      className="serif flex items-center gap-3 cursor-pointer list-none py-5 pr-2 text-lg font-bold"
                      style={{ color: "var(--color-navy)" }}
                    >
                      <span
                        aria-hidden
                        className="flex-none w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{ border: "1.6px solid var(--color-navy)", fontFamily: "var(--font-sans)" }}
                      >
                        ?
                      </span>
                      <span className="flex-1">{f.q}</span>
                      <span
                        aria-hidden
                        className="transition-transform group-open:rotate-180"
                        style={{ color: "var(--color-muted)" }}
                      >
                        ⌄
                      </span>
                    </summary>
                    <p
                      className="text-base leading-relaxed pb-5"
                      style={{ color: "var(--color-ink-soft)", paddingLeft: "40px" }}
                    >
                      {f.a}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* Weitere Ratgeber zum Thema — Spokes (nur auf Pillar-Artikeln) */}
          {spokes.length > 0 && (
            <section className="mt-12">
              <h2 className="serif text-2xl sm:text-3xl leading-tight mb-5">
                Weitere Ratgeber zum Thema
              </h2>
              <ul className="space-y-2">
                {spokes.map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={`/ratgeber/${s.slug}`}
                      className="text-base hover:underline underline-offset-4"
                      style={{ color: "var(--color-forest)" }}
                    >
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </article>

      <EfsaDisclaimer />
    </>
  );
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}
