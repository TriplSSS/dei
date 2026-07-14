"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export function ElectricHero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!hero || reducedMotion.matches) return;

    const onPointerMove = (event: PointerEvent) => {
      const bounds = hero.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;

      hero.style.setProperty("--hero-orbit-x", `${(x - 0.5) * 10}px`);
      hero.style.setProperty("--hero-orbit-y", `${(y - 0.5) * 7}px`);
      hero.style.setProperty("--hero-light-x", `${x * 100}%`);
      hero.style.setProperty("--hero-light-y", `${y * 100}%`);
    };

    const onPointerLeave = () => {
      hero.style.setProperty("--hero-orbit-x", "0px");
      hero.style.setProperty("--hero-orbit-y", "0px");
      hero.style.setProperty("--hero-light-x", "68%");
      hero.style.setProperty("--hero-light-y", "48%");
    };

    hero.addEventListener("pointermove", onPointerMove);
    hero.addEventListener("pointerleave", onPointerLeave);

    return () => {
      hero.removeEventListener("pointermove", onPointerMove);
      hero.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <section ref={heroRef} className="dei-cinematic-hero" aria-labelledby="dei-hero-title">
      <div className="dei-hero-panels" aria-hidden="true">
        <span className="dei-hero-panel dei-hero-panel--left" />
        <span className="dei-hero-panel dei-hero-panel--center" />
        <span className="dei-hero-panel dei-hero-panel--right" />
      </div>
      <div className="dei-hero-light" aria-hidden="true" />

      <div className="dei-hero-layout">
        <div className="dei-hero-copy">
          <div className="dei-energy-lockup">
            <div className="dei-orbit-bloom" aria-hidden="true" />

            <svg className="dei-energy-orbit dei-energy-orbit--back" viewBox="0 0 800 420" aria-hidden="true">
              <defs>
                <linearGradient id="dei-orbit-gradient" x1="70" y1="210" x2="730" y2="210" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="#450306" />
                  <stop offset="0.46" stopColor="#e50914" />
                  <stop offset="0.58" stopColor="#ff786f" />
                  <stop offset="1" stopColor="#450306" />
                </linearGradient>
                <filter id="dei-orbit-glow" x="-30%" y="-80%" width="160%" height="260%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <ellipse className="dei-orbit-track" cx="400" cy="210" rx="330" ry="104" />
              <ellipse className="dei-orbit-halo" cx="400" cy="210" rx="330" ry="104" />
              <ellipse className="dei-orbit-energy" cx="400" cy="210" rx="330" ry="104" pathLength="1" />
              <circle className="dei-orbit-charge" r="5">
                <animateMotion
                  dur="6.4s"
                  repeatCount="indefinite"
                  path="M70 210a330 104 0 1 0 660 0a330 104 0 1 0-660 0"
                />
              </circle>
            </svg>

            <h1 id="dei-hero-title" className="dei-hero-wordmark">DEI</h1>

            <svg className="dei-energy-orbit dei-energy-orbit--front" viewBox="0 0 800 420" aria-hidden="true">
              <defs>
                <linearGradient id="dei-orbit-front-gradient" x1="70" y1="210" x2="730" y2="210" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#e50914" stopOpacity="0" />
                  <stop offset="0.15" stopColor="#e50914" stopOpacity="0.42" />
                  <stop offset="0.42" stopColor="#ff3b30" stopOpacity="0.96" />
                  <stop offset="0.74" stopColor="#e50914" stopOpacity="0.8" />
                  <stop offset="1" stopColor="#e50914" stopOpacity="0" />
                </linearGradient>
                <clipPath id="dei-orbit-front-half">
                  <rect x="0" y="210" width="800" height="210" />
                </clipPath>
              </defs>
              <ellipse
                className="dei-orbit-front-arc"
                cx="400"
                cy="210"
                rx="330"
                ry="104"
                clipPath="url(#dei-orbit-front-half)"
              />
            </svg>
          </div>

          <div className="dei-hero-actions">
            <Link className="dei-hero-button dei-hero-button--primary" href="/catalog">Каталог</Link>
            <Link className="dei-hero-button dei-hero-button--secondary" href="/contacts">Связаться с нами</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
