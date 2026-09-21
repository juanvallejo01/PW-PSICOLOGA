"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Image from "next/image";
import { POSES, type PoseId } from "@/lib/characters";

export type CharacterEntrance = "rise" | "from-left" | "from-right" | "fade";
export type CharacterScroll = "none" | "nudge" | "tilt" | "hop" | "shiver";
/**
 * - `hover`       al pasar el cursor / tocar repite la reacción
 * - `cursor-tilt` inclinación muy leve siguiendo el cursor (solo escritorio)
 */
export type CharacterInteraction = "hover" | "cursor-tilt";
/** Breakpoint desde el que se muestra: por debajo, el personaje se oculta. */
export type CharacterVisibleFrom = "always" | "sm" | "md" | "lg";

export interface CharacterPosition {
  /** Offsets CSS respecto al ancestro `relative` más cercano (ej. "1rem", "calc(100% - 2px)"). */
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  /** Ancho en escritorio (px). En tablet se reduce ~18 % y en móvil ~36 %. */
  width: number;
}

const NO_POSITION: CharacterPosition = { width: 0 };

export interface AnimatedCharacterProps {
  /** Pose a mostrar (ver src/lib/characters.ts). */
  character: PoseId;
  /** Posición absoluta dentro del ancestro `relative`. Con `inline` solo se usa `width`. */
  position: CharacterPosition;
  /** `true` = ocupa su lugar en el flujo (hero, ilustraciones grandes) en vez de posicionarse en absoluto. */
  inline?: boolean;
  /** Sombra suave en el suelo bajo los pies (útil cuando el personaje se apoya en algo). */
  shadow?: boolean;
  /** Carga inmediata (personaje del hero, visible sin hacer scroll). */
  preload?: boolean;
  /** Cómo aparece al entrar en viewport. La dirección se adapta al sentido del scroll. */
  entranceAnimation?: CharacterEntrance;
  /** Micro-reacción al llegar a la sección (una vez por visita, con enfriamiento). */
  scrollAnimation?: CharacterScroll;
  /** `true` = flotación de 6 px; un número fija la amplitud en px; `false` la desactiva. */
  floating?: boolean | number;
  interaction?: CharacterInteraction[];
  /** Retraso (ms) de la entrada. */
  delay?: number;
  /** Refleja el personaje horizontalmente (útil al colocarlo en el lado contrario). */
  flip?: boolean;
  visibleFrom?: CharacterVisibleFrom;
}

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/**
 * Personaje decorativo animado. Colócalo dentro de un contenedor `relative` (idealmente con
 * `overflow-hidden`/`overflow-x-clip` para no generar scroll horizontal).
 *
 * Toda la animación es CSS (transform/opacity, definida en globals.css); aquí solo se detecta
 * con IntersectionObserver cuándo entra/sale de pantalla y en qué sentido, sin listeners de scroll.
 */
