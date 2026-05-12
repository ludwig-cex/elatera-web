import type { Metadata } from "next";
import { Mail, Phone, MapPin } from "lucide-react";
import { ContactForm } from "@/components/site/contact-form";

export const metadata: Metadata = { title: "Kontakt" };

export default function KontaktPage() {
  return (
    <div className="py-16 sm:py-20">
      <div className="container-content max-w-3xl">
        <div className="eyebrow mb-3">Kontakt</div>
        <h1 className="serif text-4xl sm:text-5xl leading-tight mb-8">
          Schreiben Sie uns
        </h1>

        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          <div className="rounded-lg p-5" style={{ background: "var(--color-ivory)", border: "1px solid rgba(0,0,0,0.06)" }}>
            <Mail className="w-5 h-5 mb-3" style={{ color: "var(--color-forest)" }} />
            <div className="font-medium text-sm mb-1">E-Mail</div>
            <a href="mailto:kontakt@elatera.de" className="text-sm text-muted hover:text-ink">
              kontakt@elatera.de
            </a>
          </div>
          <div className="rounded-lg p-5" style={{ background: "var(--color-ivory)", border: "1px solid rgba(0,0,0,0.06)" }}>
            <Phone className="w-5 h-5 mb-3" style={{ color: "var(--color-forest)" }} />
            <div className="font-medium text-sm mb-1">Telefon</div>
            <span className="text-sm text-muted">Auf Anfrage</span>
          </div>
          <div className="rounded-lg p-5" style={{ background: "var(--color-ivory)", border: "1px solid rgba(0,0,0,0.06)" }}>
            <MapPin className="w-5 h-5 mb-3" style={{ color: "var(--color-forest)" }} />
            <div className="font-medium text-sm mb-1">Sitz</div>
            <span className="text-sm text-muted">Deutschland</span>
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
