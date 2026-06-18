"use client";

import { useState } from "react";
import Image from "next/image";
import type { Product } from "@/lib/products";

type View = { src: string; label: string; objectFit?: "cover" | "contain" };

function buildViews(product: Product): View[] {
  const img = product.images;
  return [
    { src: img.stillleben,              label: "Produkt",                      objectFit: "cover" },
    { src: img.lifestyle.couplePrimary, label: "Im Alltag — Paar mit Produkt", objectFit: "cover" },
    { src: img.lifestyle.soloWoman,     label: "Im Alltag — tägliche Anwendung", objectFit: "cover" },
    { src: img.credentials,             label: "Empfohlen von Pharmazeut",     objectFit: "contain" },
    { src: img.flatlay,                 label: "Inhaltsstoffe",                objectFit: "cover" },
    { src: img.claims,                  label: "Health-Claims",                objectFit: "contain" },
    { src: `/products/${product.slug}/qualitaet.png`, label: "Qualität, der Sie vertrauen können", objectFit: "contain" },
    { src: img.nutrients,               label: "Nährstoff-Tabelle",            objectFit: "contain" },
  ];
}

export function HeroGallery({ product }: { product: Product }) {
  const views = buildViews(product);
  const [active, setActive] = useState(0);
  const p = product.palette;
  const current = views[active];

  return (
    <div className="min-w-0 w-full">
      <div
        className="rounded-2xl mb-3 aspect-[16/10] sm:aspect-[5/4] overflow-hidden relative"
        style={{ background: p.bg }}
      >
        <Image
          key={current.src}
          src={current.src}
          alt={`${product.name} — ${current.label}`}
          fill
          sizes="(min-width: 1024px) 560px, 100vw"
          className={current.objectFit === "contain" ? "object-contain p-4" : "object-cover"}
          {...(active === 0 ? { loading: "eager" as const, fetchPriority: "high" as const } : {})}
        />
      </div>

      <div
        className="flex sm:grid sm:grid-cols-8 gap-2 overflow-x-auto pb-1 -mx-1 px-1 snap-x snap-mandatory sm:overflow-x-visible sm:mx-0 sm:px-0"
        style={{ scrollbarWidth: "none" }}
      >
        {views.map((view, i) => {
          const isActive = i === active;
          return (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="aspect-square flex-none w-[68px] sm:w-auto snap-start rounded-lg overflow-hidden relative transition"
              style={{
                background: isActive ? p.bg : "var(--color-ivory)",
                border: `1px solid ${isActive ? p.badge : "rgba(0,0,0,0.06)"}`,
              }}
              aria-label={view.label}
            >
              <Image
                src={view.src}
                alt=""
                fill
                sizes="90px"
                className={view.objectFit === "contain" ? "object-contain p-1" : "object-cover"}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
