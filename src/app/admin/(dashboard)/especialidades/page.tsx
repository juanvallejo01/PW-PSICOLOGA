import type { Metadata } from "next";
import { getSpecialties } from "@/lib/content";
import { AdminHeading, AdminCard, SaveButton, CheckboxField } from "@/components/admin/ui";
import { addSpecialtyAction, updateSpecialtyAction, deleteSpecialtyAction } from "./actions";

export const metadata: Metadata = { title: "Temas y especialidades" };

export default async function AdminEspecialidadesPage() {
  const specialties = await getSpecialties(false);

  return (
    <div className="max-w-3xl space-y-6">
      <AdminHeading title="Temas y especialidades" subtitle="Lista de temas que se muestran en la home." />

      <AdminCard>
        <div className="space-y-3 mb-6">
          {specialties.map((s) => (
            <form key={s.id} action={updateSpecialtyAction} className="grid sm:grid-cols-[1fr_70px_auto_auto_auto] gap-2 items-center bg-purple-50 rounded-lg p-3">
              <input type="hidden" name="id" value={s.id} />
              <input name="title" defaultValue={s.title} className="rounded-lg border border-purple-200 px-2 py-2 text-sm" />
              <input name="order" type="number" defaultValue={s.order} className="rounded-lg border border-purple-200 px-2 py-2 text-sm" />
              <CheckboxField label="Visible" name="published" defaultChecked={s.published} />
              <button type="submit" className="text-xs text-purple-600 underline">Guardar</button>
              <button type="submit" formAction={deleteSpecialtyAction} className="text-xs text-pink-500 underline">Eliminar</button>
            </form>
          ))}
          {specialties.length === 0 && <p className="text-sm text-ink-500">Aún no agregaste temas.</p>}
        </div>

        <p className="font-semibold text-ink-900 mb-3 text-sm">Agregar nuevo tema</p>
        <form action={addSpecialtyAction} className="flex gap-2">
          <input name="title" placeholder="Ej: Ansiedad y manejo de emociones" required className="flex-1 rounded-lg border border-purple-200 px-2 py-2 text-sm" />
          <SaveButton>Agregar</SaveButton>
        </form>
      </AdminCard>
    </div>
  );
}
