"use client";

import { useCart } from "./cart-context";
import { X, Mail, Check } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useState } from "react";

export function CartDrawer() {
  const { isOpen, close, items, removeFromWaitlist } = useCart();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const totalPrice = items.reduce((sum, item) => sum + item.priceCents, 0);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    // V0: nur clientseitig — Klaviyo-Integration kommt in Wo 2
    setSubmitted(true);
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
        aria-label="Warteliste"
      >
        <header
          className="px-5 py-4 flex items-center justify-between"
          style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}
        >
          <h2 className="serif text-2xl">Ihre Warteliste</h2>
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
                <Mail className="w-7 h-7 opacity-50" />
              </div>
              <p className="text-muted text-sm">
                Noch keine Produkte auf Ihrer Warteliste. Entdecken Sie unsere Produktlinie.
              </p>
            </div>
          ) : (
            <ul className="divide-y" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
              {items.map((item, idx) => (
                <li key={idx} className="p-5 flex gap-4">
                  <div
                    className="w-14 h-14 rounded flex-none flex items-center justify-center"
                    style={{ background: "var(--color-cream)" }}
                  >
                    <span className="serif italic text-2xl">
                      {item.variant.charAt(0)}
                    </span>
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
                        onClick={() => removeFromWaitlist(idx)}
                        className="text-xs text-muted hover:text-ink underline"
                      >
                        Entfernen
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <footer
            className="p-5 space-y-4"
            style={{ background: "var(--color-cream)", borderTop: "1px solid rgba(0,0,0,0.06)" }}
          >
            <div className="flex justify-between text-sm">
              <span className="text-muted">Pre-Order-Wert</span>
              <span className="font-medium">{formatPrice(totalPrice / 100)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">10 % Pre-Order-Rabatt</span>
              <span style={{ color: "var(--color-copper)" }}>−{formatPrice(totalPrice / 1000)}</span>
            </div>
            <div className="flex justify-between font-medium" style={{ borderTop: "1px solid rgba(0,0,0,0.10)", paddingTop: 12 }}>
              <span>Voraussichtlich</span>
              <span>{formatPrice((totalPrice * 0.9) / 100)}</span>
            </div>

            {submitted ? (
              <div
                className="p-4 rounded text-center"
                style={{ background: "var(--color-vertera-bg)", color: "var(--color-forest)" }}
              >
                <Check className="w-6 h-6 mx-auto mb-2" />
                <p className="text-sm font-medium">Sie sind auf der Warteliste.</p>
                <p className="text-xs mt-1 opacity-80">
                  Wir benachrichtigen Sie, sobald Ihr Produkt wieder verfügbar ist — mit Ihrem 10 %-Vorteil.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-2">
                <label className="text-xs font-medium block">
                  Ihre E-Mail-Adresse für die Warteliste
                </label>
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
                  Verbindlich auf Warteliste — 10 % Vorteil sichern
                </button>
                <p className="text-[11px] text-muted text-center mt-2">
                  Wir berechnen Ihnen jetzt nichts. Zahlung erst bei Produktverfügbarkeit.
                </p>
              </form>
            )}
          </footer>
        )}
      </aside>
    </>
  );
}
