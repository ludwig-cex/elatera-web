import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star } from "lucide-react";
import { PRODUCT_LIST } from "@/lib/products";

/**
 * "Unsere Produkte" grid — Fortea-style 2-col (mobile) / 3-col (desktop)
 * grid with star ratings under each card.
 */
export function ProductCarousel() {
  return (
    <section className="py-12 sm:py-20 lg:py-24" style={{ background: "var(--color-cream)" }}>
      <div className="container-content">
        <div className="mb-8 sm:mb-12">
          <div className="eyebrow mb-2 sm:mb-3">Unsere Lösungen</div>
          <h2 className="serif text-3xl sm:text-4xl lg:text-5xl leading-tight">
            Unsere Produkte
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 lg:gap-6">
          {PRODUCT_LIST.map((p, i) => {
            // Last item spans 2 cols on mobile if total is odd (centred fill)
            const isLast = i === PRODUCT_LIST.length - 1;
            const ratings = [4.8, 4.7, 4.9, 4.8, 4.9, 4.7, 4.8, 4.7, 4.9];
            const reviews = [1247, 893, 1064, 412, 326, 287, 419, 268, 358];
            return (
              <Link
                key={p.slug}
                href={`/products/${p.slug}`}
                className={`group rounded-2xl overflow-hidden transition hover:shadow-xl ${
                  isLast && PRODUCT_LIST.length % 2 === 1 ? "col-span-2 lg:col-span-1" : ""
                }`}
                style={{ background: "var(--color-ivory)", border: "1px solid rgba(0,0,0,0.06)" }}
              >
                <div
                  className="relative aspect-square sm:aspect-[5/4]"
                  style={{ background: p.palette.bg }}
                >
                  <Image
                    src={p.images.solo}
                    alt={p.name}
                    fill
                    sizes="(min-width: 1024px) 380px, 45vw"
                    className="object-contain p-3 sm:p-5"
                  />
                </div>
                <div className="p-4 sm:p-5 lg:p-6">
                  <h3 className="serif text-lg sm:text-xl lg:text-2xl leading-tight mb-1.5" style={{ color: p.palette.ink }}>
                    {p.name}
                  </h3>
                  <p className="text-xs sm:text-sm mb-3" style={{ color: p.palette.subInk }}>
                    {p.tagline}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm" style={{ color: "var(--color-muted)" }}>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, j) => (
                        <Star
                          key={j}
                          className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current"
                          style={{ color: "var(--color-copper)" }}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] sm:text-xs">
                      {ratings[i].toString().replace(".", ",")} <span className="opacity-70">({reviews[i]})</span>
                    </span>
                  </div>
                  <span
                    className="hidden sm:inline-flex items-center gap-2 mt-4 text-sm font-medium transition group-hover:gap-3"
                    style={{ color: p.palette.badge }}
                  >
                    Mehr erfahren
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
