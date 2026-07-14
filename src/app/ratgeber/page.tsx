import type { Metadata } from "next";
import Link from "next/link";
import { ARTICLES, PILLARS } from "@/lib/ratgeber";

export const metadata: Metadata = {
  title: "Ratgeber — Gesundheit & Wohlbefinden ab 55",
  description:
    "Fundierte Ratgeber zu Gelenken, Schlaf, Gedächtnis, Herz, Verdauung und mehr. Von einem approbierten Pharmazeuten verständlich erklärt, mit Studienlage.",
  alternates: { canonical: "/ratgeber" },
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: "Nutrasana",
    url: "/ratgeber",
    title: "Ratgeber — Gesundheit & Wohlbefinden ab 55",
    description:
      "Fundierte Ratgeber zu Gelenken, Schlaf, Gedächtnis, Herz, Verdauung und mehr. Verständlich erklärt, mit Studienlage.",
  },
};

export default function RatgeberHubPage() {
  return (
    <div className="py-10 sm:py-16">
      <div className="container-content max-w-4xl">
        <header className="max-w-2xl mb-10">
          <div className="eyebrow mb-3">Ratgeber</div>
          <h1 className="serif text-4xl sm:text-5xl leading-[1.05] mb-4">
            Gesundheit & Wohlbefinden ab 55
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: "var(--color-ink-soft)" }}>
            Verständliche, fundierte Ratgeber zu den Themen, die im Alltag zählen. Von einem
            approbierten Pharmazeuten erklärt, mit Blick auf die Studienlage und ohne leere
            Versprechen.
          </p>
        </header>

        <div className="grid sm:grid-cols-2 gap-5">
          {PILLARS.map((a) => (
            <Link
              key={a.slug}
              href={`/ratgeber/${a.slug}`}
              className="group block rounded-2xl overflow-hidden transition hover:opacity-95"
              style={{ background: "#fff", border: "1px solid rgba(12,43,99,0.14)" }}
            >
              <div className="overflow-hidden" style={{ aspectRatio: "16 / 9", background: "var(--color-cream)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={a.heroImage ?? `/products/${a.productSlug}/stillleben.png`}
                  alt={a.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-[1.03]"
                  loading="lazy"
                />
              </div>
              <div className="p-5">
                <div className="text-xs uppercase tracking-widest text-muted mb-2">{a.eyebrow}</div>
                <h2 className="serif text-xl leading-tight mb-2 group-hover:underline underline-offset-4">
                  {a.title}
                </h2>
                <p className="text-sm text-muted leading-relaxed line-clamp-3">{a.intro[0]}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Neueste Artikel mit Vorschaubildern */}
        <section className="mt-14">
          <h2 className="serif text-2xl sm:text-3xl leading-tight mb-6">Neu im Ratgeber</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...ARTICLES]
              .filter((a) => a.pillarSlug)
              .sort((a, b) => b.updated.localeCompare(a.updated))
              .slice(0, 6)
              .map((a) => (
                <Link
                  key={a.slug}
                  href={`/ratgeber/${a.slug}`}
                  className="group block rounded-2xl overflow-hidden transition hover:opacity-95"
                  style={{ background: "#fff", border: "1px solid rgba(12,43,99,0.14)" }}
                >
                  <div className="overflow-hidden" style={{ aspectRatio: "16 / 9", background: "var(--color-cream)" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={a.heroImage ?? `/products/${a.productSlug}/stillleben.png`}
                      alt={a.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-5">
                    <div className="text-xs uppercase tracking-widest text-muted mb-2">{a.eyebrow}</div>
                    <h3 className="serif text-lg leading-tight group-hover:underline underline-offset-4">
                      {a.title}
                    </h3>
                  </div>
                </Link>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}
