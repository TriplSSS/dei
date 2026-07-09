import type { Metadata } from "next";
import AdminOrdersClient from "./AdminOrdersClient";

export const metadata: Metadata = {
  title: "Заказы | DEI",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminOrdersPage() {
  return <AdminOrdersClient />;
}
