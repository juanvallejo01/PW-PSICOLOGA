import type { Metadata } from "next";
import { getPaymentInfo, getPaymentMethods } from "@/lib/content";
import { AdminHeading, AdminCard, TextAreaField, SaveButton, CheckboxField } from "@/components/admin/ui";
import { updatePaymentInfoAction, addPaymentMethodAction, updatePaymentMethodAction, deletePaymentMethodAction } from "./actions";

export const metadata: Metadata = { title: "Métodos de pago" };

export default async function AdminPagosPage() {
  const [info, methods] = await Promise.all([getPaymentInfo(), getPaymentMethods(false)]);

  return (
    <div className="max-w-3xl space-y-6">
      <AdminHeading title="Métodos de pago" subtitle="Formas de pago aceptadas y condiciones generales." />

      <AdminCard>
        <p className="font-semibold text-ink-900 mb-4">Formas de pago</p>
        <div className="space-y-2 mb-6">
          {methods.map((m) => (
            <form key={m.id} action={updatePaymentMethodAction} className="flex items-center gap-3 bg-purple-50 rounded-lg p-3">
              <input type="hidden" name="id" value={m.id} />
              <input name="name" defaultValue={m.name} className="flex-1 rounded-lg border border-purple-200 px-2 py-2 text-sm" />
              <CheckboxField label="Activo" name="active" defaultChecked={m.active} />
              <button type="submit" className="text-xs text-purple-600 underline">Guardar</button>
              <button type="submit" formAction={deletePaymentMethodAction} className="text-xs text-pink-500 underline">Eliminar</button>
            </form>
          ))}
          {methods.length === 0 && <p className="text-sm text-ink-500">Aún no agregaste métodos de pago.</p>}
        </div>
        <form action={addPaymentMethodAction} className="flex gap-2">
          <input name="name" placeholder="Ej: Transferencia bancaria" required className="flex-1 rounded-lg border border-purple-200 px-2 py-2 text-sm" />
          <SaveButton>Agregar</SaveButton>
        </form>
      </AdminCard>

      <form action={updatePaymentInfoAction}>
        <AdminCard className="space-y-4">
          <p className="font-semibold text-ink-900">Condiciones generales</p>
          <label className="block">
            <span className="block text-sm font-medium text-ink-700 mb-1">Momento del pago</span>
            <input name="whenToPay" defaultValue={info.whenToPay} className="w-full rounded-lg border border-purple-200 px-3.5 py-2.5 text-sm" placeholder="Ej: Antes de la sesión" />
          </label>
          <div className="flex gap-6">
            <CheckboxField label="Se emite factura o recibo" name="issuesInvoice" defaultChecked={info.issuesInvoice} />
            <CheckboxField label="Acepta obra social / seguro" name="acceptsInsurance" defaultChecked={info.acceptsInsurance} />
          </div>
          <TextAreaField label="Notas adicionales" name="notes" defaultValue={info.notes} rows={3} />
          <SaveButton>Guardar</SaveButton>
        </AdminCard>
      </form>
    </div>
  );
}
