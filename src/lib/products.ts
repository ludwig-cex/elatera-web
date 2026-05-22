/**
 * Nutrasana Product Catalog
 * V0 = all out-of-stock, waitlist mode only.
 */

export type ProductSlug =
  | "vertisana"
  | "mobilisana"
  | "somnisana"
  | "mentisana"
  | "urisana"
  | "tendisana"
  | "gastrosana"
  | "audisana"
  | "cordisana";

export type IngredientHighlight = {
  name: string;
  description: string;
  efsaClaim?: string;
  image?: string;        // slug under /products/<slug>/ingredients/
};

export type Bundle = {
  months: 1 | 3 | 6;
  capsules: number;
  priceCents: number;
  rrpCents?: number;
  discountPct: number;
  highlight?: string; // e.g. "Sehr beliebt"
};

export type SpecialFeature = {
  title: string;
  description: string;
};

export type Product = {
  slug: ProductSlug;
  name: string;        // e.g. "Vertisana Intense"
  variant: string;     // e.g. "Vertisana"
  tagline: string;     // e.g. "Gleichgewicht & Schwindel"
  shortTagline: string;
  indication: string;  // long form
  description: string; // paragraph shown between hero and benefit blocks
  specialFeatures: SpecialFeature[]; // "Was X besonders macht" — 3 Punkte
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
  uspBlocks: { title: string; description: string; image?: string }[];
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
  images: {
    solo: string;              // front of box, head-on
    stillleben: string;        // box on podium in scene
    flatlay: string;           // ingredient flatlay
    nutrients: string;         // Nährstoff-Tabelle (Canva)
    claims: string;            // EFSA claims tile (Canva)
    credentials: string;       // Pharmazeut tile (Canva)
    hero: string;              // hero banner — couple on right, negative space on left
    lifestyle: {
      couplePrimary: string;   // strongest couple-with-product shot
      coupleSecondary: string;
      soloWoman: string;
      soloMan: string;
    };
  };
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
        a: variant === "Somnisana"
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
  name: "Jonas Gütermann",
  title: "Approbierter Pharmazeut",
  quote: "Eine wissenschaftlich durchdachte Formulierung mit Inhaltsstoffen in relevanten Dosierungen — genau das, was meine Patientinnen und Patienten brauchen.",
};

const COMMON_BUNDLES: Bundle[] = [
  { months: 1, capsules: 30,  priceCents: 5999,  discountPct: 0 },
  { months: 3, capsules: 90,  priceCents: 11518, rrpCents: 17997, discountPct: 36, highlight: "Sehr beliebt" },
  { months: 6, capsules: 180, priceCents: 19796, rrpCents: 35994, discountPct: 45 },
];

