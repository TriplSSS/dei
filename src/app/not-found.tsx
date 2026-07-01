import Link from "next/link";

export default function NotFound() {
  return (
    <section className="min-h-[90dvh] flex items-center justify-center px-6 relative overflow-hidden">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(220,38,38,0.07) 0%, transparent 70%)" }}
        />
      </div>

      <div className="text-center relative">
        <p
          className="font-extrabold text-white/[0.03] select-none"
          style={{ fontSize: "clamp(8rem, 25vw, 18rem)", lineHeight: 1 }}
        >
          404
        </p>

        <div className="glass-card rounded-2xl p-8 md:p-12 -mt-16 relative">
          <div className="inline-flex items-center gap-2 glass-red rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs text-red-400 font-medium tracking-widest uppercase">Ошибка 404</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-3">
            Страница не найдена
          </h1>
          <p className="text-zinc-500 mb-8 max-w-[360px] mx-auto text-sm leading-relaxed">
            Возможно, страница была перемещена или удалена. Вернитесь на главную.
          </p>

          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-7 py-3.5 font-semibold btn transition-colors shadow-[0_8px_32px_-4px_rgba(220,38,38,0.45)]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            На главную
          </Link>
        </div>
      </div>
    </section>
  );
}
