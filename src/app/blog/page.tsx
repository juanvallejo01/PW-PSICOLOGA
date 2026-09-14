import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getPublishedBlogPosts } from "@/lib/content";
import { Container, SectionHeading, Card } from "@/components/ui";

export const metadata: Metadata = { title: "Blog" };

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts();

  return (
    <Container className="py-16 sm:py-24">
      <SectionHeading
        eyebrow="Blog"
        title="Reflexiones sobre bienestar emocional"
        subtitle="Textos propios para acompañarte también fuera de sesión."
      />

      {posts.length === 0 ? (
        <p className="text-ink-500">Muy pronto vas a encontrar acá las primeras entradas.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="block group">
              <Card className="h-full flex flex-col">
                {post.coverImageUrl && (
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-4 -mt-2">
                    <Image src={post.coverImageUrl} alt={post.title} fill className="object-cover" sizes="360px" />
                  </div>
                )}
                {post.publishedAt && (
                  <p className="text-xs text-aqua-600 font-medium mb-1">
                    {new Date(post.publishedAt).toLocaleDateString("es", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                )}
                <p className="font-display font-semibold text-ink-900 group-hover:text-purple-600 transition-colors">
                  {post.title}
                </p>
                {post.excerpt && <p className="text-sm text-ink-500 mt-2 line-clamp-3">{post.excerpt}</p>}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </Container>
  );
}
