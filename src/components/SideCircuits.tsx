"use client";

import { useEffect, useRef } from "react";

/**
 * Боковые «энергетические рельсы»: тонкие вертикальные линии у левого и
 * правого края, по которым бегут светящиеся импульсы с затухающим хвостом.
 * Тема ДонЭлектроИнтел — ток по проводам. Центр экрана остаётся свободным.
 * Canvas 2D, без зависимостей. Пауза при скрытой вкладке.
 */
type Pulse = { pos: number; speed: number; dir: 1 | -1; len: number; hot: boolean };
type Rail = { xFrac: number; pulses: Pulse[] };

export default function SideCircuits({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const DPR = Math.min(window.devicePixelRatio || 1, 1.5);

    const rnd = (a: number, b: number) => a + Math.random() * (b - a);
    const mkPulses = (): Pulse[] =>
      Array.from({ length: Math.random() < 0.5 ? 1 : 2 }, () => ({
        pos: Math.random(),
        speed: rnd(0.05, 0.14),
        dir: Math.random() < 0.5 ? 1 : -1,
        len: rnd(0.1, 0.22),
        hot: Math.random() < 0.4, // часть импульсов — тёплые (оранжевые искры)
      }));

    // рельсы: 3 у левого края, 3 у правого
    const rails: Rail[] = [
      { xFrac: 0.045, pulses: mkPulses() },
      { xFrac: 0.085, pulses: mkPulses() },
      { xFrac: 0.125, pulses: mkPulses() },
      { xFrac: 0.875, pulses: mkPulses() },
      { xFrac: 0.915, pulses: mkPulses() },
      { xFrac: 0.955, pulses: mkPulses() },
    ];

    let raf = 0;
    let running = false;
    let last = performance.now();

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      for (const rail of rails) {
        const x = rail.xFrac * w;

        // тело рельса — едва заметная линия
        ctx.strokeStyle = "rgba(255,255,255,0.05)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();

        // узлы-насечки
        for (let ny = 0.12; ny < 1; ny += 0.16) {
          ctx.fillStyle = "rgba(255,255,255,0.08)";
          ctx.fillRect(x - 1.5 * DPR, ny * h, 3 * DPR, 1 * DPR);
        }

        // импульсы с хвостом
        for (const p of rail.pulses) {
          const headY = p.pos * h;
          const tailY = headY - p.dir * p.len * h;
          const col = p.hot ? "255,179,92" : "239,68,68";

          const grad = ctx.createLinearGradient(x, tailY, x, headY);
          grad.addColorStop(0, `rgba(${col},0)`);
          grad.addColorStop(1, `rgba(${col},0.55)`);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 2 * DPR;
          ctx.beginPath();
          ctx.moveTo(x, tailY);
          ctx.lineTo(x, headY);
          ctx.stroke();

          // яркая головка со свечением
          ctx.fillStyle = p.hot ? "rgba(255,214,150,0.95)" : "rgba(255,120,110,0.95)";
          ctx.shadowColor = `rgba(${col},0.9)`;
          ctx.shadowBlur = 14 * DPR;
          ctx.beginPath();
          ctx.arc(x, headY, 2.4 * DPR, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
    };

    const tick = (now: number) => {
      const dt = Math.min(now - last, 50) / 1000;
      last = now;
      for (const rail of rails) {
        for (const p of rail.pulses) {
          p.pos += p.dir * p.speed * dt;
          if (p.pos > 1.25) p.pos = -0.25;
          if (p.pos < -0.25) p.pos = 1.25;
        }
      }
      render();
      if (running) raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running || document.hidden) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const stop = () => { running = false; cancelAnimationFrame(raf); };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(rect.width * DPR));
      canvas.height = Math.max(1, Math.round(rect.height * DPR));
      render();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    start();

    return () => {
      stop();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden />;
}
