import type { Metadata } from "next";
import { getSiteSettings, getSocialLinks } from "@/lib/content";
import { AdminHeading, AdminCard, Field, TextAreaField, CheckboxField, SaveButton, DeleteButton, ImageField } from "@/components/admin/ui";
import {
  updateSettingsAction,
  addSocialLinkAction,
  toggleSocialLinkAction,
  deleteSocialLinkAction,
} from "./actions";

export const metadata: Metadata = { title: "Configuración general" };

export default async function ConfiguracionPage() {
  const [settings, social] = await Promise.all([getSiteSettings(), getSocialLinks(false)]);

  return (
    <div className="max-w-3xl space-y-8">
      <AdminHeading
        title="Configuración general"
        subtitle="Portada, agenda, contacto y pie de página. Esto se refleja en todas las páginas del sitio."
      />

      <form action={updateSettingsAction}>
        <AdminCard className="space-y-6">
          <div>
            <p className="font-semibold text-ink-900 mb-3">Marca</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Nombre del sitio" name="siteName" defaultValue={settings.siteName} required />
              <Field label="Texto del logo (header)" name="logoText" defaultValue={settings.logoText} required />
            </div>
          </div>

          <div>
            <p className="font-semibold text-ink-900 mb-3">Portada (Hero)</p>
            <div className="space-y-4">
              <TextAreaField label="Título principal" name="heroTitle" defaultValue={settings.heroTitle} rows={2} required />
              <TextAreaField label="Subtítulo" name="heroSubtitle" defaultValue={settings.heroSubtitle} rows={2} required />
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Texto botón principal" name="heroCtaPrimaryText" defaultValue={settings.heroCtaPrimaryText} required />
                <Field label="Texto botón secundario" name="heroCtaSecondaryText" defaultValue={settings.heroCtaSecondaryText} required />
              </div>
              <ImageField label="Foto/ilustración de portada" name="heroImage" currentUrl={settings.heroImageUrl} />
            </div>
          </div>

          <div>
            <p className="font-semibold text-ink-900 mb-3">Agenda y reserva</p>
            <div className="space-y-4">
              <label className="block">
                <span className="block text-sm font-medium text-ink-700 mb-1">
                  Botón &quot;Agendar consulta&quot; lleva a
                </span>
                <select
                  name="bookingMode"
                  defaultValue={settings.bookingMode}
                  className="w-full rounded-lg border border-purple-200 px-3.5 py-2.5 text-sm"
                >
                  <option value="whatsapp">WhatsApp</option>
                  <option value="form">Formulario de contacto</option>
                </select>
              </label>
              <Field label="Número de WhatsApp (con código de país, solo dígitos)" name="whatsappNumber" defaultValue={settings.whatsappNumber} placeholder="Ej: 573001234567" />
              <TextAreaField label="Mensaje precargado de WhatsApp" name="whatsappMessageTemplate" defaultValue={settings.whatsappMessageTemplate} rows={2} required />
              <TextAreaField label="Días y horarios de atención" name="scheduleText" defaultValue={settings.scheduleText} rows={2} required />
              <TextAreaField label="Política de cancelación" name="cancellationPolicy" defaultValue={settings.cancellationPolicy} rows={2} required />
            </div>
          </div>

          <div>
            <p className="font-semibold text-ink-900 mb-3">Contacto</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Teléfono" name="phone" defaultValue={settings.phone} />
              <Field label="Email de contacto" name="contactEmail" type="email" defaultValue={settings.contactEmail} />
            </div>
            <div className="mt-3">
              <CheckboxField label="Mostrar el teléfono públicamente en el sitio" name="phoneVisible" defaultChecked={settings.phoneVisible} />
            </div>
          </div>

          <div>
            <p className="font-semibold text-ink-900 mb-3">Pie de página</p>
            <TextAreaField label="Texto legal / confidencialidad" name="footerLegalText" defaultValue={settings.footerLegalText} rows={3} required />
          </div>

          <SaveButton>Guardar configuración</SaveButton>
        </AdminCard>
      </form>

      <AdminCard>
        <p className="font-semibold text-ink-900 mb-3">Redes sociales</p>
        <div className="space-y-2 mb-4">
          {social.map((s) => (
            <div key={s.id} className="flex items-center gap-3 text-sm bg-purple-50 rounded-lg px-3 py-2">
              <span className="font-medium text-ink-900 w-24 shrink-0 capitalize">{s.platform}</span>
              <span className="text-ink-500 truncate flex-1">{s.url}</span>
              <form action={toggleSocialLinkAction}>
                <input type="hidden" name="id" value={s.id} />
                <input type="hidden" name="visible" value={String(s.visible)} />
                <button className="text-xs text-purple-600 underline shrink-0" type="submit">
                  {s.visible ? "Ocultar" : "Mostrar"}
                </button>
              </form>
              <form action={deleteSocialLinkAction}>
                <input type="hidden" name="id" value={s.id} />
                <DeleteButton>Eliminar</DeleteButton>
              </form>
            </div>
          ))}
          {social.length === 0 && <p className="text-sm text-ink-500">Aún no agregaste redes sociales.</p>}
        </div>
        <form action={addSocialLinkAction} className="flex flex-col sm:flex-row gap-3">
          <select name="platform" className="rounded-lg border border-purple-200 px-3.5 py-2.5 text-sm">
            <option value="instagram">Instagram</option>
            <option value="facebook">Facebook</option>
            <option value="tiktok">TikTok</option>
            <option value="linkedin">LinkedIn</option>
            <option value="whatsapp">WhatsApp</option>
          </select>
          <input
            name="url"
            placeholder="https://..."
            required
            className="flex-1 rounded-lg border border-purple-200 px-3.5 py-2.5 text-sm"
          />
          <SaveButton>Agregar</SaveButton>
        </form>
      </AdminCard>
    </div>
  );
}
