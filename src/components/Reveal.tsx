"use client";

import { motion, MotionConfig } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

// Тип оставлен для обратной совместимости — направление больше не влияет
// на эффект: по всему сайту одно спокойное появление «всплытие снизу».
export type RevealDirection = "up" | "left" | "right" | "scale" | "blur" | "clip";

export default function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: RevealDirection;
}) {
  // reducedMotion="user": разметка сервера и клиента совпадает (нет ветвления),
  // при «уменьшенном движении» Motion сам гасит перемещение, оставляя opacity
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        className={className}
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, delay, ease }}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
}
