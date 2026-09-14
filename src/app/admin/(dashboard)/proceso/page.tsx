import type { Metadata } from "next";
import { getProcessSteps } from "@/lib/content";
import { AdminHeading, AdminCard, SaveButton } from "@/components/admin/ui";
import { addProcessStepAction, updateProcessStepAction, deleteProcessStepAction } from "./actions";

export const metadata: Metadata = { title: "Cómo trabajo" };

export default async function AdminProcesoPage() {
  const steps = await getProcessSteps();

  return (
    <div className="max-w-3xl space-y-6">
      <AdminHeading title="Cómo trabajo" subtitle="Pasos del proceso terapéutico, en orden." />

      <AdminCard>
        <div className="space-y-3 mb-6">
          {steps.map((step) => (
            <form key={step.id} action={updateProcessStepAction} className="grid sm:grid-cols-[70px_1fr_2fr_auto_auto] gap-2 items-center bg-purple-50 rounded-lg p-3">
              <input type="hidden" name="id" value={step.id} />
              <input name="order" type="number" defaultValue={step.order} className="rounded-lg border border-purple-200 px-2 py-2 text-sm" />
              <input name="title" defaultValue={step.title} className="rounded-lg border border-purple-200 px-2 py-2 text-sm" />
              <input name="description" defaultValue={step.description} className="rounded-lg border border-purple-200 px-2 py-2 text-sm" />
              <button type="submit" className="text-xs text-purple-600 underline">Guardar</button>
              <button type="submit" formAction={deleteProcessStepAction} className="text-xs text-pink-500 underline">Eliminar</button>
            </form>
          ))}
          {steps.length === 0 && <p className="text-sm text-ink-500">Aún no agregaste pasos.</p>}
        </div>

        <p className="font-semibold text-ink-900 mb-3 text-sm">Agregar paso</p>
        <form action={addProcessStepAction} className="grid sm:grid-cols-[1fr_2fr_auto] gap-2">
          <input name="title" placeholder="Título del paso" required className="rounded-lg border border-purple-200 px-2 py-2 text-sm" />
          <input name="description" placeholder="Descripción" className="rounded-lg border border-purple-200 px-2 py-2 text-sm" />
          <SaveButton>Agregar</SaveButton>
        </form>
      </AdminCard>
    </div>
  );
}
