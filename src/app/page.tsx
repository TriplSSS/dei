"use client";

import Reveal from "@/components/Reveal";
import ParallaxImage from "@/components/ParallaxImage";
import MagneticButton from "@/components/MagneticButton";
import ScrambleText from "@/components/ScrambleText";
import ProductCard from "@/components/ProductCard";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

const easeOut = [0.16, 1, 0.3, 1] as const;

const products = [
  { title: "Сварочное оборудование", desc: "Инверторы ПРОТОН-ДЭИ, MIG/MAG, TIG, MMA", img: "https://picsum.photos/seed/dei-welder3/700/500", span: "md:col-span-2" },
  { title: "Светодиодные светильники", desc: "Собственное производство LED", img: "https://picsum.photos/seed/dei-ledpanel/600/500", span: "" },
  { title: "Центраторы для труб", desc: "Внутренние и наружные звенные", img: "https://picsum.photos/seed/dei-pipe-center/600/500", span: "" },
  { title: "Расходные материалы", desc: "Электроды, проволока, газовые смеси", img: "https://picsum.photos/seed/dei-consumable3/700/500", span: "md:col-span-2" },
];

const strengths = [
  { num: "01", title: "Собственное производство", desc: "Разрабатываем и производим в Ростове-на-Дону." },
  { num: "02", title: "Запатентованные решения", desc: "Инвертор ПРОТОН-ДЭИ аттестован в НАКС." },
  { num: "03", title: "Комплексный подход", desc: "Выезд, расчёт, поставка, монтаж, поддержка." },
  { num: "04", title: "Оборонная школа качества", desc: "Система качества космической промышленности." },
];

