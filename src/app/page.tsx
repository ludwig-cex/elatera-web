import Link from "next/link";
import { ArrowRight, FlaskConical, Award, ShieldCheck } from "lucide-react";
import { PRODUCT_LIST } from "@/lib/products";
import { ProductMockup } from "@/components/product/product-mockup";
import { TrustRow } from "@/components/sections/trust-row";
import { PressLogos } from "@/components/sections/press-logos";
import { SocialProof } from "@/components/sections/social-proof";
import { Newsletter } from "@/components/sections/newsletter";
import { PromiseGrid } from "@/components/sections/promise-grid";

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="pt-12 sm:pt-20 pb-16 sm:pb-24">
        <div className="container-content grid gap-12 lg:grid-cols-12 items-center">
          <div className="lg:col-span-6">
            <div className="eyebrow mb-4">Nahrungsergänzung · Made in Germany · Premiere 2026</div>
            <h1 className="serif text-5xl sm:text-6xl lg:text-7xl leading-[1.04] mb-6">
              Älterwerden,
              <br />
              <span style={{ color: "var(--color-moss)" }}>lebendig.</span>
            </h1>
            <p className="text-lg leading-relaxed max-w-xl mb-8" style={{ color: "var(--color-ink-soft)" }}>
              Elatera entwickelt wissenschaftlich fundierte Nahrungsergänzung für die echten Bedürfnisse ab 55 — entwickelt von Apothekern, hergestellt in Deutschland, ehrlich kommuniziert.
            </p>
            <div className="flex flex-wrap gap-3 mb-10">
              <Link
                href="/products/balance"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded font-medium transition hover:opacity-90"
                style={{ background: "var(--color-forest)", color: "var(--color-on-dark)" }}
              >
                Produkte ansehen
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/pages/ueber-uns"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded font-medium transition hover:bg-cream/60"
                style={{ border: "1px solid var(--color-forest)", color: "var(--color-forest)" }}
              >
                Unsere Philosophie
              </Link>
            </div>
            <TrustRow />
          </div>

          <div className="lg:col-span-6 relative">
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-3">
              {PRODUCT_LIST.map((p, i) => (
                <div
                  key={p.slug}
                  className="relative"
                  style={{ transform: `translateY(${i * 16}px)` }}
                >
                  <ProductMockup product={p} width={260} height={300} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="py-20 sm:py-24" style={{ background: "var(--color-cream)" }}>
        <div className="container-content">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="eyebrow mb-3">Drei Premieren</div>
            <h2 className="serif text-4xl sm:text-5xl leading-tight mb-4">
              Was möchten Sie heute unterstützen?
            </h2>
            <p style={{ color: "var(--color-muted)" }}>
              Jedes Elatera-Produkt richtet sich an ein klares Bedürfnis — und kombiniert Pflanzen-Tradition mit wissenschaftlicher Mikronährstoff-Rezeptur.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {PRODUCT_LIST.map((p) => (
              <Link
                key={p.slug}
                href={`/products/${p.slug}`}
                className="group block rounded-2xl p-7 transition hover:shadow-lg"
                style={{ background: p.palette.bg }}
              >
                <div className="aspect-[5/3] mb-5 flex items-center justify-center">
                  <ProductMockup product={p} width={300} height={280} />
                </div>
                <div className="eyebrow mb-2" style={{ color: p.palette.subInk }}>
                  {p.tagline}
                </div>
                <h3 className="serif text-3xl leading-tight mb-2" style={{ color: p.palette.ink }}>
                  {p.name}
                </h3>
                <p className="text-sm mb-5" style={{ color: p.palette.subInk }}>
                  {p.shortTagline}
                </p>
                <span
                  className="inline-flex items-center gap-2 text-sm font-medium transition group-hover:gap-3"
                  style={{ color: p.palette.badge }}
                >
                  Auf Warteliste setzen
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WHY ELATERA */}
      <section className="py-20 sm:py-24">
        <div className="container-content max-w-5xl">
          <div className="text-center mb-14">
            <div className="eyebrow mb-3">Warum Elatera</div>
            <h2 className="serif text-4xl sm:text-5xl leading-tight mb-4">
              Ehrlich. Wissenschaftlich. Aus der Apotheke.
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div
                className="w-12 h-12 rounded-full mb-5 flex items-center justify-center"
                style={{ background: "var(--color-balance-bg)", color: "var(--color-forest)" }}
              >
                <FlaskConical className="w-5 h-5" />
              </div>
              <h3 className="serif text-2xl mb-3">Wissenschaftliche Rezepturen</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-muted)" }}>
                Jede Formel basiert auf EFSA-konformen Health-Claims, kombiniert mit traditionellen Pflanzenextrakten in relevanten Dosierungen. Keine Wellness-Mode.
              </p>
            </div>
            <div>
              <div
                className="w-12 h-12 rounded-full mb-5 flex items-center justify-center"
                style={{ background: "var(--color-mobil-bg)", color: "var(--color-copper)" }}
              >
                <Award className="w-5 h-5" />
              </div>
              <h3 className="serif text-2xl mb-3">In Deutschland gefertigt</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-muted)" }}>
                Produktion ausschließlich in FSSC-22000-zertifizierten Anlagen. Jede Charge wird unabhängig laborgeprüft, bevor sie unser Haus verlässt.
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
        </div>
      </section>

      <PressLogos />
      <PromiseGrid />
      <SocialProof />
      <Newsletter />
    </>
  );
}
