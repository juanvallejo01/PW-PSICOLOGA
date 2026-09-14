import "server-only";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

// Almacenamiento local en /public/uploads. Funciona en cualquier hosting
// con sistema de archivos persistente (VPS, servidor propio, Docker con
// volumen). Si el sitio se despliega en una plataforma serverless de solo
// lectura (p. ej. Vercel), reemplazar esta función por una subida a un
// servicio de blobs (Vercel Blob, S3, Cloudinary, etc.) sin tocar el resto
// del código: todos los formularios llaman únicamente a `saveUploadedImage`.

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_SIZE_BYTES = 8 * 1024 * 1024; // 8MB

export async function saveUploadedImage(file: File): Promise<string> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Formato de imagen no permitido. Usa JPG, PNG, WEBP o GIF.");
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error("La imagen supera el tamaño máximo permitido (8MB).");
  }

  await mkdir(UPLOAD_DIR, { recursive: true });

  const ext = extensionFor(file.type);
  const filename = `${crypto.randomUUID()}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_DIR, filename), buffer);

  return `/uploads/${filename}`;
}

function extensionFor(mimeType: string) {
  switch (mimeType) {
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    case "image/gif":
      return ".gif";
    default:
      return ".jpg";
  }
}
