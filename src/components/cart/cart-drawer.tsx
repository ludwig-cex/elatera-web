"use client";

import { useCart } from "./cart-context";
import { X, ShoppingBag, Check, PackageX, Clock } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { track } from "@/lib/analytics";
import { readUtm } from "@/lib/utm";
import { useEffect, useState } from "react";

const RESERVATION_MS = 5 * 60 * 1000; // 5 minutes per reservation window

export function CartDrawer() {
  const { isOpen, close, items, removeFromCart, reservedSince } = useCart();
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [checkoutAttempted, setCheckoutAttempted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [now, setNow] = useState<number>(() => Date.now());

  // Re-render every second so the countdown ticks. Only runs while the drawer
  // is open and the cart has a live reservation; the interval gets cleared
  // automatically when either condition flips.
  useEffect(() => {
    if (!isOpen || !reservedSince) return;
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [isOpen, reservedSince]);

  if (!isOpen) return null;

  const totalPrice = items.reduce((sum, item) => sum + item.priceCents, 0);

  // Countdown: 5 minutes per reservation window, cycles modulo so the banner
  // always shows a positive number rather than going stale.
  const elapsed = reservedSince ? (now - reservedSince) % RESERVATION_MS : 0;
  const remaining = reservedSince ? RESERVATION_MS - elapsed : RESERVATION_MS;
  const mm = String(Math.floor(remaining / 60000)).padStart(2, "0");
  const ss = String(Math.floor((remaining % 60000) / 1000)).padStart(2, "0");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    const payloadItems = items.map((i) => ({
      product: i.productSlug,
      months: i.months,
      subscription: i.isSubscription,
    }));

    // Primary capture: server endpoint -> Klaviyo (with UTM attribution).
    // Fire-and-forget so the UX never blocks on the network.
    try {
      void fetch("/api/intent", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          honeypot,
          items: payloadItems,
          totalCents: totalPrice,
          utm: readUtm(),
        }),
        keepalive: true,
      }).catch(() => {});
    } catch {}

    // Local backup so a transient API error never silently loses a lead
    // during the pre-launch test.
    try {
      if (typeof window !== "undefined") {
        const key = "nutrasana_intent_signups";
        const prev = JSON.parse(localStorage.getItem(key) || "[]") as Array<{
          email: string;
          items: { product: string; months: number; subscription: boolean }[];
          totalCents: number;
          ts: number;
        }>;
        prev.push({ email, items: payloadItems, totalCents: totalPrice, ts: Date.now() });
        localStorage.setItem(key, JSON.stringify(prev));
      }
    } catch {}

    track("intent_email_submitted", {
      items: items.length,
      value: totalPrice / 100,
      products: items.map((i) => i.productSlug).join(","),
    });
    setSubmitted(true);
  };

  const onCheckoutClick = () => {
    track("checkout_clicked", { items: items.length, value: totalPrice / 100 });
    track("out_of_stock_shown", { items: items.length, value: totalPrice / 100 });
    setCheckoutAttempted(true);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
        onClick={close}
        aria-hidden
      />
      <aside
        className="fixed top-0 right-0 bottom-0 w-full sm:w-[420px] z-50 flex flex-col shadow-2xl"
        style={{ background: "var(--color-paper)" }}
        role="dialog"
        aria-label="Warenkorb"
      >
        <header
          className="px-5 py-4 flex items-center justify-between"
          style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}
        >
          <h2 className="serif text-2xl">Ihr Warenkorb</h2>
          <button
            onClick={close}
            className="p-2 -mr-2 rounded-full hover:bg-cream"
            aria-label="Schließen"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="p-8 text-center mt-12">
              <div
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ background: "var(--color-cream)" }}
              >
                <ShoppingBag className="w-7 h-7 opacity-50" />
              </div>
              <p className="text-muted text-sm">
                Ihr Warenkorb ist leer. Entdecken Sie unsere Produktlinie.
              </p>
            </div>
          ) : (
            <>
              {!checkoutAttempted && reservedSince && (
                <div
                  className="px-5 py-3 flex items-center gap-2 text-xs"
                  style={{
                    background: "var(--color-ivory)",
                    borderBottom: "1px solid rgba(0,0,0,0.06)",
                  }}
                  role="status"
                  aria-live="polite"
                >
                  <Clock className="w-4 h-4 flex-none" style={{ color: "var(--color-copper)" }} />
                  <span className="leading-snug">
                    <strong>Hohe Nachfrage:</strong> Ihre Produkte sind nur noch{" "}
                    <span style={{ color: "var(--color-copper)", fontWeight: 600 }}>
                      {mm}:{ss}
                    </span>{" "}
                    Minuten reserviert.
                  </span>
                </div>
              )}
              <ul className="divide-y" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                {items.map((item, idx) => (
                <li key={idx} className="p-5 flex gap-4">
                  <div
                    className="w-14 h-14 rounded flex-none flex items-center justify-center overflow-hidden"
                    style={{ background: "var(--color-cream)" }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/products/${item.productSlug}/solo.png`}
                      alt={item.productName}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="serif text-lg leading-tight">{item.productName}</div>
                    <div className="text-xs text-muted mt-1">
                      {item.months} {item.months === 1 ? "Monat" : "Monate"}
                      {item.isSubscription && " · Spar-Abo"}
                      {" · "}
                      {item.capsules} Kapseln
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-medium">{formatPrice(item.priceCents / 100)}</span>
                      <button
                        onClick={() => removeFromCart(idx)}
                        className="text-xs text-muted hover:text-ink underline"
                      >
                        Entfernen
                      </button>
                    </div>
                  </div>
                </li>
              ))}
              </ul>
            </>
          )}
        </div>

        {items.length > 0 && (
          <footer
            className="p-5 space-y-4"
            style={{ background: "var(--color-cream)", borderTop: "1px solid rgba(0,0,0,0.06)" }}
          >
            <div className="flex justify-between font-medium">
              <span>Zwischensumme</span>
              <span>{formatPrice(totalPrice / 100)}</span>
            </div>

            {!checkoutAttempted ? (
              <>
                <button
                  type="button"
                  onClick={onCheckoutClick}
                  className="w-full py-3 rounded font-medium text-sm transition hover:opacity-90"
                  style={{ background: "var(--color-forest)", color: "var(--color-on-dark)" }}
                >
                  Zur Kasse
                </button>
                <p className="text-[11px] text-muted text-center">
                  Versandkostenfrei ab 60&nbsp;€ · 90 Tage Geld-zurück-Garantie
                </p>
              </>
            ) : submitted ? (
              <div
                className="p-4 rounded text-center"
                style={{ background: "var(--color-vertisana-bg)", color: "var(--color-forest)" }}
              >
                <Check className="w-6 h-6 mx-auto mb-2" />
                <p className="text-sm font-medium">Sie stehen auf der Liste.</p>
                <p className="text-xs mt-1 opacity-80">
                  Wir benachrichtigen Sie, sobald Ihr Produkt wieder verfügbar ist — mit Ihrem 10 %-Willkommen-Vorteil.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div
                  className="p-4 rounded flex items-start gap-3"
                  style={{ background: "var(--color-ivory)", border: "1px solid rgba(0,0,0,0.08)" }}
                >
                  <PackageX className="w-5 h-5 mt-0.5 flex-none" style={{ color: "var(--color-copper)" }} />
                  <div className="text-sm">
                    <div className="font-medium mb-0.5">Leider aktuell ausverkauft</div>
                    <p className="text-xs text-muted leading-relaxed">
                      Unsere Produkte sind derzeit nicht verfügbar. Tragen Sie sich ein —
                      wir benachrichtigen Sie als Erstes, sobald nachgeliefert wird, mit
                      einem einmaligen 10 %-Willkommen-Vorteil.
                    </p>
                  </div>
                </div>
                <form onSubmit={onSubmit} className="space-y-2">
                  {/* Honeypot — hidden from humans, bots tend to fill it. */}
                  <input
                    type="text"
                    name="company"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    style={{
                      position: "absolute",
                      left: "-9999px",
                      width: 1,
                      height: 1,
                      opacity: 0,
                    }}
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ihr-name@beispiel.de"
                    className="w-full px-4 py-3 rounded text-sm outline-none focus:ring-2"
                    style={{
                      background: "var(--color-ivory)",
                      border: "1px solid rgba(0,0,0,0.10)",
                    }}
                  />
                  <button
                    type="submit"
                    className="w-full py-3 rounded font-medium text-sm transition hover:opacity-90"
                    style={{ background: "var(--color-forest)", color: "var(--color-on-dark)" }}
                  >
                    Benachrichtigen Sie mich
                  </button>
                  <p className="text-[11px] text-muted text-center">
                    Keine Werbung, kein Newsletter — nur eine Mail, sobald wieder lieferbar.
                  </p>
                  <p className="text-[11px] text-muted text-center leading-relaxed">
                    Mit dem Absenden willigen Sie ein, dass wir Ihre E-Mail-Adresse zur
                    Benachrichtigung verarbeiten. Widerruf jederzeit möglich. Details in der{" "}
                    <a href="/policies/datenschutz" className="underline">
                      Datenschutzerklärung
                    </a>
                    .
                  </p>
                </form>
              </div>
            )}
          </footer>
        )}
      </aside>
    </>
  );
}
