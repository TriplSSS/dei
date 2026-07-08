import type { Metadata } from "next";
import DocumentsClient from "./DocumentsClient";

export const metadata: Metadata = {
  title: "Документы и сертификаты",
  description: "Аттестаты НАКС, сертификаты соответствия, технические паспорта и разрешительная документация на продукцию ДонЭлектроИнтел.",
  openGraph: {
    title: "Документы и сертификаты — ДонЭлектроИнтел",
    description: "Аттестат НАКС, сертификаты соответствия, патенты и технические паспорта на продукцию DEI.",
    type: "website",
    locale: "ru_RU",
  },
};

export default function DocumentsPage() {
  return <DocumentsClient />;
}
