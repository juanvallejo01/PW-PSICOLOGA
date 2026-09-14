import { cache } from "react";
import { prisma } from "@/lib/prisma";

// Capa de lectura de contenido público, usada por las páginas del sitio.
// `cache()` evita consultas repetidas cuando varios componentes de la
// misma página piden el mismo dato (p. ej. header y footer piden
// getSiteSettings en el mismo render).

export const getSiteSettings = cache(async () => {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  if (settings) return settings;
  return prisma.siteSettings.create({ data: { id: 1 } });
});

export const getSocialLinks = cache(async (publishedOnly = true) => {
  return prisma.socialLink.findMany({
    where: publishedOnly ? { visible: true } : undefined,
    orderBy: { order: "asc" },
  });
});

export const getAboutContent = cache(async () => {
  const about = await prisma.aboutContent.findUnique({ where: { id: 1 } });
  if (about) return about;
  return prisma.aboutContent.create({ data: { id: 1 } });
});

export const getEducationItems = cache(async () => {
  return prisma.educationItem.findMany({ orderBy: { order: "asc" } });
});

export const getAudienceGroups = cache(async (publishedOnly = true) => {
  return prisma.audienceGroup.findMany({
    where: publishedOnly ? { published: true } : undefined,
    orderBy: { order: "asc" },
  });
});

export const getSpecialties = cache(async (publishedOnly = true) => {
  return prisma.specialty.findMany({
    where: publishedOnly ? { published: true } : undefined,
    orderBy: { order: "asc" },
  });
});

export const getProcessSteps = cache(async () => {
  return prisma.processStep.findMany({ orderBy: { order: "asc" } });
});

export const getServices = cache(async (activeOnly = true) => {
  return prisma.service.findMany({
    where: activeOnly ? { active: true } : undefined,
    orderBy: { order: "asc" },
  });
});

export const getPaymentInfo = cache(async () => {
  const info = await prisma.paymentInfo.findUnique({ where: { id: 1 } });
  if (info) return info;
  return prisma.paymentInfo.create({ data: { id: 1 } });
});

export const getPaymentMethods = cache(async (activeOnly = true) => {
  return prisma.paymentMethod.findMany({
    where: activeOnly ? { active: true } : undefined,
    orderBy: { order: "asc" },
  });
});

export const getFaqs = cache(async (publishedOnly = true) => {
  return prisma.faq.findMany({
    where: publishedOnly ? { published: true } : undefined,
    orderBy: { order: "asc" },
  });
});

export const getPublishedBlogPosts = cache(async () => {
  return prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });
});

export const getBlogPostBySlug = cache(async (slug: string) => {
  return prisma.blogPost.findUnique({ where: { slug } });
});

export const getTestimonials = cache(async (publishedOnly = true) => {
  return prisma.testimonial.findMany({
    where: publishedOnly ? { published: true } : undefined,
    orderBy: { order: "asc" },
  });
});

export function buildWhatsappUrl(phone: string | null | undefined, message: string) {
  if (!phone) return null;
  const digits = phone.replace(/[^\d]/g, "");
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${digits}?text=${encoded}`;
}
