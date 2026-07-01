"use client";

import Reveal from "@/components/Reveal";
import ParallaxImage from "@/components/ParallaxImage";

const stats = [
  { value: "18+", label: "лет опыта" },
  { value: "НАКС", label: "аттестация" },
  { value: "РФ·СНГ", label: "поставки" },
  { value: "24/7", label: "поддержка" },
];

const timeline = [
  { year: "2006", text: "Основание компании офицерами запаса, инженерами оборонной промышленности" },
  { year: "2010", text: "Запуск производства светодиодных светильников в Ростове-на-Дону" },
  { year: "2014", text: "Разработка сварочного инвертора ПРОТОН-ДЭИ ВДИ 200" },
  { year: "2018", text: "Аттестация оборудования в НАКС. Расширение географии поставок" },
  { year: "2024", text: "Модернизация производственной линии и выход на рынки СНГ" },
];

export default function AboutClient() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative pt-36 pb-24 px-6 overflow-hidden">
        {/* фоновые блики */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(220,38,38,0.06) 0%, transparent 70%)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-10 right-0 w-[400px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(255,255,255,0.02) 0%, transparent 70%)" }}
        />

        <div className="max-w-[1400px] mx-auto">
          {/* пилюля-лейбл */}
          <Reveal direction="up" delay={0}>
            <div className="inline-flex items-center gap-2 glass-pill rounded-full px-4 py-1.5 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-medium text-zinc-400 tracking-widest uppercase">
                О компании
              </span>
            </div>
          </Reveal>

          {/* заголовок */}
          <Reveal direction="left" delay={0.05}>
            <h1
              className="font-bold tracking-tight text-white"
              style={{ fontSize: "clamp(2.6rem, 6vw, 5.5rem)", lineHeight: "0.9", letterSpacing: "-0.03em" }}
            >
              ДонЭлектро
              <br />
              <span className="text-red-500">Интел</span>
            </h1>
          </Reveal>

          {/* подзаголовок */}
          <Reveal direction="left" delay={0.12}>
            <p className="mt-8 text-zinc-400 text-lg leading-relaxed max-w-[560px]">
              Компанию создали в&nbsp;2006&nbsp;году офицеры запаса и&nbsp;инженеры, которые ранее
              контролировали качество разработки и&nbsp;производства космических двигателей и&nbsp;спутниковых
              систем связи.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Параллакс-баннер ── */}
      <Reveal direction="scale" delay={0}>
        <section className="relative h-[320px] md:h-[460px] overflow-hidden">
          <ParallaxImage
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1800&h=600&fit=crop&q=80"
            alt="Производство ДонЭлектроИнтел"
            className="h-full"
          />
          {/* затемнение + красная граница снизу */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-600/40 to-transparent" />
        </section>
      </Reveal>

      {/* ── Наш подход ── */}
      <section className="py-24 px-6">
        <div className="max-w-[1400px] mx-auto">
          <Reveal direction="up">
            <h2
              className="font-bold tracking-tight text-white mb-12"
              style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", lineHeight: "0.95", letterSpacing: "-0.03em" }}
            >
              Наш <span className="text-red-500">подход</span>
            </h2>
          </Reveal>

          <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-start">
            {/* текст */}
            <Reveal direction="left" delay={0.05}>
              <div className="glass-card rounded-2xl p-8 lg:p-10 h-full">
                <p className="text-zinc-300 leading-relaxed mb-5 text-[15px]">
                  За основу взята система качества разработки и&nbsp;производства оборонной промышленности.
                  В&nbsp;модельном ряде есть собственные запатентованные конструктивные решения и&nbsp;технологии.
                </p>
                <p className="text-zinc-400 leading-relaxed text-[15px]">
                  Мы&nbsp;придерживаемся комплексного подхода к&nbsp;обслуживанию клиентов: выезд к&nbsp;заказчику
                  для разбора объекта, расчёт и&nbsp;рекомендации, поставка, монтаж, консультирование в&nbsp;процессе
                  эксплуатации.
                </p>

                {/* мини-сетка фич */}
                <div className="grid grid-cols-2 gap-3 mt-6">
                  <div className="flex items-center gap-2 glass-pill rounded-xl px-3 py-2.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                    <span className="text-xs text-zinc-400">Выезд к заказчику</span>
                  </div>
                  <div className="flex items-center gap-2 glass-pill rounded-xl px-3 py-2.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    <span className="text-xs text-zinc-400">НАКС аттестация</span>
                  </div>
                </div>

                {/* декоративная линия */}
                <div className="mt-8 h-px bg-gradient-to-r from-red-600/40 via-red-600/10 to-transparent" />
                <p className="mt-4 text-xs text-zinc-600 tracking-widest uppercase">
                  Официальный производитель · Ростов-на-Дону
                </p>
              </div>
            </Reveal>

            {/* статистика */}
            <Reveal direction="right" delay={0.1}>
              <div className="grid grid-cols-2 gap-4">
                {stats.map((s, i) => (
                  <div
                    key={i}
                    className="glass-inner rounded-2xl py-7 px-5 text-center hover-lift cursor-default"
                    style={{ transitionDelay: `${i * 40}ms` }}
                  >
                    <p
                      className="font-bold text-red-500 tabular-nums mb-1.5"
                      style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)" }}
                    >
                      {s.value}
                    </p>
                    <p className="text-xs text-zinc-500 tracking-wider uppercase">{s.label}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── История развития ── */}
      <section className="py-24 px-6">
        <div className="max-w-[1000px] mx-auto">
          <Reveal direction="up">
            <h2
              className="font-bold tracking-tight text-white mb-16"
              style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", lineHeight: "0.95", letterSpacing: "-0.03em" }}
            >
              История <span className="text-red-500">развития</span>
            </h2>
          </Reveal>

          <div className="glass-card rounded-2xl overflow-hidden">
            {timeline.map((t, i) => (
              <Reveal key={i} direction={i % 2 === 0 ? "left" : "right"} delay={i * 0.07}>
                <div
                  className="group flex items-start gap-6 lg:gap-10 px-7 lg:px-10 py-7 border-b border-white/[0.05] last:border-b-0 transition-colors duration-300 hover:bg-white/[0.025]"
                >
                  {/* год */}
                  <span
                    className="shrink-0 font-bold tabular-nums text-red-600/35 group-hover:text-red-500/70 transition-colors duration-500"
                    style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.4rem)", lineHeight: 1, minWidth: "5rem" }}
                  >
                    {t.year}
                  </span>

                  {/* разделитель */}
                  <div className="shrink-0 mt-2 w-px self-stretch bg-gradient-to-b from-red-600/30 via-red-600/10 to-transparent" />

                  {/* текст */}
                  <p className="text-zinc-400 text-[15px] leading-relaxed pt-0.5 group-hover:text-zinc-300 transition-colors duration-300">
                    {t.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Основатели ── */}
      <section className="pb-28 px-6">
        <div className="max-w-[1000px] mx-auto">
          <Reveal direction="up">
            <h2
              className="font-bold tracking-tight text-white mb-10"
              style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", lineHeight: "0.95", letterSpacing: "-0.03em" }}
            >
              Основатели
            </h2>
          </Reveal>

          <Reveal direction="up" delay={0.08}>
            <div className="glass-red rounded-2xl p-8 lg:p-12 relative overflow-hidden">
              {/* декоративное свечение */}
              <div
                aria-hidden
                className="absolute -right-20 -top-20 w-64 h-64 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(220,38,38,0.12) 0%, transparent 70%)" }}
              />

              <div className="relative">
                {/* иконка-акцент */}
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl glass-pill mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#DC2626"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>

                <p className="text-zinc-200 text-lg leading-relaxed max-w-[680px] mb-6">
                  Компанию основали офицеры запаса и&nbsp;инженеры оборонной промышленности — люди с&nbsp;опытом
                  контроля качества в&nbsp;разработке и&nbsp;производстве космических двигателей и&nbsp;спутниковых
                  систем связи.
                </p>
                <p className="text-zinc-400 text-[15px] leading-relaxed max-w-[620px]">
                  Этот фундамент определил ДНК компании: строгие стандарты производства, инженерная точность
                  в&nbsp;каждом изделии и&nbsp;культура ответственности перед заказчиком.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  {["Оборонная инженерия", "Космические технологии", "Контроль качества"].map((tag) => (
                    <span
                      key={tag}
                      className="glass-pill rounded-full px-4 py-1.5 text-xs text-zinc-400 tracking-wide"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <a
                  href="/contacts"
                  className="inline-flex items-center gap-2 text-red-500 hover:text-red-400 text-sm font-medium mt-6 transition-colors duration-200"
                >
                  Связаться с нами →
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
