/**
 * Help-Center content for /pages/hilfe-kontakt
 * Categorized so a search can return matches with category labels.
 */

export type HelpArticle = {
  q: string;
  a: string;
  keywords?: string[];
};

export type HelpCategory = {
  slug: string;
  title: string;
  description: string;
  icon: "package" | "pillbottle" | "refresh" | "repeat" | "creditcard" | "info";
  articles: HelpArticle[];
};

export const HELP_CATEGORIES: HelpCategory[] = [
  {
    slug: "bestellung-versand",
    title: "Bestellung & Versand",
    description: "Alles rund um Lieferzeiten, Versandkosten und Sendungsverfolgung.",
    icon: "package",
    articles: [
      {
        q: "Wie lange dauert der Versand?",
        a: "Innerhalb Deutschlands liefern wir mit DHL in 1–3 Werktagen. Nach Österreich und in die Schweiz 2–5 Werktage. Sie erhalten zur Versendung eine E-Mail mit Tracking-Link.",
        keywords: ["lieferzeit", "dhl", "tracking", "sendung"],
      },
      {
        q: "Was kostet der Versand?",
        a: "Versand innerhalb Deutschlands ist ab 60 € Warenkorbwert kostenlos. Unter 60 € berechnen wir 4,90 €. Im Spar-Abo ist der Versand dauerhaft kostenfrei — auch bei kleinerem Warenkorb.",
        keywords: ["versandkosten", "kostenlos", "porto"],
      },
      {
        q: "Versenden Sie nach Österreich und in die Schweiz?",
        a: "Ja, wir liefern in alle DACH-Länder. In Österreich und der Schweiz betragen die Versandkosten 7,90 € (in der Schweiz fällt zusätzlich Schweizer Mehrwertsteuer beim Zoll an).",
        keywords: ["österreich", "schweiz", "ausland"],
      },
      {
        q: "Wie kann ich meine Sendung verfolgen?",
        a: "Sobald Ihre Bestellung das Lager verlässt, erhalten Sie eine E-Mail mit DHL-Sendungsnummer und Tracking-Link.",
        keywords: ["tracking", "sendungsverfolgung"],
      },
      {
        q: "Was, wenn meine Sendung verloren geht?",
        a: "Bitte schreiben Sie uns innerhalb von 14 Tagen nach dem voraussichtlichen Lieferdatum an kundenservice@nutra-sana.de. Wir veranlassen entweder eine kostenfreie Ersatz-Lieferung oder erstatten Ihnen den vollen Betrag.",
        keywords: ["verloren", "nicht erhalten"],
      },
    ],
  },
  {
    slug: "produkte-anwendung",
    title: "Produkte & Anwendung",
    description: "Fragen zu Inhaltsstoffen, Dosierung und Anwendung unserer Produkte.",
    icon: "pillbottle",
    articles: [
      {
        q: "Wie nehme ich Nutrasana-Produkte ein?",
        a: "Eine Kapsel täglich, unzerkaut mit einem großen Glas Wasser. Bei unseren Schlafprodukten empfehlen wir die Einnahme 30 Minuten vor dem Zubettgehen.",
        keywords: ["einnahme", "dosierung", "kapsel"],
      },
      {
        q: "Wie lange sollte ich ein Produkt einnehmen?",
        a: "Wir empfehlen eine mindestens 8–12-wöchige tägliche Einnahme, um die volle Wirkung zu erleben. Viele Kund:innen entscheiden sich für unser Spar-Abo, um die Routine dauerhaft beizubehalten.",
        keywords: ["dauer", "wirkung", "wochen"],
      },
      {
        q: "Sind die Produkte für mich geeignet?",
        a: "Unsere Produkte richten sich an Erwachsene. Bei bestehenden Erkrankungen, Schwangerschaft, Stillzeit oder bei der Einnahme von Medikamenten empfehlen wir vor Beginn eine Rücksprache mit Ihrem Arzt oder Apotheker.",
        keywords: ["zielgruppe", "schwangerschaft", "arzt"],
      },
      {
        q: "Sind die Produkte vegan und allergenfrei?",
        a: "Alle Nutrasana-Produkte sind frei von den 14 EU-Hauptallergenen, laktosefrei, glutenfrei und ohne Gentechnik. Die meisten sind außerdem vegan — nur Rezepturen mit Vitamin D3 (aus Schafwolle) sind vegetarisch statt vegan.",
        keywords: ["vegan", "allergen", "laktose", "gluten"],
      },
      {
        q: "Wo wird Nutrasana hergestellt?",
        a: "Ausschließlich in Deutschland — in FSSC-22000-zertifizierten Anlagen. Jede Charge wird unabhängig laborgeprüft, bevor sie unser Haus verlässt.",
        keywords: ["herkunft", "made in germany", "labor"],
      },
    ],
  },
  {
    slug: "rueckgabe",
    title: "Rückgabe & Reklamation",
    description: "90 Tage Geld-zurück-Garantie und alle Schritte zur Rücksendung.",
    icon: "refresh",
    articles: [
      {
        q: "Wie funktioniert die 90-Tage-Geld-zurück-Garantie?",
        a: "Sollten Sie mit Ihrem Produkt nicht zufrieden sein, schreiben Sie uns innerhalb von 90 Tagen nach Erhalt eine kurze E-Mail an kundenservice@nutra-sana.de. Wir veranlassen die Rücksendung und erstatten Ihnen den vollen Kaufpreis — ohne weitere Fragen.",
        keywords: ["garantie", "geld zurück", "90 tage"],
      },
      {
        q: "Wie sende ich ein Produkt zurück?",
        a: "Schreiben Sie uns an kundenservice@nutra-sana.de. Sie erhalten ein vorbereitetes Rücksendelabel per E-Mail. Verpacken Sie das Produkt sicher und geben es bei einer DHL-Filiale ab. Die Erstattung erfolgt innerhalb von 5–7 Werktagen nach Eingang.",
        keywords: ["zurücksenden", "label", "rücksendung"],
      },
      {
        q: "Erhalte ich auch den Versand erstattet?",
        a: "Ja — bei einer Rücksendung im Rahmen der 90-Tage-Garantie übernehmen wir sowohl die Rücksende- als auch die Erstversandkosten.",
        keywords: ["versandkosten", "erstattung"],
      },
      {
        q: "Was, wenn ein Produkt beschädigt ankommt?",
        a: "Bitte senden Sie uns binnen 7 Tagen ein Foto der Beschädigung und Ihre Bestellnummer an kundenservice@nutra-sana.de. Wir veranlassen umgehend einen kostenfreien Ersatz.",
        keywords: ["beschädigt", "defekt"],
      },
    ],
  },
  {
    slug: "spar-abo",
    title: "Spar-Abo",
    description: "Alles zur flexiblen Auto-Lieferung, Pausieren und Kündigen.",
    icon: "repeat",
    articles: [
      {
        q: "Wie funktioniert das Spar-Abo?",
        a: "Wählen Sie beim Kauf Ihren Rhythmus (alle 30, 90 oder 180 Tage). Sie erhalten dauerhaft Rabatt sowie kostenlosen Versand. Wir liefern automatisch — Sie müssen nichts weiter tun.",
        keywords: ["abo", "subscription", "auto-lieferung"],
      },
      {
        q: "Kann ich mein Spar-Abo pausieren?",
        a: "Ja — jederzeit und ohne Frist. Im Kundenkonto unter 'Mein Abo' können Sie Ihre nächste Lieferung um beliebig viele Tage verschieben oder pausieren.",
        keywords: ["pausieren", "verschieben"],
      },
      {
        q: "Wie kündige ich mein Spar-Abo?",
        a: "Ebenfalls jederzeit, ohne Mindestlaufzeit, ohne Kündigungsfrist. Ein Klick im Kundenkonto unter 'Mein Abo' genügt. Sie können das Abo auch per E-Mail an kundenservice@nutra-sana.de kündigen.",
        keywords: ["kündigen", "stoppen"],
      },
      {
        q: "Wann wird mir das Abo abgebucht?",
        a: "Die Abbuchung erfolgt jeweils 1 Tag vor Versand der nächsten Lieferung. Sie erhalten eine Bestätigungs-E-Mail mit dem Versand-Termin und können dann noch pausieren.",
        keywords: ["abbuchung", "zahlung"],
      },
      {
        q: "Kann ich die Lieferadresse für mein Abo ändern?",
        a: "Ja — im Kundenkonto unter 'Mein Abo' können Sie Lieferadresse und Zahlungsmethode jederzeit aktualisieren.",
        keywords: ["adresse", "ändern"],
      },
    ],
  },
  {
    slug: "konto-zahlung",
    title: "Konto & Zahlung",
    description: "Bestelldetails, Rechnungen und unterstützte Zahlungsmethoden.",
    icon: "creditcard",
    articles: [
      {
        q: "Welche Zahlungsmethoden akzeptieren Sie?",
        a: "Klarna (Rechnung, Ratenkauf, Sofort), PayPal, Visa, Mastercard, Apple Pay, Google Pay sowie SEPA-Lastschrift.",
        keywords: ["zahlung", "klarna", "paypal", "kreditkarte"],
      },
      {
        q: "Kann ich auch ohne Kundenkonto bestellen?",
        a: "Ja — als Gastbestellung. Wir empfehlen aber, ein Konto anzulegen, um Bestellungen einzusehen, Spar-Abos zu verwalten und schneller zu bestellen.",
        keywords: ["gastbestellung", "konto"],
      },
      {
        q: "Wo finde ich meine Rechnung?",
        a: "Im Kundenkonto unter 'Bestellungen' können Sie jede Rechnung als PDF herunterladen. Sie erhalten zusätzlich eine Kopie per E-Mail.",
        keywords: ["rechnung", "pdf"],
      },
      {
        q: "Ist mein Konto sicher?",
        a: "Ja. Wir verschlüsseln alle Datenübertragungen mit TLS 1.3 und speichern Zahlungsdaten ausschließlich bei zertifizierten Anbietern (Stripe, Klarna, PayPal). Wir selbst sehen keine Kartendaten.",
        keywords: ["sicherheit", "datenschutz"],
      },
      {
        q: "Wie ändere ich mein Passwort?",
        a: "Im Kundenkonto unter 'Profil' → 'Passwort ändern'. Falls Sie Ihr Passwort vergessen haben, nutzen Sie den 'Passwort vergessen?'-Link auf der Login-Seite.",
        keywords: ["passwort"],
      },
    ],
  },
  {
    slug: "allgemein",
    title: "Allgemeine Fragen",
    description: "Über Nutrasana, Apotheken-Bezug und sonstige Anliegen.",
    icon: "info",
    articles: [
      {
        q: "Wer steckt hinter Nutrasana?",
        a: "Nutrasana entwickelt wissenschaftlich fundierte Nahrungsergänzung in Deutschland. Unsere Rezepturen werden von approbierten Pharmazeuten entwickelt und in FSSC-22000-zertifizierten Anlagen produziert. Mehr dazu auf unserer Seite Über uns.",
        keywords: ["über uns", "marke"],
      },
      {
        q: "Sind Nutrasana-Produkte in der Apotheke erhältlich?",
        a: "Ja. Jedes Produkt verfügt über eine eigene Pharmazentralnummer (PZN) und ist über die großen Pharma-Großhändler (PHOENIX, NOWEDA, GEHE) für Apotheken beziehbar.",
        keywords: ["apotheke", "pzn"],
      },
      {
        q: "Wie kann ich euch erreichen?",
        a: "Per E-Mail an kundenservice@nutra-sana.de oder über das Kontakt-Formular auf dieser Seite. Wir antworten Mo–Fr binnen 24 Stunden.",
        keywords: ["kontakt", "erreichen"],
      },
      {
        q: "Bekomme ich euren Newsletter?",
        a: "Wenn Sie das beim Kauf oder über das Newsletter-Formular bestätigt haben — ja. Sie können sich jederzeit per Klick in jeder E-Mail abmelden.",
        keywords: ["newsletter"],
      },
      {
        q: "Erhalte ich einen Vorteil als wiederkehrende Kundin?",
        a: "Ja — durch unser Spar-Abo mit bis zu 45 % Dauerrabatt, kostenlosem Versand und exklusiven Produkt-Previews vor allen anderen.",
        keywords: ["treue", "wiederkauf"],
      },
    ],
  },
];

