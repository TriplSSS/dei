import { deleteProduct, listProducts, saveProduct } from "@/lib/productCatalog";
import { timingSafeEqual } from "node:crypto";

export const runtime = "nodejs";

function jsonError(message: string, status = 400) {
  return Response.json({ ok: false, message }, { status });
}

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

function verifyAdminRequest(request: Request) {
  const expectedToken = process.env.ADMIN_ORDERS_TOKEN?.trim();

  if (!expectedToken) {
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

  return { ok: true } as const;
}

export async function GET(request: Request) {
  const auth = verifyAdminRequest(request);
  if (!auth.ok) return jsonError(auth.message, auth.status);

  const products = await listProducts();

  return Response.json({
    ok: true,
    products,
    count: products.length,
  });
}

export async function POST(request: Request) {
  const auth = verifyAdminRequest(request);
  if (!auth.ok) return jsonError(auth.message, auth.status);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Некорректный формат товара.");
  }

  const result = await saveProduct(body);
  if (result.status === "failed") {
    return jsonError(result.message, 400);
  }

  return Response.json({
    ok: true,
    product: result.product,
    message: result.message,
  });
}

export async function DELETE(request: Request) {
  const auth = verifyAdminRequest(request);
  if (!auth.ok) return jsonError(auth.message, auth.status);

  const url = new URL(request.url);
  const slug = url.searchParams.get("slug")?.trim() || "";
  const result = await deleteProduct(slug);

  if (result.status === "failed") {
    return jsonError(result.message, 400);
  }

  return Response.json({
    ok: true,
    product: result.product,
    message: result.message,
  });
}