export const PRODUCTS: Record<ProductSlug, Product> = {
  vertisana: {
    slug: "vertisana",
    name: "Vertisana Intense",
    variant: "Vertisana",
    tagline: "Gleichgewicht & innere Balance",
    shortTagline: "für inneren Halt",
    indication: "Für ein stabiles Körpergefühl, innere Balance und Sicherheit im Alltag",
    description: "Vertisana Intense richtet sich an Menschen, die ihr Gleichgewichtsempfinden und ihre innere Stabilität gezielt unterstützen möchten. Die Rezeptur vereint traditionelle Pflanzenextrakte aus der Apothekenkultur mit ausgewählten Mikronährstoffen — entwickelt für mehr Sicherheit beim Aufstehen, klare Momente im Alltag und ein ruhiges Körpergefühl.",
    specialFeatures: [
      { title: "Synergistische Formel", description: "Pflanzliche Klassiker wie Ginkgo und Ingwer kombiniert mit B-Vitaminen und Magnesium für ein gezielt aufeinander abgestimmtes Wirkprofil." },
      { title: "Relevante Dosierung", description: "Wirkstoffmengen oberhalb gängiger Drogeriemarkt-Standards — entwickelt für spürbare Unterstützung statt symbolischer Zufuhr." },
      { title: "Optimierte Aufnahme", description: "Mit schwarzem Pfeffer (Piperin) für eine verbesserte Bioverfügbarkeit der pflanzlichen Inhaltsstoffe." },
    ],
    pzn: "20226001",
    hero: {
      headline: "Vertisana Intense",
      subheadline: "Für ein sicheres Stehen, einen klaren Kopf und Stabilität im Alltag.",
      badge: "Bestseller — bald wieder verfügbar",
      eyebrow: "Gleichgewicht · Balance · Nervenfunktion",
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
        image: "/products/vertisana/benefits/nervenfunktion.png",
      },
      {
        title: "Energiestoffwechsel",
        description: "Magnesium und Vitamin B6 tragen zum normalen Energiestoffwechsel und zur Verringerung von Müdigkeit bei.",
        image: "/products/vertisana/benefits/energiestoffwechsel.png",
      },
      {
        title: "Psychische Funktion",
        description: "Magnesium trägt zu einer normalen psychischen Funktion bei — wichtig in Phasen innerer Anspannung.",
        image: "/products/vertisana/benefits/psychische-funktion.png",
      },
    ],
    ingredients: [
      { name: "Ginkgo-Biloba-Extrakt", description: "Tradition aus der Pflanzenheilkunde, hochkonzentriert standardisiert.", image: "ginkgo" },
      { name: "Ingwer-Extrakt", description: "Klassischer Pflanzenwirkstoff aus der Apothekentradition, standardisiert auf Gingerole.", image: "ingwer" },
      { name: "Magnesium", description: "Trägt zu normaler Nervenfunktion bei.", efsaClaim: "Magnesium trägt zur normalen Funktion des Nervensystems bei.", image: "magnesium" },
      { name: "Vitamin B6", description: "Trägt zum normalen Energiestoffwechsel bei.", efsaClaim: "Vitamin B6 trägt zu einer normalen Funktion des Nervensystems bei.", image: "vitamin-b6" },
      { name: "Vitamin B12", description: "Trägt zum normalen Nervensystem bei.", efsaClaim: "Vitamin B12 trägt zur normalen Funktion des Nervensystems bei.", image: "vitamin-b12" },
      { name: "Schwarzer Pfeffer", description: "Piperin unterstützt die Bioverfügbarkeit der pflanzlichen Inhaltsstoffe.", image: "schwarzer-pfeffer" },
    ],
    bundles: COMMON_BUNDLES,
    pharmacistQuote: COMMON_PHARMACIST,
    studies: [
      { reference: "Hilton et al. (2017)", finding: "Standardisierter Ginkgo-Extrakt wurde in mehreren kontrollierten Studien hinsichtlich seiner Anwendung untersucht." },
      { reference: "Marx et al. (2015)",  finding: "Ingwer wurde in mehreren Studien hinsichtlich seines Beitrags zum allgemeinen Wohlbefinden untersucht." },
      { reference: "Boyle et al. (2017)", finding: "Magnesium spielt eine zentrale Rolle bei der normalen Funktion des Nervensystems." },
    ],
    faqs: COMMON_FAQS("Vertisana Intense", "Balance"),
    scientificIntro: "Vertisana Intense kombiniert traditionelle Pflanzenextrakte mit essenziellen Mikronährstoffen in einer sorgfältig dosierten Rezeptur, entwickelt für Menschen, die ihren Alltag mit Sicherheit und Klarheit erleben möchten.",
    images: {
      solo:        "/products/vertisana/solo.png",
      stillleben:  "/products/vertisana/stillleben.png",
      flatlay:     "/products/vertisana/flatlay.png",
      nutrients:   "/products/vertisana/nutrients.png",
      claims:      "/products/vertisana/claims.png",
      credentials: "/products/vertisana/credentials.png",
      hero:        "/products/vertisana/hero.png",
      lifestyle: {
        couplePrimary:   "/products/vertisana/lifestyle/couple-kitchen.png",
        coupleSecondary: "/products/vertisana/lifestyle/couple-sofa.png",
        soloWoman:       "/products/vertisana/lifestyle/solo-woman.png",
        soloMan:         "/products/vertisana/lifestyle/solo-man.png",
      },
    },
  },

  mobilisana: {
    slug: "mobilisana",
    name: "Mobilisana Intense",
    variant: "Mobilisana",
    tagline: "Gelenke & Beweglichkeit",
    shortTagline: "für tägliche Beweglichkeit",
    indication: "Für die tägliche Beweglichkeit von Gelenken, Sehnen und Knochen",
    description: "Mobilisana Intense richtet sich an Menschen, die ihre Gelenk- und Rückenfunktion gezielt unterstützen möchten. Die Rezeptur kombiniert klassische Pflanzenextrakte mit den essenziellen Mikronährstoffen für Knochen, Knorpel und Muskeln — für eine geschmeidige Beweglichkeit im Alltag, eine starke Mitte und mühelose Bewegungen.",
    specialFeatures: [
      { title: "Synergistische Formel", description: "Curcumin, Teufelskralle und Ingwer abgestimmt mit den Mineralien und Vitaminen, die zur normalen Knochen- und Muskelfunktion beitragen." },
      { title: "Relevante Dosierung", description: "Pflanzliche Extrakte in standardisierter Konzentration und Mikronährstoffe in Mengen, die den EFSA-Empfehlungen entsprechen oder darüber hinausgehen." },
      { title: "Optimierte Aufnahme", description: "Curcumin in einer Form mit verbesserter Bioverfügbarkeit für eine effizientere Verwertung im Körper." },
    ],
    pzn: "20226002",
    hero: {
      headline: "Mobilisana Intense",
      subheadline: "Für geschmeidige Gelenke, eine starke Mitte und mühelose Bewegung.",
      badge: "Bestseller — bald wieder verfügbar",
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
        image: "/products/mobilisana/benefits/knorpel.png",
      },
      {
        title: "Knochenerhalt",
        description: "Vitamin D, Magnesium und Zink tragen zur Erhaltung normaler Knochen bei.",
        image: "/products/mobilisana/benefits/knochen.png",
      },
      {
        title: "Muskelfunktion",
        description: "Vitamin D und Magnesium tragen zur Erhaltung einer normalen Muskelfunktion bei.",
        image: "/products/mobilisana/benefits/muskel.png",
      },
    ],
    ingredients: [
      { name: "Curcumin-Extrakt", description: "Aus der goldenen Wurzel — standardisiert und mit hoher Bioverfügbarkeit.", image: "curcumin" },
      { name: "Teufelskrallen-Extrakt", description: "Traditioneller Pflanzenwirkstoff aus der südafrikanischen Heilpflanze.", image: "teufelskralle" },
      { name: "Ingwer-Extrakt", description: "Klassiker aus der Pflanzenheilkunde.", image: "ingwer" },
      { name: "Vitamin C", description: "Für die normale Kollagenbildung.", efsaClaim: "Vitamin C trägt zur normalen Kollagenbildung für die normale Funktion der Knorpel bei.", image: "vitamin-c" },
      { name: "Vitamin D", description: "Für den Erhalt normaler Knochen.", efsaClaim: "Vitamin D trägt zur Erhaltung normaler Knochen bei.", image: "vitamin-d" },
      { name: "Magnesium & Zink", description: "Essenzielle Mineralien für Knochen, Muskeln und Bindegewebe.", image: "magnesium-zink" },
    ],
    bundles: COMMON_BUNDLES,
    pharmacistQuote: COMMON_PHARMACIST,
    studies: [
      { reference: "Chrubasik et al. (1996)", finding: "Teufelskralle wurde in mehreren Studien hinsichtlich ihrer Anwendung untersucht." },
      { reference: "Kuptniratsaikul et al. (2014)", finding: "Curcumin wurde in einer randomisierten kontrollierten Studie evaluiert." },
      { reference: "Altman & Marcussen (2001)", finding: "Ingwer-Extrakt wurde in einer placebo-kontrollierten Studie untersucht." },
    ],
    faqs: COMMON_FAQS("Mobilisana Intense", "Mobil"),
    scientificIntro: "Mobilisana Intense vereint klassische Pflanzenextrakte mit den essenziellen Mikronährstoffen für Knochen, Knorpel und Muskeln — entwickelt für Menschen, die ihre Beweglichkeit täglich neu schätzen.",
    images: {
      solo:        "/products/mobilisana/solo.png",
      stillleben:  "/products/mobilisana/stillleben.png",
      flatlay:     "/products/mobilisana/flatlay.png",
      nutrients:   "/products/mobilisana/nutrients.png",
      claims:      "/products/mobilisana/claims.png",
      credentials: "/products/mobilisana/credentials.png",
      hero:        "/products/mobilisana/hero.png",
      lifestyle: {
        couplePrimary:   "/products/mobilisana/lifestyle/couple-outdoor.png",
        coupleSecondary: "/products/mobilisana/lifestyle/couple-kitchen.png",
        soloWoman:       "/products/mobilisana/lifestyle/solo-woman.png",
        soloMan:         "/products/mobilisana/lifestyle/solo-man.png",
      },
    },
  },

  somnisana: {
    slug: "somnisana",
    name: "Somnisana Intense",
    variant: "Somnisana",
    tagline: "Schlaf & Erholung",
    shortTagline: "für ruhige Nächte",
    indication: "Für einen ruhigen Einschlafmoment und tieferes nächtliches Wohlbefinden",
    description: "Somnisana Intense richtet sich an Menschen, die ihren abendlichen Übergang in die Nachtruhe sanft begleiten möchten. Die Rezeptur vereint Melatonin in studienbasierter Dosierung mit pflanzlichen Klassikern der Apothekentradition — für ein ruhiges Einschlafen, eine ungestörte Nacht und ein erholtes Erwachen.",
    specialFeatures: [
      { title: "Synergistische Formel", description: "Melatonin kombiniert mit Baldrian, Passionsblume und Lavendel — eine abendliche Routine in einer Kapsel statt mehrerer Präparate." },
      { title: "Relevante Dosierung", description: "1 mg Melatonin entspricht exakt der EFSA-Vorgabe für die Verkürzung der Einschlafzeit — keine Unter- und keine Überdosierung." },
      { title: "Optimierte Aufnahme", description: "Pflanzliche Extrakte in standardisierter Form, Magenpassage-geschützte Kapsel für eine zuverlässige Freisetzung am Wirkort." },
    ],
    pzn: "20226003",
    hero: {
      headline: "Somnisana Intense",
      subheadline: "Für sanftes Einschlafen, ruhige Nächte und ein erholtes Erwachen.",
      badge: "Bestseller — bald wieder verfügbar",
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
        image: "/products/somnisana/benefits/einschlafen.png",
      },
      {
        title: "Nervenfunktion",
        description: "Magnesium und Vitamin B6 tragen zur normalen Funktion des Nervensystems bei.",
        image: "/products/somnisana/benefits/nervensystem.png",
      },
      {
        title: "Psychische Funktion",
        description: "Magnesium trägt zu einer normalen psychischen Funktion bei.",
        image: "/products/somnisana/benefits/muedigkeit.png",
      },
    ],
    ingredients: [
      { name: "Melatonin (1 mg)", description: "Für die Verkürzung der Einschlafzeit.", efsaClaim: "Melatonin trägt zur Verkürzung der Einschlafzeit bei. Die positive Wirkung stellt sich bei Einnahme von 1 mg Melatonin kurz vor dem Schlafengehen ein.", image: "melatonin" },
      { name: "Baldrian-Extrakt", description: "Traditioneller Pflanzenwirkstoff der Apothekenkultur.", image: "baldrian" },
      { name: "Passionsblume", description: "Ein klassischer Begleiter ruhiger Abende.", image: "passionsblume" },
      { name: "Lavendel-Extrakt", description: "Hochwertige Extraktion aus französischen Lavendelblüten.", image: "lavendel" },
      { name: "Magnesium", description: "Für die normale Funktion des Nervensystems.", image: "magnesium" },
      { name: "Vitamin B6", description: "Für einen normalen Energiestoffwechsel.", image: "vitamin-b6" },
    ],
    bundles: COMMON_BUNDLES,
    pharmacistQuote: COMMON_PHARMACIST,
    studies: [
      { reference: "Ferracioli-Oda et al. (2013)", finding: "Eine Meta-Analyse untersuchte die Wirkung von Melatonin auf die Schlaflatenz." },
      { reference: "Bent et al. (2006)", finding: "Baldrian wurde in einer systematischen Übersichtsarbeit untersucht." },
      { reference: "Akhondzadeh et al. (2001)", finding: "Passionsblume wurde in einer placebo-kontrollierten Studie evaluiert." },
    ],
    faqs: COMMON_FAQS("Somnisana Intense", "Nox"),
    scientificIntro: "Somnisana Intense kombiniert Melatonin mit pflanzlichen Klassikern der Apothekentradition zu einer abendlichen Routine, die zum sanften Einschlafen einlädt.",
    images: {
      solo:        "/products/somnisana/solo.png",
      stillleben:  "/products/somnisana/stillleben.png",
      flatlay:     "/products/somnisana/flatlay.png",
      nutrients:   "/products/somnisana/nutrients.png",
      claims:      "/products/somnisana/claims.png",
      credentials: "/products/somnisana/credentials.png",
      hero:        "/products/somnisana/hero.png",
      lifestyle: {
        couplePrimary:   "/products/somnisana/lifestyle/couple-bedroom.png",
        coupleSecondary: "/products/somnisana/lifestyle/couple-kitchen.png",
        soloWoman:       "/products/somnisana/lifestyle/solo-woman.png",
        soloMan:         "/products/somnisana/lifestyle/solo-man.png",
      },
    },
  },
} as Record<ProductSlug, Product>;

