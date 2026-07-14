import Reveal from "@/components/Reveal";
import InternalMasthead from "@/components/InternalMasthead";

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
      <InternalMasthead
        index="05"
        eyebrow="Контакты"
        title="Начнём с технической задачи"
        summary="Опишите объект, условия эксплуатации или нужную комплектацию. Инженер уточнит вводные и предложит следующий шаг."
        facts={[
          { label: "Ответ", value: "ДО 1 ЧАСА" },
          { label: "График", value: "09:00–18:00" },
          { label: "Часовой пояс", value: "МСК" },
        ]}
      />

      <section className="contact-directory section-shell pb-24 md:pb-32">
        <div className="contact-directory__grid">
          <Reveal direction="left">
            <div className="contact-directory__primary">
              <div className="contact-directory__status"><span /> Инженерный отдел на связи</div>
              <p className="section-kicker">Прямой контакт</p>
              <a
                href={PHONE_HREF}
                className="contact-directory__phone"
              >
                {PHONE}
              </a>

              <dl className="contact-directory__rows">
                {contactRows.map((row) => (
                  <div
                    key={row.label}
                    className="contact-directory__row grid gap-2 py-5 sm:grid-cols-[140px_1fr]"
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
            <div className="contact-directory__location">
              <div className="contact-directory__diagram" aria-hidden="true"><span /><span /><span /></div>
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
                    className="contact-directory__map-link"
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
