"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { PRODUCT_LIST, type Product } from "@/lib/products";

type Slide = {
  product: Product;
  headlineA: string;
  headlineB: string;
  body: string;
};

const SLIDES: Slide[] = [
  {
    product: PRODUCT_LIST[0],
    headlineA: "Ihre Gesundheit,",
    headlineB: "einfach gemacht.",
    body: "Nutrasana® ist Ihre Gesundheitsmarke des Vertrauens — wissenschaftlich fundierte Produkte, online bestellbar und bequem nach Hause geliefert.",
  },
  {
    product: PRODUCT_LIST[1],
    headlineA: "Beweglich",
    headlineB: "durch den Alltag.",
    body: "Mobilisana® Intense — Curcumin, Teufelskralle und Vitamin D für die normale Knochen- und Knorpelfunktion.",
  },
  {
    product: PRODUCT_LIST[2],
    headlineA: "Ruhig einschlafen,",
    headlineB: "erholt erwachen.",
    body: "Somnisana® Intense — Melatonin und Baldrian unterstützen einen ruhigen Übergang in die Nachtruhe.",
  },
];

const AUTO_ROTATE_MS = 5000;

export function HeroCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((i) => (i + 1) % SLIDES.length);
    }, AUTO_ROTATE_MS);
    return () => clearInterval(id);
  }, []);

  const slide = SLIDES[active];

  return (
    <section className="pt-6 sm:pt-10 lg:pt-14 pb-6 sm:pb-8">
      <div className="container-content">
        {/* MOBILE LAYOUT: stacked — image on top, textbox below */}
        <div className="lg:hidden rounded-2xl overflow-hidden">
          <div className="relative aspect-[4/3] sm:aspect-[16/9]">
            {SLIDES.map((s, i) => (
              <div
                key={s.product.slug}
                className="absolute inset-0 transition-opacity duration-700"
                style={{ opacity: i === active ? 1 : 0 }}
                aria-hidden={i !== active}
              >
                <Image
                  src={s.product.images.hero}
                  alt={`Älteres Paar präsentiert ${s.product.name}`}
                  fill
                  sizes="(min-width: 1024px) 1240px, 100vw"
                  {...(i === 0
                    ? { loading: "eager" as const, fetchPriority: "high" as const }
                    : { loading: "lazy" as const })}
                  className="object-cover object-[60%_center]"
                />
              </div>
            ))}
            <DotNav active={active} setActive={setActive} className="top-3 inset-x-0" />
          </div>
          <div
            className="px-5 py-7 sm:px-8 sm:py-9"
            style={{ background: "var(--color-ivory)" }}
          >
            <HeroContent slide={slide} compact />
          </div>
        </div>

        {/* DESKTOP LAYOUT: image as background, textbox as overlay */}
        <div className="hidden lg:block relative min-h-[560px] rounded-3xl overflow-hidden">
          {SLIDES.map((s, i) => (
            <div
              key={s.product.slug}
              className="absolute inset-0 transition-opacity duration-700"
              style={{ opacity: i === active ? 1 : 0 }}
              aria-hidden={i !== active}
            >
              <Image
                src={s.product.images.hero}
                alt={`Älteres Paar präsentiert ${s.product.name}`}
                fill
                sizes="(min-width: 1024px) 1240px, 100vw"
                {...(i === 0
                  ? { loading: "eager" as const, fetchPriority: "high" as const }
                  : { loading: "lazy" as const })}
                className="object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(250,246,236,0.96) 0%, rgba(250,246,236,0.85) 28%, rgba(250,246,236,0.15) 50%, rgba(250,246,236,0.0) 65%)",
                }}
              />
            </div>
          ))}
          <div className="relative h-full min-h-[560px] flex items-center">
            <div className="container-content w-full">
              <div
                className="max-w-md rounded-2xl p-10 shadow-md backdrop-blur border"
                style={{
                  background: "rgba(250, 246, 236, 0.96)",
                  borderColor: "rgba(0,0,0,0.06)",
                }}
              >
                <HeroContent slide={slide} />
              </div>
            </div>
          </div>
          <DotNav active={active} setActive={setActive} className="bottom-5 inset-x-0" />
        </div>
      </div>
    </section>
  );
}

function DotNav({
  active, setActive, className = "",
}: { active: number; setActive: (i: number) => void; className?: string }) {
  return (
    <div className={`absolute flex justify-center gap-2 z-10 ${className}`}>
      {SLIDES.map((_, i) => (
        <button
          key={i}
          onClick={() => setActive(i)}
          aria-label={`Slide ${i + 1}`}
          className="h-1.5 rounded-full transition-all"
          style={{
            width: i === active ? 28 : 10,
            background: i === active ? "var(--color-forest)" : "rgba(31,59,50,0.40)",
          }}
        />
      ))}
    </div>
  );
}

function HeroContent({ slide, compact = false }: { slide: Slide; compact?: boolean }) {
  return (
    <>
      <div
        className={compact ? "eyebrow mb-2 text-[11px]" : "eyebrow mb-4 text-xs"}
        style={{ color: "var(--color-moss)" }}
      >
        Nutrasana · Made in Germany
      </div>
      <h1 className={compact
        ? "serif text-3xl leading-[1.05] mb-3"
        : "serif text-5xl xl:text-6xl leading-[1.05] mb-5"}>
        {slide.headlineA}
        <br />
        <span style={{ color: "var(--color-moss)" }}>{slide.headlineB}</span>
      </h1>
      <p
        className={compact
          ? "text-base leading-relaxed mb-5"
          : "text-lg leading-relaxed mb-7"}
        style={{ color: "var(--color-ink-soft)" }}
      >
        {slide.body}
      </p>
      <Link
        href={`/products/${slide.product.slug}`}
        className={compact
          ? "inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium transition hover:opacity-90"
          : "inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-medium transition hover:opacity-90"}
        style={{ background: "var(--color-forest)", color: "var(--color-on-dark)" }}
      >
        Jetzt {slide.product.variant} entdecken
        <ArrowRight className="w-4 h-4" />
      </Link>

      <div
        className={compact
          ? "mt-4 flex items-center gap-2 text-xs"
          : "mt-6 flex items-center gap-3 text-sm"}
        style={{ color: "var(--color-muted)" }}
      >
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={compact ? "w-3.5 h-3.5 fill-current" : "w-4 h-4 fill-current"}
              style={{ color: "var(--color-copper)" }}
            />
          ))}
        </div>
        <span>
          <span className="font-medium" style={{ color: "var(--color-ink)" }}>4,8/5,0</span>
          {" · "}über 1.200 Bewertungen
        </span>
      </div>
    </>
  );
}
