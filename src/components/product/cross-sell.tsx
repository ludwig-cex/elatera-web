import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { PRODUCTS, type Product, type ProductSlug } from "@/lib/products";
import { formatPrice } from "@/lib/utils";

// Komplementprodukte je PDP — fachlich naheliegende Paarungen.
const COMPLEMENTS: Record<ProductSlug, [ProductSlug, ProductSlug]> = {
  vertisana:  ["audisana", "mentisana"],
  mobilisana: ["tendisana", "cordisana"],
  somnisana:  ["mentisana", "cordisana"],
  mentisana:  ["somnisana", "cordisana"],
  urisana:    ["gastrosana", "cordisana"],
  tendisana:  ["mobilisana", "cordisana"],
  gastrosana: ["urisana", "mentisana"],
  audisana:   ["vertisana", "mentisana"],
  cordisana:  ["mobilisana", "mentisana"],
};

export function CrossSell({ product }: { product: Product }) {
  const complements = COMPLEMENTS[product.slug].map((slug) => PRODUCTS[slug]);

  return (
    <section className="py-12 sm:py-16" style={{ background: "var(--color-cream)" }}>
      <div className="container-content max-w-4xl">
        <div className="text-center mb-8">
          <div className="eyebrow mb-2">Gut kombinierbar</div>
          <h2 className="serif text-2xl sm:text-3xl leading-tight">
            Wird oft kombiniert mit
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {complements.map((c) => {
            const minPriceCents = Math.min(...c.bundles.map((b) => b.priceCents));
            return (
              <Link
                key={c.slug}
                href={`/products/${c.slug}`}
                className="group flex items-center gap-4 p-4 rounded-2xl transition hover:shadow-lg"
                style={{ background: "var(--color-ivory)", border: "1px solid rgba(0,0,0,0.06)" }}
              >
                <div
                  className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden flex-none"
                  style={{ background: c.palette.bg }}
                >
                  <Image
                    src={c.images.stillleben}
                    alt={`${c.name} — Produktverpackung`}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="serif text-lg sm:text-xl leading-tight" style={{ color: c.palette.ink }}>
                    {c.name}
                  </h3>
                  <p className="text-xs sm:text-sm mt-0.5" style={{ color: c.palette.subInk }}>
                    {c.tagline}
                  </p>
                  <div className="text-sm mt-1.5 font-medium">ab {formatPrice(minPriceCents / 100)}</div>
                </div>
                <ArrowRight
                  className="w-5 h-5 flex-none transition group-hover:translate-x-1"
                  style={{ color: c.palette.badge }}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
