import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-14 px-6 border-t border-zinc-800/50 bg-[#0a0a0c]">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div>
            <Link href="/" className="text-lg font-bold tracking-tight text-white">
              DEI<span className="text-red-500">.</span>
            </Link>
            <p className="text-zinc-500 text-sm mt-3 leading-relaxed max-w-[240px]">
              ООО ДонЭлектроИнтел. Сварочное оборудование, светодиодные светильники и инструмент. Ростов-на-Дону.
            </p>
          </div>
          <div>
            <h4 className="text-xs text-zinc-500 uppercase tracking-wider mb-4">Навигация</h4>
            {[
              { href: "/", label: "Главная" },
              { href: "/#catalog", label: "Каталог" },
              { href: "/about", label: "О компании" },
              { href: "/contacts", label: "Контакты" },
            ].map((l) => (
              <Link key={l.label} href={l.href} className="block text-zinc-400 text-sm mb-2.5 hover:text-white transition-colors duration-200">
                {l.label}
              </Link>
            ))}
          </div>
          <div>
            <h4 className="text-xs text-zinc-500 uppercase tracking-wider mb-4">Продукция</h4>
            {["Сварочное оборудование", "Светодиодные светильники", "Центраторы для труб", "Расходные материалы"].map((l) => (
              <span key={l} className="block text-zinc-500 text-sm mb-2.5">{l}</span>
            ))}
          </div>
          <div>
            <h4 className="text-xs text-zinc-500 uppercase tracking-wider mb-4">Контакты</h4>
            <a href="tel:+79885807630" className="block text-zinc-400 text-sm mb-2.5 hover:text-white transition-colors duration-200">
              +7 (988) 580-76-30
            </a>
            <p className="text-zinc-500 text-sm mb-2.5">
              пер. Нарядный, 14/2<br />Ростов-на-Дону, 344065
            </p>
          </div>
        </div>
        <div className="border-t border-zinc-800/50 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-zinc-600">
          <span>2026 ООО ДонЭлектроИнтел</span>
          <span>ИНН / ОГРН по запросу</span>
        </div>
      </div>
    </footer>
  );
}
