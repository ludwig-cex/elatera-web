import type { ProductSlug } from "@/lib/products";

export type ArticleSection = { heading: string; paragraphs: string[] };
export type ArticleFaq = { q: string; a: string };

// Interaktive Mitmach-Uebungen (gerendert von components/ratgeber/exercise-widget.tsx)
export type Exercise =
  | { type: "memory"; title: string; instruction: string; words: string[]; seconds: number }
  | { type: "quiz"; title: string; question: string; options: string[]; correctIndex: number; explanation: string }
  | { type: "reveal"; title: string; question: string; solution: string };

// One pillar article per product. Editorial, EFSA-compliant health content
// authored by the in-house pharmacist; the article page pulls the linked
// product (studies, CTA) from PRODUCTS at render time.
export type Article = {
  slug: string; // URL slug under /ratgeber, e.g. "gelenkschmerzen-im-alter"
  productSlug: ProductSlug;
  // Set on spoke articles to link up to their pillar article's slug. Pillar
  // articles leave this undefined.
  pillarSlug?: string;
  eyebrow: string; // kicker, e.g. "Gelenke & Beweglichkeit"
  title: string; // H1 + SEO title
  metaDescription: string; // ~150-160 chars
  updated: string; // ISO date, e.g. "2026-06-15"
  heroImage?: string; // optional, unter /public, z. B. "/ratgeber-img/gehirnjogging-ab-60.png"
  exercises?: Exercise[]; // optionale Mitmach-Uebungen, erscheinen nach den Sections
  intro: string[]; // lead paragraphs
  sections: ArticleSection[];
  faq: ArticleFaq[];
};
