"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

function str(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function addSpecialtyAction(formData: FormData) {
  await requireAdmin();
  const title = str(formData, "title");
  if (!title) return;
  const count = await prisma.specialty.count();
  await prisma.specialty.create({ data: { title, order: count } });
  revalidatePath("/", "layout");
  revalidatePath("/admin/especialidades");
}

export async function updateSpecialtyAction(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  await prisma.specialty.update({
    where: { id },
    data: {
      title: str(formData, "title"),
      order: Number(formData.get("order")) || 0,
      published: formData.get("published") === "on",
    },
  });
  revalidatePath("/", "layout");
  revalidatePath("/admin/especialidades");
}

export async function deleteSpecialtyAction(formData: FormData) {
  await requireAdmin();
  await prisma.specialty.delete({ where: { id: str(formData, "id") } });
  revalidatePath("/", "layout");
  revalidatePath("/admin/especialidades");
}
