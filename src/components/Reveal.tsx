"use client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { motion, MotionConfig, type TargetAndTransition } from "motion/react";

const ease = [0.16, 1, 0.3, 1] as const;

export type RevealDirection = "up" | "left" | "right" | "scale" | "blur" | "clip";

const variants: Record<RevealDirection, { hidden: TargetAndTransition; visible: TargetAndTransition }> = {
  up:    { hidden: { opacity: 0, y: 36 },                              visible: { opacity: 1, y: 0 } },
  left:  { hidden: { opacity: 0, x: -48 },                            visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 48 },                             visible: { opacity: 1, x: 0 } },
  scale: { hidden: { opacity: 0, scale: 0.88 },                        visible: { opacity: 1, scale: 1 } },
  blur:  { hidden: { opacity: 0, scale: 0.96, filter: "blur(10px)" },  visible: { opacity: 1, scale: 1, filter: "blur(0px)" } },
  clip:  { hidden: { clipPath: "inset(0 0 100% 0)", opacity: 1 },      visible: { clipPath: "inset(0 0 0% 0)", opacity: 1 } },
};

const durations: Record<RevealDirection, number> = {
  up: 0.7, left: 0.65, right: 0.65, scale: 0.7, blur: 0.65, clip: 0.85,
};

export default function Reveal({
  children,
  delay = 0,
  className = "",
  direction = "up",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: RevealDirection;
}) {
  const v = variants[direction];

  // reducedMotion="user": разметка сервера и клиента совпадает (нет ветвления),
  // а при включённом «уменьшенном движении» Motion сам отключает перемещения,
  // оставляя проявление через opacity — секции не застревают невидимыми
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        className={className}
        initial={v.hidden}
        whileInView={v.visible}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: durations[direction], delay, ease }}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
}
