import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HelpSearch } from "@/components/help/help-search";
import { CategoryGrid } from "@/components/help/category-grid";
import { PopularQuestions } from "@/components/help/popular-questions";
import { CategoryAccordion } from "@/components/help/category-accordion";
import { ContactBlock } from "@/components/help/contact-block";

export const metadata: Metadata = {
  title: "Hilfe & Kontakt",
  description:
    "Antworten auf häufige Fragen rund um Bestellung, Versand, Produkte und Ihr Spar-Abo bei Nutrasana. Schreiben Sie uns — wir antworten binnen 24 Stunden.",
  alternates: { canonical: "/pages/hilfe-kontakt" },
};

export default function HilfeKontaktPage() {
  return (
    <>
      {/* HERO */}
      <section
        className="py-20 sm:py-24"
        style={{
          background:
            "linear-gradient(180deg, var(--color-vertisana-bg) 0%, var(--color-paper) 100%)",
        }}
      >
        <div className="container-content text-center max-w-3xl mx-auto">
          <div className="eyebrow mb-4">Hilfe-Center</div>
          <h1 className="serif text-4xl sm:text-5xl lg:text-6xl leading-[1.05] mb-5">
            Wie können wir Ihnen helfen?
          </h1>
          <p className="text-lg leading-relaxed mb-10" style={{ color: "var(--color-ink-soft)" }}>
            Antworten zu Bestellung, Versand, Spar-Abo, Produkten und mehr. Oder schreiben Sie uns direkt — wir antworten binnen 24 Stunden.
          </p>
          <HelpSearch />
        </div>
      </section>

      {/* KATEGORIEN-GRID */}
      <section className="py-16 sm:py-20">
        <div className="container-content">
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <div className="eyebrow mb-3">Themenbereiche</div>
            <h2 className="serif text-3xl sm:text-4xl leading-tight">Wählen Sie eine Kategorie</h2>
          </div>
          <CategoryGrid />
        </div>
      </section>

      {/* BELIEBTE FRAGEN */}
      <section className="py-16 sm:py-20" style={{ background: "var(--color-cream)" }}>
        <div className="container-content">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <div className="eyebrow mb-3">Beliebt</div>
              <h2 className="serif text-3xl sm:text-4xl leading-tight">Häufig gefragte Themen</h2>
            </div>
            <Link
              href="#alle-fragen"
              className="inline-flex items-center gap-2 text-sm font-medium hover:opacity-80"
              style={{ color: "var(--color-forest)" }}
            >
              Alle Beiträge ansehen
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <PopularQuestions />
        </div>
      </section>

      {/* ALLE FRAGEN ACCORDION */}
      <section id="alle-fragen" className="py-20 sm:py-24 scroll-mt-28">
        <div className="container-content max-w-3xl">
          <div className="text-center mb-12">
            <div className="eyebrow mb-3">Alle Beiträge</div>
            <h2 className="serif text-3xl sm:text-4xl leading-tight">Antworten nach Kategorie</h2>
            <p className="mt-3" style={{ color: "var(--color-muted)" }}>
              Klicken Sie auf eine Frage, um die Antwort zu sehen.
            </p>
          </div>
          <CategoryAccordion />
        </div>
      </section>

      {/* KONTAKT */}
      <ContactBlock />
    </>
  );
}
