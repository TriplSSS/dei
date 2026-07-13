"use client";

import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import MagneticButton from "@/components/MagneticButton";
import SideCircuits from "@/components/SideCircuits";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

function HeroCoreVisual() {
  return (
    <div className="hero-core-visual" aria-hidden>
      <div className="hero-core-ring hero-core-ring-1" />
      <div className="hero-core-ring hero-core-ring-2" />
      <div className="hero-core-ring hero-core-ring-3" />
      <div className="hero-core-cube">
        <span className="hero-core-face hero-core-face-front" />
        <span className="hero-core-face hero-core-face-back" />
        <span className="hero-core-face hero-core-face-right" />
        <span className="hero-core-face hero-core-face-left" />
        <span className="hero-core-face hero-core-face-top" />
        <span className="hero-core-face hero-core-face-bottom" />
      </div>
      <div className="hero-core-beam hero-core-beam-1" />
      <div className="hero-core-beam hero-core-beam-2" />
      <div className="hero-core-beam hero-core-beam-3" />
    </div>
  );
}

/* ─── Hero ─── */
function PinnedHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // герой плавно растворяется и слегка масштабируется при уходе — без «шторки»
  const heroFade  = useTransform(scrollYProgress, [0, 0.55, 0.92], [1, 1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
  const textY       = useTransform(scrollYProgress, [0, 0.45], [0, -60]);
  const imgScale    = useTransform(scrollYProgress, [0, 1],   [1, 1.08]);

  return (
    <section ref={ref} className="relative h-[150vh]">
      <motion.div
        style={{ opacity: heroFade, scale: heroScale }}
        className="sticky top-0 h-[100dvh] overflow-hidden"
      >

        {/* Background */}
        <motion.div className="absolute inset-0" style={{ scale: imgScale }}>
          <div className="absolute inset-0 bg-[#09090b]" />
          <div className="ambient-red-grid absolute inset-[-8%] opacity-70" />

          <HeroCoreVisual />

          <div className="absolute inset-0 bg-gradient-to-r from-[#09090b] via-[#09090b]/88 to-[#09090b]/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-[#09090b]/45" />

          <div className="absolute pointer-events-none" style={{
            bottom: "-20%", left: "-15%",
            width: "80vw", height: "80vw",
            background: "radial-gradient(circle, rgba(220,38,38,0.12) 0%, rgba(185,28,28,0.05) 42%, transparent 68%)",
            filter: "blur(48px)",
          }} />

          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.045) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            maskImage: "radial-gradient(ellipse 85% 75% at 65% 45%, transparent 15%, black 75%)",
            WebkitMaskImage: "radial-gradient(ellipse 85% 75% at 65% 45%, transparent 15%, black 75%)",
          }} />

          <div className="sphere-in absolute inset-0 pointer-events-none opacity-40">
            <SideCircuits className="w-full h-full" />
          </div>

          <div
            aria-hidden
            className="absolute bottom-8 right-8 font-extrabold tabular-nums select-none leading-none"
            style={{ fontSize: "6rem", color: "rgba(255,255,255,0.022)" }}
          >
            2006
          </div>

          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#09090b] to-transparent pointer-events-none" />
        </motion.div>

        <motion.div style={{ opacity: textOpacity, y: textY }} className="relative z-10 flex h-full items-center px-6">
          <div className="mx-auto flex w-full max-w-[1400px] flex-col items-start">
            <h1 className="hero-in hero-in-1 hero-title-gradient mb-6 text-7xl font-extrabold leading-none tracking-normal md:text-9xl lg:text-[10rem]">
              DEI
            </h1>

            <p className="hero-in hero-in-3 mb-8 max-w-[540px] text-base leading-relaxed text-zinc-300 md:text-lg">
              Два тестовых товара для проверки интернет-магазина: сварочный аппарат Протон и светодиодный светильник Кобра.
            </p>

            <div className="hero-in hero-in-4 flex flex-wrap items-center gap-3">
              <MagneticButton
                href="/catalog"
                className="energy-strip inline-block bg-red-600 px-7 py-3.5 font-semibold text-white shadow-[0_8px_32px_-4px_rgba(220,38,38,0.5)] transition-colors hover:bg-red-500 btn"
              >
                Перейти в каталог
              </MagneticButton>
              <Link href="/checkout" className="glass-pill inline-flex rounded-lg px-5 py-3 text-sm font-semibold text-zinc-300 shadow-[0_12px_34px_-18px_rgba(255,255,255,0.35)] transition-colors duration-200 hover:text-white btn">
                Оформить заказ
              </Link>
            </div>

            <Link href="/contacts" className="hero-in hero-in-5 mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 transition-colors duration-200 hover:text-white">
              Нужна консультация
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
            </Link>
          </div>
        </motion.div>

      </motion.div>
    </section>
  );
}

