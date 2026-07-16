"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Elements } from "@stripe/react-stripe-js";
import { ShieldCheck, Lock, PackageX, Check, Truck, RotateCcw, ArrowLeft } from "lucide-react";
import { useCart } from "@/components/cart/cart-context";
import { CheckoutForm, type Shipping } from "@/components/cart/checkout-form";
import { stripePromise, stripeEnabled } from "@/lib/stripe-client";
import { NutrasanaLogo } from "@/components/brand/logo";
import { formatPrice } from "@/lib/utils";
import { track } from "@/lib/analytics";
import { readUtm } from "@/lib/utm";

export default function CheckoutPage() {
  const { items, removeFromCart } = useCart();
  const [done, setDone] = useState(false);
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Redirect-based payment methods return to /checkout?done=1.
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("done") === "1"
    ) {
      setDone(true);
    }
  }, []);

  const totalPrice = items.reduce((sum, item) => sum + item.priceCents, 0);
  const payloadItems = items.map((i) => ({
    product: i.productSlug,
    months: i.months,
    subscription: i.isSubscription,
  }));

  // Stripe path: card authorized (webhook releases the hold + sends the mail).
  const onPaid = (paidEmail: string, shipping: Shipping | null) => {
    try {
      void fetch("/api/intent", {
        method: "POST",
        headers: { "content-type": "application/json" },
        keepalive: true,
        body: JSON.stringify({
          email: paidEmail,
          items: payloadItems,
          totalCents: totalPrice,
          shipping,
          utm: readUtm(),
        }),
      }).catch(() => {});
    } catch {}
    track("payment_authorized", { items: items.length, value: totalPrice / 100 });
    track("intent_email_submitted", {
      items: items.length,
      value: totalPrice / 100,
      products: items.map((i) => i.productSlug).join(","),
    });
    setDone(true);
  };

  // Legacy fallback (no Stripe key): out-of-stock email capture.
  const onLegacySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    try {
      void fetch("/api/intent", {
        method: "POST",
        headers: { "content-type": "application/json" },
        keepalive: true,
        body: JSON.stringify({
          email,
          honeypot,
          items: payloadItems,
          totalCents: totalPrice,
          utm: readUtm(),
        }),
      }).catch(() => {});
    } catch {}
    track("out_of_stock_shown", { items: items.length, value: totalPrice / 100 });
    track("intent_email_submitted", {
      items: items.length,
      value: totalPrice / 100,
      products: items.map((i) => i.productSlug).join(","),
    });
    setSubmitted(true);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-paper)" }}>
      {/* Minimaler Checkout-Header */}
      <header
        className="sticky top-0 z-40"
        style={{ background: "var(--color-paper)", borderBottom: "1px solid rgba(0,0,0,0.08)" }}
      >
        <div className="container-content flex items-center justify-between py-4">
          <Link href="/" aria-label="Nutrasana — Startseite">
            <NutrasanaLogo />
          </Link>
          <div className="flex items-center gap-1.5 text-sm text-muted">
            <Lock className="w-4 h-4" />
            Sichere Kasse
          </div>
        </div>
      </header>

      <main className="container-content py-8 sm:py-12 max-w-5xl">
        {done ? (
          <Confirmation />
        ) : items.length === 0 ? (
          <EmptyCart />
        ) : (
          <>
            <Link
              href="/products/mobilisana"
              className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink mb-6"
            >
              <ArrowLeft className="w-4 h-4" /> Weiter einkaufen
            </Link>

            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Links: Kontakt & Zahlung */}
              <section className="lg:col-span-7 order-2 lg:order-1">
                <h1 className="serif text-3xl sm:text-4xl leading-tight mb-6">Kasse</h1>

                {stripeEnabled ? (
                  <Elements
                    stripe={stripePromise}
                    options={{
                      mode: "payment",
                      amount: totalPrice,
                      currency: "eur",
                      captureMethod: "manual",
                      locale: "de",
                      appearance: { theme: "stripe" },
                    }}
                  >
                    <CheckoutForm items={payloadItems} totalCents={totalPrice} onSuccess={onPaid} />
                    <p className="text-sm text-muted text-center flex items-center justify-center gap-1.5 mt-4">
                      <ShieldCheck className="w-4 h-4" /> Sichere Zahlung über Stripe · SSL-verschlüsselt
                    </p>
                  </Elements>
                ) : submitted ? (
                  <div
                    className="p-5 rounded-lg"
                    style={{ background: "var(--color-vertisana-bg)", color: "var(--color-forest)" }}
                  >
                    <Check className="w-7 h-7 mb-2" />
                    <p className="font-medium">Sie stehen auf der Liste.</p>
                    <p className="text-sm mt-1 opacity-80">
                      Wir benachrichtigen Sie, sobald Ihr Produkt wieder verfügbar ist, mit Ihrem
                      10 %-Willkommen-Vorteil.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div
                      className="p-4 rounded-lg flex items-start gap-3"
                      style={{ background: "var(--color-ivory)", border: "1px solid rgba(0,0,0,0.08)" }}
                    >
                      <PackageX className="w-5 h-5 mt-0.5 flex-none" style={{ color: "var(--color-copper)" }} />
                      <div className="text-sm">
                        <div className="font-medium mb-0.5">Leider aktuell ausverkauft</div>
                        <p className="text-muted leading-relaxed">
                          Tragen Sie sich ein, wir benachrichtigen Sie als Erstes, sobald
                          nachgeliefert wird, mit einem einmaligen 10 %-Willkommen-Vorteil.
                        </p>
                      </div>
                    </div>
                    <form onSubmit={onLegacySubmit} className="space-y-2">
                      <input
                        type="text"
                        name="company"
                        tabIndex={-1}
                        autoComplete="off"
                        aria-hidden="true"
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
                      />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ihr-name@beispiel.de"
                        className="w-full px-4 py-3 rounded outline-none focus:ring-2"
                        style={{ background: "var(--color-ivory)", border: "1px solid rgba(0,0,0,0.10)" }}
                      />
                      <button
                        type="submit"
                        className="w-full py-3 rounded font-medium transition hover:opacity-90"
                        style={{ background: "var(--color-forest)", color: "var(--color-on-dark)" }}
                      >
                        Benachrichtigen Sie mich
                      </button>
                    </form>
                  </div>
                )}
              </section>

              {/* Rechts: Bestellübersicht */}
              <aside className="lg:col-span-5 order-1 lg:order-2">
                <div
                  className="rounded-xl p-5 lg:sticky lg:top-24"
                  style={{ background: "var(--color-cream)" }}
                >
                  <div className="eyebrow mb-4">Ihre Bestellung</div>

                  <ul className="space-y-4">
                    {items.map((item, idx) => (
                      <li key={idx} className="flex gap-3">
                        <div
                          className="w-14 h-14 rounded flex-none flex items-center justify-center overflow-hidden"
                          style={{ background: "var(--color-ivory)" }}
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
                          <div className="text-sm text-muted mt-0.5">
                            {item.months} {item.months === 1 ? "Monat" : "Monate"}
                            {item.isSubscription && " · Spar-Abo"} · {item.capsules} Kapseln
                          </div>
                          <button
                            onClick={() => removeFromCart(idx)}
                            className="text-xs text-muted hover:text-ink underline mt-1"
                          >
                            Entfernen
                          </button>
                        </div>
                        <div className="font-medium">{formatPrice(item.priceCents / 100)}</div>
                      </li>
                    ))}
                  </ul>

                  <div
                    className="flex justify-between font-medium text-lg mt-5 pt-4"
                    style={{ borderTop: "1px solid rgba(0,0,0,0.10)" }}
                  >
                    <span>Gesamt</span>
                    <span>{formatPrice(totalPrice / 100)}</span>
                  </div>
                  <p className="text-xs text-muted mt-1">inkl. MwSt. · Versand wird im nächsten Schritt berechnet</p>

                  <div className="grid grid-cols-1 gap-2 mt-5">
                    {[
                      { icon: <Truck className="w-4 h-4" />, label: "Kostenloser Versand" },
                      { icon: <RotateCcw className="w-4 h-4" />, label: "90 Tage Geld-zurück-Garantie" },
                      { icon: <ShieldCheck className="w-4 h-4" />, label: "Kein Geld abgebucht bis zum Versand" },
                    ].map((b) => (
                      <div key={b.label} className="flex items-center gap-2 text-sm" style={{ color: "var(--color-ink-soft)" }}>
                        <span style={{ color: "var(--color-forest)" }}>{b.icon}</span>
                        {b.label}
                      </div>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </>
        )}

        <HelpBlock />
      </main>
    </div>
  );
}

