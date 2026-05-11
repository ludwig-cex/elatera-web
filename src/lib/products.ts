/**
 * Elatera Product Catalog
 * V0 = all out-of-stock, waitlist mode only.
 */

export type ProductSlug = "balance" | "mobil" | "nox";

export type IngredientHighlight = {
  name: string;
  description: string;
  efsaClaim?: string;
};

export type Bundle = {
  months: 1 | 3 | 6;
  capsules: number;
  priceCents: number;
  rrpCents?: number;
  discountPct: number;
  highlight?: string; // e.g. "Sehr beliebt"
};

export type Product = {
  slug: ProductSlug;
  name: string;        // e.g. "Elatera Balance"
  variant: string;     // e.g. "Balance"
  tagline: string;     // e.g. "Gleichgewicht & Schwindel"
  shortTagline: string;
  indication: string;  // long form
  pzn: string;
  hero: {
    headline: string;
    subheadline: string;
    badge: string;
    eyebrow: string;
  };
  palette: {
    bg: string;
    spine: string;
    spineInk: string;
    spineLine: string;
    badge: string;
    badgeText: string;
    ink: string;
    subInk: string;
    capsule: string;
  };
  uspBlocks: { title: string; description: string }[];
  ingredients: IngredientHighlight[];
  bundles: Bundle[];
  pharmacistQuote: {
    name: string;
    title: string;
    quote: string;
  };
  studies: { reference: string; finding: string }[];
  faqs: { category: string; items: { q: string; a: string }[] }[];
  scientificIntro: string;
};

const COMMON_FAQS = (productName: string, variant: string): { category: string; items: { q: string; a: string }[] }[] => [
  {
    category: "Produkt & Funktion",
    items: [
      {
        q: `Was ist ${productName} genau?`,
        a: `${productName} ist ein wissenschaftlich entwickeltes Nahrungsergänzungsmittel — eine sorgfältig abgestimmte Kombination aus pflanzlichen Extrakten und essenziellen Mikronährstoffen, hergestellt in Deutschland und laborgeprüft nach FSSC 22000.`,
      },
      {
        q: "Was ist im Produkt enthalten?",
        a: "Die genaue Zutatenliste finden Sie weiter oben auf dieser Seite. Alle Inhaltsstoffe werden vor Verarbeitung auf Reinheit geprüft.",
      },
      {
        q: "Welche Funktion haben die Mikronährstoffe?",
        a: "Die EFSA-konformen Health-Claims der einzelnen Inhaltsstoffe finden Sie bei jedem Wirkstoff einzeln aufgeführt.",
      },
      {
        q: "Ist das Produkt gut verträglich?",
        a: `${productName} ist allergenfrei nach den 14 EU-Hauptallergenen, laktosefrei, glutenfrei und ohne künstliche Zusätze.`,
      },
      {
        q: "Gibt es Nebenwirkungen oder Wechselwirkungen?",
        a: "Bei bestimmungsgemäßer Anwendung sind keine Nebenwirkungen bekannt. Bei der Einnahme von Medikamenten oder einer bestehenden Erkrankung empfehlen wir Rücksprache mit Ihrem Arzt oder Apotheker.",
      },
    ],
  },
  {
    category: "Einnahme & Anwendung",
    items: [
      {
        q: "Wie ist die empfohlene Dosierung?",
        a: "1 Kapsel täglich, unzerkaut, mit einem großen Glas Wasser.",
      },
      {
        q: "Zu welcher Tageszeit sollte ich einnehmen?",
        a: variant === "Nox"
          ? "Etwa 30 Minuten vor dem Zubettgehen — so kann der Wirkstoff seine volle Wirkung entfalten."
          : "Die Tageszeit ist beliebig wählbar. Wichtig ist die regelmäßige tägliche Einnahme.",
      },
      {
        q: "Wie lange sollte ich einnehmen?",
        a: "Wir empfehlen mindestens 8–12 Wochen tägliche Einnahme, um die volle Wirkung zu erfahren.",
      },
      {
        q: "Was, wenn ich eine Einnahme vergesse?",
        a: "Bitte nicht nachholen — am nächsten Tag einfach mit der gewohnten Dosis fortfahren.",
      },
      {
        q: "Darf ich die Kapsel teilen oder öffnen?",
        a: "Nein. Bitte unzerkaut mit Wasser einnehmen, damit die magensaftresistente Hülle ihre Funktion erfüllt.",
      },
    ],
  },
  {
    category: "Inhaltsstoffe & Verträglichkeit",
    items: [
      {
        q: "Ist die Rezeptur vegan?",
        a: "Die meisten Inhaltsstoffe sind pflanzlich. Vitamin D3 (sofern enthalten) stammt aus Schafswollfett, wodurch das Produkt vegetarisch, aber nicht vegan ist.",
      },
      {
        q: "Enthält das Produkt Laktose oder Gluten?",
        a: "Nein, das Produkt ist laktosefrei und glutenfrei.",
      },
      {
        q: "Ist das Produkt gentechnikfrei?",
        a: "Ja. Alle Inhaltsstoffe sind ohne gentechnische Veränderung.",
      },
    ],
  },
  {
    category: "Zielgruppe & Hinweise",
    items: [
      {
        q: "Für wen ist das Produkt geeignet?",
        a: "Für Erwachsene, die ihr Wohlbefinden gezielt unterstützen möchten.",
      },
      {
        q: "Schwangerschaft, Stillzeit, Kinder?",
        a: "Bei Schwangerschaft und Stillzeit bitte Rücksprache mit dem Arzt halten. Nicht für Kinder unter 18 Jahren bestimmt.",
      },
      {
        q: "Bin ich als Diabetiker betroffen?",
        a: "Das Produkt enthält keinen zugesetzten Zucker. Trotzdem empfehlen wir bei Diabetes eine ärztliche Rücksprache vor Einnahmebeginn.",
      },
    ],
  },
  {
    category: "Weitere Fragen",
    items: [
      {
        q: "Wie lagere ich das Produkt richtig?",
        a: "Kühl, trocken und außerhalb der Reichweite von Kindern lagern. Nach dem Öffnen innerhalb von 12 Monaten verbrauchen.",
      },
      {
        q: "Wie viele Kapseln enthält eine Packung?",
        a: "30 Kapseln pro Packung — entspricht einem Monatsvorrat bei täglicher Einnahme.",
      },
      {
        q: "Wo wird das Produkt hergestellt?",
        a: "Ausschließlich in Deutschland, in FSSC-22000-zertifizierten Anlagen, mit jeder Charge laborgeprüft.",
      },
    ],
  },
];

