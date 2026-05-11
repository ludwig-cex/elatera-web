"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ShoppingBag, Menu, X, ChevronDown } from "lucide-react";
import { ElateraLogo } from "@/components/brand/logo";
import { useCart } from "@/components/cart/cart-context";
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
      className="sticky top-0 z-40 transition-all"
      style={{
        background: "var(--color-paper)",
        borderBottom: scrolled ? "1px solid rgba(0,0,0,0.06)" : "1px solid transparent",
        boxShadow: scrolled ? "0 1px 12px -8px rgba(0,0,0,0.18)" : "none",
      }}
    >
      <div className="container-content flex items-center justify-between h-[68px]">
        <Link href="/" aria-label="Elatera — Startseite">
          <ElateraLogo />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-7 text-[14.5px]">
          <div
            className="relative"
            onMouseEnter={() => setProductsOpen(true)}
            onMouseLeave={() => setProductsOpen(false)}
          >
            <button className="flex items-center gap-1 hover:opacity-70 transition">
              Produkte
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {productsOpen && (
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 pt-2"
                style={{ minWidth: 320 }}
              >
                <div
                  className="rounded-lg p-2 shadow-lg border"
                  style={{
                    background: "var(--color-ivory)",
                    borderColor: "rgba(0,0,0,0.08)",
                  }}
                >
                  {PRODUCT_LIST.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/products/${p.slug}`}
                      className="flex items-start gap-3 p-3 rounded hover:bg-cream/60 transition"
                      style={{ background: "transparent" }}
                    >
                      <div
                        className="w-10 h-10 rounded flex-none flex items-center justify-center"
                        style={{ background: p.palette.bg }}
                      >
                        <span
                          className="serif italic text-lg"
                          style={{ color: p.palette.badge }}
                        >
                          {p.variant.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="serif text-lg leading-tight">
                          {p.name}
                        </div>
                        <div className="text-xs text-muted mt-0.5">
                          {p.tagline}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <Link href="/pages/apotheken" className="hover:opacity-70 transition">
            Apotheken
          </Link>
          <Link href="/pages/ueber-uns" className="hover:opacity-70 transition">
            Über uns
          </Link>
          <Link href="/pages/faq" className="hover:opacity-70 transition">
            Fragen
          </Link>
          <Link href="/pages/kontakt" className="hover:opacity-70 transition">
            Kontakt
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={openCart}
            className="relative p-2.5 rounded-full hover:bg-cream/60 transition"
            aria-label="Warteliste öffnen"
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
            className="lg:hidden p-2.5 rounded-full hover:bg-cream/60 transition"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menü"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div
          className="lg:hidden border-t"
          style={{ background: "var(--color-ivory)", borderColor: "rgba(0,0,0,0.06)" }}
        >
          <nav className="container-content py-4 flex flex-col gap-1">
            <div className="eyebrow py-2">Produkte</div>
            {PRODUCT_LIST.map((p) => (
              <Link
                key={p.slug}
                href={`/products/${p.slug}`}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 py-3 px-2 rounded hover:bg-cream/60"
              >
                <div
                  className="w-9 h-9 rounded flex-none flex items-center justify-center"
                  style={{ background: p.palette.bg }}
                >
                  <span className="serif italic" style={{ color: p.palette.badge }}>
                    {p.variant.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="serif text-lg leading-tight">{p.name}</div>
                  <div className="text-xs text-muted">{p.tagline}</div>
                </div>
              </Link>
            ))}
            <div className="eyebrow py-2 mt-2">Weitere</div>
            <Link href="/pages/apotheken" onClick={() => setMobileOpen(false)} className="py-3 px-2 rounded hover:bg-cream/60">
              Apotheken
            </Link>
            <Link href="/pages/ueber-uns" onClick={() => setMobileOpen(false)} className="py-3 px-2 rounded hover:bg-cream/60">
              Über uns
            </Link>
            <Link href="/pages/faq" onClick={() => setMobileOpen(false)} className="py-3 px-2 rounded hover:bg-cream/60">
              Fragen
            </Link>
            <Link href="/pages/kontakt" onClick={() => setMobileOpen(false)} className="py-3 px-2 rounded hover:bg-cream/60">
              Kontakt
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
