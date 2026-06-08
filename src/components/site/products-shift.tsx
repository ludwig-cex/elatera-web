"use client";

import type { ReactNode } from "react";
import { useProductsMenu } from "./products-menu-context";

/**
 * Wraps the page chrome (header + main + footer) and shifts it right when the
 * products drawer is open, so the content is compressed-but-visible rather than
 * covered. The shift itself is CSS (.products-shift, see globals.css) and only
 * applies at lg+. A light scrim over the shifted content closes the menu.
 */
export function ProductsShift({ children }: { children: ReactNode }) {
  const { open, close } = useProductsMenu();
  return (
    <>
      <div className={`products-shift${open ? " is-open" : ""}`}>{children}</div>
      {open && (
        <div
          className="hidden lg:block fixed inset-0 z-[55]"
          style={{ background: "rgba(15,24,20,0.10)" }}
          onClick={close}
          aria-hidden
        />
      )}
    </>
  );
}
