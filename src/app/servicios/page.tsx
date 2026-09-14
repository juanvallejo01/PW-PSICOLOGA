import type { Metadata } from "next";
import {
  getServices,
  getSiteSettings,
  getPaymentInfo,
  getPaymentMethods,
  buildWhatsappUrl,
} from "@/lib/content";
import { Container, SectionHeading, ButtonLink, Card } from "@/components/ui";
import { Icon } from "@/components/icon";

export const metadata: Metadata = { title: "Servicios" };

export default async function ServiciosPage() {
  const [services, settings, paymentInfo, paymentMethods] = await Promise.all([
    getServices(true),
    getSiteSettings(),
    getPaymentInfo(),
    getPaymentMethods(true),
  ]);

  const whatsappHref = buildWhatsappUrl(settings.whatsappNumber, settings.whatsappMessageTemplate);
  const isWhatsapp = settings.bookingMode === "whatsapp";
  const bookingHref = isWhatsapp ? whatsappHref ?? "/contacto" : "/contacto";

  return (
    <Container className="py-16 sm:py-24">
      <SectionHeading
        eyebrow="Servicios y modalidades"
        title="Formas de acompañarte"
        subtitle="Valoración inicial, sesiones de seguimiento y espacios grupales, según lo que necesites en este momento."
      />

      <div className="grid sm:grid-cols-2 gap-6">
        {services.map((s) => (
          <Card key={s.id}>
            <p className="font-display text-lg font-semibold text-ink-900">{s.name}</p>
            {s.description && <p className="text-ink-500 text-sm mt-2 leading-relaxed">{s.description}</p>}
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              {s.duration && (
                <span className="rounded-full bg-purple-100 text-purple-700 px-3 py-1 font-medium">
                  {s.duration}
                </span>
              )}
              {s.frequency && (
                <span className="rounded-full bg-aqua-100 text-aqua-600 px-3 py-1 font-medium">
                  {s.frequency}
                </span>
              )}
            </div>
            <p className="mt-4 text-sm font-semibold text-purple-600">
              {s.price ? s.price : "Consultar valores"}
            </p>
          </Card>
        ))}
      </div>

      {/* AGENDA */}
      <section id="agenda" className="mt-20 scroll-mt-24">
        <SectionHeading
          eyebrow="Agenda tu cita"
          title="¿Cómo reservar tu primera sesión?"
          subtitle="Podés empezar con una valoración inicial de 30 minutos, o directamente con una sesión de atención de 1 hora."
        />
        <div className="grid sm:grid-cols-2 gap-6 mb-10">
          <Card>
            <p className="font-semibold text-ink-900">Horarios</p>
            <p className="text-ink-500 text-sm mt-2">{settings.scheduleText}</p>
          </Card>
          <Card>
            <p className="font-semibold text-ink-900">Política de cancelación</p>
            <p className="text-ink-500 text-sm mt-2">{settings.cancellationPolicy}</p>
          </Card>
        </div>
        <ButtonLink href={bookingHref} external={isWhatsapp} variant="primary">
          <Icon name={isWhatsapp ? "whatsapp" : "mail"} className="w-4 h-4" />
          Reservar mi primera sesión
        </ButtonLink>
      </section>

      {/* PAGOS */}
      <section className="mt-20">
        <SectionHeading eyebrow="Métodos de pago" title="Formas de pago" />
        {paymentMethods.length > 0 ? (
          <div className="flex flex-wrap gap-3 mb-6">
            {paymentMethods.map((m) => (
              <span key={m.id} className="rounded-full bg-purple-100 text-purple-700 px-4 py-2 text-sm font-medium">
                {m.name}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-ink-500 text-sm mb-6">
            Los métodos de pago aceptados se confirman por contacto directo.
          </p>
        )}
        <div className="grid sm:grid-cols-3 gap-4 text-sm">
          <Card>
            <p className="text-ink-500">Momento del pago</p>
            <p className="font-medium text-ink-900 mt-1">{paymentInfo.whenToPay}</p>
          </Card>
          <Card>
            <p className="text-ink-500">Factura / recibo</p>
            <p className="font-medium text-ink-900 mt-1">{paymentInfo.issuesInvoice ? "Sí" : "Consultar"}</p>
          </Card>
          <Card>
            <p className="text-ink-500">Obra social / seguro</p>
            <p className="font-medium text-ink-900 mt-1">{paymentInfo.acceptsInsurance ? "Sí" : "Consultar"}</p>
          </Card>
        </div>
        {paymentInfo.notes && <p className="text-ink-500 text-sm mt-6">{paymentInfo.notes}</p>}
      </section>
    </Container>
  );
}
