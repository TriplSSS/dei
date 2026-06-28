import type { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "О компании",
  description: "ООО ДонЭлектроИнтел - производитель сварочного оборудования и светодиодных светильников. Основана в 2006 году в Ростове-на-Дону.",
};

export default function AboutPage() {
  return <AboutClient />;
}
