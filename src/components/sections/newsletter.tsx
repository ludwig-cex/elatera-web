"use client";

import { useState } from "react";
import { Check, Mail } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setDone(true);
  };

  return (
    <section className="py-20">
      <div className="container-content max-w-2xl text-center">
        <div className="eyebrow mb-3">Newsletter</div>
        <h2 className="serif text-3xl sm:text-4xl leading-tight mb-3">
          Wertvolle Experten-Tipps per E-Mail
        </h2>
        <p className="text-muted max-w-md mx-auto mb-6">
          Erhalten Sie alle 2 Wochen einen kurzen, fundierten Tipp unserer Apotheker und Wissenschaftler. Jederzeit abbestellbar.
        </p>

        {done ? (
          <div
            className="inline-flex items-center gap-3 px-6 py-4 rounded-lg"
            style={{ background: "var(--color-vertera-bg)", color: "var(--color-forest)" }}
          >
            <Check className="w-5 h-5" />
            <span>Vielen Dank — bitte bestätigen Sie Ihre E-Mail in Ihrem Posteingang.</span>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="relative flex-1">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ihre E-Mail-Adresse"
                className="w-full pl-10 pr-4 py-3 rounded outline-none focus:ring-2"
                style={{
                  background: "var(--color-ivory)",
                  border: "1px solid rgba(0,0,0,0.10)",
                }}
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded font-medium transition hover:opacity-90"
              style={{ background: "var(--color-forest)", color: "var(--color-on-dark)" }}
            >
              Abonnieren
            </button>
          </form>
        )}
        <p className="text-[11px] text-muted mt-3">
          Wir senden ausschließlich redaktionelle Inhalte. Keine Werbung. Datenschutz selbstverständlich.
        </p>
      </div>
    </section>
  );
}