function HelpBlock() {
  return (
    <section className="mt-12 pt-10" style={{ borderTop: "1px solid rgba(0,0,0,0.08)" }}>
      <div
        className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-5 rounded-xl p-6"
        style={{ background: "var(--color-cream)" }}
      >
        <div className="w-24 h-24 rounded-full overflow-hidden flex-none" style={{ background: "var(--color-ivory)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/portraits/jonas-guetermann.png"
            alt="Jonas Gütermann, approbierter Pharmazeut"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="eyebrow mb-1.5">Echte Hilfe von echten Menschen</div>
          <h2 className="serif text-2xl leading-tight mb-1.5">
            Fragen vor dem Kauf? Wir sind persönlich für Sie da.
          </h2>
          <p className="text-sm text-muted leading-relaxed">
            Jonas Gütermann, unser approbierter Pharmazeut, und das Kundenservice-Team beantworten
            Ihre Fragen. Schreiben Sie an{" "}
            <a href="mailto:kundenservice@nutra-sana.de" className="underline underline-offset-2">
              kundenservice@nutra-sana.de
            </a>{" "}
            — Antwort Mo–Fr innerhalb von 24 Stunden.
          </p>
        </div>
      </div>
    </section>
  );
}

function EmptyCart() {
  return (
    <div className="text-center py-20 max-w-md mx-auto">
      <div
        className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
        style={{ background: "var(--color-cream)" }}
      >
        <PackageX className="w-7 h-7 opacity-50" />
      </div>
      <p className="serif text-2xl mb-2">Ihr Warenkorb ist leer</p>
      <p className="text-muted mb-6">Entdecken Sie unsere Produktlinie und finden Sie das Passende.</p>
      <Link
        href="/products/mobilisana"
        className="inline-block py-3 px-6 rounded-lg font-medium"
        style={{ background: "var(--color-forest)", color: "var(--color-on-dark)" }}
      >
        Produkte ansehen
      </Link>
    </div>
  );
}

function Confirmation() {
  return (
    <div className="max-w-xl mx-auto py-8 space-y-4">
      <div className="text-center">
        <div
          className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
          style={{ background: "var(--color-ivory)" }}
        >
          <PackageX className="w-8 h-8" style={{ color: "var(--color-copper)" }} />
        </div>
        <h1 className="serif text-3xl leading-tight">Leider gerade ausverkauft</h1>
        <p className="text-muted mt-2 leading-relaxed">
          Wir konnten Ihre Bestellung nicht abschließen. Das tut uns aufrichtig leid.
        </p>
      </div>

      <div
        className="p-5 rounded-lg flex items-start gap-3"
        style={{ background: "var(--color-vertisana-bg)", color: "var(--color-forest)" }}
      >
        <ShieldCheck className="w-7 h-7 mt-0.5 flex-none" />
        <div>
          <div className="font-semibold leading-tight">Es wurde kein Geld abgebucht.</div>
          <p className="text-sm mt-1.5 opacity-90 leading-relaxed">
            Ihre Karte wurde nur kurz <strong>vorgemerkt (reserviert)</strong>, aber{" "}
            <strong>nicht belastet</strong>. Diese Reservierung gibt Ihre Bank automatisch wieder
            frei. Es fließt kein Geld.
          </p>
        </div>
      </div>

      <div
        className="p-5 rounded-lg text-center"
        style={{ background: "var(--color-cream)", border: "1px solid rgba(0,0,0,0.06)" }}
      >
        <p className="font-semibold" style={{ color: "var(--color-copper)" }}>
          10 % Willkommen-Vorteil
        </p>
        <p className="text-sm text-muted mt-1.5 leading-relaxed">
          Als Entschuldigung schenken wir Ihnen 10 % auf Ihre erste Bestellung. Sobald wir wieder
          Vorrat haben, melden wir uns per E-Mail mit Ihrem persönlichen Gutschein.
        </p>
      </div>

      <div className="text-center pt-2">
        <Link href="/ratgeber" className="text-sm underline underline-offset-4" style={{ color: "var(--color-forest)" }}>
          In der Zwischenzeit: unsere Ratgeber lesen
        </Link>
      </div>
    </div>
  );
}
