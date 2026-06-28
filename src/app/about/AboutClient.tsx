"use client";

import Reveal from "@/components/Reveal";
import ParallaxImage from "@/components/ParallaxImage";

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
      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-[1400px] mx-auto">
          <Reveal direction="left">
            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold tracking-tighter leading-[1.06] mb-6">
              О компании<br />
              <span className="text-red-600">ДонЭлектроИнтел</span>
            </h1>
          </Reveal>
          <Reveal direction="left" delay={0.1}>
            <p className="text-zinc-500 text-lg leading-relaxed max-w-[600px]">
              Компанию создали в 2006 году офицеры запаса, инженеры, которые ранее контролировали качество разработки и производства космических двигателей и спутниковых систем связи.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Image band */}
      <Reveal>
        <section className="relative h-[300px] md:h-[420px] overflow-hidden rounded-none">
          <ParallaxImage src="https://picsum.photos/seed/dei-about-factory/1800/600" alt="Производство DEI" className="h-full" />
          <div className="absolute inset-0 bg-zinc-900/40" />
        </section>
      </Reveal>

      {/* Mission */}
      <section className="py-24 px-6">
        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-16 items-start">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-6">
              Наш подход
            </h2>
            <p className="text-zinc-500 leading-relaxed mb-6 max-w-[520px]">
              За основу взята система качества разработки и производства оборонной промышленности. В модельном ряде есть собственные запатентованные конструктивные решения и технологии.
            </p>
            <p className="text-zinc-500 leading-relaxed max-w-[520px]">
              Мы придерживаемся комплексного подхода к обслуживанию клиентов: выезд к заказчику для разбора объекта, расчёт и рекомендации, поставка, монтаж, консультирование в процессе эксплуатации.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="grid grid-cols-2 gap-5">
              {[
                { value: "18+", label: "лет опыта" },
                { value: "НАКС", label: "аттестация" },
                { value: "РФ и СНГ", label: "поставки" },
                { value: "24/7", label: "поддержка" },
              ].map((s, i) => (
                <div key={i} className="py-6 px-5 border border-zinc-100 rounded-xl text-center hover-lift">
                  <p className="text-2xl font-bold text-red-600 mb-1">{s.value}</p>
                  <p className="text-sm text-zinc-400">{s.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 px-6 bg-zinc-950 text-white">
        <div className="max-w-[900px] mx-auto">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-16">
              История <span className="text-red-500">развития</span>
            </h2>
          </Reveal>

          <div className="space-y-0">
            {timeline.map((t, i) => (
              <Reveal key={i} delay={i * 0.06} direction={i % 2 === 0 ? "left" : "right"}>
                <div className="flex gap-6 py-8 border-b border-zinc-800 last:border-b-0 group">
                  <span className="text-3xl md:text-4xl font-bold text-red-600/25 group-hover:text-red-600/50 transition-colors duration-500 tabular-nums shrink-0 w-[100px]">
                    {t.year}
                  </span>
                  <p className="text-zinc-400 text-[15px] leading-relaxed pt-2 group-hover:text-zinc-300 transition-colors duration-300">
                    {t.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
