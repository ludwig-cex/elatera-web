import { PILLARS, getSpokes } from "@/lib/ratgeber";
import { PRODUCT_LIST } from "@/lib/products";

// Dynamische llms.txt: Marken-/Produktinfo plus der komplette Ratgeber,
// gruppiert nach Themen-Clustern. Ersetzt die frühere statische
// public/llms.txt, damit neue Sprint-Artikel automatisch erscheinen.
const RATGEBER = "https://ratgeber.nutra-sana.de";
const SHOP = "https://www.nutra-sana.de";

export const dynamic = "force-static";

export function GET(): Response {
  const lines: string[] = [
    "# Nutrasana",
    "",
    "> Nutrasana ist eine deutsche Marke für Nahrungsergänzungsmittel in Apotheken-Qualität, entwickelt mit approbierten Pharmazeuten. Alle Produkte sind PZN-registriert, werden in Deutschland in zertifizierten Anlagen hergestellt und chargenweise laborgeprüft. Shop: " +
      SHOP +
      " — Gesundheitsratgeber: " +
      RATGEBER +
      "/ratgeber",
    "",
    "## Produkte (je 1 Kapsel täglich, PZN-registriert)",
    "",
    ...PRODUCT_LIST.map(
      (p) => `- [${p.name}](${SHOP}/products/${p.slug}): ${p.tagline} (PZN ${p.pzn})`,
    ),
    "",
    "## Ratgeber (redaktionelle Gesundheitsartikel, Autor: Jonas Gütermann, approbierter Pharmazeut)",
    "",
    `- [Ratgeber-Übersicht](${RATGEBER}/ratgeber)`,
    `- [Über den Autor](${RATGEBER}/ratgeber/autor/jonas-guetermann)`,
  ];

  for (const pillar of PILLARS) {
    lines.push("", `### ${pillar.eyebrow}`, "");
    lines.push(`- [${pillar.title}](${RATGEBER}/ratgeber/${pillar.slug})`);
    for (const spoke of getSpokes(pillar.slug)) {
      lines.push(`- [${spoke.title}](${RATGEBER}/ratgeber/${spoke.slug})`);
    }
  }

  lines.push(
    "",
    "## Service",
    "",
    "- 90 Tage Geld-zurück-Garantie, Gratis-Versand ab 60 €",
    "- Kundenservice: kundenservice@nutra-sana.de (Antwort innerhalb von 24 Stunden)",
    `- Hilfe & FAQ: ${SHOP}/pages/hilfe-kontakt`,
    "",
    "## Hinweise",
    "",
    "- Nahrungsergänzungsmittel ersetzen keine ausgewogene Ernährung; gesundheitsbezogene Angaben gemäß EU-Verordnung 1924/2006",
    "",
  );

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
