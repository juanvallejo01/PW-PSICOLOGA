import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { AdminHeading, AdminCard, ButtonLinkAdmin } from "@/components/admin/ui";
import { deletePostAction } from "./actions";

export const metadata: Metadata = { title: "Blog" };

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <AdminHeading title="Blog" subtitle="Entradas de reflexiones y artículos." />
        <ButtonLinkAdmin href="/admin/blog/nuevo">Nueva entrada</ButtonLinkAdmin>
      </div>

      <div className="space-y-3">
        {posts.map((post) => (
          <AdminCard key={post.id} className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="font-semibold text-ink-900 truncate">{post.title}</p>
              <p className="text-xs text-ink-500 mt-1">
                {post.published ? (
                  <span className="text-aqua-600 font-medium">Publicada</span>
                ) : (
                  <span className="text-purple-500 font-medium">Borrador</span>
                )}
                {" · "}
                {post.createdAt.toLocaleDateString("es", { dateStyle: "medium" })}
              </p>
            </div>
            <div className="flex gap-3 shrink-0 text-xs">
              <Link href={`/admin/blog/${post.id}`} className="text-purple-600 underline">
                Editar
              </Link>
              <form action={deletePostAction}>
                <input type="hidden" name="id" value={post.id} />
                <button type="submit" className="text-pink-500 underline">
                  Eliminar
                </button>
              </form>
            </div>
          </AdminCard>
        ))}
        {posts.length === 0 && <p className="text-sm text-ink-500">Todavía no hay entradas.</p>}
      </div>
    </div>
  );
}
