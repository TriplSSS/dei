import type { Metadata } from "next";
import AdminProductsClient from "./AdminProductsClient";

export const metadata: Metadata = {
  title: "Админка товаров",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminProductsPage() {
  return <AdminProductsClient />;
}
