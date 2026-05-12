import { Award, FlaskConical, ShieldCheck, Star, PillBottle } from "lucide-react";

const BADGES = [
  { icon: Award, label: "Made in Germany" },
  { icon: FlaskConical, label: "Laborgeprüft" },
  { icon: ShieldCheck, label: "ISO-Zertifiziert" },
  { icon: Star, label: "Hervorragend bewertet" },
  { icon: PillBottle, label: "Bekannt aus der Apotheke" },
];

export function TrustBadgesRow() {
  return (
    <section className="py-10 border-y" style={{ borderColor: "rgba(31,59,50,0.10)", background: "var(--color-ivory)" }}>
      <div className="container-content">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 items-center justify-items-center">
          {BADGES.map((b, i) => {
            const Icon = b.icon;
            return (
              <div key={i} className="flex flex-col items-center gap-2 text-center">
                <Icon className="w-6 h-6" style={{ color: "var(--color-forest)" }} />
                <span
                  className="text-[11px] sm:text-xs font-medium uppercase tracking-widest leading-tight"
                  style={{ color: "var(--color-ink-soft)" }}
                >
                  {b.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
