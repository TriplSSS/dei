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
    <footer className="site-footer-v10">
      <div className="site-footer-v10__frame">
        <div className="site-footer-v10__identity">
          <Link href="/" className="site-footer-v10__logo">DEI</Link>
          <p>Промышленное оборудование<br />Ростов-на-Дону · 2006</p>
        </div>

        <nav className="site-footer-v10__nav" aria-label="Навигация в подвале">
          {links.map((link, index) => (
            <Link key={link.href} href={link.href}>
              <span>0{index + 1}</span>{link.label}
            </Link>
          ))}
        </nav>

        <div className="site-footer-v10__contact">
          <span>Отдел продаж</span>
          <a href="tel:+79885807630">+7 (988) 580-76-30</a>
          <address>пер. Нарядный, 14/2<br />Ростов-на-Дону</address>
        </div>

        <div className="site-footer-v10__meta">
          <span>© 2006–{new Date().getFullYear()} ООО «ДонЭлектроИнтел»</span>
          <span>Пн–Пт · 09:00–18:00</span>
          <Link href="/contacts">Запросить консультацию <span aria-hidden="true">↗</span></Link>
        </div>
      </div>
    </footer>
  );
}
