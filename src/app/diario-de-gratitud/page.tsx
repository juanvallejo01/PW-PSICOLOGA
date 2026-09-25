import type { Metadata } from "next";
import Link from "next/link";
import { getSiteSettings, buildWhatsappUrl } from "@/lib/content";
import { hasGiftAccess } from "@/lib/gift";
import { Container, SectionHeading, ButtonLink, Card } from "@/components/ui";
import { Icon, type IconName } from "@/components/icon";
import { Pattern } from "@/components/pattern";
import { GiftCover } from "@/components/gift-cover";
import { recoverGiftAction } from "./actions";

export const metadata: Metadata = {
  title: "Diario de la Gratitud: un regalo con tu sesión",
  description:
    "Un diario guiado para agradecer, sentir y comenzar cada día con intención. Es el regalo de Bertha Upegui al pagar tu sesión de terapia online.",
  alternates: { canonical: "/diario-de-gratitud" },
  openGraph: { url: "/diario-de-gratitud", title: "Diario de la Gratitud: un regalo con tu sesión" },
};

const INCLUDES: { icon: IconName; title: string; text: string }[] = [
  { icon: "heart", title: "Cómo me siento hoy", text: "Ponle nombre a lo que sientes antes de empezar el día." },
  { icon: "sun", title: "Afirmación del día", text: "Una frase propia para arrancar con más calma y confianza." },
  { icon: "check", title: "Tres cosas por las que agradecer", text: "El corazón del diario: notar lo bueno, incluso lo pequeño." },
  { icon: "leaf", title: "Más de esto, menos de esto", text: "Aclara qué quieres cultivar y qué quieres soltar." },
  { icon: "compass", title: "Intención y propósito", text: "Tu intención a corto plazo y tres cosas que quieres lograr hoy." },
  { icon: "heart", title: "Lo que me hizo sonreír", text: "Tu momento favorito de ayer y por qué hoy vas a ser feliz." },
];

const STATUS: Record<string, { tone: "ok" | "info" | "warn"; text: string }> = {
  activado: { tone: "ok", text: "¡Listo! Tu regalo quedó desbloqueado en este dispositivo." },
  "no-pagado": { tone: "info", text: "Aún no vemos tu pago confirmado. Si ya pagaste, espera unos minutos y vuelve a intentarlo, o escríbeme por WhatsApp." },
  "no-encontrado": { tone: "warn", text: "No encontramos un pago con ese correo. Usa el mismo correo que escribiste en Stripe al pagar, o escríbeme por WhatsApp." },
  "correo-invalido": { tone: "warn", text: "Revisa el correo: no parece válido." },
  bloqueado: { tone: "info", text: "Tu regalo aún está bloqueado. Se desbloquea cuando pagas una sesión." },
};

