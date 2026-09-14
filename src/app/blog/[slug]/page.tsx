import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getBlogPostBySlug } from "@/lib/content";
import { Container } from "@/components/ui";
import { Icon } from "@/components/icon";

export async function generateMetadata(props: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt || undefined };
}

export default async function BlogPostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = await getBlogPostBySlug(slug);

  if (!post || !post.published) notFound();

  return (
    <Container className="py-16 sm:py-24 max-w-2xl">
      <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-purple-600 font-medium mb-8">
        <Icon name="arrow-right" className="w-4 h-4 rotate-180" />
        Volver al blog
      </Link>

      {post.publishedAt && (
        <p className="text-xs text-aqua-600 font-medium mb-2">
          {new Date(post.publishedAt).toLocaleDateString("es", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      )}
      <h1 className="font-display text-3xl font-semibold text-ink-900">{post.title}</h1>

      {post.coverImageUrl && (
        <div className="relative aspect-video rounded-2xl overflow-hidden mt-6">
          <Image src={post.coverImageUrl} alt={post.title} fill className="object-cover" sizes="700px" />
        </div>
      )}

      <div className="prose-warm mt-8" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
    </Container>
  );
}
