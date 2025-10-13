// sw.js — minimal offline + JSON cache
const CACHE = 'gjc-portfolio-v1';
const CORE = [
  '/',            // index.html
  '/og-image.png',
  '/manifest.webmanifest'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Strategy:
// - Same-origin JSON: stale-while-revalidate
// - Other same-origin: cache-first fallback
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return; // ignore CDN etc.

  // JSON (data/*.json): stale-while-revalidate
  if (url.pathname.startsWith('/data/')) {
    e.respondWith((async () => {
      const cache = await caches.open(CACHE);
      const cached = await cache.match(e.request);
      const fetchPromise = fetch(e.request, { cache: 'no-store' })
        .then(res => { cache.put(e.request, res.clone()); return res; })
        .catch(() => cached || Response.error());
      return cached || fetchPromise;
    })());
    return;
  }

  // Everything else (index, og image, manifest)
  e.respondWith(
    caches.match(e.request).then(res =>
      res || fetch(e.request).then(net => {
        // Optionally cache navigations and root assets
        if (e.request.method === 'GET' && (url.pathname === '/' || url.pathname === '/index.html')) {
          caches.open(CACHE).then(c => c.put(e.request, net.clone()));
        }
        return net;
      }).catch(() => caches.match('/'))
    )
  );
});
