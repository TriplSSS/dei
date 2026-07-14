import Link from "next/link";

export default function NotFound() {
  return (
    <div className="not-found-page-v11">
      <div className="not-found-card-v11">
        <div className="not-found-card-v11__code"><span>Ошибка</span><strong>404</strong><i /></div>
        <div className="not-found-card-v11__copy">
          <span>Страница не найдена</span>
          <h1>Похоже, здесь ничего нет</h1>
          <p>Адрес мог измениться или страница была удалена. Вернитесь на главную либо продолжите выбор оборудования.</p>
          <div><Link href="/catalog">Открыть каталог</Link><Link href="/">На главную</Link></div>
        </div>
      </div>
    </div>
  );
}
