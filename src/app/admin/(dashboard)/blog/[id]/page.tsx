import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminHeading, AdminCard, Field, TextAreaField, SaveButton, CheckboxField, ImageField } from "@/components/admin/ui";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { updatePostAction } from "../actions";

export const metadata: Metadata = { title: "Editar entrada" };

export default async function EditarEntradaPage(props: PageProps<"/admin/blog/[id]">) {
  const { id } = await props.params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <div className="max-w-3xl space-y-6">
      <AdminHeading title="Editar entrada" subtitle={`/blog/${post.slug}`} />

      <form action={updatePostAction}>
        <AdminCard className="space-y-4">
          <input type="hidden" name="id" value={post.id} />
          <Field label="Título" name="title" defaultValue={post.title} required />
          <TextAreaField label="Resumen" name="excerpt" defaultValue={post.excerpt} rows={2} />
          <ImageField label="Imagen de portada" name="coverImage" currentUrl={post.coverImageUrl} />
          <label className="block">
            <span className="block text-sm font-medium text-ink-700 mb-1">Contenido</span>
            <RichTextEditor name="contentHtml" defaultValue={post.contentHtml} />
          </label>
          <CheckboxField label="Publicada (visible en el sitio)" name="published" defaultChecked={post.published} />
          <SaveButton>Guardar cambios</SaveButton>
        </AdminCard>
      </form>
    </div>
  );
}
