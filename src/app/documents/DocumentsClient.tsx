"use client";

import Link from "next/link";
import { useState } from "react";
import PageHeader from "@/components/PageHeader";

type DocItem = {
  title: string;
  subtitle: string;
  type: "naks" | "cert" | "patent" | "passport" | "declaration";
  year: string;
  available: boolean;
};

type DocumentFilter = "all" | "cert" | "passport";

const TYPE_LABELS: Record<DocItem["type"], string> = {
  naks: "Аттестат НАКС",
  cert: "Сертификат",
  patent: "Патент",
  passport: "Техпаспорт",
  declaration: "Декларация",
};

const DOCS: DocItem[] = [
  { title: "Аттестат НАКС — ПРОТОН-ДЭИ ВДИ 200", subtitle: "Допуск к сварке ответственных конструкций, нефтегазового оборудования и трубопроводов.", type: "naks", year: "2018", available: true },
  { title: "Сертификат соответствия — ВДИ 200", subtitle: "Соответствие ГОСТ Р МЭК 60974-1. Оборудование для дуговой сварки.", type: "cert", year: "2022", available: true },
  { title: "Сертификат соответствия — LED-DEI", subtitle: "Соответствие ТР ТС 004/2011 и ТР ТС 020/2011.", type: "cert", year: "2023", available: true },
  { title: "Патент — силовая схема инвертора", subtitle: "Запатентованное схемотехническое решение стабилизации сварочной дуги.", type: "patent", year: "2016", available: false },
  { title: "Технический паспорт — ПРОТОН-ДЭИ ВДИ 200", subtitle: "Эксплуатация, техническое обслуживание и устранение неисправностей.", type: "passport", year: "2024", available: true },
  { title: "Технический паспорт — ПРОТОН-ДЭИ ВДУ 315", subtitle: "Руководство по эксплуатации полуавтомата MIG/MAG.", type: "passport", year: "2023", available: true },
  { title: "Технический паспорт — LED-DEI-120", subtitle: "Характеристики и инструкция по монтажу промышленного светильника.", type: "passport", year: "2024", available: true },
  { title: "Декларация — центраторы ЦЗН", subtitle: "Соответствие требованиям безопасности ТР ТС 010/2011.", type: "declaration", year: "2021", available: true },
];

function DocumentIcon({ type }: { type: DocItem["type"] }) {
  if (type === "naks") return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>;
  if (type === "patent") return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><circle cx="12" cy="8" r="6"/><path d="m15.5 12.9 1.5 9.1-5-3-5 3 1.5-9.1"/></svg>;
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8"/></svg>;
}

export default function DocumentsClient() {
  const [filter, setFilter] = useState<DocumentFilter>("all");
  const visibleDocuments = DOCS.filter((document) => {
    if (filter === "cert") return document.type === "cert" || document.type === "naks" || document.type === "declaration";
    if (filter === "passport") return document.type === "passport";
    return true;
  });

  return (
    <div className="internal-page-v11 documents-page-v11">
      <PageHeader
        centered
        title="Сертификаты и документация"
        description="Аттестаты, сертификаты соответствия, патенты и технические паспорта на оборудование DEI."
        meta={[
          { label: "В каталоге", value: `${DOCS.length} документов` },
          { label: "Формат", value: "электронная копия" },
          { label: "Получение", value: "по запросу" },
        ]}
      />

      <main className="internal-shell-v11 documents-content-v11">
        <section className="documents-feature-v11">
          <div className="documents-feature-v11__icon"><DocumentIcon type="naks" /></div>
          <div><h2>ПРОТОН-ДЭИ ВДИ 200 аттестован НАКС</h2><p>Оборудование допущено к сварке трубопроводов нефтегазовой отрасли, ответственных металлоконструкций и оборудования под давлением.</p></div>
          <Link href="/contacts">Запросить копию <span aria-hidden="true">↗</span></Link>
        </section>

        <div className="documents-toolbar-v11">
          <div>
            <button type="button" className={filter === "all" ? "is-active" : undefined} aria-pressed={filter === "all"} onClick={() => setFilter("all")}>Все документы</button>
            <button type="button" className={filter === "cert" ? "is-active" : undefined} aria-pressed={filter === "cert"} onClick={() => setFilter("cert")}>Сертификаты</button>
            <button type="button" className={filter === "passport" ? "is-active" : undefined} aria-pressed={filter === "passport"} onClick={() => setFilter("passport")}>Техпаспорта</button>
          </div>
          <span>{visibleDocuments.length} файлов</span>
        </div>

        <section className="documents-grid-v11" aria-label="Список документов">
          {visibleDocuments.map((document) => (
            <article key={document.title} className="document-card-v11">
              <div className="document-card-v11__top"><span className="document-card-v11__icon"><DocumentIcon type={document.type} /></span><span className="document-card-v11__year">{document.year}</span></div>
              <p className="document-card-v11__type">{TYPE_LABELS[document.type]}</p>
              <h2>{document.title}</h2>
              <p>{document.subtitle}</p>
              {document.available ? <Link href="/contacts">Запросить документ <span aria-hidden="true">↗</span></Link> : <span className="document-card-v11__pending">Подготовим по запросу</span>}
            </article>
          ))}
        </section>

        <section className="page-cta-v11">
          <div><h2>Подготовим актуальный документ в течение рабочего дня</h2></div>
          <Link href="/contacts">Отправить запрос <span aria-hidden="true">↗</span></Link>
        </section>
      </main>
    </div>
  );
}