function HeroParallax() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-[100dvh] flex items-end overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y }}>
        <img
          src="https://picsum.photos/seed/dei-hero-dark-industrial/1920/1080"
          alt="Промышленное оборудование DEI"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f11] via-[#0f0f11]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f11]/80 to-transparent" />
      </motion.div>

      <motion.div style={{ opacity }} className="relative z-10 max-w-[1400px] mx-auto px-6 pb-16 md:pb-24 w-full">
        <Reveal direction="left">
          <p className="text-red-500 text-sm font-medium tracking-wider uppercase mb-4">С 2006 года в Ростове-на-Дону</p>
        </Reveal>
        <Reveal direction="left" delay={0.1}>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[0.95] mb-6 text-white max-w-[700px]">
            <ScrambleText text="Оборудование" className="block" />
            <span className="text-red-500">для производства</span>
          </h1>
        </Reveal>
        <Reveal direction="left" delay={0.2}>
          <p className="text-zinc-400 text-lg leading-relaxed max-w-[480px] mb-8">
            Сварочные инверторы, светодиодные светильники, центраторы для труб. Собственное производство и поставки по РФ и СНГ.
          </p>
        </Reveal>
        <Reveal direction="left" delay={0.3}>
          <div className="flex flex-wrap gap-3">
            <MagneticButton href="#catalog" className="bg-red-600 hover:bg-red-500 text-white px-7 py-3.5 rounded-lg font-medium btn-press inline-block shadow-[0_6px_24px_-4px_rgba(220,38,38,0.4)]">
              Каталог
            </MagneticButton>
            <a href="/contacts" className="border border-zinc-600 hover:border-zinc-400 text-zinc-300 px-7 py-3.5 rounded-lg font-medium btn-press hover:bg-white/5 inline-block backdrop-blur-sm">
              Связаться
            </a>
          </div>
        </Reveal>
      </motion.div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <HeroParallax />

      {/* CAPABILITIES STRIP */}
      <section className="py-5 bg-red-600 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap gap-8 text-white/90 text-sm font-medium tracking-wide uppercase">
          {[...Array(2)].map((_, r) => (
            <div key={r} className="flex gap-8 shrink-0">
              {["Сварочные инверторы", "LED-светильники", "Центраторы", "Электроды", "Расходники", "Монтаж", "Гарантия НАКС", "Доставка РФ и СНГ"].map((t, i) => (
                <span key={i} className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                  {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="py-12 bg-zinc-900/50 border-b border-zinc-800/30">
        <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: "18", suffix: " лет", label: "на рынке" },
            { value: "РФ", suffix: " и СНГ", label: "география" },
            { value: "НАКС", suffix: "", label: "аттестация" },
            { value: "100", suffix: "%", label: "гарантия" },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <div className="text-center py-4">
                <p className="text-3xl md:text-4xl font-bold text-white tabular-nums mb-1">
                  {s.value}<span className="text-red-500">{s.suffix}</span>
                </p>
                <p className="text-xs text-zinc-500 uppercase tracking-wider">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CATALOG */}
      <section id="catalog" className="py-16 px-6">
        <div className="max-w-[1400px] mx-auto">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-10 text-white">Продукция</h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-3">
            {products.map((p, i) => (
              <Reveal key={i} delay={i * 0.06} className={p.span}>
                <div className="group relative rounded-xl overflow-hidden cursor-default h-[240px] md:h-[300px] hover-lift border border-zinc-800/30">
                  <img src={p.img} alt={p.title} className="w-full h-full object-cover img-zoom" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-5">
                    <h3 className="text-white text-lg font-semibold mb-0.5">{p.title}</h3>
                    <p className="text-zinc-400 text-sm opacity-0 translate-y-2 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 group-hover:translate-y-0">{p.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-16 px-6 bg-zinc-900/40 border-y border-zinc-800/30">
        <div className="max-w-[1400px] mx-auto">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-10 text-white">Популярные товары</h2>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { name: "ПРОТОН-ДЭИ ВДИ 200", category: "Сварочные инверторы", price: "от 18 500 ₽", img: "https://picsum.photos/seed/dei-proton200/400/400" },
              { name: "LED-DEI-120", category: "Светильники", price: "от 8 200 ₽", img: "https://picsum.photos/seed/dei-led120/400/400" },
              { name: "ЦЗН 159-426", category: "Центраторы", price: "от 24 000 ₽", img: "https://picsum.photos/seed/dei-centr159/400/400" },
              { name: "МР-3 d3.0", category: "Электроды", price: "от 1 200 ₽", img: "https://picsum.photos/seed/dei-electrode3/400/400" },
            ].map((p, i) => (
              <ProductCard key={i} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* STRENGTHS */}
      <section id="strengths" className="py-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-red-600/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-[1400px] mx-auto relative">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-12 text-white">
              Почему <span className="text-red-500">DEI</span>
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-0">
            {strengths.map((s, i) => (
              <Reveal key={i} delay={i * 0.05} direction={i % 2 === 0 ? "left" : "right"}>
                <div className="group py-6 border-b border-zinc-800/40 last:border-b-0">
                  <div className="flex items-start gap-4">
                    <span className="text-4xl font-bold text-red-600/15 group-hover:text-red-600/30 transition-colors duration-500 leading-none select-none tabular-nums">{s.num}</span>
                    <div className="pt-1">
                      <h3 className="font-semibold mb-1.5 text-zinc-200 group-hover:text-red-400 transition-colors duration-200">{s.title}</h3>
                      <p className="text-zinc-500 text-sm leading-relaxed max-w-[36ch]">{s.desc}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST BAND */}
      <motion.section
        initial={{ clipPath: "inset(4% 2% 4% 2% round 8px)" }}
        whileInView={{ clipPath: "inset(0% 0% 0% 0% round 0px)" }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: easeOut }}
        className="relative h-[300px] md:h-[400px] overflow-hidden"
      >
        <ParallaxImage src="https://picsum.photos/seed/dei-production-line/1800/600" alt="Производственная линия" className="h-full" />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <Reveal>
            <p className="text-white text-2xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-center px-6 max-w-[600px] leading-tight">
              Производим и поставляем по всей России
            </p>
          </Reveal>
        </div>
      </motion.section>

      {/* CTA */}
      <section className="py-20 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-950/5 to-transparent pointer-events-none" />
        <div className="max-w-[500px] mx-auto text-center relative">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4 text-white">Нужна консультация?</h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="text-zinc-500 mb-8 leading-relaxed">
              Выезд специалиста, расчёт проекта, подбор оборудования.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <MagneticButton
              href="tel:+79885807630"
              className="inline-block bg-red-600 hover:bg-red-500 text-white px-9 py-4 rounded-lg text-lg font-semibold btn-press shadow-[0_8px_30px_-4px_rgba(220,38,38,0.4)]"
            >
              +7 (988) 580-76-30
            </MagneticButton>
          </Reveal>
        </div>
      </section>
    </>
  );
}
