"use client";

import { useEffect, useRef } from "react";

/**
 * Вращающаяся сфера из частиц (точки + линии), canvas 2D без зависимостей.
 * При prefers-reduced-motion рисует один статичный кадр.
 */
export default function ParticleSphere({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const DPR = Math.min(window.devicePixelRatio || 1, 1.5);
    const N = 220;

    // равномерное распределение точек по сфере (спираль Фибоначчи)
    const pts: [number, number, number][] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const t = golden * i;
      pts.push([Math.cos(t) * r, y, Math.sin(t) * r]);
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(rect.width * DPR));
      canvas.height = Math.max(1, Math.round(rect.height * DPR));
      // при reduced-motion цикла нет — перерисовать статичный кадр вручную
      if (reduce) draw(performance.now());
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let raf = 0;
    let running = true;
    let angle = 0;
    let last = performance.now();

    const draw = (now: number) => {
      const dt = Math.min(now - last, 50);
      last = now;
      angle += dt * 0.00006;

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const R = Math.min(w, h) * 0.42;
      const cx = w / 2;
      const cy = h / 2;
      const ca = Math.cos(angle);
      const sa = Math.sin(angle);
      const tilt = 0.35;
      const ct = Math.cos(tilt);
      const st = Math.sin(tilt);

      const proj: [number, number, number][] = new Array(N);
      for (let i = 0; i < N; i++) {
        const [x, y, z] = pts[i];
        const X = x * ca + z * sa;
        const Z = -x * sa + z * ca;
        const Y2 = y * ct - Z * st;
        const Z2 = y * st + Z * ct;
        const s = 1 / (1.9 - Z2);
        proj[i] = [cx + X * R * s, cy + Y2 * R * s, Z2];
      }

      // линии между близкими точками
      const maxD = R * 0.3;
      const maxD2 = maxD * maxD;
      ctx.lineWidth = 1;
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = proj[i][0] - proj[j][0];
          const dy = proj[i][1] - proj[j][1];
          const d2 = dx * dx + dy * dy;
          if (d2 < maxD2) {
            const depth = (proj[i][2] + proj[j][2] + 2) / 4; // 0..1
            const a = (1 - Math.sqrt(d2) / maxD) * (0.05 + 0.13 * depth);
            ctx.strokeStyle = `rgba(255,255,255,${a.toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(proj[i][0], proj[i][1]);
            ctx.lineTo(proj[j][0], proj[j][1]);
            ctx.stroke();
          }
        }
      }

      // точки: белые + каждая девятая красная (искры)
      for (let i = 0; i < N; i++) {
        const [X, Y, Z] = proj[i];
        const depth = (Z + 1) / 2;
        const red = i % 9 === 0;
        ctx.fillStyle = red
          ? `rgba(239,68,68,${(0.3 + 0.5 * depth).toFixed(3)})`
          : `rgba(255,255,255,${(0.2 + 0.55 * depth).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(X, Y, (red ? 1.7 : 1.1) * (0.6 + depth) * DPR, 0, Math.PI * 2);
        ctx.fill();
      }

      if (running && !reduce) raf = requestAnimationFrame(draw);
    };

    if (reduce) {
      draw(performance.now());
    } else {
      raf = requestAnimationFrame(draw);
    }

    // пауза, когда вкладка скрыта
    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!reduce) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(draw);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden />;
}
