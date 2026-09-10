/* Service worker minimal : l'app fonctionne hors ligne une fois chargée.
 *
 * - Assets Next (/_next/static/…) : cache d'abord, ils sont immuables (hash dans l'URL).
 * - Pages et le reste (même origine, GET) : réseau d'abord, cache en secours.
 * - Navigation hors ligne vers une page jamais vue : on sert la racine, l'app
 *   étant entièrement côté client.
 */
const VERSION = "v1";
const CACHE = `app-revision-${VERSION}`;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(["/", "/manifest.webmanifest"]))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(cacheFirst(request));
    return;
  }
  event.respondWith(networkFirst(request));
});

async function cacheFirst(request) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(request);
  if (hit) return hit;
  const res = await fetch(request);
  if (res.ok) cache.put(request, res.clone());
  return res;
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE);
  try {
    const res = await fetch(request);
    if (res.ok) cache.put(request, res.clone());
    return res;
  } catch {
    const hit = await cache.match(request);
    if (hit) return hit;
    if (request.mode === "navigate") {
      const root = await cache.match("/");
      if (root) return root;
    }
    return new Response("Hors ligne", { status: 503, headers: { "Content-Type": "text/plain" } });
  }
}
