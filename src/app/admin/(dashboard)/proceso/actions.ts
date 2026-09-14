"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

function str(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function addProcessStepAction(formData: FormData) {
  await requireAdmin();
  const title = str(formData, "title");
  if (!title) return;
  const count = await prisma.processStep.count();
  await prisma.processStep.create({ data: { title, description: str(formData, "description"), order: count } });
  revalidatePath("/", "layout");
  revalidatePath("/admin/proceso");
}

export async function updateProcessStepAction(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  await prisma.processStep.update({
    where: { id },
    data: {
      title: str(formData, "title"),
      description: str(formData, "description"),
      order: Number(formData.get("order")) || 0,
    },
  });
  revalidatePath("/", "layout");
  revalidatePath("/admin/proceso");
}

export async function deleteProcessStepAction(formData: FormData) {
  await requireAdmin();
  await prisma.processStep.delete({ where: { id: str(formData, "id") } });
  revalidatePath("/", "layout");
  revalidatePath("/admin/proceso");
}