// --- New 6 products (skalierung 2026-05-22) --------------------------------

PRODUCTS.mentisana = {
    slug: "mentisana",
    name: "Mentisana Intense",
    variant: "Mentisana",
    tagline: "Gedächtnis & Erinnerung",
    shortTagline: "für einen klaren Kopf",
    indication: "Für die Erhaltung normaler kognitiver Funktion und ein waches geistiges Wohlbefinden",
    description: "Mentisana Intense richtet sich an Menschen, die ihre Gedächtnis- und Gehirnfunktion gezielt unterstützen möchten. Die Rezeptur kombiniert traditionsreiche Pflanzenextrakte wie Bacopa, Ginkgo und Ginseng mit Cholin und Zink — entwickelt für mentale Klarheit, gutes Erinnerungsvermögen und ein waches Denken im Alltag.",
    specialFeatures: [
      { title: "Synergistische Formel", description: "Bacopa, Ginkgo und Ginseng kombiniert mit Cholin, Zink und einem B-Vitamin-Komplex für ein gezielt aufeinander abgestimmtes kognitives Wirkprofil." },
      { title: "Relevante Dosierung", description: "Pflanzliche Extrakte in standardisierter Konzentration, Mikronährstoffe oberhalb der EFSA-Wirkschwelle für die Kognitions-Claims." },
      { title: "Optimierte Aufnahme", description: "Mit schwarzem Pfeffer (Piperin) für eine verbesserte Bioverfügbarkeit der pflanzlichen Inhaltsstoffe." },
    ],
    pzn: "20226004",
    hero: {
      headline: "Mentisana Intense",
      subheadline: "Für ein waches Gedächtnis, klare Gedanken und konzentriertes Denken im Alltag.",
      badge: "Bald wieder verfügbar",
      eyebrow: "Gedächtnis · Kognition · Klarheit",
    },
    palette: {
      bg: "#e7ebf0",
      spine: "#dde2e9",
      spineInk: "#354a66",
      spineLine: "rgba(53,74,102,.18)",
      badge: "#4a5e7d",
      badgeText: "#eef1f6",
      ink: "#1d2a3e",
      subInk: "#46566f",
      capsule: "#4a5e7d",
    },
    uspBlocks: [
      { title: "Kognitive Funktion", description: "Zink trägt zu einer normalen kognitiven Funktion bei.", image: "/products/mentisana/benefits/kognitive-funktion.png" },
      { title: "Nervensystem", description: "Magnesium, Vitamin B6 und Vitamin B12 tragen zur normalen Funktion des Nervensystems bei.", image: "/products/mentisana/benefits/nervensystem.png" },
      { title: "Psychische Funktion", description: "Vitamin B6 und Vitamin B12 tragen zu einer normalen psychischen Funktion bei.", image: "/products/mentisana/benefits/psychische-funktion.png" },
    ],
    ingredients: [
      { name: "Bacopa-Monnieri-Extrakt", description: "Traditioneller Pflanzenwirkstoff aus der ayurvedischen Heilkunde, standardisiert auf Bacopaside.", image: "bacopa" },
      { name: "Ginkgo-Biloba-Extrakt", description: "Klassiker aus der Pflanzenheilkunde, hochkonzentriert standardisiert (24/6).", image: "ginkgo" },
      { name: "Cholin-Bitartrat", description: "Essenzieller Nährstoff in bioverfügbarer Form.", image: "cholin" },
      { name: "Ginseng-Extrakt", description: "Standardisierter Panax-Ginseng-Extrakt mit charakteristischen Ginsenosiden.", image: "ginseng" },
      { name: "Zink", description: "Für eine normale kognitive Funktion.", efsaClaim: "Zink trägt zu einer normalen kognitiven Funktion bei.", image: "zink" },
      { name: "Vitamin B6 & B12", description: "Tragen zur normalen Funktion des Nervensystems bei.", efsaClaim: "Vitamin B6 und Vitamin B12 tragen zu einer normalen Funktion des Nervensystems und zu einer normalen psychischen Funktion bei.", image: "vitamin-b12" },
      { name: "Magnesium", description: "Für die normale Funktion des Nervensystems.", image: "magnesium" },
      { name: "Schwarzer Pfeffer", description: "Piperin unterstützt die Bioverfügbarkeit der pflanzlichen Inhaltsstoffe.", image: "schwarzer-pfeffer" },
    ],
    bundles: COMMON_BUNDLES,
    pharmacistQuote: COMMON_PHARMACIST,
    studies: [
      { reference: "Stough et al. (2008)", finding: "Bacopa Monnieri wurde in randomisierten kontrollierten Studien hinsichtlich kognitiver Funktion untersucht." },
      { reference: "Kennedy et al. (2010)", finding: "Standardisierter Ginkgo-Extrakt wurde in mehreren kontrollierten Studien evaluiert." },
      { reference: "Reay et al. (2010)", finding: "Panax-Ginseng wurde in placebokontrollierten Studien hinsichtlich mentaler Leistung untersucht." },
    ],
    faqs: COMMON_FAQS("Mentisana Intense", "Mens"),
    scientificIntro: "Mentisana Intense kombiniert traditionsreiche Pflanzenextrakte mit essenziellen Mikronährstoffen in einer kognitiv ausgerichteten Rezeptur, entwickelt für Menschen, die mit klarem Kopf durch den Tag gehen möchten.",
    images: {
      solo:        "/products/mentisana/solo.png",
      stillleben:  "/products/mentisana/stillleben.png",
      flatlay:     "/products/mentisana/flatlay.png",
      nutrients:   "/products/mentisana/nutrients.png",
      claims:      "/products/mentisana/claims.png",
      credentials: "/products/mentisana/credentials.png",
      hero:        "/products/mentisana/hero.png",
      lifestyle: {
        couplePrimary:   "/products/mentisana/lifestyle/couple_reading_nook.png",
        coupleSecondary: "/products/mentisana/lifestyle/couple_kitchen_morning.png",
        soloWoman:       "/products/mentisana/lifestyle/solo_woman.png",
        soloMan:         "/products/mentisana/lifestyle/solo_man.png",
      },
    },
};

