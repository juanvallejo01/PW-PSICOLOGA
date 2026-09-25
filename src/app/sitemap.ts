import type { MetadataRoute } from "next";
import { getPublishedBlogPosts } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedBlogPosts();
  const pages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/servicios"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/sobre-mi"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/como-trabajo"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/contacto"), changeFrequency: "yearly", priority: 0.7 },
    { url: absoluteUrl("/blog"), changeFrequency: "weekly", priority: 0.6 },
  ];
  return [
    ...pages,
    ...posts.map((p) => ({
      url: absoluteUrl(`/blog/${p.slug}`),
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
