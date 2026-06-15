import type { Article } from "@/content/ratgeber/_types";

// Pillars (one per product)
import { mobilisana } from "@/content/ratgeber/mobilisana";
import { vertisana } from "@/content/ratgeber/vertisana";
import { somnisana } from "@/content/ratgeber/somnisana";
import { mentisana } from "@/content/ratgeber/mentisana";
import { urisana } from "@/content/ratgeber/urisana";
import { tendisana } from "@/content/ratgeber/tendisana";
import { gastrosana } from "@/content/ratgeber/gastrosana";
import { audisana } from "@/content/ratgeber/audisana";
import { cordisana } from "@/content/ratgeber/cordisana";

// Spokes — Gelenke (Mobilisana)
import { uebungenSteifeKnie } from "@/content/ratgeber/spokes/uebungen-bei-steifen-knien";
import { ernaehrungGelenke } from "@/content/ratgeber/spokes/ernaehrung-fuer-die-gelenke";
import { knorpelVitaminC } from "@/content/ratgeber/spokes/knorpel-kollagen-vitamin-c";
import { vitaminDGelenke } from "@/content/ratgeber/spokes/vitamin-d-gelenke-winter";
// Spokes — Schlaf (Somnisana)
import { magnesiumEinschlafen } from "@/content/ratgeber/spokes/magnesium-beim-einschlafen";
import { melatoninEinschlafzeit } from "@/content/ratgeber/spokes/melatonin-einschlafzeit";
import { schlafhygiene60 } from "@/content/ratgeber/spokes/schlafhygiene-ab-60";
import { frueherAufwachen } from "@/content/ratgeber/spokes/frueher-aufwachen-im-alter";
// Spokes — Gedächtnis (Mentisana)
import { gehirnjogging } from "@/content/ratgeber/spokes/gehirnjogging-uebungen";
import { zinkKognition } from "@/content/ratgeber/spokes/zink-kognitive-funktion";
import { ernaehrungGehirn } from "@/content/ratgeber/spokes/ernaehrung-fuers-gehirn";
import { konzentration } from "@/content/ratgeber/spokes/konzentration-im-alltag";
// Spokes — Gleichgewicht (Vertisana)
import { gleichgewichtsuebungenZuhause } from "@/content/ratgeber/spokes/gleichgewichtsuebungen-zuhause";
import { schwindelBeimAufstehen } from "@/content/ratgeber/spokes/schwindel-beim-aufstehen";
import { bVitamineNervensystem } from "@/content/ratgeber/spokes/b-vitamine-nervensystem";
import { ingwerGinkgo } from "@/content/ratgeber/spokes/ingwer-ginkgo-pflanzenkunde";
// Spokes — Herz (Cordisana)
import { bewegungFuersHerz } from "@/content/ratgeber/spokes/bewegung-fuers-herz";
import { herzgesundeErnaehrung } from "@/content/ratgeber/spokes/herzgesunde-ernaehrung";
import { vitaminB1Herzfunktion } from "@/content/ratgeber/spokes/vitamin-b1-herzfunktion";
import { weissdornPflanzenkunde } from "@/content/ratgeber/spokes/weissdorn-pflanzenkunde";
// Spokes — Verdauung (Gastrosana)
import { ballaststoffeVerdauung } from "@/content/ratgeber/spokes/ballaststoffe-verdauung";
import { trinkenVerdauung } from "@/content/ratgeber/spokes/trinken-verdauung";
import { blaehbauchNachDemEssen } from "@/content/ratgeber/spokes/blaehbauch-nach-dem-essen";
import { darmfloraErnaehrung } from "@/content/ratgeber/spokes/darmflora-ernaehrung";
// Spokes — Blase (Urisana)
import { beckenbodentrainingBlase } from "@/content/ratgeber/spokes/beckenbodentraining-blase";
import { richtigTrinkenBlase } from "@/content/ratgeber/spokes/richtig-trinken-blase";
import { cranberryHarnwege } from "@/content/ratgeber/spokes/cranberry-harnwege";
import { kuerbiskerneBlase } from "@/content/ratgeber/spokes/kuerbiskerne-blase";
// Spokes — Sehnen (Tendisana)
import { dehnuebungenSehnen } from "@/content/ratgeber/spokes/dehnuebungen-sehnen";
import { aufwaermenVorBewegung } from "@/content/ratgeber/spokes/aufwaermen-vor-bewegung";
import { kollagenVitaminCBindegewebe } from "@/content/ratgeber/spokes/kollagen-vitamin-c-bindegewebe";
import { belastungSteuernBaender } from "@/content/ratgeber/spokes/belastung-steuern-baender";
// Spokes — Ohren (Audisana)
import { gehoerSchuetzenLaerm } from "@/content/ratgeber/spokes/gehoer-schuetzen-laerm";
import { durchblutungInnenohr } from "@/content/ratgeber/spokes/durchblutung-innenohr";
import { zinkNormaleFunktion } from "@/content/ratgeber/spokes/zink-normale-funktion";
import { tinnitusVerstehen } from "@/content/ratgeber/spokes/tinnitus-verstehen";

// Pillar order = order on the /ratgeber hub.
export const PILLARS: Article[] = [
  mobilisana,
  somnisana,
  mentisana,
  vertisana,
  cordisana,
  gastrosana,
  urisana,
  tendisana,
  audisana,
];

const SPOKES: Article[] = [
  // Gelenke
  uebungenSteifeKnie,
  ernaehrungGelenke,
  knorpelVitaminC,
  vitaminDGelenke,
  // Schlaf
  magnesiumEinschlafen,
  melatoninEinschlafzeit,
  schlafhygiene60,
  frueherAufwachen,
  // Gedächtnis
  gehirnjogging,
  zinkKognition,
  ernaehrungGehirn,
  konzentration,
  // Gleichgewicht
  gleichgewichtsuebungenZuhause,
  schwindelBeimAufstehen,
  bVitamineNervensystem,
  ingwerGinkgo,
  // Herz
  bewegungFuersHerz,
  herzgesundeErnaehrung,
  vitaminB1Herzfunktion,
  weissdornPflanzenkunde,
  // Verdauung
  ballaststoffeVerdauung,
  trinkenVerdauung,
  blaehbauchNachDemEssen,
  darmfloraErnaehrung,
  // Blase
  beckenbodentrainingBlase,
  richtigTrinkenBlase,
  cranberryHarnwege,
  kuerbiskerneBlase,
  // Sehnen
  dehnuebungenSehnen,
  aufwaermenVorBewegung,
  kollagenVitaminCBindegewebe,
  belastungSteuernBaender,
  // Ohren
  gehoerSchuetzenLaerm,
  durchblutungInnenohr,
  zinkNormaleFunktion,
  tinnitusVerstehen,
];

// All articles (pillars + spokes) — used for routing and the sitemap.
export const ARTICLES: Article[] = [...PILLARS, ...SPOKES];

export const ARTICLE_BY_SLUG: Record<string, Article> = Object.fromEntries(
  ARTICLES.map((a) => [a.slug, a]),
);

export function getArticle(slug: string): Article | undefined {
  return ARTICLE_BY_SLUG[slug];
}

// Spokes that belong to a given pillar (by the pillar's slug).
export function getSpokes(pillarSlug: string): Article[] {
  return SPOKES.filter((s) => s.pillarSlug === pillarSlug);
}

export type { Article };
