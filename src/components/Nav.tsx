"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import Link from "next/link";
import MagneticButton from "./MagneticButton";

const links = [
  { href: "/#catalog", label: "Каталог" },
  { href: "/about", label: "О компании" },
  { href: "/contacts", label: "Контакты" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-xl border-b border-zinc-100">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">
            DEI<span className="text-red-600">.</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-[15px]">
            {links.map(l => (
              <a key={l.href} href={l.href} className="nav-link text-zinc-500 hover:text-zinc-900 py-1">
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <MagneticButton href="tel:+79885807630" className="hidden sm:inline-block bg-red-600 hover:bg-red-700 text-white text-sm px-5 py-2.5 rounded-lg font-medium btn-press">
              Позвонить
            </MagneticButton>

            <button
              onClick={() => setOpen(!open)}
              className="md:hidden flex flex-col gap-[5px] w-8 h-8 items-center justify-center btn-press"
              aria-label="Меню"
            >
              <span className={`block w-5 h-[1.5px] bg-zinc-800 transition-all duration-200 ${open ? "rotate-45 translate-y-[3.25px]" : ""}`} />
              <span className={`block w-5 h-[1.5px] bg-zinc-800 transition-all duration-200 ${open ? "-rotate-45 -translate-y-[3.25px]" : ""}`} />
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 top-16 z-30 bg-white border-b border-zinc-100 px-6 py-6 md:hidden"
          >
            <div className="flex flex-col gap-4">
              {links.map(l => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-lg text-zinc-700 hover:text-red-600 transition-colors duration-200"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="tel:+79885807630"
                className="bg-red-600 text-white text-center py-3 rounded-lg font-medium btn-press sm:hidden"
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
