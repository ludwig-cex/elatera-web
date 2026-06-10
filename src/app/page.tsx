import type { Metadata } from "next";
import { PRODUCT_LIST } from "@/lib/products";
import { HeroCarousel } from "@/components/sections/hero-carousel";
import { TrustBand } from "@/components/sections/trust-band";
import { FeatureProductBanner } from "@/components/sections/feature-product-banner";
import { ProductCarousel } from "@/components/sections/product-carousel";
import { UspThreeColumns } from "@/components/sections/usp-three-columns";
import { IndicationsNav } from "@/components/sections/indications-nav";
import { HomepageFaq } from "@/components/sections/homepage-faq";
import { ExpertRecommendation } from "@/components/sections/expert-recommendation";
import { CustomerStories } from "@/components/sections/customer-stories";
import { EfsaDisclaimer } from "@/components/sections/efsa-disclaimer";
import { Newsletter } from "@/components/sections/newsletter";
import { ShippingPartners } from "@/components/sections/shipping-partners";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      {/* 1. HERO — Carousel mit 3 Slides (Vertisana / Mobilisana / Somnisana) */}
      <HeroCarousel />

      {/* 2. PRODUKT-ÜBERSICHT — "Unsere Produkte" direkt unter dem Carousel */}
      <div id="produkte" style={{ scrollMarginTop: 120 }}>
        <ProductCarousel />
      </div>

      {/* 3. TRUST-BAND — Fortea-Stil */}
      <TrustBand />

      {/* 4. FEATURE-BANNER pro Produkt (Product Spotlight, alternierend) */}
      {PRODUCT_LIST.map((product, i) => (
        <FeatureProductBanner
          key={product.slug}
          product={product}
          flipped={i % 2 === 1}
        />
      ))}

      {/* 6. 3-Spalten-USP — Wissenschaft / Pharmazeut / Apotheker */}
      <UspThreeColumns />

      {/* 7. INDIKATIONEN-Icon-Nav */}
      <IndicationsNav />

      {/* 8. FAQ-Accordion auf Homepage */}
      <HomepageFaq />

      {/* 9. APOTHEKER-Testimonial */}
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
