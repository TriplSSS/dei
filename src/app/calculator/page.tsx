import type { Metadata } from "next";
import CalculatorClient from "./CalculatorClient";

export const metadata: Metadata = {
  title: "Калькулятор освещения",
  description: "Рассчитайте необходимое количество светодиодных светильников DEI для вашего помещения. Бесплатный онлайн-расчёт промышленного освещения.",
};

export default function CalculatorPage() {
  return <CalculatorClient />;
}
