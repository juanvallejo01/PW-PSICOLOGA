import type { Metadata } from "next";
import { getSiteSettings, getSocialLinks, getFaqs, buildWhatsappUrl } from "@/lib/content";
import { Container, SectionHeading, Card } from "@/components/ui";
import { Icon, type IconName } from "@/components/icon";
import { AnimatedCharacter } from "@/components/animated-character";
import { Flower } from "@/components/flower";
import { submitContactForm } from "./actions";

export const metadata: Metadata = { title: "Contacto" };

const SOCIAL_ICON: Record<string, IconName> = {
  instagram: "instagram",
  facebook: "facebook",
  tiktok: "tiktok",
  linkedin: "linkedin",
  whatsapp: "whatsapp",
};

export default async function ContactoPage(props: PageProps<"/contacto">) {
  const searchParams = await props.searchParams;
  const [settings, social, faqs] = await Promise.all([
    getSiteSettings(),
    getSocialLinks(true),
    getFaqs(true),
  ]);

  const whatsappHref = buildWhatsappUrl(settings.whatsappNumber, settings.whatsappMessageTemplate);
  const submitted = searchParams.enviado === "1";
  const hasError = searchParams.error === "1";

  return (
    <div className="relative overflow-hidden">
      <Flower className="-right-40 -top-32 w-[30rem] text-purple-100" heart="var(--color-lilac-100)" />
      <Flower className="-left-32 -bottom-40 w-[24rem] text-aqua-100" variant="round" heart="var(--color-pink-100)" />
        <Container className="relative py-16 sm:py-24">
          <div className="grid lg:grid-cols-2 gap-14">
            <div>
              <SectionHeading
                eyebrow="Contacto"
                title="Hablemos"
                subtitle="Atención 100% online. Escríbeme y te respondo pronto."
              />

              <div className="space-y-3 mb-8">
                {settings.phoneVisible && settings.phone && (
                  <p className="flex items-center gap-3 text-ink-700">
                    <Icon name="phone" className="w-5 h-5 text-purple-500" /> {settings.phone}
                  </p>
                )}
                {settings.contactEmail && (
                  <p className="flex items-center gap-3 text-ink-700">
                    <Icon name="mail" className="w-5 h-5 text-purple-500" /> {settings.contactEmail}
                  </p>
                )}
                {whatsappHref && (
                  <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-ink-700 hover:text-aqua-600">
                    <Icon name="whatsapp" className="w-5 h-5 text-aqua-500" /> Escribir por WhatsApp
                  </a>
                )}
              </div>

              {social.length > 0 && (
                <div className="flex gap-3 mb-10">
                  {social.map((s) => (
                    <a
                      key={s.id}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center hover:bg-purple-200 transition-colors"
                      aria-label={s.platform}
                    >
                      <Icon name={SOCIAL_ICON[s.platform] ?? "heart"} className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              )}

              <div className="relative">
                <AnimatedCharacter
                  character="wave"
                  position={{ right: "1.5rem", bottom: "calc(100% - 6px)", width: 118 }}
                  entranceAnimation="rise"
                  scrollAnimation="hop"
                  interaction={["hover", "cursor-tilt"]}
                  delay={200}
                  visibleFrom="md"
                />
                <Card>
                  {submitted ? (
                    <p className="text-aqua-600 font-medium flex items-center gap-2">
                      <Icon name="check" className="w-5 h-5" /> ¡Gracias! Tu mensaje fue enviado, te voy a responder pronto.
                    </p>
                  ) : (
                    <form action={submitContactForm} className="space-y-4">
                      {hasError && (
                        <p className="text-sm text-pink-500">Revisá los datos ingresados e intentá de nuevo.</p>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-ink-700 mb-1" htmlFor="name">
                          Nombre
                        </label>
                        <input
                          id="name"
                          name="name"
                          required
                          className="w-full rounded-lg border border-purple-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-ink-700 mb-1" htmlFor="email">
                          Email
                        </label>
                        <input
                          id="email"
                          type="email"
                          name="email"
                          required
                          className="w-full rounded-lg border border-purple-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-ink-700 mb-1" htmlFor="message">
                          Mensaje
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          required
                          rows={4}
                          className="w-full rounded-lg border border-purple-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full rounded-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 text-sm transition-colors"
                      >
                        Enviar mensaje
                      </button>
                    </form>
                  )}
                </Card>
              </div>
            </div>

            <div>
              <SectionHeading eyebrow="Preguntas frecuentes" title="Todo lo que necesitás saber" />
              <div className="space-y-3">
                {faqs.map((faq) => (
                  <details key={faq.id} className="group rounded-xl bg-white border border-purple-100 p-5">
                    <summary className="cursor-pointer font-medium text-ink-900 flex items-center justify-between gap-3">
                      {faq.question}
                      <Icon name="arrow-right" className="w-4 h-4 text-purple-400 group-open:rotate-90 transition-transform shrink-0" />
                    </summary>
                    <p className="text-ink-500 text-sm mt-3 leading-relaxed">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </Container>
    </div>
  );
}
