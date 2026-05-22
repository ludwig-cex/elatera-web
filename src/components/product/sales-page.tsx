import { Star, Truck, ShieldCheck, Award, FlaskConical } from "lucide-react";
import type { Product } from "@/lib/products";
import { HeroGallery } from "./hero-gallery";
import { BundleSelector } from "./bundle-selector";
import { FaqAccordion } from "./faq-accordion";
import { SavingsModal } from "./savings-modal";
import { ProductDescription } from "./product-description";
import { BenefitBlocks } from "./benefit-blocks";
import { IngredientDeepDive } from "./ingredient-deep-dive";
import { LabHero } from "./lab-hero";
import { PharmacistQuote } from "@/components/sections/pharmacist-quote";
import { PromiseGrid } from "@/components/sections/promise-grid";
import { PressLogos } from "@/components/sections/press-logos";
import { SocialProof } from "@/components/sections/social-proof";
import { EfsaDisclaimer } from "@/components/sections/efsa-disclaimer";
import { Newsletter } from "@/components/sections/newsletter";

export function SalesPage({ product }: { product: Product }) {
  const p = product.palette;

  return (
    <>
      {/* ============================================================
         §1 HERO — Gallery + Title + Bundle + CTA + Trust Quartet
         ============================================================ */}
      <section className="py-10 sm:py-14">
        <div className="container-content grid lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Image side */}
          <div className="lg:col-span-6 min-w-0">
            <div className="sticky top-24 min-w-0">
              {/* Bundle discount hint */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs"
                  style={{ background: "var(--color-cream)", color: "var(--color-ink-soft)" }}
                >
                  Bis zu 45 % Rabatt im Bundle
                </span>
              </div>

              <HeroGallery product={product} />
            </div>
          </div>

          {/* Info & cart side */}
          <div className="lg:col-span-6 min-w-0">
            <div className="eyebrow mb-3">{product.hero.eyebrow}</div>
            <h1 className="serif text-4xl sm:text-5xl lg:text-6xl leading-[1.05] mb-3">
              {product.hero.headline}
            </h1>
            <p className="text-lg leading-relaxed mb-6" style={{ color: "var(--color-ink-soft)" }}>
              {product.hero.subheadline}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-current"
                    style={{ color: "var(--color-copper)" }}
                  />
                ))}
              </div>
              <span className="text-sm">
                <span className="font-medium">4,8 / 5,0</span>{" "}
                <span className="text-muted">aus 1.247 Bewertungen</span>
              </span>
            </div>

            {/* Trust-Quartett — §4 Fortea */}
            <div className="grid grid-cols-2 gap-2 mb-6">
              {[
                { icon: <Truck className="w-4 h-4" />, label: "Versandkostenfrei" },
                { icon: <ShieldCheck className="w-4 h-4" />, label: "90 Tage Geld zurück" },
                { icon: <Award className="w-4 h-4" />, label: "Made in Germany" },
                { icon: <FlaskConical className="w-4 h-4" />, label: "Laborgeprüft je Charge" },
              ].map((b) => (
                <div
                  key={b.label}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
                  style={{
                    background: "var(--color-ivory)",
                    border: "1px solid rgba(0,0,0,0.06)",
                    color: "var(--color-ink-soft)",
                  }}
                >
                  <span style={{ color: p.badge }}>{b.icon}</span>
                  <span className="font-medium">{b.label}</span>
                </div>
              ))}
            </div>

            {/* Bundle selector + Cart CTA — §10/11 Fortea */}
            <BundleSelector product={product} />

            {/* PZN line — §12 Fortea-Inline */}
            <div className="mt-5 text-xs text-muted text-center">
              PZN <span className="font-mono">{product.pzn}</span> · 30 Kapseln · 1× täglich · Inhalt 14&nbsp;g
            </div>
          </div>
        </div>
      </section>

      {/* §2 PRODUKTBESCHREIBUNG */}
      <ProductDescription product={product} />

      {/* §3 DREI BENEFIT-BLÖCKE — mit Bildern */}
      <BenefitBlocks product={product} />

      {/* §4 INHALTSSTOFFE IM DETAIL — 6-Karten-Carousel (hochgezogen) */}
      <IngredientDeepDive product={product} />

      {/* §5 EXPERTEN-STATEMENT */}
      <PharmacistQuote product={product} />

      {/* §6 NUTRASANA-VERSPRECHEN (7 Trust-Punkte) */}
      <PromiseGrid />

      {/* §7 KUNDENZUFRIEDENHEIT — adapted für Wartelisten-Kontext */}
      <SocialProof />

      {/* §8 MEDIENLOGOS — Bekannt aus */}
      <PressLogos />

      {/* §11 FAQ — 5 Kategorien */}
      <section className="py-12 sm:py-20" style={{ background: "var(--color-cream)" }}>
        <div className="container-content max-w-3xl">
          <div className="text-center mb-10">
            <div className="eyebrow mb-3">Häufige Fragen</div>
            <h2 className="serif text-3xl sm:text-4xl leading-tight">
              Alles, was Sie zu {product.name} wissen sollten
            </h2>
          </div>
          <FaqAccordion product={product} />
        </div>
      </section>

      {/* §12 STUDIENLAGE */}
      <section className="py-12 sm:py-20">
        <div className="container-content max-w-3xl">
          <div className="text-center mb-12">
            <div className="eyebrow mb-3">Empirische Evidenz und Studienlage</div>
            <h2 className="serif text-3xl sm:text-4xl leading-tight mb-4">
              Was die Forschung sagt
            </h2>
            <p className="text-muted">{product.scientificIntro}</p>
          </div>

          <ol className="space-y-4">
            {product.studies.map((s, i) => (
              <li
                key={i}
                className="flex gap-4 p-5 rounded-lg"
                style={{ background: "var(--color-ivory)", border: "1px solid rgba(0,0,0,0.05)" }}
              >
                <div
                  className="w-9 h-9 rounded-full flex-none flex items-center justify-center text-sm font-medium"
                  style={{ background: p.bg, color: p.badge }}
                >
                  {i + 1}
                </div>
                <div>
                  <div className="font-medium text-sm">{s.reference}</div>
                  <div className="text-sm text-muted mt-1 leading-relaxed">{s.finding}</div>
                </div>
              </li>
            ))}
          </ol>

          <p className="text-xs text-muted mt-8 leading-relaxed text-center max-w-2xl mx-auto">
            * Die hier angeführten Studien beziehen sich auf einzelne Inhaltsstoffe und stellen keine Aussage über das Endprodukt dar. Nutrasana-Produkte sind Nahrungsergänzungsmittel und kein Ersatz für eine ausgewogene Ernährung und gesunde Lebensweise.
          </p>
        </div>
      </section>

      {/* §13 LAB-HERO — Production / Quality */}
      <LabHero product={product} />

      {/* §14 RECHTLICHE HINWEISE */}
      <EfsaDisclaimer />

      {/* §15 NEWSLETTER / SPARPLAN-CTA */}
      <Newsletter />

      {/* §16 LAST-MINUTE SAVINGS MODAL */}
      <SavingsModal product={product} />
    </>
  );
}
