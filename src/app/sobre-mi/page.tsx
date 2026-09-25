import Image from "next/image";
import type { Metadata } from "next";
import { getAboutContent, getEducationItems, getSiteSettings } from "@/lib/content";
import { Container, SectionHeading } from "@/components/ui";
import { Icon } from "@/components/icon";
import { AnimatedCharacter } from "@/components/animated-character";
import { Pattern } from "@/components/pattern";
import { ReadMore } from "@/components/read-more";

export const metadata: Metadata = {
  title: "Sobre mí, psicóloga terapeuta",
  description:
    "Conoce a Bertha Cecilia Upegui Galofre: psicóloga con más de 16 años de experiencia acompañando procesos de cambio y bienestar emocional, en línea y en español.",
  alternates: { canonical: "/sobre-mi" },
  openGraph: { url: "/sobre-mi", title: "Sobre mí, psicóloga terapeuta", type: "profile" },
};

export default async function SobreMiPage() {
  const [about, education, settings] = await Promise.all([
    getAboutContent(),
    getEducationItems(),
    getSiteSettings(),
  ]);
  const degrees = education.filter((e) => e.type === "degree");
  const courses = education.filter((e) => e.type !== "degree");

  return (
    <div className="relative overflow-hidden">
      <Pattern />
        <Container className="relative py-16 sm:py-24">
          <div className="grid lg:grid-cols-[320px_1fr] gap-12 items-start">
            <div className="lg:sticky lg:top-24 animate-fade-up">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-br from-purple-100 via-lilac-100 to-aqua-100 border border-purple-100 shadow-lg shadow-purple-200/50">
                {about.photoUrl ? (
                  <Image src={about.photoUrl} alt={settings.siteName} fill className="object-cover" sizes="320px" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Icon name="sun" className="w-16 h-16 text-purple-300" />
                  </div>
                )}
                {about.yearsExperience > 0 && (
                  <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/90 backdrop-blur px-4 py-3 shadow-md">
                    <p className="font-display text-2xl font-bold text-purple-600 leading-none">
                      {about.yearsExperience}+
                    </p>
                    <p className="text-xs text-ink-500 mt-1">años de experiencia</p>
                  </div>
                )}
              </div>
              <div className="relative h-0">
                <AnimatedCharacter
                  character="wave"
                  position={{ right: "-1rem", bottom: "-3.2rem", width: 96 }}
                  entranceAnimation="rise"
                  scrollAnimation="hop"
                  interaction={["hover", "cursor-tilt"]}
                  delay={300}
                  visibleFrom="lg"
                />
              </div>
              <p className="mt-5 font-display text-xl font-bold text-ink-900">{settings.siteName}</p>
              <p className="text-sm font-medium text-purple-600 mt-0.5">{about.title}</p>
            </div>

            <div className="animate-fade-up [animation-delay:100ms]">
              <SectionHeading eyebrow="Sobre mí" title="Mi historia y formación" />

              <ReadMore collapsedHeight="17rem" moreLabel="Leer mi historia completa" lessLabel="Leer menos">
                <div className="prose-warm" dangerouslySetInnerHTML={{ __html: about.bioHtml }} />
              </ReadMore>

              {degrees.length > 0 && (
                <div className="mt-10">
                  <h3 className="font-display text-lg font-semibold text-ink-900 mb-4">Formación</h3>
                  <ul className="space-y-3">
                    {degrees.map((d) => (
                      <li key={d.id} className="flex gap-3">
                        <span className="w-6 h-6 shrink-0 rounded-full bg-aqua-100 text-aqua-600 flex items-center justify-center mt-0.5">
                          <Icon name="check" className="w-3.5 h-3.5" />
                        </span>
                        <span className="text-ink-700 text-sm">
                          <strong className="text-ink-900">{d.title}</strong>
                          {d.institution && ` — ${d.institution}`}
                          {d.period && `, ${d.period}`}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {courses.length > 0 && (
                <details className="mt-8 group">
                  <summary className="cursor-pointer font-medium text-purple-600 flex items-center gap-2">
                    Cursos y seminarios
                    <Icon name="arrow-right" className="w-4 h-4 group-open:rotate-90 transition-transform" />
                  </summary>
                  <ul className="space-y-2 mt-4">
                    {courses.map((c) => (
                      <li key={c.id} className="text-sm text-ink-500">
                        {c.title}
                        {c.institution && ` — ${c.institution}`}
                        {c.period && ` (${c.period})`}
                      </li>
                    ))}
                  </ul>
                </details>
              )}

              <div className="mt-12 grid sm:grid-cols-[13rem_minmax(0,1fr)] gap-6 items-center">
                <div className="relative aspect-[3/4] w-full max-w-[13rem] mx-auto sm:mx-0 rounded-2xl overflow-hidden border-4 border-white shadow-lg shadow-purple-200/60">
                  <Image
                    src="/bertha.jpeg"
                    alt={`${settings.siteName}, psicóloga`}
                    fill
                    className="object-cover object-[50%_35%]"
                    sizes="208px"
                  />
                </div>
                {about.closingQuote && (
                  <div className="relative rounded-2xl bg-gradient-to-br from-purple-50 to-aqua-50 border border-purple-100 pl-7 pr-6 py-6">
                    <Icon name="quote" className="w-8 h-8 text-purple-300 absolute top-5 left-5 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-1.5 shadow-sm" />
                    <p className="font-display text-xl text-purple-700 leading-snug">{about.closingQuote}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
    </div>
  );
}
