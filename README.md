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
```

Notes:

- If Resend variables are missing, order creation still succeeds and returns `notification.status = skipped_config_missing`.
- Without `DATABASE_URL`, order storage uses the local JSONL fallback at `.data/orders.jsonl`; the folder is ignored by git. `ORDER_STORAGE_DIR` can override the local folder.
- With `DATABASE_URL`, order storage uses Neon/Postgres through `@neondatabase/serverless`. The database client is initialized lazily at request time, so local builds and first deploys do not require the env var.
- The internal order list is available at `/admin/orders` after `ADMIN_ORDERS_TOKEN` is set.
- For Vercel production, add Neon from the Vercel Marketplace or provide an existing Neon connection string as `DATABASE_URL`, then run the SQL in `docs/sql/orders.sql` once against the database. The app also runs `CREATE TABLE IF NOT EXISTS` defensively on first order access.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
