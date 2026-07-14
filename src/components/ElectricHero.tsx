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
      <div className="dei-hero-panels" aria-hidden="true" />
      <div className="dei-hero-light" aria-hidden="true" />

      <div className="dei-hero-layout">
        <div className="dei-hero-copy">
          <div className="dei-energy-lockup">
            <div className="dei-orbit-bloom" aria-hidden="true" />

            <svg className="dei-energy-orbit dei-energy-orbit--back" viewBox="0 0 800 420" shapeRendering="geometricPrecision" aria-hidden="true">
              <defs>
                <linearGradient id="dei-orbit-gradient" x1="70" y1="210" x2="730" y2="210" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="#450306" />
                  <stop offset="0.46" stopColor="#e50914" />
                  <stop offset="0.58" stopColor="#ff786f" />
                  <stop offset="1" stopColor="#450306" />
                </linearGradient>
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

            <svg className="dei-energy-orbit dei-energy-orbit--front" viewBox="0 0 800 420" shapeRendering="geometricPrecision" aria-hidden="true">
              <defs>
                <linearGradient id="dei-orbit-front-gradient" x1="70" y1="210" x2="730" y2="210" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#e50914" stopOpacity="0" />
                  <stop offset="0.15" stopColor="#e50914" stopOpacity="0.42" />
                  <stop offset="0.42" stopColor="#ff3b30" stopOpacity="0.96" />
                  <stop offset="0.74" stopColor="#e50914" stopOpacity="0.8" />
                  <stop offset="1" stopColor="#e50914" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                className="dei-orbit-front-halo"
                d="M70 210 A330 104 0 0 0 730 210"
                pathLength="1"
              />
              <path
                className="dei-orbit-front-arc"
                d="M70 210 A330 104 0 0 0 730 210"
                pathLength="1"
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
