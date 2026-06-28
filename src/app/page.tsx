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

/* ─── Pinned Hero with curtain reveal ─── */
function PinnedHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const curtainY = useTransform(scrollYProgress, [0, 1], ["100%", "0%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.4], [0, -80]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <section ref={ref} className="relative h-[200vh]">
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        {/* Background image */}
        <motion.div className="absolute inset-0" style={{ scale: imgScale }}>
          <img src="https://picsum.photos/seed/dei-hero-heavy-industry/1920/1200" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#09090b]/70" />
        </motion.div>

        {/* Content */}
        <motion.div style={{ opacity: textOpacity, y: textY }} className="relative z-10 h-full flex items-end pb-20 md:pb-28">
          <div className="max-w-[1400px] mx-auto px-6 w-full">
            <div className="max-w-[640px]">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-[-0.05em] leading-[0.85] text-white mb-6">
                <ScrambleText text="DEI" className="text-red-600 block" />
                <span className="block mt-1">Оборудование</span>
              </h1>
              <p className="text-zinc-400 text-base md:text-lg leading-relaxed max-w-[420px] mb-8">
                Производим сварочные инверторы и светодиодные светильники в Ростове-на-Дону с 2006 года.
              </p>
              <div className="flex items-center gap-4">
                <MagneticButton href="#catalog" className="bg-red-600 hover:bg-red-500 text-white px-8 py-4 font-semibold btn inline-block shadow-[0_8px_32px_-6px_rgba(220,38,38,0.5)]">
                  Каталог
                </MagneticButton>
                <a href="/contacts" className="text-zinc-500 hover:text-white text-sm font-medium btn inline-flex items-center gap-2 transition-colors">
                  Контакты
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Dark curtain rising from bottom */}
        <motion.div style={{ y: curtainY }} className="absolute inset-0 z-20 bg-[#09090b]" />
      </div>
    </section>
  );
}

