const CACHE_NAME = 'anti-sleep-v2-shell-v4';

const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './i18n.js',
  './favicon.png',
  './icons/favicon.png',
  './Algeria%20Heart%20Flag.png'
];

/*
 * Install
 * ----------
 * Cache each file independently.
 * A missing/unavailable file must NOT make the entire
 * Service Worker installation fail.
 */
self.addEventListener('install', event => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      await Promise.all(
        APP_SHELL.map(async resource => {
          try {
            const request = new Request(resource, {
              cache: 'no-cache'
            });

            const response = await fetch(request);

            if (!response.ok) {
              console.warn(
                '[Service Worker] Skipped resource:',
                resource,
                'HTTP',
                response.status
              );
              return;
            }

            await cache.put(request, response);
          } catch (error) {
            console.warn(
              '[Service Worker] Could not cache:',
              resource,
              error
            );
          }
        })
      );

      await self.skipWaiting();
    })()
  );
});


/*
 * Activate
 * ----------
 * Remove old Anti-Sleep caches and immediately
 * take control of existing pages.
 */
self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();

      await Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );

      await self.clients.claim();
    })()
  );
});


/*
 * Fetch
 * ----------
 * - Never intercept API requests.
 * - Use cache first for same-origin GET requests.
 * - If not cached, request from network.
 * - Cache successful network responses.
 * - If network fails, return cached response when available.
 */
self.addEventListener('fetch', event => {
  const request = event.request;

  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);

  // Never cache or intercept backend/API requests.
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  // Only handle resources belonging to this application.
  if (url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    (async () => {
      const cachedResponse = await caches.match(request);

      if (cachedResponse) {
        return cachedResponse;
      }

      try {
        const networkResponse = await fetch(request);

        /*
         * Only cache successful responses.
         * Opaque/failed/error responses are not stored.
         */
        if (
          networkResponse &&
          networkResponse.ok &&
          networkResponse.status === 200
        ) {
          try {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(request, networkResponse.clone());
          } catch (cacheError) {
            console.warn(
              '[Service Worker] Cache write failed:',
              cacheError
            );
          }
        }

        return networkResponse;
      } catch (networkError) {
        console.warn(
          '[Service Worker] Network request failed:',
          request.url,
          networkError
        );

        /*
         * Nothing cached and network unavailable.
         * Return a normal offline response instead of
         * throwing an unhandled Promise rejection.
         */
        return new Response(
          'Offline',
          {
            status: 503,
            statusText: 'Service Unavailable',
            headers: {
              'Content-Type': 'text/plain; charset=utf-8'
            }
          }
        );
      }
    })()
  );
});
