import { updateOrderPayment } from "@/lib/orderStorage";
import { getYooKassaPayment } from "@/lib/yookassa";

export const runtime = "nodejs";

type YooKassaWebhookPayload = {
  event?: unknown;
  object?: {
    id?: unknown;
    status?: unknown;
    paid?: unknown;
    metadata?: {
      order_id?: unknown;
    };
  };
};

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return Response.json(body, { status });
}

function normalizeWebhookPayload(value: unknown) {
  if (!value || typeof value !== "object") return null;

  const payload = value as YooKassaWebhookPayload;
  const event = typeof payload.event === "string" ? payload.event : "";
  const paymentId = typeof payload.object?.id === "string" ? payload.object.id : "";
  const paymentStatus = typeof payload.object?.status === "string" ? payload.object.status : "";
  const orderId = typeof payload.object?.metadata?.order_id === "string" ? payload.object.metadata.order_id : undefined;
  const paid = typeof payload.object?.paid === "boolean" ? payload.object.paid : undefined;

  if (!event.startsWith("payment.") || !paymentId || !paymentStatus) return null;

  return {
    event,
    paymentId,
    paymentStatus,
    orderId,
    paid,
  };
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ ok: false, message: "Некорректный payload webhook." }, 400);
  }

  const webhook = normalizeWebhookPayload(payload);
  if (!webhook) {
    return jsonResponse({ ok: false, message: "Неподдерживаемое событие webhook." }, 400);
  }

  const lookup = await getYooKassaPayment(webhook.paymentId);
  if (lookup.status === "failed") {
    return jsonResponse({ ok: false, message: "Проверка платежа сейчас недоступна." }, 503);
  }

  const payment = lookup.status === "found" ? lookup : webhook;
  const update = await updateOrderPayment({
    orderId: payment.orderId ?? webhook.orderId,
    paymentId: payment.paymentId,
    paymentStatus: payment.paymentStatus,
    event: webhook.event,
    paid: payment.paid,
  });

  if (update.status === "failed") {
    return jsonResponse({ ok: false, message: update.message }, 503);
  }

  if (update.status === "not_found") {
    return jsonResponse({ ok: false, message: update.message }, 404);
  }

  return jsonResponse({
    ok: true,
    status: update.status,
    orderId: update.order?.id,
    paymentStatus: update.order?.paymentStatus,
  });
}
