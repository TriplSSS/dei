import Link from "next/link";

const navColumns = [
  {
    title: "Продукция",
    links: [
      { href: "/catalog?category=welding", label: "Сварочный аппарат Протон" },
      { href: "/catalog?category=light", label: "Светодиодный светильник Кобра" },
    ],
  },
  {
    title: "Компания",
    links: [
      { href: "/", label: "Главная" },
      { href: "/about", label: "О компании" },
      { href: "/contacts", label: "Контакты" },
    ],
  },
];

export default function Footer() {
  return (
    <>
      <div className="h-px bg-gradient-to-r from-transparent via-red-600/20 to-transparent" />
      <footer
        className="pt-14 pb-8 px-6 bg-[#09090b]"
      >
      <div className="max-w-[1400px] mx-auto">
        {/* Верхняя сетка */}
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-10 mb-12">
          {/* Логотип + описание */}
          <div>
            <Link
              href="/"
              className="inline-block text-3xl font-bold tracking-tight text-white mb-4 transition-opacity duration-200 hover:opacity-80"
            >
              DEI
            </Link>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-[260px]">
              ООО ДонЭлектроИнтел — сварочное оборудование и светодиодные
              светильники. Ростов-на-Дону.
            </p>
          </div>

          {/* Навигационные колонки */}
          {navColumns.map((col) => (
            <div key={col.title}>
              <h4 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-4">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-zinc-400 transition-colors duration-200 hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Контакты */}
          <div>
            <h4 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-4">
              Контакты
            </h4>
            <a
              href="tel:+79885807630"
              className="block text-sm text-zinc-400 mb-3 transition-colors duration-200 hover:text-[#DC2626]"
            >
              +7 (988) 580-76-30
            </a>
            <address className="not-italic text-sm text-zinc-500 leading-relaxed">
              пер. Нарядный, 14/2
              <br />
              Ростов-на-Дону, 344065
            </address>
          </div>
        </div>

        {/* Нижняя строка */}
        <div
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          className="pt-6 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-zinc-600"
        >
          <span>© 2006–{new Date().getFullYear()} ДонЭлектроИнтел</span>
          <Link
            href="/contacts"
            className="transition-colors duration-200 hover:text-zinc-400"
          >
            Написать нам →
          </Link>
          <span>Все права защищены</span>
        </div>
      </div>
    </footer>
    </>
  );
}
