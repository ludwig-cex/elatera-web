import type { Product } from "@/lib/products";

export function IngredientListShort({ product }: { product: Product }) {
  const p = product.palette;

  return (
    <section className="py-14 sm:py-16" style={{ background: "var(--color-cream)" }}>
      <div className="container-content max-w-4xl">
        <div className="text-center mb-8">
          <div className="eyebrow mb-3" style={{ color: p.subInk }}>
            Ausgewählte Inhaltsstoffe
          </div>
          <h2 className="serif text-3xl sm:text-4xl leading-tight">
            {product.ingredients.length} Komponenten in einer Kapsel
          </h2>
        </div>

        <ul className="flex flex-wrap justify-center gap-2.5">
          {product.ingredients.map((ing) => (
            <li
              key={ing.name}
              className="px-5 py-2.5 rounded-full text-sm font-medium"
              style={{
                background: "var(--color-ivory)",
                border: `1px solid ${p.spineLine}`,
                color: p.ink,
              }}
            >
              {ing.name}
            </li>
          ))}
        </ul>

        <p className="text-xs text-muted text-center mt-6">
          Detail-Profile aller Inhaltsstoffe weiter unten auf dieser Seite.
        </p>
      </div>
    </section>
  );
}
