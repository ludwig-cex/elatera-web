"use client";

import { Truck, ShieldCheck, Award, FlaskConical, Leaf, Heart, PillBottle } from "lucide-react";

const ITEMS = [
  { icon: Truck, label: "Gratis Versand ab 60 €" },
  { icon: ShieldCheck, label: "90 Tage Geld-zurück-Garantie" },
  { icon: Award, label: "Made in Germany · Laborgeprüft" },
  { icon: FlaskConical, label: "Wissenschaftlich entwickelt" },
  { icon: PillBottle, label: "Bekannt aus der Apotheke" },
  { icon: Leaf, label: "Ohne künstliche Zusätze" },
  { icon: Heart, label: "Von Apothekern empfohlen" },
];

export function TopBar() {
  // Duplicate the array so the marquee loop is seamless.
  const loop = [...ITEMS, ...ITEMS];

  return (
    <div
      className="overflow-hidden text-[12.5px] py-2.5"
      style={{ background: "var(--color-pine)", color: "var(--color-on-dark)" }}
    >
      <div className="flex animate-marquee whitespace-nowrap" style={{ width: "max-content" }}>
        {loop.map((item, i) => {
          const Icon = item.icon;
          return (
            <span key={i} className="inline-flex items-center gap-2 px-6 opacity-90">
              <Icon className="w-3.5 h-3.5 opacity-75" />
              <span>{item.label}</span>
            </span>
          );
        })}
      </div>

      <style jsx>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 42s linear infinite;
        }
      `}</style>
    </div>
  );
}
