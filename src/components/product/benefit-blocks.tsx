import Image from "next/image";
import type { Product } from "@/lib/products";
import { Check } from "lucide-react";

export function BenefitBlocks({ product }: { product: Product }) {
  const p = product.palette;

  return (
    <section className="py-10 sm:py-16 lg:py-20">
      <div className="container-content">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="eyebrow mb-3" style={{ color: p.subInk }}>
            Was {product.name} unterstützt
          </div>
          <h2 className="serif text-3xl sm:text-4xl leading-tight">
            Drei zentrale Funktionen
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {product.uspBlocks.map((u, i) => (
            <article
              key={i}
              className="rounded-2xl overflow-hidden flex flex-col"
              style={{ background: p.bg, border: `1px solid ${p.spineLine}` }}
            >
              {u.image && (
                <div className="aspect-[5/3] relative">
                  <Image
                    src={u.image}
                    alt={u.title}
                    fill
                    sizes="(min-width: 768px) 360px, 100vw"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-6 sm:p-7 flex-1">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center mb-4"
                  style={{ background: p.badge, color: p.badgeText }}
                >
                  <Check className="w-4 h-4" strokeWidth={2.5} />
                </div>
                <h3 className="serif text-2xl leading-tight mb-3" style={{ color: p.ink }}>
                  {u.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: p.subInk }}>
                  {u.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        <p className="text-[11px] text-muted text-center mt-6 max-w-2xl mx-auto leading-relaxed">
          * EFSA-konforme Health-Claims gemäß EU-Verordnung 1924/2006. Aussagen zu pflanzlichen Inhaltsstoffen sind „on hold"-Claims und werden derzeit von der EFSA geprüft.
        </p>
      </div>
    </section>
  );
}
