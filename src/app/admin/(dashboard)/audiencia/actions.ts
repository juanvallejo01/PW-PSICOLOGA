"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

function str(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function addAudienceGroupAction(formData: FormData) {
  await requireAdmin();
  const name = str(formData, "name");
  if (!name) return;
  const count = await prisma.audienceGroup.count();
  await prisma.audienceGroup.create({ data: { name, description: str(formData, "description"), order: count } });
  revalidatePath("/", "layout");
  revalidatePath("/admin/audiencia");
}

export async function updateAudienceGroupAction(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  await prisma.audienceGroup.update({
    where: { id },
    data: {
      name: str(formData, "name"),
      description: str(formData, "description"),
      order: Number(formData.get("order")) || 0,
      published: formData.get("published") === "on",
    },
  });
  revalidatePath("/", "layout");
  revalidatePath("/admin/audiencia");
}

export async function deleteAudienceGroupAction(formData: FormData) {
  await requireAdmin();
  await prisma.audienceGroup.delete({ where: { id: str(formData, "id") } });
  revalidatePath("/", "layout");
  revalidatePath("/admin/audiencia");
}
