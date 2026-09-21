"use client";

import { useState, type ReactNode } from "react";

/**
 * Muestra solo el inicio de un texto largo (con degradado) y un botón para leerlo completo.
 * El contenido completo siempre está en el DOM, así que sigue siendo indexable y accesible.
 */
export function ReadMore({
  children,
  collapsedHeight = "15rem",
  moreLabel = "Seguir leyendo",
  lessLabel = "Leer menos",
}: {
  children: ReactNode;
  collapsedHeight?: string;
  moreLabel?: string;
  lessLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div className="clamp-fade" data-collapsed={!open} style={{ ["--clamp-h" as string]: collapsedHeight }}>
        {children}
      </div>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="mt-2 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white px-5 py-2 text-sm font-semibold text-purple-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-purple-50 hover:border-purple-300"
      >
        {open ? lessLabel : moreLabel}
        <svg viewBox="0 0 24 24" className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
    </div>
  );
}
