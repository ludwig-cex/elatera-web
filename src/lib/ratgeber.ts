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

// Spokes (long-tail, each linked to a pillar via pillarSlug)
import { uebungenSteifeKnie } from "@/content/ratgeber/spokes/uebungen-bei-steifen-knien";
import { ernaehrungGelenke } from "@/content/ratgeber/spokes/ernaehrung-fuer-die-gelenke";
import { knorpelVitaminC } from "@/content/ratgeber/spokes/knorpel-kollagen-vitamin-c";
import { vitaminDGelenke } from "@/content/ratgeber/spokes/vitamin-d-gelenke-winter";
import { magnesiumEinschlafen } from "@/content/ratgeber/spokes/magnesium-beim-einschlafen";
import { melatoninEinschlafzeit } from "@/content/ratgeber/spokes/melatonin-einschlafzeit";
import { schlafhygiene60 } from "@/content/ratgeber/spokes/schlafhygiene-ab-60";
import { frueherAufwachen } from "@/content/ratgeber/spokes/frueher-aufwachen-im-alter";
import { gehirnjogging } from "@/content/ratgeber/spokes/gehirnjogging-uebungen";
import { zinkKognition } from "@/content/ratgeber/spokes/zink-kognitive-funktion";
import { ernaehrungGehirn } from "@/content/ratgeber/spokes/ernaehrung-fuers-gehirn";
import { konzentration } from "@/content/ratgeber/spokes/konzentration-im-alltag";

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
  uebungenSteifeKnie,
  ernaehrungGelenke,
  knorpelVitaminC,
  vitaminDGelenke,
  magnesiumEinschlafen,
  melatoninEinschlafzeit,
  schlafhygiene60,
  frueherAufwachen,
  gehirnjogging,
  zinkKognition,
  ernaehrungGehirn,
  konzentration,
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
