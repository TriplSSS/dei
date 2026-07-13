import type { Metadata } from "next";
import { Suspense } from "react";
import { listProducts } from "@/lib/productCatalog";
import CatalogClient from "./CatalogClient";

export const metadata: Metadata = {
  title: "Каталог",
  description: "Каталог DEI: сварочный аппарат Протон и светодиодный светильник Кобра.",
  openGraph: {
    title: "Каталог — ДонЭлектроИнтел",
    description: "Два тестовых товара DEI для проверки интернет-магазина: Протон и Кобра.",
  },
};

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const products = await listProducts();

  return (
    <Suspense>
      <CatalogClient products={products} />
    </Suspense>
  );
}
