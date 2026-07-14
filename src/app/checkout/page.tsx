import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Онлайн-заказ — в разработке",
  description: "Корзина, онлайн-заказ и формы отправки данных DEI временно находятся в разработке.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <div className="internal-page-v11 development-page-v11">
      <PageHeader
        centered
        eyebrow="Онлайн-сервисы"
        title="В разработке"
        description="Корзина, онлайн-заказ и формы отправки данных временно отключены. Каталог доступен для просмотра, а обсудить оборудование можно напрямую с DEI."
        meta={[
          { label: "Каталог", value: "доступен" },
          { label: "Корзина", value: "в разработке" },
          { label: "Онлайн-формы", value: "в разработке" },
        ]}
      />

      <main className="internal-shell-v11 development-content-v11">
        <section className="development-panel-v11" role="status" aria-live="polite">
          <div className="development-panel-v11__signal" aria-hidden="true">
            <span />
            <span />
            <i />
          </div>
          <div className="development-panel-v11__copy">
            <span>DEI / ONLINE SERVICES</span>
            <h2>Покупка на сайте появится позже</h2>
            <p>Сейчас сайт работает как витрина оборудования. Мы не сохраняем товары в корзине и не предлагаем заполнять персональные данные.</p>
          </div>
          <div className="development-panel-v11__actions">
            <Link href="/catalog">Смотреть каталог <span aria-hidden="true">↗</span></Link>
            <a href="tel:+79885807630">+7 (988) 580-76-30</a>
          </div>
        </section>
      </main>
    </div>
  );
}
