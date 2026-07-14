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
    <footer className="site-footer relative z-10 mt-12 px-4 pb-5 pt-4 sm:px-6">
      <div className="mx-auto max-w-[1400px]">
        <div className="site-footer-panel overflow-hidden">
          <div className="site-footer-brand grid gap-8 p-7 md:grid-cols-[1fr_auto] md:items-end md:p-10">
            <Link href="/" className="site-footer-wordmark text-white">DEI</Link>
            <p className="max-w-[390px] text-sm leading-relaxed text-zinc-400 md:text-right">
              Сварочное оборудование и промышленное освещение.<br />Ростов-на-Дону · с 2006 года.
            </p>
          </div>

          <div className="site-footer-grid grid md:grid-cols-[1.4fr_1fr]">
            <div className="site-footer-links p-7 md:p-10">
              <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">Разделы</p>
              <div className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-3">
                {links.map((link) => (
                  <Link key={link.href} href={link.href} className="text-sm text-zinc-400 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="site-footer-contact p-7 md:p-10">
              <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-red-400">Прямой контакт</p>
              <a href="tel:+79885807630" className="site-footer-phone text-white transition-colors hover:text-red-400">
                +7 (988) 580-76-30
              </a>
              <address className="mt-4 not-italic text-sm leading-relaxed text-zinc-500">
                пер. Нарядный, 14/2<br />Ростов-на-Дону, 344065
              </address>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 px-2 text-xs text-zinc-700 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2006–{new Date().getFullYear()} ДонЭлектроИнтел</span>
          <Link href="/contacts" className="transition-colors hover:text-zinc-400">Связаться с компанией</Link>
          <span>Все права защищены</span>
        </div>
      </div>
    </footer>
  );
}
