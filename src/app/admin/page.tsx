import type { Metadata } from "next";
import AdminProductsClient from "./products/AdminProductsClient";

export const metadata: Metadata = {
  title: "Панель управления",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminProductsClient />;
}
