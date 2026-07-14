import type { Article } from "../_types";

// META-/Hub-Artikel des Schlaf-Clusters (Muster: gedaechtnis-guide): buendelt
// alle Schlaf-Artikel, Answer-First-Absaetze, Sektionsbilder, Quellen.
export const schlafGuide: Article = {
  slug: "schlaf-guide",
  productSlug: "somnisana",
  pillarSlug: "besser-schlafen-im-alter",
  eyebrow: "Schlaf & Erholung",
  title: "Besser schlafen ab 60: Der komplette Überblick über Routinen, Schlafhygiene und Nährstoffe",
  metaDescription:
    "Besser schlafen ab 60 im Überblick: Abendroutine, Schlafhygiene, Umgang mit frühem Aufwachen, Magnesium und Melatonin. Der komplette Guide mit Wochenplan.",
  updated: "2026-07-14",
  heroImage: "/ratgeber-img/schlaf-guide.png",
  keyFacts: [
    "Der Schlaf verändert sich ab 60 spürbar: Er wird leichter, die Tiefschlafanteile nehmen ab und viele Menschen wachen früher auf. Das ist zunächst normal und keine Krankheit.",
    "Der stärkste Hebel für besseres Einschlafen ist eine feste Abendroutine: jeden Abend zur ähnlichen Zeit, gedämpftes Licht, keine Bildschirme in der letzten Stunde und ein kühles, dunkles Schlafzimmer mit 16 bis 18 Grad.",
    "Auch der Tag entscheidet über die Nacht: Morgenlicht, Bewegung und ein früher, kurzer Mittagsschlaf von höchstens 20 bis 30 Minuten stabilisieren den Schlafrhythmus.",
    "Melatonin trägt dazu bei, die Einschlafzeit zu verkürzen, wenn kurz vor dem Schlafengehen 1 mg aufgenommen wird. Diese Aussage ist von der EFSA geprüft und ersetzt weder Routine noch Schlafhygiene.",
    "Wenn Schlafprobleme über Wochen anhalten, Sie tagsüber stark beeinträchtigen oder mit lautem Schnarchen und Atemaussetzern einhergehen, gehört das in ein ärztliches Gespräch.",
  ],
  exercises: [
    {
      type: "quiz",
      title: "Kurz getestet: Kennen Sie die ideale Schlafzimmertemperatur?",
      question: "Welche Temperatur gilt im Schlafzimmer als günstig für erholsamen Schlaf?",
      options: ["21 bis 23 Grad", "16 bis 18 Grad", "Unter 12 Grad", "Die Temperatur spielt keine Rolle"],
      correctIndex: 1,
      explanation:
        "16 bis 18 Grad gelten als günstig. Der Körper senkt zum Einschlafen seine Kerntemperatur leicht ab, und ein kühles Schlafzimmer unterstützt genau diesen Vorgang. Wichtig ist zugleich, dass Füße und Schultern warm bleiben.",
    },
  ],
  relatedSlugs: [
    "schlafhygiene-ab-60",
    "melatonin-einschlafzeit",
    "magnesium-beim-einschlafen",
    "frueher-aufwachen-im-alter",
  ],
  intro: [
    "Besser schlafen ab 60 beginnt mit dem Verständnis, dass sich der Schlaf im Alter verändert, und mit einer Handvoll Gewohnheiten, die nachweislich helfen: eine feste Abendroutine, ein gut vorbereitetes Schlafzimmer, Licht und Bewegung am Tag und ein realistischer Blick auf Nährstoffe. In unserem Ratgeber sind dazu mehrere ausführliche Artikel erschienen. Dieser Guide ordnet sie ein und macht daraus einen Plan.",
    "Sie können diesen Überblick wie ein Inhaltsverzeichnis lesen. Jeder Abschnitt fasst das Wichtigste zusammen und verweist auf den passenden Artikel mit allen Details. Am Ende finden Sie einen konkreten Vorschlag für Ihre erste Schlafwoche.",
  ],
  sections: [
    {
      heading: "Was sich am Schlaf ab 60 verändert",
      paragraphs: [
        "Der Schlaf wird ab 60 leichter, kürzer und störanfälliger: Die Tiefschlafphasen nehmen ab, das Aufwachen in der Nacht wird häufiger und die innere Uhr verschiebt sich bei vielen Menschen nach vorne. Wer um 22 Uhr ins Bett geht und um 5 Uhr wach ist, hat oft schlicht sein Schlafpensum erfüllt.",
        "Diese Veränderungen sind zunächst kein Grund zur Sorge, sondern ein normaler Teil des Älterwerdens. Problematisch wird es erst, wenn der Schlaf dauerhaft nicht mehr erholsam ist, wenn Sie tagsüber gegen den Schlaf ankämpfen oder wenn Sorgen um den Schlaf selbst zum Wachliegen führen. Warum das frühe Aufwachen entsteht und wie Sie gelassen damit umgehen, erklärt unser Artikel über das frühe Aufwachen im Alter ausführlich.",
        "Eine gute Nachricht vorweg: An den meisten Stellschrauben können Sie selbst drehen, und keine davon erfordert Medikamente. Die folgenden Abschnitte gehen sie der Reihe nach durch.",
      ],
    },
    {
      heading: "Die Abendroutine: der stärkste Hebel",
      image: "/ratgeber-img/schlaf-guide-abendroutine.png",
      imageAlt: "Paar bei einer ruhigen Abendroutine mit Kräutertee und Buch",
      paragraphs: [
        "Eine feste Abendroutine ist der wirksamste einzelne Hebel für besseres Einschlafen: jeden Abend zur ähnlichen Zeit die gleichen ruhigen Handlungen, gedämpftes Licht und in der letzten Stunde keine Bildschirme. Der Körper lernt diese Abfolge wie ein Signal und beginnt schon während der Routine, auf Nacht umzustellen.",
        "Was in diese Stunde gehört, ist erstaunlich einfach: ein warmes Getränk ohne Koffein, ein paar Seiten Lesen, leise Musik oder ein kurzer Abendspaziergang. Was nicht hineingehört: aufwühlende Nachrichten, helles Deckenlicht, späte schwere Mahlzeiten und Alkohol, der das Einschlafen scheinbar erleichtert, die zweite Nachthälfte aber unruhig macht.",
        "Die komplette Abendroutine mit Uhrzeiten und Beispielen finden Sie in unserem Artikel zur Schlafhygiene ab 60. Er ist der richtige Startpunkt, wenn Sie nur einen einzigen Artikel aus diesem Guide vertiefen möchten.",
      ],
    },
    {
      heading: "Das Schlafzimmer: kühl, dunkel, ruhig",
      paragraphs: [
        "Ein gutes Schlafzimmer ist kühl, dunkel und ruhig: 16 bis 18 Grad, möglichst vollständige Dunkelheit und so wenig Lärm wie möglich. Diese drei Bedingungen unterstützen den natürlichen Absenkvorgang der Körpertemperatur und die nächtliche Ausschüttung des körpereigenen Botenstoffs Melatonin, der durch Licht gebremst wird.",
        "In der Praxis heißt das: Heizung im Schlafzimmer herunterdrehen, Verdunkelungsvorhänge oder eine Schlafmaske verwenden und leuchtende Wecker oder Standby-Lichter aus dem Raum verbannen. Wer auf die Toilette muss, bleibt bei schwachem, warmem Licht, denn helles Badezimmerlicht mitten in der Nacht wirkt wie ein Wachsignal.",
        "Auch das Bett selbst gehört auf den Prüfstand, wenn es älter als zehn Jahre ist. Eine durchgelegene Matratze meldet sich nachts über Schulter und Hüfte, und genau diese kleinen Weckreize summieren sich bei ohnehin leichterem Schlaf.",
      ],
    },
    {
      heading: "Der Tag entscheidet über die Nacht",
      image: "/ratgeber-img/schlaf-guide-morgenlicht.png",
      imageAlt: "Mann öffnet morgens die Vorhänge und lässt Sonnenlicht ins Schlafzimmer",
      paragraphs: [
        "Guter Schlaf wird tagsüber vorbereitet: Morgenlicht, Bewegung und ein disziplinierter Umgang mit dem Mittagsschlaf sind die drei Tageshebel. Wer morgens nach dem Aufstehen ans Tageslicht geht, und sei es nur für zehn Minuten auf dem Balkon, stellt seine innere Uhr scharf und schläft abends leichter ein.",
        "Bewegung wirkt doppelt: Sie baut Anspannung ab und vertieft den Schlaf. Es muss kein Sportprogramm sein, ein zügiger Spaziergang am Nachmittag genügt. Nur in den letzten zwei bis drei Stunden vor dem Schlafengehen sollte anstrengende Bewegung vermieden werden, weil der Kreislauf sonst noch auf Betrieb steht.",
        "Der Mittagsschlaf ist erlaubt, aber mit Regeln: früh am Nachmittag und höchstens 20 bis 30 Minuten. Wer um 16 Uhr eine Stunde schläft, nimmt sich den Schlafdruck für die Nacht. Und wer nachts wach liegt, findet in unserem Artikel über das frühe Aufwachen eine Anleitung, wie Sie ohne Grübeln wieder in den Schlaf finden.",
      ],
    },
    {
      heading: "Magnesium und Melatonin: was Nährstoffe leisten können",
      paragraphs: [
        "Bei den Nährstoffen ist die Lage klar geregelt: Melatonin trägt dazu bei, die Einschlafzeit zu verkürzen, wenn kurz vor dem Schlafengehen 1 mg aufgenommen wird. Diese Aussage ist von der Europäischen Behörde für Lebensmittelsicherheit geprüft. Magnesium trägt zu einer normalen Funktion des Nervensystems und zur Verringerung von Müdigkeit und Ermüdung bei; einen zugelassenen Schlaf-Claim gibt es für Magnesium dagegen nicht.",
        "Wichtig ist die richtige Einordnung: Melatonin ist kein Schlafmittel, sondern der Botenstoff, mit dem der Körper die Nacht einleitet. Die geprüfte Aussage betrifft das Einschlafen, nicht das Durchschlafen und nicht die Schlaftiefe. Was der Botenstoff kann und was nicht, erklärt unser Melatonin-Artikel; was hinter dem Ruf von Magnesium steckt, ordnet der Magnesium-Artikel ein.",
        "Ein Nahrungsergänzungsmittel kann die Abendroutine ergänzen, wenn die Grundlagen stehen. Es ersetzt weder die Routine noch das dunkle, kühle Schlafzimmer und schon gar nicht das ärztliche Gespräch, wenn Schlafprobleme anhalten oder mit Atemaussetzern und lautem Schnarchen einhergehen.",
      ],
    },
    {
      heading: "Ihre erste Schlafwoche: so setzen Sie es um",
      paragraphs: [
        "Ein einfacher Einstieg für die erste Woche: Legen Sie eine feste Aufstehzeit fest und halten Sie sie an allen sieben Tagen ein, auch am Wochenende. Die Aufstehzeit ist der Anker der inneren Uhr, nicht die Einschlafzeit. Gehen Sie abends erst ins Bett, wenn Sie wirklich müde sind.",
        "Dazu kommen drei feste Bausteine: morgens zehn Minuten Tageslicht, nachmittags ein Spaziergang und abends eine ruhige Stunde mit gedämpftem Licht nach immer gleichem Ablauf. Stellen Sie das Schlafzimmer einmalig richtig ein, kühl, dunkel und ohne Leuchtquellen, dann müssen Sie daran nicht mehr denken.",
        "Nach zwei Wochen ziehen Sie Bilanz: Fällt das Einschlafen leichter, sind die Nächte ruhiger, fühlen sich die Tage wacher an? Kleine Verbesserungen sind hier der Normalfall, große Sprünge die Ausnahme. Bleibt der Schlaf trotz konsequenter Routine über Wochen schlecht, ist das der Zeitpunkt für ein ärztliches Gespräch, nicht für immer neue Hausmittel.",
      ],
    },
  ],
  faq: [
    {
      q: "Wie viel Schlaf braucht man ab 60?",
      a: "Die meisten Menschen ab 60 kommen mit 6 bis 8 Stunden aus, oft etwas weniger als in jüngeren Jahren. Entscheidend ist nicht die Stundenzahl, sondern ob Sie sich tagsüber wach und leistungsfähig fühlen. Wer morgens früh wach ist und sich gut fühlt, hat kein Schlafproblem.",
    },
    {
      q: "Was hilft wirklich beim Einschlafen ab 60?",
      a: "Am wirksamsten ist die Kombination aus fester Abendroutine, gedämpftem Licht in der letzten Stunde, einem kühlen dunklen Schlafzimmer mit 16 bis 18 Grad und Tageslicht plus Bewegung am Tag. Melatonin trägt dazu bei, die Einschlafzeit zu verkürzen, wenn kurz vor dem Schlafengehen 1 mg aufgenommen wird.",
    },
    {
      q: "Warum wache ich nachts um 3 Uhr auf und kann nicht mehr einschlafen?",
      a: "Nächtliches Aufwachen wird im Alter häufiger, weil der Schlaf leichter wird und die Tiefschlafanteile abnehmen. Oft hält nicht das Aufwachen selbst wach, sondern das Grübeln danach. Hilfreich ist, auf die Uhr zu verzichten, bei anhaltender Wachheit kurz aufzustehen und bei schwachem Licht etwas Ruhiges zu tun, bis die Müdigkeit zurückkommt.",
    },
    {
      q: "Ist Melatonin zum Einschlafen sinnvoll?",
      a: "Melatonin ist der körpereigene Botenstoff, der die Nacht einleitet. Von der EFSA geprüft ist die Aussage, dass Melatonin dazu beiträgt, die Einschlafzeit zu verkürzen, wenn kurz vor dem Schlafengehen 1 mg aufgenommen wird. Es ist kein Schlafmittel, wirkt nicht auf das Durchschlafen und entfaltet seinen Nutzen am besten zusammen mit einer guten Abendroutine.",
    },
    {
      q: "Wann sollte man mit Schlafproblemen zum Arzt gehen?",
      a: "Wenn Schlafprobleme länger als etwa vier Wochen anhalten, Sie tagsüber deutlich beeinträchtigen oder mit lautem Schnarchen, Atemaussetzern, unruhigen Beinen oder Stimmungstiefs einhergehen, sollten Sie das ärztlich abklären lassen. Solche Ursachen lassen sich gut behandeln, aber nicht mit Hausmitteln oder Nahrungsergänzung.",
    },
  ],
  sources: [
    {
      label: "Verordnung (EU) Nr. 432/2012: Liste zulässiger gesundheitsbezogener Angaben über Lebensmittel (EUR-Lex)",
      url: "https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX%3A32012R0432",
    },
    {
      label: "EFSA Journal 2011;9(6):2241: Scientific Opinion zu Melatonin und der Verkürzung der Einschlafzeit",
      url: "https://doi.org/10.2903/j.efsa.2011.2241",
    },
    {
      label: "Deutsche Gesellschaft für Schlafforschung und Schlafmedizin (DGSM): Patienteninformationen",
      url: "https://www.dgsm.de/",
    },
    {
      label: "Deutsche Gesellschaft für Ernährung (DGE): Referenzwerte für die Nährstoffzufuhr",
      url: "https://www.dge.de/wissenschaft/referenzwerte/",
    },
  ],
};
