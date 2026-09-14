"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().trim().min(2, "Ingresá tu nombre"),
  email: z.string().trim().email("Ingresá un email válido"),
  message: z.string().trim().min(5, "Contanos un poco más"),
});

export async function submitContactForm(formData: FormData) {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    redirect("/contacto?error=1");
  }

  await prisma.contactSubmission.create({ data: parsed.data });

  redirect("/contacto?enviado=1");
}
