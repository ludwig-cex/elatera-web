import { FlaskConical, Beaker, Stethoscope } from "lucide-react";

const USPS = [
  {
    icon: FlaskConical,
    title: "Wissenschaftlich fundiert",
    body:
      "Unsere Produkte basieren auf aktuellsten wissenschaftlichen Studien und Erkenntnissen — jede Rezeptur ist sorgfältig durchdacht und zielgerichtet formuliert.",
  },
  {
    icon: Beaker,
    title: "Von Pharmazeuten entwickelt",
    body:
      "Jede Formulierung wird gemeinsam mit approbierten Pharmazeuten entwickelt, sorgfältig optimiert und in FSSC-22000-zertifizierten Anlagen produziert.",
  },
  {
    icon: Stethoscope,
    title: "Von Apothekern empfohlen",
    body:
      "Unsere Lösungen genießen das Vertrauen von Apothekern und werden regelmäßig weiterempfohlen — jedes Produkt verfügt über eine eigene PZN.",
  },
];

export function UspThreeColumns() {
  return (
    <section className="py-12 sm:py-20 lg:py-24">
      <div className="container-content">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="eyebrow mb-3">Warum Nutrasana</div>
          <h2 className="serif text-4xl sm:text-5xl leading-tight">
            Ehrlich. Wissenschaftlich. Aus der Apotheke.
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
          {USPS.map((u, i) => {
            const Icon = u.icon;
            return (
              <div key={i} className="text-center">
                <div
                  className="w-14 h-14 rounded-full mx-auto mb-5 flex items-center justify-center"
                  style={{ background: "var(--color-cream)", color: "var(--color-forest)" }}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="serif text-2xl mb-3">{u.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-muted)" }}>
                  {u.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
