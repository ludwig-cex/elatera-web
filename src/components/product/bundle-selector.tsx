"use client";

import { useState, useEffect, useRef } from "react";
import { Check, ShoppingBag } from "lucide-react";
import type { Product, Bundle } from "@/lib/products";
import { formatPrice, formatPricePerDay } from "@/lib/utils";
import { useCart } from "@/components/cart/cart-context";
import { track } from "@/lib/analytics";

export function BundleSelector({ product }: { product: Product }) {
  const [selected, setSelected] = useState<Bundle>(product.bundles[0]); // 1-month default
  const [isSubscription, setIsSubscription] = useState(false);
  const { addToCart, isOpen: cartOpen } = useCart();

  // Sticky add-to-cart bar: appears once the main CTA scrolls out of view so
  // the primary action stays reachable on long product pages. Hidden while the
  // cart drawer is open to avoid stacking two CTAs.
  const ctaRef = useRef<HTMLButtonElement>(null);
  const [scrolledPast, setScrolledPast] = useState(false);
  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        // Show the sticky bar only once the main CTA has scrolled ABOVE the
        // viewport (user moved past it), not while it is still below and simply
        // not reached yet. boundingClientRect.top < 0 == scrolled past.
        setScrolledPast(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const showSticky = scrolledPast && !cartOpen;

  useEffect(() => {
    track("product_viewed", { product: product.slug, variant: product.variant });
  }, [product.slug, product.variant]);

  const handleAddToCart = () => {
    track("add_to_cart", {
      product: product.slug,
      variant: product.variant,
      months: selected.months,
      capsules: selected.capsules,
      subscription: isSubscription,
      value: selected.priceCents / 100,
    });
    addToCart({
      productSlug: product.slug,
      productName: product.name,
      variant: product.variant,
      months: selected.months,
      capsules: selected.capsules,
      priceCents: selected.priceCents,
      isSubscription,
    });
  };

  return (
    <>
    <div className="space-y-4">
      {/* Variant selection */}
      <div>
        <div className="text-xs uppercase tracking-widest mb-2" style={{ color: product.palette.subInk }}>
          Wählen Sie Ihre Variante
        </div>
        <div
          className="rounded-lg overflow-hidden"
          style={{ border: "1px solid rgba(0,0,0,0.08)" }}
        >
          {product.bundles.map((b, idx) => {
            const isActive = selected.months === b.months;
            return (
              <button
                key={b.months}
                type="button"
                onClick={() => setSelected(b)}
                className="w-full text-left p-4 sm:p-5 flex items-center gap-4 transition-colors"
                style={{
                  background: isActive ? product.palette.bg : "var(--color-ivory)",
                  borderTop: idx !== 0 ? "1px solid rgba(0,0,0,0.06)" : "none",
                  opacity: isActive ? 1 : 0.75,
                }}
              >
                <span
                  className="w-5 h-5 rounded-full flex-none flex items-center justify-center"
                  style={{
                    background: isActive ? product.palette.badge : "transparent",
                    border: isActive ? "none" : "2px solid rgba(0,0,0,0.20)",
                  }}
                >
                  {isActive && <Check className="w-3 h-3" style={{ color: product.palette.badgeText }} strokeWidth={3} />}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="serif text-lg sm:text-xl">
                      {b.months} {b.months === 1 ? "Monat" : "Monate"}
                    </span>
                    {b.highlight && (
                      <span
                        className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full font-medium"
                        style={{ background: product.palette.badge, color: product.palette.badgeText }}
                      >
                        {b.highlight}
                      </span>
                    )}
                    {b.discountPct > 0 && (
                      <span className="text-xs font-medium" style={{ color: product.palette.badge }}>
                        −{b.discountPct}%
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted mt-0.5">
                    {b.capsules} Kapseln · {formatPricePerDay(b.priceCents, b.capsules)} pro Tag
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-base sm:text-lg font-medium">{formatPrice(b.priceCents / 100)}</div>
                  {b.rrpCents && (
                    <div className="text-xs text-muted line-through">{formatPrice(b.rrpCents / 100)}</div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <label
        className="flex items-start gap-3 p-3 rounded cursor-pointer transition"
        style={{
          background: isSubscription ? product.palette.bg : "transparent",
          border: "1px solid rgba(0,0,0,0.10)",
        }}
      >
        <input
          type="checkbox"
          checked={isSubscription}
          onChange={(e) => setIsSubscription(e.target.checked)}
          className="mt-1 w-4 h-4 flex-none"
          style={{ accentColor: product.palette.badge }}
        />
        <div className="text-sm">
          <div className="font-medium">Im Spar-Abo bestellen</div>
          <div className="text-xs text-muted mt-1">
            Automatische Lieferung nach Wunschtermin. Jederzeit pausierbar oder kündbar.
            Kostenloser Versand inklusive.
          </div>
        </div>
      </label>

      <button
        ref={ctaRef}
        type="button"
        onClick={handleAddToCart}
        className="w-full py-4 rounded-lg font-medium text-base transition hover:opacity-90 active:scale-[0.99] inline-flex items-center justify-center gap-2"
        style={{ background: "var(--color-forest)", color: "var(--color-on-dark)" }}
      >
        <ShoppingBag className="w-5 h-5" />
        In den Warenkorb — {formatPrice(selected.priceCents / 100)}
      </button>
    </div>

      {/* Sticky add-to-cart bar — appears only after the main CTA has scrolled
         out of view above. Content is centered and width-constrained so the bar
         stays compact on desktop instead of stretching full-bleed. Shows
         product, price and the add-to-cart action at a glance. */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 transition-transform duration-300 ease-out"
        style={{
          transform: showSticky ? "translateY(0)" : "translateY(110%)",
          background: "var(--color-ivory)",
          borderTop: "1px solid rgba(0,0,0,0.08)",
          boxShadow: "0 -6px 24px -12px rgba(15,42,35,0.30)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
        aria-hidden={!showSticky}
      >
        <div className="container-content">
          <div className="mx-auto max-w-3xl flex items-center gap-3 sm:gap-4 py-2.5">
            <div
              className="w-11 h-11 rounded-lg flex-none overflow-hidden relative"
              style={{ background: product.palette.bg }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.images.solo}
                alt=""
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-medium leading-tight truncate">{product.name}</div>
              <div className="text-sm text-muted truncate">
                {selected.months} {selected.months === 1 ? "Monat" : "Monate"} ·{" "}
                {formatPrice(selected.priceCents / 100)}
                {isSubscription ? " · Spar-Abo" : ""}
              </div>
            </div>
            <button
              type="button"
              onClick={handleAddToCart}
              tabIndex={showSticky ? 0 : -1}
              className="flex-none py-2.5 px-5 sm:px-7 rounded-lg font-medium text-sm sm:text-base transition hover:opacity-90 active:scale-[0.99] inline-flex items-center justify-center gap-2 whitespace-nowrap"
              style={{ background: "var(--color-forest)", color: "var(--color-on-dark)" }}
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="hidden sm:inline">In den Warenkorb</span>
              <span className="sm:hidden">Warenkorb</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
