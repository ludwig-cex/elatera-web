import {
  Factory,
  FlaskConical,
  PillBottle,
  ShieldCheck,
  Truck,
  Award,
  Leaf,
} from "lucide-react";

export function PromiseGrid() {
  const items = [
    { icon: <Factory className="w-5 h-5" />, title: "Direkt vom Hersteller", desc: "Keine Zwischenhändler — direkter Weg zu Ihnen." },
    { icon: <FlaskConical className="w-5 h-5" />, title: "Laborgeprüft", desc: "Jede Charge unabhängig geprüft." },
    { icon: <PillBottle className="w-5 h-5" />, title: "Bekannt aus der Apotheke", desc: "Mit eigener Pharmazentralnummer (PZN)." },
    { icon: <ShieldCheck className="w-5 h-5" />, title: "90 Tage Geld zurück", desc: "Volle Garantie bei Unzufriedenheit." },
    { icon: <Truck className="w-5 h-5" />, title: "Gratis Versand", desc: "Ab 60 € oder dauerhaft im Abo." },
    { icon: <Award className="w-5 h-5" />, title: "FSSC 22000 zertifiziert", desc: "Höchste Standards in der Produktion." },
    { icon: <Leaf className="w-5 h-5" />, title: "Ohne Gentechnik", desc: "Frei von künstlichen Zusatzstoffen." },
  ];

  return (
    <section className="py-16">
      <div className="container-content">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="eyebrow mb-3">Unser Versprechen</div>
          <h2 className="serif text-3xl sm:text-4xl leading-tight">
            Sieben Punkte, auf die wir uns verpflichten
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {items.map((it) => (
            <div
              key={it.title}
              className="rounded-lg p-5"
              style={{ background: "var(--color-ivory)", border: "1px solid rgba(0,0,0,0.05)" }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
                style={{ background: "var(--color-cream)", color: "var(--color-forest)" }}
              >
                {it.icon}
              </div>
              <h3 className="serif text-lg leading-tight mb-1">{it.title}</h3>
              <p className="text-xs text-muted leading-relaxed">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
