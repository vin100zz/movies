// Service worker : rend l'application installable et garde une copie
// des fichiers statiques pour démarrer hors ligne.
// Stratégie "network first" : on sert toujours la version en ligne si possible.
// Les appels à l'API (server/*.php) ne passent pas par le cache.

// Le cache est partagé avec les autres applis du même domaine : on ne touche qu'aux caches préfixés.
const CACHE_PREFIX = 'movies-';
const CACHE_NAME = CACHE_PREFIX + 'v1';
const CACHED_DESTINATIONS = ['document', 'script', 'style', 'font', 'image', 'manifest'];

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET'
    || url.origin !== self.location.origin
    || !CACHED_DESTINATIONS.includes(request.destination)) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then(response => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        }
        return response;
      })
      .catch(() => caches.match(request, { ignoreSearch: request.mode === 'navigate' }))
  );
});
