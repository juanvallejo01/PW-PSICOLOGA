import Link from "next/link";
import Image from "next/image";
import {
  getSiteSettings,
  getAudienceGroups,
  getSpecialties,
  getProcessSteps,
  getFaqs,
  getTestimonials,
  getPublishedBlogPosts,
  buildWhatsappUrl,
} from "@/lib/content";
import { Container, SectionHeading, ButtonLink, Card } from "@/components/ui";
import { Icon, type IconName } from "@/components/icon";

const AUDIENCE_ICON: IconName[] = ["child", "teen", "adult", "couple", "family"];

export default async function HomePage() {
  const [settings, audience, specialties, steps, faqs, testimonials, posts] = await Promise.all([
    getSiteSettings(),
    getAudienceGroups(true),
    getSpecialties(true),
    getProcessSteps(),
    getFaqs(true),
    getTestimonials(true),
    getPublishedBlogPosts(),
  ]);

  const whatsappHref = buildWhatsappUrl(settings.whatsappNumber, settings.whatsappMessageTemplate);
  const primaryHref = settings.bookingMode === "whatsapp" ? whatsappHref ?? "/contacto" : "/servicios#agenda";
  const isWhatsapp = settings.bookingMode === "whatsapp";

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-lilac-100 via-purple-50 to-white">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-aqua-100 blur-3xl opacity-60" />
        <div className="absolute -bottom-32 -left-24 w-96 h-96 rounded-full bg-pink-100 blur-3xl opacity-60" />
        <Container className="relative py-20 sm:py-28 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="font-display text-3xl sm:text-5xl font-semibold text-ink-900 leading-tight">
              {settings.heroTitle}
            </h1>
            <p className="mt-6 text-lg text-ink-700 leading-relaxed max-w-xl">{settings.heroSubtitle}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <ButtonLink href={primaryHref} external={isWhatsapp} variant="primary">
                {settings.heroCtaPrimaryText}
                <Icon name="arrow-right" className="w-4 h-4" />
              </ButtonLink>
              <ButtonLink href="/como-trabajo" variant="ghost">
                {settings.heroCtaSecondaryText}
              </ButtonLink>
            </div>
          </div>
          <div className="relative aspect-square max-w-md mx-auto w-full">
            <div className="absolute inset-0 rounded-[2.5rem] bg-white shadow-xl overflow-hidden border border-purple-100">
              {settings.heroImageUrl ? (
                <Image
                  src={settings.heroImageUrl}
                  alt="Terapia online"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 90vw, 480px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 via-lilac-100 to-aqua-100">
                  <Icon name="sun" className="w-24 h-24 text-purple-300" />
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* A QUIÉN ATIENDO */}
      {audience.length > 0 && (
        <section className="py-20">
          <Container>
            <SectionHeading
              eyebrow="A quién atiendo"
              title="Un espacio para cada etapa de la vida"
              subtitle="Atención 100% online, para hispanohablantes en cualquier parte del mundo."
              center
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
              {audience.map((group, i) => (
                <Card key={group.id} className="text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                    <Icon name={AUDIENCE_ICON[i % AUDIENCE_ICON.length]} className="w-6 h-6" />
                  </div>
                  <p className="font-semibold text-ink-900">{group.name}</p>
                  {group.description && (
                    <p className="text-sm text-ink-500 mt-1">{group.description}</p>
                  )}
                </Card>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* TEMAS Y ESPECIALIDADES */}
      {specialties.length > 0 && (
        <section className="py-20 bg-purple-50/60">
          <Container>
            <SectionHeading
              eyebrow="Temas y especialidades"
              title="En qué puedo acompañarte"
              center
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {specialties.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center gap-3 rounded-xl bg-white border border-purple-100 px-4 py-3.5"
                >
                  <span className="w-2 h-2 rounded-full bg-aqua-500 shrink-0" />
                  <span className="text-ink-700 text-sm">{s.title}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-ink-500 mt-6 max-w-2xl">
              Si tu proceso requiere valoración psiquiátrica, te acompaño derivándote con un
              profesional médico para que recibas la atención más adecuada.
            </p>
          </Container>
        </section>
      )}

      {/* CÓMO TRABAJO (teaser) */}
      {steps.length > 0 && (
        <section className="py-20">
          <Container className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <SectionHeading eyebrow="Cómo trabajo" title="Cada proceso es diferente" />
              <p className="text-ink-500 leading-relaxed mb-6">
                No existen fórmulas iguales para todos. Diseño cada acompañamiento según tu
                historia, tu momento de vida y tus objetivos.
              </p>
              <ButtonLink href="/como-trabajo" variant="ghost">
                Conocer el proceso completo
                <Icon name="arrow-right" className="w-4 h-4" />
              </ButtonLink>
            </div>
            <ol className="space-y-4">
              {steps.slice(0, 5).map((step, i) => (
                <li key={step.id} className="flex gap-4 items-start">
                  <span className="w-8 h-8 shrink-0 rounded-full bg-aqua-500 text-white text-sm font-semibold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-ink-900">{step.title}</p>
                    {step.description && <p className="text-sm text-ink-500">{step.description}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </Container>
        </section>
      )}

      {/* CTA banda */}
      <section className="py-16 bg-gradient-to-r from-purple-500 to-aqua-500">
        <Container className="text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-white">
            Dar el primer paso también es parte del proceso
          </h2>
          <p className="text-purple-50 mt-3 max-w-xl mx-auto">
            Agenda tu primera sesión y empecemos a trabajar juntas en lo que necesitas hoy.
          </p>
          <div className="mt-7">
            <ButtonLink
              href={primaryHref}
              external={isWhatsapp}
              variant="ghost"
              className="!bg-white !text-purple-700 !border-transparent"
            >
              {settings.heroCtaPrimaryText}
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* TESTIMONIOS */}
      {testimonials.length > 0 && (
        <section className="py-20">
          <Container>
            <SectionHeading eyebrow="Testimonios" title="Lo que dicen quienes ya hicieron su proceso" center />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <Card key={t.id}>
                  <Icon name="quote" className="w-6 h-6 text-aqua-500 mb-3" />
                  <p className="text-ink-700 italic leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                  <p className="text-sm text-ink-500 mt-4 font-medium">— {t.authorInitials}</p>
                </Card>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* BLOG preview */}
      {posts.length > 0 && (
        <section className="py-20 bg-purple-50/60">
          <Container>
            <SectionHeading eyebrow="Blog" title="Reflexiones recientes" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.slice(0, 3).map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="block group">
                  <Card className="h-full flex flex-col">
                    {post.coverImageUrl && (
                      <div className="relative aspect-video rounded-xl overflow-hidden mb-4 -mt-2">
                        <Image src={post.coverImageUrl} alt={post.title} fill className="object-cover" sizes="360px" />
                      </div>
                    )}
                    <p className="font-semibold text-ink-900 group-hover:text-purple-600 transition-colors">
                      {post.title}
                    </p>
                    {post.excerpt && <p className="text-sm text-ink-500 mt-2 line-clamp-3">{post.excerpt}</p>}
                  </Card>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* FAQ preview */}
      {faqs.length > 0 && (
        <section className="py-20">
          <Container className="max-w-3xl">
            <SectionHeading eyebrow="Preguntas frecuentes" title="Resolvemos tus dudas" center />
            <div className="space-y-3">
              {faqs.slice(0, 5).map((faq) => (
                <details key={faq.id} className="group rounded-xl bg-white border border-purple-100 p-5">
                  <summary className="cursor-pointer font-medium text-ink-900 flex items-center justify-between gap-3">
                    {faq.question}
                    <Icon name="arrow-right" className="w-4 h-4 text-purple-400 group-open:rotate-90 transition-transform shrink-0" />
                  </summary>
                  <p className="text-ink-500 text-sm mt-3 leading-relaxed">{faq.answer}</p>
                </details>
              ))}
            </div>
            <div className="text-center mt-8">
              <ButtonLink href="/contacto" variant="ghost">
                Ver todas las preguntas
              </ButtonLink>
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
