"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

export default function BackToTop() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);
  const reduce = useReducedMotion();

  return (
    <motion.button
      style={{ opacity }}
      onClick={() => window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })}
      className="fixed bottom-6 right-6 z-30 w-11 h-11 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-lg shadow-red-200/40 btn-press"
      aria-label="Наверх"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </motion.button>
  );
}
