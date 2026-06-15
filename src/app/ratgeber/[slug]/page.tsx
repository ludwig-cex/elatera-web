import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ARTICLES, getArticle } from "@/lib/ratgeber";
import { PRODUCTS } from "@/lib/products";
import { EfsaDisclaimer } from "@/components/sections/efsa-disclaimer";

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

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.metaDescription,
    image: [`${SITE}/products/${article.productSlug}/solo.png`],
    datePublished: article.updated,
    dateModified: article.updated,
    inLanguage: "de-DE",
    author: {
      "@type": "Person",
      name: AUTHOR,
      jobTitle: AUTHOR_TITLE,
    },
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
            <span aria-hidden>/</span> <span>{article.eyebrow}</span>
          </nav>

          {/* Header */}
          <div className="eyebrow mb-3">{article.eyebrow}</div>
          <h1 className="serif text-3xl sm:text-4xl lg:text-5xl leading-[1.1] mb-4">
            {article.title}
          </h1>
          <div className="flex items-center gap-2 text-sm text-muted mb-8">
            <span className="font-medium" style={{ color: "var(--color-ink-soft)" }}>
              {AUTHOR}
            </span>
            <span aria-hidden>·</span>
            <span>{AUTHOR_TITLE}</span>
            <span aria-hidden>·</span>
            <span>Aktualisiert {formatDate(article.updated)}</span>
          </div>

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

          {/* Studienlage — aus den Produktdaten */}
          {product.studies?.length > 0 && (
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

          {/* Produkt-CTA */}
          <aside
            className="mt-12 p-6 rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-5"
            style={{ background: "var(--color-cream)" }}
          >
            <div
              className="w-20 h-20 rounded-lg flex-none overflow-hidden"
              style={{ background: "var(--color-ivory)" }}
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
              <div className="text-xs uppercase tracking-widest text-muted mb-1">
                Passend zum Thema
              </div>
              <div className="serif text-xl leading-tight">{product.name}</div>
              <p className="text-sm text-muted mt-1">{product.hero.subheadline}</p>
            </div>
            <Link
              href={`/products/${product.slug}`}
              className="flex-none py-3 px-6 rounded-lg font-medium text-sm whitespace-nowrap"
              style={{ background: "var(--color-forest)", color: "var(--color-on-dark)" }}
            >
              {product.name} ansehen
            </Link>
          </aside>

          {/* FAQ */}
          {article.faq.length > 0 && (
            <section className="mt-12">
              <h2 className="serif text-2xl sm:text-3xl leading-tight mb-5">Häufige Fragen</h2>
              <div className="space-y-4">
                {article.faq.map((f, i) => (
                  <div key={i}>
                    <h3 className="font-medium mb-1">{f.q}</h3>
                    <p className="text-sm leading-relaxed text-muted">{f.a}</p>
                  </div>
                ))}
              </div>
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
