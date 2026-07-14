import { timingSafeEqual } from "node:crypto";

function secureEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function readProvidedAdminToken(request: Request) {
  const headerToken = request.headers.get("x-admin-token")?.trim();
  if (headerToken) return headerToken;

  const authHeader = request.headers.get("authorization")?.trim();
  if (authHeader?.toLowerCase().startsWith("bearer ")) {
    return authHeader.slice(7).trim();
  }

  return "";
}

function isLocalDevelopmentRequest(request: Request) {
  if (process.env.NODE_ENV !== "development") return false;

  const hostname = new URL(request.url).hostname;
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
}

export function verifyAdminRequest(request: Request) {
  const expectedToken = process.env.ADMIN_ORDERS_TOKEN?.trim();

  if (!expectedToken) {
    if (isLocalDevelopmentRequest(request)) {
      return { ok: true, local: true } as const;
    }

    return {
      ok: false,
      status: 503,
      message: "Админка каталога не настроена: задайте ADMIN_ORDERS_TOKEN.",
    } as const;
  }

  const providedToken = readProvidedAdminToken(request);
  if (!providedToken || !secureEqual(providedToken, expectedToken)) {
    return {
      ok: false,
      status: 401,
      message: "Неверный пароль админки каталога.",
    } as const;
  }

  return { ok: true, local: false } as const;
}

export function adminJsonError(message: string, status = 400) {
  return Response.json({ ok: false, message }, { status });
}