/* ─── Sticky-stack product cards ─── */
function StickyStackCatalog() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const items = [
    { title: "Сварочные инверторы", sub: "ПРОТОН-ДЭИ ВДИ 200, MIG/MAG, TIG, MMA", detail: "Собственная разработка. Аттестация НАКС. Для промышленности и строительства.", img: "https://picsum.photos/seed/dei-stack-weld/1400/900" },
    { title: "Светодиодные светильники", sub: "Собственное производство в Ростове-на-Дону", detail: "Промышленные LED-решения для цехов, складов, производственных площадок.", img: "https://picsum.photos/seed/dei-stack-led/1400/900" },
    { title: "Центраторы для труб", sub: "Внутренние и наружные звенные", detail: "Для монтажа трубопроводов любого диаметра. Поставка по РФ и СНГ.", img: "https://picsum.photos/seed/dei-stack-centr/1400/900" },
    { title: "Расходные материалы", sub: "Электроды, проволока, газовые смеси", detail: "Полный ассортимент расходников для сварочного производства.", img: "https://picsum.photos/seed/dei-stack-cons/1400/900" },
  ];

  useEffect(() => {
    if (reduce || !ref.current) return;
    const isMobile = window.innerWidth < 768;
    if (isMobile) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".stack-card");
      cards.forEach((card, i) => {
        if (i === cards.length - 1) return;
        ScrollTrigger.create({
          trigger: card,
          start: "top top",
          endTrigger: cards[cards.length - 1],
          end: "top top",
          pin: true,
          pinSpacing: false,
        });
        gsap.to(card, {
          scale: 0.92,
          opacity: 0.4,
          ease: "none",
          scrollTrigger: {
            trigger: cards[i + 1],
            start: "top bottom",
            end: "top top",
            scrub: true,
          },
        });
      });
    }, ref);
    return () => ctx.revert();
  }, [reduce]);

  return (
    <section id="catalog" ref={ref} className="relative">
      {items.map((item, i) => (
        <div key={i} className="stack-card sticky top-0 min-h-[100dvh] flex items-center justify-center overflow-hidden">
          <img src={item.img} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#09090b] via-[#09090b]/70 to-transparent" />
          <div className="relative z-10 max-w-[1400px] mx-auto px-6 w-full">
            <div className="max-w-[500px]">
              <span className="text-red-600 text-sm font-semibold tracking-wider uppercase block mb-3">{item.sub}</span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-[-0.04em] text-white leading-[0.9] mb-5">{item.title}</h2>
              <p className="text-zinc-400 text-base leading-relaxed max-w-[380px]">{item.detail}</p>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

export default function Home() {
  return (
    <>
      <PinnedHero />

      {/* Stats - dense strip */}
      <section className="py-8 bg-red-600">
        <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { val: "2006", label: "год основания" },
            { val: "НАКС", label: "аттестация" },
            { val: "РФ + СНГ", label: "поставки" },
            { val: "100%", label: "гарантия" },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 0.04}>
              <div className="text-center py-2">
                <p className="text-xl md:text-2xl font-extrabold text-white tabular-nums tracking-tight">{s.val}</p>
                <p className="text-[11px] text-red-200/70 uppercase tracking-wider mt-0.5">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <StickyStackCatalog />

      {/* Featured products */}
      <section className="py-16 px-6 bg-[#0c0c0f]">
        <div className="max-w-[1400px] mx-auto">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-[-0.04em] text-white mb-10">Популярные позиции</h2>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "ПРОТОН-ДЭИ ВДИ 200", category: "Инверторы", price: "от 18 500 ₽", img: "https://picsum.photos/seed/dei-f1/400/400" },
              { name: "LED-DEI-120", category: "Светильники", price: "от 8 200 ₽", img: "https://picsum.photos/seed/dei-f2/400/400" },
              { name: "ЦЗН 159-426", category: "Центраторы", price: "от 24 000 ₽", img: "https://picsum.photos/seed/dei-f3/400/400" },
              { name: "МР-3 d3.0", category: "Электроды", price: "от 1 200 ₽", img: "https://picsum.photos/seed/dei-f4/400/400" },
            ].map((p, i) => (
              <ProductCard key={i} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Strengths - 2col sticky text + scrolling images */}
      <section className="py-20 px-6">
        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-[0.7fr_1fr] gap-12 lg:gap-20">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Reveal>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-[-0.04em] text-white leading-[0.9] mb-5">
                Почему<br /><span className="text-red-600">DEI</span>
              </h2>
              <p className="text-zinc-500 text-sm leading-relaxed max-w-[340px] mb-8">
                Основатели компании контролировали качество разработки космических двигателей и спутниковых систем связи. Мы перенесли эту систему качества в гражданское производство.
              </p>
              <MagneticButton href="/about" className="text-red-500 hover:text-red-400 text-sm font-medium btn inline-flex items-center gap-2 transition-colors">
                О компании
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </MagneticButton>
            </Reveal>
          </div>

          <div className="space-y-6">
            {[
              { title: "Собственное производство", desc: "Полный цикл: от проектирования до поставки готового изделия. Ростов-на-Дону.", img: "https://picsum.photos/seed/dei-s1/700/400" },
              { title: "Аттестация НАКС", desc: "Сварочный инвертор ПРОТОН-ДЭИ ВДИ 200 прошёл аттестацию. Запатентованные технологии.", img: "https://picsum.photos/seed/dei-s2/700/400" },
              { title: "Комплексный подход", desc: "Выезд, расчёт, поставка, монтаж. Консультирование в процессе эксплуатации.", img: "https://picsum.photos/seed/dei-s3/700/400" },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="group">
                  <div className="overflow-hidden mb-4 h-[200px] md:h-[260px]">
                    <img src={s.img} alt={s.title} className="w-full h-full object-cover img-zoom" />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-100 mb-1.5 group-hover:text-red-500 transition-colors duration-200">{s.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed max-w-[480px]">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Fullbleed trust image */}
      <motion.section
        initial={{ clipPath: "inset(3% 1.5% 3% 1.5%)" }}
        whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 1, ease: easeOut }}
        className="relative h-[50vh] md:h-[70vh] overflow-hidden"
      >
        <ParallaxImage src="https://picsum.photos/seed/dei-trust-fullbleed/1920/800" alt="Производственная линия DEI" className="h-full" />
        <div className="absolute inset-0 bg-[#09090b]/40 flex items-center justify-center">
          <Reveal>
            <p className="text-white text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-[-0.04em] text-center px-6 max-w-[700px] leading-[0.9]">
              Качество оборонной промышленности
            </p>
          </Reveal>
        </div>
      </motion.section>

      {/* CTA */}
      <section className="py-20 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-950/8 to-transparent pointer-events-none" />
        <div className="max-w-[480px] mx-auto text-center relative">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-[-0.04em] text-white mb-4">Нужна консультация?</h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="text-zinc-500 mb-8 text-sm leading-relaxed">
              Выезд специалиста, расчёт проекта, подбор оборудования.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <MagneticButton href="tel:+79885807630" className="inline-block bg-red-600 hover:bg-red-500 text-white px-10 py-4 text-lg font-bold btn shadow-[0_10px_40px_-4px_rgba(220,38,38,0.5)]">
              +7 (988) 580-76-30
            </MagneticButton>
          </Reveal>
        </div>
      </section>
    </>
  );
}