export function AnimatedCharacter({
  character,
  position = NO_POSITION,
  inline = false,
  shadow = false,
  preload = false,
  entranceAnimation = "rise",
  scrollAnimation = "hop",
  floating = true,
  interaction = [],
  delay = 0,
  flip = false,
  visibleFrom = "md",
}: AnimatedCharacterProps) {
  const pose = POSES[character];
  const rootRef = useRef<HTMLDivElement>(null);
  const reactRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const artRef = useRef<HTMLDivElement>(null);

  const hover = interaction.includes("hover");
  const cursorTilt = interaction.includes("cursor-tilt");
  const floatAmp = floating === true ? 6 : floating === false ? 0 : floating;

  useEffect(() => {
    const root = rootRef.current;
    const reactEl = reactRef.current;
    const tiltEl = tiltRef.current;
    const art = artRef.current;
    if (!root || !reactEl || !tiltEl || !art) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const timers = new Set<number>();
    const later = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => {
        timers.delete(id);
        fn();
      }, ms);
      timers.add(id);
    };

    /** Reinicia una animación CSS controlada por atributo (quita, fuerza reflow, pone). */
    const restart = (el: HTMLElement, attr: string, value: string) => {
      el.removeAttribute(attr);
      void el.offsetWidth;
      el.setAttribute(attr, value);
    };

    /** Reacción de scroll / hover. */
    const celebrate = () => {
      if (reduceMotion.matches || scrollAnimation === "none") return;
      restart(reactEl, "data-react", scrollAnimation);
    };

    // ── Entrada / salida de viewport ────────────────────────────────────────────
    let entered = false;
    let lastCelebrate = 0;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            root.dataset.visible = "false";
            continue;
          }
          root.dataset.visible = "true";
          // Sentido: si al entrar su borde inferior está en la mitad superior, viene de arriba
          // (scroll hacia arriba); en cualquier otro caso viene de abajo o ya estaba visible.
          const viewH = entry.rootBounds?.height ?? window.innerHeight;
          root.style.setProperty("--dir", entry.boundingClientRect.bottom < viewH * 0.5 ? "-1" : "1");

          const now = performance.now();
          if (!entered) {
            entered = true;
            lastCelebrate = now;
            root.dataset.state = "in";
            later(celebrate, delay + 1000); // tras asentarse la entrada
          } else if (now - lastCelebrate > 4000) {
            lastCelebrate = now;
            celebrate();
          }
        }
      },
      { threshold: 0.35, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(root);

    // ── Limpieza de atributos al terminar cada animación ───────────────────────
    const onAnimationEnd = (e: AnimationEvent) => {
      if (e.animationName.startsWith("char-react")) reactEl.removeAttribute("data-react");
    };
    root.addEventListener("animationend", onAnimationEnd);

    // ── Hover / toque: repite la reacción (con enfriamiento) ──────────────────
    let hoverCooldown = 0;
    const onEnter = () => {
      const now = performance.now();
      if (reduceMotion.matches || now < hoverCooldown) return;
      hoverCooldown = now + 3000;
      celebrate();
    };
    if (hover) art.addEventListener("pointerenter", onEnter);

    // ── Inclinación con el cursor (solo escritorio, un frame por movimiento) ──
    let raf = 0;
    let pointerX = 0;
    let pointerY = 0;
    const applyTilt = () => {
      raf = 0;
      const r = root.getBoundingClientRect();
      const nx = clamp((pointerX - (r.left + r.width / 2)) / (window.innerWidth / 2), -1, 1);
      const ny = clamp((pointerY - (r.top + r.height / 2)) / (window.innerHeight / 2), -1, 1);
      tiltEl.style.setProperty("--tx", nx.toFixed(3));
      tiltEl.style.setProperty("--ty", ny.toFixed(3));
    };
    const onMove = (e: PointerEvent) => {
      if (root.dataset.visible !== "true") return;
      pointerX = e.clientX;
      pointerY = e.clientY;
      if (!raf) raf = requestAnimationFrame(applyTilt);
    };
    const tiltEnabled = cursorTilt && finePointer.matches && !reduceMotion.matches;
    if (tiltEnabled) window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      io.disconnect();
      root.removeEventListener("animationend", onAnimationEnd);
      art.removeEventListener("pointerenter", onEnter);
      if (tiltEnabled) window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [scrollAnimation, hover, cursorTilt, delay]);

  const style = {
    "--c-w": `${position.width}px`,
    "--c-top": position.top,
    "--c-right": position.right,
    "--c-bottom": position.bottom,
    "--c-left": position.left,
    "--c-delay": `${delay}ms`,
    "--c-float": `-${floatAmp}px`,
    // Desfasa la flotación entre personajes para que no respiren al unísono.
    "--c-phase": `-${(delay * 7) % 5000}ms`,
    aspectRatio: `${pose.width} / ${pose.height}`,
  } as CSSProperties;

  return (
    <div
      ref={rootRef}
      className="char"
      aria-hidden="true"
      data-from={visibleFrom}
      data-entrance={entranceAnimation}
      data-hover={hover || undefined}
      data-inline={inline || undefined}
      data-shadow={shadow || undefined}
      style={style}
    >
      <div className="char__enter">
        <div ref={reactRef} className="char__react">
          <div className="char__float" data-float={floatAmp > 0 || undefined}>
            <div ref={tiltRef} className="char__tilt">
              <div ref={artRef} className="char__art" style={flip ? { transform: "scaleX(-1)" } : undefined}>
                <Image
                  className="char__img"
                  src={pose.src}
                  width={pose.width}
                  height={pose.height}
                  alt=""
                  unoptimized
                  preload={preload}
                  draggable={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
