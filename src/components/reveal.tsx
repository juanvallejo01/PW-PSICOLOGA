"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/**
 * Hace aparecer su contenido (fundido + subida suave) la primera vez que entra en pantalla.
 * Sin listeners de scroll: un IntersectionObserver por elemento, que se desconecta al disparar.
 * El estilo vive en globals.css (`.reveal`); sin JS un <noscript> en el layout lo deja visible.
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  /** Retraso en ms (útil para escalonar tarjetas de una misma fila). */
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.dataset.in = "true";
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.dataset.in = "true";
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${className}`} style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}>
      {children}
    </div>
  );
}