PRODUCTS.urisana = {
    slug: "urisana",
    name: "Urisana Intense",
    variant: "Urisana",
    tagline: "Blase & Harnwege",
    shortTagline: "für unbeschwerte Tage",
    indication: "Für die Erhaltung normaler Schleimhäute und ein gutes Gefühl in der Blasen- und Harnwegsfunktion",
    description: "Urisana Intense richtet sich an Menschen, die ihre Blasen- und Harnwegsfunktion gezielt unterstützen möchten. Die Rezeptur kombiniert traditionsreiche Pflanzenextrakte aus Sägepalme, Cranberry und Kürbiskern mit D-Mannose und Vitamin A — für ein unbeschwertes Körpergefühl und Sicherheit im Alltag.",
    specialFeatures: [
      { title: "Synergistische Formel", description: "Sägepalme, Cranberry und Kürbiskern abgestimmt mit D-Mannose und den Mikronährstoffen, die zur normalen Schleimhautfunktion beitragen." },
      { title: "Relevante Dosierung", description: "Pflanzliche Extrakte in studienbasierten Mengen und Mikronährstoffe an oder oberhalb der EFSA-Wirkschwellen." },
      { title: "Optimierte Aufnahme", description: "Mit schwarzem Pfeffer (Piperin) für eine verbesserte Bioverfügbarkeit der pflanzlichen Inhaltsstoffe." },
    ],
    pzn: "20226005",
    hero: {
      headline: "Urisana Intense",
      subheadline: "Für unbeschwerte Tage, ein sicheres Gefühl und gute Schleimhautfunktion.",
      badge: "Bald wieder verfügbar",
      eyebrow: "Blase · Harnwege · Schleimhäute",
    },
    palette: {
      bg: "#e1ecee",
      spine: "#d0dde0",
      spineInk: "#2f5a60",
      spineLine: "rgba(47,90,96,.18)",
      badge: "#4e7c84",
      badgeText: "#ecf3f4",
      ink: "#1a363a",
      subInk: "#43686d",
      capsule: "#4e7c84",
    },
    uspBlocks: [
      { title: "Schleimhäute", description: "Vitamin A trägt zur Erhaltung normaler Schleimhäute bei.", image: "/products/urisana/benefits/schleimhaeute.png" },
      { title: "Immunfunktion", description: "Vitamin A, Zink und Selen tragen zu einer normalen Funktion des Immunsystems bei.", image: "/products/urisana/benefits/immunfunktion.png" },
      { title: "Zellschutz", description: "Zink und Selen tragen dazu bei, die Zellen vor oxidativem Stress zu schützen.", image: "/products/urisana/benefits/zellschutz.png" },
    ],
    ingredients: [
      { name: "Sägepalmen-Extrakt", description: "Standardisiert auf 25 % Fettsäuren, traditioneller Pflanzenwirkstoff.", image: "saegepalme" },
      { name: "Cranberry-Extrakt", description: "Standardisiert auf Proanthocyanidine (PAC).", image: "cranberry" },
      { name: "Kürbiskern-Extrakt 20:1", description: "Hochkonzentrierter Extrakt aus den Samen der Cucurbita pepo.", image: "kuerbiskern" },
      { name: "D-Mannose", description: "Reiner Einfachzucker aus Pflanzen, gut verträglich.", image: "d-mannose" },
      { name: "Vitamin A", description: "Für die Erhaltung normaler Schleimhäute.", efsaClaim: "Vitamin A trägt zur Erhaltung normaler Schleimhäute bei.", image: "vitamin-a" },
      { name: "Zink & Selen", description: "Für eine normale Immunfunktion und Zellschutz.", efsaClaim: "Zink und Selen tragen dazu bei, die Zellen vor oxidativem Stress zu schützen.", image: "zink" },
      { name: "Schwarzer Pfeffer", description: "Piperin unterstützt die Bioverfügbarkeit der pflanzlichen Inhaltsstoffe.", image: "schwarzer-pfeffer" },
    ],
    bundles: COMMON_BUNDLES,
    pharmacistQuote: COMMON_PHARMACIST,
    studies: [
      { reference: "Wilt et al. (2002)", finding: "Sägepalmen-Extrakt wurde in mehreren randomisierten kontrollierten Studien evaluiert." },
      { reference: "Jepson et al. (2012)", finding: "Cranberry wurde in einer Cochrane-Übersichtsarbeit untersucht." },
      { reference: "Kranjčec et al. (2014)", finding: "D-Mannose wurde in einer randomisierten kontrollierten Studie evaluiert." },
    ],
    faqs: COMMON_FAQS("Urisana Intense", "Uri"),
    scientificIntro: "Urisana Intense vereint pflanzliche Klassiker der Apothekentradition mit den essenziellen Mikronährstoffen für Schleimhäute, Immunfunktion und Zellschutz — entwickelt für Menschen, die ihre Tage unbeschwert erleben möchten.",
    images: {
      solo:        "/products/urisana/solo.png",
      stillleben:  "/products/urisana/stillleben.png",
      flatlay:     "/products/urisana/flatlay.png",
      nutrients:   "/products/urisana/nutrients.png",
      claims:      "/products/urisana/claims.png",
      credentials: "/products/urisana/credentials.png",
      hero:        "/products/urisana/hero.png",
      lifestyle: {
        couplePrimary:   "/products/urisana/lifestyle/couple_conservatory.png",
        coupleSecondary: "/products/urisana/lifestyle/couple_kitchen_water.png",
        soloWoman:       "/products/urisana/lifestyle/solo_woman.png",
        soloMan:         "/products/urisana/lifestyle/solo_man.png",
      },
    },
};

