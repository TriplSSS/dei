import { put } from "@vercel/blob";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { adminJsonError, verifyAdminRequest } from "@/lib/adminAuth";

export const runtime = "nodejs";

const MAX_IMAGE_SIZE = 8 * 1024 * 1024;
const IMAGE_EXTENSIONS = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

export async function POST(request: Request) {
  const auth = verifyAdminRequest(request);
  if (!auth.ok) return adminJsonError(auth.message, auth.status);

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return adminJsonError("Не удалось прочитать файл изображения.");
  }

  const file = formData.get("image");
  if (!(file instanceof File)) return adminJsonError("Выберите изображение для загрузки.");
  if (file.size <= 0 || file.size > MAX_IMAGE_SIZE) {
    return adminJsonError("Размер изображения должен быть не больше 8 МБ.");
  }

  const extension = IMAGE_EXTENSIONS.get(file.type);
  if (!extension) return adminJsonError("Поддерживаются JPG, PNG и WEBP.");

  try {
    const fileName = `${Date.now()}-${randomUUID().slice(0, 8)}.${extension}`;

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`products/${fileName}`, file, {
        access: "public",
        addRandomSuffix: false,
        cacheControlMaxAge: 31_536_000,
        contentType: file.type,
      });

      return Response.json({
        ok: true,
        url: blob.url,
        message: "Изображение загружено.",
      });
    }

    if (process.env.VERCEL) {
      return adminJsonError("Хранилище изображений не подключено.", 503);
    }

    const uploadDirectory = path.join(process.cwd(), "public", "uploads", "products");
    await mkdir(uploadDirectory, { recursive: true });
    await writeFile(path.join(uploadDirectory, fileName), Buffer.from(await file.arrayBuffer()));

    return Response.json({
      ok: true,
      url: `/uploads/products/${fileName}`,
      message: "Изображение загружено.",
    });
  } catch (error) {
    console.error("[admin:image-upload] failed", {
      message: error instanceof Error ? error.message : String(error),
    });
    return adminJsonError("Изображение не сохранено. Повторите загрузку.", 500);
  }
}
