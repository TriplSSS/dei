"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import BackToTop from "@/components/BackToTop";
import { SiteLoader } from "@/components/SiteLoader";
import { SiteAtmosphere } from "@/components/SiteAtmosphere";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const reduceMotion = useReducedMotion();

  if (isAdmin) {
    return <main className="admin-root">{children}</main>;
  }

  return (
    <>
      <SiteLoader />
      <SiteAtmosphere />
      <SmoothScroll />
      <Nav />
      <AnimatePresence initial={false} mode="wait">
        <motion.main
          key={pathname}
          className="site-route-main"
          initial={reduceMotion ? false : { opacity: 0, y: 6 }}
          animate={reduceMotion
            ? { opacity: 1 }
            : { opacity: 1, y: 0, transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1] } }}
          exit={reduceMotion
            ? undefined
            : { opacity: 0, transition: { duration: 0.18, ease: [0.4, 0, 1, 1] } }}
        >
          {children}
        </motion.main>
      </AnimatePresence>
      <Footer />
      <BackToTop />
    </>
  );
}
