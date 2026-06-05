const CACHE_VERSION = "v4";
const STATIC_CACHE = `lefevre-static-${CACHE_VERSION}`;
const PAGES_CACHE = `lefevre-pages-${CACHE_VERSION}`;

const STATIC_ASSETS = [
  "/",
  "/conseils",
  "/expertises",
  "/contact",
  "/faq",
  "/avis",
  "/notre-cabinet",
  "/offline",
];

const CACHE_PATTERNS = {
  static: /\.(js|css|woff2?|ttf|otf)(\?.*)?$/,
  images: /\.(png|jpg|jpeg|webp|avif|svg|ico)(\?.*)?$/,
  cdn: /^https:\/\/(cdn\.helloklik\.com|gyisrwfapphqqdbpujtb\.supabase\.co)/,
};

// ─── Install ───────────────────────────────────────────────────────────────────
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {});
    }),
  );
});

// ─── Activate ──────────────────────────────────────────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== STATIC_CACHE && key !== PAGES_CACHE)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

// ─── Fetch ─────────────────────────────────────────────────────────────────────
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ne pas intercepter les requêtes non-GET ou cross-origin hors CDN connus
  if (request.method !== "GET") return;
  if (url.origin !== self.location.origin && !CACHE_PATTERNS.cdn.test(request.url)) return;

  // Assets statiques Next.js (_next/static) → cache-first
  if (url.pathname.startsWith("/_next/static/") || CACHE_PATTERNS.static.test(url.pathname)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // Images CDN → cache-first avec expiration longue
  if (CACHE_PATTERNS.images.test(url.pathname) || CACHE_PATTERNS.cdn.test(request.url)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // Pages HTML → network-first avec fallback cache
  if (request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(networkFirst(request));
    return;
  }
});

// ─── Stratégies ────────────────────────────────────────────────────────────────

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    return new Response("", { status: 503 });
  }
}

async function networkFirst(request) {
  const cache = await caches.open(PAGES_CACHE);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    // Fallback : page offline si disponible
    const offline = await cache.match("/offline");
    return offline ?? new Response("<h1>Hors ligne</h1>", { headers: { "Content-Type": "text/html" } });
  }
}
