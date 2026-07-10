This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## DEI orders

Checkout creates orders through `POST /api/orders`. The server recalculates cart items from `src/data/products.ts`, generates an order id, stores the order in a local JSONL journal, and can notify a manager through Resend.

Environment variables:

```bash
RESEND_API_KEY=
ORDER_NOTIFY_EMAIL=
RESEND_FROM_EMAIL=DEI <onboarding@resend.dev>
ADMIN_ORDERS_TOKEN=
ORDER_STORAGE_DIR=
DATABASE_URL=
YOOKASSA_SHOP_ID=
YOOKASSA_SECRET_KEY=
YOOKASSA_RETURN_URL=
```

Notes:

- Если переменные Resend не заданы, заказ все равно создается и возвращает `notification.status = skipped_config_missing`.
- Без `DATABASE_URL` заказы сохраняются в локальный JSONL fallback `.data/orders.jsonl`; папка игнорируется git. `ORDER_STORAGE_DIR` может переопределить локальную папку.
- С `DATABASE_URL` заказы сохраняются в Neon/Postgres через `@neondatabase/serverless`. Клиент базы инициализируется лениво во время запроса, поэтому локальные сборки и первые деплои не требуют env-переменную.
- Для `paymentMethod=online_yookassa` сервер создает платеж ЮKassa только если заданы `YOOKASSA_SHOP_ID`, `YOOKASSA_SECRET_KEY` и `YOOKASSA_RETURN_URL`. Если переменные ЮKassa отсутствуют, создание заказа не падает; заказ сохраняется с `paymentStatus = yookassa_config_missing`.
- Секреты ЮKassa должны оставаться только на сервере. API использует Basic Auth и `Idempotence-Key` на основе созданного номера заказа, а наружу возвращает только безопасные данные платежа: ID, статус и ссылку подтверждения оплаты.
- Настройте в ЮKassa webhook URL `/api/yookassa/webhook` для событий платежей, например `payment.succeeded` и `payment.canceled`. Если заданы учетные данные ЮKassa, обработчик webhook сначала проверяет платеж запросом в ЮKassa и только потом обновляет сохраненный статус заказа.
- Внутренний список заказов доступен на `/admin/orders` после настройки `ADMIN_ORDERS_TOKEN`.
- Для production на Vercel добавьте Neon из Vercel Marketplace или укажите существующую строку подключения Neon в `DATABASE_URL`, затем один раз выполните SQL из `docs/sql/orders.sql` в базе. Приложение также защитно выполняет `CREATE TABLE IF NOT EXISTS` при первом обращении к заказам.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
