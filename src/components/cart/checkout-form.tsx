"use client";

import { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { readUtm } from "@/lib/utm";

type Item = { product: string; months: number; subscription: boolean };

// Deferred-intent flow: the PaymentElement renders immediately (amount/currency
// come from the parent <Elements options>), and the manual-capture
// PaymentIntent is created server-side only when the user submits.
export function CheckoutForm({
  items,
  totalCents,
  onSuccess,
}: {
  items: Item[];
  totalCents: number;
  onSuccess: (email: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    if (!email || !email.includes("@")) {
      setError("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
      return;
    }
    setBusy(true);
    setError(null);

    // Validate the Payment Element before creating the intent.
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message ?? "Bitte prüfen Sie Ihre Zahlungsdaten.");
      setBusy(false);
      return;
    }

    // Create the manual-capture PaymentIntent server-side.
    let clientSecret: string | null = null;
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, items, totalCents, utm: readUtm() }),
      });
      const j = await res.json();
      clientSecret = j?.clientSecret ?? null;
    } catch {
      /* handled below */
    }
    if (!clientSecret) {
      setError("Zahlung konnte nicht initialisiert werden. Bitte erneut versuchen.");
      setBusy(false);
      return;
    }

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/?checkout=done`,
        receipt_email: email,
      },
      redirect: "if_required",
    });

    if (confirmError) {
      setError(confirmError.message ?? "Die Zahlung wurde nicht abgeschlossen.");
      setBusy(false);
      return;
    }

    // Authorized. The webhook releases the hold and triggers the apology mail.
    onSuccess(email);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="ihr-name@beispiel.de"
        className="w-full px-4 py-3 rounded text-sm outline-none focus:ring-2"
        style={{ background: "var(--color-ivory)", border: "1px solid rgba(0,0,0,0.10)" }}
      />
      <PaymentElement options={{ layout: "tabs" }} />
      {error && (
        <p className="text-xs" style={{ color: "var(--color-copper)" }}>
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={!stripe || busy}
        className="w-full py-3 rounded font-medium text-sm transition hover:opacity-90 disabled:opacity-60"
        style={{ background: "var(--color-forest)", color: "var(--color-on-dark)" }}
      >
        {busy ? "Wird verarbeitet …" : "Jetzt zahlungspflichtig bestellen"}
      </button>
    </form>
  );
}
