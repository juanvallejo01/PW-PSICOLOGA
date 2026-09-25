import type { Metadata } from "next";
import { getSiteSettings, getSocialLinks, getFaqs, buildWhatsappUrl } from "@/lib/content";
import { Container, SectionHeading, Card, ButtonLink } from "@/components/ui";
import { Icon, type IconName } from "@/components/icon";
import { AnimatedCharacter } from "@/components/animated-character";
import { Pattern } from "@/components/pattern";

export const metadata: Metadata = { title: "Contacto" };

const SOCIAL_ICON: Record<string, IconName> = {
  instagram: "instagram",
  facebook: "facebook",
  tiktok: "tiktok",
  linkedin: "linkedin",
  whatsapp: "whatsapp",
};

/** "15485038505" → "+1 (548) 503-8505"; otros países quedan como "+<dígitos>". */
function formatPhone(raw: string | null) {
  const digits = raw?.replace(/\D/g, "");
  if (!digits) return null;
  const nanp = digits.match(/^1(\d{3})(\d{3})(\d{4})$/);
  return nanp ? `+1 (${nanp[1]}) ${nanp[2]}-${nanp[3]}` : `+${digits}`;
}

const BOOKING_STEPS = [
  "Toca el botón de WhatsApp",
  "Se abre el chat con tu mensaje ya escrito, solo envíalo",
  "Te respondo para acordar día y hora de tu sesión",
];

export default async function ContactoPage() {
  const [settings, social, faqs] = await Promise.all([
    getSiteSettings(),
    getSocialLinks(true),
    getFaqs(true),
  ]);

  const whatsappHref = buildWhatsappUrl(settings.whatsappNumber, settings.whatsappMessageTemplate);
  const whatsappNumber = formatPhone(settings.whatsappNumber);

  return (
    <div className="relative overflow-hidden">
      <Pattern />
        <Container className="relative py-16 sm:py-24">
          <div className="grid lg:grid-cols-2 gap-14">
            <div>
              <SectionHeading
                eyebrow="Contacto"
                title="Hablemos"
                subtitle="Atención 100% online. Agenda tu sesión en un minuto, directo por WhatsApp."
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
              </div>

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
                <Card className="!p-5 sm:!p-7">
                  <div className="flex items-center gap-3">
                    <span className="w-12 h-12 shrink-0 rounded-full bg-aqua-100 text-aqua-600 flex items-center justify-center">
                      <Icon name="whatsapp" className="w-6 h-6" />
                    </span>
                    <div>
                      <h2 className="font-display text-xl font-semibold text-ink-900 leading-tight">Agenda por WhatsApp</h2>
                      {whatsappNumber && <p className="text-sm text-ink-500">{whatsappNumber}</p>}
                    </div>
                  </div>

                  <ol className="mt-6 space-y-3">
                    {BOOKING_STEPS.map((step, i) => (
                      <li key={step} className="flex items-start gap-3 text-sm text-ink-700">
                        <span className="w-6 h-6 shrink-0 rounded-full bg-purple-100 text-purple-600 text-xs font-semibold flex items-center justify-center">
                          {i + 1}
                        </span>
                        <span className="pt-0.5">{step}</span>
                      </li>
                    ))}
                  </ol>

                  {whatsappHref ? (
                    <>
                      <div className="mt-6 rounded-2xl rounded-tl-sm bg-aqua-100/70 px-4 py-3 text-sm text-ink-700">
                        <p className="text-xs font-semibold uppercase tracking-wide text-aqua-600 mb-1">Tu mensaje</p>
                        {settings.whatsappMessageTemplate}
                      </div>
                      <ButtonLink href={whatsappHref} external variant="secondary" className="mt-6 w-full !py-3.5 !text-base !bg-[#2e8577] hover:!bg-[#256d62]">
                        <Icon name="whatsapp" className="w-5 h-5" />
                        Agendar por WhatsApp
                      </ButtonLink>
                    </>
                  ) : (
                    <p className="mt-6 text-sm text-ink-500">El agendamiento por WhatsApp estará disponible muy pronto.</p>
                  )}
                  {settings.scheduleText && <p className="mt-4 text-xs text-ink-500 text-center">{settings.scheduleText}</p>}
                </Card>
              </div>

              {social.length > 0 && (
                <div className="flex gap-3 mt-8">
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
            </div>

            <div>
              <SectionHeading eyebrow="Preguntas frecuentes" title="Todo lo que necesitás saber" />
              <div className="space-y-3">
                {faqs.map((faq) => (
                  <details key={faq.id} className="group rounded-xl bg-white border border-purple-100 p-5">
                    <summary className="cursor-pointer -m-5 p-5 font-medium text-ink-900 flex items-center justify-between gap-3">
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
