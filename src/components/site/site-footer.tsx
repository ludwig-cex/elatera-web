import Link from "next/link";
import { NutrasanaLogo } from "@/components/brand/logo";
import { Mail, Globe } from "lucide-react";
import { PRODUCT_LIST } from "@/lib/products";

export function SiteFooter() {
  return (
    <footer
      className="mt-24 pt-16 pb-10"
      style={{ background: "var(--color-pine)", color: "var(--color-on-dark)" }}
    >
      <div className="container-content">
        <div className="grid gap-12 md:grid-cols-12 mb-12">
          <div className="md:col-span-4">
            <NutrasanaLogo color="ivory" />
            <p className="text-sm opacity-75 mt-4 max-w-sm leading-relaxed">
              Wissenschaftlich fundierte Gesundheitslösungen: von Apothekern entwickelt, in Deutschland produziert und laborgeprüft.
            </p>
            <div className="flex items-center gap-2 mt-6 text-sm opacity-75">
              <Mail className="w-4 h-4" />
              <a href="mailto:kundenservice@nutrasana.de" className="hover:opacity-100">
                kundenservice@nutrasana.de
              </a>
            </div>
            <div className="flex items-center gap-2 mt-2 text-sm opacity-75">
              <Globe className="w-4 h-4" />
              <span>Deutschland · Österreich · Schweiz</span>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="eyebrow mb-4" style={{ color: "var(--color-on-dark)", opacity: 0.7 }}>
              Produkte
            </div>
            <ul className="space-y-2 text-sm opacity-90">
              {PRODUCT_LIST.map((p) => (
                <li key={p.slug}>
                  <Link href={`/products/${p.slug}`} className="hover:opacity-70">
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <div className="eyebrow mb-4" style={{ color: "var(--color-on-dark)", opacity: 0.7 }}>
              Service
            </div>
            <ul className="space-y-2 text-sm opacity-90">
              <li><Link href="/pages/hilfe-kontakt" className="hover:opacity-70">Hilfe & Kontakt</Link></li>
              <li><Link href="/pages/hilfe-kontakt#kontakt" className="hover:opacity-70">Kontakt-Formular</Link></li>
              <li><Link href="/policies/widerruf" className="hover:opacity-70">Widerruf</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <div className="eyebrow mb-4" style={{ color: "var(--color-on-dark)", opacity: 0.7 }}>
              Unternehmen
            </div>
            <ul className="space-y-2 text-sm opacity-90">
              <li><Link href="/pages/ueber-uns" className="hover:opacity-70">Über Nutrasana</Link></li>
              <li><Link href="/policies/impressum" className="hover:opacity-70">Impressum</Link></li>
              <li><Link href="/policies/datenschutz" className="hover:opacity-70">Datenschutz</Link></li>
              <li><Link href="/policies/agb" className="hover:opacity-70">AGB</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <div className="eyebrow mb-4" style={{ color: "var(--color-on-dark)", opacity: 0.7 }}>
              Zahlung & Versand
            </div>
            <ul className="space-y-2 text-sm opacity-90">
              <li>Klarna · PayPal · Apple Pay</li>
              <li>DHL · DPD · Hermes</li>
              <li>Gratis ab 60&nbsp;€</li>
            </ul>
          </div>
        </div>

        <div
          className="pt-8 flex flex-col md:flex-row gap-4 justify-between items-center text-xs opacity-60"
          style={{ borderTop: "1px solid rgba(255,255,255,0.10)" }}
        >
          <p>© 2026 Nutrasana. Alle Rechte vorbehalten.</p>
          <p>* Nährstoff-bezogene Health-Claims gemäß EU-Verordnung Nr. 1924/2006.</p>
        </div>
      </div>
    </footer>
  );
}
