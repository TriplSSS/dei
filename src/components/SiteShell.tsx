"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import BackToTop from "@/components/BackToTop";
import { SiteLoader } from "@/components/SiteLoader";

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
      <div className="site-atmosphere" aria-hidden="true" />
      <SmoothScroll />
      <Nav />
      <AnimatePresence initial={false} mode="wait">
        <motion.main
          key={pathname}
          className="site-route-main"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.main>
      </AnimatePresence>
      <Footer />
      <BackToTop />
    </>
  );
}
