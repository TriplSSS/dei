import Link from "next/link";

export default function NotFound() {
  return (
    <div className="not-found-page section-shell flex min-h-[88dvh] items-center py-32">
      <div className="grid w-full border-y border-white/10 py-12 md:grid-cols-[0.7fr_1fr] md:items-end md:py-20">
        <p className="text-[clamp(7rem,18vw,13rem)] font-semibold leading-none tracking-[-0.08em] text-white">
          404
        </p>
        <div className="mt-8 md:mt-0 md:pb-5">
          <p className="page-kicker">Страница не найдена</p>
          <h1 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-white md:text-5xl">
            Здесь ничего нет
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-zinc-500">
            Возможно, адрес изменился. Вернитесь на главную или откройте каталог оборудования.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/" className="btn bg-red-600 px-6 py-3 text-sm font-semibold text-white hover:bg-red-500">
              На главную
            </Link>
            <Link href="/catalog" className="btn border border-white/10 px-6 py-3 text-sm font-semibold text-zinc-300 hover:border-white/25 hover:text-white">
              Открыть каталог
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
