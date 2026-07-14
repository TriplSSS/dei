import Link from "next/link";
import PageHeader from "@/components/PageHeader";

const PHONE = "+7 (988) 580-76-30";
const PHONE_HREF = "tel:+79885807630";
const MAP_URL = "https://yandex.ru/maps/?text=%D0%BF%D0%B5%D1%80.%20%D0%9D%D0%B0%D1%80%D1%8F%D0%B4%D0%BD%D1%8B%D0%B9%2014%2F2%2C%20%D0%A0%D0%BE%D1%81%D1%82%D0%BE%D0%B2-%D0%BD%D0%B0-%D0%94%D0%BE%D0%BD%D1%83";

export default function ContactsClient() {
  return (
    <div className="internal-page-v11 contacts-page-v11">
      <PageHeader
        centered
        eyebrow="Контакты"
        title="Давайте обсудим вашу задачу"
        description="Позвоните напрямую или подготовьте короткое описание объекта. Инженер уточнит параметры и предложит следующий шаг."
        meta={[
          { label: "Ответ", value: "обычно до 1 часа" },
          { label: "График", value: "Пн–Пт, 09:00–18:00" },
          { label: "Часовой пояс", value: "Москва" },
        ]}
      />

      <main className="internal-shell-v11 contacts-content-v11">
        <section className="contacts-grid-v11">
          <article className="contacts-primary-v11">
            <span className="contacts-status-v11"><i />Отдел продаж на связи</span>
            <p>Телефон</p>
            <a href={PHONE_HREF} className="contacts-primary-v11__phone">{PHONE}</a>
            <span>Звонок — самый быстрый способ уточнить наличие, комплектацию и сроки.</span>
            <a href={PHONE_HREF} className="contacts-primary-v11__button">Позвонить сейчас</a>
          </article>

          <article className="contact-card-v11">
            <span className="v11-kicker">Адрес</span>
            <h2>Ростов-на-Дону</h2>
            <p>пер. Нарядный, 14/2<br />Офис и производство DEI</p>
            <a href={MAP_URL} target="_blank" rel="noreferrer">Открыть в Яндекс Картах <span aria-hidden="true">↗</span></a>
          </article>

          <article className="contact-card-v11">
            <span className="v11-kicker">Режим работы</span>
            <h2>Пн–Пт</h2>
            <p>09:00–18:00<br />Суббота и воскресенье — выходные</p>
            <Link href="/catalog">Перейти в каталог <span aria-hidden="true">↗</span></Link>
          </article>
        </section>

        <section className="contacts-process-v11">
          <div className="section-head-v11"><div><span className="v11-kicker">Как начать</span><h2>Три шага до предложения</h2></div><p>Достаточно базовой информации — остальное уточним вместе.</p></div>
          <div className="contacts-process-v11__grid">
            <article><span>01</span><h3>Опишите задачу</h3><p>Что нужно сваривать или освещать, где будет работать оборудование.</p></article>
            <article><span>02</span><h3>Уточним параметры</h3><p>Зададим несколько вопросов по режиму, мощности и комплектации.</p></article>
            <article><span>03</span><h3>Подготовим расчёт</h3><p>Предложим вариант, подтвердим стоимость и срок поставки.</p></article>
          </div>
        </section>

        <section className="page-cta-v11">
          <div><span>Уже знаете, что нужно?</span><h2>Добавьте товары в корзину — подготовим счёт</h2></div>
          <Link href="/catalog">Открыть каталог <span aria-hidden="true">↗</span></Link>
        </section>
      </main>
    </div>
  );
}
