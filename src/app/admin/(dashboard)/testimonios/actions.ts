"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

function str(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function addTestimonialAction(formData: FormData) {
  await requireAdmin();
  const quote = str(formData, "quote");
  if (!quote) return;
  const count = await prisma.testimonial.count();
  await prisma.testimonial.create({
    data: {
      quote,
      authorInitials: str(formData, "authorInitials") || "Paciente anónimo",
      order: count,
    },
  });
  revalidatePath("/", "layout");
  revalidatePath("/admin/testimonios");
}

export async function updateTestimonialAction(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  await prisma.testimonial.update({
    where: { id },
    data: {
      quote: str(formData, "quote"),
      authorInitials: str(formData, "authorInitials") || "Paciente anónimo",
      order: Number(formData.get("order")) || 0,
      published: formData.get("published") === "on",
    },
  });
  revalidatePath("/", "layout");
  revalidatePath("/admin/testimonios");
}

export async function deleteTestimonialAction(formData: FormData) {
  await requireAdmin();
  await prisma.testimonial.delete({ where: { id: str(formData, "id") } });
  revalidatePath("/", "layout");
  revalidatePath("/admin/testimonios");
}
