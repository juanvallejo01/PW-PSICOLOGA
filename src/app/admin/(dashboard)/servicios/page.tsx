import type { Metadata } from "next";
import { getServices } from "@/lib/content";
import { AdminHeading, AdminCard, SaveButton, CheckboxField } from "@/components/admin/ui";
import { addServiceAction, updateServiceAction, deleteServiceAction } from "./actions";

export const metadata: Metadata = { title: "Servicios" };

export default async function AdminServiciosPage() {
  const services = await getServices(false);

  return (
    <div className="max-w-4xl space-y-6">
      <AdminHeading
        title="Servicios y precios"
        subtitle="Dejá el precio en blanco para mostrar 'Consultar valores'."
      />

      <AdminCard>
        <div className="space-y-4 mb-6">
          {services.map((s) => (
            <form key={s.id} action={updateServiceAction} className="grid sm:grid-cols-2 gap-2 bg-purple-50 rounded-lg p-4">
              <input type="hidden" name="id" value={s.id} />
              <input name="name" defaultValue={s.name} placeholder="Nombre" className="rounded-lg border border-purple-200 px-2 py-2 text-sm sm:col-span-2" />
              <textarea name="description" defaultValue={s.description} placeholder="Descripción (una línea por párrafo; • para lista, # para etiqueta destacada)" className="rounded-lg border border-purple-200 px-2 py-2 text-sm sm:col-span-2" rows={4} />
              <input name="duration" defaultValue={s.duration} placeholder="Duración (ej: 45 min)" className="rounded-lg border border-purple-200 px-2 py-2 text-sm" />
              <input name="frequency" defaultValue={s.frequency} placeholder="Frecuencia (ej: semanal)" className="rounded-lg border border-purple-200 px-2 py-2 text-sm" />
              <input name="price" defaultValue={s.price ?? ""} placeholder="Precio (vacío = Consultar valores)" className="rounded-lg border border-purple-200 px-2 py-2 text-sm" />
              <input name="order" type="number" defaultValue={s.order} placeholder="Orden" className="rounded-lg border border-purple-200 px-2 py-2 text-sm" />
              <div className="flex items-center justify-between sm:col-span-2 mt-1">
                <CheckboxField label="Activo (visible en el sitio)" name="active" defaultChecked={s.active} />
                <div className="flex gap-3">
                  <button type="submit" className="text-xs text-purple-600 underline">Guardar</button>
                  <button type="submit" formAction={deleteServiceAction} className="text-xs text-pink-500 underline">Eliminar</button>
                </div>
              </div>
            </form>
          ))}
          {services.length === 0 && <p className="text-sm text-ink-500">Aún no agregaste servicios.</p>}
        </div>

        <p className="font-semibold text-ink-900 mb-3 text-sm">Agregar servicio</p>
        <form action={addServiceAction} className="flex gap-2">
          <input name="name" placeholder="Ej: Valoración inicial" required className="flex-1 rounded-lg border border-purple-200 px-2 py-2 text-sm" />
          <SaveButton>Agregar</SaveButton>
        </form>
      </AdminCard>
    </div>
  );
}
