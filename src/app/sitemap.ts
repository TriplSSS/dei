import { MetadataRoute } from "next";
import { listProducts } from "@/lib/productCatalog";

const BASE_URL = "https://dei-coral.vercel.app";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await listProducts();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL,                    lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE_URL}/catalog`,       lastModified: new Date(), changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE_URL}/about`,         lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/contacts`,      lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/documents`,     lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/calculator`,    lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  ];

  const productRoutes: MetadataRoute.Sitemap = products.map(p => ({
    url: `${BASE_URL}/catalog/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}
