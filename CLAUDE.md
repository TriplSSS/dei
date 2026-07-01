# DEI — инструкции для Claude

## Язык
Все ответы, коммиты, комментарии — только на русском языке.

## Стек
- **Next.js 15** + Turbopack, App Router, TypeScript
- **Tailwind CSS v4**
- **Framer Motion** (`motion/react`) — анимации компонентов
- **GSAP + ScrollTrigger** — StickyStackCatalog
- **Lenis** — smooth scroll
- **Vercel** — деплой (автоматически из main)

## Дизайн-система (Liquid Glass)
- Фон: `#09090b`, акцент: `red-600` / `red-500`
- CSS-классы: `glass-card`, `glass-inner`, `glass-pill`, `glass-red`, `hover-lift`, `btn`
- Компоненты: `<Reveal>`, `<MorphBlob>`, `<ParallaxImage>`
- Анимируй только `transform` и `opacity`
- Всегда добавляй `useReducedMotion()` для доступности

## Страницы
- `/` — главная (PinnedHero + StickyStackCatalog + WhyDEI + HowWeWork + GlassStats + TrustImage)
- `/about` — о компании
- `/contacts` — контакты
- `/not-found` — 404

## Скиллы
- `/deploy-check` — проверка перед деплоем
- `/new-section` — добавление новой секции

## Агенты
- `animation-reviewer` — проверка анимаций (GSAP, Framer Motion, CSS)

## Коммиты
На русском. Push в `main` → Vercel деплоит автоматически.

## Важно
- Телефон: +7 (988) 580-76-30
- Картинки: Unsplash (`w=1400&h=900&fit=crop&q=80`)
