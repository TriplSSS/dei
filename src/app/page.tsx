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

const easeOut = [0.16, 1, 0.3, 1] as const;

/* ─── Hero with diagonal split ─── */
function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.6], [0, -60]);

  return (
    <section ref={ref} className="relative min-h-[100dvh] overflow-hidden bg-[#0a0a0c]">
      {/* Background image with diagonal mask */}
      <motion.div className="absolute inset-0" style={{ y: imgY }}>
        <img
          src="https://picsum.photos/seed/dei-hero-industrial-dark/1920/1200"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#0a0a0c]/40" />
      </motion.div>

      {/* Diagonal overlay - left dark, right image */}
      <div className="absolute inset-0 bg-[#0a0a0c] [clip-path:polygon(0_0,65%_0,45%_100%,0_100%)] md:[clip-path:polygon(0_0,55%_0,40%_100%,0_100%)] z-10" />

      {/* Red accent line on diagonal */}
      <div className="absolute inset-0 z-20 pointer-events-none hidden md:block">
        <div className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-red-600/0 via-red-600 to-red-600/0"
          style={{ left: "calc(55% - 1px)", transform: "skewX(-15deg)" }} />
      </div>

      {/* Content */}
      <motion.div style={{ opacity: contentOpacity, y: contentY }} className="relative z-20 min-h-[100dvh] flex items-center">
        <div className="max-w-[1400px] mx-auto px-6 w-full">
          <div className="max-w-[520px]">
            <Reveal direction="left">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-[2px] bg-red-500" />
                <span className="text-red-500 text-xs font-medium tracking-[0.2em] uppercase">С 2006 года</span>
              </div>
            </Reveal>

            <Reveal direction="left" delay={0.1}>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-[-0.04em] leading-[0.9] mb-8 text-white">
                <ScrambleText text="DEI" className="block text-red-500" />
                <span className="block mt-2">Оборудование</span>
                <span className="block text-zinc-500 text-3xl md:text-4xl lg:text-5xl mt-3 tracking-[-0.03em]">для производства</span>
              </h1>
            </Reveal>

            <Reveal direction="left" delay={0.2}>
              <p className="text-zinc-500 text-base leading-relaxed max-w-[380px] mb-10">
                Сварочные инверторы, светодиодные светильники, центраторы. Собственное производство в Ростове-на-Дону.
              </p>
            </Reveal>

            <Reveal direction="left" delay={0.3}>
              <div className="flex items-center gap-4">
                <MagneticButton href="#catalog" className="bg-red-600 hover:bg-red-500 text-white px-8 py-4 rounded-lg font-medium btn-press inline-block shadow-[0_8px_32px_-4px_rgba(220,38,38,0.4)]">
                  Каталог
                </MagneticButton>
                <a href="/contacts" className="text-zinc-400 hover:text-white text-sm font-medium btn-press inline-flex items-center gap-2 transition-colors duration-200">
                  Связаться
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ─── Horizontal scroll catalog ─── */
function CatalogScroll() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const products = [
    { title: "Сварочные инверторы", desc: "ПРОТОН-ДЭИ ВДИ 200, MIG/MAG, TIG, MMA. Аттестация НАКС.", img: "https://picsum.photos/seed/dei-cat-weld/800/600" },
    { title: "LED-светильники", desc: "Собственное производство. Промышленные решения для цехов и складов.", img: "https://picsum.photos/seed/dei-cat-led/800/600" },
    { title: "Центраторы", desc: "Внутренние и наружные звенные центраторы для трубопроводов.", img: "https://picsum.photos/seed/dei-cat-centr/800/600" },
    { title: "Расходные материалы", desc: "Электроды, сварочная проволока, газовые смеси, сопла.", img: "https://picsum.photos/seed/dei-cat-cons/800/600" },
  ];

  useEffect(() => {
    if (reduce || !wrapRef.current || !trackRef.current) return;
    const isMobile = window.innerWidth < 768;
    if (isMobile) return;

    const ctx = gsap.context(() => {
      const distance = trackRef.current!.scrollWidth - window.innerWidth;
      gsap.to(trackRef.current, {
        x: -distance,
        ease: "none",
        scrollTrigger: {
          trigger: wrapRef.current,
          start: "top top",
          end: () => `+=${distance}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    }, wrapRef);
    return () => ctx.revert();
  }, [reduce]);

  return (
    <section id="catalog" ref={wrapRef} className="relative overflow-hidden">
      <div ref={trackRef} className="flex md:flex-nowrap flex-wrap md:h-[100dvh] items-stretch">
        {/* Title card */}
        <div className="w-full md:w-[40vw] md:min-w-[40vw] flex items-center justify-center p-8 md:p-16 bg-[#0a0a0c] shrink-0">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[2px] bg-red-500" />
              <span className="text-red-500 text-xs font-medium tracking-[0.2em] uppercase">Продукция</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.04em] text-white leading-[0.95] mb-4">
              Каталог<br /><span className="text-zinc-600">оборудования</span>
            </h2>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-[300px]">
              Собственное производство и поставка промышленного оборудования с 2006 года.
            </p>
          </div>
        </div>

        {/* Product panels */}
        {products.map((p, i) => (
          <div key={i} className="w-full md:w-[50vw] md:min-w-[50vw] relative group shrink-0 h-[50vh] md:h-auto">
            <img src={p.img} alt={p.title} className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 md:p-10">
              <span className="text-red-500 text-xs font-medium tracking-[0.15em] uppercase block mb-2">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="text-white text-2xl md:text-3xl font-bold tracking-tight mb-2">{p.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-[320px]">{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />

      {/* Stats strip */}
      <section className="py-10 bg-[#0a0a0c] border-y border-zinc-800/30">
        <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: "18", unit: "лет", label: "на рынке" },
            { value: "НАКС", unit: "", label: "аттестация" },
            { value: "РФ", unit: "+СНГ", label: "поставки" },
            { value: "100", unit: "%", label: "гарантия" },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 0.04}>
              <div className="text-center py-3 border border-zinc-800/30 rounded-lg bg-zinc-900/20">
                <p className="text-2xl md:text-3xl font-bold text-white tabular-nums">
                  <ScrambleText text={s.value} /><span className="text-red-500 text-lg md:text-xl">{s.unit}</span>
                </p>
                <p className="text-[11px] text-zinc-600 uppercase tracking-wider mt-1">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <CatalogScroll />

      {/* Featured products */}
      <section className="py-16 px-6 bg-zinc-900/30">
        <div className="max-w-[1400px] mx-auto">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.04em] mb-10 text-white">Популярные позиции</h2>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "ПРОТОН-ДЭИ ВДИ 200", category: "Инверторы", price: "от 18 500 ₽", img: "https://picsum.photos/seed/dei-p1/400/400" },
              { name: "LED-DEI-120", category: "Светильники", price: "от 8 200 ₽", img: "https://picsum.photos/seed/dei-p2/400/400" },
              { name: "ЦЗН 159-426", category: "Центраторы", price: "от 24 000 ₽", img: "https://picsum.photos/seed/dei-p3/400/400" },
              { name: "МР-3 d3.0", category: "Электроды", price: "от 1 200 ₽", img: "https://picsum.photos/seed/dei-p4/400/400" },
            ].map((p, i) => (
              <ProductCard key={i} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Strengths - sticky left, scrolling right */}
      <section className="py-20 px-6">
        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-[0.8fr_1fr] gap-12 lg:gap-20">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Reveal>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-[2px] bg-red-500" />
                <span className="text-red-500 text-xs font-medium tracking-[0.2em] uppercase">Преимущества</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.04em] text-white leading-[0.95] mb-4">
                Почему<br /><span className="text-red-500">DEI</span>
              </h2>
              <p className="text-zinc-500 text-sm leading-relaxed max-w-[320px]">
                Основатели компании контролировали качество космических двигателей и спутниковых систем связи.
              </p>
            </Reveal>
          </div>

          <div>
            {[
              { title: "Собственное производство", desc: "Светодиодные светильники и сварочные инверторы разрабатываем и производим в Ростове-на-Дону. Полный цикл: от проектирования до поставки.", img: "https://picsum.photos/seed/dei-str1/600/300" },
              { title: "Аттестация НАКС", desc: "Сварочный инвертор ПРОТОН-ДЭИ ВДИ 200 прошёл аттестацию. Собственные запатентованные конструктивные решения и технологии.", img: "https://picsum.photos/seed/dei-str2/600/300" },
              { title: "Комплексный подход", desc: "Выезд к заказчику для разбора объекта, расчёт и рекомендации, поставка, монтаж, консультирование в процессе эксплуатации.", img: "https://picsum.photos/seed/dei-str3/600/300" },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="mb-8 last:mb-0 group">
                  <div className="rounded-xl overflow-hidden mb-4 h-[180px] md:h-[220px] border border-zinc-800/30">
                    <img src={s.img} alt={s.title} className="w-full h-full object-cover img-zoom" />
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-200 mb-2 group-hover:text-red-400 transition-colors duration-200">{s.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Full-bleed image quote */}
      <motion.section
        initial={{ clipPath: "inset(4% 2% 4% 2% round 8px)" }}
        whileInView={{ clipPath: "inset(0% 0% 0% 0% round 0px)" }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: easeOut }}
        className="relative h-[350px] md:h-[450px] overflow-hidden"
      >
        <ParallaxImage src="https://picsum.photos/seed/dei-fullbleed-factory/1800/600" alt="Производство" className="h-full" />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <Reveal>
            <p className="text-white text-2xl md:text-4xl lg:text-5xl font-bold tracking-[-0.04em] text-center px-6 max-w-[600px] leading-[1.05]">
              Качество оборонной промышленности в каждом изделии
            </p>
          </Reveal>
        </div>
      </motion.section>

      {/* CTA */}
      <section className="py-20 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-950/5 to-transparent pointer-events-none" />
        <div className="max-w-[480px] mx-auto text-center relative">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.04em] mb-4 text-white">Нужна консультация?</h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="text-zinc-500 mb-8 text-sm leading-relaxed">
              Выезд специалиста, расчёт проекта, подбор оборудования. Работаем с юрлицами и физлицами.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <MagneticButton
              href="tel:+79885807630"
              className="inline-block bg-red-600 hover:bg-red-500 text-white px-10 py-4 rounded-lg text-lg font-semibold btn-press shadow-[0_10px_40px_-4px_rgba(220,38,38,0.45)]"
            >
              +7 (988) 580-76-30
            </MagneticButton>
          </Reveal>
        </div>
      </section>
    </>
  );
}
