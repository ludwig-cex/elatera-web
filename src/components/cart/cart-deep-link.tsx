"use client";

import { useEffect, useRef } from "react";
import posthog from "posthog-js";
import { PRODUCTS, type ProductSlug } from "@/lib/products";
import { useCart } from "./cart-context";
import { track } from "@/lib/analytics";

// Direct-to-Cart-Test: ein Link wie ?addtocart=mobilisana&months=1 legt das
// gewählte Paket direkt in den Warenkorb (Drawer öffnet automatisch), statt den
// Nutzer auf die Produktseite zu schicken. Die Test-Kohorte wird über die
// PostHog-Super-Property entry_test=direct-cart-Xm geflaggt, damit ihre Conversion
// gegen den normalen Produktseiten-Einstieg gemessen werden kann.
// Global in den CartProvider eingehängt → funktioniert auf jeder Seite.
export function CartDeepLink() {
  const { addToCart } = useCart();
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    try {
      const u = new URL(window.location.href);
      const slugParam = u.searchParams.get("addtocart");
      if (!slugParam) return;
      done.current = true;

      const product = PRODUCTS[slugParam as ProductSlug];
      if (product) {
        const monthsRaw = parseInt(u.searchParams.get("months") || "1", 10);
        const months = ([1, 3, 6] as const).includes(monthsRaw as 1 | 3 | 6)
          ? (monthsRaw as 1 | 3 | 6)
          : 1;
        const bundle = product.bundles.find((b) => b.months === months) ?? product.bundles[0];
        const testId = `direct-cart-${bundle.months}m`;

        // Kohorte flaggen (persistiert via Personen-Profil) + Einstieg loggen.
        try {
          posthog.register({ entry_test: testId });
        } catch {
          // ignore
        }
        track("direct_cart_entry", { product: product.slug, months: bundle.months, test: testId });
        track("add_to_cart", {
          product: product.slug,
          variant: product.variant,
          months: bundle.months,
          capsules: bundle.capsules,
          subscription: false,
          value: bundle.priceCents / 100,
          pricing: "control",
          source: "direct-cart",
        });

        addToCart({
          productSlug: product.slug,
          productName: product.name,
          variant: product.variant,
          months: bundle.months,
          capsules: bundle.capsules,
          priceCents: bundle.priceCents,
          isSubscription: false,
        });
      }

      // Param wieder aus der URL entfernen, damit ein Reload nicht doppelt addet
      // und der Link nicht in $current_url / Shares landet.
      u.searchParams.delete("addtocart");
      u.searchParams.delete("months");
      window.history.replaceState(window.history.state, "", u.toString());
    } catch {
      // ignore — niemals den Seitenaufbau brechen
    }
  }, [addToCart]);

  return null;
}
