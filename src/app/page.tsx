import Link from "next/link";
import { ArrowRight, FlaskConical, PillBottle, ShieldCheck, Star } from "lucide-react";
import { ProductCarousel } from "@/components/sections/product-carousel";
import { PressLogos } from "@/components/sections/press-logos";
import { SocialProof } from "@/components/sections/social-proof";
import { Newsletter } from "@/components/sections/newsletter";
import { PromiseAccordion } from "@/components/sections/promise-accordion";
import { ExpertRecommendation } from "@/components/sections/expert-recommendation";
import { RatingTile } from "@/components/sections/rating-tile";
import { PRODUCT_LIST } from "@/lib/products";
import { ProductMockup } from "@/components/product/product-mockup";

export default function HomePage() {
  return (
    <>
      {/* HERO — Fortea-style: Bild + Textbox */}
      <section className="pt-10 sm:pt-14 pb-14 sm:pb-20">
        <div className="container-content">
          <div className="relative rounded-3xl overflow-hidden">
            {/* Hero-Bild als Verlauf mit überlappenden Produktmockups (Platzhalter für späteres Foto) */}
            <div
              className="relative min-h-[460px] sm:min-h-[560px] flex items-center"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-balance-bg) 0%, var(--color-cream) 50%, var(--color-mobil-bg) 100%)",
              }}
            >
              {/* Dekorative SVG-Produktmockups rechts */}
              <div className="absolute inset-y-0 right-0 hidden lg:flex items-center pointer-events-none">
                <div className="flex gap-6 pr-10 opacity-95">
                  {PRODUCT_LIST.map((p, i) => (
                    <div
                      key={p.slug}
                      className="relative"
                      style={{
                        transform: `translateY(${(i - 1) * 20}px) rotate(${(i - 1) * -4}deg)`,
                      }}
                    >
                      <ProductMockup product={p} width={220} height={280} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Textbox-Card */}
              <div className="container-content relative">
                <div
                  className="max-w-xl rounded-2xl p-8 sm:p-12 shadow-md backdrop-blur"
                  style={{
                    background: "rgba(250, 246, 236, 0.94)",
                    border: "1px solid rgba(0,0,0,0.06)",
                  }}
                >
                  <div className="eyebrow mb-4" style={{ color: "var(--color-moss)" }}>
                    Elatera · Made in Germany
                  </div>
                  <h1 className="serif text-4xl sm:text-5xl lg:text-6xl leading-[1.05] mb-5">
                    Ihre Gesundheit,
                    <br />
                    <span style={{ color: "var(--color-moss)" }}>einfach gemacht.</span>
                  </h1>
                  <p className="text-lg leading-relaxed mb-7" style={{ color: "var(--color-ink-soft)" }}>
                    Elatera<sup className="text-sm">®</sup> ist Ihre Gesundheitsmarke des Vertrauens — wissenschaftlich fundierte
                    Produkte, online bestellbar und bequem nach Hause geliefert.
                  </p>
                  <Link
                    href="/products/balance"
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-medium transition hover:opacity-90"
                    style={{ background: "var(--color-forest)", color: "var(--color-on-dark)" }}
                  >
                    Jetzt Produkte entdecken
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <div className="mt-6 flex items-center gap-3 text-sm" style={{ color: "var(--color-muted)" }}>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-current"
                          style={{ color: "var(--color-copper)" }}
                        />
                      ))}
                    </div>
                    <span>
                      <span className="font-medium" style={{ color: "var(--color-ink)" }}>
                        4,8/5,0
                      </span>{" "}
                      · über 1.200 Bewertungen
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUKT-KAROUSSEL */}
      <ProductCarousel />

      {/* WARUM ELATERA */}
      <section className="py-20 sm:py-24">
        <div className="container-content max-w-5xl">
          <div className="text-center mb-14">
            <div className="eyebrow mb-3">Warum Elatera</div>
            <h2 className="serif text-4xl sm:text-5xl leading-tight mb-4">
              Ehrlich. Wissenschaftlich. Aus der Apotheke.
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3 mb-14">
            <div>
              <div
                className="w-12 h-12 rounded-full mb-5 flex items-center justify-center"
                style={{ background: "var(--color-balance-bg)", color: "var(--color-forest)" }}
              >
                <FlaskConical className="w-5 h-5" />
              </div>
              <h3 className="serif text-2xl mb-3">Wissenschaftlich fundiert</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-muted)" }}>
                Unsere Produkte wurden auf aktuellsten wissenschaftlichen Studien und Erkenntnissen aufgebaut. Jede Rezeptur ist sorgfältig durchdacht und zielgerichtet formuliert.
              </p>
            </div>
            <div>
              <div
                className="w-12 h-12 rounded-full mb-5 flex items-center justify-center"
                style={{ background: "var(--color-mobil-bg)", color: "var(--color-copper)" }}
              >
                <PillBottle className="w-5 h-5" />
              </div>
              <h3 className="serif text-2xl mb-3">Von Apothekern empfohlen</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-muted)" }}>
                Unsere Lösungen genießen das Vertrauen von Apothekern und werden regelmäßig weiterempfohlen. Jedes Produkt verfügt über eine eigene PZN.
              </p>
            </div>
            <div>
              <div
                className="w-12 h-12 rounded-full mb-5 flex items-center justify-center"
                style={{ background: "var(--color-nox-bg)", color: "var(--color-navy)" }}
              >
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="serif text-2xl mb-3">Risikofreie Garantie</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-muted)" }}>
                90 Tage Geld-zurück-Garantie ohne Wenn und Aber. Wenn ein Produkt nicht zu Ihnen passt, schicken Sie es zurück — wir erstatten den vollen Kaufpreis.
              </p>
            </div>
          </div>

          {/* Bewertungskachel */}
          <RatingTile />
        </div>
      </section>

      <PressLogos />

      {/* Experten-Empfehlung (Andreas Sander) */}
      <ExpertRecommendation />

      {/* Versprechen als Accordion */}
      <PromiseAccordion />

      <SocialProof />

      <Newsletter />

      {/* Philosophie-CTA am Ende */}
      <section className="py-16 sm:py-20" style={{ background: "var(--color-pine)", color: "var(--color-on-dark)" }}>
        <div className="container-content max-w-3xl text-center">
          <div
            className="eyebrow mb-4"
            style={{ color: "var(--color-on-dark)", opacity: 0.7 }}
          >
            Unsere Haltung
          </div>
          <h2 className="serif text-3xl sm:text-4xl leading-tight mb-5" style={{ color: "var(--color-on-dark)" }}>
            Was Elatera einzigartig macht
          </h2>
          <p className="text-base sm:text-lg leading-relaxed mb-8 opacity-85 max-w-2xl mx-auto">
            Wir glauben, dass Gesundheit jenseits von Marketing-Versprechen funktioniert. Lesen Sie, warum wir Elatera so gestaltet haben, wie wir es getan haben.
          </p>
          <Link
            href="/pages/ueber-uns"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-medium transition hover:opacity-90"
            style={{
              border: "1px solid rgba(250, 246, 236, 0.45)",
              color: "var(--color-on-dark)",
            }}
          >
            Unsere Philosophie
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
