import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./internal-v11.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import BackToTop from "@/components/BackToTop";
import { SiteLoader } from "@/components/SiteLoader";

const inter = Inter({
  subsets: ["cyrillic", "latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dei-coral.vercel.app"),
  title: {
    default: "ДонЭлектроИнтел — сварочное оборудование и освещение",
    template: "%s — ДонЭлектроИнтел",
  },
  description: "ООО ДонЭлектроИнтел (DEI) — сварочное оборудование и светодиодные светильники. Ростов-на-Дону, с 2006 года.",
  keywords: ["сварочное оборудование", "светодиодные светильники", "Протон", "Кобра", "Ростов-на-Дону", "ДонЭлектроИнтел", "DEI"],
  openGraph: {
    title: "ДонЭлектроИнтел — оборудование для производства",
    description: "Производство сварочного оборудования и светодиодных светильников. Ростов-на-Дону, с 2006 года.",
    type: "website",
    locale: "ru_RU",
  },
  robots: { index: true, follow: true },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ООО ДонЭлектроИнтел",
  alternateName: "DEI",
  url: "https://dei-coral.vercel.app",
  foundingDate: "2006",
  telephone: "+7 (988) 580-76-30",
  address: {
    "@type": "PostalAddress",
    streetAddress: "пер. Нарядный, 14/2",
    addressLocality: "Ростов-на-Дону",
    postalCode: "344065",
    addressCountry: "RU",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={`${inter.variable} antialiased`}>
      <body className="font-[family-name:var(--font-inter)]">
        <SiteLoader />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <div className="site-atmosphere" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <SmoothScroll />
        <Nav />
        <main>{children}</main>
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}