export const POPULAR_QUESTION_KEYS: { categorySlug: string; questionIndex: number }[] = [
  { categorySlug: "bestellung-versand", questionIndex: 0 },
  { categorySlug: "rueckgabe", questionIndex: 0 },
  { categorySlug: "spar-abo", questionIndex: 0 },
  { categorySlug: "spar-abo", questionIndex: 2 },
  { categorySlug: "produkte-anwendung", questionIndex: 0 },
  { categorySlug: "konto-zahlung", questionIndex: 0 },
];

export function getPopularArticles() {
  return POPULAR_QUESTION_KEYS.map(({ categorySlug, questionIndex }) => {
    const cat = HELP_CATEGORIES.find((c) => c.slug === categorySlug);
    const article = cat?.articles[questionIndex];
    return article && cat ? { categoryTitle: cat.title, article } : null;
  }).filter(Boolean) as { categoryTitle: string; article: HelpArticle }[];
}

export function searchHelp(query: string) {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const results: { categoryTitle: string; categorySlug: string; article: HelpArticle }[] = [];
  for (const cat of HELP_CATEGORIES) {
    for (const article of cat.articles) {
      const haystack = `${article.q} ${article.a} ${(article.keywords || []).join(" ")}`.toLowerCase();
      if (haystack.includes(q)) {
        results.push({ categoryTitle: cat.title, categorySlug: cat.slug, article });
      }
    }
  }
  return results;
}
