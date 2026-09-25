"use client";

import { useFormStatus } from "react-dom";

/**
 * Enlace de pago discreto (no un botón llamativo): el pago en línea es una opción guiada,
 * no una obligación. Se bloquea mientras se crea la sesión de Stripe.
 */
export function PayButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-label={label}
      className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-white hover:bg-purple-50 hover:border-purple-300 disabled:opacity-60 disabled:cursor-wait text-purple-700 px-4 py-2 text-sm font-medium transition-colors min-h-10"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
        <path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.5 1.5" />
        <path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.5-1.5" />
      </svg>
      {pending ? "Abriendo…" : "Link de pago"}
    </button>
  );
}
