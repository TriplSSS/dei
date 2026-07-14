"use client";

import { useEffect, useState } from "react";

const STANDARD_DURATION = 2350;
const REDUCED_DURATION = 160;
const COMPLETION_HOLD = 150;
const EXIT_DURATION = 960;
const MAXIMUM_WAIT = 8000;

export function SiteLoader() {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const root = document.documentElement;
    const startedAt = performance.now();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const minimumDuration = reducedMotion ? REDUCED_DURATION : STANDARD_DURATION;
    let pageLoaded = document.readyState === "complete";
    let completed = false;
    let animationFrame = 0;
    let holdTimer: number | undefined;
    let removeTimer: number | undefined;

    root.classList.add("site-is-loading");

    const onLoad = () => {
      pageLoaded = true;
    };

    const finish = () => {
      if (completed) return;
      completed = true;
      setProgress(100);

      holdTimer = window.setTimeout(() => {
        root.classList.add("site-is-revealing");
        setLeaving(true);
        removeTimer = window.setTimeout(
          () => {
            setVisible(false);
            root.classList.remove("site-is-loading", "site-is-revealing");
          },
          reducedMotion ? 20 : EXIT_DURATION,
        );
      }, reducedMotion ? 10 : COMPLETION_HOLD);
    };

    const updateProgress = (now: number) => {
      const elapsed = now - startedAt;
      const progressCeiling = pageLoaded ? 99 : 94;
      const timedProgress = Math.floor((elapsed / minimumDuration) * progressCeiling);
      const nextProgress = Math.min(progressCeiling, timedProgress);

      setProgress((current) => Math.max(current, nextProgress));

      if ((pageLoaded && elapsed >= minimumDuration) || elapsed >= MAXIMUM_WAIT) {
        finish();
        return;
      }

      animationFrame = window.requestAnimationFrame(updateProgress);
    };

    if (!pageLoaded) {
      window.addEventListener("load", onLoad, { once: true });
    }
    animationFrame = window.requestAnimationFrame(updateProgress);

    return () => {
      window.removeEventListener("load", onLoad);
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(holdTimer);
      window.clearTimeout(removeTimer);
      root.classList.remove("site-is-loading", "site-is-revealing");
    };
  }, []);

  if (!visible) return null;

  return (
    <div className={`site-loader${leaving ? " site-loader--leaving" : ""}`} role="status">
      <span className="sr-only">Загрузка сайта DEI</span>

      <div className="site-loader-panels" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <div className="site-loader-stage">
        <div className="site-loader-lockup" aria-hidden="true">
          <div className="site-loader-bloom" />

          <svg className="site-loader-orbit site-loader-orbit--back" viewBox="0 0 600 300">
            <defs>
              <linearGradient id="loader-orbit-gradient" x1="50" y1="150" x2="550" y2="150" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#510015" stopOpacity="0.2" />
                <stop offset="0.28" stopColor="#b0002c" stopOpacity="0.72" />
                <stop offset="0.5" stopColor="#ef003d" />
                <stop offset="0.68" stopColor="#ff6c91" stopOpacity="0.9" />
                <stop offset="1" stopColor="#510015" stopOpacity="0.2" />
              </linearGradient>
              <filter id="loader-orbit-glow" x="-30%" y="-90%" width="160%" height="280%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <ellipse className="site-loader-orbit-track" cx="300" cy="150" rx="250" ry="70" />
            <ellipse className="site-loader-orbit-halo" cx="300" cy="150" rx="250" ry="70" />
            <ellipse className="site-loader-orbit-energy" cx="300" cy="150" rx="250" ry="70" pathLength="1" />
            <circle className="site-loader-orbit-charge" r="4.5">
              <animateMotion
                dur="5.4s"
                repeatCount="indefinite"
                path="M50 150a250 70 0 1 0 500 0a250 70 0 1 0-500 0"
              />
            </circle>
          </svg>

          <div className="site-loader-logo">DEI</div>

          <svg className="site-loader-orbit site-loader-orbit--front" viewBox="0 0 600 300">
            <defs>
              <linearGradient id="loader-orbit-front-gradient" x1="50" y1="150" x2="550" y2="150" gradientUnits="userSpaceOnUse">
                <stop stopColor="#ef003d" stopOpacity="0" />
                <stop offset="0.16" stopColor="#ef003d" stopOpacity="0.46" />
                <stop offset="0.42" stopColor="#ff174e" stopOpacity="0.96" />
                <stop offset="0.74" stopColor="#ef003d" stopOpacity="0.78" />
                <stop offset="1" stopColor="#ef003d" stopOpacity="0" />
              </linearGradient>
              <clipPath id="loader-orbit-front-half">
                <rect x="0" y="150" width="600" height="150" />
              </clipPath>
            </defs>
            <ellipse
              className="site-loader-orbit-front-arc"
              cx="300"
              cy="150"
              rx="250"
              ry="70"
              clipPath="url(#loader-orbit-front-half)"
            />
          </svg>
        </div>

        <div
          className="site-loader-progress"
          role="progressbar"
          aria-label="Загрузка сайта"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <span style={{ transform: `scaleX(${progress / 100})` }} />
        </div>
        <p className="site-loader-percent" aria-hidden="true">
          {String(progress).padStart(2, "0")}%
        </p>
      </div>
    </div>
  );
}
