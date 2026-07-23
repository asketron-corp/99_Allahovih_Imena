const CACHE_NAME = 'kuran-audio-v1';
const AUDIO_CACHE = 'kuran-audio-mp3-v1';

const STATIC_ASSETS = [
  './',
  './index.html',
  './Kuran_Audio_Offline.html',
  './manifest.json',
  './icon.svg',
  './surahs.json'
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching app shell');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key !== AUDIO_CACHE) {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Audio MP3 request strategy (Cache First, network fallback & store in AUDIO_CACHE)
  if (req.destination === 'audio' || url.pathname.endsWith('.mp3') || url.hostname.includes('quranicaudio.com') || url.hostname.includes('everyayah.com')) {
    event.respondWith(
      caches.open(AUDIO_CACHE).then(async (cache) => {
        const cachedResponse = await cache.match(req);
        if (cachedResponse) {
          return cachedResponse;
        }
        try {
          const networkResponse = await fetch(req);
          if (networkResponse && networkResponse.status === 200) {
            cache.put(req, networkResponse.clone());
          }
          return networkResponse;
        } catch (err) {
          console.log('[SW] Audio fetch failed and no cache available:', err);
          return new Response('Audio not available offline', { status: 503, statusText: 'Offline' });
        }
      })
    );
    return;
  }

  // App Shell & API requests (Stale-While-Revalidate / Cache First)
  event.respondWith(
    caches.match(req).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch background update
        fetch(req).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(req, networkResponse));
          }
        }).catch(() => {/* Offline fallback */});
        return cachedResponse;
      }

      return fetch(req).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(req, responseToCache);
        });
        return networkResponse;
      }).catch(() => {
        // Offline HTML fallback
        if (req.headers.get('accept').includes('text/html')) {
          return caches.match('./index.html');
        }
      });
    })
  );
});
