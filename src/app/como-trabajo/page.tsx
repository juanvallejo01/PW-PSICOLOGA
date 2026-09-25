import type { Metadata } from "next";
import { getProcessSteps } from "@/lib/content";
import { Container, SectionHeading, ButtonLink } from "@/components/ui";
import { AnimatedCharacter } from "@/components/animated-character";
import { Pattern } from "@/components/pattern";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Cómo trabajo: proceso de terapia psicológica online",
  description:
    "Así es el proceso de terapia online: valoración inicial, evaluación, definición de objetivos, técnicas y acompañamiento continuo, a tu ritmo y en español.",
  alternates: { canonical: "/como-trabajo" },
  openGraph: { url: "/como-trabajo", title: "Cómo trabajo: proceso de terapia psicológica online" },
};

export default async function ComoTrabajoPage() {
  const steps = await getProcessSteps();

  return (
    <div className="relative overflow-hidden">
      <Pattern />
        <Container className="relative py-16 sm:py-24 max-w-3xl">
          <SectionHeading
            eyebrow="Cómo trabajo"
            title="Cada proceso es diferente"
            subtitle="El acompañamiento se adapta a tu historia, tu ritmo y tus objetivos."
          />
          <AnimatedCharacter
            character="think"
            position={{ top: "5.5rem", right: "0", width: 120 }}
            entranceAnimation="from-right"
            scrollAnimation="tilt"
            interaction={["hover", "cursor-tilt"]}
            visibleFrom="md"
          />

          <ol className="relative space-y-4">
            <span aria-hidden className="absolute left-[1.6rem] top-8 bottom-8 w-px bg-gradient-to-b from-aqua-300 via-purple-200 to-transparent" />
            {steps.map((step, i) => (
              <Reveal key={step.id} delay={(i % 3) * 80}>
                <li className="relative flex gap-5 items-start rounded-2xl bg-white border border-purple-100 p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-purple-100">
                  <span className="w-12 h-12 shrink-0 rounded-full bg-gradient-to-br from-aqua-400 to-aqua-600 text-white text-lg font-semibold flex items-center justify-center shadow-sm shadow-aqua-300/50">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-display text-lg font-semibold text-ink-900">{step.title}</p>
                    {step.description && <p className="text-ink-500 mt-1 leading-relaxed">{step.description}</p>}
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>

          <div className="relative mt-14 overflow-hidden rounded-2xl bg-aqua-100 p-8 text-center md:pr-40">
            <AnimatedCharacter
              character="wave"
              position={{ right: "2rem", bottom: "0", width: 118 }}
              entranceAnimation="rise"
              scrollAnimation="hop"
              interaction={["hover", "cursor-tilt"]}
              visibleFrom="md"
            />
            <p className="relative font-display text-xl text-aqua-600 font-semibold">
              &ldquo;Cada proceso es diferente.&rdquo;
            </p>
            <div className="relative mt-6">
              <ButtonLink href="/servicios">Conocer servicios y modalidades</ButtonLink>
            </div>
          </div>
        </Container>
    </div>
  );
}
