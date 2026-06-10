import type { MetadataRoute } from "next";
import { PRODUCT_LIST } from "@/lib/products";

const BASE_URL = "https://www.nutra-sana.de";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // /pages/faq und /pages/kontakt sind reine Redirects auf /pages/hilfe-kontakt
  // und gehören deshalb nicht in die Sitemap.
  const staticPaths = [
    "",
    "/pages/ueber-uns",
    "/pages/hilfe-kontakt",
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.6,
  }));

  const productEntries: MetadataRoute.Sitemap = PRODUCT_LIST.map((product) => ({
    url: `${BASE_URL}/products/${product.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticEntries, ...productEntries];
}
