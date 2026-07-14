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
  if (host.startsWith("legacy.")) {
    const { pathname } = request.nextUrl;
    const indexable =
      pathname.startsWith("/ratgeber") || pathname === "/llms.txt";
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
