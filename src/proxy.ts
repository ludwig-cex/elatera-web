import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Serverseitiger 50/50-Test (Next 16 "proxy", früher middleware): Funnel-Einstiege
// auf eine Produktseite werden zur Hälfte auf den Direct-to-Cart-Flow umgeleitet
// (Paket liegt sofort im Warenkorb, CartDeepLink flaggt entry_test=direct-cart-1m),
// die andere Hälfte sieht ganz normal die Produktseite. So muss kein Link in der
// App/den Ads geändert werden.
//
// Wichtig: gesplittet wird NUR bezahlter/Kampagnen-Traffic (utm/Click-ID vorhanden).
// Organische bzw. direkte Produktseiten-Besuche bleiben unangetastet. Self-contained,
// keine geteilten Module (läuft am Edge).

const CLICK_IDS = ["utm_source", "fbclid", "gclid", "tblci", "ob_clid", "dicbo", "msclkid"];

export function proxy(request: NextRequest) {
  const { nextUrl } = request;
  const sp = nextUrl.searchParams;

  // Schon umgeleitet/verarbeitet → nichts tun (kein Loop, kein Re-Roll).
  if (sp.has("addtocart")) return NextResponse.next();

  // Nur Kampagnen-/Ad-Traffic splitten.
  const isCampaign = CLICK_IDS.some((k) => sp.has(k));
  if (!isCampaign) return NextResponse.next();

  // 50/50: Kontrolle bekommt die normale Produktseite.
  if (Math.random() < 0.5) return NextResponse.next();

  const slug = nextUrl.pathname.split("/")[2]; // /products/<slug>
  if (!slug) return NextResponse.next();

  // Direct-to-Cart: auf die Startseite mit ?addtocart=… umleiten und alle
  // bestehenden Params (utm, fbclid, ph_did, internal, …) mitnehmen.
  const target = nextUrl.clone();
  target.pathname = "/";
  target.searchParams.set("addtocart", slug);
  target.searchParams.set("months", "1");
  return NextResponse.redirect(target);
}

export const config = {
  matcher: "/products/:slug",
};
