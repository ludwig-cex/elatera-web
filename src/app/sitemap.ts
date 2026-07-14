import type { MetadataRoute } from "next";
import { ARTICLES } from "@/lib/ratgeber";

// Seit der Shopify-Migration ist diese App nur noch das Ratgeber-Archiv unter
// ratgeber.nutra-sana.de. Shop-Seiten leben auf www.nutra-sana.de (eigene
// Shopify-Sitemap) und sind hier per Proxy umgeleitet bzw. noindex.
const BASE_URL = "https://ratgeber.nutra-sana.de";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const ratgeberEntries: MetadataRoute.Sitemap = ARTICLES.map((article) => ({
    url: `${BASE_URL}/ratgeber/${article.slug}`,
    lastModified: article.updated ? new Date(article.updated) : now,
    changeFrequency: "monthly",
    priority: article.pillarSlug ? 0.7 : 0.8,
  }));

  return [
    {
      url: `${BASE_URL}/ratgeber`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/ratgeber/autor/jonas-guetermann`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...ratgeberEntries,
  ];
}
