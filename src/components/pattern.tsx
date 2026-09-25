/**
 * Fondo de mariposas de la marca (public/brand/patron-mariposas.png, mosaico continuo).
 *
 * Va como primer hijo de una sección `relative overflow-hidden`; el contenido debe llevar
 * `relative` para quedar por encima. `tone="white"` lo tiñe de blanco translúcido para
 * usarlo sobre fondos de color intenso (ej. la banda de CTA).
 */
export function Pattern({ className = "", tone = "lilac" }: { className?: string; tone?: "lilac" | "white" }) {
  return (
    <div
      aria-hidden="true"
      className={`pattern pointer-events-none absolute inset-0 select-none ${tone === "white" ? "pattern--white" : ""} ${className}`}
    />
  );
}
