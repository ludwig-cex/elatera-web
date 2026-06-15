import type { ProductSlug } from "@/lib/products";

export type ArticleSection = { heading: string; paragraphs: string[] };
export type ArticleFaq = { q: string; a: string };

// One pillar article per product. Editorial, EFSA-compliant health content
// authored by the in-house pharmacist; the article page pulls the linked
// product (studies, CTA) from PRODUCTS at render time.
export type Article = {
  slug: string; // URL slug under /ratgeber, e.g. "gelenkschmerzen-im-alter"
  productSlug: ProductSlug;
  eyebrow: string; // kicker, e.g. "Gelenke & Beweglichkeit"
  title: string; // H1 + SEO title
  metaDescription: string; // ~150-160 chars
  updated: string; // ISO date, e.g. "2026-06-15"
  intro: string[]; // lead paragraphs
  sections: ArticleSection[];
  faq: ArticleFaq[];
};
