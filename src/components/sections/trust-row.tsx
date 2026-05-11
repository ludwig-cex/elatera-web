import { Award, Truck, ShieldCheck, Users } from "lucide-react";

export function TrustRow() {
  const items = [
    { icon: <Award className="w-4 h-4" />, label: "Made in Germany" },
    { icon: <ShieldCheck className="w-4 h-4" />, label: "90 Tage Geld zurück" },
    { icon: <Truck className="w-4 h-4" />, label: "Gratis Versand ab 60 €" },
    { icon: <Users className="w-4 h-4" />, label: "Auf Warteliste — Premiere 2026" },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {items.map((it, i) => (
        <div
          key={i}
          className="rounded-lg px-3 py-3 flex items-center gap-2.5"
          style={{ background: "var(--color-ivory)", border: "1px solid rgba(0,0,0,0.06)" }}
        >
          <span className="opacity-70">{it.icon}</span>
          <span className="text-xs font-medium leading-tight">{it.label}</span>
        </div>
      ))}
    </div>
  );
}
