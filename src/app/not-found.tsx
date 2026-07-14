import Link from "next/link";

export default function NotFound() {
  return (
    <div className="not-found-v10 section-shell" data-page-code="ERR / 404">
      <div className="not-found-v10__frame">
        <div className="not-found-v10__code">
          <span>Сигнал потерян</span>
        <p className="text-[clamp(7rem,18vw,13rem)] font-semibold leading-none tracking-[-0.08em] text-white">
          404
        </p>
        </div>
        <div className="not-found-v10__copy">
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