PRODUCTS.tendisana = {
    slug: "tendisana",
    name: "Tendisana Intense",
    variant: "Tendisana",
    tagline: "Sehnen & Bänder",
    shortTagline: "für geschmeidige Bewegung",
    indication: "Für die normale Bindegewebsbildung und eine geschmeidige Beweglichkeit von Sehnen und Bändern",
    description: "Tendisana Intense richtet sich an Menschen, die ihre Sehnen-, Bänder- und Bindegewebsfunktion gezielt unterstützen möchten. Die Rezeptur kombiniert Kollagen mit Bambus-Silizium, Boswellia und Bromelain — abgestimmt mit den essenziellen Mikronährstoffen für Bindegewebe, Knochen und Knorpel.",
    specialFeatures: [
      { title: "Synergistische Formel", description: "Kollagen, Bambus-Silizium und Boswellia kombiniert mit Mangan, Vitamin C und Vitamin D für ein vollständiges Bindegewebs-Wirkprofil." },
      { title: "Relevante Dosierung", description: "Kollagen in studienbasierter Menge, Bambus-Silizium hochstandardisiert auf 35 %." },
      { title: "Optimierte Aufnahme", description: "Bromelain als Verdauungsenzym unterstützt die Verwertung der Pflanzenextrakte, schwarzer Pfeffer steigert die Bioverfügbarkeit." },
    ],
    pzn: "20226006",
    hero: {
      headline: "Tendisana Intense",
      subheadline: "Für geschmeidige Sehnen, stabile Bänder und eine elastische Bewegung im Alltag.",
      badge: "Bald wieder verfügbar",
      eyebrow: "Sehnen · Bänder · Bindegewebe",
    },
    palette: {
      bg: "#f2e5dc",
      spine: "#e8d6c8",
      spineInk: "#8a5239",
      spineLine: "rgba(138,82,57,.18)",
      badge: "#a26344",
      badgeText: "#fbf3ec",
      ink: "#4a2614",
      subInk: "#7b4d35",
      capsule: "#a26344",
    },
    uspBlocks: [
      { title: "Bindegewebe", description: "Mangan trägt zu einer normalen Bindegewebsbildung bei.", image: "/products/tendisana/benefits/bindegewebe.png" },
      { title: "Knorpel & Knochen", description: "Vitamin C trägt zur normalen Kollagenbildung für eine normale Funktion von Knorpel und Knochen bei.", image: "/products/tendisana/benefits/knorpel.png" },
      { title: "Knochenerhalt", description: "Vitamin D und Zink tragen zur Erhaltung normaler Knochen bei.", image: "/products/tendisana/benefits/knochen.png" },
    ],
    ingredients: [
      { name: "Kollagenhydrolysat", description: "Hydrolisierter Kollagen-Komplex (Typ I/III) für gute Bioverfügbarkeit.", image: "kollagen" },
      { name: "Bambussprossen-Extrakt", description: "Standardisiert auf 35 % Silizium aus jungen Bambussprossen.", image: "bambussprossen" },
      { name: "Boswellia-Serrata-Extrakt", description: "Standardisiert auf AKBA, traditioneller Pflanzenwirkstoff.", image: "boswellia" },
      { name: "Bromelain", description: "Verdauungsenzym aus der Ananas, standardisiert auf 2400 GDU/g.", image: "bromelain" },
      { name: "Mangan", description: "Für die normale Bindegewebsbildung.", efsaClaim: "Mangan trägt zu einer normalen Bindegewebsbildung bei.", image: "mangan" },
      { name: "Vitamin C", description: "Für die normale Kollagenbildung.", efsaClaim: "Vitamin C trägt zur normalen Kollagenbildung für eine normale Funktion von Knorpel und Knochen bei.", image: "vitamin-c" },
      { name: "Vitamin D & Zink", description: "Für den Erhalt normaler Knochen.", efsaClaim: "Vitamin D und Zink tragen zur Erhaltung normaler Knochen bei.", image: "vitamin-d" },
      { name: "Schwarzer Pfeffer", description: "Piperin unterstützt die Bioverfügbarkeit der pflanzlichen Inhaltsstoffe.", image: "schwarzer-pfeffer" },
    ],
    bundles: COMMON_BUNDLES,
    pharmacistQuote: COMMON_PHARMACIST,
    studies: [
      { reference: "Clark et al. (2008)", finding: "Kollagenhydrolysat wurde in einer randomisierten kontrollierten Studie evaluiert." },
      { reference: "Sengupta et al. (2008)", finding: "Boswellia-Serrata-Extrakt wurde in mehreren placebokontrollierten Studien untersucht." },
      { reference: "Maurer (2001)", finding: "Bromelain wurde in mehreren klinischen Studien evaluiert." },
    ],
    faqs: COMMON_FAQS("Tendisana Intense", "Tendi"),
    scientificIntro: "Tendisana Intense vereint klassische Pflanzenextrakte mit Kollagen und den essenziellen Mikronährstoffen für Bindegewebe, Knorpel und Knochen — entwickelt für Menschen, die ihre Beweglichkeit als selbstverständlich erleben möchten.",
    images: {
      solo:        "/products/tendisana/solo.png",
      stillleben:  "/products/tendisana/stillleben.png",
      flatlay:     "/products/tendisana/flatlay.png",
      nutrients:   "/products/tendisana/nutrients.png",
      claims:      "/products/tendisana/claims.png",
      credentials: "/products/tendisana/credentials.png",
      hero:        "/products/tendisana/hero.png",
      lifestyle: {
        couplePrimary:   "/products/tendisana/lifestyle/couple_garden_walk.png",
        coupleSecondary: "/products/tendisana/lifestyle/couple_kitchen_stretch.png",
        soloWoman:       "/products/tendisana/lifestyle/solo_woman.png",
        soloMan:         "/products/tendisana/lifestyle/solo_man.png",
      },
    },
};

