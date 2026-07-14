import type { Metadata } from "next";
import { Suspense } from "react";
import { listProductCategories, listProducts } from "@/lib/productCatalog";
import CatalogClient from "./CatalogClient";

export const metadata: Metadata = {
  title: "Каталог",
  description: "Каталог DEI: сварочный аппарат Протон и светодиодный светильник Кобра.",
  openGraph: {
    title: "Каталог — ДонЭлектроИнтел",
    description: "Промышленное оборудование DEI: сварочный аппарат Протон и светодиодный светильник Кобра.",
  },
};

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const [products, categories] = await Promise.all([listProducts(), listProductCategories()]);

  return (
    <Suspense>
      <CatalogClient products={products} categories={categories} />
    </Suspense>
  );
}