export default async function DiarioGratitudPage(props: PageProps<"/diario-de-gratitud">) {
  const searchParams = await props.searchParams;
  const [unlocked, settings] = await Promise.all([hasGiftAccess(), getSiteSettings()]);
  const key = typeof searchParams.activado === "string" ? "activado" : typeof searchParams.estado === "string" ? searchParams.estado : null;
  const status = key ? STATUS[key] : null;
  const whatsappHref = buildWhatsappUrl(
    settings.whatsappNumber,
    unlocked ? settings.whatsappMessageTemplate : "Hola, quiero agendar mi sesión y recibir mi regalo, el Diario de la Gratitud.",
  );

  return (
    <div className="relative overflow-hidden">
      <Pattern />
      <Container className="relative py-14 sm:py-20">
        {status && (unlocked || key !== "activado") && (
          <div
            role="status"
            className={`mb-8 rounded-2xl border px-5 py-4 text-sm leading-relaxed text-ink-900 ${
              status.tone === "ok" ? "border-aqua-300 bg-aqua-100" : status.tone === "warn" ? "border-pink-300 bg-pink-100" : "border-purple-200 bg-purple-50"
            }`}
          >
            {status.text}
          </div>
        )}

        <div className="grid lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] gap-14 lg:gap-20 items-center">
          <GiftCover locked={!unlocked} className="max-w-[18rem] sm:max-w-[22rem] lg:max-w-none" />

          <div className="text-center lg:text-left">
            <p className="inline-flex items-center gap-2 rounded-full bg-aqua-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-aqua-600">
              <Icon name="gift" className="w-4 h-4" />
              {unlocked ? "Regalo desbloqueado" : "Un regalo para ti"}
            </p>
            <h1 className="mt-4 font-display text-3xl sm:text-4xl font-semibold text-ink-900 leading-tight">
              {unlocked ? "¡Tu Diario de la Gratitud está listo!" : "Diario de la Gratitud"}
            </h1>
            <p className="mt-4 text-lg text-ink-700 leading-relaxed max-w-xl mx-auto lg:mx-0">
              {unlocked
                ? "Gracias por dar este paso. Este diario es mi regalo para ti: un espacio de cinco minutos al día para agradecer, sentir y volver a lo simple."
                : "Porque la vida también se disfruta en lo simple. Es un regalo de bienvenida: cuando pagas tu sesión, se desbloquea para ti, sin ningún costo adicional."}
            </p>

            {unlocked ? (
              <>
                <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-3">
                  <ButtonLink href="/api/regalo/descargar" variant="primary">
                    <Icon name="download" className="w-4 h-4" />
                    Descargar mi diario (PDF)
                  </ButtonLink>
                  <ButtonLink href="/api/regalo/descargar?ver=1" external variant="ghost">
                    Verlo en línea
                  </ButtonLink>
                </div>
                <ul className="mt-8 space-y-3 text-left max-w-xl mx-auto lg:mx-0">
                  {[
                    "Imprímelo o llénalo desde tu tablet: un formato por cada día.",
                    "Elige un momento fijo, por ejemplo al despertar o antes de dormir.",
                    "No hay respuestas correctas: escribe lo que sea verdad para ti hoy.",
                  ].map((tip) => (
                    <li key={tip} className="flex gap-3 text-ink-700">
                      <span className="mt-0.5 w-6 h-6 shrink-0 rounded-full bg-aqua-100 text-aqua-600 flex items-center justify-center">
                        <Icon name="check" className="w-3.5 h-3.5" />
                      </span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <>
                <ol className="mt-8 space-y-3 text-left max-w-xl mx-auto lg:mx-0">
                  {[
                    ["Agenda tu sesión", "Escríbeme por WhatsApp y acordamos día y hora."],
                    ["Realiza el pago", "Con el link de pago de cualquier servicio."],
                    ["Recibe tu regalo", "Al terminar el pago vuelves aquí y el diario ya está desbloqueado."],
                  ].map(([title, text], i) => (
                    <li key={title} className="flex gap-3 rounded-2xl bg-white/85 border border-purple-100 px-4 py-3">
                      <span className="w-7 h-7 shrink-0 rounded-full bg-purple-100 text-purple-600 text-sm font-semibold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <span>
                        <span className="block font-semibold text-ink-900 text-sm">{title}</span>
                        <span className="block text-sm text-ink-500 mt-0.5">{text}</span>
                      </span>
                    </li>
                  ))}
                </ol>
                <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-3">
                  <ButtonLink href="/servicios" variant="primary">
                    Ver servicios y precios
                    <Icon name="arrow-right" className="w-4 h-4" />
                  </ButtonLink>
                  {whatsappHref && (
                    <ButtonLink href={whatsappHref} external variant="ghost">
                      <Icon name="whatsapp" className="w-4 h-4" />
                      Agendar por WhatsApp
                    </ButtonLink>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <section className="mt-20 sm:mt-24">
          <SectionHeading eyebrow="Qué incluye" title="Un espacio guiado para cada día" center />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {INCLUDES.map((item) => (
              <Card key={item.title} className="!p-5">
                <span className="w-11 h-11 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-3">
                  <Icon name={item.icon} className="w-5 h-5" />
                </span>
                <p className="font-display font-semibold text-ink-900">{item.title}</p>
                <p className="mt-1 text-sm text-ink-500 leading-relaxed">{item.text}</p>
              </Card>
            ))}
          </div>
        </section>

        {!unlocked && (
          <section id="recuperar" className="mt-16 scroll-mt-24 mx-auto max-w-xl rounded-3xl border border-purple-100 bg-white/90 p-6 sm:p-8 text-center shadow-sm">
            <span className="mx-auto w-11 h-11 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
              <Icon name="lock" className="w-5 h-5" />
            </span>
            <h2 className="mt-3 font-display text-xl font-semibold text-ink-900">¿Ya pagaste tu sesión?</h2>
            <p className="mt-2 text-sm text-ink-500 leading-relaxed">
              Si pagaste desde otro dispositivo o se cerró la página, escribe el correo que usaste en el pago y desbloqueamos tu regalo.
            </p>
            <form action={recoverGiftAction} className="mt-5 flex flex-col sm:flex-row gap-3">
              <label className="sr-only" htmlFor="email">Correo del pago</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="tu@correo.com"
                className="flex-1 rounded-full border border-purple-200 px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
              <button type="submit" className="rounded-full bg-purple-500 hover:bg-purple-600 text-white font-semibold px-6 py-3 text-sm transition-colors">
                Desbloquear
              </button>
            </form>
            <p className="mt-4 text-xs text-ink-500">
              ¿Algo no funciona? <Link href="/contacto" className="font-medium text-purple-700 underline">Escríbeme por WhatsApp</Link> y lo resolvemos.
            </p>
          </section>
        )}
      </Container>
    </div>
  );
}
