import type { Metadata } from "next";
import { getProcessSteps } from "@/lib/content";
import { Container, SectionHeading, ButtonLink } from "@/components/ui";

export const metadata: Metadata = { title: "Cómo trabajo" };

export default async function ComoTrabajoPage() {
  const steps = await getProcessSteps();

  return (
    <Container className="py-16 sm:py-24 max-w-3xl">
      <SectionHeading
        eyebrow="Cómo trabajo"
        title="Cada proceso es diferente"
        subtitle="No aplico fórmulas iguales para todos: el acompañamiento se adapta a tu historia, tu ritmo y tus objetivos."
      />

      <ol className="relative border-l-2 border-purple-100 pl-8 space-y-10">
        {steps.map((step, i) => (
          <li key={step.id} className="relative">
            <span className="absolute -left-[2.55rem] top-0 w-8 h-8 rounded-full bg-purple-500 text-white text-sm font-semibold flex items-center justify-center">
              {i + 1}
            </span>
            <p className="font-display text-lg font-semibold text-ink-900">{step.title}</p>
            {step.description && <p className="text-ink-500 mt-1 leading-relaxed">{step.description}</p>}
          </li>
        ))}
      </ol>

      <div className="mt-14 rounded-2xl bg-aqua-100 p-8 text-center">
        <p className="font-display text-xl text-aqua-600 font-semibold">
          &ldquo;Cada proceso es diferente.&rdquo;
        </p>
        <div className="mt-6">
          <ButtonLink href="/servicios">Conocer servicios y modalidades</ButtonLink>
        </div>
      </div>
    </Container>
  );
}
