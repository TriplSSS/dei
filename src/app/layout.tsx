import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import SmoothScroll from "@/components/SmoothScroll";
import BackToTop from "@/components/BackToTop";

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
  openGraph: {
    title: "ДонЭлектроИнтел - оборудование для производства",
    description: "Производство сварочного оборудования и светодиодных светильников. Ростов-на-Дону, с 2006 года.",
    type: "website",
    locale: "ru_RU",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${outfit.variable} antialiased`}>
      <body className="bg-[#0f0f11] text-zinc-200 font-[family-name:var(--font-outfit)]">
        <div className="grain" />
        <SmoothScroll />
        <Nav />
        <ScrollProgress />
        <main>{children}</main>
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}
