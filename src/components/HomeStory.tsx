"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import CountUp from "@/components/CountUp";
import styles from "./HomeStory.module.css";

const metrics = [
  { id: "founded", value: "2006", label: "Год основания", note: "Ростов-на-Дону", href: "/about" },
  { id: "experience", value: "20+", label: "Лет инженерной практики", note: "Собственная экспертиза", href: "/about" },
  { id: "naks", value: "НАКС", label: "Аттестация оборудования", note: "Подтверждённые документы", href: "/documents" },
  { id: "delivery", value: "РФ", label: "География поставок", note: "Работаем по всей России", href: "/contacts" },
] as const;

const principles = [
  {
    number: "01",
    title: "Инженерный подбор",
    caption: "Сначала задача — потом модель",
    text: "Разбираем режим работы, среду, ограничения объекта и ожидаемый результат. Это помогает не переплачивать за лишние характеристики и не терять надёжность.",
    points: ["условия эксплуатации", "рабочая нагрузка", "требования к результату"],
    signal: "Задача → конфигурация",
  },
  {
    number: "02",
    title: "Собственная экспертиза",
    caption: "Проверяем то, что предлагаем",
    text: "Опираемся на производственный опыт и контроль ключевых параметров внутри компании. В предложении остаются только решения, которые мы готовы объяснить и поддержать.",
    points: ["контроль параметров", "понятная комплектация", "техническая аргументация"],
    signal: "Проверка → уверенность",
  },
  {
    number: "03",
    title: "Сопровождение",
    caption: "Остаёмся после поставки",
    text: "Помогаем согласовать комплектацию, подготовиться к монтажу и запустить оборудование. После поставки инженерная связь с DEI не заканчивается.",
    points: ["подготовка к запуску", "консультация инженера", "поддержка эксплуатации"],
    signal: "Поставка → работа",
  },
] as const;

const process = [
  {
    number: "01",
    title: "Задача",
    short: "Фиксируем исходные данные",
    text: "Уточняем объект, режим работы, ограничения и критерии результата. Если данных не хватает — помогаем собрать минимальный технический бриф.",
    result: "Результат: понятная постановка задачи",
  },
  {
    number: "02",
    title: "Подбор",
    short: "Сравниваем рабочие варианты",
    text: "Отбираем подходящие конфигурации и объясняем разницу без перегруженного технического языка. Вы видите, за что платите и какой результат получите.",
    result: "Результат: техническое предложение",
  },
  {
    number: "03",
    title: "Поставка",
    short: "Согласовываем комплект и сроки",
    text: "Подтверждаем состав, наличие, срок подготовки и способ доставки. Оплата и окончательные условия согласовываются с менеджером — на сайте нет онлайн-оплаты.",
    result: "Результат: согласованная комплектация",
  },
  {
    number: "04",
    title: "Запуск",
    short: "Помогаем ввести в работу",
    text: "Передаём рекомендации по монтажу и эксплуатации, отвечаем на вопросы специалистов объекта и остаёмся на связи после запуска.",
    result: "Результат: оборудование работает",
  },
] as const;

const ease = [0.22, 1, 0.36, 1] as const;

function updateSpotlight(event: React.PointerEvent<HTMLAnchorElement>) {
  const bounds = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty("--pointer-x", `${event.clientX - bounds.left}px`);
  event.currentTarget.style.setProperty("--pointer-y", `${event.clientY - bounds.top}px`);
}

