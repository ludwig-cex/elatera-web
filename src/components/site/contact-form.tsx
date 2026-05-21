"use client";

import { useState } from "react";
import { Check } from "lucide-react";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  if (sent) {
    return (
      <div
        className="rounded-2xl p-8 text-center"
        style={{ background: "var(--color-vertisana-bg)" }}
      >
        <div
          className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
          style={{ background: "var(--color-forest)" }}
        >
          <Check className="w-6 h-6" style={{ color: "var(--color-on-dark)" }} />
        </div>
        <h3 className="serif text-2xl mb-2" style={{ color: "var(--color-forest)" }}>
          Vielen Dank
        </h3>
        <p className="text-sm" style={{ color: "var(--color-ink-soft)" }}>
          Ihre Nachricht ist bei uns angekommen. Wir melden uns binnen 48 Stunden zurück.
        </p>
      </div>
    );
  }

  return (
    <form
      className="space-y-5 rounded-2xl p-7"
      style={{ background: "var(--color-cream)" }}
      onSubmit={onSubmit}
    >
      <div>
        <label className="text-sm font-medium block mb-1.5">Ihr Name</label>
        <input
          type="text"
          required
          className="w-full px-4 py-3 rounded outline-none focus:ring-2"
          style={{ background: "var(--color-ivory)", border: "1px solid rgba(0,0,0,0.10)" }}
        />
      </div>
      <div>
        <label className="text-sm font-medium block mb-1.5">E-Mail-Adresse</label>
        <input
          type="email"
          required
          className="w-full px-4 py-3 rounded outline-none focus:ring-2"
          style={{ background: "var(--color-ivory)", border: "1px solid rgba(0,0,0,0.10)" }}
        />
      </div>
      <div>
        <label className="text-sm font-medium block mb-1.5">Ihre Nachricht</label>
        <textarea
          rows={5}
          required
          className="w-full px-4 py-3 rounded outline-none focus:ring-2 resize-none"
          style={{ background: "var(--color-ivory)", border: "1px solid rgba(0,0,0,0.10)" }}
        />
      </div>
      <button
        type="submit"
        className="w-full sm:w-auto px-7 py-3 rounded font-medium transition hover:opacity-90"
        style={{ background: "var(--color-forest)", color: "var(--color-on-dark)" }}
      >
        Nachricht senden
      </button>
    </form>
  );
}
