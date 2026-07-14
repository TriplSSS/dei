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
    <footer className="relative z-10 mt-12 px-4 pb-5 pt-4 sm:px-6">
      <div className="mx-auto max-w-[1400px]">
        <div className="site-footer-panel glass-card grid gap-12 p-7 md:grid-cols-[1.4fr_1fr_1fr] md:p-10">
          <div>
            <Link href="/" className="text-3xl font-bold tracking-[-0.05em] text-white">DEI</Link>
            <p className="mt-4 max-w-[360px] text-sm leading-relaxed text-zinc-500">
              Оборудование для сварочных работ и промышленного освещения. Ростов-на-Дону, с 2006 года.
            </p>
          </div>

          <div>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-600">Разделы</p>
            <div className="grid gap-2.5">
              {links.map((link) => (
                <Link key={link.href} href={link.href} className="text-sm text-zinc-400 transition-colors hover:text-white">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-600">Контакты</p>
            <a href="tel:+79885807630" className="text-base font-medium text-white transition-colors hover:text-red-400">
              +7 (988) 580-76-30
            </a>
            <address className="mt-3 not-italic text-sm leading-relaxed text-zinc-500">
              пер. Нарядный, 14/2<br />Ростов-на-Дону, 344065
            </address>
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
