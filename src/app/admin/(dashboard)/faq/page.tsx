import type { Metadata } from "next";
import { getFaqs } from "@/lib/content";
import { AdminHeading, AdminCard, SaveButton, CheckboxField } from "@/components/admin/ui";
import { addFaqAction, updateFaqAction, deleteFaqAction } from "./actions";

export const metadata: Metadata = { title: "Preguntas frecuentes" };

export default async function AdminFaqPage() {
  const faqs = await getFaqs(false);

  return (
    <div className="max-w-3xl space-y-6">
      <AdminHeading title="Preguntas frecuentes" subtitle="Se muestran en la home y en la página de contacto." />

      <AdminCard>
        <div className="space-y-4 mb-6">
          {faqs.map((faq) => (
            <form key={faq.id} action={updateFaqAction} className="space-y-2 bg-purple-50 rounded-lg p-4">
              <input type="hidden" name="id" value={faq.id} />
              <input name="question" defaultValue={faq.question} placeholder="Pregunta" className="w-full rounded-lg border border-purple-200 px-2 py-2 text-sm font-medium" />
              <textarea name="answer" defaultValue={faq.answer} placeholder="Respuesta" rows={2} className="w-full rounded-lg border border-purple-200 px-2 py-2 text-sm" />
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-4">
                  <input name="order" type="number" defaultValue={faq.order} className="w-20 rounded-lg border border-purple-200 px-2 py-2 text-sm" />
                  <CheckboxField label="Publicada" name="published" defaultChecked={faq.published} />
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="text-xs text-purple-600 underline">Guardar</button>
                  <button type="submit" formAction={deleteFaqAction} className="text-xs text-pink-500 underline">Eliminar</button>
                </div>
              </div>
            </form>
          ))}
          {faqs.length === 0 && <p className="text-sm text-ink-500">Aún no agregaste preguntas.</p>}
        </div>

        <p className="font-semibold text-ink-900 mb-3 text-sm">Agregar pregunta</p>
        <form action={addFaqAction} className="space-y-2">
          <input name="question" placeholder="Pregunta" required className="w-full rounded-lg border border-purple-200 px-2 py-2 text-sm" />
          <textarea name="answer" placeholder="Respuesta" rows={2} className="w-full rounded-lg border border-purple-200 px-2 py-2 text-sm" />
          <SaveButton>Agregar</SaveButton>
        </form>
      </AdminCard>
    </div>
  );
}