/* ─── Stat-band: числа как графика ─── */
function StatsBand() {
  const stats = [
    { render: <CountUp target={2006} from={2000} />, label: "год основания" },
    { render: <><CountUp target={new Date().getFullYear() - 2006} from={0} />+</>, label: "лет опыта" },
    { render: "НАКС", label: "аттестация инверторов" },
    { render: "РФ·СНГ", label: "поставки" },
  ];
  return (
    <section className="soft-section relative bg-white/[0.01] px-6 py-8">
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={i} delay={i * 0.08}>
            <div className="rounded-lg bg-white/[0.025] px-6 py-8 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.045)] lg:py-10">
              <p className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white tabular-nums">
                {s.render}
              </p>
              <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-zinc-500">{s.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ─── Почему DEI: full-bleed фон с параллаксом ─── */
function WhyDEI() {
  const points = [
    ["Собственное производство", "Полный цикл: от проектирования до готового изделия. Ростов-на-Дону."],
    ["Каталог без дублей", "На сайте остается один каталог с двумя тестовыми товарами для проверки магазина."],
    ["Комплексный подход", "Выезд, расчёт, поставка, монтаж и консультирование при эксплуатации."],
  ];
  return (
    <section className="relative overflow-hidden">
      <div className="ambient-red-grid absolute inset-[-10%] opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#09090b] via-[#09090b]/88 to-[#09090b]" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 py-24 md:py-32">
        <Reveal>
          <p className="text-red-500 text-[11px] font-semibold tracking-[0.22em] uppercase mb-4">Почему DEI</p>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-[-0.045em] text-white leading-[0.9] max-w-[820px]">
            Качество <span className="text-red-500">оборонной</span> отрасли
          </h2>
          <p className="mt-6 text-zinc-300 text-sm md:text-base leading-relaxed max-w-[520px]">
            Основатели контролировали качество разработки космических двигателей.
            Эту систему мы перенесли в гражданское производство.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-px sm:grid-cols-3 bg-white/[0.06] border border-white/[0.06] rounded-2xl overflow-hidden">
          {points.map(([title, desc], i) => (
            <Reveal key={title} delay={i * 0.1}>
              <div className="h-full bg-[#0b0b0d]/80 backdrop-blur-sm p-7">
                <span className="font-[family-name:var(--font-inter)] text-red-500 text-sm font-bold tabular-nums">
                  0{i + 1}
                </span>
                <h3 className="mt-4 text-lg font-bold text-white">{title}</h3>
                <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <MagneticButton
            href="/about"
            className="mt-10 inline-flex items-center gap-2 text-sm text-red-500 hover:text-red-400 font-medium transition-colors duration-200"
          >
            О компании
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </MagneticButton>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── Как мы работаем ─── */
function HowWeWork() {
  const steps = [
    ["Заявка", "Принимаем заявку и уточняем задачу"],
    ["Выезд", "Выезжаем на объект для оценки"],
    ["Расчёт", "Делаем расчёт и подбираем оборудование"],
    ["Поставка", "Поставляем, монтируем, консультируем"],
  ];
  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <div className="text-center mb-14">
            <p className="text-red-500 text-[11px] font-semibold tracking-[0.22em] uppercase mb-3">Процесс</p>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-[-0.04em] text-white leading-[0.9]">
              Как мы <span className="text-red-500">работаем</span>
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(([title, desc], i) => (
            <Reveal key={title} delay={i * 0.1}>
              <div className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.015] p-7 h-full transition-colors duration-300 hover:border-red-600/30 hover:bg-white/[0.03]">
                <div className="flex items-center gap-3">
                  <span className="font-extrabold tabular-nums text-red-500 text-lg">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="mt-5 text-xl font-bold text-white group-hover:text-red-400 transition-colors duration-200">{title}</h3>
                <p className="mt-2 text-sm text-zinc-500 leading-relaxed">{desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA ─── */
function CTA() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="ambient-red-grid pointer-events-none absolute inset-x-0 top-0 h-full opacity-45" />
      <div className="mx-auto max-w-[820px] relative text-center">
        <Reveal>
          <h2 className="text-4xl font-extrabold leading-tight tracking-normal text-white md:text-6xl">
            Нужна <span className="hero-title-gradient">консультация?</span>
          </h2>
          <p className="mx-auto mt-5 max-w-[420px] text-zinc-400 text-sm md:text-base leading-relaxed">
            Выезд специалиста, расчёт проекта, подбор оборудования — без обязательств.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-5 sm:flex-row">
            <MagneticButton
              href="tel:+79885807630"
              className="energy-strip inline-block bg-red-600 hover:bg-red-500 text-white px-9 py-4 text-lg font-bold btn transition-colors shadow-[0_12px_40px_-6px_rgba(220,38,38,0.45)]"
            >
              +7 (988) 580-76-30
            </MagneticButton>
            <a href="/contacts" className="text-zinc-400 hover:text-white text-sm font-medium transition-colors duration-200">
              Оставить заявку
            </a>
          </div>
          <p className="mt-5 text-zinc-600 text-xs">Пн–Пт: 9:00–18:00 · Сб–Вс: по записи</p>
        </Reveal>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <PinnedHero />
      <StatsBand />
      <WhyDEI />
      <HowWeWork />
      <CTA />
    </>
  );
}
