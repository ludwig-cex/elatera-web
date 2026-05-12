import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { PRODUCT_LIST } from "@/lib/products";
import { ProductMockup } from "@/components/product/product-mockup";
import { SubheroBanner } from "@/components/sections/subhero-banner";
import { FeatureProductBanner } from "@/components/sections/feature-product-banner";
import { TrustBadgesRow } from "@/components/sections/trust-badges-row";
import { ProductCarousel } from "@/components/sections/product-carousel";
import { UspThreeColumns } from "@/components/sections/usp-three-columns";
import { IndicationsNav } from "@/components/sections/indications-nav";
import { HomepageFaq } from "@/components/sections/homepage-faq";
import { ExpertRecommendation } from "@/components/sections/expert-recommendation";
import { CustomerStories } from "@/components/sections/customer-stories";
import { EfsaDisclaimer } from "@/components/sections/efsa-disclaimer";
import { Newsletter } from "@/components/sections/newsletter";
import { ShippingPartners } from "@/components/sections/shipping-partners";

export default function HomePage() {
  return (
    <>
      {/* 1. HERO — Fortea-style: Bild + Textbox */}
      <section className="pt-10 sm:pt-14 pb-10 sm:pb-12">
        <div className="container-content">
          <div className="relative rounded-3xl overflow-hidden">
            <div
              className="relative min-h-[460px] sm:min-h-[560px] flex items-center"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-vertera-bg) 0%, var(--color-cream) 50%, var(--color-mobilera-bg) 100%)",
              }}
            >
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

              <div className="container-content relative">
                <div
                  className="max-w-xl rounded-2xl p-8 sm:p-12 shadow-md backdrop-blur"
                  style={{
                    background: "rgba(250, 246, 236, 0.94)",
                    border: "1px solid rgba(0,0,0,0.06)",
                  }}
                >
                  <div className="eyebrow mb-4" style={{ color: "var(--color-moss)" }}>
                    Nutrasana · Made in Germany
                  </div>
                  <h1 className="serif text-4xl sm:text-5xl lg:text-6xl leading-[1.05] mb-5">
                    Ihre Gesundheit,
                    <br />
                    <span style={{ color: "var(--color-moss)" }}>einfach gemacht.</span>
                  </h1>
                  <p className="text-lg leading-relaxed mb-7" style={{ color: "var(--color-ink-soft)" }}>
                    Nutrasana<sup className="text-sm">®</sup> ist Ihre Gesundheitsmarke des Vertrauens — wissenschaftlich fundierte Produkte, online bestellbar und bequem nach Hause geliefert.
                  </p>
                  <Link
                    href="/products/vertera"
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

      {/* 2. SUBHERO — "Für jedes Anliegen die richtige Lösung" */}
      <SubheroBanner />

      {/* 3. FEATURE-BANNER pro Produkt (alternierend) */}
      <FeatureProductBanner product={PRODUCT_LIST[0]} />
      <FeatureProductBanner product={PRODUCT_LIST[1]} flipped />
      <FeatureProductBanner product={PRODUCT_LIST[2]} />

      {/* 4. TRUST-BADGES-Reihe */}
      <TrustBadgesRow />

      {/* 5. PRODUKT-KAROUSSEL — alle 3 als Cards */}
      <ProductCarousel />

      {/* 6. 3-Spalten-USP — Wissenschaft / Pharmazeut / Apotheker */}
      <UspThreeColumns />

      {/* 7. INDIKATIONEN-Icon-Nav */}
      <IndicationsNav />

      {/* 8. FAQ-Accordion auf Homepage */}
      <HomepageFaq />

      {/* 9. APOTHEKER-Testimonial (Sander) */}
      <ExpertRecommendation />

      {/* 10. KUNDENSTIMMEN als Accordion */}
      <CustomerStories />

      {/* 11. EFSA-Disclaimer */}
      <EfsaDisclaimer />

      {/* 12. Newsletter */}
      <Newsletter />

      {/* 13. Versandpartner */}
      <ShippingPartners />
    </>
  );
}
