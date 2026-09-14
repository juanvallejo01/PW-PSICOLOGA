import Image from "next/image";
import type { Metadata } from "next";
import { getAboutContent, getEducationItems } from "@/lib/content";
import { Container, SectionHeading } from "@/components/ui";
import { Icon } from "@/components/icon";

export const metadata: Metadata = { title: "Sobre mí" };

export default async function SobreMiPage() {
  const [about, education] = await Promise.all([getAboutContent(), getEducationItems()]);
  const degrees = education.filter((e) => e.type === "degree");
  const courses = education.filter((e) => e.type !== "degree");

  return (
    <Container className="py-16 sm:py-24">
      <div className="grid lg:grid-cols-[320px_1fr] gap-12 items-start">
        <div className="lg:sticky lg:top-24">
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-purple-50 border border-purple-100">
            {about.photoUrl ? (
              <Image src={about.photoUrl} alt={about.title} fill className="object-cover" sizes="320px" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Icon name="sun" className="w-16 h-16 text-purple-300" />
              </div>
            )}
          </div>
          <p className="mt-5 font-display text-lg font-semibold text-ink-900">{about.title}</p>
          <p className="text-sm text-ink-500">{about.yearsExperience} años de experiencia</p>
        </div>

        <div>
          <SectionHeading eyebrow="Sobre mí" title="Mi historia y formación" />

          <div
            className="prose-warm"
            dangerouslySetInnerHTML={{ __html: about.bioHtml }}
          />

          {degrees.length > 0 && (
            <div className="mt-10">
              <h3 className="font-display text-lg font-semibold text-ink-900 mb-4">Formación</h3>
              <ul className="space-y-3">
                {degrees.map((d) => (
                  <li key={d.id} className="flex gap-3">
                    <Icon name="check" className="w-5 h-5 text-aqua-500 shrink-0 mt-0.5" />
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

          {about.closingQuote && (
            <p className="mt-12 font-display text-xl text-purple-700 border-l-4 border-aqua-400 pl-5">
              {about.closingQuote}
            </p>
          )}
        </div>
      </div>
    </Container>
  );
}
