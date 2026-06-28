"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

export default function ScrambleText({ text, className = "" }: { text: string; className?: string }) {
  const [display, setDisplay] = useState(text);
  const [triggered, setTriggered] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || triggered) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setTriggered(true);
        observer.disconnect();
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let iteration = 0;
        const interval = setInterval(() => {
          setDisplay(
            text
              .split("")
              .map((ch, i) => {
                if (ch === " ") return " ";
                if (i < iteration) return text[i];
                return chars[Math.floor(Math.random() * chars.length)];
              })
              .join("")
          );
          iteration += 0.8;
          if (iteration >= text.length) {
            clearInterval(interval);
            setDisplay(text);
          }
        }, 35);
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [text, reduce, triggered]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
