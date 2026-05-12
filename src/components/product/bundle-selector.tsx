"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import type { Product, Bundle } from "@/lib/products";
import { formatPrice, formatPricePerDay } from "@/lib/utils";
import { useCart } from "@/components/cart/cart-context";

export function BundleSelector({ product }: { product: Product }) {
  const [selected, setSelected] = useState<Bundle>(product.bundles[1]); // 3-month default
  const [isSubscription, setIsSubscription] = useState(true);
  const { addToWaitlist } = useCart();

  const handleAdd = () => {
    addToWaitlist({
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
    <div className="space-y-4">
      <div
        className="rounded-lg overflow-hidden"
        style={{ border: "1px solid rgba(0,0,0,0.08)" }}
      >
        {product.bundles.map((b) => {
          const isActive = selected.months === b.months;
          return (
            <button
              key={b.months}
              onClick={() => setSelected(b)}
              className="w-full text-left p-4 sm:p-5 flex items-center gap-4 transition-colors"
              style={{
                background: isActive ? product.palette.bg : "var(--color-ivory)",
                borderTop: b.months !== product.bundles[0].months ? "1px solid rgba(0,0,0,0.06)" : "none",
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
                  <span className="serif text-xl">
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
                <div className="text-lg font-medium">{formatPrice(b.priceCents / 100)}</div>
                {b.rrpCents && (
                  <div className="text-xs text-muted line-through">
                    {formatPrice(b.rrpCents / 100)}
                  </div>
                )}
              </div>
            </button>
          );
        })}
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
        onClick={handleAdd}
        className="w-full py-4 rounded-lg font-medium transition hover:opacity-90 active:scale-[0.99]"
        style={{ background: "var(--color-forest)", color: "var(--color-on-dark)", fontSize: 16 }}
      >
        Auf Warteliste setzen — {formatPrice(selected.priceCents / 100)}
      </button>
      <p className="text-[11px] text-muted text-center">
        Bald wieder verfügbar. Mit der Anmeldung auf der Warteliste erhalten Sie 10 % Vorteil und kostenlosen Versand bei Verfügbarkeit.
      </p>
    </div>
  );
}
