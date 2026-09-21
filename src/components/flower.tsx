/**
 * Flor decorativa de fondo, muy simple y de bajo contraste. Pensada para ir en
 * `absolute` dentro de una sección `relative overflow-hidden`, asomando por una esquina.
 *
 * El color sale de `currentColor` (usa una clase `text-*` clara) y el corazón de la flor
 * de `--flower-heart`. La opacidad va en el <svg> completo, así los pétalos que se
 * solapan no se oscurecen.
 */
type FlowerProps = {
  /** Clases de posición, tamaño y color (ej. "-right-24 -top-24 w-96 text-purple-100"). */
  className?: string;
  /** `daisy` = 6 pétalos alargados; `round` = 5 pétalos redondos. */
  variant?: "daisy" | "round";
  /** Giro muy lento (desactivado con movimiento reducido). */
  spin?: boolean;
  /** Color del centro. */
  heart?: string;
};

export function Flower({ className = "", variant = "daisy", spin = true, heart = "var(--color-pink-100)" }: FlowerProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      aria-hidden="true"
      focusable="false"
      className={`flower pointer-events-none absolute select-none ${spin ? "flower--spin" : ""} ${className}`}
      style={{ ["--flower-heart" as string]: heart }}
    >
      <g fill="currentColor">
        {variant === "daisy"
          ? [0, 60, 120, 180, 240, 300].map((a) => (
              <ellipse key={a} cx="100" cy="50" rx="27" ry="46" transform={`rotate(${a} 100 100)`} />
            ))
          : [0, 72, 144, 216, 288].map((a) => (
              <circle key={a} cx="100" cy="52" r="38" transform={`rotate(${a} 100 100)`} />
            ))}
      </g>
      <circle cx="100" cy="100" r="21" fill="var(--flower-heart)" />
    </svg>
  );
}
