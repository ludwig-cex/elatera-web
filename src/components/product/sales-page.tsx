import { Star, ChevronRight, Sparkles } from "lucide-react";
import type { Product } from "@/lib/products";
import { ProductMockup } from "./product-mockup";
import { BundleSelector } from "./bundle-selector";
import { FaqAccordion } from "./faq-accordion";
import { AvailabilityChecker } from "./availability-checker";
import { SavingsModal } from "./savings-modal";
import { PharmacistQuote } from "@/components/sections/pharmacist-quote";
import { PromiseGrid } from "@/components/sections/promise-grid";
import { PressLogos } from "@/components/sections/press-logos";
import { Newsletter } from "@/components/sections/newsletter";

export function SalesPage({ product }: { product: Product }) {
  const p = product.palette;

  return (
    <>
      {/* 1. HERO + 2. PRODUCT IMAGE + 3. STATUS BADGE + 4. TRUST QUARTET + 9. AVAILABILITY + 10. BUNDLE + 11. CTA + 12. CHECKOUT BENEFITS + 15. PHARMACIST */}
      <section className="py-10 sm:py-14">
        <div className="container-content grid lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Image side */}
          <div className="lg:col-span-6">
            <div className="sticky top-24">
              {/* Status badge */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                  style={{ background: p.badge, color: p.badgeText }}
                >
                  <Sparkles className="w-3 h-3" />
                  {product.hero.badge}
                </span>
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs"
                  style={{ background: "var(--color-cream)", color: "var(--color-ink-soft)" }}
                >
                  Bis zu 45 % Rabatt zur Premiere
                </span>
              </div>

              {/* Product mockup as hero image */}
              <div
                className="rounded-2xl p-8 sm:p-12 mb-4 flex items-center justify-center"
                style={{ background: p.bg }}
              >
                <ProductMockup product={product} width={520} height={320} />
              </div>

              {/* Thumbnail row (placeholder grid of mini-mockups) */}
              <div className="grid grid-cols-5 gap-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-lg flex items-center justify-center"
                    style={{
                      background: i === 0 ? p.bg : "var(--color-ivory)",
                      border: `1px solid ${i === 0 ? p.badge : "rgba(0,0,0,0.06)"}`,
                    }}
                  >
                    <div className="serif italic text-lg" style={{ color: p.subInk }}>
                      {product.variant.charAt(0)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Info & purchase side */}
          <div className="lg:col-span-6">
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
                <span className="text-muted">aus 1.247 Stimmen der Warteliste</span>
              </span>
            </div>

            {/* USP Block */}
            <div
              className="rounded-lg p-5 mb-7"
              style={{ background: p.bg, border: `1px solid ${p.spineLine}` }}
            >
              <div className="eyebrow mb-2" style={{ color: p.subInk }}>
                Was Elatera {product.variant} unterstützt
              </div>
              <ul className="space-y-2.5">
                {product.uspBlocks.map((u, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed">
                    <ChevronRight className="w-4 h-4 mt-0.5 flex-none" style={{ color: p.badge }} />
                    <span>
                      <span className="font-medium">{u.title}.</span> {u.description}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Availability */}
            <div className="mb-6">
              <AvailabilityChecker accentColor={p.badge} />
            </div>

            {/* Bundle selector */}
            <BundleSelector product={product} />

            {/* PZN line */}
            <div className="mt-5 text-xs text-muted text-center">
              PZN <span className="font-mono">{product.pzn}</span> · 30 Kapseln · 1× täglich · Inhalt 14&nbsp;g
            </div>
          </div>
        </div>
      </section>

      {/* PRESS LOGOS */}
      <PressLogos />

      {/* PHARMACIST */}
      <PharmacistQuote product={product} />

      {/* INGREDIENTS DEEP DIVE */}
      <section className="py-20" style={{ background: "var(--color-cream)" }}>
        <div className="container-content">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="eyebrow mb-3">Inhaltsstoffe im Detail</div>
            <h2 className="serif text-3xl sm:text-4xl leading-tight mb-3">
              {product.ingredients.length} ausgewählte Inhaltsstoffe
            </h2>
            <p className="text-muted">
              Jeder Inhaltsstoff wurde mit Blick auf Wirksamkeit, Reinheit und Bioverfügbarkeit ausgewählt.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {product.ingredients.map((ing) => (
              <div
                key={ing.name}
                className="rounded-lg p-6"
                style={{ background: "var(--color-ivory)" }}
              >
                <div
                  className="w-12 h-12 rounded-full mb-4 flex items-center justify-center"
                  style={{ background: p.bg }}
                >
                  <span className="serif text-2xl" style={{ color: p.badge }}>
                    {ing.name.charAt(0)}
                  </span>
                </div>
                <h3 className="serif text-xl leading-tight mb-2">{ing.name}</h3>
                <p className="text-sm leading-relaxed text-muted mb-3">{ing.description}</p>
                {ing.efsaClaim && (
                  <p className="text-xs italic" style={{ color: p.subInk }}>
                    * {ing.efsaClaim}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SCIENTIFIC INTRO + STUDIES */}
      <section className="py-20">
        <div className="container-content max-w-3xl">
          <div className="text-center mb-12">
            <div className="eyebrow mb-3">Wissenschaftliche Fundierung</div>
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
            *Die hier angeführten Studien beziehen sich auf einzelne Inhaltsstoffe und stellen keine Aussage über das Endprodukt dar. Elatera-Produkte sind Nahrungsergänzungsmittel und kein Ersatz für eine ausgewogene Ernährung und gesunde Lebensweise.
          </p>
        </div>
      </section>

      <PromiseGrid />

      {/* FAQ */}
      <section className="py-20" style={{ background: "var(--color-cream)" }}>
        <div className="container-content max-w-3xl">
          <div className="text-center mb-10">
            <div className="eyebrow mb-3">Häufige Fragen</div>
            <h2 className="serif text-3xl sm:text-4xl leading-tight">
              Alles, was Sie zu Elatera {product.variant} wissen sollten
            </h2>
          </div>
          <FaqAccordion product={product} />
        </div>
      </section>

      <Newsletter />

      {/* Last-minute savings modal */}
      <SavingsModal product={product} />
    </>
  );
}
