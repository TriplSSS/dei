import Link from "next/link";
import Reveal from "@/components/Reveal";

const principles = [
  ["Инженерная точность", "Решения оцениваются по рабочим параметрам, надёжности и условиям эксплуатации."],
  ["Контроль качества", "Подход сформирован опытом работы с требованиями оборонной промышленности."],
  ["Ответственность", "Сопровождаем заказчика от первичного расчёта до запуска оборудования."],
];

const timeline = [
  ["2006", "Основание компании инженерами с опытом работы в оборонной промышленности."],
  ["2010", "Запуск направления промышленного светодиодного освещения."],
  ["2014", "Разработка сварочного инвертора ПРОТОН-ДЭИ ВДИ 200."],
  ["2018", "Аттестация оборудования НАКС и расширение географии поставок."],
  ["2024", "Модернизация производства и развитие продуктовой линейки."],
];

export default function AboutClient() {
  return (
    <>
      <section className="page-intro">
        <div className="page-intro-inner">
          <Reveal>
            <p className="page-kicker">О компании</p>
            <h1 className="page-title max-w-[1050px]">Инженерная культура с 2006 года</h1>
            <p className="page-lead">
              ДонЭлектроИнтел объединяет производственный опыт, собственные разработки и практический подход к задачам заказчика.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section-shell pb-20">
        <Reveal>
          <div className="brand-statement glass-card grid min-h-[360px] overflow-hidden lg:grid-cols-[1fr_1.25fr]">
            <div className="flex flex-col justify-between bg-[radial-gradient(circle_at_30%_20%,rgba(239,45,63,.14),transparent_55%)] p-8 sm:p-12">
              <span className="text-xs uppercase tracking-[0.16em] text-zinc-600">ДонЭлектроИнтел</span>
              <span className="text-[clamp(6rem,16vw,13rem)] font-bold leading-[0.7] tracking-[-0.09em] text-white">DEI</span>
            </div>
            <div className="flex items-end border-t border-white/[0.09] p-8 sm:p-12 lg:border-l lg:border-t-0">
              <p className="max-w-[620px] text-xl leading-relaxed text-zinc-300 sm:text-2xl">
                Компания создана инженерами, которые ранее отвечали за качество разработки и производства сложных технических систем.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="dei-page-section section-space">
        <div className="section-shell">
          <Reveal>
            <p className="section-kicker">Принципы</p>
            <h2 className="section-title mt-5 max-w-[760px]">Технологичность начинается с дисциплины</h2>
          </Reveal>
          <div className="principle-grid mt-14">
            {principles.map(([title, text], index) => (
              <Reveal key={title} delay={index * 0.07}>
                <article className="principle-item">
                  <span className="text-xs text-red-500">0{index + 1}</span>
                  <h3 className="mt-8 text-xl font-medium text-white">{title}</h3>
                  <p className="mt-3 max-w-[350px] text-sm leading-relaxed text-zinc-500">{text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="dei-page-section section-space">
        <div className="section-shell grid gap-14 lg:grid-cols-[0.72fr_1.28fr]">
          <Reveal>
            <div className="lg:sticky lg:top-28">
              <p className="section-kicker">История</p>
              <h2 className="section-title mt-5">Этапы развития</h2>
            </div>
          </Reveal>
          <div className="timeline-panel glass-card overflow-hidden p-2">
            {timeline.map(([year, text], index) => (
              <Reveal key={year} delay={index * 0.05}>
                <div className="timeline-row grid gap-4 rounded-[14px] border-b border-white/[0.07] px-5 py-6 sm:grid-cols-[100px_1fr]">
                  <span className="text-xl font-medium tabular-nums text-white">{year}</span>
                  <p className="max-w-[620px] text-sm leading-relaxed text-zinc-500">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="dei-page-section section-space">
        <div className="section-shell">
          <Reveal>
            <div className="cta-panel glass-card grid gap-10 p-7 md:p-10 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="section-kicker">Сегодня</p>
                <h2 className="section-title mt-5 max-w-[800px]">Производим, подбираем и сопровождаем оборудование</h2>
                <p className="mt-6 max-w-[650px] text-base leading-relaxed text-zinc-500">
                  Работаем с предприятиями и частными заказчиками: уточняем задачу, рассчитываем решение и остаёмся на связи после поставки.
                </p>
              </div>
              <Link href="/contacts" className="energy-strip btn bg-red-600 px-7 py-3.5 text-center text-sm font-semibold text-white hover:bg-red-500">Связаться с нами</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
