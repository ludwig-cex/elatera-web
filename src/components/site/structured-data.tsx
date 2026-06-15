// Site-wide structured data (JSON-LD). Teaches Google that the brand is one
// entity across spelling variants ("Nutrasana", "nutra-sana", "nutra sana")
// via Organization.alternateName, and declares the WebSite. Rendered once in
// the root layout so it ships on every page.

const SITE = "https://www.nutra-sana.de";

const BRAND_VARIANTS = ["nutra-sana", "nutrasana", "Nutra-Sana", "Nutra Sana"];

const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE}/#organization`,
  name: "Nutrasana",
  alternateName: BRAND_VARIANTS,
  url: SITE,
  logo: `${SITE}/apple-icon.png`,
  email: "kundenservice@nutrasana.de",
  description:
    "Nutrasana entwickelt durchdachte Nahrungsergänzung in Apotheken-Qualität – von Pharmazeuten formuliert, in Deutschland hergestellt.",
  brand: ["Vertisana", "Mobilisana", "Somnisana"],
};

const website = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE}/#website`,
  name: "Nutrasana",
  alternateName: BRAND_VARIANTS,
  url: SITE,
  inLanguage: "de-DE",
  publisher: { "@id": `${SITE}/#organization` },
};

export function StructuredData() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
}
