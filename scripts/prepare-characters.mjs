/**
 * Prepara las poses del personaje (los PNG con fondo transparente de public/characters/)
 * para la web: recorta el espacio transparente sobrante, reduce a un tamaño razonable y
 * exporta WebP con transparencia + un manifest.json con las medidas de cada pose.
 *
 * Los PNG originales NO se modifican. Uso:  node scripts/prepare-characters.mjs
 * Requiere `sharp` (ya viene instalado como dependencia opcional de Next).
 *
 * Para añadir una pose nueva: guarda el PNG en public/characters/ y agrégalo a POSES.
 */
import { createRequire } from "node:module";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "characters");

/** id de la pose → PNG original. */
const POSES = {
  wave: "Firefly-2.png", // saludando, contento
  think: "Firefly-3.png", // pensativo, mano en la barbilla
  angry: "Firefly-4.png", // enojado, brazos cruzados
  scared: "Firefly.png", // ansioso, manos en la boca
  sad: "Firefly_RemoveBackground.png", // triste, llorando
  sit: "Firefly-5.png", // sentado, abatido
};

/** Alto máximo del WebP (se muestran a ≤ 460 px, así que esto cubre pantallas 2×). */
const MAX_HEIGHT = 900;
/** Aire transparente que se deja alrededor del personaje tras recortar. */
const PAD = 6;

const manifest = {};
for (const [id, file] of Object.entries(POSES)) {
  const trimmed = await sharp(path.join(DIR, file))
    .ensureAlpha()
    // El fondo ya es transparente: se recorta todo lo que tenga alpha ≈ 0.
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 10 })
    .png()
    .toBuffer();

  const { data, info } = await sharp(trimmed)
    .extend({ top: PAD, bottom: PAD, left: PAD, right: PAD, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .resize({ height: MAX_HEIGHT, withoutEnlargement: true })
    .webp({ quality: 90, alphaQuality: 100, effort: 6 })
    .toBuffer({ resolveWithObject: true });

  await writeFile(path.join(DIR, `${id}.webp`), data);
  manifest[id] = { width: info.width, height: info.height };
  console.log(`${id.padEnd(7)} ${info.width}×${info.height}  ${(data.length / 1024).toFixed(0)} KB  ← ${file}`);
}

await writeFile(path.join(DIR, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log("manifest.json listo");