PRODUCTS.gastrosana = {
    slug: "gastrosana",
    name: "Gastrosana Intense",
    variant: "Gastrosana",
    tagline: "Magen & Verdauung",
    shortTagline: "für ein ruhiges Bauchgefühl",
    indication: "Für die Erhaltung normaler Schleimhäute und einen ausgeglichenen Säure-Basen-Haushalt im Magen",
    description: "Gastrosana Intense richtet sich an Menschen, die ihre Magenschleimhaut und ihr Bauchgefühl gezielt unterstützen möchten. Die Rezeptur kombiniert Aloe Vera, Süßholz (DGL) und Myrrhe mit L-Carnosin und Vitamin A — für ein ruhiges, ausgeglichenes Verdauungsgefühl im Alltag.",
    specialFeatures: [
      { title: "Synergistische Formel", description: "Aloe Vera, Süßholz (DGL) und Myrrhe abgestimmt mit L-Carnosin, Vitamin A und Zink für die Schleimhautfunktion." },
      { title: "Relevante Dosierung", description: "Pflanzliche Extrakte in studienbasierter Konzentration, Mikronährstoffe an oder oberhalb der EFSA-Wirkschwellen." },
      { title: "Optimierte Aufnahme", description: "Süßholz als entglycyrrhizinisierte (DGL) Variante — gut verträglich auch bei längerer Einnahme." },
    ],
    pzn: "20226007",
    hero: {
      headline: "Gastrosana Intense",
      subheadline: "Für ein ruhiges Bauchgefühl, geschützte Schleimhäute und ausgeglichene Verdauung.",
      badge: "Bald wieder verfügbar",
      eyebrow: "Magen · Schleimhäute · Verdauung",
    },
    palette: {
      bg: "#f4ecda",
      spine: "#ecdfc4",
      spineInk: "#8a6f3e",
      spineLine: "rgba(138,111,62,.18)",
      badge: "#b08648",
      badgeText: "#fbf6e8",
      ink: "#4a3a18",
      subInk: "#7c6437",
      capsule: "#b08648",
    },
    uspBlocks: [
      { title: "Schleimhäute", description: "Vitamin A trägt zur Erhaltung normaler Schleimhäute bei.", image: "/products/gastrosana/benefits/schleimhaeute.png" },
      { title: "Säure-Basen-Haushalt", description: "Zink trägt zu einem normalen Säure-Basen-Stoffwechsel bei.", image: "/products/gastrosana/benefits/saeure-basen.png" },
      { title: "Zellschutz", description: "Vitamin C und Zink tragen dazu bei, die Zellen vor oxidativem Stress zu schützen.", image: "/products/gastrosana/benefits/zellschutz.png" },
    ],
    ingredients: [
      { name: "Aloe-Vera-Extrakt 200:1", description: "Hochkonzentrierter Extrakt aus dem Blattmark der Aloe-Pflanze.", image: "aloe-vera" },
      { name: "Süßholz-Extrakt (DGL)", description: "Entglycyrrhizinisiertes Süßholz — die magenfreundliche Variante.", image: "suessholz-dgl" },
      { name: "Myrrhe-Extrakt 4:1", description: "Traditioneller Pflanzenwirkstoff aus der Apothekenkultur.", image: "myrrhe" },
      { name: "L-Carnosin", description: "Dipeptid, das natürlich im Körper vorkommt.", image: "l-carnosin" },
      { name: "Vitamin A", description: "Für die Erhaltung normaler Schleimhäute.", efsaClaim: "Vitamin A trägt zur Erhaltung normaler Schleimhäute bei.", image: "vitamin-a" },
      { name: "Vitamin C", description: "Für den Schutz vor oxidativem Stress.", efsaClaim: "Vitamin C trägt dazu bei, die Zellen vor oxidativem Stress zu schützen.", image: "vitamin-c" },
      { name: "Zink", description: "Für einen normalen Säure-Basen-Stoffwechsel.", efsaClaim: "Zink trägt zu einem normalen Säure-Basen-Stoffwechsel bei.", image: "zink" },
      { name: "Schwarzer Pfeffer", description: "Piperin unterstützt die Bioverfügbarkeit der pflanzlichen Inhaltsstoffe.", image: "schwarzer-pfeffer" },
    ],
    bundles: COMMON_BUNDLES,
    pharmacistQuote: COMMON_PHARMACIST,
    studies: [
      { reference: "Langmead et al. (2004)", finding: "Aloe-Vera-Extrakt wurde in einer randomisierten kontrollierten Studie untersucht." },
      { reference: "Madisch et al. (2004)", finding: "Eine Pflanzenkombination mit Süßholz und Myrrhe wurde in klinischen Studien evaluiert." },
      { reference: "Yoshikawa et al. (1997)", finding: "L-Carnosin wurde im Hinblick auf Magenschleimhautfunktion untersucht." },
    ],
    faqs: COMMON_FAQS("Gastrosana Intense", "Gastro"),
    scientificIntro: "Gastrosana Intense vereint traditionelle Pflanzenextrakte mit den essenziellen Mikronährstoffen für Schleimhäute und Säure-Basen-Haushalt — entwickelt für Menschen, die ein ruhiges Bauchgefühl bewahren möchten.",
    images: {
      solo:        "/products/gastrosana/solo.png",
      stillleben:  "/products/gastrosana/stillleben.png",
      flatlay:     "/products/gastrosana/flatlay.png",
      nutrients:   "/products/gastrosana/nutrients.png",
      claims:      "/products/gastrosana/claims.png",
      credentials: "/products/gastrosana/credentials.png",
      hero:        "/products/gastrosana/hero.png",
      lifestyle: {
        couplePrimary:   "/products/gastrosana/lifestyle/couple_breakfast_tea.png",
        coupleSecondary: "/products/gastrosana/lifestyle/couple_kitchen_relief.png",
        soloWoman:       "/products/gastrosana/lifestyle/solo_woman.png",
        soloMan:         "/products/gastrosana/lifestyle/solo_man.png",
      },
    },
};

