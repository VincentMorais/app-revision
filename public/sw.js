/* Service worker : l'app doit être entièrement utilisable hors ligne, y
 * compris les chapitres jamais ouverts (réviser dans l'avion).
 *
 * `precache.json` est écrit par `scripts/gen-precache.mjs` juste après le
 * build : il liste toutes les pages prérendues et tous les assets produits,
 * avec leurs hash. À l'installation, on télécharge tout.
 *
 * Sa `version` est l'identifiant du build. Elle sert de nom de cache : un
 * nouveau déploiement précharge tout à nouveau et l'ancien cache est
 * supprimé, sans avoir à modifier ce fichier — ce qui compte, car un
 * `sw.js` inchangé ne déclenche pas de mise à jour côté navigateur.
 */

const PREFIX = "app-revision-";
const MANIFEST_URL = "/precache.json";
/** Entrée synthétique qui mémorise l'avancement du préchargement. */
const STATUS_URL = "/__precache-status";
/** Requêtes simultanées pendant le préchargement. */
const CONCURRENCY = 6;

// ---------------------------------------------------------------------------
// Cycle de vie
// ---------------------------------------------------------------------------

self.addEventListener("install", (event) => {
  event.waitUntil(precacheAll().then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      await self.clients.claim();
      // Un nouveau build a pu sortir depuis l'installation.
      await precacheAll();
    })(),
  );
});

self.addEventListener("message", (event) => {
  const data = event.data;
  if (!data || typeof data !== "object") return;

  if (data.type === "check-update") {
    event.waitUntil(precacheAll());
    return;
  }

  if (data.type === "status") {
    event.waitUntil(
      readStatus().then((status) => {
        if (event.source) event.source.postMessage({ type: "status", status });
      }),
    );
  }
});

// ---------------------------------------------------------------------------
// Préchargement
// ---------------------------------------------------------------------------

let inFlight = null;

/** Précharge tout ce que décrit precache.json. Une seule exécution à la fois. */
function precacheAll() {
  if (!inFlight) {
    inFlight = runPrecache().finally(() => {
      inFlight = null;
    });
  }
  return inFlight;
}

async function runPrecache() {
  let manifest;
  try {
    const res = await fetch(MANIFEST_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("manifest indisponible");
    manifest = await res.json();
  } catch {
    // Hors ligne au démarrage : on garde ce qui est déjà en cache.
    return;
  }

  const version = String(manifest.version || "0");
  const cacheName = PREFIX + version;
  const routes = Array.isArray(manifest.routes) ? manifest.routes : [];
  const assets = Array.isArray(manifest.assets) ? manifest.assets : [];

  const cache = await caches.open(cacheName);

  const previous = await readStatus();
  if (previous && previous.version === version && previous.complete) {
    await dropOtherCaches(cacheName);
    return;
  }

  // Les pages d'abord : c'est ce qui compte si le préchargement est coupé
  // en cours de route.
  let cachedRoutes = 0;
  await pooled(routes, async (route) => {
    if (await cacheUrl(cache, route)) cachedRoutes += 1;
  });

  // Puis les assets. Ils sont immuables (hash dans le nom) : ceux qui sont
  // déjà là n'ont pas à être retéléchargés.
  let cachedAssets = 0;
  await pooled(assets, async (url) => {
    if (await cache.match(url)) {
      cachedAssets += 1;
      return;
    }
    if (await cacheUrl(cache, url)) cachedAssets += 1;
  });

  const complete = cachedRoutes === routes.length && cachedAssets === assets.length;
  await writeStatus(cache, {
    version,
    complete,
    routes: cachedRoutes,
    totalRoutes: routes.length,
    assets: cachedAssets,
    totalAssets: assets.length,
    at: Date.now(),
  });

  await dropOtherCaches(cacheName);
}

async function cacheUrl(cache, url) {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return false;
    await cache.put(url, res);
    return true;
  } catch {
    return false;
  }
}

