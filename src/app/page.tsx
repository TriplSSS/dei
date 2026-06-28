"use client";

import { motion, useReducedMotion, useScroll, useTransform, useMotionValue, useSpring } from "motion/react";
import Link from "next/link";
import { useRef, useEffect, useState, useCallback } from "react";

const easeOut = [0.16, 1, 0.3, 1] as const;
const easeOutQuint = [0.22, 1, 0.36, 1] as const;

/* ─── Reveal on scroll ─── */
function Reveal({ children, delay = 0, className = "", direction = "up" }: {
  children: React.ReactNode; delay?: number; className?: string;
  direction?: "up" | "left" | "right" | "scale";
}) {
  const reduce = useReducedMotion();
  const variants: Record<string, { opacity: number; y?: number; x?: number; scale?: number }> = {
    up:    { opacity: 0, y: 28 },
    left:  { opacity: 0, x: -36 },
    right: { opacity: 0, x: 36 },
    scale: { opacity: 0, scale: 0.92 },
  };
  return (
    <motion.div
      className={className}
      initial={reduce ? false : variants[direction]}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, delay, ease: easeOut }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Parallax image ─── */
function ParallaxImage({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.img src={src} alt={alt} style={{ y }} className="w-full h-full object-cover scale-[1.2]" />
    </div>
  );
}

/* ─── Magnetic button ─── */
function MagneticButton({ children, className = "", href }: { children: React.ReactNode; className?: string; href: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });
  const reduce = useReducedMotion();

  const handleMouse = useCallback((e: React.MouseEvent) => {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.15);
    y.set((e.clientY - cy) * 0.15);
  }, [reduce, x, y]);

  const reset = useCallback(() => { x.set(0); y.set(0); }, [x, y]);

  return (
    <motion.a
      ref={ref}
      href={href}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      className={className}
    >
      {children}
    </motion.a>
  );
}

/* ─── Text scramble on viewport entry ─── */
function ScrambleText({ text, className = "" }: { text: string; className?: string }) {
  const [display, setDisplay] = useState(text);
  const [triggered, setTriggered] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || triggered) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setTriggered(true);
      observer.disconnect();
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let iteration = 0;
      const interval = setInterval(() => {
        setDisplay(text.split("").map((ch, i) => {
          if (ch === " ") return " ";
          if (i < iteration) return text[i];
          return chars[Math.floor(Math.random() * chars.length)];
        }).join(""));
        iteration += 0.8;
        if (iteration >= text.length) { clearInterval(interval); setDisplay(text); }
      }, 35);
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [text, reduce, triggered]);

  return <span ref={ref} className={className}>{display}</span>;
}

/* ─── Scroll progress bar ─── */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      style={{ scaleX, transformOrigin: "left" }}
      className="fixed top-16 left-0 right-0 h-[2px] bg-red-600 z-50"
    />
  );
}

const products = [
  { title: "Сварочные аппараты", desc: "MIG/MAG, TIG, MMA", img: "https://picsum.photos/seed/dei-welder2/700/500", span: "md:col-span-2" },
  { title: "Промышленное освещение", desc: "LED для цехов и складов", img: "https://picsum.photos/seed/dei-ledlight/600/500", span: "" },
  { title: "Расходные материалы", desc: "Электроды, проволока, сопла", img: "https://picsum.photos/seed/dei-consumable2/600/500", span: "" },
  { title: "Электроинструмент", desc: "Болгарки, дрели, перфораторы", img: "https://picsum.photos/seed/dei-powertool2/700/500", span: "md:col-span-2" },
];

const strengths = [
  { num: "01", title: "Подбор под задачу", desc: "Помогаем выбрать оборудование под конкретный процесс, материал и бюджет." },
  { num: "02", title: "Собственный склад", desc: "Товары в наличии в Ростове-на-Дону. Доставка по РФ и СНГ." },
  { num: "03", title: "Работа с юрлицами", desc: "Безналичный расчёт, договор, полный комплект закрывающих документов." },
  { num: "04", title: "Гарантия качества", desc: "Сертифицированное оборудование от проверенных производителей." },
];

