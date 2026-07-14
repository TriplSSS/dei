"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";

type RoomType = { key: string; label: string; lux: number; kz: number; description: string };
type LuminaireModel = { name: string; power: number; flux: number; price: number };

const ROOM_TYPES: RoomType[] = [
  { key: "factory", label: "Производственный цех", lux: 300, kz: 1.5, description: "Точные работы и сборка" },
  { key: "warehouse", label: "Склад", lux: 200, kz: 1.4, description: "Хранение и погрузка" },
  { key: "office", label: "Офис / лаборатория", lux: 500, kz: 1.4, description: "Документы и компьютеры" },
  { key: "parking", label: "Парковка / гараж", lux: 100, kz: 1.3, description: "Закрытые автостоянки" },
  { key: "street", label: "Улица / территория", lux: 30, kz: 1.5, description: "Проезды и площадки" },
  { key: "corridor", label: "Коридор / переход", lux: 150, kz: 1.4, description: "Проходы и техпомещения" },
];

const MODELS: LuminaireModel[] = [
  { name: "LED-DEI-40 Склад", power: 40, flux: 5200, price: 3400 },
  { name: "LED-DEI-60 Street", power: 60, flux: 8000, price: 5800 },
  { name: "LED-DEI-120", power: 120, flux: 15600, price: 8200 },
];

export default function CalculatorClient() {
  const [length, setLength] = useState("20");
  const [width, setWidth] = useState("15");
  const [height, setHeight] = useState("6");
  const [roomType, setRoomType] = useState("factory");
  const [model, setModel] = useState("LED-DEI-120");

  const result = useMemo(() => {
    const roomLength = parseFloat(length) || 0;
    const roomWidth = parseFloat(width) || 0;
    const roomHeight = parseFloat(height) || 0;
    if (roomLength <= 0 || roomWidth <= 0 || roomHeight <= 0) return null;

    const selectedRoom = ROOM_TYPES.find((item) => item.key === roomType)!;
    const selectedModel = MODELS.find((item) => item.name === model)!;
    const area = roomLength * roomWidth;
    const roomIndex = (roomLength * roomWidth) / (roomHeight * (roomLength + roomWidth));
    const efficiency = Math.min(0.75, 0.45 + roomIndex * 0.1);
    const neededFlux = (selectedRoom.lux * area * selectedRoom.kz) / efficiency;
    const count = Math.ceil(neededFlux / selectedModel.flux);
    const totalPower = count * selectedModel.power;
    const totalCost = count * selectedModel.price;
    const oldPower = Math.ceil(neededFlux / 10);
    const savingPercent = Math.round((1 - totalPower / oldPower) * 100);
    const yearlySavingRub = Math.round((((oldPower - totalPower) * 3000) / 1000) * 6);

    return { count, totalPower, totalCost, savingPercent, yearlySavingRub, area: Math.round(area) };
  }, [height, length, model, roomType, width]);

  return (
    <div className="internal-page-v11 calculator-page-v11">
      <PageHeader
        centered
        title="Рассчитайте количество светильников"
        description="Укажите размеры и назначение помещения. Калькулятор покажет ориентировочное количество, мощность и стоимость оборудования."
        meta={[
          { label: "Расчёт", value: "мгновенно" },
          { label: "Метод", value: "по норме освещённости" },
          { label: "Консультация", value: "бесплатно" },
        ]}
      />

      <main className="internal-shell-v11 calculator-app-v11">
        <section className="calculator-form-v11">
          <div className="calculator-block-v11">
            <div className="calculator-block-v11__head"><span>01</span><div><h2>Размеры помещения</h2><p>Введите длину, ширину и высоту в метрах.</p></div></div>
            <div className="calculator-dimensions-v11">
              {[
                { id: "calc-length", label: "Длина", value: length, setter: setLength },
                { id: "calc-width", label: "Ширина", value: width, setter: setWidth },
                { id: "calc-height", label: "Высота", value: height, setter: setHeight },
              ].map((field) => (
                <label key={field.id} htmlFor={field.id}><span>{field.label}, м</span><input id={field.id} type="number" min="1" max="500" value={field.value} onChange={(event) => field.setter(event.target.value)} /></label>
              ))}
            </div>
          </div>

          <div className="calculator-block-v11">
            <div className="calculator-block-v11__head"><span>02</span><div><h2>Тип помещения</h2><p>Выберите ближайший сценарий использования.</p></div></div>
            <div className="calculator-options-v11">
              {ROOM_TYPES.map((item) => (
                <button key={item.key} type="button" aria-pressed={roomType === item.key} className={roomType === item.key ? "is-active" : ""} onClick={() => setRoomType(item.key)}>
                  <span><i />{item.label}</span><small>{item.lux} Лк · {item.description}</small>
                </button>
              ))}
            </div>
          </div>

          <div className="calculator-block-v11">
            <div className="calculator-block-v11__head"><span>03</span><div><h2>Модель светильника</h2><p>Сравните мощность, световой поток и цену.</p></div></div>
            <div className="calculator-models-v11">
              {MODELS.map((item) => (
                <button key={item.name} type="button" aria-pressed={model === item.name} className={model === item.name ? "is-active" : ""} onClick={() => setModel(item.name)}>
                  <span>{item.name}</span><small>{item.power} Вт · {item.flux.toLocaleString("ru-RU")} лм</small><strong>{item.price.toLocaleString("ru-RU")} ₽</strong>
                </button>
              ))}
            </div>
          </div>
        </section>

        <aside className="calculator-result-v11" aria-live="polite">
          {result ? (
            <>
              <div className="calculator-result-v11__count"><strong>{result.count}</strong><span>светильников</span></div>
              <p className="calculator-result-v11__model">{model}</p>
              <dl>
                <div><dt>Площадь</dt><dd>{result.area} м²</dd></div>
                <div><dt>Суммарная мощность</dt><dd>{result.totalPower} Вт</dd></div>
                <div><dt>Стоимость</dt><dd>~{result.totalCost.toLocaleString("ru-RU")} ₽</dd></div>
                <div><dt>Экономия</dt><dd>{result.savingPercent}%</dd></div>
                <div><dt>Экономия в год</dt><dd>~{result.yearlySavingRub.toLocaleString("ru-RU")} ₽</dd></div>
              </dl>
              <p className="calculator-result-v11__note">Для точного проекта учтём расстановку, отражение поверхностей и условия эксплуатации.</p>
              <Link href="/contacts">Получить точный расчёт</Link>
            </>
          ) : <div className="calculator-result-v11__empty">Введите корректные размеры помещения.</div>}
        </aside>
      </main>
    </div>
  );
}
