"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";

export default function CountUp({
  target,
  from = 0,
  suffix = "",
  duration = 1400,
}: {
  target: number;
  from?: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [count, setCount] = useState(from);

  useEffect(() => {
    if (!isInView) return;
    let raf: number;
    let startTime: number | null = null;

    const animate = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.round(from + eased * (target - from)));
      if (progress < 1) raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [isInView, target, from, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}
