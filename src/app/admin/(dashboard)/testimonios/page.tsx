import type { Metadata } from "next";
import { getTestimonials } from "@/lib/content";
import { AdminHeading, AdminCard, SaveButton, CheckboxField } from "@/components/admin/ui";
import { addTestimonialAction, updateTestimonialAction, deleteTestimonialAction } from "./actions";

export const metadata: Metadata = { title: "Testimonios" };

export default async function AdminTestimoniosPage() {
  const testimonials = await getTestimonials(false);

  return (
    <div className="max-w-3xl space-y-6">
      <AdminHeading
        title="Testimonios"
        subtitle="Quedan ocultos en el sitio hasta que los marqués como publicados."
      />

      <AdminCard>
        <div className="space-y-4 mb-6">
          {testimonials.map((t) => (
            <form key={t.id} action={updateTestimonialAction} className="space-y-2 bg-purple-50 rounded-lg p-4">
              <input type="hidden" name="id" value={t.id} />
              <textarea name="quote" defaultValue={t.quote} placeholder="Cita del testimonio" rows={3} className="w-full rounded-lg border border-purple-200 px-2 py-2 text-sm" />
              <input name="authorInitials" defaultValue={t.authorInitials} placeholder="Iniciales o 'Paciente anónimo'" className="w-full rounded-lg border border-purple-200 px-2 py-2 text-sm" />
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-4">
                  <input name="order" type="number" defaultValue={t.order} className="w-20 rounded-lg border border-purple-200 px-2 py-2 text-sm" />
                  <CheckboxField label="Publicado" name="published" defaultChecked={t.published} />
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="text-xs text-purple-600 underline">Guardar</button>
                  <button type="submit" formAction={deleteTestimonialAction} className="text-xs text-pink-500 underline">Eliminar</button>
                </div>
              </div>
            </form>
          ))}
          {testimonials.length === 0 && <p className="text-sm text-ink-500">Aún no agregaste testimonios.</p>}
        </div>

        <p className="font-semibold text-ink-900 mb-3 text-sm">Agregar testimonio</p>
        <form action={addTestimonialAction} className="space-y-2">
          <textarea name="quote" placeholder="Cita del testimonio" rows={3} required className="w-full rounded-lg border border-purple-200 px-2 py-2 text-sm" />
          <input name="authorInitials" placeholder="Iniciales o 'Paciente anónimo'" className="w-full rounded-lg border border-purple-200 px-2 py-2 text-sm" />
          <SaveButton>Agregar</SaveButton>
        </form>
      </AdminCard>
    </div>
  );
}
