"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { saveUploadedImage } from "@/lib/uploads";

function str(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function updateSettingsAction(formData: FormData) {
  await requireAdmin();

  let heroImageUrl: string | undefined;
  const heroImage = formData.get("heroImage");
  if (heroImage instanceof File && heroImage.size > 0) {
    heroImageUrl = await saveUploadedImage(heroImage);
  }

  await prisma.siteSettings.update({
    where: { id: 1 },
    data: {
      siteName: str(formData, "siteName"),
      logoText: str(formData, "logoText"),
      heroTitle: str(formData, "heroTitle"),
      heroSubtitle: str(formData, "heroSubtitle"),
      heroCtaPrimaryText: str(formData, "heroCtaPrimaryText"),
      heroCtaSecondaryText: str(formData, "heroCtaSecondaryText"),
      bookingMode: str(formData, "bookingMode") || "whatsapp",
      scheduleText: str(formData, "scheduleText"),
      cancellationPolicy: str(formData, "cancellationPolicy"),
      whatsappNumber: str(formData, "whatsappNumber") || null,
      whatsappMessageTemplate: str(formData, "whatsappMessageTemplate"),
      phone: str(formData, "phone") || null,
      phoneVisible: formData.get("phoneVisible") === "on",
      contactEmail: str(formData, "contactEmail") || null,
      footerLegalText: str(formData, "footerLegalText"),
      ...(heroImageUrl ? { heroImageUrl } : {}),
    },
  });

  revalidatePath("/", "layout");
  revalidatePath("/admin/configuracion");
}

export async function addSocialLinkAction(formData: FormData) {
  await requireAdmin();
  const platform = str(formData, "platform");
  const url = str(formData, "url");
  if (!platform || !url) return;

  const count = await prisma.socialLink.count();
  await prisma.socialLink.create({ data: { platform, url, order: count } });

  revalidatePath("/", "layout");
  revalidatePath("/admin/configuracion");
}

export async function toggleSocialLinkAction(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  const visible = str(formData, "visible") === "true";
  await prisma.socialLink.update({ where: { id }, data: { visible: !visible } });

  revalidatePath("/", "layout");
  revalidatePath("/admin/configuracion");
}

export async function deleteSocialLinkAction(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  await prisma.socialLink.delete({ where: { id } });

  revalidatePath("/", "layout");
  revalidatePath("/admin/configuracion");
}
