"use client";

import { useState } from "react";
import Image from "next/image";
import { POSES, POSE_ALT, type PoseId } from "@/lib/characters";

interface Emotion {
  pose: PoseId;
  label: string;
  /** Una sola frase, cálida y corta. */
  message: string;
}

const EMOTIONS: Emotion[] = [
  { pose: "sad", label: "Tristeza", message: "Está bien no estar bien. Ponerle palabras a lo que sientes ya alivia." },
  { pose: "scared", label: "Ansiedad", message: "Cuando la mente no para, se puede aprender a calmarla. No tienes que hacerlo sin apoyo." },
  { pose: "angry", label: "Enojo", message: "Detrás del enojo casi siempre hay algo que necesita ser escuchado." },
  { pose: "sit", label: "Cansancio", message: "Descansar y pedir apoyo también es avanzar. Vamos a tu ritmo." },
  { pose: "think", label: "Confusión", message: "Si no sabes bien qué sientes, ordenarlo juntos es un buen primer paso." },
  { pose: "wave", label: "Estoy bien", message: "¡Qué bueno! La terapia también sirve para conocerte más y seguir creciendo." },
];

/**
 * «¿Cómo te sientes hoy?»: el visitante elige una emoción y el personaje la representa con su
 * pose y una frase corta. Sustituye párrafos de texto por una interacción intuitiva.
 */
export function EmotionPicker({ ctaHref, ctaExternal }: { ctaHref: string; ctaExternal: boolean }) {
  const [current, setCurrent] = useState<PoseId>("think");
  const emotion = EMOTIONS.find((e) => e.pose === current) ?? EMOTIONS[0];
  const pose = POSES[current];

  return (
    <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] gap-10 lg:gap-16 items-center">
      {/* Escenario: la pose cambia con un pequeño rebote */}
      <div className="relative mx-auto w-full max-w-[22rem] aspect-square">
        <div className="absolute inset-[6%] rounded-full bg-gradient-to-br from-purple-100 via-lilac-100 to-aqua-100" />
        <div className="absolute inset-0 flex items-end justify-center pb-[8%]">
          <div key={current} className="emotion-pop h-[86%] flex items-end justify-center">
            <Image
              src={pose.src}
              width={pose.width}
              height={pose.height}
              alt={POSE_ALT[current]}
              unoptimized
              draggable={false}
              className="h-full w-auto max-w-full object-contain drop-shadow-[0_14px_18px_rgb(80_54_135/0.22)]"
            />
          </div>
        </div>
      </div>

      <div className="text-center lg:text-left">
        <p className="inline-block text-xs font-semibold tracking-wide uppercase text-aqua-600 bg-aqua-100 rounded-full px-3 py-1">
          Tú eliges
        </p>
        <h2 className="mt-3 text-3xl sm:text-4xl font-semibold text-ink-900">¿Cómo te sientes hoy?</h2>

        <div role="group" aria-label="Elige cómo te sientes" className="mt-7 flex flex-wrap justify-center lg:justify-start gap-2.5">
          {EMOTIONS.map((e) => {
            const active = e.pose === current;
            return (
              <button
                key={e.pose}
                type="button"
                aria-pressed={active}
                onClick={() => setCurrent(e.pose)}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold border transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400 ${
                  active
                    ? "bg-purple-500 border-purple-500 text-white shadow-md shadow-purple-300/50 scale-105"
                    : "bg-white border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300"
                }`}
              >
                {e.label}
              </button>
            );
          })}
        </div>

        <div aria-live="polite" className="mt-7 min-h-[7.5rem] sm:min-h-[6rem]">
          <p key={current} className="emotion-text font-display text-xl sm:text-2xl text-purple-700 leading-snug max-w-lg mx-auto lg:mx-0">
            {emotion.message}
          </p>
        </div>

        <div className="mt-5">
          <a
            href={ctaHref}
            target={ctaExternal ? "_blank" : undefined}
            rel={ctaExternal ? "noopener noreferrer" : undefined}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-purple-500 hover:bg-purple-600 text-white px-7 py-3.5 text-sm font-semibold shadow-md shadow-purple-300/40 hover:shadow-lg hover:shadow-purple-400/40 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
          >
            Hablemos de esto
          </a>
        </div>
      </div>
    </div>
  );
}
