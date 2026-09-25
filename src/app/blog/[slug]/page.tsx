import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getBlogPostBySlug } from "@/lib/content";
import { Container } from "@/components/ui";
import { Icon } from "@/components/icon";
import { JsonLd } from "@/components/json-ld";
import { PERSON_NAME, absoluteUrl } from "@/lib/site";

export async function generateMetadata(props: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getBlogPostBySlug(slug);
  if (!post || !post.published) return {};
  const image = post.coverImageUrl ?? "/opengraph-image.png";
  return {
    title: post.title,
    description: post.excerpt || undefined,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      url: `/blog/${post.slug}`,
      title: post.title,
      description: post.excerpt || undefined,
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [PERSON_NAME],
      images: [{ url: image }],
    },
  };
}

export default async function BlogPostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = await getBlogPostBySlug(slug);

  if (!post || !post.published) notFound();

  return (
    <Container className="py-16 sm:py-24 max-w-2xl">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt || undefined,
          inLanguage: "es",
          image: absoluteUrl(post.coverImageUrl ?? "/opengraph-image.png"),
          datePublished: post.publishedAt?.toISOString(),
          dateModified: post.updatedAt.toISOString(),
          mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
          author: { "@type": "Person", name: PERSON_NAME, url: absoluteUrl("/sobre-mi") },
          publisher: { "@type": "Organization", name: `${PERSON_NAME}, Psicóloga`, logo: { "@type": "ImageObject", url: absoluteUrl("/brand/logo-vertical.png") } },
        }}
      />
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
