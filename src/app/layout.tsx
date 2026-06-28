import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";

const outfit = Outfit({
  subsets: ["latin", "latin-ext"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: {
    default: "ДонЭлектроИнтел - сварочное оборудование, освещение",
    template: "%s - ДонЭлектроИнтел",
  },
  description: "ООО ДонЭлектроИнтел (DEI) - производство и поставка сварочного оборудования, светодиодных светильников, центраторов для труб. Ростов-на-Дону.",
  keywords: ["сварочное оборудование", "светодиодные светильники", "центраторы", "Ростов-на-Дону", "ДонЭлектроИнтел", "DEI"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${outfit.variable} antialiased`}>
      <body className="bg-white text-zinc-900 font-[family-name:var(--font-outfit)]">
        <Nav />
        <ScrollProgress />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
