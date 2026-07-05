"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/catalog",    label: "Каталог" },
  { href: "/calculator", label: "Калькулятор" },
  { href: "/documents",  label: "Документы" },
  { href: "/about",      label: "О компании" },
  { href: "/contacts",   label: "Контакты" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <div className="fixed top-3 inset-x-0 z-50 flex justify-center px-4">
        <nav
          className="w-full max-w-[1100px]"
          style={{
            background: "rgba(9,9,11,0.82)",
            backdropFilter: "blur(28px) saturate(1.6)",
            WebkitBackdropFilter: "blur(28px) saturate(1.6)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 999,
            boxShadow: scrolled ? "0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)" : "0 4px 24px rgba(0,0,0,0.2)",
          }}
        >
          <div className="h-[52px] flex items-center justify-between px-5">
            <Link href="/" className="text-[17px] font-extrabold tracking-tight text-white select-none">
              DEI
            </Link>

            <div className="hidden md:flex items-center gap-7 text-[13.5px]">
              {links.map(l => (
                <Link key={l.href} href={l.href} className={`nav-link py-1 transition-colors duration-200 ${
                  pathname === l.href || pathname.startsWith(l.href + '/')
                    ? 'text-white'
                    : 'text-zinc-400 hover:text-white'
                }`}>
                  {l.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <a
                href="tel:+79885807630"
                className="hidden sm:inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white text-[13px] px-4 py-2 font-semibold btn transition-colors"
                style={{ borderRadius: 999 }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                </svg>
                Позвонить
              </a>

              <button
                onClick={() => setOpen(!open)}
                className="md:hidden w-9 h-9 flex flex-col gap-[5px] items-center justify-center rounded-full glass-pill btn"
                aria-label="Меню"
              >
                <span className={`block w-4 h-[1.5px] bg-zinc-300 transition-all duration-200 ${open ? "rotate-45 translate-y-[3.25px]" : ""}`} />
                <span className={`block w-4 h-[1.5px] bg-zinc-300 transition-all duration-200 ${open ? "-rotate-45 -translate-y-[3.25px]" : ""}`} />
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Затемнение за меню */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-30 bg-black/70 md:hidden"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Дропдаун меню */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-3 top-[68px] z-40 rounded-2xl md:hidden"
            style={{
              background: "rgba(14,14,16,0.98)",
              backdropFilter: "blur(32px) saturate(1.4)",
              WebkitBackdropFilter: "blur(32px) saturate(1.4)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
            }}
          >
            <div className="px-5 py-5 flex flex-col gap-1">
              {links.map(l => (
                <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
                  className={`text-[17px] font-medium py-3 border-b border-white/[0.05] last:border-0 transition-colors duration-150 ${
                    pathname === l.href || pathname.startsWith(l.href + '/')
                      ? 'text-white'
                      : 'text-zinc-400 active:text-white'
                  }`}>
                  {l.label}
                </Link>
              ))}
              <a
                href="tel:+79885807630"
                className="mt-3 bg-red-600 active:bg-red-500 text-white text-center py-4 font-semibold text-[15px] rounded-xl transition-colors"
              >
                +7 (988) 580-76-30
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
