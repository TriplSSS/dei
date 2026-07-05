import type { Metadata } from "next";
import DocumentsClient from "./DocumentsClient";

export const metadata: Metadata = {
  title: "Документы и сертификаты",
  description: "Аттестаты НАКС, сертификаты соответствия, технические паспорта и разрешительная документация на продукцию ДонЭлектроИнтел.",
};

export default function DocumentsPage() {
  return <DocumentsClient />;
}
