import type { Metadata } from "next";
import { getAboutContent, getEducationItems } from "@/lib/content";
import { AdminHeading, AdminCard, Field, TextAreaField, SaveButton, ImageField } from "@/components/admin/ui";
import { updateAboutAction, addEducationAction, updateEducationAction, deleteEducationAction } from "./actions";

export const metadata: Metadata = { title: "Sobre mí" };

export default async function AdminSobreMiPage() {
  const [about, education] = await Promise.all([getAboutContent(), getEducationItems()]);

  return (
    <div className="max-w-3xl space-y-8">
      <AdminHeading title="Sobre mí" subtitle="Presentación, foto y formación académica." />

      <form action={updateAboutAction}>
        <AdminCard className="space-y-4">
          <ImageField label="Foto profesional" name="photo" currentUrl={about.photoUrl} />
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Título / rol" name="title" defaultValue={about.title} required />
            <Field label="Años de experiencia" name="yearsExperience" type="number" defaultValue={about.yearsExperience} required />
          </div>
          <TextAreaField
            label="Presentación (podés usar HTML simple: <p>, <strong>, <ul><li>)"
            name="bioHtml"
            defaultValue={about.bioHtml}
            rows={8}
            required
          />
          <TextAreaField label="Frase de cierre" name="closingQuote" defaultValue={about.closingQuote} rows={2} />
          <SaveButton>Guardar</SaveButton>
        </AdminCard>
      </form>

      <AdminCard>
        <p className="font-semibold text-ink-900 mb-4">Formación académica y cursos</p>
        <div className="space-y-3 mb-6">
          {education.map((item) => (
            <form key={item.id} action={updateEducationAction} className="grid sm:grid-cols-[110px_1fr_1fr_100px_70px_auto_auto] gap-2 items-end bg-purple-50 rounded-lg p-3">
              <input type="hidden" name="id" value={item.id} />
              <label className="block">
                <span className="block text-xs text-ink-500 mb-1">Tipo</span>
                <select name="type" defaultValue={item.type} className="w-full rounded-lg border border-purple-200 px-2 py-2 text-sm">
                  <option value="degree">Título</option>
                  <option value="course">Curso</option>
                </select>
              </label>
              <label className="block">
                <span className="block text-xs text-ink-500 mb-1">Título</span>
                <input name="title" defaultValue={item.title} className="w-full rounded-lg border border-purple-200 px-2 py-2 text-sm" />
              </label>
              <label className="block">
                <span className="block text-xs text-ink-500 mb-1">Institución</span>
                <input name="institution" defaultValue={item.institution ?? ""} className="w-full rounded-lg border border-purple-200 px-2 py-2 text-sm" />
              </label>
              <label className="block">
                <span className="block text-xs text-ink-500 mb-1">Periodo</span>
                <input name="period" defaultValue={item.period ?? ""} className="w-full rounded-lg border border-purple-200 px-2 py-2 text-sm" />
              </label>
              <label className="block">
                <span className="block text-xs text-ink-500 mb-1">Orden</span>
                <input name="order" type="number" defaultValue={item.order} className="w-full rounded-lg border border-purple-200 px-2 py-2 text-sm" />
              </label>
              <button type="submit" className="text-xs text-purple-600 underline pb-2.5">Guardar</button>
              <button type="submit" formAction={deleteEducationAction} className="text-xs text-pink-500 underline pb-2.5">Eliminar</button>
            </form>
          ))}
          {education.length === 0 && <p className="text-sm text-ink-500">Aún no hay formación cargada.</p>}
        </div>

        <p className="font-semibold text-ink-900 mb-3 text-sm">Agregar nuevo</p>
        <form action={addEducationAction} className="grid sm:grid-cols-[110px_1fr_1fr_100px_auto] gap-2 items-end">
          <label className="block">
            <span className="block text-xs text-ink-500 mb-1">Tipo</span>
            <select name="type" defaultValue="course" className="w-full rounded-lg border border-purple-200 px-2 py-2 text-sm">
              <option value="degree">Título</option>
              <option value="course">Curso</option>
            </select>
          </label>
          <input name="title" placeholder="Título" required className="rounded-lg border border-purple-200 px-2 py-2 text-sm" />
          <input name="institution" placeholder="Institución" className="rounded-lg border border-purple-200 px-2 py-2 text-sm" />
          <input name="period" placeholder="Ej: 2020–2021" className="rounded-lg border border-purple-200 px-2 py-2 text-sm" />
          <SaveButton>Agregar</SaveButton>
        </form>
      </AdminCard>
    </div>
  );
}