const COMMON_PHARMACIST = {
  name: "Dr. Andreas Heller",
  title: "Approbierter Apotheker",
  quote: "Eine wissenschaftlich durchdachte Formulierung mit Inhaltsstoffen in relevanten Dosierungen — genau das, was meine Patientinnen und Patienten brauchen.",
};

const COMMON_BUNDLES: Bundle[] = [
  { months: 1, capsules: 30,  priceCents: 5999,  discountPct: 0 },
  { months: 3, capsules: 90,  priceCents: 11518, rrpCents: 17997, discountPct: 36, highlight: "Sehr beliebt" },
  { months: 6, capsules: 180, priceCents: 19796, rrpCents: 35994, discountPct: 45 },
];

export const PRODUCTS: Record<ProductSlug, Product> = {
  balance: {
    slug: "balance",
    name: "Elatera Balance",
    variant: "Balance",
    tagline: "Gleichgewicht & Schwindel",
    shortTagline: "für inneren Halt",
    indication: "Bei Schwindelgefühl, Gleichgewichtsstörungen und für innere Sicherheit im Alltag",
    pzn: "20226001",
    hero: {
      headline: "Elatera Balance",
      subheadline: "Für ein sicheres Stehen, einen klaren Kopf und Stabilität im Alltag.",
      badge: "Premiere — auf Warteliste verfügbar",
      eyebrow: "Gleichgewicht · Schwindel · Nervenfunktion",
    },
    palette: {
      bg: "#e6ece4",
      spine: "#dde4d9",
      spineInk: "#2f5c47",
      spineLine: "rgba(47,92,71,.18)",
      badge: "#2f5c47",
      badgeText: "#f4f1ea",
      ink: "#1f3b32",
      subInk: "#4f6a5d",
      capsule: "#2f5c47",
    },
    uspBlocks: [
      {
        title: "Nervenfunktion",
        description: "Vitamin B6 und B12 tragen zu einem normalen Nervensystem bei — der Basis für inneren Halt.",
      },
      {
        title: "Energiestoffwechsel",
        description: "Magnesium und Vitamin B6 tragen zum normalen Energiestoffwechsel und zur Verringerung von Müdigkeit bei.",
      },
      {
        title: "Psychische Funktion",
        description: "Magnesium trägt zu einer normalen psychischen Funktion bei — wichtig in Phasen innerer Anspannung.",
      },
    ],
    ingredients: [
      { name: "Ginkgo-Biloba-Extrakt", description: "Tradition aus der Pflanzenheilkunde, hochkonzentriert standardisiert." },
      { name: "Ingwer-Extrakt", description: "Ein bewährter Pflanzenwirkstoff für das Gleichgewichtsempfinden." },
      { name: "Magnesium", description: "Trägt zu normaler Nervenfunktion bei.", efsaClaim: "Magnesium trägt zur normalen Funktion des Nervensystems bei." },
      { name: "Vitamin B6", description: "Trägt zum normalen Energiestoffwechsel bei.", efsaClaim: "Vitamin B6 trägt zu einer normalen Funktion des Nervensystems bei." },
      { name: "Vitamin B12", description: "Trägt zum normalen Nervensystem bei.", efsaClaim: "Vitamin B12 trägt zur normalen Funktion des Nervensystems bei." },
      { name: "Schwarzer Pfeffer", description: "Piperin unterstützt die Bioverfügbarkeit der pflanzlichen Inhaltsstoffe." },
    ],
    bundles: COMMON_BUNDLES,
    pharmacistQuote: COMMON_PHARMACIST,
    studies: [
      { reference: "Hilton et al. (2017)", finding: "Standardisierter Ginkgo-Extrakt zeigte in kontrollierten Studien Hinweise auf eine Unterstützung des Gleichgewichtsempfindens." },
      { reference: "Marx et al. (2015)",  finding: "Ingwer wurde in mehreren Studien hinsichtlich seines Beitrags zum allgemeinen Wohlbefinden untersucht." },
      { reference: "Boyle et al. (2017)", finding: "Magnesium spielt eine zentrale Rolle bei der normalen Funktion des Nervensystems." },
    ],
    faqs: COMMON_FAQS("Elatera Balance", "Balance"),
    scientificIntro: "Elatera Balance kombiniert traditionelle Pflanzenextrakte mit essenziellen Mikronährstoffen in einer sorgfältig dosierten Rezeptur, entwickelt für Menschen, die ihren Alltag mit Sicherheit und Klarheit erleben möchten.",
  },

  mobil: {
    slug: "mobil",
    name: "Elatera Mobil",
    variant: "Mobil",
    tagline: "Gelenke & Beweglichkeit",
    shortTagline: "für tägliche Beweglichkeit",
    indication: "Für die tägliche Beweglichkeit von Gelenken, Sehnen und Knochen",
    pzn: "20226002",
    hero: {
      headline: "Elatera Mobil",
      subheadline: "Für geschmeidige Gelenke, eine starke Mitte und mühelose Bewegung.",
      badge: "Premiere — auf Warteliste verfügbar",
      eyebrow: "Gelenke · Knochen · Beweglichkeit",
    },
    palette: {
      bg: "#efe4d3",
      spine: "#e6d8c2",
      spineInk: "#8a5a2b",
      spineLine: "rgba(138,90,43,.18)",
      badge: "#a36b3a",
      badgeText: "#fbf5e8",
      ink: "#4a2e16",
      subInk: "#7b5634",
      capsule: "#a36b3a",
    },
    uspBlocks: [
      {
        title: "Kollagenbildung",
        description: "Vitamin C trägt zu einer normalen Kollagenbildung für die normale Funktion von Knorpel und Knochen bei.",
      },
      {
        title: "Knochenerhalt",
        description: "Vitamin D, Magnesium und Zink tragen zur Erhaltung normaler Knochen bei.",
      },
      {
        title: "Muskelfunktion",
        description: "Vitamin D und Magnesium tragen zur Erhaltung einer normalen Muskelfunktion bei.",
      },
    ],
    ingredients: [
      { name: "Curcumin-Extrakt", description: "Aus der goldenen Wurzel — standardisiert und mit hoher Bioverfügbarkeit." },
      { name: "Teufelskrallen-Extrakt", description: "Traditioneller Pflanzenwirkstoff aus der südafrikanischen Heilpflanze." },
      { name: "Ingwer-Extrakt", description: "Klassiker aus der Pflanzenheilkunde." },
      { name: "Vitamin C", description: "Für die normale Kollagenbildung.", efsaClaim: "Vitamin C trägt zur normalen Kollagenbildung für die normale Funktion der Knorpel bei." },
      { name: "Vitamin D", description: "Für den Erhalt normaler Knochen.", efsaClaim: "Vitamin D trägt zur Erhaltung normaler Knochen bei." },
      { name: "Magnesium & Zink", description: "Essenzielle Mineralien für Knochen, Muskeln und Bindegewebe." },
    ],
    bundles: COMMON_BUNDLES,
    pharmacistQuote: COMMON_PHARMACIST,
    studies: [
      { reference: "Chrubasik et al. (1996)", finding: "Teufelskralle wurde in mehreren Studien hinsichtlich ihrer Anwendung untersucht." },
      { reference: "Kuptniratsaikul et al. (2014)", finding: "Curcumin wurde in einer randomisierten kontrollierten Studie evaluiert." },
      { reference: "Altman & Marcussen (2001)", finding: "Ingwer-Extrakt wurde in einer placebo-kontrollierten Studie untersucht." },
    ],
    faqs: COMMON_FAQS("Elatera Mobil", "Mobil"),
    scientificIntro: "Elatera Mobil vereint klassische Pflanzenextrakte mit den essenziellen Mikronährstoffen für Knochen, Knorpel und Muskeln — entwickelt für Menschen, die ihre Beweglichkeit täglich neu schätzen.",
  },

  nox: {
    slug: "nox",
    name: "Elatera Nox",
    variant: "Nox",
    tagline: "Schlaf & Erholung",
    shortTagline: "für ruhige Nächte",
    indication: "Für einen ruhigen Einschlafmoment und tieferes nächtliches Wohlbefinden",
    pzn: "20226003",
    hero: {
      headline: "Elatera Nox",
      subheadline: "Für sanftes Einschlafen, ruhige Nächte und ein erholtes Erwachen.",
      badge: "Premiere — auf Warteliste verfügbar",
      eyebrow: "Schlaf · Einschlafzeit · Erholung",
    },
    palette: {
      bg: "#dde2ea",
      spine: "#d3d9e3",
      spineInk: "#243a55",
      spineLine: "rgba(36,58,85,.18)",
      badge: "#243a55",
      badgeText: "#eef0f5",
      ink: "#1a2840",
      subInk: "#3e547a",
      capsule: "#243a55",
    },
    uspBlocks: [
      {
        title: "Verkürzt die Einschlafzeit",
        description: "Melatonin trägt zur Verkürzung der Einschlafzeit bei. Die positive Wirkung stellt sich ein, wenn 1 mg Melatonin kurz vor dem Schlafengehen eingenommen wird.",
      },
      {
        title: "Nervenfunktion",
        description: "Magnesium und Vitamin B6 tragen zur normalen Funktion des Nervensystems bei.",
      },
      {
        title: "Psychische Funktion",
        description: "Magnesium trägt zu einer normalen psychischen Funktion bei.",
      },
    ],
    ingredients: [
      { name: "Melatonin (1 mg)", description: "Für die Verkürzung der Einschlafzeit.", efsaClaim: "Melatonin trägt zur Verkürzung der Einschlafzeit bei. Die positive Wirkung stellt sich bei Einnahme von 1 mg Melatonin kurz vor dem Schlafengehen ein." },
      { name: "Baldrian-Extrakt", description: "Traditioneller Pflanzenwirkstoff der Apothekenkultur." },
      { name: "Passionsblume", description: "Ein klassischer Begleiter ruhiger Abende." },
      { name: "Lavendel-Extrakt", description: "Hochwertige Extraktion aus französischen Lavendelblüten." },
      { name: "Magnesium", description: "Für die normale Funktion des Nervensystems." },
      { name: "Vitamin B6", description: "Für einen normalen Energiestoffwechsel." },
    ],
    bundles: COMMON_BUNDLES,
    pharmacistQuote: COMMON_PHARMACIST,
    studies: [
      { reference: "Ferracioli-Oda et al. (2013)", finding: "Eine Meta-Analyse untersuchte die Wirkung von Melatonin auf die Schlaflatenz." },
      { reference: "Bent et al. (2006)", finding: "Baldrian wurde in einer systematischen Übersichtsarbeit untersucht." },
      { reference: "Akhondzadeh et al. (2001)", finding: "Passionsblume wurde in einer placebo-kontrollierten Studie evaluiert." },
    ],
    faqs: COMMON_FAQS("Elatera Nox", "Nox"),
    scientificIntro: "Elatera Nox kombiniert Melatonin mit pflanzlichen Klassikern der Apothekentradition zu einer abendlichen Routine, die zum sanften Einschlafen einlädt.",
  },
};

export const PRODUCT_LIST: Product[] = [PRODUCTS.balance, PRODUCTS.mobil, PRODUCTS.nox];
