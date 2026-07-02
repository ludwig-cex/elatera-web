import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Direct-to-Cart-Test BEENDET (02.07.2026): Die serverseitige 50/50-Umleitung von
// Kampagnen-Traffic in den Auto-Warenkorb-Flow brachte keinen zusätzlichen
// Bestell-Klick (nur mechanisch mehr add_to_cart). Alle Besucher landen jetzt
// wieder ganz normal auf der Produktseite.
//
// Datei bleibt als reiner Pass-through erhalten, damit der Test bei Bedarf schnell
// reaktiviert werden kann (History im Git). CartDeepLink verarbeitet ?addtocart
// weiterhin, wird aber nicht mehr von hier aus gesetzt.
export function proxy(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: "/products/:slug",
};
