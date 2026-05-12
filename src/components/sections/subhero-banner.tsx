import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SubheroBanner() {
  return (
    <section className="py-12 sm:py-16">
      <div className="container-content">
        <div
          className="relative rounded-3xl overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, var(--color-mobilera-bg) 0%, var(--color-cream) 60%, var(--color-vertera-bg) 100%)",
          }}
        >
          <div className="relative px-8 py-14 sm:px-16 sm:py-20 lg:py-24 text-center max-w-3xl mx-auto">
            <div className="eyebrow mb-3" style={{ color: "var(--color-moss)" }}>
              Unsere Lösungen
            </div>
            <h2 className="serif text-4xl sm:text-5xl lg:text-6xl leading-[1.05] mb-5">
              Für jedes Anliegen,
              <br />
              die richtige Lösung.
            </h2>
            <p
              className="text-lg leading-relaxed max-w-xl mx-auto mb-8"
              style={{ color: "var(--color-ink-soft)" }}
            >
              Entdecken Sie unsere drei spezialisierten Formulierungen — wissenschaftlich
              entwickelt, in Deutschland produziert, von Apothekern empfohlen.
            </p>
            <Link
              href="/products/vertera"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-medium transition hover:opacity-90"
              style={{ background: "var(--color-forest)", color: "var(--color-on-dark)" }}
            >
              Jetzt Produkte entdecken
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
