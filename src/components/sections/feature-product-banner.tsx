import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import type { Product } from "@/lib/products";
import { ProductMockup } from "@/components/product/product-mockup";

type Props = {
  product: Product;
  flipped?: boolean;
};

/**
 * Large feature banner per product — Fortea-style.
 * Bild links / Text rechts; alternierend per `flipped`.
 */
export function FeatureProductBanner({ product, flipped = false }: Props) {
  const p = product.palette;

  return (
    <section className="py-10 sm:py-14">
      <div className="container-content">
        <div
          className="relative rounded-3xl overflow-hidden"
          style={{ background: p.bg }}
        >
          <div
            className={`grid lg:grid-cols-2 gap-10 lg:gap-14 items-center p-8 sm:p-12 lg:p-16 ${
              flipped ? "lg:[direction:rtl]" : ""
            }`}
          >
            {/* Visual */}
            <div className={`flex items-center justify-center ${flipped ? "lg:[direction:ltr]" : ""}`}>
              <ProductMockup product={product} width={460} height={300} />
            </div>

            {/* Text */}
            <div className={flipped ? "lg:[direction:ltr]" : ""}>
              <div className="eyebrow mb-3" style={{ color: p.subInk }}>
                {product.hero.eyebrow}
              </div>
              <h2 className="serif text-3xl sm:text-4xl lg:text-5xl leading-[1.05] mb-4" style={{ color: p.ink }}>
                {product.name}
              </h2>
              <p className="text-lg leading-relaxed mb-6" style={{ color: p.subInk }}>
                {product.hero.subheadline}
              </p>

              <ul className="space-y-3 mb-7">
                {product.uspBlocks.slice(0, 3).map((u, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <Check
                      className="w-4 h-4 mt-0.5 flex-none"
                      style={{ color: p.badge }}
                      strokeWidth={2.5}
                    />
                    <span style={{ color: p.ink }}>
                      <span className="font-medium">{u.title}.</span>{" "}
                      <span style={{ color: p.subInk }}>{u.description}</span>
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href={`/products/${product.slug}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition hover:opacity-90"
                style={{ background: p.badge, color: p.badgeText }}
              >
                Jetzt mehr erfahren
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
