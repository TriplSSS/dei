export type YooKassaPaymentResult =
  | {
      provider: "yookassa";
      status: "created";
      paymentId: string;
      paymentStatus: string;
      confirmationUrl: string;
      message: string;
    }
  | {
      provider: "yookassa";
      status: "config_missing" | "failed";
      message: string;
    };

type CreateYooKassaPaymentParams = {
  orderId: string;
  total: number;
  description: string;
};

type YooKassaPaymentResponse = {
  id?: unknown;
  status?: unknown;
  confirmation?: {
    confirmation_url?: unknown;
  };
};

const YOOKASSA_PAYMENTS_URL = "https://api.yookassa.ru/v3/payments";
const YOOKASSA_REQUEST_TIMEOUT_MS = 8000;

function getYooKassaConfig() {
  const shopId = process.env.YOOKASSA_SHOP_ID?.trim() || "";
  const secretKey = process.env.YOOKASSA_SECRET_KEY?.trim() || "";
  const returnUrl = process.env.YOOKASSA_RETURN_URL?.trim() || "";

  if (!shopId || !secretKey || !returnUrl) return null;

  return { shopId, secretKey, returnUrl };
}

function formatAmount(value: number) {
  return value.toFixed(2);
}

function makeBasicAuth(shopId: string, secretKey: string) {
  return Buffer.from(`${shopId}:${secretKey}`, "utf8").toString("base64");
}

function parsePaymentResponse(value: unknown): YooKassaPaymentResult {
  if (!value || typeof value !== "object") {
    return {
      provider: "yookassa",
      status: "failed",
      message: "Платеж ЮKassa не создан: получен некорректный ответ платежного сервиса.",
    };
  }

  const response = value as YooKassaPaymentResponse;
  const paymentId = typeof response.id === "string" ? response.id : "";
  const paymentStatus = typeof response.status === "string" ? response.status : "";
  const confirmationUrl =
    typeof response.confirmation?.confirmation_url === "string"
      ? response.confirmation.confirmation_url
      : "";

  if (!paymentId || !paymentStatus || !confirmationUrl) {
    return {
      provider: "yookassa",
      status: "failed",
      message: "Платеж ЮKassa не создан: платежный сервис не вернул ссылку на оплату.",
    };
  }

  return {
    provider: "yookassa",
    status: "created",
    paymentId,
    paymentStatus,
    confirmationUrl,
    message: "Платеж ЮKassa создан. Перейдите по ссылке для оплаты заказа.",
  };
}

export async function createYooKassaPayment(
  params: CreateYooKassaPaymentParams
): Promise<YooKassaPaymentResult> {
  const config = getYooKassaConfig();

  if (!config) {
    return {
      provider: "yookassa",
      status: "config_missing",
      message: "Онлайн-оплата ЮKassa пока не настроена: менеджер свяжется с вами для оплаты.",
    };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), YOOKASSA_REQUEST_TIMEOUT_MS);
    const response = await fetch(YOOKASSA_PAYMENTS_URL, {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Basic ${makeBasicAuth(config.shopId, config.secretKey)}`,
        "Content-Type": "application/json",
        "Idempotence-Key": `dei-order-${params.orderId}`,
      },
      body: JSON.stringify({
        amount: {
          value: formatAmount(params.total),
          currency: "RUB",
        },
        capture: true,
        confirmation: {
          type: "redirect",
          return_url: config.returnUrl,
        },
        description: params.description,
        metadata: {
          order_id: params.orderId,
        },
      }),
    }).finally(() => clearTimeout(timeout));

    if (!response.ok) {
      return {
        provider: "yookassa",
        status: "failed",
        message: "Платеж ЮKassa не создан: платежный сервис вернул ошибку.",
      };
    }

    return parsePaymentResponse(await response.json());
  } catch {
    return {
      provider: "yookassa",
      status: "failed",
      message: "Платеж ЮKassa не создан: платежный сервис сейчас недоступен.",
    };
  }
}
