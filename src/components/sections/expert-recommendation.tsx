import Image from "next/image";
import { Quote } from "lucide-react";

export function ExpertRecommendation() {
  return (
    <section className="py-12 sm:py-20 lg:py-24" style={{ background: "var(--color-cream)" }}>
      <div className="container-content max-w-4xl">
        <div className="text-center mb-12">
          <div className="eyebrow mb-3">Apotheker-Empfehlung</div>
          <h2 className="serif text-4xl sm:text-5xl leading-tight">
            Experten empfehlen Nutrasana<sup className="text-base align-super">®</sup>
          </h2>
        </div>

        <div
          className="rounded-2xl p-6 sm:p-10 lg:p-12 grid md:grid-cols-12 gap-6 sm:gap-8 items-center"
          style={{ background: "var(--color-ivory)" }}
        >
          {/* Portrait */}
          <div className="md:col-span-3 flex justify-center">
            <div
              className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full overflow-hidden"
              style={{ background: "var(--color-vertisana-bg)", border: "1px solid rgba(0,0,0,0.06)" }}
            >
              <Image
                src="/portraits/jonas-guetermann.png"
                alt="Jonas Gütermann"
                fill
                sizes="144px"
                className="object-cover"
              />
            </div>
          </div>

          {/* Quote */}
          <div className="md:col-span-9">
            <Quote className="w-7 h-7 mb-3" style={{ color: "var(--color-copper)" }} />
            <blockquote className="serif text-xl sm:text-2xl leading-snug mb-5" style={{ color: "var(--color-ink)" }}>
              „Als Pharmazeut überzeugen mich die Nutrasana-Produkte durch die Kombination aus bewährten Pflanzenextrakten und essenziellen Mikronährstoffen. Die sorgfältig abgestimmten Rezepturen sind wissenschaftlich fundiert und darauf ausgerichtet, die Gesundheit auf natürliche Weise zu unterstützen. Besonders schätze ich den ganzheitlichen Ansatz, alltägliche Beschwerden mit hochwertigen, laborgeprüften Wirkstoffkombinationen anzugehen."
            </blockquote>
            <div className="flex items-center gap-3 text-sm">
              <div className="serif text-lg" style={{ color: "var(--color-forest)" }}>
                Jonas Gütermann
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
