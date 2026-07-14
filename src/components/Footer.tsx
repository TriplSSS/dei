import Link from "next/link";

const links = [
  { href: "/catalog", label: "Каталог" },
  { href: "/calculator", label: "Калькулятор" },
  { href: "/documents", label: "Документы" },
  { href: "/about", label: "О компании" },
  { href: "/contacts", label: "Контакты" },
];

export default function Footer() {
  return (
    <footer className="site-footer-v11">
      <div className="site-footer-v11__inner">
        <div className="site-footer-v11__cta">
          <div>
            <span>Нужна помощь с выбором?</span>
            <h2>Подберём оборудование под вашу задачу</h2>
          </div>
          <Link href="/contacts">Получить консультацию <span aria-hidden="true">↗</span></Link>
        </div>

        <div className="site-footer-v11__grid">
          <div className="site-footer-v11__brand">
            <Link href="/">DEI</Link>
            <p>Сварочное оборудование и промышленное освещение собственного производства.</p>
            <span>Ростов-на-Дону · с 2006 года</span>
          </div>

          <nav className="site-footer-v11__links" aria-label="Навигация в подвале">
            <strong>Навигация</strong>
            {links.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
          </nav>

          <div className="site-footer-v11__links">
            <strong>Покупателям</strong>
            <Link href="/catalog">Оборудование</Link>
            <Link href="/documents">Сертификаты</Link>
            <Link href="/calculator">Расчёт освещения</Link>
            <Link href="/checkout">Оформление заказа</Link>
          </div>

          <div className="site-footer-v11__contacts">
            <strong>Контакты</strong>
            <a href="tel:+79885807630">+7 (988) 580-76-30</a>
            <address>пер. Нарядный, 14/2<br />Ростов-на-Дону</address>
            <span>Пн–Пт · 09:00–18:00</span>
          </div>
        </div>

        <div className="site-footer-v11__bottom">
          <span>© 2006–{new Date().getFullYear()} ООО «ДонЭлектроИнтел»</span>
          <span>Промышленное оборудование · Россия</span>
        </div>
      </div>
    </footer>
  );
}
