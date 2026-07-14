import { deleteProduct, listProducts, saveProduct } from "@/lib/productCatalog";
import { adminJsonError, verifyAdminRequest } from "@/lib/adminAuth";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = verifyAdminRequest(request);
  if (!auth.ok) return adminJsonError(auth.message, auth.status);

  const products = await listProducts();

  return Response.json({
    ok: true,
    products,
    count: products.length,
    local: auth.local,
  });
}

export async function POST(request: Request) {
  const auth = verifyAdminRequest(request);
  if (!auth.ok) return adminJsonError(auth.message, auth.status);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return adminJsonError("Некорректный формат товара.");
  }

  const result = await saveProduct(body);
  if (result.status === "failed") {
    return adminJsonError(result.message, 400);
  }

  return Response.json({
    ok: true,
    product: result.product,
    message: result.message,
  });
}

export async function DELETE(request: Request) {
  const auth = verifyAdminRequest(request);
  if (!auth.ok) return adminJsonError(auth.message, auth.status);

  const url = new URL(request.url);
  const slug = url.searchParams.get("slug")?.trim() || "";
  const result = await deleteProduct(slug);

  if (result.status === "failed") {
    return adminJsonError(result.message, 400);
  }

  return Response.json({
    ok: true,
    product: result.product,
    message: result.message,
  });
}
