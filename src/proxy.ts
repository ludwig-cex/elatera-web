import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Direct-to-Cart-Test BEENDET (02.07.2026): Die serverseitige 50/50-Umleitung von
// Kampagnen-Traffic in den Auto-Warenkorb-Flow brachte keinen zusätzlichen
// Bestell-Klick (nur mechanisch mehr add_to_cart). Alle Besucher landen jetzt
// wieder ganz normal auf der Produktseite. (History im Git.)
//
// Seit 14.07.2026 (Nach-Migrations-Rolle als legacy.nutra-sana.de):
// Der alte Shop lebt unter legacy.* nur noch als Ratgeber-Archiv + API-Host
// (cart-ping/Crons). Damit Bing/Google/Copilot nicht den veralteten Shop
// neben dem Shopify-Shop indexieren, bekommt auf legacy.* alles außer
// /ratgeber* und /llms.txt ein noindex. Die Ratgeber-Artikel sind bewusst
// indexierbar — sie sind unser Content-Futter für KI-Suchen (Copilot-Kauf 14.07.).
export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";

  // ratgeber.nutra-sana.de = die kanonische Heimat des Ratgebers (seit 14.07.).
  // Ratgeber-Pfade + Infrastruktur-Dateien laufen normal (indexierbar),
  // alles andere gehoert dem Shopify-Shop.
  if (host.startsWith("ratgeber.")) {
    const { pathname, search } = request.nextUrl;
    const local =
      pathname.startsWith("/ratgeber") ||
      pathname.startsWith("/ratgeber-img") ||
      pathname.startsWith("/products/") || // Artikel-Bilder unter /products/<slug>/*.png
      pathname.startsWith("/authors") ||
      pathname.startsWith("/_next") ||
      pathname.startsWith("/api") ||
      pathname === "/llms.txt" ||
      pathname === "/BingSiteAuth.xml" ||
      pathname === "/sitemap.xml" ||
      pathname === "/robots.txt" ||
      pathname === "/favicon.ico" ||
      pathname === "/icon.svg" ||
      /^\/[a-f0-9]{32}\.txt$/.test(pathname); // IndexNow-Key
    if (pathname === "/") {
      return NextResponse.redirect(`https://ratgeber.nutra-sana.de/ratgeber`, 301);
    }
    if (/^\/products\/[^/.]+$/.test(pathname)) {
      return NextResponse.redirect(`https://www.nutra-sana.de${pathname}${search}`, 301);
    }
    if (!local) {
      return NextResponse.redirect(`https://www.nutra-sana.de${pathname}${search}`, 301);
    }
    return NextResponse.next();
  }

  if (host.startsWith("legacy.")) {
    // Ratgeber-Pfade auf die neue kanonische Subdomain umziehen
    if (
      request.nextUrl.pathname.startsWith("/ratgeber") ||
      request.nextUrl.pathname === "/llms.txt"
    ) {
      return NextResponse.redirect(
        `https://ratgeber.nutra-sana.de${request.nextUrl.pathname}${request.nextUrl.search}`,
        301,
      );
    }
    const { pathname, search } = request.nextUrl;

    // Shop-Pfade des ALTEN Shops auf den neuen Shopify-Shop umleiten:
    // Ratgeber-Artikel verlinken intern auf /products/<slug> und /checkout —
    // die dürfen nicht mehr im alten Stripe-Checkout landen.
    // Wichtig: /products/<slug>/bild.png sind statische Assets der Artikel
    // und bleiben lokal (deshalb nur exakt EIN Segment ohne Dateiendung).
    if (
      pathname === "/" ||
      pathname === "/checkout" ||
      /^\/products\/[^/.]+$/.test(pathname)
    ) {
      return NextResponse.redirect(
        `https://www.nutra-sana.de${pathname === "/checkout" ? "/cart" : pathname}${search}`,
        301,
      );
    }

    const indexable =
      pathname.startsWith("/ratgeber") ||
      pathname === "/llms.txt" ||
      pathname === "/BingSiteAuth.xml";
    if (!indexable) {
      const res = NextResponse.next();
      res.headers.set("X-Robots-Tag", "noindex, follow");
      return res;
    }
  }
  return NextResponse.next();
}

export const config = {
  // Statische Assets ausnehmen; api bleibt drin (Header schadet nicht, hält die
  // Matcher-Logik simpel), _next-Interna nicht anfassen.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
