"use client";

import { useState, useRef } from "react";
import {
  PaymentElement,
  ExpressCheckoutElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import type { StripeExpressCheckoutElementConfirmEvent } from "@stripe/stripe-js";
import { readUtm } from "@/lib/utm";
import { track } from "@/lib/analytics";

type StripeErrLike = {
  type?: string;
  code?: string;
  decline_code?: string;
  message?: string;
  payment_method?: { type?: string };
};

// Payment methods that work with manual-capture (auth-hold) — card-backed only.
// Everything else (Klarna, Satispay, BNPL, redirect methods) hangs at confirm and
// is intercepted before confirmPayment.
const MANUAL_CAPTURE_OK = new Set(["card", "link"]);

type Item = { product: string; months: number; subscription: boolean };

export type Shipping = {
  name: string;
  phone?: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postal_code: string;
    country: string;
  };
};

const COUNTRIES = [
  { code: "DE", label: "Deutschland" },
  { code: "AT", label: "Österreich" },
  { code: "CH", label: "Schweiz" },
];

const fieldStyle = {
  background: "var(--color-ivory)",
  border: "1px solid rgba(0,0,0,0.12)",
} as const;
const FIELD = "w-full px-4 py-3 rounded-lg outline-none focus:ring-2";

// Shopify-style checkout form: contact -> delivery address (all fields visible
// at once, German) -> payment. Address is collected via native inputs for full
// layout control; Stripe handles only the card data (PaymentElement).
export function CheckoutForm({
  items,
  totalCents,
  onSuccess,
}: {
  items: Item[];
  totalCents: number;
  onSuccess: (email: string, shipping: Shipping | null) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();

  const [email, setEmail] = useState("");
  const [vorname, setVorname] = useState("");
  const [nachname, setNachname] = useState("");
  const [strasse, setStrasse] = useState("");
  const [plz, setPlz] = useState("");
  const [stadt, setStadt] = useState("");
  const [land, setLand] = useState("DE");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasExpress, setHasExpress] = useState(false);
  // Currently selected method in the Payment Element (card, klarna, …). Lets us
  // see WHICH method people try — incl. Klarna, which can hang without ever
  // returning an error from confirmPayment.
  const [selectedMethod, setSelectedMethod] = useState<string>("card");

  // Capture the Kasse-contact email as soon as it's entered (onBlur) so it's
  // kept even when the order is never completed (Klarna hang / abandonment).
  // Goes to a separate Klaviyo list; deduped per email so blur doesn't spam.
  const capturedEmailRef = useRef<string>("");
  const captureCheckoutEmail = () => {
    const e = email.trim().toLowerCase();
    if (!e.includes("@") || e === capturedEmailRef.current) return;
    capturedEmailRef.current = e;
    try {
      void fetch("/api/intent", {
        method: "POST",
        headers: { "content-type": "application/json" },
        keepalive: true,
        body: JSON.stringify({ email: e, source: "checkout_contact", items, totalCents, utm: readUtm() }),
      }).catch(() => {});
    } catch {}
  };

  // Track every payment failure so Klarna/BNPL hangs, card declines and init
  // errors become visible in PostHog (stage + Stripe error code/method) instead
  // of dying silently behind a red message.
  const trackPayErr = (stage: string, err?: StripeErrLike) =>
    track("payment_failed", {
      stage,
      code: err?.code ?? null,
      err_type: err?.type ?? null,
      decline_code: err?.decline_code ?? null,
      method: err?.payment_method?.type ?? null,
      message: err?.message?.slice(0, 200) ?? null,
      value: totalCents / 100,
    });

  // Shared finish step for both the express wallets and the card form: create the
  // manual-capture PaymentIntent server-side and confirm it. Same auth-hold flow
  // — the webhook releases the authorization, so no money is ever captured.
  const finishPayment = async (paidEmail: string, shipping: Shipping) => {
    let clientSecret: string | null = null;
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: paidEmail, items, totalCents, shipping, utm: readUtm() }),
      });
      const j = await res.json();
      clientSecret = j?.clientSecret ?? null;
    } catch {
      /* handled below */
    }
    if (!clientSecret) {
      trackPayErr("init_express");
      setError("Zahlung konnte nicht initialisiert werden. Bitte erneut versuchen.");
      setBusy(false);
      return false;
    }
    const { error: confirmError } = await stripe!.confirmPayment({
      elements: elements!,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/checkout?done=1`,
        receipt_email: paidEmail,
      },
      redirect: "if_required",
    });
    if (confirmError) {
      trackPayErr("confirm_express", confirmError);
      setError(confirmError.message ?? "Die Zahlung wurde nicht abgeschlossen.");
      setBusy(false);
      return false;
    }
    onSuccess(paidEmail, shipping);
    return true;
  };

  // Express wallets (Apple Pay / Google Pay / PayPal). The wallet supplies email
  // and billing address; we reuse them for the lead + the manual-capture intent.
  const onExpressConfirm = async (event: StripeExpressCheckoutElementConfirmEvent) => {
    if (!stripe || !elements) return;
    track("payment_submitted", { flow: "express", method: "express", value: totalCents / 100 });
    setBusy(true);
    setError(null);
    const { error: submitError } = await elements.submit();
    if (submitError) {
      trackPayErr("submit_express", submitError);
      setError(submitError.message ?? "Bitte prüfen Sie Ihre Zahlungsdaten.");
      setBusy(false);
      return;
    }
    const b = event.billingDetails;
    const wEmail = (b?.email || email || "").trim();
    if (!wEmail.includes("@")) {
      setError("Für die Bestellbestätigung wird eine E-Mail-Adresse benötigt.");
      setBusy(false);
      return;
    }
    const a = b?.address;
    const shipping: Shipping = {
      name: (b?.name || `${vorname} ${nachname}`).trim() || "—",
      phone: b?.phone || undefined,
      address: {
        line1: a?.line1 || "",
        line2: a?.line2 || undefined,
        city: a?.city || "",
        state: a?.state || undefined,
        postal_code: a?.postal_code || "",
        country: a?.country || land,
      },
    };
    await finishPayment(wEmail, shipping);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    // "Jetzt zahlungspflichtig bestellen" pressed — fire BEFORE confirmPayment so
    // we capture the attempt even when Klarna/BNPL hangs and never returns.
    track("payment_submitted", { flow: "card", method: selectedMethod, value: totalCents / 100 });
    captureCheckoutEmail(); // safety net in case onBlur never fired

    // Telegram-Ping an den Betreiber: jemand hat "Jetzt zahlungspflichtig
    // bestellen" gedrückt (inkl. Klarna-Versuche, bevor sie abgefangen werden).
    try {
      void fetch("/api/cart-ping", {
        method: "POST",
        headers: { "content-type": "application/json" },
        keepalive: true,
        body: JSON.stringify({
          stage: "order",
          method: selectedMethod,
          products: items.map((i) => i.product),
          totalCents,
          utm: readUtm(),
        }),
      }).catch(() => {});
    } catch {}

    // Validation model = manual-capture auth-hold, which only card-backed methods
    // support. Klarna/Satispay/BNPL would hang at confirmPayment → intercept them
    // with a friendly "pick another method" instead of a dead spinner.
    if (!MANUAL_CAPTURE_OK.has(selectedMethod)) {
      trackPayErr("blocked_method", { code: "incompatible_method", payment_method: { type: selectedMethod } });
      setError("Ups, ein Fehler ist aufgetreten. Bitte wähle eine andere Zahlungsmethode (z. B. Karte).");
      return;
    }

    const missing: string[] = [];
    if (!email.includes("@")) missing.push("E-Mail");
    if (!vorname.trim()) missing.push("Vorname");
    if (!nachname.trim()) missing.push("Nachname");
    if (!strasse.trim()) missing.push("Straße");
    if (!plz.trim()) missing.push("PLZ");
    if (!stadt.trim()) missing.push("Stadt");
    if (missing.length > 0) {
      setError(`Bitte ausfüllen: ${missing.join(", ")}.`);
      return;
    }

    setBusy(true);
    setError(null);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      trackPayErr("submit_card", submitError);
      setError(submitError.message ?? "Bitte prüfen Sie Ihre Zahlungsdaten.");
      setBusy(false);
      return;
    }

    const shipping: Shipping = {
      name: `${vorname.trim()} ${nachname.trim()}`.trim(),
      address: {
        line1: strasse.trim(),
        city: stadt.trim(),
        postal_code: plz.trim(),
        country: land,
      },
    };

    let clientSecret: string | null = null;
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, items, totalCents, shipping, utm: readUtm() }),
      });
      const j = await res.json();
      clientSecret = j?.clientSecret ?? null;
    } catch {
      /* handled below */
    }
    if (!clientSecret) {
      trackPayErr("init_card");
      setError("Zahlung konnte nicht initialisiert werden. Bitte erneut versuchen.");
      setBusy(false);
      return;
    }

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/checkout?done=1`,
        receipt_email: email,
        shipping,
        payment_method_data: {
          billing_details: {
            name: shipping.name,
            email,
            phone: shipping.phone,
            address: shipping.address,
          },
        },
      },
      redirect: "if_required",
    });

    if (confirmError) {
      trackPayErr("confirm_card", confirmError);
      setError(confirmError.message ?? "Die Zahlung wurde nicht abgeschlossen.");
      setBusy(false);
      return;
    }

    onSuccess(email, shipping);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* Express-Wallets (Apple Pay / Google Pay / PayPal) — selber Auth-Hold-Flow */}
      <div className={hasExpress ? "space-y-4" : ""}>
        <ExpressCheckoutElement
          onReady={(e) => setHasExpress(!!e.availablePaymentMethods)}
          onConfirm={onExpressConfirm}
          options={{
            buttonHeight: 48,
            emailRequired: true,
            billingAddressRequired: true,
            paymentMethods: {
              applePay: "auto",
              googlePay: "auto",
              paypal: "auto",
              link: "auto",
            },
          }}
        />
        {hasExpress && (
          <div className="flex items-center gap-3 text-sm text-muted">
            <span className="flex-1 h-px" style={{ background: "rgba(0,0,0,0.12)" }} />
            oder mit Karte bezahlen
            <span className="flex-1 h-px" style={{ background: "rgba(0,0,0,0.12)" }} />
          </div>
        )}
      </div>

      {/* Kontakt */}
      <section>
        <h2 className="text-lg font-medium mb-3">Kontakt</h2>
        <input
          type="email"
          required
          autoComplete="email"
          aria-label="E-Mail-Adresse"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={captureCheckoutEmail}
          placeholder="E-Mail-Adresse"
          className={FIELD}
          style={fieldStyle}
        />
      </section>

      {/* Lieferadresse */}
      <section>
        <h2 className="text-lg font-medium mb-3">Lieferadresse</h2>
        <div className="space-y-3">
          <select
            aria-label="Land / Region"
            autoComplete="country"
            value={land}
            onChange={(e) => setLand(e.target.value)}
            className={FIELD}
            style={fieldStyle}
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-3">
            <input
              required
              autoComplete="given-name"
              aria-label="Vorname"
              value={vorname}
              onChange={(e) => setVorname(e.target.value)}
              placeholder="Vorname"
              className={FIELD}
              style={fieldStyle}
            />
            <input
              required
              autoComplete="family-name"
              aria-label="Nachname"
              value={nachname}
              onChange={(e) => setNachname(e.target.value)}
              placeholder="Nachname"
              className={FIELD}
              style={fieldStyle}
            />
          </div>

          <input
            required
            autoComplete="address-line1"
            aria-label="Straße und Hausnummer"
            value={strasse}
            onChange={(e) => setStrasse(e.target.value)}
            placeholder="Straße und Hausnummer"
            className={FIELD}
            style={fieldStyle}
          />

          <div className="grid grid-cols-[1fr_2fr] gap-3">
            <input
              required
              inputMode="numeric"
              autoComplete="postal-code"
              aria-label="PLZ"
              value={plz}
              onChange={(e) => setPlz(e.target.value)}
              placeholder="PLZ"
              className={FIELD}
              style={fieldStyle}
            />
            <input
              required
              autoComplete="address-level2"
              aria-label="Stadt"
              value={stadt}
              onChange={(e) => setStadt(e.target.value)}
              placeholder="Stadt"
              className={FIELD}
              style={fieldStyle}
            />
          </div>
        </div>
      </section>

      {/* Zahlung */}
      <section>
        <h2 className="text-lg font-medium mb-3">Zahlung</h2>
        <PaymentElement
          onChange={(e) => setSelectedMethod(e.value.type)}
          options={{
            layout: "tabs",
            // Address comes from our own form above; billing address is passed in
            // confirmParams so the Payment Element does not ask for it again.
            fields: { billingDetails: { address: "never" } },
          }}
        />
      </section>

      {error && (
        <p className="text-sm" style={{ color: "var(--color-copper)" }}>
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={!stripe || busy}
        className="w-full py-3.5 rounded-lg font-medium transition hover:opacity-90 disabled:opacity-60"
        style={{ background: "var(--color-forest)", color: "var(--color-on-dark)" }}
      >
        {busy ? "Wird verarbeitet …" : "Jetzt zahlungspflichtig bestellen"}
      </button>
    </form>
  );
}
