import type { Metadata } from "next";
import { getAudienceGroups } from "@/lib/content";
import { AdminHeading, AdminCard, SaveButton, CheckboxField } from "@/components/admin/ui";
import { addAudienceGroupAction, updateAudienceGroupAction, deleteAudienceGroupAction } from "./actions";

export const metadata: Metadata = { title: "A quién atiendo" };

export default async function AdminAudienciaPage() {
  const groups = await getAudienceGroups(false);

  return (
    <div className="max-w-3xl space-y-6">
      <AdminHeading title="A quién atiendo" subtitle="Grupos que se muestran en la sección de la home." />

      <AdminCard>
        <div className="space-y-3 mb-6">
          {groups.map((g) => (
            <form key={g.id} action={updateAudienceGroupAction} className="grid sm:grid-cols-[1fr_2fr_70px_auto_auto_auto] gap-2 items-center bg-purple-50 rounded-lg p-3">
              <input type="hidden" name="id" value={g.id} />
              <input name="name" defaultValue={g.name} className="rounded-lg border border-purple-200 px-2 py-2 text-sm" placeholder="Nombre" />
              <input name="description" defaultValue={g.description} className="rounded-lg border border-purple-200 px-2 py-2 text-sm" placeholder="Descripción (opcional)" />
              <input name="order" type="number" defaultValue={g.order} className="rounded-lg border border-purple-200 px-2 py-2 text-sm" />
              <CheckboxField label="Visible" name="published" defaultChecked={g.published} />
              <button type="submit" className="text-xs text-purple-600 underline">Guardar</button>
              <button type="submit" formAction={deleteAudienceGroupAction} className="text-xs text-pink-500 underline">Eliminar</button>
            </form>
          ))}
          {groups.length === 0 && <p className="text-sm text-ink-500">Aún no agregaste grupos.</p>}
        </div>

        <p className="font-semibold text-ink-900 mb-3 text-sm">Agregar nuevo grupo</p>
        <form action={addAudienceGroupAction} className="grid sm:grid-cols-[1fr_2fr_auto] gap-2">
          <input name="name" placeholder="Ej: Niños" required className="rounded-lg border border-purple-200 px-2 py-2 text-sm" />
          <input name="description" placeholder="Ej: A partir de 8 años" className="rounded-lg border border-purple-200 px-2 py-2 text-sm" />
          <SaveButton>Agregar</SaveButton>
        </form>
      </AdminCard>
    </div>
  );
}
