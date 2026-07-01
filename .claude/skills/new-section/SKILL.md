---
name: new-section
description: Добавляет новую секцию на страницу DEI в стиле Liquid Glass. Принимает название и описание секции.
---

# New Section — DEI Liquid Glass

Создай новую секцию для проекта DEI в существующем дизайн-языке.

## Дизайн-система

**Цвета:** фон `#09090b`, акцент `red-600/red-500`, текст `zinc-400` / `white`

**CSS-классы:** `glass-card`, `glass-inner`, `glass-pill`, `glass-red`, `hover-lift`, `btn`

**Компоненты:** `<Reveal>`, `<MorphBlob>`

**Типографика:** заголовок `text-3xl md:text-4xl font-black tracking-tight`, подзаголовок `text-zinc-400 text-lg`

**Отступы:** `py-24 md:py-32 px-4 md:px-6`, `max-w-6xl mx-auto`

## Шаги

1. Возьми из запроса: название, цель, место вставки в `page.tsx`
2. Создай `src/components/[Name].tsx` с правильной структурой и Reveal анимацией
3. Вставь в `src/app/page.tsx`
