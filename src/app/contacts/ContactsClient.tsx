"use client";

import Reveal from "@/components/Reveal";
import MagneticButton from "@/components/MagneticButton";

const contacts = [
  { label: "Телефон", value: "+7 (988) 580-76-30", href: "tel:+79885807630" },
  { label: "Адрес", value: "пер. Нарядный, 14/2, Ростов-на-Дону, 344065", href: null },
  { label: "Режим работы", value: "Пн-Пт: 9:00 - 18:00, Сб-Вс: по записи", href: null },
];

export default function ContactsClient() {
  return (
    <>
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-[1400px] mx-auto">
          <Reveal direction="left">
            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold tracking-tighter leading-[1.06] mb-6">
              Контакты
            </h1>
          </Reveal>
          <Reveal direction="left" delay={0.1}>
            <p className="text-zinc-500 text-lg leading-relaxed max-w-[500px] mb-16">
              Свяжитесь с нами для консультации, расчёта проекта или заказа оборудования.
            </p>
          </Reveal>

          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-16">
            <div>
              {contacts.map((c, i) => (
                <Reveal key={i} delay={i * 0.06}>
                  <div className="py-7 border-b border-zinc-200 last:border-b-0">
                    <p className="text-xs text-zinc-400 uppercase tracking-wider mb-3">{c.label}</p>
                    {c.href ? (
                      <a href={c.href} className="text-zinc-900 text-xl font-medium hover:text-red-600 transition-colors duration-200">
                        {c.value}
                      </a>
                    ) : (
                      <p className="text-zinc-900 text-lg font-medium leading-relaxed">{c.value}</p>
                    )}
                  </div>
                </Reveal>
              ))}

              <Reveal delay={0.3}>
                <div className="mt-10">
                  <MagneticButton
                    href="tel:+79885807630"
                    className="inline-block bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg text-lg font-semibold btn-press shadow-[0_8px_30px_-4px_rgba(220,38,38,0.35)]"
                  >
                    Позвонить
                  </MagneticButton>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.15} direction="scale">
              <div className="rounded-2xl overflow-hidden h-[400px] bg-zinc-100">
                <iframe
                  src="https://yandex.ru/map-widget/v1/?um=constructor%3A0&amp;source=constructor&amp;ll=39.745947%2C47.238504&amp;z=15&amp;pt=39.745947%2C47.238504%2Cpm2rdm"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  title="ДонЭлектроИнтел на карте"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
