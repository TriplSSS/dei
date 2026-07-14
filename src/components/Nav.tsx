"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/catalog", label: "Каталог" },
  { href: "/calculator", label: "Калькулятор" },
  { href: "/documents", label: "Документы" },
  { href: "/about", label: "О компании" },
  { href: "/contacts", label: "Контакты" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 transition-transform duration-300"
      >
        <nav className={`site-nav-bar mx-auto flex h-[64px] w-full max-w-[1380px] items-center justify-between px-4 transition-all duration-300 sm:px-5 ${scrolled ? "shadow-[0_24px_70px_-38px_rgba(0,0,0,.95)]" : ""}`} aria-label="Основная навигация">
          <Link href="/" onClick={() => setOpen(false)} className="text-[18px] font-bold tracking-[-0.04em] text-white">
            DEI
          </Link>

          <div className="hidden items-center gap-7 text-[13px] md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link py-1 transition-colors ${isActive(link.href) ? "text-white" : "text-zinc-500 hover:text-zinc-200"}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <a
              href="tel:+79885807630"
              className="glass-pill btn hidden px-4 py-2 text-[13px] font-medium text-red-200 transition-colors hover:border-red-400/50 hover:text-white sm:inline-flex"
            >
              Позвонить
            </a>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="glass-pill btn flex h-9 w-9 items-center justify-center text-zinc-300 md:hidden"
              aria-label={open ? "Закрыть меню" : "Открыть меню"}
              aria-expanded={open}
            >
              <span className="sr-only">Меню</span>
              <span className="relative h-3.5 w-4">
                <i className={`absolute left-0 top-1 block h-px w-4 bg-current transition-transform ${open ? "translate-y-[3px] rotate-45" : ""}`} />
                <i className={`absolute bottom-1 left-0 block h-px w-4 bg-current transition-transform ${open ? "-translate-y-[3px] -rotate-45" : ""}`} />
              </span>
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              aria-label="Закрыть меню"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30 bg-black/70 md:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="glass-card fixed inset-x-3 top-[84px] z-40 rounded-2xl px-4 py-5 md:hidden"
            >
              <div className="mx-auto flex max-w-[1400px] flex-col">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`border-b border-white/[0.06] py-3.5 text-base ${isActive(link.href) ? "text-white" : "text-zinc-400"}`}
                  >
                    {link.label}
                  </Link>
                ))}
                <a href="tel:+79885807630" className="btn mt-5 bg-red-600 py-3.5 text-center text-sm font-semibold text-white">
                  +7 (988) 580-76-30
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
