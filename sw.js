// Simple, GitHub Pages–friendly service worker
// - Pre-caches core pages and assets
// - Network-first for navigations with 500.html fallback
// - Cache-first for static assets
// - Ignores cross-origin requests (e.g. GitHub API)

const CACHE_VERSION = 'v3';
const STATIC_CACHE = `static-${CACHE_VERSION}`;

const CORE_ASSETS = [
  '/',               // homepage
  '/index.html',
  '/projects.html',
  '/project.html',
  '/404.html',
  '/500.html',
  '/assets/site.css',
  '/assets/common.js',
  '/assets/index.js',
  '/assets/projects.js',
  '/assets/project.js',
];

// Install: pre-cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: network-first for navigations, cache-first for same-origin assets
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle same-origin requests
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) {
    return; // Let the browser handle GitHub API, CDNs, etc.
  }

  // HTML navigations → network-first with 500 fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful navigations
          const copy = response.clone();
          caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() =>
          // If offline or network fails:
          caches.match(request).then((cached) => cached || caches.match('/500.html'))
        )
    );
    return;
  }

  // For other same-origin GETs → cache-first, then network
  if (request.method === 'GET') {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;

        return fetch(request)
          .then((response) => {
            const copy = response.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy));
            return response;
          })
          .catch(() => {
            // As a last resort, serve 500 only for HTML-like requests
            const accept = request.headers.get('accept') || '';
            if (accept.includes('text/html')) {
              return caches.match('/500.html');
            }
            // Otherwise, just fail silently and let the browser handle it
          });
      })
    );
  }
});
