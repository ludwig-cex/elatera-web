import type { Product } from "@/lib/products";

export function ProductDescription({ product }: { product: Product }) {
  return (
    <section className="py-12 sm:py-16" style={{ background: "var(--color-ivory)" }}>
      <div className="container-content max-w-3xl text-center">
        <div className="eyebrow mb-3" style={{ color: product.palette.subInk }}>
          Über {product.name}
        </div>
        <p className="serif text-2xl sm:text-3xl leading-snug" style={{ color: "var(--color-ink)" }}>
          {product.description}
        </p>
      </div>
    </section>
  );
}
