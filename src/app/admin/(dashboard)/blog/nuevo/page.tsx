import type { Metadata } from "next";
import { AdminHeading, AdminCard, Field, TextAreaField, SaveButton, CheckboxField, ImageField } from "@/components/admin/ui";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { createPostAction } from "../actions";

export const metadata: Metadata = { title: "Nueva entrada" };

export default function NuevaEntradaPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <AdminHeading title="Nueva entrada de blog" />

      <form action={createPostAction}>
        <AdminCard className="space-y-4">
          <Field label="Título" name="title" required />
          <TextAreaField label="Resumen (se muestra en las tarjetas del blog)" name="excerpt" rows={2} />
          <ImageField label="Imagen de portada" name="coverImage" />
          <label className="block">
            <span className="block text-sm font-medium text-ink-700 mb-1">Contenido</span>
            <RichTextEditor name="contentHtml" />
          </label>
          <CheckboxField label="Publicar ahora (si no, queda como borrador)" name="published" />
          <SaveButton>Guardar entrada</SaveButton>
        </AdminCard>
      </form>
    </div>
  );
}
