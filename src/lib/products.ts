/**
 * Nutrasana Product Catalog
 * V0 = all out-of-stock, waitlist mode only.
 */

export type ProductSlug = "vertisana" | "mobilisana" | "somnisana";

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
};

export const PRODUCT_LIST: Product[] = [PRODUCTS.vertisana, PRODUCTS.mobilisana, PRODUCTS.somnisana];
