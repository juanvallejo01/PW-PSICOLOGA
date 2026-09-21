/**
 * Extrae cada pose de las hojas de personajes (public/MID.svg y public/MIDF.svg)
 * a un WebP con transparencia real dentro de public/characters/.
 *
 * Por qué existe: los "SVG" originales son en realidad JPEG (781×1024) con un
 * tablero de ajedrez "de transparencia" horneado en los píxeles, un título impreso
 * y 5 poses por hoja. Un navegador no puede mostrarlos como SVG ni como fondo
 * transparente, así que hay que recortarlos y quitarles el fondo.
 *
 * Los originales NO se modifican. Uso:  node scripts/extract-characters.mjs
 * Requiere `sharp` (ya viene instalado como dependencia opcional de Next).
 */
import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = path.join(ROOT, "public");
const OUT = path.join(PUBLIC, "characters");

/** Croma (max-min de RGB) por debajo del cual un píxel se considera fondo gris/blanco. */
const CHROMA_BG = 12;
/** Un agujero interno con píxeles ≥ este valor es tablero visible (los ojos/dientes no llegan). */
const CHECKER_WHITE = 250;
/** Todo lo que termine por encima de esta fila es el título impreso de la hoja. */
const TITLE_MAX_Y = 102;
/** Distancia máxima (px) para adjuntar un adorno (líneas de temblor, destellos) a su pose. */
const DECOR_MAX_DIST = 70;
const PAD = 8;

/**
 * `seed`   punto dentro del cuerpo de cada pose (identifica su componente).
 * `decor`  conserva los adornos sueltos cercanos (líneas de temblor / destellos).
 * `attach` puntos sobre adornos que pertenecen a esta pose aunque otra esté más cerca.
 * `include`/`erase`  rectángulos (coords. de la hoja) para traer o quitar píxeles que
 *          el algoritmo asignó mal (p. ej. una línea de temblor pegada al pie de otra pose).
 * `arm`    (opcional) separa el brazo que saluda en su propia capa para poder animarlo:
 *          `zone` es un polígono (coords. locales del recorte de la pose) que envuelve el brazo
 *          y penetra unos px en el torso; `pivot` es el hombro. Se generan `<name>-body.webp`
 *          (torso sin brazo) y `<name>-arm.webp` (brazo), que recompuestos son idénticos al
 *          original. El cuerpo conserva un solape (`overlap`) bajo el brazo para que, al
 *          rotar, no aparezca un hueco.
 */
const SHEETS = [
  {
    file: "MID.svg",
    poses: [
      { name: "panic-hands-mouth", seed: [190, 230], decor: true },
      { name: "panic-run", seed: [560, 230], decor: true },
      { name: "panic-cover-face", seed: [190, 470], decor: true, exclude: [[270, 554], [252, 622]] },
      {
        name: "panic-scratch-head",
        seed: [590, 480],
        decor: true,
        erase: [{ x0: 470, y0: 556, x1: 546, y1: 606 }],
      },
      {
        name: "panic-front",
        seed: [385, 800],
        decor: true,
        attach: [[270, 554], [433, 513], [252, 622]],
        include: [{ x0: 470, y0: 556, x1: 546, y1: 606 }],
      },
    ],
  },
  {
    file: "MIDF.svg",
    poses: [
      {
        name: "greeting-wave",
        seed: [190, 230],
        decor: false,
        arm: {
          pivot: [160, 98],
          zone: [[152, 90], [160, 86], [159, 80], [157, 60], [153, 40], [153, 0], [213, 0], [213, 116], [159, 116], [152, 112]],
        },
      },
      { name: "greeting-heart", seed: [590, 230], decor: false },
      { name: "greeting-cheer", seed: [190, 480], decor: false },
      {
        name: "greeting-wink-wave",
        seed: [610, 470],
        decor: false,
        arm: {
          pivot: [172, 105],
          zone: [[163, 97], [169, 91], [169, 0], [241, 0], [241, 124], [170, 124], [163, 119]],
        },
      },
      { name: "greeting-open-arms", seed: [385, 800], decor: false },
    ],
  },
];

/* ───────────────────────── utilidades de máscara ───────────────────────── */

