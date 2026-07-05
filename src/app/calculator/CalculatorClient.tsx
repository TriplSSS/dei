"use client";

import { useState, useMemo } from "react";
import Reveal from "@/components/Reveal";

type RoomType = {
  key: string;
  label: string;
  lux: number;           // норма освещённости (Лк)
  kz: number;            // коэффициент запаса
  description: string;
};

const ROOM_TYPES: RoomType[] = [
  { key: "factory",    label: "Производственный цех",  lux: 300, kz: 1.5, description: "Точные работы, сборка, контроль качества" },
  { key: "warehouse",  label: "Склад",                  lux: 200, kz: 1.4, description: "Хранение, комплектация, погрузка" },
  { key: "office",     label: "Офис / лаборатория",    lux: 500, kz: 1.4, description: "Работа с документами, компьютером" },
  { key: "parking",    label: "Парковка / гараж",       lux: 100, kz: 1.3, description: "Закрытые автостоянки" },
  { key: "street",     label: "Улица / территория",    lux: 30,  kz: 1.5, description: "Освещение проездов, площадок" },
  { key: "corridor",   label: "Коридор / переход",     lux: 150, kz: 1.4, description: "Технические помещения, проходы" },
];

type LuminaireModel = {
  name: string;
  power: number;    // Вт
  flux: number;     // лм
  price: number;    // ₽
};

const MODELS: LuminaireModel[] = [
  { name: "LED-DEI-40 Склад",    power: 40,  flux: 5200,  price: 3400 },
  { name: "LED-DEI-60 Street",   power: 60,  flux: 8000,  price: 5800 },
  { name: "LED-DEI-120",         power: 120, flux: 15600, price: 8200 },
];

