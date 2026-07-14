import Link from "next/link";
import CountUp from "@/components/CountUp";
import MagneticButton from "@/components/MagneticButton";
import Reveal from "@/components/Reveal";

const principles = [
  {
    number: "01",
    title: "Инженерный подбор",
    text: "Начинаем с задачи и условий эксплуатации, а не с продажи конкретной модели.",
  },
  {
    number: "02",
    title: "Собственная экспертиза",
    text: "Производственный опыт и контроль качества внутри компании с 2006 года.",
  },
  {
    number: "03",
    title: "Сопровождение",
    text: "Расчёт, поставка, монтаж и консультация специалистов после запуска.",
  },
];

const process = [
  ["Задача", "Фиксируем требования, параметры объекта и ожидаемый результат."],
  ["Подбор", "Сравниваем варианты и готовим понятное техническое предложение."],
  ["Поставка", "Согласовываем комплектацию, сроки, оплату и доставку."],
  ["Запуск", "Помогаем с монтажом и дальнейшей эксплуатацией оборудования."],
];

function Hero() {
  return (
    <section className="minimal-hero">
      <div className="minimal-hero-grid">
        <div>
          <p className="hero-in hero-in-1 page-kicker">Промышленное оборудование · с 2006 года</p>
          <h1 className="hero-in hero-in-2 minimal-hero-title">
            Техника для <em>производственных</em> задач
          </h1>
          <p className="hero-in hero-in-3 minimal-hero-copy">
            Сварочное оборудование и промышленное освещение с инженерным подбором, поставкой и сопровождением запуска.
          </p>

          <div className="hero-in hero-in-4 mt-8 flex flex-wrap gap-3">
            <MagneticButton href="/catalog" className="energy-strip btn bg-red-600 px-6 py-3.5 text-sm font-semibold text-white hover:bg-red-500">
              Открыть каталог
            </MagneticButton>
            <Link href="/contacts" className="glass-pill btn px-6 py-3.5 text-sm font-medium text-zinc-300 hover:border-white/[0.24] hover:text-white">
              Обсудить задачу
            </Link>
          </div>

          <div className="hero-in hero-in-5 hero-facts mt-9 flex flex-wrap gap-x-8 gap-y-3 text-[11px] uppercase tracking-[0.13em] text-zinc-600">
            <span><b>20+</b> лет опыта</span>
            <span>Ростов-на-Дону</span>
            <span>Поставки по России</span>
          </div>
        </div>

        <div className="hero-wordmark" aria-hidden="true">
          <div className="hero-wordmark-logo">DEI</div>
          <div className="hero-product-list">
            <div className="hero-product-row"><b>01</b><span>Сварочное оборудование</span></div>
            <div className="hero-product-row"><b>02</b><span>Промышленное освещение</span></div>
          </div>
          <div className="hero-wordmark-year">2006</div>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section className="section-shell py-16">
      <div className="stat-strip">
        <div className="stat-cell">
          <p className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">2006</p>
          <p className="mt-2 text-xs text-zinc-600">год основания</p>
        </div>
        <div className="stat-cell">
          <p className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl"><CountUp target={new Date().getFullYear() - 2006} from={0} />+</p>
          <p className="mt-2 text-xs text-zinc-600">лет практики</p>
        </div>
        <div className="stat-cell">
          <p className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">НАКС</p>
          <p className="mt-2 text-xs text-zinc-600">аттестация оборудования</p>
        </div>
        <div className="stat-cell">
          <p className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">РФ</p>
          <p className="mt-2 text-xs text-zinc-600">география поставок</p>
        </div>
      </div>
    </section>
  );
}

function Principles() {
  return (
    <section className="section-space">
      <div className="section-shell">
        <Reveal>
          <p className="section-kicker">Подход</p>
          <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-end">
            <h2 className="section-title">Без лишних обещаний. Только понятный результат.</h2>
            <p className="max-w-[520px] text-base leading-relaxed text-zinc-500 lg:justify-self-end">
              Берём на себя техническую часть — от первичного расчёта до ввода оборудования в работу.
            </p>
          </div>
        </Reveal>

        <div className="principle-grid mt-14">
          {principles.map((item, index) => (
            <Reveal key={item.number} delay={index * 0.08}>
              <article className="principle-item">
                <span className="text-xs text-red-500">{item.number}</span>
                <h3 className="mt-8 text-xl font-medium text-white">{item.title}</h3>
                <p className="mt-3 max-w-[340px] text-sm leading-relaxed text-zinc-500">{item.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section className="section-space border-t border-white/[0.07]">
      <div className="section-shell">
        <Reveal>
          <p className="section-kicker">Процесс</p>
          <h2 className="section-title mt-5 max-w-[760px]">Четыре шага от запроса до запуска</h2>
        </Reveal>

        <div className="glass-card mt-14 overflow-hidden rounded-[24px] p-2">
          {process.map(([title, text], index) => (
            <Reveal key={title} delay={index * 0.05}>
              <div className="grid gap-4 rounded-[16px] border-b border-white/[0.07] px-5 py-6 transition-colors hover:bg-white/[0.035] sm:grid-cols-[80px_220px_1fr] sm:items-baseline">
                <span className="text-xs text-zinc-700">0{index + 1}</span>
                <h3 className="text-lg font-medium text-white">{title}</h3>
                <p className="max-w-[560px] text-sm leading-relaxed text-zinc-500">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactCta() {
  return (
    <section className="section-space border-t border-white/[0.07]">
      <div className="section-shell">
        <Reveal>
          <div className="glass-card grid gap-8 overflow-hidden rounded-[28px] p-7 md:p-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="section-kicker">Консультация</p>
              <h2 className="section-title mt-5 max-w-[820px]">Расскажите о задаче — предложим следующий шаг</h2>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <a href="tel:+79885807630" className="energy-strip btn bg-red-600 px-7 py-3.5 text-center text-sm font-semibold text-white hover:bg-red-500">+7 (988) 580-76-30</a>
              <Link href="/contacts" className="glass-pill btn px-7 py-3.5 text-center text-sm text-zinc-300 hover:text-white">Контакты компании</Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <Principles />
      <Process />
      <ContactCta />
    </>
  );
}