function label(mask, W, H, conn8) {
  const lab = new Int32Array(W * H);
  const comps = [];
  const stack = new Int32Array(W * H);
  let id = 0;
  for (let s = 0; s < W * H; s++) {
    if (!mask[s] || lab[s]) continue;
    id++;
    let sp = 0;
    stack[sp++] = s;
    lab[s] = id;
    let minX = W, minY = H, maxX = 0, maxY = 0, area = 0;
    while (sp) {
      const p = stack[--sp];
      const x = p % W;
      const y = (p / W) | 0;
      area++;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if ((!dx && !dy) || (!conn8 && dx && dy)) continue;
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
          const q = ny * W + nx;
          if (mask[q] && !lab[q]) {
            lab[q] = id;
            stack[sp++] = q;
          }
        }
      }
    }
    comps.push({ id, minX, minY, maxX, maxY, area });
  }
  return { lab, comps };
}

/** Erosiona `n` px (vecindad de 4). */
function erode(mask, W, H, n) {
  let cur = mask;
  for (let k = 0; k < n; k++) {
    const next = new Uint8Array(W * H);
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const i = y * W + x;
        if (!cur[i]) continue;
        if (x === 0 || y === 0 || x === W - 1 || y === H - 1) continue;
        if (cur[i - 1] && cur[i + 1] && cur[i - W] && cur[i + W]) next[i] = 1;
      }
    }
    cur = next;
  }
  return cur;
}

function bboxDistance(a, b) {
  const dx = Math.max(0, a.minX - b.maxX, b.minX - a.maxX);
  const dy = Math.max(0, a.minY - b.maxY, b.minY - a.maxY);
  return Math.hypot(dx, dy);
}

/* ───────────────────────── segmentación de una hoja ───────────────────────── */

async function segmentSheet(sheet) {
  const { data, info } = await sharp(path.join(PUBLIC, sheet.file))
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const W = info.width;
  const H = info.height;

  const chroma = new Uint8Array(W * H);
  const lum = new Uint8Array(W * H);
  for (let i = 0; i < W * H; i++) {
    const r = data[i * 3];
    const g = data[i * 3 + 1];
    const b = data[i * 3 + 2];
    chroma[i] = Math.max(r, g, b) - Math.min(r, g, b);
    lum[i] = (r * 299 + g * 587 + b * 114) / 1000;
  }

  // 1) Fondo candidato = píxeles sin color. Se agrupa en regiones conectadas.
  const bgCand = new Uint8Array(W * H);
  for (let i = 0; i < W * H; i++) bgCand[i] = chroma[i] < CHROMA_BG ? 1 : 0;
  const bg = label(bgCand, W, H, false);

  const touchesBorder = new Set();
  for (let x = 0; x < W; x++) {
    touchesBorder.add(bg.lab[x]);
    touchesBorder.add(bg.lab[(H - 1) * W + x]);
  }
  for (let y = 0; y < H; y++) {
    touchesBorder.add(bg.lab[y * W]);
    touchesBorder.add(bg.lab[y * W + W - 1]);
  }

  // 2) Una región de fondo es transparente si toca el borde de la hoja (fondo real) o si
  //    es un hueco interno con píxeles blancos puros (tablero visible entre brazo y cuerpo).
  //    Los huecos internos sin blanco puro son ojos y dientes: se conservan.
  const maxLum = new Map();
  for (let i = 0; i < W * H; i++) {
    if (!bgCand[i]) continue;
    const id = bg.lab[i];
    if (lum[i] > (maxLum.get(id) ?? 0)) maxLum.set(id, lum[i]);
  }
  const transparentRegion = new Set();
  for (const c of bg.comps) {
    if (touchesBorder.has(c.id) || (c.area > 40 && (maxLum.get(c.id) ?? 0) >= CHECKER_WHITE)) {
      transparentRegion.add(c.id);
    }
  }
  const solid = new Uint8Array(W * H);
  for (let i = 0; i < W * H; i++) {
    solid[i] = bgCand[i] && transparentRegion.has(bg.lab[i]) ? 0 : 1;
  }

  // 3) Componentes sólidos: cuerpos principales (por semilla) + adornos cercanos.
  const fg = label(solid, W, H, true);
  const bodies = sheet.poses.map((pose) => {
    const id = fg.lab[pose.seed[1] * W + pose.seed[0]];
    if (!id) throw new Error(`Semilla fuera del cuerpo: ${sheet.file} ${pose.name}`);
    return { pose, id, comp: fg.comps[id - 1], extra: [] };
  });
  const bodyIds = new Set(bodies.map((b) => b.id));

  // Adjuntos explícitos (`attach`) y exclusiones (`exclude`) mandan sobre la cercanía.
  const claimed = new Set();
  const excluded = new Map(bodies.map((b) => [b, new Set()]));
  for (const b of bodies) {
    for (const [x, y] of b.pose.attach ?? []) {
      const id = fg.lab[y * W + x];
      if (!id || bodyIds.has(id)) throw new Error(`attach fuera de un adorno: ${b.pose.name} ${x},${y}`);
      b.extra.push(fg.comps[id - 1]);
      claimed.add(id);
    }
    for (const [x, y] of b.pose.exclude ?? []) {
      const id = fg.lab[y * W + x];
      if (!id) throw new Error(`exclude fuera de un adorno: ${b.pose.name} ${x},${y}`);
      excluded.get(b).add(id);
    }
  }

  for (const c of fg.comps) {
    if (bodyIds.has(c.id) || claimed.has(c.id) || c.maxY <= TITLE_MAX_Y || c.area < 60) continue;
    let best = null;
    let bestDist = Infinity;
    for (const b of bodies) {
      if (excluded.get(b).has(c.id)) continue;
      const d = bboxDistance(c, b.comp);
      if (d < bestDist) {
        bestDist = d;
        best = b;
      }
    }
    if (best && bestDist <= DECOR_MAX_DIST) best.extra.push(c);
  }

  return { data, W, H, solid, fg, bodies };
}

