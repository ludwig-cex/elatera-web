"use client";

import { useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/lib/products";

export function IngredientDeepDive({ product }: { product: Product }) {
  const p = product.palette;
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByCard = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-ingredient-card]");
    const step = card ? card.offsetWidth + 16 : 360;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section className="py-12 sm:py-20" style={{ background: "var(--color-cream)" }}>
      <div className="container-content">
        <div className="flex items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <div className="eyebrow mb-3" style={{ color: p.subInk }}>
              Inhaltsstoffe im Detail
            </div>
            <h2 className="serif text-3xl sm:text-4xl leading-tight">
              Jeder Wirkstoff ein eigenes Profil
            </h2>
            <p className="text-muted mt-3 max-w-xl">
              Auswahl, Herkunft, Standardisierung, Wirkbezug — jeder Inhaltsstoff in einer eigenen Karte.
            </p>
          </div>
          <div className="hidden sm:flex gap-2">
            <button
              onClick={() => scrollByCard(-1)}
              aria-label="Zurück"
              className="w-10 h-10 rounded-full flex items-center justify-center transition hover:opacity-80"
              style={{ background: "var(--color-ivory)", border: "1px solid rgba(0,0,0,0.10)" }}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollByCard(1)}
              aria-label="Weiter"
              className="w-10 h-10 rounded-full flex items-center justify-center transition hover:opacity-80"
              style={{ background: "var(--color-ivory)", border: "1px solid rgba(0,0,0,0.10)" }}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 lg:mx-0 lg:px-0"
          style={{ scrollbarWidth: "thin" }}
        >
          {product.ingredients.map((ing, i) => (
            <article
              key={ing.name}
              data-ingredient-card
              className="flex-none w-[300px] sm:w-[340px] snap-start rounded-2xl overflow-hidden"
              style={{
                background: "var(--color-ivory)",
                border: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              <div
                className="aspect-[4/3] relative overflow-hidden"
                style={{ background: p.bg }}
              >
                {ing.image ? (
                  <Image
                    src={`/products/${product.slug}/ingredients/${ing.image}.png`}
                    alt={ing.name}
                    fill
                    sizes="(min-width: 768px) 340px, 300px"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="serif italic text-5xl"
                      style={{ color: p.badge }}
                      aria-hidden
                    >
                      {ing.name.charAt(0)}
                    </div>
                  </div>
                )}
                <span
                  className="absolute top-3 left-3 text-[10px] px-2 py-1 rounded-full font-medium"
                  style={{ background: p.badge, color: p.badgeText }}
                >
                  Nr. {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="p-6">
                <h3 className="serif text-xl leading-tight mb-2" style={{ color: p.ink }}>
                  {ing.name}
                </h3>
                <p className="text-sm leading-relaxed text-muted mb-3">{ing.description}</p>
                {ing.efsaClaim && (
                  <p className="text-xs italic leading-relaxed pt-3 mt-3 border-t" style={{ color: p.subInk, borderColor: "rgba(0,0,0,0.06)" }}>
                    * {ing.efsaClaim}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
