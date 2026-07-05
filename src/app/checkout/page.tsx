import type { Metadata } from "next";
import CheckoutClient from "./CheckoutClient";

export const metadata: Metadata = {
  title: "Оформление заявки на счёт",
  description: "Оформление заявки на счёт для оплаты по безналичному расчёту. ДонЭлектроИнтел, Ростов-на-Дону.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
