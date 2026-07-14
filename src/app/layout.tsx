import type { Metadata } from "next";
import { Merriweather, Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { TopBar } from "@/components/site/top-bar";
// Cookie-Banner vorübergehend deaktiviert (02.07.2026) — siehe unten im JSX.
// import { CookieBanner } from "@/components/site/cookie-banner";
import { CartProvider } from "@/components/cart/cart-context";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { CartDeepLink } from "@/components/cart/cart-deep-link";
import { ProductsMenuProvider } from "@/components/site/products-menu-context";
import { ProductsDrawer } from "@/components/site/products-drawer";
import { ProductsShift } from "@/components/site/products-shift";
import { UtmCapture } from "@/components/site/utm-capture";
import { ChromeGate } from "@/components/site/chrome-gate";
import { StructuredData } from "@/components/site/structured-data";
import { Analytics } from "@vercel/analytics/next";

const cormorant = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = Inter({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s — Nutrasana",
    default: "Nutrasana — Nahrungsergänzung in Apotheken-Qualität",
  },
  description:
    "Nutrasana: Nahrungsergänzung in Apotheken-Qualität für Gelenke, Gedächtnis, Schlaf, Gleichgewicht & mehr – von Pharmazeuten entwickelt, in Deutschland hergestellt.",
  // Kein globales alternates.canonical hier: es würde von allen Unterseiten
  // geerbt und jede Seite (inkl. Produktseiten) auf "/" kanonisieren.
  metadataBase: new URL("https://ratgeber.nutra-sana.de"),
  applicationName: "Nutrasana",
  keywords: [
    "Nutrasana",
    "nutra-sana",
    "nutrasana",
    "Nahrungsergänzung",
    "Apotheken-Qualität",
    "Vertisana",
    "Mobilisana",
    "Somnisana",
  ],
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: "Nutrasana",
    url: "https://ratgeber.nutra-sana.de",
    title: "Nutrasana — Nahrungsergänzung in Apotheken-Qualität",
    description:
      "Nahrungsergänzung in Apotheken-Qualität für Gelenke, Gedächtnis, Schlaf, Gleichgewicht & mehr – von Pharmazeuten entwickelt, in Deutschland hergestellt.",
  },
  twitter: {
    card: "summary",
    title: "Nutrasana — Nahrungsergänzung in Apotheken-Qualität",
    description:
      "Nahrungsergänzung in Apotheken-Qualität für Gelenke, Gedächtnis, Schlaf, Gleichgewicht & mehr – von Pharmazeuten entwickelt, in Deutschland hergestellt.",
  },
  robots: {
    index: true,
    follow: true,
  },
  // Meta (Facebook) Business domain verification for nutra-sana.de. Required
  // before Aggregated Event Measurement event ranking can be configured.
  // msvalidate.01 = Bing Webmaster Tools site verification for
  // ratgeber.nutra-sana.de (eigene Site neben der Shopify-Hauptdomain).
  verification: {
    other: {
      "facebook-domain-verification": "zi88sdhgfmrl7iltslyx1plpuqpu1w",
      "msvalidate.01": "73C529A4B7DEF94D4156B31E259CD663",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body>
        <StructuredData />
        <CartProvider>
          <ProductsMenuProvider>
            <ProductsDrawer />
            <ProductsShift>
              <UtmCapture />
              <ChromeGate>
                <div className="sticky top-0 z-50">
                  <TopBar />
                  <SiteHeader />
                </div>
              </ChromeGate>
              <main>{children}</main>
              <ChromeGate>
                <SiteFooter />
              </ChromeGate>
            </ProductsShift>
            <CartDrawer />
            <CartDeepLink />
            {/* Cookie-Banner vorübergehend deaktiviert (02.07.2026): der blockierende
                Consent-Gate (fixed, im Mobile ganzer Screen) senkt das Engagement.
                Tracking (PostHog/Meta) ist NICHT an Consent gekoppelt und läuft
                unverändert weiter. Rechtliches Risiko bewusst in Kauf genommen.
                Zum Reaktivieren einfach wieder <CookieBanner /> rendern. */}
            {/* <CookieBanner /> */}
          </ProductsMenuProvider>
        </CartProvider>
        <Analytics />
      </body>
    </html>
  );
}
