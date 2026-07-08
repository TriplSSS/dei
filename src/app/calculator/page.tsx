import type { Metadata } from "next";
import CalculatorClient from "./CalculatorClient";

export const metadata: Metadata = {
  title: "Калькулятор освещения",
  description: "Рассчитайте необходимое количество светодиодных светильников DEI для вашего помещения. Бесплатный онлайн-расчёт промышленного освещения.",
  openGraph: {
    title: "Калькулятор освещения — ДонЭлектроИнтел",
    description: "Бесплатный онлайн-расчёт количества LED-светильников для цеха, склада или офиса по нормативному методу.",
    type: "website",
    locale: "ru_RU",
  },
};

export default function CalculatorPage() {
  return <CalculatorClient />;
}
