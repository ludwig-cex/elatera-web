import { notFound } from "next/navigation";
import { PRODUCTS, PRODUCT_LIST, type ProductSlug } from "@/lib/products";
import { SalesPage } from "@/components/product/sales-page";
import type { Metadata } from "next";

export function generateStaticParams() {
  return PRODUCT_LIST.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = PRODUCTS[slug as ProductSlug];
  if (!product) return {};
  const url = `/products/${product.slug}`;
  return {
    title: `${product.name} — ${product.tagline}`,
    description: product.hero.subheadline,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "de_DE",
      siteName: "Nutrasana",
      url,
      title: `${product.name} — ${product.tagline}`,
      description: product.hero.subheadline,
      images: [{ url: `/products/${product.slug}/solo.png` }],
    },
  };
}

const SITE = "https://www.nutra-sana.de";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = PRODUCTS[slug as ProductSlug];
  if (!product) notFound();

  const prices = product.bundles.map((b) => b.priceCents / 100);
  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.hero.subheadline,
    image: [`${SITE}/products/${product.slug}/solo.png`],
    brand: { "@type": "Brand", name: "Nutrasana" },
    category: "Nahrungsergänzungsmittel",
    sku: product.pzn,
    url: `${SITE}/products/${product.slug}`,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "EUR",
      lowPrice: Math.min(...prices).toFixed(2),
      highPrice: Math.max(...prices).toFixed(2),
      offerCount: product.bundles.length,
      availability: "https://schema.org/InStock",
      url: `${SITE}/products/${product.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }}
      />
      <SalesPage product={product} />
    </>
  );
}
