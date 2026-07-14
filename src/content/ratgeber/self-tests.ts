import type { ProductSlug } from "@/lib/products";

/*
 * Selbsttests für die Ratgeber-Artikelseiten: 5 Durchklick-Fragen pro
 * Produktthema. Bewusst reflektierend statt diagnostisch (YMYL!): keine
 * Auswertung, kein Score, keine Krankheits-Aussage. Die Abschlusskarte ist
 * immer positiv-unterstützend und führt zum passenden Produkt.
 */

export type SelfTestQuestion = { q: string; options: string[] };
export type SelfTest = {
  title: string;
  intro: string;
  questions: SelfTestQuestion[];
  result: { headline: string; text: string };
};

const STANDARD_OPTIONS = ["Fast täglich", "Ab und zu", "Eher selten"];

export const SELF_TESTS: Partial<Record<ProductSlug, SelfTest>> = {
  mentisana: {
    title: "Wie fit ist Ihr Kopf im Alltag?",
    intro: "Fünf kurze Fragen zum Nachdenken. Es gibt kein richtig oder falsch, und ausgewertet wird nichts. Der Test hilft Ihnen nur, den eigenen Alltag bewusster einzuschätzen.",
    questions: [
      { q: "Wie oft ertappen Sie sich dabei, dass Sie einen Raum betreten und nicht mehr wissen, warum?", options: STANDARD_OPTIONS },
      { q: "Wie häufig fällt Ihnen ein Name erst Stunden später wieder ein?", options: STANDARD_OPTIONS },
      { q: "Lernen Sie zurzeit aktiv etwas Neues, etwa eine Sprache, ein Spiel oder ein Rezept ohne Buch?", options: ["Ja, regelmäßig", "Hin und wieder", "Im Moment nicht"] },
      { q: "Wie oft fordern Sie Ihren Kopf bewusst, zum Beispiel mit Kopfrechnen oder Merklisten?", options: STANDARD_OPTIONS },
      { q: "Wie zufrieden sind Sie mit Ihrer Konzentration am Nachmittag?", options: ["Sehr zufrieden", "Geht so", "Da ist Luft nach oben"] },
    ],
    result: {
      headline: "Schön, dass Sie sich die 30 Sekunden genommen haben!",
      text: "Egal, wo Sie gerade stehen: Mit den Übungen aus diesem Ratgeber trainieren Sie Ihren Kopf jeden Tag ein Stück weiter. Und Mentisana Intense wurde von approbierten Pharmazeuten entwickelt, um Sie dabei zu begleiten, mit Zink, das zu einer normalen kognitiven Funktion beiträgt.",
    },
  },
  somnisana: {
    title: "Wie gut schlafen Sie wirklich?",
    intro: "Fünf kurze Fragen zu Ihren Nächten. Keine Auswertung, kein Urteil, nur ein ehrlicher Blick auf die eigene Schlafroutine.",
    questions: [
      { q: "Wie oft liegen Sie abends länger als 30 Minuten wach, bevor Sie einschlafen?", options: STANDARD_OPTIONS },
      { q: "Wie häufig werden Sie nachts wach und finden schwer zurück in den Schlaf?", options: STANDARD_OPTIONS },
      { q: "Greifen Sie nachts zum Handy oder schalten Licht an, wenn Sie wach werden?", options: ["Meistens", "Manchmal", "Nie"] },
      { q: "Haben Ihre Abende eine feste Routine, etwa Licht dimmen und Bildschirm weglegen?", options: ["Ja, ziemlich fest", "Mal so, mal so", "Eigentlich nicht"] },
      { q: "Wie fühlen Sie sich an den meisten Morgen?", options: ["Erholt und klar", "Wechselhaft", "Oft wie gerädert"] },
    ],
    result: {
      headline: "Geschafft! Der erste Schritt ist der ehrliche Blick.",
      text: "Ein ruhiger Einstieg in die Nacht ist das Fundament, und genau daran können Sie mit den Tipps aus diesem Ratgeber jeden Abend arbeiten. Somnisana Intense wurde entwickelt, um Sie dabei zu unterstützen: mit 1 mg Melatonin, das zur Verkürzung der Einschlafzeit beiträgt.",
    },
  },
  mobilisana: {
    title: "Wie beweglich sind Sie im Alltag?",
    intro: "Fünf kurze Fragen zu Gelenken und Bewegung. Ohne Auswertung, nur zur eigenen Standortbestimmung.",
    questions: [
      { q: "Wie fühlen sich Ihre Gelenke an den meisten Morgen an?", options: ["Locker und startklar", "Erst steif, dann besser", "Oft lange steif"] },
      { q: "Wie oft sind Sie mindestens 20 Minuten am Stück in Bewegung?", options: ["Fast täglich", "Mehrmals pro Woche", "Seltener"] },
      { q: "Meiden Sie inzwischen Treppen, Bücken oder längere Spaziergänge?", options: ["Nein, gar nicht", "Manchmal schon", "Ja, häufiger"] },
      { q: "Machen Sie gezielte Übungen für Kraft oder Beweglichkeit?", options: ["Regelmäßig", "Ab und zu", "Bisher nicht"] },
      { q: "Wie sehr können Sie sich auf Ihre Knie und Hüften verlassen, wenn spontan etwas ansteht?", options: ["Voll und ganz", "Meistens", "Eher weniger"] },
    ],
    result: {
      headline: "Gut gemacht, 30 Sekunden für Ihre Beweglichkeit!",
      text: "Regelmäßige Bewegung und die Übungen aus diesem Ratgeber sind der wichtigste Hebel, und Mobilisana Intense wurde von approbierten Pharmazeuten entwickelt, um Sie dabei zu begleiten: mit Vitamin C, das zur normalen Kollagenbildung für eine normale Knorpelfunktion beiträgt.",
    },
  },
  tendisana: {
    title: "Wie belastbar fühlen sich Sehnen und Bänder an?",
    intro: "Fünf kurze Fragen zur Belastbarkeit im Alltag. Keine Diagnose, nur eine ehrliche Momentaufnahme.",
    questions: [
      { q: "Wie reagieren Ihre Sehnen auf ungewohnte Belastung, etwa Gartenarbeit oder längeres Tragen?", options: ["Völlig unauffällig", "Melden sich manchmal", "Melden sich schnell"] },
      { q: "Wärmen Sie sich vor körperlicher Aktivität kurz auf?", options: ["Fast immer", "Manchmal", "Eigentlich nie"] },
      { q: "Wie oft dehnen Sie sich in einer normalen Woche?", options: STANDARD_OPTIONS },
      { q: "Steigern Sie neue Aktivitäten langsam oder legen Sie gern direkt los?", options: ["Langsam und schrittweise", "Je nach Laune", "Meist direkt los"] },
      { q: "Wie schnell erholen Sie sich nach einem anstrengenden Tag?", options: ["Über Nacht", "Nach ein, zwei Tagen", "Es dauert länger"] },
    ],
    result: {
      headline: "Geschafft! Gut, dass Sie hinschauen, bevor es zwickt.",
      text: "Kluges Aufwärmen und schrittweise Steigerung aus diesem Ratgeber sind die halbe Miete. Tendisana Intense wurde entwickelt, um Sie dabei zu unterstützen: mit Vitamin C, das zur normalen Kollagenbildung beiträgt, dem Grundbaustein von Sehnen und Bändern.",
    },
  },
  vertisana: {
    title: "Wie sicher fühlen Sie sich auf den Beinen?",
    intro: "Fünf kurze Fragen zu Gleichgewicht und Sicherheit im Alltag. Ohne Wertung, nur zum Innehalten.",
    questions: [
      { q: "Wie fühlt es sich an, wenn Sie morgens zügig aufstehen?", options: ["Stabil", "Kurz wackelig", "Öfter unsicher"] },
      { q: "Können Sie zehn Sekunden sicher auf einem Bein stehen?", options: ["Ja, problemlos", "Mit Festhalten", "Lieber nicht"] },
      { q: "Wie oft trainieren Sie bewusst Ihr Gleichgewicht?", options: STANDARD_OPTIONS },
      { q: "Halten Sie sich auf Treppen inzwischen häufiger am Geländer fest?", options: ["Nein", "Manchmal", "Fast immer"] },
      { q: "Wie viel trinken Sie an einem normalen Tag?", options: ["1,5 Liter oder mehr", "Etwa 1 Liter", "Eher weniger"] },
    ],
    result: {
      headline: "30 Sekunden gut investiert!",
      text: "Gleichgewicht lässt sich in jedem Alter trainieren, die Übungen aus diesem Ratgeber zeigen wie. Vertisana Intense wurde von approbierten Pharmazeuten entwickelt, um Sie dabei zu begleiten, mit Vitamin B12, das zur normalen Funktion des Nervensystems beiträgt.",
    },
  },
  urisana: {
    title: "Wie entspannt ist Ihr Alltag mit der Blase?",
    intro: "Fünf kurze Fragen, ganz diskret und ohne Auswertung. Nur Sie sehen Ihre Antworten, gespeichert wird nichts.",
    questions: [
      { q: "Wie oft unterbricht der Gang zur Toilette Ihre Nacht?", options: ["Selten oder nie", "Einmal", "Mehrmals"] },
      { q: "Planen Sie Ausflüge oder Wege nach verfügbaren Toiletten?", options: ["Nein, nie", "Unbewusst schon", "Ja, regelmäßig"] },
      { q: "Trinken Sie über den Tag verteilt regelmäßig, statt abends viel auf einmal?", options: ["Ja, gleichmäßig", "Unterschiedlich", "Eher abends viel"] },
      { q: "Wie oft stehen Kürbiskerne, Beeren oder Ähnliches auf Ihrem Speiseplan?", options: ["Häufig", "Gelegentlich", "Kaum"] },
      { q: "Wie unbeschwert fühlen Sie sich bei längeren Autofahrten oder Konzertbesuchen?", options: ["Völlig unbeschwert", "Meistens gut", "Angespannt"] },
    ],
    result: {
      headline: "Danke für Ihre Offenheit, das war der wichtigste Schritt.",
      text: "Mit Trinkrhythmus und den Alltagstipps aus diesem Ratgeber lässt sich viel erreichen. Urisana Intense wurde entwickelt, um Sie dabei zu unterstützen, mit traditionell eingesetztem Kürbiskern-Extrakt und ausgewählten Mikronährstoffen.",
    },
  },
  gastrosana: {
    title: "Wie wohl fühlt sich Ihre Mitte?",
    intro: "Fünf kurze Fragen zu Verdauung und Essgewohnheiten. Kein Urteil, nur eine Momentaufnahme.",
    questions: [
      { q: "Wie fühlen Sie sich nach den meisten Mahlzeiten?", options: ["Angenehm leicht", "Mal so, mal so", "Oft voll und träge"] },
      { q: "Nehmen Sie sich zum Essen bewusst Zeit und kauen in Ruhe?", options: ["Fast immer", "Wenn es passt", "Meist geht es schnell"] },
      { q: "Wie regelmäßig sind Ihre Essenszeiten?", options: ["Sehr regelmäßig", "Einigermaßen", "Ziemlich unregelmäßig"] },
      { q: "Wie oft stehen Gemüse, Vollkorn und Hülsenfrüchte auf dem Teller?", options: ["Täglich", "Mehrmals pro Woche", "Seltener"] },
      { q: "Bewegen Sie sich nach dem Essen, etwa bei einem kurzen Spaziergang?", options: ["Oft", "Gelegentlich", "Praktisch nie"] },
    ],
    result: {
      headline: "Geschafft, schön dass Sie Ihrer Mitte Aufmerksamkeit schenken!",
      text: "Ruhe beim Essen und die Gewohnheiten aus diesem Ratgeber sind die Basis. Gastrosana Intense wurde von approbierten Pharmazeuten entwickelt, um Sie dabei zu begleiten, mit traditionellen Bitterstoffen und ausgewählten Mikronährstoffen.",
    },
  },
  audisana: {
    title: "Wie aufmerksam ist Ihr Gehör im Alltag?",
    intro: "Fünf kurze Fragen zum bewussten Hören. Ohne Auswertung, nur zum Nachspüren.",
    questions: [
      { q: "Wie gut folgen Sie Gesprächen, wenn im Hintergrund Geräusche sind, etwa im Restaurant?", options: ["Mühelos", "Mit etwas Anstrengung", "Zunehmend schwer"] },
      { q: "Wie oft bitten Sie darum, dass etwas wiederholt wird?", options: ["Selten", "Ab und zu", "Häufiger"] },
      { q: "Stellen andere fest, dass Ihr Fernseher recht laut läuft?", options: ["Nein", "Kam schon vor", "Ja, öfter"] },
      { q: "Gönnen Sie Ihren Ohren bewusst ruhige Phasen ohne Beschallung?", options: ["Täglich", "Manchmal", "Eigentlich nie"] },
      { q: "Nehmen Sie leise Geräusche wie Vogelstimmen oder das Ticken einer Uhr bewusst wahr?", options: ["Ja, deutlich", "Teilweise", "Kaum noch"] },
    ],
    result: {
      headline: "Gut hingehört, im wahrsten Sinne!",
      text: "Bewusste Hörpausen und die Tipps aus diesem Ratgeber tun den Ohren gut. Audisana Intense wurde entwickelt, um Sie dabei zu unterstützen, mit Zink, das zu einer normalen kognitiven Funktion beiträgt, und weiteren ausgewählten Mikronährstoffen. Bei anhaltenden Hörproblemen gehört der erste Weg zu Arzt oder Hörakustiker.",
    },
  },
  cordisana: {
    title: "Wie herzfreundlich ist Ihre Woche?",
    intro: "Fünf kurze Fragen zu Gewohnheiten rund um Herz und Kreislauf. Keine Diagnose, nur ein ehrlicher Wochenrückblick.",
    questions: [
      { q: "An wie vielen Tagen pro Woche kommen Sie auf mindestens 30 Minuten Bewegung?", options: ["5 oder mehr", "2 bis 4", "Weniger als 2"] },
      { q: "Wie oft essen Sie Fisch, Nüsse oder hochwertige Pflanzenöle?", options: ["Mehrmals pro Woche", "Etwa einmal pro Woche", "Selten"] },
      { q: "Wie gut gelingt es Ihnen, Stress im Alltag abzubauen?", options: ["Gut, ich habe Rituale", "Unterschiedlich", "Schwer"] },
      { q: "Kennen Sie Ihre aktuellen Blutdruckwerte?", options: ["Ja, ich messe regelmäßig", "Ungefähr", "Nein"] },
      { q: "Wie erholsam sind Ihre Nächte im Schnitt?", options: ["Erholsam", "Wechselhaft", "Oft zu kurz"] },
    ],
    result: {
      headline: "Stark, dass Sie Ihrem Herzen 30 Sekunden geschenkt haben!",
      text: "Bewegung, gute Fette und Entspannung aus diesem Ratgeber sind das Fundament. Cordisana Intense wurde von approbierten Pharmazeuten entwickelt, um Sie dabei zu begleiten, mit Vitamin B1, das zu einer normalen Herzfunktion beiträgt. Regelmäßige ärztliche Kontrollen ersetzt das selbstverständlich nicht.",
    },
  },
};
