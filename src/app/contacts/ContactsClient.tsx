import Reveal from "@/components/Reveal";

const PHONE = "+7 (988) 580-76-30";
const PHONE_HREF = "tel:+79885807630";
const MAP_URL =
  "https://yandex.ru/maps/?text=%D0%BF%D0%B5%D1%80.%20%D0%9D%D0%B0%D1%80%D1%8F%D0%B4%D0%BD%D1%8B%D0%B9%2014%2F2%2C%20%D0%A0%D0%BE%D1%81%D1%82%D0%BE%D0%B2-%D0%BD%D0%B0-%D0%94%D0%BE%D0%BD%D1%83";

const contactRows = [
  { label: "Телефон", value: PHONE, href: PHONE_HREF },
  { label: "Режим работы", value: "Пн–Пт: 9:00 — 18:00" },
  {
    label: "Адрес",
    value: "пер. Нарядный, 14/2, Ростов-на-Дону",
  },
];

export default function ContactsClient() {
  return (
    <>
      <section className="page-intro page-intro--contacts" data-page-code="05 / CONTACT">
        <div className="page-intro-inner">
          <Reveal direction="up">
            <p className="page-kicker">Контакты</p>
          </Reveal>
          <Reveal direction="up" delay={0.06}>
            <h1 className="page-title">Обсудим вашу задачу</h1>
          </Reveal>
          <Reveal direction="up" delay={0.12}>
            <p className="page-lead">
              Подберём оборудование, подготовим расчёт и ответим на технические
              вопросы. В рабочее время обычно отвечаем в течение часа.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section-shell pb-24 md:pb-32">
        <div className="contact-shell grid overflow-hidden lg:grid-cols-[0.92fr_1.08fr]">
          <Reveal direction="left">
            <div className="px-7 py-10 lg:px-12 lg:py-16">
              <p className="section-kicker">Прямой контакт</p>
              <a
                href={PHONE_HREF}
                className="mt-6 block text-[clamp(2rem,5vw,4rem)] font-semibold tracking-[-0.05em] text-white transition-colors hover:text-red-500"
              >
                {PHONE}
              </a>

              <dl className="mt-12 border-t border-white/10">
                {contactRows.map((row) => (
                  <div
                    key={row.label}
                    className="grid gap-2 border-b border-white/10 py-5 sm:grid-cols-[140px_1fr]"
                  >
                    <dt className="text-xs uppercase tracking-[0.14em] text-zinc-600">
                      {row.label}
                    </dt>
                    <dd className="text-sm leading-relaxed text-zinc-300">
                      {row.href ? (
                        <a href={row.href} className="transition-colors hover:text-white">
                          {row.value}
                        </a>
                      ) : (
                        row.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>

          <Reveal direction="right" delay={0.08}>
            <div className="contact-visual relative min-h-[430px] overflow-hidden px-7 py-10 lg:px-14 lg:py-16">
              <div className="contact-energy-arc" aria-hidden="true" />
              <div className="relative flex min-h-[350px] flex-col justify-between">
                <div>
                  <p className="section-kicker">Офис и производство</p>
                  <p className="mt-6 max-w-md text-[clamp(2.4rem,5vw,4.5rem)] font-semibold leading-[0.92] tracking-[-0.055em] text-white">
                    Ростов-на-Дону
                  </p>
                </div>

                <div className="max-w-sm">
                  <p className="text-lg leading-relaxed text-zinc-300">
                    пер. Нарядный, 14/2
                  </p>
                  <a
                    href={MAP_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 inline-flex items-center gap-3 border-b border-white/25 pb-2 text-sm font-medium text-white transition-colors hover:border-red-500 hover:text-red-400"
                  >
                    Открыть в Яндекс Картах
                    <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
