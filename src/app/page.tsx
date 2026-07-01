"use client";

import Reveal from "@/components/Reveal";
import ParallaxImage from "@/components/ParallaxImage";
import MagneticButton from "@/components/MagneticButton";
import ScrambleText from "@/components/ScrambleText";
import ProductCard from "@/components/ProductCard";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ease = [0.16, 1, 0.3, 1] as const;

function MorphBlob({ className = "" }: { className?: string }) {
  return <div className={`pointer-events-none absolute blur-[80px] opacity-[0.18] ${className}`} />;
}

/* ─── Hero ─── */
function PinnedHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const curtainY   = useTransform(scrollYProgress, [0, 1],   ["100%", "0%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const textY       = useTransform(scrollYProgress, [0, 0.4], [0, -60]);
  const imgScale    = useTransform(scrollYProgress, [0, 1],   [1, 1.08]);

  return (
    <section ref={ref} className="relative h-[200vh]">
      <div className="sticky top-0 h-[100dvh] overflow-hidden">

        {/* Background */}
        <motion.div className="absolute inset-0" style={{ scale: imgScale }}>
          <img
            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&h=1200&fit=crop&q=80"
            alt="" className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#09090b]/50 via-[#09090b]/40 to-[#09090b]/95" />
        </motion.div>

        {/* Morphing blobs */}
        <MorphBlob className="w-[700px] h-[700px] bg-red-800 rounded-full morph-slow -left-60 -bottom-60" />
        <MorphBlob className="w-[400px] h-[400px] bg-red-950 rounded-full morph right-10 top-10" />

        {/* Content */}
        <motion.div style={{ opacity: textOpacity, y: textY }} className="relative z-10 h-full flex items-end pb-16 md:pb-24">
          <div className="max-w-[1400px] mx-auto px-6 w-full">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">

              {/* Left: headline */}
              <div className="max-w-[680px]">
                <h1 className="text-[clamp(4rem,10vw,9rem)] font-extrabold tracking-[-0.055em] leading-[0.82] text-white mb-6">
                  <ScrambleText text="DEI" className="text-red-500 block" />
                  <span className="block">Оборудо-<br className="sm:hidden" />вание</span>
                </h1>

                <p className="text-zinc-500 text-base md:text-lg leading-relaxed max-w-[440px] mb-8">
                  Производим сварочные инверторы и светодиодные светильники.
                  Аттестация НАКС. Поставки по РФ и СНГ.
                </p>

                <div className="flex items-center gap-4">
                  <MagneticButton
                    href="#catalog"
                    className="bg-red-600 hover:bg-red-500 text-white px-7 py-3.5 font-semibold btn inline-block shadow-[0_8px_32px_-4px_rgba(220,38,38,0.5)] transition-colors"
                  >
                    Каталог
                  </MagneticButton>
                  <a href="/contacts" className="text-zinc-500 hover:text-white text-sm font-medium inline-flex items-center gap-1.5 transition-colors duration-200">
                    Контакты
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </a>
                </div>
              </div>

              {/* Right: glass contact card */}
              <div className="glass-card rounded-2xl p-6 max-w-[260px] shrink-0 lg:mb-0">
                <p className="text-[11px] text-zinc-600 uppercase tracking-widest mb-3">Связаться</p>
                <a href="tel:+79885807630" className="text-white text-lg font-bold block mb-1 hover:text-red-400 transition-colors duration-200 leading-tight">
                  +7 (988) 580-76-30
                </a>
                <p className="text-zinc-600 text-xs mb-5">Пн–Пт: 9:00–18:00</p>
                <a
                  href="/contacts"
                  className="w-full glass-inner rounded-xl px-4 py-2.5 text-[13px] text-zinc-400 hover:text-white font-medium text-center block transition-colors duration-200"
                >
                  Оставить заявку
                </a>
              </div>

            </div>
          </div>
        </motion.div>

        {/* Curtain */}
        <motion.div style={{ y: curtainY }} className="absolute inset-0 z-20 bg-[#09090b]" />
      </div>
    </section>
  );
}

/* ─── Glass stats ─── */
function GlassStats() {
  const stats = [
    { val: "2006", label: "год основания", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
    { val: "18+", label: "лет опыта", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
    { val: "НАКС", label: "аттестация", icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" },
    { val: "РФ·СНГ", label: "поставки", icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  ];

  return (
    <section className="py-10 px-6 relative">
      <div className="absolute inset-0 border-y border-white/[0.04] pointer-events-none" />
      <div className="max-w-[1400px] mx-auto">
        <Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {stats.map((s, i) => (
              <div key={i} className="glass-card rounded-2xl p-5 flex flex-col gap-3 group hover-lift cursor-default">
                <div className="w-9 h-9 rounded-xl glass-red flex items-center justify-center">
                  <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-extrabold text-white tracking-tight tabular-nums group-hover:text-red-400 transition-colors duration-300">{s.val}</p>
                  <p className="text-[11px] text-zinc-600 uppercase tracking-wider mt-0.5">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── Sticky-stack catalog ─── */
function StickyStackCatalog() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const items = [
    { num: "01", title: "Сварочные инверторы", sub: "ПРОТОН-ДЭИ ВДИ 200 · MIG/MAG · TIG · MMA", detail: "Собственная разработка. Аттестация НАКС. Для промышленности и строительства.", img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1400&h=900&fit=crop&q=80" },
    { num: "02", title: "Светодиодные светильники", sub: "Собственное производство · Ростов-на-Дону", detail: "Промышленные LED-решения для цехов, складов, производственных площадок.", img: "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=1400&h=900&fit=crop&q=80" },
    { num: "03", title: "Центраторы для труб", sub: "Внутренние и наружные звенные", detail: "Для монтажа трубопроводов любого диаметра. Поставка по РФ и СНГ.", img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1400&h=900&fit=crop&q=80" },
    { num: "04", title: "Расходные материалы", sub: "Электроды · Проволока · Газовые смеси", detail: "Полный ассортимент расходников для сварочного производства.", img: "https://images.unsplash.com/photo-1537462715879-360b4b8d0d0c?w=1400&h=900&fit=crop&q=80" },
  ];

  useEffect(() => {
    if (reduce || !ref.current) return;
    if (window.innerWidth < 768) return;
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".stack-card");
      cards.forEach((card, i) => {
        if (i === cards.length - 1) return;
        ScrollTrigger.create({ trigger: card, start: "top top", endTrigger: cards[cards.length - 1], end: "top top", pin: true, pinSpacing: false });
        gsap.to(card, {
          scale: 0.93, opacity: 0.25, ease: "none",
          scrollTrigger: { trigger: cards[i + 1], start: "top bottom", end: "top top", scrub: true },
        });
      });
    }, ref);
    return () => ctx.revert();
  }, [reduce]);

  return (
    <section id="catalog" ref={ref} className="relative">
      {items.map((item, i) => (
        <div key={i} className="stack-card sticky top-0 min-h-[100dvh] flex items-end overflow-hidden pb-16 md:pb-20">
          <img src={item.img} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#09090b]/98 via-[#09090b]/65 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090b]/50 to-transparent" />

          <div className="relative z-10 max-w-[1400px] mx-auto px-6 w-full">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
              <div className="max-w-[560px]">
                <span className="text-[clamp(5rem,12vw,10rem)] font-extrabold text-white/[0.04] leading-none block mb-2 tabular-nums select-none">{item.num}</span>
                <div className="glass-pill inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5">
                  <span className="text-[11px] text-red-400 font-medium tracking-wide">{item.sub}</span>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-[-0.04em] text-white leading-[0.88] mb-5">
                  {item.title}
                </h2>
                <p className="text-zinc-500 text-sm md:text-base leading-relaxed max-w-[400px]">{item.detail}</p>
              </div>

              <div className="glass-card rounded-2xl p-5 shrink-0">
                <p className="text-[11px] text-zinc-600 uppercase tracking-widest mb-3">Заинтересованы?</p>
                <a href="/contacts" className="text-sm text-zinc-300 hover:text-white transition-colors duration-200 inline-flex items-center gap-2 font-medium">
                  Запросить цену
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

/* ─── Products ─── */
function Products() {
  const products = [
    { name: "ПРОТОН-ДЭИ ВДИ 200", category: "Инверторы", price: "от 18 500 ₽", img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=400&fit=crop&q=80" },
    { name: "LED-DEI-120", category: "Светильники", price: "от 8 200 ₽", img: "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=400&h=400&fit=crop&q=80" },
    { name: "ЦЗН 159-426", category: "Центраторы", price: "от 24 000 ₽", img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop&q=80" },
    { name: "МР-3 d3.0", category: "Электроды", price: "от 1 200 ₽", img: "https://images.unsplash.com/photo-1537462715879-360b4b8d0d0c?w=400&h=400&fit=crop&q=80" },
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
            <a href="/contacts" className="hidden md:inline-flex items-center gap-1.5 text-zinc-600 hover:text-zinc-300 text-sm transition-colors duration-200">
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

/* ─── Why DEI ─── */
function WhyDEI() {
  const advantages = [
    {
      title: "Собственное производство",
      desc: "Полный цикл: от проектирования до готового изделия. Ростов-на-Дону.",
      icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
    },
    {
      title: "Аттестация НАКС",
      desc: "Сварочный инвертор ПРОТОН-ДЭИ ВДИ 200. Запатентованные технологии.",
      icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
    },
    {
      title: "Комплексный подход",
      desc: "Выезд к заказчику, расчёт, поставка, монтаж и консультирование при эксплуатации.",
      icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
    },
  ];

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <MorphBlob className="w-[600px] h-[600px] bg-red-900 rounded-full morph-slow -right-40 top-1/2 -translate-y-1/2" />

      <div className="max-w-[1400px] mx-auto relative">
        <Reveal>
          <div className="glass-card rounded-3xl p-8 md:p-14">
            <div className="grid lg:grid-cols-[1fr_1.3fr] gap-12 items-start">

              {/* Left */}
              <div className="lg:sticky lg:top-28 lg:self-start">
                <p className="text-red-500 text-[11px] font-semibold tracking-[0.22em] uppercase mb-4">Почему DEI</p>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-[-0.045em] text-white leading-[0.88] mb-6">
                  Качество<br /><span className="text-red-500">оборонной</span><br />отрасли
                </h2>
                <p className="text-zinc-500 text-sm leading-relaxed max-w-[320px] mb-8">
                  Основатели контролировали качество разработки космических двигателей. Эту систему мы перенесли в гражданское производство.
                </p>
                <MagneticButton href="/about" className="inline-flex items-center gap-2 text-sm text-red-500 hover:text-red-400 font-medium transition-colors duration-200">
                  О компании
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </MagneticButton>
              </div>

              {/* Right: advantage cards */}
              <div className="grid gap-3">
                {advantages.map((a, i) => (
                  <Reveal key={i} delay={i * 0.08}>
                    <div className="glass-inner rounded-2xl p-5 flex gap-4 items-start group hover:border-red-900/30 transition-all duration-500 hover-lift">
                      <div className="w-10 h-10 rounded-xl glass-red flex items-center justify-center shrink-0 group-hover:bg-red-950/50 transition-colors duration-300">
                        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d={a.icon} />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-zinc-200 mb-1.5 group-hover:text-white transition-colors duration-200">{a.title}</h3>
                        <p className="text-xs text-zinc-600 leading-relaxed">{a.desc}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── Full-bleed trust image ─── */
function TrustImage() {
  return (
    <motion.section
      initial={{ clipPath: "inset(3% 1.5% 3% 1.5% round 20px)" }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0% round 0px)" }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 1.2, ease: ease }}
      className="relative h-[50vh] md:h-[65vh] overflow-hidden"
    >
      <ParallaxImage
        src="https://images.unsplash.com/photo-1487537708980-c1dc6b9b7b7e?w=1920&h=800&fit=crop&q=80"
        alt="Производственная линия ДонЭлектроИнтел"
        className="h-full"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#09090b]/85 via-[#09090b]/30 to-transparent flex items-center">
        <Reveal>
          <p className="text-white text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-[-0.045em] px-8 md:px-16 max-w-[800px] leading-[0.88]">
            Качество<br /><span className="text-red-500">оборонной</span><br />промышленности
          </p>
        </Reveal>
      </div>
    </motion.section>
  );
}

/* ─── CTA ─── */
function CTA() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <MorphBlob className="w-[700px] h-[700px] bg-red-950 rounded-full morph-slow left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />

      <div className="max-w-[600px] mx-auto relative">
        <Reveal>
          <div className="glass-card rounded-3xl p-10 md:p-14 text-center">
            {/* Icon */}
            <div className="w-14 h-14 glass-red rounded-2xl flex items-center justify-center mx-auto mb-8">
              <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
            </div>

            <h2 className="text-3xl md:text-5xl font-extrabold tracking-[-0.045em] text-white mb-4 leading-[0.9]">
              Нужна<br />консультация?
            </h2>
            <p className="text-zinc-500 mb-8 text-sm leading-relaxed max-w-[340px] mx-auto">
              Выезд специалиста, расчёт проекта, подбор оборудования — без обязательств.
            </p>

            <MagneticButton
              href="tel:+79885807630"
              className="inline-block bg-red-600 hover:bg-red-500 text-white px-10 py-4 text-lg font-bold btn transition-colors shadow-[0_12px_40px_-6px_rgba(220,38,38,0.45)]"
            >
              +7 (988) 580-76-30
            </MagneticButton>

            <p className="text-zinc-700 text-xs mt-5">Пн–Пт: 9:00–18:00 · Сб–Вс: по записи</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <PinnedHero />
      <GlassStats />
      <StickyStackCatalog />
      <Products />
      <WhyDEI />
      <TrustImage />
      <CTA />
    </>
  );
}
