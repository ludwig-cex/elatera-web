import Image from "next/image";
import type { Product } from "@/lib/products";

export function LabHero({ product }: { product: Product }) {
  const p = product.palette;

  return (
    <section className="py-12">
      <div className="container-content">
        <div
          className="aspect-[16/7] sm:aspect-[16/6] rounded-3xl overflow-hidden relative"
          style={{ border: `1px solid ${p.spineLine}` }}
        >
          <Image
            src="/universal/apothekenraum.png"
            alt="Apothekenraum mit Glasflaschen und Mikroskop"
            fill
            sizes="(min-width: 1024px) 1100px, 100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.75) 100%)",
            }}
          >
            <div className="text-center px-6 max-w-2xl">
              <div className="eyebrow mb-3" style={{ color: p.subInk }}>
                Hergestellt in Deutschland · FSSC 22000
              </div>
              <p className="serif text-2xl sm:text-3xl lg:text-4xl leading-tight" style={{ color: p.ink }}>
                Jede Charge laborgeprüft. Jedes Produkt mit eigener Pharmazentralnummer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
