import Image from "next/image";
import { Icon } from "@/components/icon";

/**
 * Portada del Diario de la Gratitud con lazo de "Regalo". Bloqueado: portada suavizada con candado
 * encima. Desbloqueado: portada nítida. La portada es pública; el contenido del PDF no lo es.
 */
export function GiftCover({ locked, className = "" }: { locked: boolean; className?: string }) {
  return (
    <div className={`relative mx-auto w-full ${className}`}>
      <div className="absolute -inset-3 -rotate-3 rounded-[2rem] bg-gradient-to-br from-purple-200 via-lilac-100 to-aqua-100" />
      <div className="relative aspect-[989/1400] overflow-hidden rounded-3xl border-4 border-white shadow-xl shadow-purple-200/60 bg-purple-100">
        <Image
          src="/brand/diario-gratitud-portada.jpg"
          alt="Portada del Diario de la Gratitud de Bertha Upegui: un cuaderno lila con una taza y flores"
          fill
          sizes="(min-width: 1024px) 26rem, 80vw"
          className={`object-cover ${locked ? "scale-105 blur-[2px] saturate-75" : ""}`}
        />
        {locked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-purple-900/30 px-6 text-center">
            <span className="w-16 h-16 rounded-full bg-white/95 text-purple-600 shadow-lg flex items-center justify-center">
              <Icon name="lock" className="w-8 h-8" />
            </span>
            <span className="rounded-full bg-white/95 px-4 py-1.5 text-xs font-semibold text-purple-700 shadow">
              Se desbloquea con tu sesión pagada
            </span>
          </div>
        )}
      </div>
      <span className="absolute -top-3 -right-3 sm:-right-4 inline-flex items-center gap-1.5 rounded-full bg-aqua-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-aqua-300/50 rotate-6">
        <Icon name="gift" className="w-4 h-4" />
        {locked ? "Tu regalo" : "¡Desbloqueado!"}
      </span>
    </div>
  );
}
