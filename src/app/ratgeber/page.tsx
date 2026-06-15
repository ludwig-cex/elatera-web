import type { Metadata } from "next";
import Link from "next/link";
import { PILLARS } from "@/lib/ratgeber";

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

        <div className="grid sm:grid-cols-2 gap-4">
          {PILLARS.map((a) => (
            <Link
              key={a.slug}
              href={`/ratgeber/${a.slug}`}
              className="group block p-6 rounded-xl transition hover:opacity-90"
              style={{ background: "var(--color-ivory)", border: "1px solid rgba(0,0,0,0.06)" }}
            >
              <div className="text-xs uppercase tracking-widest text-muted mb-2">{a.eyebrow}</div>
              <h2 className="serif text-xl leading-tight mb-2 group-hover:underline underline-offset-4">
                {a.title}
              </h2>
              <p className="text-sm text-muted leading-relaxed line-clamp-3">{a.intro[0]}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
