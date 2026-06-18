"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import posthog from "posthog-js";
import { Check, ShoppingBag } from "lucide-react";
import type { Product, Bundle } from "@/lib/products";
import { formatPrice, formatPricePerDay } from "@/lib/utils";
import { useCart } from "@/components/cart/cart-context";
import { track } from "@/lib/analytics";

export function BundleSelector({ product }: { product: Product }) {
  const { addToCart, isOpen: cartOpen } = useCart();

  // A/B test (PostHog 50/50): a −10 € discount on the single-month option,
  // rendered with the same strikethrough + discount badge as the multi-month
  // bundles. Flag evaluates per session (cookieless); re-read once flags load.
  const [discountSingle, setDiscountSingle] = useState(false);
  useEffect(() => {
    const apply = () => setDiscountSingle(posthog.isFeatureEnabled("single-month-discount") === true);
    apply();
    return posthog.onFeatureFlags(apply);
  }, []);
  const pricingVariant = discountSingle ? "single_month_-10" : "control";

  const bundles = useMemo<Bundle[]>(
    () =>
      discountSingle
        ? product.bundles.map((b) =>
            b.months === 1 ? { ...b, priceCents: 3999, rrpCents: 4999, discountPct: 20 } : b,
          )
        : product.bundles,
    [discountSingle, product.bundles],
  );

  const [selectedMonths, setSelectedMonths] = useState<number>(product.bundles[0].months); // 1-month default
  const selected = bundles.find((b) => b.months === selectedMonths) ?? bundles[0];

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

  // Mobile vs desktop drives the sticky-bar behaviour. On mobile the in-flow
  // buy box sits below the fold and ~78% of visitors never scroll to it (PostHog),
  // so the sticky add-to-cart must be reachable from the start. On desktop the
  // buy box is visible in the hero column, so the bar only appears after the
  // main CTA has scrolled past.
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Deep-link from the advertorial (#kaufen): land on the buy box even after a
  // late layout shift (hero image loading after the initial anchor jump).
  useEffect(() => {
    if (typeof window === "undefined" || window.location.hash !== "#kaufen") return;
    const jump = () => document.getElementById("kaufen")?.scrollIntoView({ block: "start" });
    // Re-assert after late layout shifts (hero image decode, web fonts) instead
    // of a single fixed delay: a few passes + on window load so the buy box
    // actually ends up in view on slow mobile connections.
    const timers = [120, 400, 900].map((ms) => window.setTimeout(jump, ms));
    window.addEventListener("load", jump);
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("load", jump);
    };
  }, []);

  const showSticky = (isMobile || scrolledPast) && !cartOpen;

  useEffect(() => {
    track("product_viewed", { product: product.slug, variant: product.variant, pricing: pricingVariant });
  }, [product.slug, product.variant, pricingVariant]);

  const handleAddToCart = () => {
    track("add_to_cart", {
      product: product.slug,
      variant: product.variant,
      months: selected.months,
      capsules: selected.capsules,
      subscription: false,
      value: selected.priceCents / 100,
      pricing: pricingVariant,
    });
    addToCart({
      productSlug: product.slug,
      productName: product.name,
      variant: product.variant,
      months: selected.months,
      capsules: selected.capsules,
      priceCents: selected.priceCents,
      isSubscription: false,
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
          {bundles.map((b, idx) => {
            const isActive = selected.months === b.months;
            return (
              <button
                key={b.months}
                type="button"
                onClick={() => setSelectedMonths(b.months)}
                className="w-full text-left p-4 sm:p-5 flex items-center gap-4 transition-colors"
                style={{
                  // No dimming of unselected options — they must read as fully
                  // available choices, not greyed-out/disabled. Selection is shown
                  // by the filled radio + the active row's background highlight.
                  background: isActive ? product.palette.bg : "var(--color-ivory)",
                  borderTop: idx !== 0 ? "1px solid rgba(0,0,0,0.06)" : "none",
                  boxShadow: isActive ? `inset 0 0 0 2px ${product.palette.badge}` : "none",
                }}
              >
                <span
                  className="w-5 h-5 rounded-full flex-none flex items-center justify-center"
                  style={{
                    background: isActive ? product.palette.badge : "transparent",
                    border: isActive ? "none" : "2px solid rgba(0,0,0,0.35)",
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
          <div className="mx-auto max-w-3xl flex items-center gap-3 sm:gap-4 py-3">
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
              </div>
            </div>
            <button
              type="button"
              onClick={handleAddToCart}
              tabIndex={showSticky ? 0 : -1}
              className="flex-none py-3 px-6 sm:px-7 rounded-lg font-medium text-sm sm:text-base transition hover:opacity-90 active:scale-[0.99] inline-flex items-center justify-center gap-2 whitespace-nowrap"
              style={{ background: "var(--color-forest)", color: "var(--color-on-dark)" }}
            >
              <ShoppingBag className="w-5 h-5" />
              In den Warenkorb
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
