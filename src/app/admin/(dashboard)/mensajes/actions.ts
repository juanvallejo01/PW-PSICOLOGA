"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function markMessageReadAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const read = formData.get("read") === "true";
  await prisma.contactSubmission.update({ where: { id }, data: { read: !read } });
  revalidatePath("/admin/mensajes");
  revalidatePath("/admin");
}

export async function deleteMessageAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  await prisma.contactSubmission.delete({ where: { id } });
  revalidatePath("/admin/mensajes");
  revalidatePath("/admin");
}
