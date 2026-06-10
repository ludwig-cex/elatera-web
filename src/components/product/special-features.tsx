import Image from "next/image";
import type { Product } from "@/lib/products";

export function SpecialFeatures({ product }: { product: Product }) {
  const p = product.palette;
  const img = product.images;
  // Maps each of the 3 special features to a relevant image:
  // 0 = synergistic formula → ingredient flatlay
  // 1 = relevant dosage     → solo packshot
  // 2 = optimized uptake    → lifestyle solo (couplePrimary läuft bereits in der Galerie)
  const featureImages = [img.flatlay, img.stillleben, img.lifestyle.soloWoman];
  const featureFits: ("cover" | "contain")[] = ["cover", "cover", "cover"];

  return (
    <section className="py-12 sm:py-20 lg:py-24">
      <div className="container-content">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="eyebrow mb-3" style={{ color: p.subInk }}>
            Im Detail betrachtet
          </div>
          <h2 className="serif text-3xl sm:text-4xl leading-tight">
            Was {product.name} besonders macht
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {product.specialFeatures.map((f, i) => (
            <article key={i} className="text-left">
              <div
                className="aspect-[4/3] rounded-2xl mb-5 overflow-hidden relative"
                style={{ background: p.bg, border: `1px solid ${p.spineLine}` }}
              >
                <Image
                  src={featureImages[i] ?? img.solo}
                  alt={f.title}
                  fill
                  sizes="(min-width: 1024px) 360px, 100vw"
                  className={featureFits[i] === "contain" ? "object-contain p-6" : "object-cover"}
                />
                <span
                  className="absolute top-3 left-3 w-9 h-9 rounded-full flex items-center justify-center serif italic text-base"
                  style={{ background: p.badge, color: p.badgeText }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="serif text-2xl leading-tight mb-2" style={{ color: p.ink }}>
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-ink-soft)" }}>
                {f.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
