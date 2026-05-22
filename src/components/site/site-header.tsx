"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ShoppingBag, Menu, X, ChevronDown } from "lucide-react";
import { NutrasanaLogo } from "@/components/brand/logo";
import { useCart } from "@/components/cart/cart-context";
import { track } from "@/lib/analytics";
import { PRODUCT_LIST } from "@/lib/products";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const { items, open: openCart } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="z-40 transition-all"
      style={{
        background: scrolled ? "var(--color-ivory)" : "var(--color-cream)",
        borderBottom: "1px solid rgba(31, 59, 50, 0.10)",
        boxShadow: scrolled ? "0 1px 14px -8px rgba(15,42,35,0.22)" : "none",
      }}
    >
      {/* Row 1: Logo (zentriert auf Mobile, links auf Desktop) + Waitlist-Icon rechts */}
      <div className="container-content flex items-center justify-between h-[64px]">
        <Link href="/" aria-label="Nutrasana — Startseite" className="flex-1 lg:flex-none">
          <NutrasanaLogo />
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              track("cart_opened", { items: items.length });
              openCart();
            }}
            className="relative p-2.5 rounded-full transition"
            aria-label="Warenkorb öffnen"
            style={{ color: "var(--color-forest)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-ivory)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <ShoppingBag className="w-5 h-5" />
            {items.length > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 text-[10px] font-semibold rounded-full w-[18px] h-[18px] flex items-center justify-center"
                style={{ background: "var(--color-copper)", color: "var(--color-ivory)" }}
              >
                {items.length}
              </span>
            )}
          </button>
          <button
            className="lg:hidden p-2.5 rounded-full transition"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menü"
            style={{ color: "var(--color-forest)" }}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Row 2: Nav-Verzeichnis (Fortea-Style) */}
      <nav
        className="hidden lg:block"
        style={{ borderTop: "1px solid rgba(31,59,50,0.08)" }}
      >
        <div className="container-content flex items-center justify-center gap-10 h-[44px] text-[14px]"
          style={{ color: "var(--color-forest)" }}
        >
          <div
            className="relative h-full flex items-center"
            onMouseEnter={() => setProductsOpen(true)}
            onMouseLeave={() => setProductsOpen(false)}
          >
            <button className="flex items-center gap-1 hover:opacity-70 transition font-medium">
              Alle Produkte
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {productsOpen && (
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 pt-1"
                style={{ minWidth: 360 }}
              >
                <div
                  className="rounded-lg p-2 shadow-lg"
                  style={{
                    background: "var(--color-ivory)",
                    border: "1px solid rgba(0,0,0,0.08)",
                  }}
                >
                  {PRODUCT_LIST.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/products/${p.slug}`}
                      className="flex items-start gap-3 p-3 rounded transition"
                      style={{ background: "transparent" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-cream)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <div
                        className="w-12 h-12 rounded flex-none overflow-hidden relative"
                        style={{ background: p.palette.bg }}
                      >
                        <Image
                          src={p.images.solo}
                          alt=""
                          fill
                          sizes="48px"
                          className="object-contain p-0.5"
                        />
                      </div>
                      <div>
                        <div className="serif text-lg leading-tight" style={{ color: "var(--color-ink)" }}>
                          {p.name}
                        </div>
                        <div className="text-xs mt-0.5" style={{ color: "var(--color-muted)" }}>
                          {p.tagline}
                        </div>
                      </div>
                    </Link>
                  ))}
                  <Link
                    href="/products"
                    className="block px-3 py-2 mt-1 text-xs font-medium border-t"
                    style={{ borderColor: "rgba(0,0,0,0.08)", color: "var(--color-forest)" }}
                  >
                    → Alle Produkte ansehen
                  </Link>
                </div>
              </div>
            )}
          </div>
          <Link href="/pages/ueber-uns" className="hover:opacity-70 transition font-medium">
            Über Nutrasana
          </Link>
          <Link href="/pages/hilfe-kontakt" className="hover:opacity-70 transition font-medium">
            Hilfe & Kontakt
          </Link>
          <Link href="/pages/apotheken" className="hover:opacity-70 transition font-medium">
            Apotheken-Bestellung
          </Link>
        </div>
      </nav>

      {/* Mobile nav */}
      {mobileOpen && (
        <div
          className="lg:hidden"
          style={{
            background: "var(--color-ivory)",
            borderTop: "1px solid rgba(31,59,50,0.10)",
          }}
        >
          <nav className="container-content py-4 flex flex-col gap-1">
            <div className="eyebrow py-2">Alle Produkte</div>
            {PRODUCT_LIST.map((p) => (
              <Link
                key={p.slug}
                href={`/products/${p.slug}`}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 py-3 px-2 rounded"
              >
                <div
                  className="w-11 h-11 rounded flex-none overflow-hidden relative"
                  style={{ background: p.palette.bg }}
                >
                  <Image
                    src={p.images.solo}
                    alt=""
                    fill
                    sizes="44px"
                    className="object-contain p-0.5"
                  />
                </div>
                <div>
                  <div className="serif text-lg leading-tight">{p.name}</div>
                  <div className="text-xs text-muted">{p.tagline}</div>
                </div>
              </Link>
            ))}
            <div className="eyebrow py-2 mt-2">Weitere</div>
            <Link href="/pages/ueber-uns" onClick={() => setMobileOpen(false)} className="py-3 px-2 rounded">
              Über Nutrasana
            </Link>
            <Link href="/pages/hilfe-kontakt" onClick={() => setMobileOpen(false)} className="py-3 px-2 rounded">
              Hilfe & Kontakt
            </Link>
            <Link href="/pages/apotheken" onClick={() => setMobileOpen(false)} className="py-3 px-2 rounded">
              Apotheken-Bestellung
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
