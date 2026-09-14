"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

function str(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function updatePaymentInfoAction(formData: FormData) {
  await requireAdmin();
  await prisma.paymentInfo.update({
    where: { id: 1 },
    data: {
      whenToPay: str(formData, "whenToPay"),
      issuesInvoice: formData.get("issuesInvoice") === "on",
      acceptsInsurance: formData.get("acceptsInsurance") === "on",
      notes: str(formData, "notes"),
    },
  });
  revalidatePath("/", "layout");
  revalidatePath("/admin/pagos");
}

export async function addPaymentMethodAction(formData: FormData) {
  await requireAdmin();
  const name = str(formData, "name");
  if (!name) return;
  const count = await prisma.paymentMethod.count();
  await prisma.paymentMethod.create({ data: { name, order: count } });
  revalidatePath("/", "layout");
  revalidatePath("/admin/pagos");
}

export async function updatePaymentMethodAction(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  await prisma.paymentMethod.update({
    where: { id },
    data: {
      name: str(formData, "name"),
      active: formData.get("active") === "on",
    },
  });
  revalidatePath("/", "layout");
  revalidatePath("/admin/pagos");
}

export async function deletePaymentMethodAction(formData: FormData) {
  await requireAdmin();
  await prisma.paymentMethod.delete({ where: { id: str(formData, "id") } });
  revalidatePath("/", "layout");
  revalidatePath("/admin/pagos");
}
