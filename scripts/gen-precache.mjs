/**
 * Écrit `public/precache.json` : la liste exacte de ce que le service worker
 * doit mettre en cache pour que l'app fonctionne hors ligne, chapitres jamais
 * ouverts compris.
 *
 * Lancé après `next build` (voir le script `build` du package.json), il lit
 * ce que Next vient réellement de produire :
 *   - `.next/BUILD_ID`             → version du cache, change à chaque build ;
 *   - `.next/prerender-manifest`   → toutes les pages prérendues ;
 *   - `.next/static/**`            → tous les assets, hash compris.
 *
 * On ne devine rien à partir du HTML : les noms de chunks contiennent des
 * parenthèses (`app/(tabs)/…`) et des crochets (`app/apprendre/[chapterId]/…`),
 * et certains ne sont référencés que par le runtime webpack. Tout rater ici,
 * c'est une page blanche dans l'avion.
 */

import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const next = path.join(root, ".next");

/** Pages à ne pas précharger : sans intérêt hors ligne. */
const SKIP_ROUTES = new Set(["/_not-found"]);

/** Fichiers hors Next à garder hors ligne. */
const EXTRA_ASSETS = [
  "/manifest.webmanifest",
  "/icon.svg",
  "/icon-192.png",
  "/icon-512.png",
  "/icon-maskable.png",
  "/apple-touch-icon.png",
];

function walk(dir, base, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, base, out);
    else out.push("/" + path.relative(base, full).split(path.sep).join("/"));
  }
  return out;
}

const buildId = readFileSync(path.join(next, "BUILD_ID"), "utf8").trim();

const prerender = JSON.parse(readFileSync(path.join(next, "prerender-manifest.json"), "utf8"));
const routes = Object.keys(prerender.routes ?? {})
  .filter((r) => !SKIP_ROUTES.has(r))
  .sort();

if (!routes.includes("/")) routes.unshift("/");

// Tous les assets du build. On ne filtre pas : quelques kilo-octets inutiles
// coûtent moins cher qu'un chunk manquant hors ligne.
const assets = walk(path.join(next, "static"), next)
  .map((p) => "/_next" + p)
  .sort();

const manifest = { version: buildId, routes, assets: [...assets, ...EXTRA_ASSETS] };

writeFileSync(path.join(root, "public", "precache.json"), JSON.stringify(manifest, null, 2) + "\n");

const bytes = walk(path.join(next, "static"), next).reduce(
  (n, p) => n + statSync(path.join(next, p.slice(1))).size,
  0,
);

console.log(
  `precache.json : build ${buildId} · ${routes.length} pages · ${manifest.assets.length} fichiers · ${(bytes / 1024 / 1024).toFixed(2)} Mo`,
);
