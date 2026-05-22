import Image from "next/image";
import { Star } from "lucide-react";

export function SocialProof() {
  const reviews = [
    {
      name: "Brigitte K.",
      age: 68,
      text: "Endlich ein Produkt, das nicht wie Lifestyle daherkommt. Sachlich, ehrlich, in meiner Apotheke verfügbar.",
      rating: 5,
      portrait: "/portraits/brigitte-k.png",
    },
    {
      name: "Hans-Werner P.",
      age: 71,
      text: "Auf Empfehlung meiner Apothekerin probiert. Nach acht Wochen merklich besser. Bleibe dabei.",
      rating: 5,
      portrait: "/portraits/hans-werner-p.png",
    },
    {
      name: "Renate S.",
      age: 64,
      text: "Saubere Verpackung, keine bunten Versprechen. Genau so soll Gesundheit kommuniziert werden.",
      rating: 5,
      portrait: "/portraits/renate-s.png",
    },
  ];

  return (
    <section className="py-10 sm:py-16 lg:py-20" style={{ background: "var(--color-cream)" }}>
      <div className="container-content">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="flex justify-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-current" style={{ color: "var(--color-copper)" }} />
            ))}
          </div>
          <p className="serif text-2xl sm:text-3xl leading-snug">
            Mehr als <span style={{ color: "var(--color-copper)" }}>1.200 Bewertungen</span> aus DACH
          </p>
          <p className="text-sm text-muted mt-2">
            Stimmen aus unserer Beta-Phase und aus Apothekengesprächen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reviews.map((r, i) => (
            <article
              key={i}
              className="rounded-lg p-6"
              style={{ background: "var(--color-ivory)" }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="relative w-11 h-11 rounded-full overflow-hidden flex-none">
                  <Image src={r.portrait} alt={r.name} fill sizes="44px" className="object-cover" />
                </div>
                <div className="flex gap-0.5">
                  {[...Array(r.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-current" style={{ color: "var(--color-copper)" }} />
                  ))}
                </div>
              </div>
              <p className="serif text-lg leading-snug mb-4">„{r.text}"</p>
              <div className="text-xs text-muted">
                — {r.name}, {r.age}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
