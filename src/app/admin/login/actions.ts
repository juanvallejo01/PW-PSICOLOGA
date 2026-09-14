"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSessionCookie } from "@/lib/auth";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  const user = email ? await prisma.adminUser.findUnique({ where: { email } }) : null;
  const valid = user ? await verifyPassword(password, user.passwordHash) : false;

  if (!user || !valid) {
    redirect(`/admin/login?error=1${next !== "/admin" ? `&next=${encodeURIComponent(next)}` : ""}`);
  }

  await createSessionCookie(user.id);
  redirect(next.startsWith("/admin") ? next : "/admin");
}
