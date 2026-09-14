"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

function str(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function addFaqAction(formData: FormData) {
  await requireAdmin();
  const question = str(formData, "question");
  if (!question) return;
  const count = await prisma.faq.count();
  await prisma.faq.create({ data: { question, answer: str(formData, "answer"), order: count } });
  revalidatePath("/", "layout");
  revalidatePath("/admin/faq");
}

export async function updateFaqAction(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  await prisma.faq.update({
    where: { id },
    data: {
      question: str(formData, "question"),
      answer: str(formData, "answer"),
      order: Number(formData.get("order")) || 0,
      published: formData.get("published") === "on",
    },
  });
  revalidatePath("/", "layout");
  revalidatePath("/admin/faq");
}

export async function deleteFaqAction(formData: FormData) {
  await requireAdmin();
  await prisma.faq.delete({ where: { id: str(formData, "id") } });
  revalidatePath("/", "layout");
  revalidatePath("/admin/faq");
}
