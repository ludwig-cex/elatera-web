import type { Article } from "@/content/ratgeber/_types";
import { mobilisana } from "@/content/ratgeber/mobilisana";
import { vertisana } from "@/content/ratgeber/vertisana";
import { somnisana } from "@/content/ratgeber/somnisana";
import { mentisana } from "@/content/ratgeber/mentisana";
import { urisana } from "@/content/ratgeber/urisana";
import { tendisana } from "@/content/ratgeber/tendisana";
import { gastrosana } from "@/content/ratgeber/gastrosana";
import { audisana } from "@/content/ratgeber/audisana";
import { cordisana } from "@/content/ratgeber/cordisana";

// One pillar article per product. Order here = order on the /ratgeber hub.
export const ARTICLES: Article[] = [
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

export const ARTICLE_BY_SLUG: Record<string, Article> = Object.fromEntries(
  ARTICLES.map((a) => [a.slug, a]),
);

export function getArticle(slug: string): Article | undefined {
  return ARTICLE_BY_SLUG[slug];
}

export type { Article };
