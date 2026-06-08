"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";

type ProductsMenuState = {
  open: boolean;
  toggle: () => void;
  openMenu: () => void;
  close: () => void;
};

const ProductsMenuContext = createContext<ProductsMenuState | null>(null);

/**
 * Desktop "Alle Produkte" navigation. Instead of a dropdown that covers the
 * page, the product list lives in a left drawer; the page content shifts right
 * (padding-left, see globals.css) so it stays visible while you browse.
 */
export function ProductsMenuProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((o) => !o), []);
  const openMenu = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);

  // Esc closes the menu.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <ProductsMenuContext.Provider value={{ open, toggle, openMenu, close }}>
      {children}
    </ProductsMenuContext.Provider>
  );
}

export function useProductsMenu() {
  const ctx = useContext(ProductsMenuContext);
  if (!ctx) throw new Error("useProductsMenu must be used within ProductsMenuProvider");
  return ctx;
}
