"use client";

import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import ParallaxImage from "@/components/ParallaxImage";
import MagneticButton from "@/components/MagneticButton";
import ProductCard from "@/components/ProductCard";
import SideCircuits from "@/components/SideCircuits";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, MotionConfig, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

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

          <div className="absolute bottom-[8%] right-[-8%] h-[58dvh] max-h-[620px] w-[82vw] max-w-[720px] opacity-75 mix-blend-screen sm:right-[2%] md:h-[68dvh] md:w-[58vw]">
            <Image
              src="/products/dei-mig-250.jpg"
              alt=""
              fill
              priority
              sizes="(min-width: 768px) 58vw, 82vw"
              className="object-contain"
            />
          </div>

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
            <p className="hero-in hero-in-1 mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-red-400">
              Интернет-магазин промышленного оборудования
            </p>
            <h1 className="hero-in hero-in-1 mb-6 text-6xl font-extrabold leading-none tracking-normal text-white md:text-8xl lg:text-9xl">
              DEI
            </h1>

            <p className="hero-in hero-in-3 mb-8 max-w-[540px] text-base leading-relaxed text-zinc-300 md:text-lg">
              Сварочные инверторы, светильники, центраторы и расходники для производства. Заказ через сайт, счет на оплату и онлайн-оплата.
            </p>

            <div className="hero-in hero-in-4 flex flex-wrap items-center gap-3">
              <MagneticButton
                href="/catalog"
                className="inline-block bg-red-600 px-7 py-3.5 font-semibold text-white shadow-[0_8px_32px_-4px_rgba(220,38,38,0.5)] transition-colors hover:bg-red-500 btn"
              >
                Перейти в каталог
              </MagneticButton>
              <Link href="/checkout" className="glass-pill inline-flex rounded-lg px-5 py-3 text-sm font-semibold text-zinc-300 transition-colors duration-200 hover:text-white btn">
                Оформить заказ
              </Link>
            </div>

            <div className="hero-in hero-in-5 mt-8 grid w-full max-w-[620px] grid-cols-2 gap-px overflow-hidden rounded-lg border border-white/[0.07] bg-white/[0.06] sm:grid-cols-4">
              {["Сварка", "Свет", "Центраторы", "Расходники"].map((item) => (
                <Link key={item} href="/catalog" className="bg-[#0b0b0d]/80 px-4 py-3 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/[0.04] hover:text-white">
                  {item}
                </Link>
              ))}
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
    <section className="relative border-y border-white/[0.06] bg-white/[0.015]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-600/50 to-transparent" />
      <div className="mx-auto max-w-[1400px] grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-white/[0.06]">
        {stats.map((s, i) => (
          <Reveal key={i} delay={i * 0.08}>
            <div className="px-6 py-10 lg:py-14">
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

/* ─── Направления: интерактивный переключатель ─── */
const directions = [
  {
    tab: "Сварка",
    kicker: "MMA · TIG · MIG/MAG",
    title: "Сварочное оборудование",
    desc: "Инверторы ПРОТОН-ДЭИ собственной разработки. Аттестация НАКС. Для промышленности, строительства и нефтегазовой отрасли.",
    specs: [
      { v: "200 А", l: "макс. ток сварки" },
      { v: "НАКС", l: "аттестация" },
      { v: "3 года", l: "гарантия" },
    ],
    price: "от 18 500 ₽",
    img: "/products/dei-mig-250.jpg",
    fit: "contain" as const,
  },
  {
    tab: "Свет",
    kicker: "Цех · Склад · Улица",
    title: "Светодиодные светильники",
    desc: "Промышленные LED-решения для цехов, складов и производственных площадок. Собственное производство в Ростове-на-Дону.",
    specs: [
      { v: "70%", l: "экономия энергии" },
      { v: "IP65", l: "степень защиты" },
      { v: "50 000 ч", l: "ресурс" },
    ],
    price: "от 8 200 ₽",
    img: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=1200&h=1200&fit=crop&q=80",
    fit: "cover" as const,
  },
];

function Directions() {
  const [active, setActive] = useState(0);
  const d = directions[active];

  return (
    <MotionConfig reducedMotion="user">
    <section id="catalog" className="py-16 md:py-24 px-6">
      <div className="mx-auto max-w-[1200px]">
        <Reveal>
          <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-red-500 text-[11px] font-semibold tracking-[0.22em] uppercase mb-3">Каталог</p>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-[-0.04em] text-white leading-[0.9]">
                Что мы производим
              </h2>
            </div>

            {/* Переключатель направлений */}
            <div className="inline-flex self-start rounded-full glass-pill p-1">
              {directions.map((dir, i) => (
                <button
                  key={dir.tab}
                  onClick={() => setActive(i)}
                  className={`relative rounded-full px-6 py-2.5 text-sm font-semibold transition-colors ${
                    active === i ? "text-white" : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {active === i && (
                    <motion.span
                      layoutId="dir-pill"
                      className="absolute inset-0 rounded-full bg-red-600"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{dir.tab}</span>
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Панель активного направления */}
        <div className="glass-card overflow-hidden rounded-3xl">
          <div className="grid md:grid-cols-2">
            {/* Данные */}
            <div className="order-2 flex flex-col p-8 md:order-1 md:p-10 lg:p-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.28, ease }}
                  className="flex flex-1 flex-col"
                >
                  <p className="font-[family-name:var(--font-inter)] text-[11px] uppercase tracking-[0.2em] text-red-400">
                    {d.kicker}
                  </p>
                  <h3 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-[-0.03em] text-white leading-[0.95]">
                    {d.title}
                  </h3>
                  <p className="mt-4 max-w-[440px] text-sm md:text-base leading-relaxed text-zinc-400">
                    {d.desc}
                  </p>

                  {/* Характеристики как числа */}
                  <div className="mt-8 grid grid-cols-3 gap-4">
                    {d.specs.map((s) => (
                      <div key={s.l}>
                        <p className="text-2xl md:text-3xl font-extrabold tracking-tight text-white tabular-nums">{s.v}</p>
                        <p className="mt-1 text-[11px] leading-snug text-zinc-500">{s.l}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto flex flex-wrap items-center gap-5 pt-10">
                    <span className="text-2xl font-extrabold text-red-500 tabular-nums">{d.price}</span>
                    <Link
                      href="/catalog"
                      className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white btn transition-colors hover:bg-red-500 shadow-[0_8px_28px_-6px_rgba(220,38,38,0.5)]"
                    >
                      Смотреть в каталоге
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Фото */}
            <div className="relative order-1 min-h-[260px] overflow-hidden md:order-2 md:min-h-[460px]">
              {/* мягкое свечение под продуктом */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{ background: "radial-gradient(55% 50% at 52% 46%, rgba(220,38,38,0.12) 0%, transparent 68%)" }}
              />
              <AnimatePresence mode="wait">
                <motion.img
                  key={active}
                  src={d.img}
                  alt={d.title}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease }}
                  className={`absolute inset-0 h-full w-full ${
                    d.fit === "contain" ? "object-contain p-4 md:p-6" : "object-cover"
                  }`}
                  style={
                    d.fit === "contain"
                      ? {
                          // растворяем края фото в панель — без видимой рамки
                          maskImage:
                            "radial-gradient(ellipse 80% 84% at 50% 48%, #000 58%, transparent 94%)",
                          WebkitMaskImage:
                            "radial-gradient(ellipse 80% 84% at 50% 48%, #000 58%, transparent 94%)",
                        }
                      : undefined
                  }
                />
              </AnimatePresence>
              {/* растворение края в панель (только для фото-фонов) */}
              {d.fit === "cover" && (
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e]/50 to-transparent md:bg-gradient-to-l" />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
    </MotionConfig>
  );
}

/* ─── Популярные позиции ─── */
function Products() {
  const products = [
    { name: "ПРОТОН-ДЭИ ВДИ 200", category: "Инверторы", price: "от 18 500 ₽", img: "/products/dei-mig-250.jpg" },
    { name: "LED-DEI-120", category: "Светильники", price: "от 8 200 ₽", img: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=400&h=400&fit=crop&q=80" },
    { name: "ЦЗН 159-426", category: "Центраторы", price: "от 24 000 ₽", img: "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?w=400&h=400&fit=crop&q=80" },
    { name: "МР-3 d3.0", category: "Электроды", price: "от 1 200 ₽", img: "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=400&h=400&fit=crop&q=80" },
  ];

  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[720px]">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-red-400">Витрина магазина</p>
              <h2 className="text-3xl font-extrabold leading-tight tracking-normal text-white md:text-5xl">
                Популярные товары для производства
              </h2>
              <p className="mt-4 max-w-[560px] text-sm leading-relaxed text-zinc-400">
                Быстрый вход в основные категории: сварка, промышленный свет, центраторы и расходные материалы.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold text-white btn transition-colors hover:bg-red-500"
              >
                Открыть каталог
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
              <Link href="/checkout" className="inline-flex rounded-lg border border-white/[0.08] px-5 py-3 text-sm font-semibold text-zinc-300 btn transition-colors hover:border-red-600/30 hover:text-white">
                Оформить заказ
              </Link>
            </div>
          </div>
        </Reveal>

        <div className="mb-5 grid gap-px overflow-hidden rounded-lg border border-white/[0.06] bg-white/[0.06] md:grid-cols-3">
          {[
            ["10", "товаров в демо-каталоге"],
            ["4", "основные группы"],
            ["2", "способа оплаты"],
          ].map(([value, label]) => (
            <div key={label} className="bg-[#0b0b0d]/80 px-5 py-4">
              <div className="text-2xl font-extrabold tabular-nums text-white">{value}</div>
              <div className="mt-1 text-xs text-zinc-500">{label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {products.map((p, i) => (
            <ProductCard key={p.name} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Почему DEI: full-bleed фон с параллаксом ─── */
function WhyDEI() {
  const points = [
    ["Собственное производство", "Полный цикл: от проектирования до готового изделия. Ростов-на-Дону."],
    ["Аттестация НАКС", "Инвертор ПРОТОН-ДЭИ ВДИ 200. Запатентованные технологии."],
    ["Комплексный подход", "Выезд, расчёт, поставка, монтаж и консультирование при эксплуатации."],
  ];
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <ParallaxImage
          src="https://images.unsplash.com/photo-1533581908700-82aca30ac82a?w=1920&h=1200&fit=crop&q=80"
          alt="Производственная линия ДонЭлектроИнтел"
          className="h-full"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/85 to-[#09090b]/70" />

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
                  <span className="h-px flex-1 bg-white/10" />
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
      <div className="mx-auto max-w-[820px] relative text-center">
        <Reveal>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-[-0.045em] text-white leading-[0.92]">
            Нужна <span className="text-red-500">консультация?</span>
          </h2>
          <p className="mx-auto mt-5 max-w-[420px] text-zinc-400 text-sm md:text-base leading-relaxed">
            Выезд специалиста, расчёт проекта, подбор оборудования — без обязательств.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-5 sm:flex-row">
            <MagneticButton
              href="tel:+79885807630"
              className="inline-block bg-red-600 hover:bg-red-500 text-white px-9 py-4 text-lg font-bold btn transition-colors shadow-[0_12px_40px_-6px_rgba(220,38,38,0.45)]"
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
      <Directions />
      <Products />
      <WhyDEI />
      <HowWeWork />
      <CTA />
    </>
  );
}