export default function Home() {
  return (
    <>
      <ScrollProgress />

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-xl border-b border-zinc-100">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">
            DEI<span className="text-red-600">.</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-[15px]">
            {[
              { href: "#catalog", label: "Каталог" },
              { href: "#strengths", label: "О компании" },
              { href: "#contact", label: "Контакты" },
            ].map(l => (
              <a key={l.href} href={l.href} className="nav-link text-zinc-500 hover:text-zinc-900 py-1">
                {l.label}
              </a>
            ))}
          </div>
          <MagneticButton href="tel:+79081771330" className="bg-red-600 hover:bg-red-700 text-white text-sm px-5 py-2.5 rounded-lg font-medium btn-press inline-block">
            Позвонить
          </MagneticButton>
        </div>
      </nav>

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
                Сварка, освещение, инструмент. Подбор под задачу, склад в Ростове, доставка по России.
              </p>
            </Reveal>
            <Reveal direction="left" delay={0.22}>
              <div className="flex flex-wrap gap-3">
                <MagneticButton href="#catalog" className="bg-red-600 hover:bg-red-700 text-white px-7 py-3.5 rounded-lg font-medium btn-press inline-block shadow-[0_6px_24px_-4px_rgba(220,38,38,0.3)] hover:shadow-[0_10px_32px_-4px_rgba(220,38,38,0.4)]">
                  Каталог
                </MagneticButton>
                <a href="#contact" className="border border-zinc-200 hover:border-zinc-300 text-zinc-700 px-7 py-3.5 rounded-lg font-medium btn-press hover:bg-zinc-50 inline-block">
                  Связаться
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal direction="scale" delay={0.1} className="hidden lg:block">
            <div className="relative">
              <div className="rounded-2xl overflow-hidden">
                <ParallaxImage src="https://picsum.photos/seed/dei-hero-welder/900/680" alt="Промышленное оборудование" className="aspect-[4/3] rounded-2xl" />
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.7, ease: easeOutQuint }}
                className="absolute -bottom-5 -left-5 bg-white rounded-xl border border-zinc-100 shadow-xl shadow-zinc-200/40 px-6 py-4"
              >
                <p className="text-2xl font-bold text-red-600 tabular-nums">10+ лет</p>
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
            { value: "300+", label: "позиций" },
            { value: "1 200+", label: "клиентов" },
            { value: "24ч", label: "доставка" },
            { value: "100%", label: "гарантия" },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <div className="text-center min-w-[120px]">
                <p className="text-3xl md:text-4xl font-bold text-zinc-900 tabular-nums mb-1">
                  <ScrambleText text={s.value} />
                </p>
                <p className="text-sm text-zinc-400">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CATALOG - Asymmetric bento with hover lift + image zoom */}
      <section id="catalog" className="py-24 px-6">
        <div className="max-w-[1400px] mx-auto">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4" style={{ textWrap: "balance" as never }}>Каталог продукции</h2>
            <p className="text-zinc-500 max-w-[420px] mb-14 leading-relaxed">
              Более 300 позиций на складе. Подберём под вашу задачу.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-4">
            {products.map((p, i) => (
              <Reveal key={i} delay={i * 0.07} className={p.span}>
                <div className="group relative rounded-2xl overflow-hidden cursor-default h-[280px] md:h-[340px] hover-lift">
                  <img
                    src={p.img} alt={p.title}
                    className="w-full h-full object-cover img-zoom"
                  />
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

      {/* STRENGTHS - Dark section, 2-col with animated numbers */}
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

      {/* TRUST BAND - Full-width parallax with clip-path reveal */}
      <motion.section
        initial={{ clipPath: "inset(8% 4% 8% 4% round 16px)" }}
        whileInView={{ clipPath: "inset(0% 0% 0% 0% round 0px)" }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1, ease: easeOut }}
        className="relative h-[380px] md:h-[500px] overflow-hidden"
      >
        <ParallaxImage src="https://picsum.photos/seed/dei-warehouse-panorama/1800/600" alt="Склад оборудования" className="h-full" />
        <div className="absolute inset-0 bg-zinc-900/50 flex items-center justify-center">
          <Reveal>
            <p className="text-white text-2xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-center px-6 max-w-[700px] leading-tight">
              Поставляем оборудование по всей России
            </p>
          </Reveal>
        </div>
      </motion.section>

      {/* CTA */}
      <section className="py-28 px-6">
        <div className="max-w-[560px] mx-auto text-center">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-5">
              Нужна консультация?
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-zinc-500 mb-10 leading-relaxed">
              Поможем подобрать оборудование и организуем доставку.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <MagneticButton
              href="tel:+79081771330"
              className="inline-block bg-red-600 hover:bg-red-700 text-white px-9 py-4 rounded-lg text-lg font-semibold btn-press shadow-[0_8px_30px_-4px_rgba(220,38,38,0.35)] hover:shadow-[0_14px_40px_-4px_rgba(220,38,38,0.45)]"
            >
              +7 (908) 177-13-30
            </MagneticButton>
          </Reveal>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-24 px-6 border-t border-zinc-100">
        <div className="max-w-[1400px] mx-auto">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-14">Контакты</h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { label: "Телефон", value: "+7 (908) 177-13-30", href: "tel:+79081771330" },
              { label: "Email", value: "info@dei-rnd.ru", href: "mailto:info@dei-rnd.ru" },
              { label: "Город", value: "Ростов-на-Дону", href: null },
            ].map((c, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <div className="py-6 border-t border-zinc-200 group">
                  <p className="text-xs text-zinc-400 uppercase tracking-wider mb-3">{c.label}</p>
                  {c.href ? (
                    <a href={c.href} className="text-zinc-900 text-lg font-medium hover:text-red-600 transition-colors duration-200">{c.value}</a>
                  ) : (
                    <p className="text-zinc-900 text-lg font-medium">{c.value}</p>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-14 px-6 border-t border-zinc-100 bg-zinc-50">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div>
              <Link href="/" className="text-lg font-bold tracking-tight">DEI<span className="text-red-600">.</span></Link>
              <p className="text-zinc-400 text-sm mt-3 leading-relaxed max-w-[240px]">
                ООО ДонЭлектроИнтел. Сварочное оборудование, освещение и инструмент.
              </p>
            </div>
            <div>
              <h4 className="text-xs text-zinc-400 uppercase tracking-wider mb-4">Навигация</h4>
              {[
                { href: "/", label: "Главная" },
                { href: "#catalog", label: "Каталог" },
                { href: "#strengths", label: "О компании" },
                { href: "#contact", label: "Контакты" },
              ].map(l => (
                <a key={l.label} href={l.href} className="block text-zinc-500 text-sm mb-2.5 hover:text-zinc-900 transition-colors duration-200">{l.label}</a>
              ))}
            </div>
            <div>
              <h4 className="text-xs text-zinc-400 uppercase tracking-wider mb-4">Документы</h4>
              {["Политика конфиденциальности", "Договор оферты"].map(l => (
                <a key={l} href="#" className="block text-zinc-500 text-sm mb-2.5 hover:text-zinc-900 transition-colors duration-200">{l}</a>
              ))}
            </div>
            <div>
              <h4 className="text-xs text-zinc-400 uppercase tracking-wider mb-4">Контакты</h4>
              <a href="tel:+79081771330" className="block text-zinc-500 text-sm mb-2.5 hover:text-zinc-900 transition-colors duration-200">+7 (908) 177-13-30</a>
              <a href="mailto:info@dei-rnd.ru" className="block text-zinc-500 text-sm mb-2.5 hover:text-zinc-900 transition-colors duration-200">info@dei-rnd.ru</a>
            </div>
          </div>
          <div className="border-t border-zinc-200 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-zinc-400">
            <span>2026 ООО ДонЭлектроИнтел</span>
            <span>Ростов-на-Дону</span>
          </div>
        </div>
      </footer>
    </>
  );
}
