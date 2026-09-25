"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { normalizePrice } from "@/lib/prices";

function str(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function addServiceAction(formData: FormData) {
  await requireAdmin();
  const name = str(formData, "name");
  if (!name) return;
  const count = await prisma.service.count();
  await prisma.service.create({ data: { name, order: count } });
  revalidatePath("/", "layout");
  revalidatePath("/admin/servicios");
}

export async function updateServiceAction(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  await prisma.service.update({
    where: { id },
    data: {
      name: str(formData, "name"),
      description: str(formData, "description"),
      duration: str(formData, "duration"),
      frequency: str(formData, "frequency"),
      priceUsd: normalizePrice(str(formData, "priceUsd"), "USD"),
      priceCop: normalizePrice(str(formData, "priceCop"), "COP"),
      order: Number(formData.get("order")) || 0,
      active: formData.get("active") === "on",
    },
  });
  revalidatePath("/", "layout");
  revalidatePath("/admin/servicios");
}

export async function deleteServiceAction(formData: FormData) {
  await requireAdmin();
  await prisma.service.delete({ where: { id: str(formData, "id") } });
  revalidatePath("/", "layout");
  revalidatePath("/admin/servicios");
}