PRODUCTS.audisana = {
    slug: "audisana",
    name: "Audisana Intense",
    variant: "Audisana",
    tagline: "Ohren & Hörfunktion",
    shortTagline: "für klare Töne",
    indication: "Für eine normale Funktion des Nervensystems und ein aufmerksames Hören im Alltag",
    description: "Audisana Intense richtet sich an Menschen, die ihre Hörfunktion und das Wohlbefinden ihrer Ohren gezielt unterstützen möchten. Die Rezeptur kombiniert OPC aus Traubenkernen, L-Citrullin und Ginkgo mit Magnesium und einem umfassenden B-Vitamin-Komplex — entwickelt für klare Wahrnehmung und einen aufmerksamen Hör-Alltag.",
    specialFeatures: [
      { title: "Synergistische Formel", description: "OPC, L-Citrullin und Ginkgo kombiniert mit Magnesium und einem 5-fach B-Vitamin-Komplex für ein vollständiges Nervenfunktions-Profil." },
      { title: "Relevante Dosierung", description: "OPC mit 95 % Reinheit, L-Citrullin in studienbasierter Menge, B-Vitamine an oder oberhalb der EFSA-Wirkschwellen." },
      { title: "Optimierte Aufnahme", description: "Mit schwarzem Pfeffer (Piperin) für eine verbesserte Bioverfügbarkeit der pflanzlichen Inhaltsstoffe." },
    ],
    pzn: "20226008",
    hero: {
      headline: "Audisana Intense",
      subheadline: "Für klare Wahrnehmung, ein gutes Körpergefühl und aufmerksame Tage.",
      badge: "Bald wieder verfügbar",
      eyebrow: "Ohren · Hörfunktion · Nervensystem",
    },
    palette: {
      bg: "#dbe5ea",
      spine: "#cad7df",
      spineInk: "#234958",
      spineLine: "rgba(35,73,88,.18)",
      badge: "#335669",
      badgeText: "#e8eff3",
      ink: "#15283a",
      subInk: "#354f60",
      capsule: "#335669",
    },
    uspBlocks: [
      { title: "Nervensystem", description: "Vitamin C, B1, B6, B12 und Magnesium tragen zur normalen Funktion des Nervensystems bei.", image: "/products/audisana/benefits/nervensystem.png" },
      { title: "Psychische Funktion", description: "B1, B6, B12, C und Magnesium tragen zu einer normalen psychischen Funktion bei.", image: "/products/audisana/benefits/psychische-funktion.png" },
      { title: "Zellschutz", description: "Vitamin C und Zink tragen dazu bei, die Zellen vor oxidativem Stress zu schützen.", image: "/products/audisana/benefits/zellschutz.png" },
    ],
    ingredients: [
      { name: "Traubenkern-Extrakt", description: "Hochkonzentrierter OPC-Extrakt mit 95 % Reinheit.", image: "opc-traubenkern" },
      { name: "L-Citrullin", description: "Aminosäure aus pflanzlicher Quelle.", image: "l-citrullin" },
      { name: "Ginkgo-Biloba-Extrakt", description: "Standardisierter Pflanzenwirkstoff (24/6).", image: "ginkgo" },
      { name: "Magnesium", description: "Für die normale Funktion des Nervensystems.", efsaClaim: "Magnesium trägt zur normalen Funktion des Nervensystems bei.", image: "magnesium" },
      { name: "Vitamin-B-Komplex (B1, B6, B12)", description: "Für die normale Funktion des Nervensystems und der psychischen Funktion.", efsaClaim: "Vitamin B1, B6 und B12 tragen zu einer normalen Funktion des Nervensystems bei.", image: "vitamin-b12" },
      { name: "Vitamin C & Zink", description: "Für den Schutz vor oxidativem Stress.", efsaClaim: "Vitamin C und Zink tragen dazu bei, die Zellen vor oxidativem Stress zu schützen.", image: "vitamin-c" },
      { name: "Schwarzer Pfeffer", description: "Piperin unterstützt die Bioverfügbarkeit der pflanzlichen Inhaltsstoffe.", image: "schwarzer-pfeffer" },
    ],
    bundles: COMMON_BUNDLES,
    pharmacistQuote: COMMON_PHARMACIST,
    studies: [
      { reference: "Diplock et al. (1998)", finding: "OPC-Extrakte wurden hinsichtlich ihrer Wirkung auf oxidativen Stress untersucht." },
      { reference: "Bailey et al. (2010)", finding: "L-Citrullin wurde in mehreren kontrollierten Studien evaluiert." },
      { reference: "Reisser & Weidauer (2001)", finding: "Standardisierter Ginkgo-Extrakt wurde im Hinblick auf Hörfunktion untersucht." },
    ],
    faqs: COMMON_FAQS("Audisana Intense", "Audi"),
    scientificIntro: "Audisana Intense vereint Pflanzenextrakte mit den essenziellen Mikronährstoffen für Nervenfunktion und Zellschutz — entwickelt für Menschen, die ihre Hörfunktion und das Wohlbefinden im Ohr-Bereich aufmerksam pflegen möchten.",
    images: {
      solo:        "/products/audisana/solo.png",
      stillleben:  "/products/audisana/stillleben.png",
      flatlay:     "/products/audisana/flatlay.png",
      nutrients:   "/products/audisana/nutrients.png",
      claims:      "/products/audisana/claims.png",
      credentials: "/products/audisana/credentials.png",
      hero:        "/products/audisana/hero.png",
      lifestyle: {
        couplePrimary:   "/products/audisana/lifestyle/couple_sofa_listening.png",
        coupleSecondary: "/products/audisana/lifestyle/couple_music_room.png",
        soloWoman:       "/products/audisana/lifestyle/solo_woman.png",
        soloMan:         "/products/audisana/lifestyle/solo_man.png",
      },
    },
};

