import Link from "next/link";

export default function NotFound() {
  return (
    <section className="min-h-[80dvh] flex items-center justify-center px-6">
      <div className="text-center">
        <p className="text-8xl font-bold text-red-600 mb-4">404</p>
        <h1 className="text-2xl font-bold tracking-tight mb-3">Страница не найдена</h1>
        <p className="text-zinc-500 mb-8 max-w-[360px] mx-auto">
          Возможно, страница была перемещена или удалена.
        </p>
        <Link
          href="/"
          className="inline-block bg-red-600 hover:bg-red-700 text-white px-7 py-3.5 rounded-lg font-medium transition-[transform,background] duration-160 active:scale-[0.97]"
        >
          На главную
        </Link>
      </div>
    </section>
  );
}
