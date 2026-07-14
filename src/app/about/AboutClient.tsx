import Link from "next/link";
import Reveal from "@/components/Reveal";
import InternalMasthead from "@/components/InternalMasthead";

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
      <InternalMasthead
        index="01"
        eyebrow="Компания"
        title="Инженерная культура, проверенная производством"
        summary="ДонЭлектроИнтел объединяет собственные разработки, практический опыт и ответственность за результат — от расчёта до запуска оборудования."
        facts={[
          { label: "Основание", value: "2006" },
          { label: "Профиль", value: "B2B / INDUSTRIAL" },
          { label: "География", value: "РОССИЯ" },
        ]}
      />

      <section className="about-origin-section section-shell">
        <Reveal>
          <div className="about-origin">
            <div className="about-origin__statement">
              <span>Основа компании</span>
              <p>Техника должна решать задачу в реальных условиях, а не только соответствовать цифрам в каталоге.</p>
            </div>
            <div className="about-origin__facts">
              <div><span>01</span><p>Собственная инженерная экспертиза</p></div>
              <div><span>02</span><p>Контроль производственных параметров</p></div>
              <div><span>03</span><p>Поддержка после поставки</p></div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="about-principles dei-page-section section-space">
        <div className="section-shell">
          <Reveal>
            <p className="section-kicker">Принципы</p>
            <h2 className="section-title mt-5 max-w-[760px]">Технологичность начинается с дисциплины</h2>
          </Reveal>
          <div className="about-principles__list mt-14">
            {principles.map(([title, text], index) => (
              <Reveal key={title} delay={index * 0.07}>
                <article className="about-principle">
                  <span className="text-xs text-red-500">0{index + 1}</span>
                  <h3 className="mt-8 text-xl font-medium text-white">{title}</h3>
                  <p className="mt-3 max-w-[350px] text-sm leading-relaxed text-zinc-500">{text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="about-history dei-page-section section-space">
        <div className="section-shell grid gap-14 lg:grid-cols-[0.72fr_1.28fr]">
          <Reveal>
            <div className="lg:sticky lg:top-28">
              <p className="section-kicker">История</p>
              <h2 className="section-title mt-5">Этапы развития</h2>
            </div>
          </Reveal>
          <div className="about-timeline">
            {timeline.map(([year, text], index) => (
              <Reveal key={year} delay={index * 0.05}>
                <div className="about-timeline__row grid gap-4 px-5 py-6 sm:grid-cols-[100px_1fr]">
                  <span className="text-xl font-medium tabular-nums text-white">{year}</span>
                  <p className="max-w-[620px] text-sm leading-relaxed text-zinc-500">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="about-closing dei-page-section section-space">
        <div className="section-shell">
          <Reveal>
            <div className="about-closing__panel grid gap-10 p-7 md:p-10 lg:grid-cols-[1fr_auto] lg:items-end">
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
