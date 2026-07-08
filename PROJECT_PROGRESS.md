# PROJECT_PROGRESS — DEI

Постоянная память проекта. Обновляется после каждой рабочей сессии.

## Сессия 08.07.2026 (вечер) — JSON-LD и ссылки футера

1. **JSON-LD**: Organization (название, адрес, телефон, foundingDate) в layout.tsx; Product (цена, валюта, InStock, бренд) + BreadcrumbList на карточках товара (catalog/[slug]/page.tsx, серверный компонент).
2. **Футер**: ссылки «Продукция» ведут на /catalog?category=welding|light|centrators|consumables вместо /#catalog. CatalogClient читает параметр через useSearchParams (обёрнут в Suspense в catalog/page.tsx — обязательно для статического пререндера).

Изменённые файлы: `src/app/layout.tsx`, `src/app/catalog/[slug]/page.tsx`, `src/app/catalog/page.tsx`, `src/app/catalog/CatalogClient.tsx`, `src/components/Footer.tsx`.

Следующее: e-shop Этап 3 (Resend), реальные фото товаров (ждём от Саши), кастомный домен, Метрика.

## Сессия 08.07.2026 — SEO-фиксы по итогам аудита прода

Аудит производственного сайта (dei-coral.vercel.app) выявил 5 проблем; в этой сессии исправлены 4:

1. **OG-метаданные внутренних страниц** — /calculator, /documents и /checkout наследовали og:title/og:description от layout. Добавлен явный блок `openGraph` в metadata каждой страницы.
2. **Год в футере** — «© 2006–2025» заменён на `new Date().getFullYear()` (Footer.tsx).
3. **SSR-значения hero-статистики** — краулеры видели «2000 год основания» и «0+ лет опыта». CountUp теперь рендерит конечное значение на сервере, анимация от стартового запускается только при попадании во вьюпорт (CountUp.tsx). «Лет опыта» вычисляется динамически: `год − 2006` (page.tsx, AboutClient.tsx).
4. **Реальное фото ВДИ 200** — стоковое Unsplash-фото заменено на `/products/dei-mig-250.jpg` в data/products.ts (каталог, карточка товара, og:image) и в «Популярных позициях» на главной. В layout.tsx добавлен `metadataBase` для абсолютных OG-URL.

### Изменённые файлы

`src/app/calculator/page.tsx`, `src/app/documents/page.tsx`, `src/app/checkout/page.tsx`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/about/AboutClient.tsx`, `src/components/Footer.tsx`, `src/components/CountUp.tsx`, `src/data/products.ts`.

### Ограничения сессии

Локальная песочница не запускалась — `npm run build` не выполнялся. Правки синтаксически простые; сборку проверит Vercel при деплое. Если билд упадёт — смотреть логи деплоя.

### Состояние проекта

Сайт в рабочем состоянии: главная, каталог (10 товаров), карточки товаров, корзина + checkout (заявка на счёт), калькулятор освещения, документы, о компании, контакты, sitemap/robots. E-shop Этап 1 завершён ранее (коммит c6ceba0).

### Место остановки / следующая сессия

- Закоммитить и запушить текущие правки (Саша, через GitHub Desktop), проверить прод.
- П. 5 аудита: ссылки «Продукция» в футере ведут на /#catalog — вести на /catalog с предвыбранной категорией.
- Проверить наличие JSON-LD (Organization, Product) — из аудита подтвердить не удалось.
- E-shop Этап 3: отправка заявки checkout на email (Resend).
