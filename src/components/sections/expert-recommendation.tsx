import { Quote } from "lucide-react";

export function ExpertRecommendation() {
  return (
    <section className="py-20 sm:py-24" style={{ background: "var(--color-cream)" }}>
      <div className="container-content max-w-4xl">
        <div className="text-center mb-12">
          <div className="eyebrow mb-3">Apotheker-Empfehlung</div>
          <h2 className="serif text-4xl sm:text-5xl leading-tight">
            Experten empfehlen Elatera<sup className="text-base align-super">®</sup>
          </h2>
        </div>

        <div
          className="rounded-2xl p-8 sm:p-12 grid md:grid-cols-12 gap-8 items-center"
          style={{ background: "var(--color-ivory)" }}
        >
          {/* Portrait */}
          <div className="md:col-span-3 flex justify-center">
            <div
              className="relative w-36 h-36 rounded-full flex items-center justify-center"
              style={{ background: "var(--color-balance-bg)", border: "1px solid rgba(0,0,0,0.06)" }}
            >
              <svg width="100" height="100" viewBox="0 0 100 100" fill="none" aria-hidden>
                <circle cx="50" cy="38" r="16" fill="var(--color-forest)" opacity="0.85" />
                <path
                  d="M18 92 C 18 70 32 60 50 60 C 68 60 82 70 82 92 Z"
                  fill="var(--color-forest)"
                  opacity="0.85"
                />
              </svg>
              <span
                className="absolute -bottom-2 right-0 bg-white rounded-full px-2.5 py-1 text-[10px] font-medium tracking-wide"
                style={{ color: "var(--color-forest)", border: "1px solid rgba(0,0,0,0.06)" }}
              >
                approbiert
              </span>
            </div>
          </div>

          {/* Quote */}
          <div className="md:col-span-9">
            <Quote className="w-7 h-7 mb-3" style={{ color: "var(--color-copper)" }} />
            <blockquote className="serif text-xl sm:text-2xl leading-snug mb-5" style={{ color: "var(--color-ink)" }}>
              „Als Pharmazeut überzeugen mich die Elatera-Produkte durch die Kombination aus bewährten Pflanzenextrakten und essenziellen Mikronährstoffen. Die sorgfältig abgestimmten Rezepturen sind wissenschaftlich fundiert und darauf ausgerichtet, die Gesundheit auf natürliche Weise zu unterstützen. Besonders schätze ich den ganzheitlichen Ansatz, alltägliche Beschwerden mit hochwertigen, laborgeprüften Wirkstoffkombinationen anzugehen."
            </blockquote>
            <div className="flex items-center gap-3 text-sm">
              <div className="serif text-lg" style={{ color: "var(--color-forest)" }}>
                Andreas Sander
              </div>
              <div className="w-1 h-1 rounded-full" style={{ background: "var(--color-muted)" }} />
              <div style={{ color: "var(--color-muted)" }}>Approbierter Pharmazeut</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
