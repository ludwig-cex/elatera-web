import type { Product } from "@/lib/products";

export function PharmacistQuote({ product }: { product: Product }) {
  return (
    <section className="py-16 sm:py-20">
      <div className="container-content max-w-3xl">
        <div
          className="rounded-2xl p-7 sm:p-10 flex flex-col md:flex-row gap-7 items-start md:items-center"
          style={{ background: product.palette.bg }}
        >
          {/* Avatar — placeholder doctor portrait */}
          <div
            className="flex-none w-24 h-24 rounded-full flex items-center justify-center"
            style={{ background: product.palette.spine, border: `1px solid ${product.palette.spineLine}` }}
          >
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
              <circle cx="28" cy="20" r="9" fill={product.palette.badge} opacity="0.85" />
              <path
                d="M10 50 C 10 38 18 32 28 32 C 38 32 46 38 46 50 Z"
                fill={product.palette.badge}
                opacity="0.85"
              />
            </svg>
          </div>

          <div className="flex-1">
            <div className="eyebrow mb-3" style={{ color: product.palette.subInk }}>
              Apotheker-Empfehlung
            </div>
            <blockquote className="serif text-xl sm:text-2xl leading-snug" style={{ color: product.palette.ink }}>
              „{product.pharmacistQuote.quote}"
            </blockquote>
            <div className="mt-4 text-sm" style={{ color: product.palette.subInk }}>
              <span className="font-medium">{product.pharmacistQuote.name}</span>
              {" — "}
              {product.pharmacistQuote.title}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
