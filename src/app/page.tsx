"use client";

import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import ParallaxImage from "@/components/ParallaxImage";
import MagneticButton from "@/components/MagneticButton";
import ScrambleText from "@/components/ScrambleText";
import ProductCard from "@/components/ProductCard";
import SideCircuits from "@/components/SideCircuits";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

function MorphBlob({ className = "" }: { className?: string }) {
  return <div className={`pointer-events-none absolute blur-[80px] opacity-[0.18] ${className}`} />;
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

        {/* Background — CSS, без фото */}
        <motion.div className="absolute inset-0" style={{ scale: imgScale }}>
          <div className="absolute inset-0 bg-[#09090b]" />

          {/* Красный glow снизу-слева — основной */}
          <div className="absolute pointer-events-none" style={{
            bottom: "-20%", left: "-15%",
            width: "80vw", height: "80vw",
            background: "radial-gradient(circle, rgba(220,38,38,0.22) 0%, rgba(185,28,28,0.08) 40%, transparent 68%)",
            filter: "blur(48px)",
          }} />

          {/* Красный glow сверху-справа */}
          <div className="absolute pointer-events-none" style={{
            top: "-20%", right: "-20%",
            width: "55vw", height: "55vw",
            background: "radial-gradient(circle, rgba(153,27,27,0.16) 0%, transparent 60%)",
            filter: "blur(72px)",
          }} />

          {/* Центральный тёмно-красный акцент */}
          <div className="absolute pointer-events-none" style={{
            top: "30%", left: "30%",
            width: "40vw", height: "40vw",
            background: "radial-gradient(circle, rgba(220,38,38,0.04) 0%, transparent 70%)",
            filter: "blur(80px)",
          }} />

          {/* Dot-grid поверх */}
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage: "radial-gradient(ellipse 85% 75% at 65% 45%, transparent 15%, black 75%)",
            WebkitMaskImage: "radial-gradient(ellipse 85% 75% at 65% 45%, transparent 15%, black 75%)",
          }} />

          {/* Боковые энергетические рельсы (ток по проводам) */}
          <div className="sphere-in absolute inset-0 pointer-events-none">
            <SideCircuits className="w-full h-full" />
          </div>

          {/* Год-водяной знак */}
          <div
            aria-hidden
            className="absolute bottom-8 right-8 font-extrabold tabular-nums select-none leading-none"
            style={{ fontSize: "clamp(5rem,13vw,11rem)", color: "rgba(255,255,255,0.022)", letterSpacing: "-0.05em" }}
          >
            2006
          </div>

          {/* Fade снизу */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#09090b] to-transparent pointer-events-none" />
        </motion.div>

        {/* Morphing blobs */}
        <MorphBlob className="w-[700px] h-[700px] bg-red-700 rounded-full morph-slow -left-48 -bottom-48" />
        <MorphBlob className="w-[350px] h-[350px] bg-red-900 rounded-full morph right-16 top-16" />
        <MorphBlob className="w-[180px] h-[180px] bg-red-800 rounded-full morph-fast left-[45%] top-[20%]" />

        {/* Content — по центру, поверх сферы */}
        <motion.div style={{ opacity: textOpacity, y: textY }} className="relative z-10 h-full flex items-center justify-center px-6">
          <div className="flex flex-col items-center text-center max-w-[760px]">
            <h1 className="hero-in hero-in-1 text-[clamp(4.5rem,17vw,14rem)] font-extrabold tracking-[-0.055em] leading-[0.85] mb-7">
              <ScrambleText text="DEI" className="text-red-500" />
            </h1>

            <p className="hero-in hero-in-3 text-zinc-300 text-base md:text-lg leading-relaxed max-w-[480px] mb-9">
              Производим сварочные инверторы и светодиодные светильники.
              Аттестация НАКС. Поставки по РФ и СНГ.
            </p>

            <div className="hero-in hero-in-4 flex items-center gap-4">
              <MagneticButton
                href="#catalog"
                className="bg-red-600 hover:bg-red-500 text-white px-7 py-3.5 font-semibold btn inline-block shadow-[0_8px_32px_-4px_rgba(220,38,38,0.5)] transition-colors"
              >
                Каталог
              </MagneticButton>
              <a href="/contacts" className="text-zinc-400 hover:text-white text-sm font-medium inline-flex items-center gap-1.5 transition-colors duration-200">
                Контакты
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
            </div>
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
    { render: <><CountUp target={18} from={0} />+</>, label: "лет опыта" },
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

/* ─── Направления: крупные фото с параллаксом ─── */
const directions = [
  {
    num: "01",
    title: "Сварочное оборудование",
    desc: "Инверторы ПРОТОН-ДЭИ собственной разработки. Для промышленности, строительства и нефтегазовой отрасли.",
    chips: ["MMA · TIG · MIG/MAG", "Аттестация НАКС", "Ток 20–200 А"],
    price: "от 18 500 ₽",
    img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&h=1000&fit=crop&q=80",
    align: "left" as const,
  },
  {
    num: "02",
    title: "Светодиодные светильники",
    desc: "Промышленные LED-решения для цехов, складов и производственных площадок. Собственное производство, Ростов-на-Дону.",
    chips: ["Экономия до 70%", "Степень защиты IP65", "Гарантия 3 года"],
    price: "от 8 200 ₽",
    img: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=1600&h=1000&fit=crop&q=80",
    align: "right" as const,
  },
];

function DirectionBlock({ d }: { d: (typeof directions)[number] }) {
  const left = d.align === "left";
  return (
    <motion.div
      initial={{ clipPath: "inset(6% 3% 6% 3% round 24px)", opacity: 0.4 }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0% round 0px)", opacity: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 1, ease }}
      className="relative h-[78vh] min-h-[560px] overflow-hidden"
    >
      <div className="absolute inset-0">
        <ParallaxImage src={d.img} alt={d.title} className="h-full" />
      </div>
      <div
        className={`absolute inset-0 ${
          left
            ? "bg-gradient-to-r from-[#09090b] via-[#09090b]/80 to-transparent"
            : "bg-gradient-to-l from-[#09090b] via-[#09090b]/80 to-transparent"
        }`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent" />

      <div className="relative z-10 mx-auto flex h-full max-w-[1400px] items-center px-6">
        <div className={`max-w-[560px] ${left ? "" : "ml-auto text-right"}`}>
          <span className="block font-extrabold tabular-nums leading-none text-red-600/25 text-[clamp(5rem,11vw,9rem)] select-none">
            {d.num}
          </span>
          <h2 className="mt-2 text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-[-0.04em] text-white leading-[0.9]">
            {d.title}
          </h2>
          <p className={`mt-5 text-zinc-400 text-sm md:text-base leading-relaxed max-w-[420px] ${left ? "" : "ml-auto"}`}>
            {d.desc}
          </p>
          <div className={`mt-6 flex flex-wrap gap-2.5 ${left ? "" : "justify-end"}`}>
            {d.chips.map((c) => (
              <span
                key={c}
                className="glass-pill rounded-full px-3.5 py-1.5 text-xs font-medium text-zinc-200"
              >
                {c}
              </span>
            ))}
          </div>
          <div className={`mt-8 flex items-center gap-6 ${left ? "" : "justify-end"}`}>
            <span className="text-2xl md:text-3xl font-extrabold text-red-500 tabular-nums">{d.price}</span>
            <MagneticButton
              href="/contacts"
              className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 font-semibold btn inline-block shadow-[0_8px_32px_-4px_rgba(220,38,38,0.5)] transition-colors"
            >
              Запросить цену
            </MagneticButton>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Directions() {
  return (
    <section id="catalog" className="py-16 md:py-24">
      <div className="mx-auto max-w-[1400px] px-6 mb-10 md:mb-14">
        <Reveal>
          <p className="text-red-500 text-[11px] font-semibold tracking-[0.22em] uppercase mb-3">Каталог</p>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-[-0.04em] text-white leading-[0.9]">
            Два направления<br />производства
          </h2>
        </Reveal>
      </div>
      <div className="flex flex-col gap-4 md:gap-6">
        {directions.map((d) => (
          <DirectionBlock key={d.num} d={d} />
        ))}
      </div>
    </section>
  );
}

/* ─── Популярные позиции ─── */
function Products() {
  const products = [
    { name: "ПРОТОН-ДЭИ ВДИ 200", category: "Инверторы", price: "от 18 500 ₽", img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=400&fit=crop&q=80" },
    { name: "LED-DEI-120", category: "Светильники", price: "от 8 200 ₽", img: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=400&h=400&fit=crop&q=80" },
    { name: "ЦЗН 159-426", category: "Центраторы", price: "от 24 000 ₽", img: "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?w=400&h=400&fit=crop&q=80" },
    { name: "МР-3 d3.0", category: "Электроды", price: "от 1 200 ₽", img: "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=400&h=400&fit=crop&q=80" },
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-[1400px] mx-auto">
        <Reveal>
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-red-500 text-[11px] font-semibold tracking-[0.22em] uppercase mb-3">Ассортимент</p>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-[-0.04em] text-white leading-[0.9]">
                Популярные<br />позиции
              </h2>
            </div>
            <a href="/contacts" className="hidden md:inline-flex items-center gap-1.5 text-zinc-500 hover:text-white text-sm transition-colors duration-200">
              Запросить прайс
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {products.map((p, i) => (
            <ProductCard key={i} product={p} index={i} />
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
      <MorphBlob className="w-[700px] h-[700px] bg-red-950 rounded-full morph-slow left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
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
