import type { Metadata } from "next";
import { Suspense } from "react";
import { listProducts } from "@/lib/productCatalog";
import CatalogClient from "./CatalogClient";

export const metadata: Metadata = {
  title: "Каталог",
  description: "Сварочные инверторы, LED-светильники, центраторы и расходные материалы. Собственное производство ДонЭлектроИнтел, Ростов-на-Дону.",
  openGraph: {
    title: "Каталог — ДонЭлектроИнтел",
    description: "Полный каталог продукции DEI: сварочное оборудование, промышленное освещение, центраторы и расходники.",
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
