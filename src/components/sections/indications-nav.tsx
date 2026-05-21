import Link from "next/link";
import { Compass, Bone, Moon } from "lucide-react";
import { PRODUCT_LIST } from "@/lib/products";

const ICON_MAP = {
  vertisana: Compass,
  mobilisana: Bone,
  somnisana: Moon,
} as const;

export function IndicationsNav() {
  return (
    <section className="py-10 sm:py-16 lg:py-20" style={{ background: "var(--color-cream)" }}>
      <div className="container-content">
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="eyebrow mb-3">Wofür suchen Sie Unterstützung?</div>
          <h2 className="serif text-3xl sm:text-4xl leading-tight">
            Wählen Sie Ihren Gesundheitsbereich
          </h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {PRODUCT_LIST.map((p) => {
            const Icon = ICON_MAP[p.slug as keyof typeof ICON_MAP] || Compass;
            return (
              <Link
                key={p.slug}
                href={`/products/${p.slug}`}
                className="group flex flex-col items-center gap-3 rounded-2xl p-7 transition hover:-translate-y-0.5"
                style={{
                  background: "var(--color-ivory)",
                  border: "1px solid rgba(31,59,50,0.08)",
                }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ background: p.palette.bg, color: p.palette.badge }}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <div className="serif text-xl leading-tight mb-1">{p.tagline}</div>
                  <div className="text-xs" style={{ color: "var(--color-muted)" }}>
                    {p.name}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
