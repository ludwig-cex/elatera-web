import {
  FlaskConical, ShieldCheck, Star, Newspaper, Award,
  Truck, Leaf, RefreshCcw,
} from "lucide-react";

/**
 * Trust band marquee sitting directly under the hero — Fortea-style strip
 * that scrolls horizontally on both desktop and mobile.
 */

const ITEMS = [
  { icon: FlaskConical, label: "LABORGEPRÜFT" },
  { icon: ShieldCheck,  label: "ISO-ZERTIFIZIERT" },
  { icon: Star,         label: "HERVORRAGEND BEWERTET" },
  { icon: Newspaper,    label: "BEKANNT AUS DER APOTHEKE" },
  { icon: Award,        label: "MADE IN GERMANY" },
  { icon: RefreshCcw,   label: "90 TAGE GELD ZURÜCK" },
  { icon: Truck,        label: "VERSANDKOSTENFREI" },
  { icon: Leaf,         label: "OHNE GENTECHNIK" },
];

export function TrustBand() {
  // Duplicate the list so the loop has a seamless wrap-around.
  const looped = [...ITEMS, ...ITEMS];

  return (
    <section
      className="py-5 sm:py-6 border-y overflow-hidden"
      style={{ background: "var(--color-ivory)", borderColor: "rgba(31,59,50,0.10)" }}
      aria-label="Vertrauenshinweise"
    >
      <div className="trust-band-track flex items-center gap-12 sm:gap-16 whitespace-nowrap">
        {looped.map(({ icon: Icon, label }, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 flex-none"
            style={{ color: "var(--color-forest)" }}
          >
            <Icon className="w-5 h-5 flex-none" strokeWidth={2} />
            <span className="text-[11px] sm:text-xs uppercase tracking-widest font-medium">
              {label}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        .trust-band-track {
          width: max-content;
          animation: trust-band-scroll 40s linear infinite;
        }
        @keyframes trust-band-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .trust-band-track { animation-duration: 0s; }
        }
      `}</style>
    </section>
  );
}
