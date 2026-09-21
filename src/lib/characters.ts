import manifest from "../../public/characters/manifest.json";

/**
 * Registro de poses del personaje.
 *
 * Los assets viven en /public/characters y se generan con `node scripts/prepare-characters.mjs`
 * a partir de los PNG originales. Las medidas salen del manifest.json que genera ese script,
 * así no se desincronizan.
 *
 * Para añadir una pose: agregarla al script, regenerar, y listarla en POSE_IDS y EMOTIONS (si aplica).
 */
const POSE_IDS = ["wave", "think", "angry", "scared", "sad", "sit"] as const;

export type PoseId = (typeof POSE_IDS)[number];

export interface PoseDef {
  id: PoseId;
  width: number;
  height: number;
  src: string;
}

const entries = manifest as Record<string, { width: number; height: number }>;

export const POSES = Object.fromEntries(
  POSE_IDS.map((id) => [id, { id, width: entries[id].width, height: entries[id].height, src: `/characters/${id}.webp` }]),
) as Record<PoseId, PoseDef>;

/** Texto alternativo para las poses que se muestran como contenido (no decorativas). */
export const POSE_ALT: Record<PoseId, string> = {
  wave: "Personaje morado saludando con una sonrisa",
  think: "Personaje morado pensativo, con la mano en la barbilla",
  angry: "Personaje morado enojado, con los brazos cruzados",
  scared: "Personaje morado asustado, con las manos en la boca",
  sad: "Personaje morado triste, con lágrimas en los ojos",
  sit: "Personaje morado sentado, abatido",
};
