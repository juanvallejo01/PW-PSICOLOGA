"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin, verifyPassword, hashPassword } from "@/lib/auth";

export async function changePasswordAction(formData: FormData) {
  const userId = await requireAdmin();

  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  const user = await prisma.adminUser.findUnique({ where: { id: userId } });
  if (!user) return { error: "Sesión inválida." };

  const valid = await verifyPassword(currentPassword, user.passwordHash);
  if (!valid) return { error: "La contraseña actual no es correcta." };

  if (newPassword.length < 8) {
    return { error: "La nueva contraseña debe tener al menos 8 caracteres." };
  }
  if (newPassword !== confirmPassword) {
    return { error: "Las contraseñas nuevas no coinciden." };
  }

  const passwordHash = await hashPassword(newPassword);
  await prisma.adminUser.update({ where: { id: userId }, data: { passwordHash } });

  revalidatePath("/admin/cuenta");
  return { success: "Contraseña actualizada correctamente." };
}
