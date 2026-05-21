import Image from "next/image";
import type { Product } from "@/lib/products";

export function PharmacistQuote({ product }: { product: Product }) {
  return (
    <section className="py-10 sm:py-16 lg:py-20">
      <div className="container-content max-w-3xl">
        <div
          className="rounded-2xl p-7 sm:p-10 flex flex-col md:flex-row gap-7 items-start md:items-center"
          style={{ background: product.palette.bg }}
        >
          <div
            className="flex-none w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden relative"
            style={{ background: product.palette.spine, border: `1px solid ${product.palette.spineLine}` }}
          >
            <Image
              src="/portraits/jonas-guetermann.png"
              alt={product.pharmacistQuote.name}
              fill
              sizes="128px"
              className="object-cover"
            />
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
