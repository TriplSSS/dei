import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, listProducts } from "@/lib/productCatalog";
import type { Product } from "@/data/products";
import ProductPageClient from "./ProductPageClient";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const products = await listProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: `${product.name} — ДонЭлектроИнтел`,
      description: product.fullDescription,
      images: [{ url: product.img, width: 800, height: 600 }],
    },
  };
}

const SITE_URL = "https://dei-coral.vercel.app";

const availabilityUrls: Record<NonNullable<Product["availabilityStatus"]>, string> = {
  in_stock: "https://schema.org/InStock",
  on_order: "https://schema.org/PreOrder",
  preorder: "https://schema.org/PreOrder",
  out_of_stock: "https://schema.org/OutOfStock",
};

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const products = await listProducts();

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.img.startsWith("http") ? product.img : `${SITE_URL}${product.img}`,
    brand: { "@type": "Brand", name: product.brand || "ДонЭлектроИнтел" },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/catalog/${product.slug}`,
      price: product.priceNum,
      priceCurrency: "RUB",
      availability: availabilityUrls[product.availabilityStatus || "on_order"],
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Каталог", item: `${SITE_URL}/catalog` },
      { "@type": "ListItem", position: 3, name: product.name, item: `${SITE_URL}/catalog/${product.slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProductPageClient product={product} products={products} />
    </>
  );
}
