"use client";

import { useState, useEffect } from "react";
import { X, Gift, Truck, RefreshCw, ShieldCheck } from "lucide-react";
import { useCart } from "@/components/cart/cart-context";
import { readUtm } from "@/lib/utm";

export function SavingsModal({ product }: { product: { palette: { badge: string; badgeText: string; bg: string } } }) {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const { isOpen: drawerOpen, items } = useCart();

  useEffect(() => {
    const seen = sessionStorage.getItem("elatera-savings-modal-seen");
    if (seen || dismissed) return;
    // Don't arm if user already engaged with the waitlist
    if (drawerOpen || items.length > 0) return;
    // Paid traffic (Advertorial → Shop) never gets the modal: it would
    // interrupt the LP→PDP flow mid-read and hurt the funnel.
    const utm = readUtm();
    if (utm.utm_source || utm.tblci || utm.obclickid || utm.ob_click_id || utm.fbclid || utm.gclid || utm.msclkid) return;

    const show = () => {
      setOpen(true);
      window.clearTimeout(timer);
      document.documentElement.removeEventListener("mouseleave", onExitIntent);
    };
    // Exit intent (desktop): fire when the cursor leaves through the top edge.
    const onExitIntent = (e: MouseEvent) => {
      if (e.clientY <= 0) show();
    };
    const timer = window.setTimeout(show, 45000);
    document.documentElement.addEventListener("mouseleave", onExitIntent);
    return () => {
      window.clearTimeout(timer);
      document.documentElement.removeEventListener("mouseleave", onExitIntent);
    };
  }, [dismissed, drawerOpen, items.length]);

  // Auto-hide if user opens the waitlist while modal is up
  useEffect(() => {
    if (open && (drawerOpen || items.length > 0)) setOpen(false);
  }, [open, drawerOpen, items.length]);

  const close = () => {
    setOpen(false);
    setDismissed(true);
    sessionStorage.setItem("elatera-savings-modal-seen", "1");
  };

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
        onClick={close}
        aria-hidden
      />
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-label="Spar-Abo Vorteile"
      >
        <div
          className="relative w-full max-w-md rounded-xl p-7 shadow-xl"
          style={{ background: "var(--color-ivory)" }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={close}
            className="absolute top-3 right-3 p-2 rounded-full hover:bg-cream"
            aria-label="Schließen"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="text-center mb-5">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3 text-xs font-medium"
              style={{ background: product.palette.bg, color: product.palette.badge }}
            >
              <Gift className="w-3.5 h-3.5" />
              10 %-Willkommen-Vorteil
            </div>
            <h2 className="serif text-2xl leading-tight">
              Sichern Sie sich Ihren exklusiven Vorteil
            </h2>
            <p className="text-sm text-muted mt-2">
              Tragen Sie sich heute ein und erhalten Sie zum nächsten Launch einen exklusiven Bonus auf Ihre erste Bestellung.
            </p>
          </div>

          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-3 text-sm">
              <Gift className="w-4 h-4 mt-0.5 flex-none" style={{ color: product.palette.badge }} />
              <span>10 % zusätzlich auf Ihre erste Bestellung</span>
            </li>
            <li className="flex items-start gap-3 text-sm">
              <Truck className="w-4 h-4 mt-0.5 flex-none" style={{ color: product.palette.badge }} />
              <span>Kostenloser Versand inklusive</span>
            </li>
            <li className="flex items-start gap-3 text-sm">
              <RefreshCw className="w-4 h-4 mt-0.5 flex-none" style={{ color: product.palette.badge }} />
              <span>Jederzeit pausierbar und kündbar im Spar-Abo</span>
            </li>
            <li className="flex items-start gap-3 text-sm">
              <ShieldCheck className="w-4 h-4 mt-0.5 flex-none" style={{ color: product.palette.badge }} />
              <span>90 Tage Geld-zurück-Garantie</span>
            </li>
          </ul>

          <button
            onClick={close}
            className="w-full py-3 rounded font-medium transition hover:opacity-90"
            style={{ background: "var(--color-forest)", color: "var(--color-on-dark)" }}
          >
            Vorteile aktivieren
          </button>
          <button
            onClick={close}
            className="w-full py-2 mt-2 text-xs text-muted hover:text-ink"
          >
            Vielleicht später
          </button>
        </div>
      </div>
    </>
  );
}
