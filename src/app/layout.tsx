import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin", "latin-ext"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "ДонЭлектроИнтел — сварочное оборудование, освещение, инструмент",
  description: "ООО ДонЭлектроИнтел (DEI) — поставка сварочного оборудования, промышленного освещения, расходных материалов и инструмента. Ростов-на-Дону.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${outfit.variable} antialiased`}>
      <body className="bg-white text-zinc-900 font-[family-name:var(--font-outfit)]">
        {children}
      </body>
    </html>
  );
}
