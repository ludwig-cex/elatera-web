import type { MetadataRoute } from "next";

// AI-Crawler explizit erlauben (GEO): schützt davor, dass eine spätere
// restriktivere Regel sie versehentlich aussperrt. Bingbot ist über "*"
// abgedeckt und füttert zusätzlich Copilot + ChatGPT-Suche.
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "cohere-ai",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/api/",
      },
      ...AI_CRAWLERS.map((bot) => ({
        userAgent: bot,
        allow: "/",
        disallow: "/api/",
      })),
    ],
    sitemap: "https://ratgeber.nutra-sana.de/sitemap.xml",
    host: "https://ratgeber.nutra-sana.de",
  };
}