/* ───────────────────────── recorte de una pose ───────────────────────── */

/** Devuelve { rgba, width, height, box } para una pose ya segmentada. */
function cutPose({ data, W, H, solid, fg }, body) {
  const ids = new Set([body.id]);
  if (body.pose.decor) for (const c of body.extra) ids.add(c.id);
  const comps = [body.comp, ...(body.pose.decor ? body.extra : [])];

  const box = {
    x0: Math.max(0, Math.min(...comps.map((c) => c.minX)) - PAD),
    y0: Math.max(0, Math.min(...comps.map((c) => c.minY)) - PAD),
    x1: Math.min(W - 1, Math.max(...comps.map((c) => c.maxX)) + PAD),
    y1: Math.min(H - 1, Math.max(...comps.map((c) => c.maxY)) + PAD),
  };
  const w = box.x1 - box.x0 + 1;
  const h = box.y1 - box.y0 + 1;

  // Máscara local: componentes de esta pose + rectángulos `include` − rectángulos `erase`.
  const inRect = (rects, x, y) => (rects ?? []).some((r) => x >= r.x0 && x <= r.x1 && y >= r.y0 && y <= r.y1);
  const mask = new Uint8Array(w * h);
  const rgb = new Uint8Array(w * h * 3);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const gx = x + box.x0;
      const gy = y + box.y0;
      const gi = gy * W + gx;
      const li = y * w + x;
      rgb[li * 3] = data[gi * 3];
      rgb[li * 3 + 1] = data[gi * 3 + 1];
      rgb[li * 3 + 2] = data[gi * 3 + 2];
      if (!solid[gi]) continue;
      const own = ids.has(fg.lab[gi]) && !inRect(body.pose.erase, gx, gy);
      if (own || inRect(body.pose.include, gx, gy)) mask[li] = 1;
    }
  }

  // Borde limpio: el contorno del JPEG mezcla morado con gris/blanco, lo que deja un halo
  // claro. Se recolorea la banda de 2 px del borde con el color interior más cercano y se
  // erosiona 1 px + se suaviza el alfa.
  const inner = erode(mask, w, h, 2);
  const fixed = Uint8Array.from(rgb);
  for (let pass = 0; pass < 2; pass++) {
    const src = Uint8Array.from(fixed);
    const ok = pass === 0 ? inner : null;
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const i = y * w + x;
        if (!mask[i] || inner[i]) continue;
        let r = 0, g = 0, b = 0, n = 0;
        for (let dy = -3; dy <= 3; dy++) {
          for (let dx = -3; dx <= 3; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
            const q = ny * w + nx;
            if (!(ok ? ok[q] : inner[q])) continue;
            r += src[q * 3];
            g += src[q * 3 + 1];
            b += src[q * 3 + 2];
            n++;
          }
        }
        if (n) {
          fixed[i * 3] = r / n;
          fixed[i * 3 + 1] = g / n;
          fixed[i * 3 + 2] = b / n;
        }
      }
    }
    break; // una pasada basta: las líneas finas sin interior conservan su color original
  }

  const hard = erode(mask, w, h, 1);
  const alphaHard = Buffer.alloc(w * h);
  for (let i = 0; i < w * h; i++) alphaHard[i] = hard[i] ? 255 : 0;

  return { rgb: fixed, alphaHard, w, h, box };
}

