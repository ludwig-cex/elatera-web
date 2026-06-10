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
  return {
    title: `${product.name} — ${product.tagline}`,
    description: product.hero.subheadline,
    alternates: { canonical: `/products/${product.slug}` },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = PRODUCTS[slug as ProductSlug];
  if (!product) notFound();

  return <SalesPage product={product} />;
}
