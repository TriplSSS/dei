import { adminJsonError, verifyAdminRequest } from "@/lib/adminAuth";
import {
  deleteProductCategory,
  listProductCategories,
  saveProductCategory,
} from "@/lib/productCatalog";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = verifyAdminRequest(request);
  if (!auth.ok) return adminJsonError(auth.message, auth.status);

  const categories = await listProductCategories();
  return Response.json({ ok: true, categories, count: categories.length, local: auth.local });
}

export async function POST(request: Request) {
  const auth = verifyAdminRequest(request);
  if (!auth.ok) return adminJsonError(auth.message, auth.status);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return adminJsonError("Некорректный формат категории.");
  }

  const result = await saveProductCategory(body);
  if (result.status === "failed") return adminJsonError(result.message);

  return Response.json({ ok: true, category: result.category, message: result.message });
}

export async function DELETE(request: Request) {
  const auth = verifyAdminRequest(request);
  if (!auth.ok) return adminJsonError(auth.message, auth.status);

  const key = new URL(request.url).searchParams.get("key")?.trim() || "";
  const result = await deleteProductCategory(key);
  if (result.status === "failed") return adminJsonError(result.message);

  return Response.json({ ok: true, category: result.category, message: result.message });
}
