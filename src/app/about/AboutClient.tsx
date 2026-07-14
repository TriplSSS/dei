import Link from "next/link";
import PageHeader from "@/components/PageHeader";

const principles = [
  { icon: "01", title: "Инженерный подход", text: "Сначала разбираемся в задаче и условиях эксплуатации, затем предлагаем оборудование." },
  { icon: "02", title: "Контроль качества", text: "Проверяем ключевые рабочие параметры и отвечаем за соответствие комплектации." },
  { icon: "03", title: "Поддержка", text: "Остаёмся на связи после поставки и помогаем с запуском оборудования." },
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
    <div className="internal-page-v11 about-page-v11">
      <PageHeader
        centered
        title="Делаем оборудование, которое работает"
        description="ДонЭлектроИнтел — российская инженерная компания из Ростова-на-Дону. Разрабатываем, производим и поставляем оборудование с 2006 года."
        meta={[
          { label: "На рынке", value: "с 2006 года" },
          { label: "Формат", value: "B2B и частные заказчики" },
          { label: "Поставка", value: "по России" },
        ]}
      />

      <main className="internal-shell-v11 about-content-v11">
        <section className="about-story-v11">
          <div className="about-story-v11__copy">
            <h2>От реальной задачи — к рабочему решению</h2>
            <p>Мы не ограничиваемся продажей готовой позиции. Уточняем режим работы, условия объекта и требования к результату, чтобы оборудование не оказалось случайным выбором.</p>
            <p>Собственная инженерная экспертиза помогает говорить с производством на одном языке и предлагать решения без лишних обещаний.</p>
            <Link href="/catalog">Смотреть оборудование <span aria-hidden="true">↗</span></Link>
          </div>
          <div className="about-story-v11__visual" aria-hidden="true">
            <div className="about-story-v11__mark">DEI</div>
            <span>Ростов-на-Дону</span>
            <strong>2006</strong>
          </div>
        </section>

        <section className="about-principles-v11">
          <div className="section-head-v11"><div><h2>Три принципа работы</h2></div><p>Понятный процесс от первого обращения до поставки.</p></div>
          <div className="about-principles-v11__grid">
            {principles.map((item) => (
              <article key={item.title}>
                <span>{item.icon}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="about-timeline-v11">
          <div className="section-head-v11"><div><h2>Как развивалась компания</h2></div></div>
          <div className="about-timeline-v11__list">
            {timeline.map(([year, text]) => <article key={year}><time>{year}</time><p>{text}</p></article>)}
          </div>
        </section>

        <section className="page-cta-v11">
          <div><h2>Подберём оборудование и подготовим расчёт</h2></div>
          <Link href="/contacts">Связаться с нами <span aria-hidden="true">↗</span></Link>
        </section>
      </main>
    </div>
  );
}
