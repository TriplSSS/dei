"use client";

import Reveal from "@/components/Reveal";
import ParallaxImage from "@/components/ParallaxImage";
import MagneticButton from "@/components/MagneticButton";
import ScrambleText from "@/components/ScrambleText";
import ProductCard from "@/components/ProductCard";
import { motion } from "motion/react";

const easeOut = [0.16, 1, 0.3, 1] as const;
const easeOutQuint = [0.22, 1, 0.36, 1] as const;

const products = [
  { title: "Сварочное оборудование", desc: "Инверторы ПРОТОН-ДЭИ, аппараты MIG/MAG, TIG, MMA", img: "https://picsum.photos/seed/dei-welder3/700/500", span: "md:col-span-2" },
  { title: "Светодиодные светильники", desc: "Собственное производство, промышленные LED-решения", img: "https://picsum.photos/seed/dei-ledpanel/600/500", span: "" },
  { title: "Центраторы для труб", desc: "Внутренние и наружные звенные центраторы", img: "https://picsum.photos/seed/dei-pipe-center/600/500", span: "" },
  { title: "Расходные материалы", desc: "Электроды, проволока, газовые смеси", img: "https://picsum.photos/seed/dei-consumable3/700/500", span: "md:col-span-2" },
];

const strengths = [
  { num: "01", title: "Собственное производство", desc: "Светодиодные светильники и сварочное оборудование разрабатываем и производим в Ростове-на-Дону." },
  { num: "02", title: "Запатентованные решения", desc: "Собственные конструктивные решения и технологии. Инвертор ПРОТОН-ДЭИ аттестован в НАКС." },
  { num: "03", title: "Комплексный подход", desc: "Выезд к заказчику, расчёт, поставка, монтаж и консультирование в процессе эксплуатации." },
  { num: "04", title: "Военная школа качества", desc: "Основатели - инженеры оборонной промышленности. Система качества на уровне космических технологий." },
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="min-h-[100dvh] flex items-center pt-16 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-20 items-center w-full">
          <div className="py-12 lg:py-0">
            <Reveal direction="left">
              <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold tracking-tighter leading-[1.06] mb-6" style={{ textWrap: "balance" as never }}>
                <ScrambleText text="Оборудование" className="block" />
                <span className="text-red-600 block mt-1">для производства</span>
              </h1>
            </Reveal>
            <Reveal direction="left" delay={0.12}>
              <p className="text-zinc-500 text-lg leading-relaxed max-w-[440px] mb-8">
                Производим сварочные инверторы и светодиодные светильники. Поставляем по России и СНГ с 2006 года.
              </p>
            </Reveal>
            <Reveal direction="left" delay={0.22}>
              <div className="flex flex-wrap gap-3">
                <MagneticButton href="#catalog" className="bg-red-600 hover:bg-red-700 text-white px-7 py-3.5 rounded-lg font-medium btn-press inline-block shadow-[0_6px_24px_-4px_rgba(220,38,38,0.3)] hover:shadow-[0_10px_32px_-4px_rgba(220,38,38,0.4)]">
                  Каталог
                </MagneticButton>
                <a href="/contacts" className="border border-zinc-200 hover:border-zinc-300 text-zinc-700 px-7 py-3.5 rounded-lg font-medium btn-press hover:bg-zinc-50 inline-block">
                  Связаться
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal direction="scale" delay={0.1} className="hidden lg:block">
            <div className="relative">
              <div className="rounded-2xl overflow-hidden">
                <ParallaxImage src="https://picsum.photos/seed/dei-hero-factory2/900/680" alt="Производство оборудования" className="aspect-[4/3] rounded-2xl" />
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.7, ease: easeOutQuint }}
                className="absolute -bottom-5 -left-5 bg-white rounded-xl border border-zinc-100 shadow-xl shadow-zinc-200/40 px-6 py-4"
              >
                <p className="text-2xl font-bold text-red-600 tabular-nums">С 2006 года</p>
                <p className="text-zinc-400 text-sm">на рынке</p>
              </motion.div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 border-y border-zinc-100">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-wrap justify-between gap-y-8 gap-x-4">
          {[
            { value: "18 лет", label: "на рынке" },
            { value: "РФ и СНГ", label: "география поставок" },
            { value: "НАКС", label: "аттестация" },
            { value: "100%", label: "гарантия" },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <div className="text-center min-w-[120px]">
                <p className="text-2xl md:text-3xl font-bold text-zinc-900 tabular-nums mb-1">
                  <ScrambleText text={s.value} />
                </p>
                <p className="text-sm text-zinc-400">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CATALOG */}
      <section id="catalog" className="py-24 px-6">
        <div className="max-w-[1400px] mx-auto">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4" style={{ textWrap: "balance" as never }}>Продукция</h2>
            <p className="text-zinc-500 max-w-[420px] mb-14 leading-relaxed">
              Собственное производство и поставка оборудования для промышленности.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-4">
            {products.map((p, i) => (
              <Reveal key={i} delay={i * 0.07} className={p.span}>
                <div className="group relative rounded-2xl overflow-hidden cursor-default h-[280px] md:h-[340px] hover-lift">
                  <img src={p.img} alt={p.title} className="w-full h-full object-cover img-zoom" />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/70 via-zinc-900/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-5 md:p-6">
                    <h3 className="text-white text-lg font-semibold mb-0.5">{p.title}</h3>
                    <p className="text-zinc-300 text-sm opacity-0 translate-y-2 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 group-hover:translate-y-0">{p.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-24 px-6 bg-zinc-50">
        <div className="max-w-[1400px] mx-auto">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-14">Популярные товары</h2>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "ПРОТОН-ДЭИ ВДИ 200", category: "Сварочные инверторы", price: "от 18 500 ₽", img: "https://picsum.photos/seed/dei-proton200/400/400" },
              { name: "LED-DEI-120 Промышленный", category: "Светодиодные светильники", price: "от 8 200 ₽", img: "https://picsum.photos/seed/dei-led120/400/400" },
              { name: "Центратор ЦЗН 159-426", category: "Центраторы", price: "от 24 000 ₽", img: "https://picsum.photos/seed/dei-centr159/400/400" },
              { name: "Электроды МР-3 d3.0", category: "Расходные материалы", price: "от 1 200 ₽/пачка", img: "https://picsum.photos/seed/dei-electrode3/400/400" },
            ].map((p, i) => (
              <ProductCard key={i} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* STRENGTHS */}
      <section id="strengths" className="py-28 px-6 bg-zinc-950 text-white overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-16">
              Почему выбирают <span className="text-red-500">DEI</span>
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-x-16 gap-y-0">
            {strengths.map((s, i) => (
              <Reveal key={i} delay={i * 0.06} direction={i % 2 === 0 ? "left" : "right"}>
                <div className="group py-8 border-b border-zinc-800 last:border-b-0">
                  <div className="flex items-start gap-5">
                    <span className="text-5xl md:text-6xl font-bold text-red-600/15 group-hover:text-red-600/35 transition-colors duration-500 leading-none select-none tabular-nums">{s.num}</span>
                    <div className="pt-2">
                      <h3 className="text-lg font-semibold mb-2 group-hover:text-red-400 transition-colors duration-200">{s.title}</h3>
                      <p className="text-zinc-400 text-[15px] leading-relaxed max-w-[40ch]">{s.desc}</p>
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
        initial={{ clipPath: "inset(8% 4% 8% 4% round 16px)" }}
        whileInView={{ clipPath: "inset(0% 0% 0% 0% round 0px)" }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1, ease: easeOut }}
        className="relative h-[380px] md:h-[500px] overflow-hidden"
      >
        <ParallaxImage src="https://picsum.photos/seed/dei-production-line/1800/600" alt="Производственная линия" className="h-full" />
        <div className="absolute inset-0 bg-zinc-900/50 flex items-center justify-center">
          <Reveal>
            <p className="text-white text-2xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-center px-6 max-w-[700px] leading-tight">
              Производим и поставляем по всей России
            </p>
          </Reveal>
        </div>
      </motion.section>

      {/* CTA */}
      <section className="py-28 px-6">
        <div className="max-w-[560px] mx-auto text-center">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-5">Нужна консультация?</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-zinc-500 mb-10 leading-relaxed">
              Выезд специалиста, расчёт проекта и подбор оборудования. Работаем с юридическими и физическими лицами.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <MagneticButton
              href="tel:+79885807630"
              className="inline-block bg-red-600 hover:bg-red-700 text-white px-9 py-4 rounded-lg text-lg font-semibold btn-press shadow-[0_8px_30px_-4px_rgba(220,38,38,0.35)] hover:shadow-[0_14px_40px_-4px_rgba(220,38,38,0.45)]"
            >
              +7 (988) 580-76-30
            </MagneticButton>
          </Reveal>
        </div>
      </section>
    </>
  );
}
