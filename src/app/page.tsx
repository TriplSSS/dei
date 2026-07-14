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
          <h1 className="hero-in hero-in-1 minimal-hero-title">
            DEI
          </h1>

          <div className="hero-in hero-in-2 mt-8 flex flex-wrap gap-3">
            <MagneticButton href="/catalog" className="energy-strip btn bg-red-600 px-6 py-3.5 text-sm font-semibold text-white hover:bg-red-500">
              Каталог
            </MagneticButton>
            <Link href="/contacts" className="glass-pill btn px-6 py-3.5 text-sm font-medium text-zinc-300 hover:border-white/[0.24] hover:text-white">
              Связаться с нами
            </Link>
          </div>
        </div>

        <div className="hero-electric hero-in hero-in-2" aria-hidden="true">
          <div className="electric-field" />
          <div className="electric-terminal electric-terminal-left">
            <span />
            <i />
            <b />
          </div>
          <svg className="electric-arc" viewBox="0 0 640 360" role="presentation">
            <defs>
              <filter id="electric-glow" x="-40%" y="-80%" width="180%" height="260%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="electric-gradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#a90022" />
                <stop offset=".48" stopColor="#ffffff" />
                <stop offset=".55" stopColor="#ff2349" />
                <stop offset="1" stopColor="#a90022" />
              </linearGradient>
            </defs>
            <path className="electric-arc-halo" d="M88 181 L138 158 L178 199 L225 146 L270 192 L316 132 L355 190 L404 149 L447 196 L497 157 L552 181" />
            <path className="electric-arc-main" d="M88 181 L138 158 L178 199 L225 146 L270 192 L316 132 L355 190 L404 149 L447 196 L497 157 L552 181" />
            <path className="electric-arc-pulse" d="M88 181 L138 158 L178 199 L225 146 L270 192 L316 132 L355 190 L404 149 L447 196 L497 157 L552 181" />
            <path className="electric-arc-branch branch-one" d="M225 146 L206 104 L176 84" />
            <path className="electric-arc-branch branch-two" d="M355 190 L379 232 L410 250" />
            <path className="electric-arc-branch branch-three" d="M447 196 L470 230 L497 239" />
          </svg>
          <div className="electric-terminal electric-terminal-right">
            <span />
            <i />
            <b />
          </div>
          <div className="electric-particles">
            {Array.from({ length: 10 }, (_, index) => <i key={index} />)}
          </div>
          <div className="electric-floor" />
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
