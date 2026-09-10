/**
 * Génère les icônes PNG de la PWA à partir de `public/icon.svg`.
 *
 * iOS ignore les icônes SVG : sans PNG, « Ajouter à l'écran d'accueil »
 * produit une capture de la page au lieu de l'icône. Android veut en plus
 * une variante « maskable » (fond à bord perdu, glyphe dans la zone sûre
 * des 80 % centraux, le système découpant la forme qu'il veut).
 *
 *   node scripts/gen-icons.mjs
 *
 * À relancer seulement si l'icône change ; les PNG sont versionnés.
 */

import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const out = (name) => path.join(root, "public", name);

const BG = "#0b0f14";
const FG = "#5eb0ff";

const GLYPH = `<path d="M18 44V20h12a8 8 0 0 1 0 16h-6l10 8" fill="none" stroke="${FG}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`;

/**
 * Le tracé n'est pas centré dans son viewBox : bords à x 15.5→40.5 et
 * y 17.5→46.5 une fois le contour de 5 pris en compte, soit un centre en
 * (28, 32). On recentre autour de ce point, pas de (32, 32).
 */
const CX = 28;
const CY = 32;

/** `scale` autour du centre réel du glyphe, ramené au centre du carré. */
function centered(scale) {
  return `<g transform="translate(32 32) scale(${scale}) translate(${-CX} ${-CY})">${GLYPH}</g>`;
}

/** Icône normale : coins arrondis, glyphe pleine taille. */
const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="${BG}"/>
  ${centered(1)}
</svg>`;

/** iOS arrondit lui-même : fond carré plein, glyphe un peu resserré. */
const flat = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="${BG}"/>
  ${centered(0.88)}
</svg>`;

/** Android découpe une forme arbitraire : glyphe dans la zone sûre (80 %). */
const maskable = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="${BG}"/>
  ${centered(0.62)}
</svg>`;

const targets = [
  { svg: icon, size: 192, name: "icon-192.png" },
  { svg: icon, size: 512, name: "icon-512.png" },
  { svg: flat, size: 180, name: "apple-touch-icon.png" },
  { svg: maskable, size: 512, name: "icon-maskable.png" },
];

for (const { svg, size, name } of targets) {
  const png = await sharp(Buffer.from(svg), { density: 384 })
    .resize(size, size)
    .flatten({ background: BG })
    .png({ compressionLevel: 9 })
    .toBuffer();
  await writeFile(out(name), png);
  console.log(`${name.padEnd(22)} ${size}×${size}  ${(png.length / 1024).toFixed(1)} ko`);
}