/** Exécute `fn` sur chaque entrée, CONCURRENCY à la fois. */
async function pooled(items, fn) {
  let i = 0;
  const workers = new Array(Math.min(CONCURRENCY, items.length)).fill(0).map(async () => {
    while (i < items.length) {
      const item = items[i++];
      await fn(item);
    }
  });
  await Promise.all(workers);
}

async function dropOtherCaches(keep) {
  const keys = await caches.keys();
  await Promise.all(keys.filter((k) => k.startsWith(PREFIX) && k !== keep).map((k) => caches.delete(k)));
}

// ---------------------------------------------------------------------------
// État du préchargement (lisible depuis l'app)
// ---------------------------------------------------------------------------

async function writeStatus(cache, status) {
  await cache.put(
    STATUS_URL,
    new Response(JSON.stringify(status), { headers: { "Content-Type": "application/json" } }),
  );
}

async function readStatus() {
  const cache = await currentCache();
  if (!cache) return null;
  const hit = await cache.match(STATUS_URL);
  if (!hit) return null;
  try {
    return await hit.json();
  } catch {
    return null;
  }
}

/** Le cache le plus récemment écrit (il n'y en a normalement qu'un). */
async function currentCache() {
  const keys = (await caches.keys()).filter((k) => k.startsWith(PREFIX));
  if (keys.length === 0) return null;
  return caches.open(keys[keys.length - 1]);
}

// ---------------------------------------------------------------------------
// Interception réseau
// ---------------------------------------------------------------------------

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Assets Next : immuables (hash dans l'URL).
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Navigation : le cache d'abord, pour que les chapitres préchargés
  // s'ouvrent hors ligne même sans avoir jamais été visités.
  if (request.mode === "navigate") {
    event.respondWith(navigationStrategy(request, url));
    return;
  }

  // Charge RSC d'une navigation côté client : si elle échoue hors ligne,
  // on renvoie une erreur réseau — le routeur Next bascule alors sur une
  // navigation complète, que l'on sert depuis le cache.
  if (request.headers.get("RSC") === "1" || url.searchParams.has("_rsc")) {
    event.respondWith(fetch(request).catch(() => Response.error()));
    return;
  }

  event.respondWith(networkFirst(request));
});

async function cacheFirst(request) {
  const cache = await currentCache();
  const hit = cache ? await cache.match(request) : undefined;
  if (hit) return hit;
  const res = await fetch(request);
  if (res.ok && cache) cache.put(request, res.clone());
  return res;
}

/**
 * Pages : cache d'abord (instantané, marche hors ligne), puis rafraîchi en
 * arrière-plan pour ne pas rester bloqué sur une version périmée.
 */
async function navigationStrategy(request, url) {
  const cache = await currentCache();
  const key = url.pathname;
  const hit = cache ? await cache.match(key) : undefined;

  if (hit) {
    revalidate(cache, key);
    return hit;
  }

  try {
    const res = await fetch(request);
    if (res.ok && cache) cache.put(key, res.clone());
    return res;
  } catch {
    if (cache) {
      const root = await cache.match("/");
      if (root) return root;
    }
    return offlineResponse();
  }
}

/** Rafraîchit une page en cache sans bloquer la réponse. */
function revalidate(cache, key) {
  if (!cache) return;
  fetch(key, { cache: "no-store" })
    .then((res) => {
      if (res.ok) cache.put(key, res);
    })
    .catch(() => {
      // hors ligne : on garde la version en cache
    });
}

async function networkFirst(request) {
  const cache = await currentCache();
  try {
    const res = await fetch(request);
    if (res.ok && cache) cache.put(request, res.clone());
    return res;
  } catch {
    const hit = cache ? await cache.match(request) : undefined;
    if (hit) return hit;
    return offlineResponse();
  }
}

function offlineResponse() {
  return new Response("Hors ligne", { status: 503, headers: { "Content-Type": "text/plain" } });
}
