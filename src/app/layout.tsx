import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { TopBar } from "@/components/site/top-bar";
import { CookieBanner } from "@/components/site/cookie-banner";
import { CartProvider } from "@/components/cart/cart-context";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { ProductsMenuProvider } from "@/components/site/products-menu-context";
import { ProductsDrawer } from "@/components/site/products-drawer";
import { ProductsShift } from "@/components/site/products-shift";
import { UtmCapture } from "@/components/site/utm-capture";
import { ChromeGate } from "@/components/site/chrome-gate";
import { StructuredData } from "@/components/site/structured-data";
import { Analytics } from "@vercel/analytics/next";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
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
  metadataBase: new URL("https://www.nutra-sana.de"),
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
    url: "https://www.nutra-sana.de",
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
  verification: {
    other: {
      "facebook-domain-verification": "zi88sdhgfmrl7iltslyx1plpuqpu1w",
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
            <CookieBanner />
          </ProductsMenuProvider>
        </CartProvider>
        <Analytics />
      </body>
    </html>
  );
}
