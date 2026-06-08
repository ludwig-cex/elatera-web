"use client";

import Link from "next/link";
import Image from "next/image";
import { X, ArrowRight } from "lucide-react";
import { PRODUCT_LIST } from "@/lib/products";
import { useProductsMenu } from "./products-menu-context";

/**
 * Left navigation drawer for "Alle Produkte" (desktop only — mobile keeps the
 * hamburger menu). Scrollable product list; the page content shifts right via
 * ProductsShift so it stays visible.
 */
export function ProductsDrawer() {
  const { open, close } = useProductsMenu();
  return (
    <aside
      className="hidden lg:flex fixed top-0 left-0 h-screen w-[340px] z-[60] flex-col"
      style={{
        background: "var(--color-ivory)",
        borderRight: "1px solid rgba(0,0,0,0.10)",
        boxShadow: open ? "0 0 50px -10px rgba(15,42,35,0.28)" : "none",
        transform: open ? "translateX(0)" : "translateX(-100%)",
        transition: "transform .35s cubic-bezier(.4,0,.2,1)",
        visibility: open ? "visible" : "hidden",
      }}
      aria-hidden={!open}
    >
      <div
        className="flex items-center justify-between px-5 h-[64px] flex-none"
        style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}
      >
        <span className="serif text-xl" style={{ color: "var(--color-ink)" }}>
          Alle Produkte
        </span>
        <button
          type="button"
          onClick={close}
          aria-label="Menü schließen"
          className="p-2 -mr-2 rounded-full transition hover:opacity-70"
          style={{ color: "var(--color-forest)" }}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {PRODUCT_LIST.map((p) => (
          <Link
            key={p.slug}
            href={`/products/${p.slug}`}
            onClick={close}
            className="flex items-center gap-3 px-4 py-3 rounded-lg transition"
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-cream)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <div
              className="w-12 h-12 rounded-lg flex-none overflow-hidden relative"
              style={{ background: p.palette.bg }}
            >
              <Image src={p.images.stillleben} alt="" fill sizes="48px" className="object-cover" />
            </div>
            <div className="min-w-0">
              <div className="serif text-lg leading-tight" style={{ color: "var(--color-ink)" }}>
                {p.name}
              </div>
              <div className="text-xs mt-0.5 truncate" style={{ color: "var(--color-muted)" }}>
                {p.tagline}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Link
        href="/#produkte"
        onClick={close}
        className="flex-none px-5 py-3 text-sm font-medium border-t inline-flex items-center gap-2 transition hover:opacity-70"
        style={{ borderColor: "rgba(0,0,0,0.08)", color: "var(--color-forest)" }}
      >
        Alle Produkte ansehen <ArrowRight className="w-4 h-4" />
      </Link>
    </aside>
  );
}
