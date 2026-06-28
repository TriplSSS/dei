import type { Metadata } from "next";
import ContactsClient from "./ContactsClient";

export const metadata: Metadata = {
  title: "Контакты",
  description: "Контакты ООО ДонЭлектроИнтел: телефон, адрес, режим работы. пер. Нарядный, 14/2, Ростов-на-Дону.",
};

export default function ContactsPage() {
  return <ContactsClient />;
}
