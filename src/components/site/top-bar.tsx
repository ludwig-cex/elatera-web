"use client";

import { Truck, ShieldCheck, Award } from "lucide-react";

export function TopBar() {
  return (
    <div className="bg-pine text-on-dark text-[12.5px]" style={{ background: "var(--color-pine)", color: "var(--color-on-dark)" }}>
      <div className="container-content flex items-center justify-center gap-6 md:gap-10 py-2 overflow-hidden">
        <span className="hidden sm:flex items-center gap-2">
          <Truck className="w-3.5 h-3.5 opacity-70" />
          <span className="opacity-90">Gratis Versand ab 60&nbsp;€</span>
        </span>
        <span className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 opacity-70" />
          <span className="opacity-90">90 Tage Geld-zurück-Garantie</span>
        </span>
        <span className="hidden md:flex items-center gap-2">
          <Award className="w-3.5 h-3.5 opacity-70" />
          <span className="opacity-90">Made in Germany · Laborgeprüft</span>
        </span>
      </div>
    </div>
  );
}