async function encode({ rgb, alphaHard, w, h }, file) {
  // El alfa se suaviza como imagen de un canal; `info.channels` evita suponer el stride.
  const { data: soft, info } = await sharp(alphaHard, { raw: { width: w, height: h, channels: 1 } })
    .blur(0.7)
    .extractChannel(0)
    .raw()
    .toBuffer({ resolveWithObject: true });
  const stride = info.channels;
  const rgba = Buffer.alloc(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    rgba[i * 4] = rgb[i * 3];
    rgba[i * 4 + 1] = rgb[i * 3 + 1];
    rgba[i * 4 + 2] = rgb[i * 3 + 2];
    rgba[i * 4 + 3] = soft[i * stride];
  }
  const out = await sharp(rgba, { raw: { width: w, height: h, channels: 4 } })
    .webp({ quality: 90, alphaQuality: 100, effort: 6 })
    .toBuffer();
  await writeFile(path.join(OUT, file), out);
  return out.length;
}

/* ───────────────────────── separación del brazo ───────────────────────── */

/** Rasteriza un polígono a máscara binaria w×h (1 dentro). */
async function rasterPolygon(points, w, h) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="100%" height="100%" fill="black"/><polygon points="${points
    .map((p) => p.join(","))
    .join(" ")}" fill="white"/></svg>`;
  const { data, info } = await sharp(Buffer.from(svg))
    .removeAlpha()
    .extractChannel(0)
    .raw()
    .toBuffer({ resolveWithObject: true });
  const m = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) m[i] = data[i * info.channels] >= 128 ? 1 : 0;
  return m;
}

/** Desenfoca una máscara 0/1 y devuelve valores 0..255. */
async function softMask(mask, w, h, sigma) {
  const buf = Buffer.alloc(w * h);
  for (let i = 0; i < w * h; i++) buf[i] = mask[i] ? 255 : 0;
  const { data, info } = await sharp(buf, { raw: { width: w, height: h, channels: 1 } })
    .blur(sigma)
    .extractChannel(0)
    .raw()
    .toBuffer({ resolveWithObject: true });
  const out = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) out[i] = data[i * info.channels];
  return out;
}

/** Devuelve { body, arm }: dos alfas duros con los que se codifican las dos capas. */
async function splitArm(cut, arm) {
  const { w, h, alphaHard } = cut;
  const OVERLAP_KEEP = 4; // px de franja del torso que se conserva bajo el brazo
  const zone = await rasterPolygon(arm.zone, w, h);
  const armSoft = await softMask(zone, w, h, 1.5);
  const innerSoft = await softMask(erode(zone, w, h, OVERLAP_KEEP), w, h, 1.5);
  const body = Buffer.alloc(w * h);
  const armA = Buffer.alloc(w * h);
  for (let i = 0; i < w * h; i++) {
    armA[i] = (alphaHard[i] * armSoft[i]) / 255;
    body[i] = (alphaHard[i] * (255 - innerSoft[i])) / 255;
  }
  return { body, arm: armA };
}

/* ───────────────────────── main ───────────────────────── */

await mkdir(OUT, { recursive: true });
const manifest = {};

for (const sheet of SHEETS) {
  const seg = await segmentSheet(sheet);
  for (const body of seg.bodies) {
    const cut = cutPose(seg, body);
    const bytes = await encode(cut, `${body.pose.name}.webp`);
    manifest[body.pose.name] = { width: cut.w, height: cut.h, bytes };
    if (body.pose.arm) {
      const layers = await splitArm(cut, body.pose.arm);
      await encode({ ...cut, alphaHard: layers.body }, `${body.pose.name}-body.webp`);
      await encode({ ...cut, alphaHard: layers.arm }, `${body.pose.name}-arm.webp`);
      const [px, py] = body.pose.arm.pivot;
      manifest[body.pose.name].arm = {
        pivot: [+((px / cut.w) * 100).toFixed(1), +((py / cut.h) * 100).toFixed(1)],
      };
    }
    console.log(
      `${body.pose.name.padEnd(20)} ${cut.w}×${cut.h}  ${(bytes / 1024).toFixed(1)} KB  (decor: ${body.extra.length})`,
    );
  }
}

await writeFile(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