export default function CalculatorClient() {
  const [length,   setLength]   = useState<string>("20");
  const [width,    setWidth]    = useState<string>("15");
  const [height,   setHeight]   = useState<string>("6");
  const [roomType, setRoomType] = useState<string>("factory");
  const [model,    setModel]    = useState<string>("LED-DEI-120");

  const result = useMemo(() => {
    const l = parseFloat(length) || 0;
    const w = parseFloat(width)  || 0;
    const h = parseFloat(height) || 0;
    if (l <= 0 || w <= 0 || h <= 0) return null;

    const rt   = ROOM_TYPES.find(r => r.key === roomType)!;
    const lum  = MODELS.find(m => m.name === model)!;
    const area = l * w;

    // Метод коэффициента использования (упрощённый)
    // η — КПД светильника для помещения (зависит от ИП и высоты)
    const indexRoom = (l * w) / (h * (l + w));
    const eta = Math.min(0.75, 0.45 + indexRoom * 0.1);

    // N = (En * S * Kz) / (Ф * η * n_lamp)
    const totalFluxNeeded = (rt.lux * area * rt.kz) / eta;
    const count = Math.ceil(totalFluxNeeded / lum.flux);

    const totalPower = count * lum.power;
    const totalCost  = count * lum.price;

    // Сравнение с лампами накаливания (примерно 10 лм/Вт)
    const oldPower = Math.ceil(totalFluxNeeded / 10); // в Вт
    const savingPercent = Math.round((1 - totalPower / oldPower) * 100);
    const yearlySavingKwh = ((oldPower - totalPower) * 3000) / 1000; // 3000 ч/год
    const yearlySavingRub = Math.round(yearlySavingKwh * 6); // 6 ₽/кВтч

    return { count, totalPower, totalCost, savingPercent, yearlySavingKwh: Math.round(yearlySavingKwh), yearlySavingRub, area: Math.round(area), indexRoom: indexRoom.toFixed(2) };
  }, [length, width, height, roomType, model]);

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative pt-36 pb-12 px-6 overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 right-1/4 w-[600px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(220,38,38,0.05) 0%, transparent 70%)" }}
        />
        <div className="max-w-[900px] mx-auto">
          <Reveal direction="up">
            <div className="inline-flex items-center gap-2 glass-pill rounded-full px-4 py-1.5 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-medium text-zinc-400 tracking-widest uppercase">Инструмент</span>
            </div>
          </Reveal>
          <Reveal direction="left" delay={0.05}>
            <h1
              className="font-bold tracking-tight text-white mb-4"
              style={{ fontSize: "clamp(2.4rem, 5vw, 4.5rem)", lineHeight: "0.95", letterSpacing: "-0.03em" }}
            >
              Калькулятор <span className="text-red-500">освещения</span>
            </h1>
          </Reveal>
          <Reveal direction="up" delay={0.1}>
            <p className="text-zinc-400 text-lg max-w-[520px] leading-relaxed">
              Рассчитайте необходимое количество светильников для вашего объекта по нормативному методу.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Калькулятор ── */}
      <section className="pb-24 px-6">
        <div className="max-w-[900px] mx-auto grid lg:grid-cols-[1fr_360px] gap-6">

          {/* Форма */}
          <Reveal direction="left" delay={0.05}>
            <div className="glass-card rounded-2xl p-6 lg:p-8 flex flex-col gap-6">

              {/* Размеры */}
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-zinc-500 mb-4">Размеры помещения</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Длина (м)",  value: length,  set: setLength },
                    { label: "Ширина (м)", value: width,   set: setWidth },
                    { label: "Высота (м)", value: height,  set: setHeight },
                  ].map(({ label, value, set }) => (
                    <div key={label}>
                      <label className="block text-xs text-zinc-500 mb-1.5">{label}</label>
                      <input
                        type="number"
                        min="1" max="500"
                        value={value}
                        onChange={e => set(e.target.value)}
                        className="w-full glass-inner rounded-xl px-3 py-2.5 text-zinc-200 text-sm outline-none focus:border-red-600/50 transition-colors tabular-nums"
                        style={{ border: "1px solid rgba(255,255,255,0.07)" }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Тип помещения */}
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-zinc-500 mb-3">Тип помещения</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ROOM_TYPES.map(rt => (
                    <button
                      key={rt.key}
                      onClick={() => setRoomType(rt.key)}
                      className={`text-left px-4 py-3 rounded-xl btn transition-all duration-200 ${
                        roomType === rt.key
                          ? "bg-red-600/15 border border-red-500/30 text-white"
                          : "glass-inner border border-transparent text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      <p className="text-sm font-medium leading-tight">{rt.label}</p>
                      <p className="text-xs text-zinc-600 mt-0.5">{rt.lux} Лк · {rt.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Модель светильника */}
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-zinc-500 mb-3">Модель светильника</p>
                <div className="flex flex-col gap-2">
                  {MODELS.map(m => (
                    <button
                      key={m.name}
                      onClick={() => setModel(m.name)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl btn transition-all duration-200 ${
                        model === m.name
                          ? "bg-red-600/15 border border-red-500/30 text-white"
                          : "glass-inner border border-transparent text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      <span className="text-sm font-medium">{m.name}</span>
                      <span className="text-xs text-zinc-500 tabular-nums">{m.power} Вт · {m.flux.toLocaleString("ru")} лм · {m.price.toLocaleString("ru")} ₽</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* Результаты */}
          <Reveal direction="right" delay={0.1}>
            <div className="flex flex-col gap-4 lg:sticky lg:top-28">

              {result ? (
                <>
                  {/* Главный результат */}
                  <div className="glass-red rounded-2xl p-6 text-center relative overflow-hidden">
                    <div
                      aria-hidden
                      className="absolute inset-0 pointer-events-none"
                      style={{ background: "radial-gradient(circle at 50% 0%, rgba(220,38,38,0.15) 0%, transparent 70%)" }}
                    />
                    <p className="text-xs font-medium uppercase tracking-widest text-zinc-500 mb-2">Необходимо светильников</p>
                    <p
                      className="font-bold text-red-400 tabular-nums"
                      style={{ fontSize: "5rem", lineHeight: "1" }}
                    >
                      {result.count}
                    </p>
                    <p className="text-zinc-400 text-sm mt-1">{model}</p>
                  </div>

                  {/* Детали */}
                  <div className="glass-card rounded-2xl overflow-hidden">
                    {[
                      { label: "Площадь",         value: `${result.area} м²` },
                      { label: "Суммарная мощность", value: `${result.totalPower} Вт` },
                      { label: "Стоимость оборудования", value: `~${result.totalCost.toLocaleString("ru")} ₽` },
                      { label: "Экономия vs. ДРЛ",  value: `${result.savingPercent}%` },
                      { label: "Экономия в год",    value: `~${result.yearlySavingRub.toLocaleString("ru")} ₽` },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-center justify-between px-5 py-3 border-b border-white/[0.04] last:border-b-0">
                        <span className="text-xs text-zinc-500">{label}</span>
                        <span className="text-sm text-zinc-200 font-semibold tabular-nums">{value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-zinc-600 mb-3">
                      Расчёт ориентировочный. Для точного проекта — выезд специалиста бесплатно.
                    </p>
                    <a
                      href="/contacts"
                      className="block w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-3.5 rounded-xl btn text-sm text-center transition-colors"
                    >
                      Получить точный расчёт
                    </a>
                  </div>
                </>
              ) : (
                <div className="glass-card rounded-2xl p-8 text-center text-zinc-600 text-sm">
                  Введите размеры помещения
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
