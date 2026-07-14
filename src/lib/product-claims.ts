import type { ProductSlug } from "@/lib/products";

// Werbliche Dachaussagen fuer die Ratgeber-Support-Box nach dem Muster von
// Art. 10 Abs. 3 der Health-Claims-Verordnung (EG) 1924/2006: Die allgemeine,
// emotionale Aussage (headline) ist zulaessig, WEIL ihr der zugelassene
// spezifische Claim (anchor) unmittelbar beigestellt wird. Der Anker wird als
// *-Fussnote direkt in der Box gerendert — headline nie ohne anchor verwenden.
// Wording-Grenze: erhalten/unterstuetzen ja, verbessern/heilen/vorbeugen nein.
export type SupportClaim = { headline: string; anchor: string };

export const SUPPORT_CLAIMS: Record<ProductSlug, SupportClaim> = {
  mentisana: {
    headline: "Für einen klaren Kopf und ein gutes Gedächtnis",
    anchor: "Zink trägt zu einer normalen kognitiven Funktion bei.",
  },
  somnisana: {
    headline: "Schneller einschlafen und ruhig durch die Nacht",
    anchor:
      "Melatonin trägt dazu bei, die Einschlafzeit zu verkürzen. Die positive Wirkung stellt sich ein, wenn kurz vor dem Schlafengehen 1 mg Melatonin aufgenommen wird.",
  },
  mobilisana: {
    headline: "Für bewegliche Gelenke und einen aktiven Alltag",
    anchor:
      "Vitamin C trägt zur normalen Kollagenbildung für eine normale Funktion der Knorpel bei.",
  },
  tendisana: {
    headline: "Stark durch Sehnen und Bänder",
    anchor: "Mangan trägt zu einer normalen Bindegewebsbildung bei.",
  },
  vertisana: {
    headline: "Für sicheres Gleichgewicht und einen festen Stand",
    anchor:
      "Vitamin B6 und Vitamin B12 tragen zu einer normalen Funktion des Nervensystems bei.",
  },
  urisana: {
    headline: "Wohlgefühl für Blase und Harnwege",
    anchor: "Vitamin A trägt zur Erhaltung normaler Schleimhäute bei.",
  },
  gastrosana: {
    headline: "Für einen ruhigen Magen und eine gute Verdauung",
    anchor: "Vitamin A trägt zur Erhaltung normaler Schleimhäute bei.",
  },
  audisana: {
    headline: "Für wache Ohren und starke Nerven",
    anchor:
      "Vitamin B1, B6 und B12 tragen zu einer normalen Funktion des Nervensystems bei.",
  },
  cordisana: {
    headline: "Für Herz und Kreislauf in Balance",
    anchor: "Vitamin B1 trägt zu einer normalen Herzfunktion bei.",
  },
};
