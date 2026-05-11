# Elatera Web

Premiere-Website für **Elatera** — wissenschaftlich entwickelte Nahrungsergänzung für Erwachsene 55+.

V0 läuft im **Wartelisten-Modus**: keine Zahlungsabwicklung, keine echten Produkte im Lager. Alle Produktseiten sammeln E-Mail-Anmeldungen für die Premiere 2026.

## Stack

- Next.js 16 (App Router) + Turbopack
- TypeScript
- Tailwind CSS v4 mit Design-Tokens als CSS-Variablen
- Radix UI Primitives (Accordion, Dialog, Tabs)
- lucide-react Icons
- next/font für Cormorant Garamond + DM Sans

## Lokale Entwicklung

```bash
npm install
npm run dev
```

Server startet auf [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm run start
```

## Struktur

```
src/
├── app/
│   ├── page.tsx                    # Homepage
│   ├── layout.tsx                  # Root Layout
│   ├── globals.css                 # Design Tokens
│   ├── products/[slug]/page.tsx    # Sales-Pages (Balance, Mobil, Nox)
│   ├── pages/                      # Über uns, FAQ, Kontakt, Apotheken
│   └── policies/                   # Impressum, AGB, Datenschutz, Widerruf
├── components/
│   ├── brand/logo.tsx              # Elatera-Logo (Variant 10 "Outlined Circle")
│   ├── site/                       # Header, Footer, Top-Bar, Cookie-Banner
│   ├── cart/                       # Warteliste (Context + Drawer)
│   ├── product/                    # Sales-Page Sektionen
│   └── sections/                   # Wiederverwendbare Sektionen
└── lib/
    ├── products.ts                 # Produktkatalog (3 SKUs)
    └── utils.ts                    # cn, formatPrice helpers
```

## Design System

Quelle: Claude Design Handoff Bundle (2026-05-11).

**Farben** (s. `globals.css`):
- Brand: Forest `#1f3b32` · Moss `#2f5c47` · Pine `#0f2a23`
- Accents: Copper `#a36b3a` · Gold `#b5915b`
- Backgrounds: Paper `#f4f1ea` · Cream `#efe9dc` · Ivory `#faf6ec`
- Product palettes: Balance (Eukalyptus) · Mobil (Sand) · Nox (Indigo)

**Type**: Cormorant Garamond (Serif Display) + DM Sans (Body).

**Logo**: Variante 10 "Outlined Circle" mit Cormorant-E im Kreis.

## V0-Einschränkungen

- Kein Stripe/Klarna verbunden — Verkaufsfunktion deaktiviert.
- "In den Warenkorb" → "Auf Warteliste setzen"
- Pre-Order-Versprechen: 10 % Vorteil bei Premiere.
- Impressum/AGB/Datenschutz/Widerruf sind Platzhalter — werden zur Premiere durch rechtssichere Texte ersetzt.

## Roadmap

Siehe `../01_Master_Projektplan.md` im Parent-Ordner.
