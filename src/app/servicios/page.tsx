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
import { AnimatedCharacter } from "@/components/animated-character";
import { Pattern } from "@/components/pattern";
import { formatPrice, type Currency } from "@/lib/prices";
import { PayButton } from "@/components/pay-button";
import { PaymentNotice } from "@/components/payment-notice";
import { startCheckoutAction } from "./checkout-actions";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Servicios de terapia psicológica online",
  description:
    "Valoración inicial, sesiones de terapia individual, taller de inteligencia emocional y programa de 8 sesiones. Terapia online en español con la psicóloga Bertha Upegui.",
  alternates: { canonical: "/servicios" },
  openGraph: { url: "/servicios", title: "Servicios de terapia psicológica online" },
};

/**
 * La descripción admite varias líneas: las que empiezan con "•" se muestran como lista, las que
 * empiezan con "#" como etiqueta destacada (nombre del programa) y las que son una pregunta
 * completa ("¿…?") como subtítulo. Así el programa largo se edita desde el admin.
 */
function ServiceDescription({ text }: { text: string }) {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const blocks: ({ type: "p" | "h" | "tag"; text: string } | { type: "ul"; items: string[] })[] = [];
  for (const line of lines) {
    if (line.startsWith("•")) {
      const item = line.replace(/^•\s*/, "");
      const last = blocks[blocks.length - 1];
      if (last?.type === "ul") last.items.push(item);
      else blocks.push({ type: "ul", items: [item] });
    } else if (line.startsWith("#")) {
      blocks.push({ type: "tag", text: line.replace(/^#\s*/, "") });
    } else {
      blocks.push({ type: line.startsWith("¿") && line.endsWith("?") ? "h" : "p", text: line });
    }
  }
  return (
    <div className="mt-2 space-y-3 text-sm leading-relaxed text-ink-500">
      {blocks.map((b, i) =>
        b.type === "ul" ? (
          <ul key={i} className="space-y-1.5">
            {b.items.map((item) => (
              <li key={item} className="flex gap-2.5">
                <span className="mt-2 w-1.5 h-1.5 shrink-0 rounded-full bg-aqua-500" />
                {item}
              </li>
            ))}
          </ul>
        ) : b.type === "tag" ? (
          <p key={i}>
            <span className="inline-block rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">{b.text}</span>
          </p>
        ) : b.type === "h" ? (
          <p key={i} className="pt-1 font-semibold text-ink-900">{b.text}</p>
        ) : (
          <p key={i}>{b.text}</p>
        ),
      )}
    </div>
  );
}

function ServicePrice({ serviceId, usd, cop }: { serviceId: string; usd: string | null; cop: string | null }) {
  const options = [
    { currency: "USD", value: usd },
    { currency: "COP", value: cop },
  ].filter((o): o is { currency: Currency; value: string } => Boolean(o.value));

  if (options.length === 0) return <p className="mt-4 text-sm font-semibold text-purple-600">Consultar valores</p>;
  return (
    <ul className="mt-5 max-w-sm space-y-2">
      {options.map(({ currency, value }) => {
        const label = formatPrice(value, currency)!;
        return (
          <li key={currency} className="flex items-center justify-between gap-3 rounded-xl bg-purple-50 px-4 py-2.5">
            <span className="font-display font-semibold text-purple-700">{label}</span>
            <form action={startCheckoutAction}>
              <input type="hidden" name="serviceId" value={serviceId} />
              <input type="hidden" name="currency" value={currency} />
              <PayButton label={`Abrir link de pago de ${label}`} />
            </form>
          </li>
        );
      })}
    </ul>
  );
}

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
    <div className="relative overflow-hidden">
      <Pattern />
        <Container className="relative py-16 sm:py-24">
          <SectionHeading
            eyebrow="Servicios y modalidades"
            title="Formas de acompañarte"
            subtitle="Según lo que necesites en este momento."
          />
          <AnimatedCharacter
            character="think"
            position={{ top: "5rem", right: "0", width: 120 }}
            entranceAnimation="from-right"
            scrollAnimation="tilt"
            interaction={["hover", "cursor-tilt"]}
            visibleFrom="md"
          />

          <PaymentNotice whatsappHref={whatsappHref} />

          <p className="mb-6 -mt-4 max-w-2xl text-sm leading-relaxed text-ink-500">
            El pago en línea es opcional: puedes usar el <strong className="font-semibold text-ink-700">link de pago</strong> de cada
            servicio cuando estés listo/a, o{" "}
            <a href="#agenda" className="font-medium text-purple-700 underline">agendar primero</a> y coordinar el pago conmigo.
          </p>

          <div className="grid sm:grid-cols-2 gap-6">
            {services.map((s, i) => (
              <Reveal key={s.id} delay={(i % 2) * 90} className={`h-full ${s.description.includes("•") ? "sm:col-span-2" : ""}`}>
              <Card className="h-full">
                <p className="font-display text-lg font-semibold text-ink-900">{s.name}</p>
                {s.description && <ServiceDescription text={s.description} />}
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
                <ServicePrice serviceId={s.id} usd={s.priceUsd} cop={s.priceCop} />
              </Card>
              </Reveal>
            ))}
          </div>

          {/* AGENDA */}
          <section id="agenda" className="mt-20 scroll-mt-24">
            <SectionHeading
              eyebrow="Agenda tu cita"
              title="¿Cómo reservar tu primera sesión?"
              subtitle="Empieza con una valoración de 30 minutos o directamente con una sesión de 1 hora."
            />
            <ol className="grid sm:grid-cols-3 gap-4 mb-10">
              {[
                ["Escríbeme", "Cuéntame por WhatsApp qué necesitas; el mensaje ya va escrito."],
                ["Acordamos día y hora", "Te propongo horarios según tu zona horaria y tu disponibilidad."],
                ["Confirmas con el pago", "Con el link de pago (tarjeta) o coordinando otra forma conmigo, sin presión."],
              ].map(([title, text], i) => (
                <li key={title} className="flex gap-3 rounded-2xl bg-white border border-purple-100 p-4">
                  <span className="w-7 h-7 shrink-0 rounded-full bg-purple-100 text-purple-600 text-sm font-semibold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span>
                    <span className="block font-semibold text-ink-900 text-sm">{title}</span>
                    <span className="block text-ink-500 text-sm mt-1 leading-relaxed">{text}</span>
                  </span>
                </li>
              ))}
            </ol>
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
    </div>
  );
}
