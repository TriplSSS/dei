import Reveal from "@/components/Reveal";

type DocItem = {
  title: string;
  subtitle: string;
  type: "naks" | "cert" | "patent" | "passport" | "declaration";
  year: string;
  available: boolean;
};

const TYPE_LABELS: Record<DocItem["type"], string> = {
  naks:        "Аттестат НАКС",
  cert:        "Сертификат",
  patent:      "Патент",
  passport:    "Техпаспорт",
  declaration: "Декларация",
};

const TYPE_COLORS: Record<DocItem["type"], string> = {
  naks:        "text-red-400 border-red-500/25",
  cert:        "text-zinc-400 border-white/10",
  patent:      "text-zinc-400 border-white/10",
  passport:    "text-zinc-400 border-white/10",
  declaration: "text-zinc-400 border-white/10",
};

const DOCS: DocItem[] = [
  {
    title: "Аттестат НАКС — ПРОТОН-ДЭИ ВДИ 200",
    subtitle: "Национальное Агентство Контроля Сварки. Допуск к сварке ответственных конструкций, нефтегазового оборудования и трубопроводов.",
    type: "naks",
    year: "2018",
    available: true,
  },
  {
    title: "Сертификат соответствия — ВДИ 200",
    subtitle: "Соответствие ГОСТ Р МЭК 60974-1. Сварочное оборудование для дуговой сварки.",
    type: "cert",
    year: "2022",
    available: true,
  },
  {
    title: "Сертификат соответствия — LED-DEI серия",
    subtitle: "Соответствие ТР ТС 004/2011 и ТР ТС 020/2011. Низковольтное оборудование и электромагнитная совместимость.",
    type: "cert",
    year: "2023",
    available: true,
  },
  {
    title: "Патент на изобретение — силовая схема инвертора",
    subtitle: "Запатентованное схемотехническое решение, обеспечивающее стабилизацию дуги в диапазоне ±15% напряжения питания.",
    type: "patent",
    year: "2016",
    available: false,
  },
  {
    title: "Технический паспорт — ПРОТОН-ДЭИ ВДИ 200",
    subtitle: "Полное руководство по эксплуатации, техническому обслуживанию и устранению неисправностей.",
    type: "passport",
    year: "2024",
    available: true,
  },
  {
    title: "Технический паспорт — ПРОТОН-ДЭИ ВДУ 315",
    subtitle: "Руководство по эксплуатации полуавтомата MIG/MAG.",
    type: "passport",
    year: "2023",
    available: true,
  },
  {
    title: "Технический паспорт — LED-DEI-120",
    subtitle: "Технические характеристики и инструкция по монтажу промышленного светильника.",
    type: "passport",
    year: "2024",
    available: true,
  },
  {
    title: "Декларация о соответствии — центраторы ЦЗН",
    subtitle: "Соответствие требованиям безопасности ТР ТС 010/2011. Машины и оборудование.",
    type: "declaration",
    year: "2021",
    available: true,
  },
];

function DocIcon({ type }: { type: DocItem["type"] }) {
  if (type === "naks") return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <polyline points="9 12 11 14 15 10"/>
    </svg>
  );
  if (type === "patent") return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="8" r="6"/>
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
    </svg>
  );
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  );
}

export default function DocumentsClient() {
  return (
    <>
      <section className="page-intro">
        <div className="page-intro-inner">
          <Reveal direction="up">
            <p className="page-kicker">Документы</p>
          </Reveal>
          <Reveal direction="up" delay={0.06}>
            <h1 className="page-title">Сертификаты и документация</h1>
          </Reveal>
          <Reveal direction="up" delay={0.12}>
            <p className="page-lead">
              Аттестаты НАКС, сертификаты соответствия, патенты и технические паспорта на всю продукцию DEI.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section-shell pb-24 md:pb-32">
        <div className="max-w-[1000px]">
          <Reveal direction="up" delay={0}>
            <div className="documents-feature surface mb-8 p-7 md:p-10">
              <div className="flex items-start gap-5">
                <div className="shrink-0 flex h-11 w-11 items-center justify-center border border-red-500/30 text-red-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <polyline points="9 12 11 14 15 10"/>
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-medium uppercase tracking-widest text-red-400">Аттестат НАКС</span>
                    <span className="border border-white/10 px-2 py-0.5 text-[10px] text-zinc-500">Действующий</span>
                  </div>
                  <h2 className="text-lg font-semibold text-white mb-1">ПРОТОН-ДЭИ ВДИ 200 — аттестован НАКС</h2>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Единственный в модельном ряду инвертор, прошедший полную аттестацию Национального Агентства Контроля Сварки.
                    Допущен к сварке трубопроводов нефтегазовой отрасли, ответственных металлоконструкций и оборудования под давлением.
                  </p>
                  <a
                    href="/contacts"
                    className="inline-flex items-center gap-2 text-red-400 hover:text-red-300 text-sm mt-4 transition-colors"
                  >
                    Запросить копию аттестата →
                  </a>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="documents-list surface">
            {DOCS.map((doc, i) => (
              <Reveal key={doc.title} direction="up" delay={i * 0.04}>
                <div className="document-row group flex items-start gap-5 border-b border-white/[0.07] px-5 py-6 last:border-b-0 md:px-7">
                  <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center border ${TYPE_COLORS[doc.type]}`}>
                    <DocIcon type={doc.type} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${TYPE_COLORS[doc.type]}`}>
                        {TYPE_LABELS[doc.type]}
                      </span>
                      <span className="text-[10px] text-zinc-600">{doc.year}</span>
                    </div>
                    <p className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">{doc.title}</p>
                    <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{doc.subtitle}</p>
                  </div>

                  <div className="shrink-0">
                    {doc.available ? (
                      <a
                        href="/contacts"
                        className="btn whitespace-nowrap border-b border-white/20 px-1 py-1.5 text-xs text-zinc-400 transition-colors hover:border-red-500 hover:text-white"
                      >
                        Запросить
                      </a>
                    ) : (
                      <span className="text-xs text-zinc-700 px-3 py-1.5 whitespace-nowrap">По запросу</span>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal direction="up" delay={0.1} className="mt-10">
            <div className="flex flex-col items-start justify-between gap-5 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
              <p className="text-zinc-500 text-sm mb-4">
                Нужен документ, которого нет в списке? Отправьте запрос — подготовим в течение 1 рабочего дня.
              </p>
              <a
                href="/contacts"
                className="btn inline-flex shrink-0 items-center gap-2 bg-red-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-500"
              >
                Запросить документ
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