PRODUCTS.cordisana = {
    slug: "cordisana",
    name: "Cordisana Intense",
    variant: "Cordisana",
    tagline: "Herz & Gefäße",
    shortTagline: "für ein starkes Herz",
    indication: "Für eine normale Herzfunktion und gesunde Blutgefäße im Alltag",
    description: "Cordisana Intense richtet sich an Menschen, die ihre Herz- und Gefäßfunktion gezielt unterstützen möchten. Die Rezeptur kombiniert klassische Pflanzenextrakte aus Weißdorn, Olivenblatt und Knoblauch mit Magnesium-Taurat und Vitamin B1 — entwickelt für ein kraftvolles Herzgefühl und vitale Gefäße.",
    specialFeatures: [
      { title: "Synergistische Formel", description: "Weißdorn, Olivenblatt und Knoblauch kombiniert mit Magnesium-Taurat und Vitamin B1 für ein abgestimmtes Herz-Gefäße-Wirkprofil." },
      { title: "Relevante Dosierung", description: "Pflanzliche Extrakte in studienbasierter Konzentration, Magnesium als Magnesium-Taurat für die Herzfunktion." },
      { title: "Optimierte Aufnahme", description: "Mit schwarzem Pfeffer (Piperin) für eine verbesserte Bioverfügbarkeit der pflanzlichen Inhaltsstoffe." },
    ],
    pzn: "20226009",
    hero: {
      headline: "Cordisana Intense",
      subheadline: "Für ein starkes Herz, gesunde Gefäße und ein vitales Lebensgefühl.",
      badge: "Bald wieder verfügbar",
      eyebrow: "Herz · Gefäße · Vitalität",
    },
    palette: {
      bg: "#eedce0",
      spine: "#e3c9d0",
      spineInk: "#6e3a4a",
      spineLine: "rgba(110,58,74,.18)",
      badge: "#804c5d",
      badgeText: "#f7eaee",
      ink: "#3d1c25",
      subInk: "#644049",
      capsule: "#804c5d",
    },
    uspBlocks: [
      { title: "Herzfunktion", description: "Vitamin B1 trägt zu einer normalen Herzfunktion bei.", image: "/products/cordisana/benefits/herzfunktion.png" },
      { title: "Blutgefäße", description: "Vitamin C trägt zur normalen Kollagenbildung für eine normale Funktion der Blutgefäße bei.", image: "/products/cordisana/benefits/blutgefaesse.png" },
      { title: "Zellschutz", description: "Vitamin C, Selen und Zink tragen dazu bei, die Zellen vor oxidativem Stress zu schützen.", image: "/products/cordisana/benefits/zellschutz.png" },
    ],
    ingredients: [
      { name: "Weißdorn-Extrakt", description: "Standardisiert auf Vitexin, traditioneller Pflanzenwirkstoff der Apothekenkultur.", image: "weissdorn" },
      { name: "Olivenblatt-Extrakt", description: "Standardisiert auf 20 % Oleuropein.", image: "olivenblatt" },
      { name: "Knoblauch-Extrakt", description: "Standardisiert auf Allicin, in geruchsarmer Form.", image: "knoblauch" },
      { name: "Magnesium-Taurat", description: "Magnesium gebunden an Taurin für die Herzfunktion.", image: "magnesium" },
      { name: "Vitamin B1 (Thiamin)", description: "Für die normale Herzfunktion.", efsaClaim: "Vitamin B1 trägt zu einer normalen Herzfunktion bei.", image: "vitamin-b1" },
      { name: "Vitamin C", description: "Für die normale Kollagenbildung für eine normale Funktion der Blutgefäße.", efsaClaim: "Vitamin C trägt zur normalen Kollagenbildung für eine normale Funktion der Blutgefäße bei.", image: "vitamin-c" },
      { name: "Selen & Zink", description: "Für den Schutz vor oxidativem Stress.", efsaClaim: "Selen und Zink tragen dazu bei, die Zellen vor oxidativem Stress zu schützen.", image: "selen" },
      { name: "Schwarzer Pfeffer", description: "Piperin unterstützt die Bioverfügbarkeit der pflanzlichen Inhaltsstoffe.", image: "schwarzer-pfeffer" },
    ],
    bundles: COMMON_BUNDLES,
    pharmacistQuote: COMMON_PHARMACIST,
    studies: [
      { reference: "Pittler et al. (2008)", finding: "Weißdorn-Extrakt wurde in einer Cochrane-Übersichtsarbeit evaluiert." },
      { reference: "Susalit et al. (2011)", finding: "Olivenblatt-Extrakt wurde in einer randomisierten kontrollierten Studie untersucht." },
      { reference: "Ried (2016)", finding: "Knoblauch-Extrakt wurde in einer Meta-Analyse evaluiert." },
    ],
    faqs: COMMON_FAQS("Cordisana Intense", "Cordi"),
    scientificIntro: "Cordisana Intense vereint klassische Pflanzenextrakte mit den essenziellen Mikronährstoffen für Herzfunktion, Gefäße und Zellschutz — entwickelt für Menschen, die ihre Vitalität langfristig pflegen möchten.",
    images: {
      solo:        "/products/cordisana/solo.png",
      stillleben:  "/products/cordisana/stillleben.png",
      flatlay:     "/products/cordisana/flatlay.png",
      nutrients:   "/products/cordisana/nutrients.png",
      claims:      "/products/cordisana/claims.png",
      credentials: "/products/cordisana/credentials.png",
      hero:        "/products/cordisana/hero.png",
      lifestyle: {
        couplePrimary:   "/products/cordisana/lifestyle/couple_garden_patio.png",
        coupleSecondary: "/products/cordisana/lifestyle/couple_kitchen_morning.png",
        soloWoman:       "/products/cordisana/lifestyle/solo_woman.png",
        soloMan:         "/products/cordisana/lifestyle/solo_man.png",
      },
    },
};

export const PRODUCT_LIST: Product[] = [
  PRODUCTS.vertisana,
  PRODUCTS.mobilisana,
  PRODUCTS.somnisana,
  PRODUCTS.mentisana,
  PRODUCTS.urisana,
  PRODUCTS.tendisana,
  PRODUCTS.gastrosana,
  PRODUCTS.audisana,
  PRODUCTS.cordisana,
];
