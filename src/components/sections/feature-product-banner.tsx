import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import type { Product } from "@/lib/products";

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
    <section className="py-6 sm:py-10 lg:py-14">
      <div className="container-content">
        <div
          className="relative rounded-2xl sm:rounded-3xl overflow-hidden"
          style={{ background: p.bg }}
        >
          <div
            className={`grid lg:grid-cols-2 gap-6 sm:gap-10 lg:gap-14 items-center p-6 sm:p-10 lg:p-16 ${
              flipped ? "lg:[direction:rtl]" : ""
            }`}
          >
            {/* Visual */}
            <div className={`flex items-center justify-center ${flipped ? "lg:[direction:ltr]" : ""}`}>
              <div className="relative w-full max-w-[460px] aspect-[4/3]">
                <Image
                  src={product.images.stillleben}
                  alt={`${product.name} im Apothekenraum`}
                  fill
                  sizes="(min-width: 1024px) 460px, 100vw"
                  className="object-cover rounded-2xl"
                />
              </div>
            </div>

            {/* Text */}
            <div className={flipped ? "lg:[direction:ltr]" : ""}>
              <div className="eyebrow mb-3" style={{ color: p.subInk }}>
                {product.hero.eyebrow}
              </div>
              <h2 className="serif text-3xl sm:text-4xl lg:text-5xl leading-[1.05] mb-4" style={{ color: p.ink }}>
                {product.name}
              </h2>
              <p className="text-base sm:text-lg leading-relaxed mb-5 sm:mb-6" style={{ color: p.subInk }}>
                {product.hero.subheadline}
              </p>

              <ul className="space-y-3 mb-6 sm:mb-7">
                {product.uspBlocks.slice(0, 3).map((u, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check
                      className="w-5 h-5 sm:w-4 sm:h-4 mt-0.5 flex-none"
                      style={{ color: p.badge }}
                      strokeWidth={2.5}
                    />
                    <span style={{ color: p.ink }} className="text-base sm:text-sm leading-snug">
                      <span className="font-medium">{u.title}</span>
                      <span className="hidden sm:inline">.{" "}
                        <span style={{ color: p.subInk }}>{u.description}</span>
                      </span>
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
