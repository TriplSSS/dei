# DEI — инструкции для Codex

## Главное

- Рабочая папка: `C:\Users\Name\Desktop\Codex Workspace\Projects\DEI`
- Отвечать, комментировать код и писать коммиты только на русском языке.
- Перед серьезными правками читать этот файл, `AGENTS.md`, `PROJECT_PROGRESS.md`, `ROADMAP.md`, `README.md`, `package.json` и релевантные файлы рядом с задачей.
- Не смешивать задачи DEI и WeldMash. Общая память лежит в `C:\Users\Name\Desktop\Codex Workspace\Agent-Work\memory`.

## Проект

- GitHub: `TriplSSS/dei` (public), ветка `main`.
- Vercel team: `triplsss' projects` (`team_coNXRTyjvNgjXLE3UkGnfIxc`).
- Vercel project: `dei` (`prj_SqaUxGOFyCKc4kXkoHxIsZTmFnCI`).
- Production: `https://dei-coral.vercel.app`
- Дополнительные домены: `dei-triplsss-projects.vercel.app`, `dei-git-main-triplsss-projects.vercel.app`.
- Последний известный commit: `b26dc7742d5a449a91e4432caaf2c916393b34eb`.

## Стек

- Next.js `16.2.9`, React `19.2.4`, TypeScript, App Router.
- Tailwind CSS v4, `motion`, GSAP, Lenis.
- Скрипты: `npm run dev`, `npm run build`, `npm run start`, `npm run lint`.
- В `AGENTS.md` есть правило: перед работой с новыми Next.js API при установленных зависимостях читать локальные документы в `node_modules/next/dist/docs/`.

## Дизайн-система

- Стиль: Liquid Glass.
- Фон: `#09090b`, акцент: `red-600` / `red-500`.
- Основные CSS-классы: `glass-card`, `glass-inner`, `glass-pill`, `glass-red`, `hover-lift`, `btn`.
- Компоненты: `Reveal`, `MorphBlob`, `ParallaxImage`.
- Анимировать преимущественно `transform` и `opacity`.
- Всегда учитывать `useReducedMotion()` / `prefers-reduced-motion`.
- Для новых секций: `py-24 md:py-32 px-4 md:px-6`, `max-w-6xl mx-auto`, заголовки `text-3xl md:text-4xl font-black tracking-tight`, подзаголовки `text-zinc-400 text-lg`.

## Страницы и функции

- `/` — главная: PinnedHero, StickyStackCatalog, WhyDEI, HowWeWork, GlassStats, TrustImage.
- `/catalog` и `/catalog/[slug]` — каталог и карточки товаров.
- `/checkout` — заявка на счет.
- `/calculator`, `/documents`, `/about`, `/contacts`, `/not-found`.
- Есть корзина, карточки товаров, sitemap/robots.
- Контактный телефон: `+7 (988) 580-76-30`.

## Важные решения и состояние

- Последний этап: JSON-LD Organization/Product/Breadcrumb и ссылки каталога в футере.
- SEO внутренних страниц уже правилось: OpenGraph, `metadataBase`, динамический год, SSR-значения статистики.
- Добавлено реальное фото DEI MIG-250.
- E-shop этап 1 завершен: корзина, каталог, карточки товара, checkout-заявка на счет.
- Текущий дизайн пользователю нравится: темный Liquid Glass с красным акцентом. Крупные редизайны без запроса не предлагать.

## Проверка анимаций

Перед завершением задач с анимациями проверить:

- Анимируются ли только `transform` и `opacity`, без дорогих `width/height/top/left`.
- GSAP `ScrollTrigger` имеет корректный `trigger`, `scrub`, cleanup через `ctx.revert()`.
- `invalidateOnRefresh: true` есть там, где нужна responsive-перестройка.
- Framer Motion уважает `useReducedMotion()`.
- `AnimatePresence` не используется без стабильных `key`.
- CSS-анимации отключаются при `prefers-reduced-motion: reduce`.
- Длительность микро-взаимодействий обычно 150–300ms.

## Проверка перед деплоем

Если зависимости установлены, перед деплоем выполнить:

1. `npm run lint`
2. `npx tsc --noEmit`
3. `npm run build`
4. Поиск `console.log` в `src/**/*.ts` и `src/**/*.tsx`; удалить лишнее.
5. Поиск `TODO`, `FIXME`, `HACK`, `XXX`; перечислить пользователю.
6. Проверить неиспользуемые импорты в `src/app/page.tsx`, `src/app/layout.tsx`, `src/components/`.

## Бэклог

- E-shop этап 3: отправка checkout-заявки на email через Resend.
- Дождаться и добавить реальные фото товаров.
- Настроить кастомный домен.
- Добавить Метрику.
- Проверять, что ссылки футера на продукцию ведут в каталог с корректной категорией.

## Правила работы

- Сначала изучать существующий стиль и проектную память, затем править.
- UI проверять на desktop/mobile, отсутствие наложений текста, reduced motion и визуальную цельность Liquid Glass.
- Не пушить и не деплоить без прямой просьбы пользователя.
- При прод-проблемах сначала смотреть Vercel project/team из этого файла.

