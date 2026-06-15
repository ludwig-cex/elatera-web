"use client";

import { useState } from "react";
import { Mail, MessageCircle, Phone, Check, Clock } from "lucide-react";

export function ContactBlock() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section
      id="kontakt"
      className="py-20 sm:py-24 scroll-mt-28"
      style={{ background: "var(--color-pine)", color: "var(--color-on-dark)" }}
    >
      <div className="container-content grid lg:grid-cols-12 gap-10">
        {/* Left: Info */}
        <div className="lg:col-span-5">
          <div className="eyebrow mb-3" style={{ color: "var(--color-on-dark)", opacity: 0.65 }}>
            Direkter Kontakt
          </div>
          <h2 className="serif text-3xl sm:text-4xl leading-tight mb-4" style={{ color: "var(--color-on-dark)" }}>
            Nicht gefunden, was Sie suchen?
          </h2>
          <p className="leading-relaxed mb-8 opacity-85">
            Unser Service-Team antwortet montags bis freitags innerhalb von 24 Stunden — und meistens viel schneller. Schreiben Sie uns gerne direkt.
          </p>

          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <span
                className="w-10 h-10 rounded-full flex-none flex items-center justify-center"
                style={{ background: "rgba(250,246,236,0.12)" }}
              >
                <Mail className="w-4 h-4" />
              </span>
              <div>
                <div className="text-sm opacity-70">E-Mail</div>
                <a
                  href="mailto:kundenservice@nutra-sana.de"
                  className="serif text-lg leading-tight hover:opacity-80"
                  style={{ color: "var(--color-on-dark)" }}
                >
                  kundenservice@nutra-sana.de
                </a>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <span
                className="w-10 h-10 rounded-full flex-none flex items-center justify-center"
                style={{ background: "rgba(250,246,236,0.12)" }}
              >
                <MessageCircle className="w-4 h-4" />
              </span>
              <div>
                <div className="text-sm opacity-70">WhatsApp-Beratung</div>
                <div className="serif text-lg leading-tight">Auf Anfrage verfügbar</div>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <span
                className="w-10 h-10 rounded-full flex-none flex items-center justify-center"
                style={{ background: "rgba(250,246,236,0.12)" }}
              >
                <Phone className="w-4 h-4" />
              </span>
              <div>
                <div className="text-sm opacity-70">Telefon</div>
                <div className="serif text-lg leading-tight">Auf Anfrage</div>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <span
                className="w-10 h-10 rounded-full flex-none flex items-center justify-center"
                style={{ background: "rgba(250,246,236,0.12)" }}
              >
                <Clock className="w-4 h-4" />
              </span>
              <div>
                <div className="text-sm opacity-70">Antwortzeit</div>
                <div className="serif text-lg leading-tight">Mo–Fr binnen 24 Stunden</div>
              </div>
            </li>
          </ul>
        </div>

        {/* Right: Form */}
        <div className="lg:col-span-7">
          <div
            className="rounded-2xl p-7 sm:p-10"
            style={{ background: "rgba(250,246,236,0.06)", border: "1px solid rgba(250,246,236,0.12)" }}
          >
            {sent ? (
              <div className="text-center py-8">
                <div
                  className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{ background: "var(--color-vertisana-badge)" }}
                >
                  <Check className="w-6 h-6" style={{ color: "var(--color-on-dark)" }} strokeWidth={3} />
                </div>
                <h3 className="serif text-2xl mb-2" style={{ color: "var(--color-on-dark)" }}>
                  Vielen Dank
                </h3>
                <p className="opacity-85 max-w-md mx-auto">
                  Ihre Nachricht ist bei uns angekommen. Wir melden uns binnen 24 Stunden zurück.
                </p>
              </div>
            ) : (
              <form className="space-y-5" onSubmit={onSubmit}>
                <h3 className="serif text-2xl leading-tight mb-2" style={{ color: "var(--color-on-dark)" }}>
                  Schreiben Sie uns
                </h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium block mb-1.5">Ihr Name</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 rounded outline-none focus:ring-2"
                      style={{
                        background: "rgba(250,246,236,0.10)",
                        border: "1px solid rgba(250,246,236,0.15)",
                        color: "var(--color-on-dark)",
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1.5">E-Mail</label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 rounded outline-none focus:ring-2"
                      style={{
                        background: "rgba(250,246,236,0.10)",
                        border: "1px solid rgba(250,246,236,0.15)",
                        color: "var(--color-on-dark)",
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-1.5">Bestell- oder Kundennummer (optional)</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded outline-none focus:ring-2"
                    style={{
                      background: "rgba(250,246,236,0.10)",
                      border: "1px solid rgba(250,246,236,0.15)",
                      color: "var(--color-on-dark)",
                    }}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium block mb-1.5">Worum geht es?</label>
                  <select
                    required
                    className="w-full px-4 py-3 rounded outline-none focus:ring-2"
                    style={{
                      background: "rgba(250,246,236,0.10)",
                      border: "1px solid rgba(250,246,236,0.15)",
                      color: "var(--color-on-dark)",
                    }}
                    defaultValue=""
                  >
                    <option value="" disabled style={{ color: "var(--color-ink)" }}>
                      Bitte auswählen
                    </option>
                    <option value="bestellung" style={{ color: "var(--color-ink)" }}>
                      Frage zu einer Bestellung
                    </option>
                    <option value="produkt" style={{ color: "var(--color-ink)" }}>
                      Frage zu einem Produkt
                    </option>
                    <option value="ruecksendung" style={{ color: "var(--color-ink)" }}>
                      Rücksendung / Reklamation
                    </option>
                    <option value="abo" style={{ color: "var(--color-ink)" }}>
                      Spar-Abo / Konto
                    </option>
                    <option value="apotheke" style={{ color: "var(--color-ink)" }}>
                      Anfrage als Apotheke
                    </option>
                    <option value="sonstiges" style={{ color: "var(--color-ink)" }}>
                      Sonstiges
                    </option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-1.5">Ihre Nachricht</label>
                  <textarea
                    rows={5}
                    required
                    className="w-full px-4 py-3 rounded outline-none focus:ring-2 resize-none"
                    style={{
                      background: "rgba(250,246,236,0.10)",
                      border: "1px solid rgba(250,246,236,0.15)",
                      color: "var(--color-on-dark)",
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="px-7 py-3.5 rounded-full font-medium transition hover:opacity-90"
                  style={{ background: "var(--color-ivory)", color: "var(--color-pine)" }}
                >
                  Nachricht senden
                </button>

                <p className="text-xs opacity-60">
                  Mit Absenden bestätigen Sie unsere{" "}
                  <a href="/policies/datenschutz" className="underline">
                    Datenschutzerklärung
                  </a>
                  .
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
