import Link from "next/link";
import Image from "next/image";
import { Icon } from "@/components/icon";

/** Aviso compacto del regalo, para la home y /servicios. Enlaza a la página del diario. */
export function GiftTeaser({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/diario-de-gratitud"
      className={`group flex items-center gap-4 sm:gap-6 rounded-3xl border border-purple-100 bg-gradient-to-r from-white via-lilac-100/60 to-aqua-100/60 p-4 sm:p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-200/50 ${className}`}
    >
      <span className="relative w-20 sm:w-24 shrink-0 aspect-[989/1400] overflow-hidden rounded-xl border-2 border-white shadow-md">
        <Image src="/brand/diario-gratitud-portada.jpg" alt="" fill sizes="96px" className="object-cover blur-[1.5px] saturate-75" />
        <span className="absolute inset-0 flex items-center justify-center bg-purple-900/25">
          <span className="w-8 h-8 rounded-full bg-white/95 text-purple-600 flex items-center justify-center">
            <Icon name="lock" className="w-4 h-4" />
          </span>
        </span>
      </span>
      <span className="min-w-0">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-aqua-500 px-3 py-1 text-xs font-semibold text-white">
          <Icon name="gift" className="w-3.5 h-3.5" /> Un regalo para ti
        </span>
        <span className="mt-2 block font-display text-lg sm:text-xl font-semibold text-ink-900 leading-snug">
          Diario de la Gratitud
        </span>
        <span className="mt-1 block text-sm text-ink-700 leading-relaxed">
          Al pagar tu sesión se desbloquea, sin costo adicional: un diario guiado para agradecer, sentir y comenzar cada día con intención.
        </span>
        <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-purple-700 group-hover:gap-2.5 transition-all">
          Conocer mi regalo <Icon name="arrow-right" className="w-4 h-4" />
        </span>
      </span>
    </Link>
  );
}