export function HomeStory() {
  const [activePrinciple, setActivePrinciple] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const principle = principles[activePrinciple];
  const step = process[activeStep];

  return (
    <MotionConfig reducedMotion="user">
      <div className={styles.story}>
        <section className={styles.metrics} aria-labelledby="metrics-title">
          <div className={styles.shell}>
            <motion.div
              className={styles.metricsIntro}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.65, ease }}
            >
              <p className={styles.kicker}>DEI в цифрах</p>
              <h2 id="metrics-title">Опыт, который можно проверить</h2>
              <span>Наведите на показатель, чтобы открыть связанный раздел</span>
            </motion.div>

            <div className={styles.metricsGrid}>
              {metrics.map((metric, index) => (
                <motion.div
                  key={metric.id}
                  initial={{ opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.65, delay: index * 0.07, ease }}
                >
                  <Link href={metric.href} className={styles.metricCard} onPointerMove={updateSpotlight}>
                    <span className={styles.metricIndex}>0{index + 1}</span>
                    <strong>
                      {metric.id === "experience" ? <><CountUp target={20} />+</> : metric.value}
                    </strong>
                    <span className={styles.metricLabel}>{metric.label}</span>
                    <span className={styles.metricNote}>{metric.note}</span>
                    <span className={styles.metricArrow} aria-hidden="true">↗</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.principles} aria-labelledby="principles-title">
          <div className={`${styles.shell} ${styles.principlesLayout}`}>
            <div className={styles.sectionLead}>
              <motion.div
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.7, ease }}
              >
                <p className={styles.kicker}>Принципы работы</p>
                <h2 id="principles-title">Не обещаем лишнего.<br />Показываем логику решения.</h2>
                <p>Выберите принцип — панель покажет, как он работает на практике.</p>
              </motion.div>

              <div className={styles.principleTabs} role="group" aria-label="Принципы работы DEI">
                {principles.map((item, index) => (
                  <button
                    key={item.number}
                    type="button"
                    className={index === activePrinciple ? styles.isActive : undefined}
                    aria-pressed={index === activePrinciple}
                    onClick={() => setActivePrinciple(index)}
                  >
                    <span>{item.number}</span>
                    <strong>{item.title}</strong>
                    <i aria-hidden="true">↗</i>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.principlePanel} aria-live="polite">
              <div className={styles.signalVisual} aria-hidden="true">
                <span className={styles.signalCore}>DEI</span>
                <span className={styles.signalOrbitOne} />
                <span className={styles.signalOrbitTwo} />
                <span className={styles.signalSweep} />
                <i className={styles.signalDot} />
              </div>
              <AnimatePresence mode="wait">
                <motion.article
                  key={principle.number}
                  initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -12, filter: "blur(5px)" }}
                  transition={{ duration: 0.42, ease }}
                >
                  <div className={styles.panelMeta}>
                    <span>PRINCIPLE / {principle.number}</span>
                    <span>{principle.signal}</span>
                  </div>
                  <p className={styles.panelCaption}>{principle.caption}</p>
                  <h3>{principle.title}</h3>
                  <p className={styles.panelText}>{principle.text}</p>
                  <ul>
                    {principle.points.map((point) => <li key={point}>{point}</li>)}
                  </ul>
                </motion.article>
              </AnimatePresence>
            </div>
          </div>
        </section>

        <section className={styles.process} aria-labelledby="process-title">
          <div className={styles.shell}>
            <motion.div
              className={styles.processHead}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, ease }}
            >
              <div>
                <p className={styles.kicker}>Процесс</p>
                <h2 id="process-title">Четыре шага<br />до рабочего результата</h2>
              </div>
              <p>Нажмите на этап, чтобы увидеть, что именно происходит и какой результат вы получаете.</p>
            </motion.div>

            <div className={styles.processConsole}>
              <div className={styles.processNav} role="group" aria-label="Этапы работы">
                {process.map((item, index) => (
                  <button
                    key={item.number}
                    type="button"
                    className={index === activeStep ? styles.isActive : undefined}
                    aria-pressed={index === activeStep}
                    onClick={() => setActiveStep(index)}
                  >
                    <span>{item.number}</span>
                    <div><strong>{item.title}</strong><small>{item.short}</small></div>
                    <i aria-hidden="true" />
                  </button>
                ))}
              </div>

              <div className={styles.processStage} aria-live="polite">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step.number}
                    className={styles.processStageContent}
                    initial={{ opacity: 0, x: 22 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -18 }}
                    transition={{ duration: 0.42, ease }}
                  >
                    <span className={styles.processNumber}>{step.number}</span>
                    <p>Этап {step.number} / 04</p>
                    <h3>{step.title}</h3>
                    <div className={styles.processLine}><motion.i layoutId="process-signal" /></div>
                    <p className={styles.processDescription}>{step.text}</p>
                    <strong className={styles.processResult}>{step.result}</strong>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.cta} aria-labelledby="home-cta-title">
          <div className={`${styles.shell} ${styles.ctaCard}`}>
            <div className={styles.ctaEnergy} aria-hidden="true">
              <span /><span /><span />
              <i />
            </div>
            <motion.div
              className={styles.ctaCopy}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, ease }}
            >
              <p className={styles.kicker}>Следующий шаг</p>
              <h2 id="home-cta-title">Опишите задачу.<br />Инженер DEI предложит решение.</h2>
              <p>Без регистрации и онлайн-оплаты. Вы оставляете контакты — мы уточняем детали и готовим предложение.</p>
            </motion.div>
            <div className={styles.ctaActions}>
              <a href="tel:+79885807630" className={styles.ctaPrimary}>Позвонить <span>+7 (988) 580-76-30</span></a>
              <Link href="/contacts" className={styles.ctaSecondary}>Контакты DEI <span aria-hidden="true">↗</span></Link>
            </div>
          </div>
        </section>
      </div>
    </MotionConfig>
  );
}
