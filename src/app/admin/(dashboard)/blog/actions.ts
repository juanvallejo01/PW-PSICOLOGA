"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import slugify from "slugify";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { saveUploadedImage } from "@/lib/uploads";

function str(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

async function uniqueSlug(base: string, ignoreId?: string) {
  const rootSlug = slugify(base, { lower: true, strict: true }) || "entrada";
  let slug = rootSlug;
  let i = 1;
  while (
    await prisma.blogPost.findFirst({
      where: { slug, ...(ignoreId ? { id: { not: ignoreId } } : {}) },
    })
  ) {
    i += 1;
    slug = `${rootSlug}-${i}`;
  }
  return slug;
}

export async function createPostAction(formData: FormData) {
  await requireAdmin();

  const title = str(formData, "title");
  if (!title) redirect("/admin/blog");

  let coverImageUrl: string | null = null;
  const cover = formData.get("coverImage");
  if (cover instanceof File && cover.size > 0) {
    coverImageUrl = await saveUploadedImage(cover);
  }

  const published = formData.get("published") === "on";
  const slug = await uniqueSlug(title);

  const post = await prisma.blogPost.create({
    data: {
      title,
      slug,
      excerpt: str(formData, "excerpt"),
      contentHtml: str(formData, "contentHtml"),
      coverImageUrl,
      published,
      publishedAt: published ? new Date() : null,
    },
  });

  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  redirect(`/admin/blog/${post.id}`);
}

export async function updatePostAction(formData: FormData) {
  await requireAdmin();

  const id = str(formData, "id");
  const title = str(formData, "title");
  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) redirect("/admin/blog");

  let coverImageUrl: string | undefined;
  const cover = formData.get("coverImage");
  if (cover instanceof File && cover.size > 0) {
    coverImageUrl = await saveUploadedImage(cover);
  }

  const published = formData.get("published") === "on";
  const slug = title !== existing!.title ? await uniqueSlug(title, id) : existing!.slug;

  await prisma.blogPost.update({
    where: { id },
    data: {
      title,
      slug,
      excerpt: str(formData, "excerpt"),
      contentHtml: str(formData, "contentHtml"),
      published,
      publishedAt: published ? existing!.publishedAt ?? new Date() : null,
      ...(coverImageUrl ? { coverImageUrl } : {}),
    },
  });

  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}

export async function deletePostAction(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  await prisma.blogPost.delete({ where: { id } });
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
}
