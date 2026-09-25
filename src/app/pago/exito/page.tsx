import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSiteSettings, buildWhatsappUrl } from "@/lib/content";
import { getCheckoutSummary, isStripeConfigured } from "@/lib/stripe";
import { formatPrice } from "@/lib/prices";
import { Container, ButtonLink } from "@/components/ui";
import { Icon } from "@/components/icon";
import { Pattern } from "@/components/pattern";

export const metadata: Metadata = { title: "Pago recibido", robots: { index: false, follow: false } };

export default async function PagoExitoPage(props: PageProps<"/pago/exito">) {
  const { session_id } = await props.searchParams;
  if (typeof session_id !== "string" || !isStripeConfigured()) redirect("/servicios");

  const [summary, settings] = await Promise.all([getCheckoutSummary(session_id), getSiteSettings()]);
  if (!summary) redirect("/servicios?pago=error");

  const price = formatPrice(summary.amount, summary.currency ?? "USD");
  const whatsappHref = buildWhatsappUrl(
    settings.whatsappNumber,
    `Hola, ya realicé el pago${summary.serviceName ? ` de "${summary.serviceName}"` : ""}. Quiero agendar mi sesión.`,
  );

  return (
    <div className="relative overflow-hidden">
      <Pattern />
      <Container className="relative py-20 sm:py-28 max-w-xl text-center">
        {summary.paid ? (
          <>
            <span className="mx-auto w-16 h-16 rounded-full bg-aqua-100 text-aqua-600 flex items-center justify-center">
              <Icon name="check" className="w-8 h-8" />
            </span>
            <h1 className="mt-6 font-display text-3xl font-semibold text-ink-900">¡Pago recibido, gracias!</h1>
            <p className="mt-3 text-ink-700 leading-relaxed">
              {summary.serviceName && <>Recibimos tu pago de <strong>{summary.serviceName}</strong>{price ? ` (${price})` : ""}. </>}
              Stripe te enviará el comprobante a tu correo. El siguiente paso es acordar el día y la hora de tu sesión.
            </p>
            <div className="mt-8 text-left">
              <p className="mb-2 text-center text-sm font-semibold text-aqua-600">Tu regalo ya está desbloqueado</p>
              <Link
                href="/diario-de-gratitud"
                className="group flex items-center gap-4 rounded-3xl border border-aqua-300 bg-gradient-to-r from-white to-aqua-100/70 p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-aqua-300/40"
              >
                <span className="w-12 h-12 shrink-0 rounded-full bg-aqua-500 text-white flex items-center justify-center">
                  <Icon name="gift" className="w-6 h-6" />
                </span>
                <span>
                  <span className="block font-display font-semibold text-ink-900">Diario de la Gratitud</span>
                  <span className="block text-sm text-ink-700">Descárgalo ahora, es tu regalo por esta sesión.</span>
                </span>
                <Icon name="arrow-right" className="ml-auto w-5 h-5 text-purple-600 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
            {whatsappHref && (
              <div className="mt-8">
                <ButtonLink href={whatsappHref} external variant="secondary" className="!bg-[#2e8577] hover:!bg-[#256d62]">
                  <Icon name="whatsapp" className="w-5 h-5" />
                  Agendar mi sesión por WhatsApp
                </ButtonLink>
              </div>
            )}
          </>
        ) : (
          <>
            <h1 className="font-display text-3xl font-semibold text-ink-900">Estamos confirmando tu pago</h1>
            <p className="mt-3 text-ink-700 leading-relaxed">
              Aún no vemos el pago confirmado. Si ya lo hiciste, espera unos minutos; si el problema sigue, escríbeme y lo resolvemos.
            </p>
            {whatsappHref && (
              <div className="mt-8">
                <ButtonLink href={whatsappHref} external variant="ghost">Escribir por WhatsApp</ButtonLink>
              </div>
            )}
          </>
        )}
        <p className="mt-8">
          <Link href="/" className="text-sm font-medium text-purple-600 underline">Volver al inicio</Link>
        </p>
      </Container>
    </div>
  );
}
