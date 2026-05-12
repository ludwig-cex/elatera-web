"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { PRODUCT_LIST } from "@/lib/products";
import { ProductMockup } from "@/components/product/product-mockup";

export function ProductCarousel() {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!ref.current) return;
    const w = ref.current.clientWidth;
    ref.current.scrollBy({ left: dir === "left" ? -w * 0.8 : w * 0.8, behavior: "smooth" });
  };

  return (
    <section className="py-20 sm:py-24" style={{ background: "var(--color-cream)" }}>
      <div className="container-content">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <div className="eyebrow mb-3">Unsere Lösungen</div>
            <h2 className="serif text-4xl sm:text-5xl leading-tight mb-3">
              Für jedes Anliegen die richtige Lösung
            </h2>
            <p style={{ color: "var(--color-muted)" }}>
              Entdecken Sie unsere spezifischen Formulierungen zur Unterstützung verschiedener Gesundheitsbereiche.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll("left")}
              className="hidden md:flex w-10 h-10 rounded-full items-center justify-center transition hover:opacity-80"
              style={{ background: "var(--color-ivory)", border: "1px solid rgba(0,0,0,0.10)" }}
              aria-label="Vorheriges Produkt"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="hidden md:flex w-10 h-10 rounded-full items-center justify-center transition hover:opacity-80"
              style={{ background: "var(--color-ivory)", border: "1px solid rgba(0,0,0,0.10)" }}
              aria-label="Nächstes Produkt"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <Link
              href="/products/balance"
              className="inline-flex items-center gap-2 px-5 py-3 rounded font-medium transition hover:opacity-90 text-sm"
              style={{ background: "var(--color-forest)", color: "var(--color-on-dark)" }}
            >
              Jetzt Produkte entdecken
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div
          ref={ref}
          className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 -mx-5 px-5"
          style={{ scrollbarWidth: "none" }}
        >
          {PRODUCT_LIST.map((p) => (
            <Link
              key={p.slug}
              href={`/products/${p.slug}`}
              className="group flex-none snap-start w-[88%] sm:w-[60%] lg:w-[31%] rounded-2xl p-6 sm:p-7 transition hover:shadow-xl"
              style={{ background: p.palette.bg }}
            >
              <div className="aspect-[5/3] mb-5 flex items-center justify-center">
                <ProductMockup product={p} width={320} height={280} />
              </div>
              <div className="eyebrow mb-2" style={{ color: p.palette.subInk }}>
                {p.tagline}
              </div>
              <h3 className="serif text-3xl leading-tight mb-2" style={{ color: p.palette.ink }}>
                {p.name}
              </h3>
              <p className="text-sm mb-5" style={{ color: p.palette.subInk }}>
                {p.shortTagline}
              </p>
              <span
                className="inline-flex items-center gap-2 text-sm font-medium transition group-hover:gap-3"
                style={{ color: p.palette.badge }}
              >
                Mehr erfahren
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
