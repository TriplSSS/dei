import type { Metadata } from "next";
import CatalogClient from "./CatalogClient";

export const metadata: Metadata = {
  title: "Каталог",
  description: "Сварочные инверторы, LED-светильники, центраторы и расходные материалы. Собственное производство ДонЭлектроИнтел, Ростов-на-Дону.",
  openGraph: {
    title: "Каталог — ДонЭлектроИнтел",
    description: "Полный каталог продукции DEI: сварочное оборудование, промышленное освещение, центраторы и расходники.",
  },
};

export default function CatalogPage() {
  return <CatalogClient />;
}
