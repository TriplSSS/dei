"use client";

import { useEffect, useState } from "react";

const STANDARD_DURATION = 1650;
const REDUCED_DURATION = 120;
const EXIT_DURATION = 620;

export function SiteLoader() {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const startedAt = performance.now();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const minimumDuration = reducedMotion ? REDUCED_DURATION : STANDARD_DURATION;
    let exitTimer: number | undefined;
    let removeTimer: number | undefined;
    let scheduled = false;

    root.classList.add("site-is-loading");

    const finish = () => {
      if (scheduled) return;
      scheduled = true;

      const remaining = Math.max(0, minimumDuration - (performance.now() - startedAt));
      exitTimer = window.setTimeout(() => {
        setLeaving(true);
        root.classList.remove("site-is-loading");
        removeTimer = window.setTimeout(
          () => setVisible(false),
          reducedMotion ? 20 : EXIT_DURATION,
        );
      }, remaining);
    };

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish, { once: true });
    }

    const fallbackTimer = window.setTimeout(finish, 2500);

    return () => {
      window.removeEventListener("load", finish);
      window.clearTimeout(exitTimer);
      window.clearTimeout(removeTimer);
      window.clearTimeout(fallbackTimer);
      root.classList.remove("site-is-loading");
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`site-loader${leaving ? " site-loader--leaving" : ""}`}
      role="status"
      aria-live="polite"
    >
      <span className="sr-only">Загрузка сайта DEI</span>
      <div className="site-loader-stage" aria-hidden="true">
        <div className="site-loader-logo">
          <span>DEI</span>
          <i />
        </div>

        <div className="site-loader-circuit">
          <span className="site-loader-contact site-loader-contact--left" />
          <svg viewBox="0 0 320 72" fill="none">
            <defs>
              <linearGradient
                id="loader-current"
                x1="12"
                y1="36"
                x2="308"
                y2="36"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#e5092f" stopOpacity="0" />
                <stop offset="0.22" stopColor="#ff173f" />
                <stop offset="0.52" stopColor="#ffffff" />
                <stop offset="0.8" stopColor="#ff173f" />
                <stop offset="1" stopColor="#e5092f" stopOpacity="0" />
              </linearGradient>
              <filter id="loader-glow" x="-30%" y="-100%" width="160%" height="300%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path
              className="site-loader-arc site-loader-arc--glow"
              d="M12 37L61 32L84 44L107 21L132 40L154 13L178 52L201 26L224 43L251 29L278 38L308 34"
            />
            <path
              className="site-loader-arc site-loader-arc--core"
              d="M12 37L61 32L84 44L107 21L132 40L154 13L178 52L201 26L224 43L251 29L278 38L308 34"
              stroke="url(#loader-current)"
              filter="url(#loader-glow)"
            />
            <path className="site-loader-branch" d="M107 21L119 5M178 52L190 68M224 43L237 59" />
          </svg>
          <span className="site-loader-contact site-loader-contact--right" />
        </div>

        <div className="site-loader-progress"><span /></div>
      </div>
    </div>
  );
}
