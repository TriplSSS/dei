"use client";

import Reveal from "@/components/Reveal";
import MagneticButton from "@/components/MagneticButton";

const PHONE = "+7 (988) 580-76-30";
const PHONE_HREF = "tel:+79885807630";
const MAP_SRC =
  "https://yandex.ru/map-widget/v1/?um=constructor%3A0&source=constructor&ll=39.745947%2C47.238504&z=15&pt=39.745947%2C47.238504%2Cpm2rdm";

const contactRows = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.81a16 16 0 0 0 5.55 5.55l.91-.81a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    label: "Телефон",
    value: PHONE,
    href: PHONE_HREF,
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    label: "Режим работы",
    value: "Пн–Пт: 9:00 — 18:00",
    href: null,
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    label: "Адрес",
    value: "пер. Нарядный 14/2, Ростов-на-Дону",
    href: null,
  },
];

export default function ContactsClient() {
  return (
    <section className="relative pt-32 pb-24 px-6 min-h-screen overflow-hidden">
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ zIndex: 0 }}
      >
        <div
          className="absolute"
          style={{
            top: "10%",
            left: "20%",
            width: "480px",
            height: "480px",
            background: "radial-gradient(circle, rgba(220,38,38,0.06) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute"
          style={{
            bottom: "15%",
            right: "10%",
            width: "360px",
            height: "360px",
            background: "radial-gradient(circle, rgba(220,38,38,0.04) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute"
          style={{
            bottom: "5%",
            right: "30%",
            width: "300px",
            height: "300px",
            background: "radial-gradient(circle, rgba(220,38,38,0.03) 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
        />
      </div>

      <div className="max-w-[1200px] mx-auto relative" style={{ zIndex: 1 }}>

        {/* ── Hero ── */}
        <div className="mb-16 text-center lg:text-left">
          <Reveal direction="up">
            <div
              className="glass-pill inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-xs font-medium tracking-widest uppercase"
              style={{ color: "rgba(220,38,38,0.9)" }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#DC2626",
                  display: "inline-block",
                  boxShadow: "0 0 8px rgba(220,38,38,0.8)",
                }}
              />
              Всегда на связи
            </div>
          </Reveal>

          <Reveal direction="up" delay={0.08}>
            <h1
              className="font-bold tracking-tighter leading-[1.06] mb-5 text-white"
              style={{ fontSize: "clamp(3.5rem, 8vw, 6rem)" }}
            >
              Контакты
            </h1>
          </Reveal>

          <Reveal direction="up" delay={0.14}>
            <p
              className="text-lg leading-relaxed mx-auto lg:mx-0"
              style={{ color: "rgba(161,161,170,0.85)", maxWidth: 480 }}
            >
              Проконсультируем, рассчитаем стоимость проекта и ответим на любые вопросы по оборудованию.
            </p>
          </Reveal>
        </div>

        {/* ── Phone pill CTA ── */}
        <Reveal direction="up" delay={0.2}>
          <div className="flex justify-center lg:justify-start mb-16">
            <a
              href={PHONE_HREF}
              className="group relative glass-red hover-lift btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.875rem",
                padding: "1rem 2rem",
                borderRadius: "9999px",
                textDecoration: "none",
                transition: "box-shadow 300ms ease, transform 300ms var(--ease-quint)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                  "0 0 0 1px rgba(220,38,38,0.3), 0 8px 32px -4px rgba(220,38,38,0.25)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "";
              }}
              aria-label={`Позвонить по номеру ${PHONE}`}
            >
              {/* Icon */}
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "#DC2626",
                  color: "#fff",
                  flexShrink: 0,
                  boxShadow: "0 4px 16px rgba(220,38,38,0.45)",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.81a16 16 0 0 0 5.55 5.55l.91-.81a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </span>

              <span>
                <span
                  style={{
                    display: "block",
                    fontSize: "0.7rem",
                    fontWeight: 500,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "rgba(220,38,38,0.75)",
                    marginBottom: 2,
                  }}
                >
                  Позвонить
                </span>
                <span
                  style={{
                    display: "block",
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    color: "#fff",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {PHONE}
                </span>
              </span>

              {/* Subtle arrow */}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                style={{
                  color: "rgba(220,38,38,0.6)",
                  marginLeft: "0.25rem",
                  flexShrink: 0,
                  transition: "transform 200ms ease",
                }}
                className="group-hover:translate-x-1"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </Reveal>

        {/* ── Two-column layout ── */}
        <div className="grid lg:grid-cols-[1fr_1.35fr] gap-6 lg:gap-8 items-start">

          {/* Left: contact rows */}
          <div>
            <Reveal direction="left" delay={0.05}>
              <div
                className="glass-card rounded-2xl overflow-hidden"
                style={{ padding: "0.25rem" }}
              >
                {contactRows.map((row, i) => (
                  <div
                    key={i}
                    className="glass-inner hover-lift"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      padding: "1.25rem 1.5rem",
                      borderRadius: 14,
                      marginBottom: i < contactRows.length - 1 ? "0.25rem" : 0,
                      cursor: row.href ? "pointer" : "default",
                    }}
                  >
                    {/* Icon bubble */}
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: "rgba(220,38,38,0.08)",
                        border: "1px solid rgba(220,38,38,0.12)",
                        color: "rgba(220,38,38,0.8)",
                        flexShrink: 0,
                      }}
                    >
                      {row.icon}
                    </span>

                    <div style={{ minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 500,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          color: "rgba(113,113,122,0.9)",
                          marginBottom: 4,
                        }}
                      >
                        {row.label}
                      </p>
                      {row.href ? (
                        <a
                          href={row.href}
                          style={{
                            fontSize: "1.05rem",
                            fontWeight: 600,
                            color: "#fff",
                            textDecoration: "none",
                            letterSpacing: "-0.01em",
                            transition: "color 150ms ease",
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.color = "#f87171";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.color = "#fff";
                          }}
                        >
                          {row.value}
                        </a>
                      ) : (
                        <p
                          style={{
                            fontSize: "1rem",
                            fontWeight: 500,
                            color: "rgba(228,228,231,0.9)",
                            lineHeight: 1.4,
                          }}
                        >
                          {row.value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Response time notice + call CTA */}
            <Reveal direction="up" delay={0.25}>
              <div
                className="glass-card rounded-2xl mt-4"
                style={{ padding: "1.5rem" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.875rem",
                    marginBottom: "1.25rem",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "rgba(220,38,38,0.08)",
                      border: "1px solid rgba(220,38,38,0.12)",
                      color: "rgba(220,38,38,0.75)",
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M8 2v4M16 2v4M3 10h18M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z" />
                      <circle cx="12" cy="15" r="1" />
                    </svg>
                  </span>
                  <div>
                    <p
                      style={{
                        fontSize: "0.95rem",
                        fontWeight: 600,
                        color: "#fff",
                        marginBottom: 4,
                      }}
                    >
                      Обычно отвечаем в течение часа
                    </p>
                    <p
                      style={{
                        fontSize: "0.8rem",
                        color: "rgba(113,113,122,0.9)",
                        lineHeight: 1.5,
                      }}
                    >
                      В рабочие дни с 9:00 до 18:00 — всегда на связи.
                    </p>
                  </div>
                </div>

                <MagneticButton
                  href={PHONE_HREF}
                  className="btn"
                  aria-label="Позвонить нам"
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      width: "100%",
                      padding: "0.8rem 1.5rem",
                      background: "#DC2626",
                      color: "#fff",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      borderRadius: 10,
                      boxShadow: "0 6px 24px -4px rgba(220,38,38,0.45)",
                      transition: "background 200ms ease, box-shadow 200ms ease",
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.81a16 16 0 0 0 5.55 5.55l.91-.81a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    Позвонить
                  </span>
                </MagneticButton>
              </div>
            </Reveal>
          </div>

          {/* Right: Yandex map */}
          <Reveal direction="scale" delay={0.15}>
            <div
              className="glass-card rounded-2xl overflow-hidden"
              style={{
                height: "clamp(340px, 50vw, 520px)",
                padding: "0.35rem",
              }}
            >
              <iframe
                src={MAP_SRC}
                width="100%"
                height="100%"
                style={{
                  border: 0,
                  borderRadius: 14,
                  display: "block",
                  filter: "grayscale(30%) brightness(0.92) contrast(1.05)",
                }}
                loading="lazy"
                title="ДонЭлектроИнтел на карте"
                aria-label="Карта с расположением офиса ДонЭлектроИнтел"
              />
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  );
}
