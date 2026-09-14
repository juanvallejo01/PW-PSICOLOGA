"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { saveUploadedImage } from "@/lib/uploads";

function str(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function updateAboutAction(formData: FormData) {
  await requireAdmin();

  let photoUrl: string | undefined;
  const photo = formData.get("photo");
  if (photo instanceof File && photo.size > 0) {
    photoUrl = await saveUploadedImage(photo);
  }

  await prisma.aboutContent.update({
    where: { id: 1 },
    data: {
      title: str(formData, "title"),
      yearsExperience: Number(formData.get("yearsExperience")) || 0,
      bioHtml: str(formData, "bioHtml"),
      closingQuote: str(formData, "closingQuote"),
      ...(photoUrl ? { photoUrl } : {}),
    },
  });

  revalidatePath("/", "layout");
  revalidatePath("/admin/sobre-mi");
}

export async function addEducationAction(formData: FormData) {
  await requireAdmin();
  const title = str(formData, "title");
  if (!title) return;

  const count = await prisma.educationItem.count();
  await prisma.educationItem.create({
    data: {
      type: str(formData, "type") || "course",
      title,
      institution: str(formData, "institution") || null,
      period: str(formData, "period") || null,
      order: count,
    },
  });

  revalidatePath("/", "layout");
  revalidatePath("/admin/sobre-mi");
}

export async function updateEducationAction(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  await prisma.educationItem.update({
    where: { id },
    data: {
      type: str(formData, "type") || "course",
      title: str(formData, "title"),
      institution: str(formData, "institution") || null,
      period: str(formData, "period") || null,
      order: Number(formData.get("order")) || 0,
    },
  });

  revalidatePath("/", "layout");
  revalidatePath("/admin/sobre-mi");
}

export async function deleteEducationAction(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  await prisma.educationItem.delete({ where: { id } });

  revalidatePath("/", "layout");
  revalidatePath("/admin/sobre-mi");
}
