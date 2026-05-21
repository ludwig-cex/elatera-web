"use client";

import Image from "next/image";
import * as Accordion from "@radix-ui/react-accordion";
import { Plus, Star } from "lucide-react";

type Story = {
  name: string;
  teaser: string;
  body: string;
  product: string;
  portrait: string;
};

const STORIES: Story[] = [
  {
    name: "Brigitte K., 68",
    teaser: "Endlich ein Produkt, das nicht wie Lifestyle daherkommt.",
    body:
      "Endlich ein Produkt, das nicht wie Lifestyle daherkommt. Sachlich, ehrlich, in meiner Apotheke verfügbar — und nach acht Wochen Einnahme merke ich tatsächlich einen Unterschied. Die Verpackung wirkt edel, die Beratung war freundlich. Klare Empfehlung von mir.",
    product: "Vertisana Intense",
    portrait: "/portraits/brigitte-k.png",
  },
  {
    name: "Hans-Werner P., 71",
    teaser: "Auf Empfehlung meiner Apothekerin probiert — bleibe dabei.",
    body:
      "Meine Apothekerin hat mir Nutrasana empfohlen, als ich nach einer ehrlichen Alternative zu großen Pharma-Marken gefragt habe. Die wissenschaftliche Erklärung hat mich überzeugt, das Spar-Abo macht es bequem. Nach drei Monaten merklich besser. Bleibe dabei.",
    product: "Mobilisana Intense",
    portrait: "/portraits/hans-werner-p.png",
  },
  {
    name: "Renate S., 64",
    teaser: "Saubere Verpackung, keine bunten Versprechen.",
    body:
      "Genau so soll Gesundheit kommuniziert werden: ohne Anti-Aging-Phrasen, ohne Wellness-Mode. Die Etiketten sind klar lesbar, die EFSA-Hinweise transparent, und die Sterne-Bewertungen wirken echt — keine 5,0 mit 100 Reviews, sondern eine ehrliche 4,8 mit fundierten Kommentaren.",
    product: "Somnisana Intense",
    portrait: "/portraits/renate-s.png",
  },
  {
    name: "Dr. Klaus M., 69",
    teaser: "Als pensionierter Arzt schätze ich den wissenschaftlichen Anspruch.",
    body:
      "Ich war anfangs skeptisch, wie es bei dieser Art Produkt üblich ist. Aber die EFSA-Konformität, die nachvollziehbaren Studien zu jedem Inhaltsstoff und die Made-in-Germany-Produktion haben mich überzeugt. Empfehle Nutrasana auch in meinem Umfeld weiter.",
    product: "Vertisana Intense",
    portrait: "/portraits/dr-klaus-m.png",
  },
  {
    name: "Margit L., 73",
    teaser: "Endlich wieder durchschlafen — sehr dankbar.",
    body:
      "Ich habe vieles probiert. Melatonin allein hat bei mir nie funktioniert. Die Kombination mit Baldrian, Passionsblume und Magnesium ist offenbar das, was bei mir gewirkt hat — nach zwei Wochen Einnahme schlafe ich endlich durch. Bewusst keine Schlaftabletten genommen und sehr dankbar.",
    product: "Somnisana Intense",
    portrait: "/portraits/margit-l.png",
  },
];

export function CustomerStories() {
  return (
    <section className="py-12 sm:py-20 lg:py-24">
      <div className="container-content max-w-3xl">
        <div className="text-center mb-10">
          <div className="flex justify-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-current" style={{ color: "var(--color-copper)" }} />
            ))}
          </div>
          <div className="eyebrow mb-3">Kundenstimmen</div>
          <h2 className="serif text-3xl sm:text-4xl leading-tight">
            Über 1.200 Menschen aus DACH vertrauen Nutrasana
          </h2>
        </div>

        <Accordion.Root type="multiple" className="space-y-2">
          {STORIES.map((s, i) => {
            const value = `story-${i}`;
            return (
              <Accordion.Item
                key={value}
                value={value}
                className="rounded-lg overflow-hidden"
                style={{
                  background: "var(--color-ivory)",
                  border: "1px solid rgba(0,0,0,0.06)",
                }}
              >
                <Accordion.Header>
                  <Accordion.Trigger className="group w-full px-5 py-4 flex items-start justify-between gap-4 text-left transition hover:bg-[var(--color-cream)]">
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden flex-none">
                      <Image
                        src={s.portrait}
                        alt={s.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex gap-0.5 mb-2">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} className="w-3.5 h-3.5 fill-current" style={{ color: "var(--color-copper)" }} />
                        ))}
                      </div>
                      <div className="serif text-lg leading-snug mb-1">„{s.teaser}"</div>
                      <div className="text-xs" style={{ color: "var(--color-muted)" }}>
                        — {s.name} · {s.product}
                      </div>
                    </div>
                    <Plus
                      className="w-5 h-5 mt-1 flex-none transition-transform group-data-[state=open]:rotate-45"
                      aria-hidden
                    />
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="overflow-hidden data-[state=open]:animate-[slideDown_220ms_ease-out] data-[state=closed]:animate-[slideUp_180ms_ease-in]">
                  <div
                    className="px-5 pb-5 text-[15px] leading-relaxed"
                    style={{ color: "var(--color-ink-soft)" }}
                  >
                    {s.body}
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            );
          })}
        </Accordion.Root>

        <style jsx global>{`
          @keyframes slideDown {
            from { height: 0; opacity: 0; }
            to { height: var(--radix-accordion-content-height); opacity: 1; }
          }
          @keyframes slideUp {
            from { height: var(--radix-accordion-content-height); opacity: 1; }
            to { height: 0; opacity: 0; }
          }
        `}</style>
      </div>
    </section>
  );
}
