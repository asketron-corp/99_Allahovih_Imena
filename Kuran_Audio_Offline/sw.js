const CACHE_NAME = 'kuran-audio-v3';
const AUDIO_CACHE = 'kuran-audio-mp3-v3';

const STATIC_ASSETS = [
  './',
  './index.html',
  './Kuran_Audio_Offline.html',
  './manifest.json',
  './icon.svg',
  './surahs.json'
];

// Install Event - Force Skip Waiting to take over immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW v3] Pre-caching app shell');
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Activate Event - Clear old caches and claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key !== AUDIO_CACHE) {
            console.log('[SW v3] Deleting obsolete cache:', key);
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

  // 1. Audio MP3 request strategy (mp3quran.net, quranicaudio.com, everyayah.com, audio/*, .mp3)
  if (
    req.destination === 'audio' ||
    url.pathname.endsWith('.mp3') ||
    url.hostname.includes('mp3quran.net') ||
    url.hostname.includes('quranicaudio.com') ||
    url.hostname.includes('everyayah.com')
  ) {
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
          console.log('[SW v3] Audio fetch failed offline:', err);
          return new Response('Audio fallback unavailable', { status: 503 });
        }
      })
    );
    return;
  }

  // 2. HTML Document Requests -> NETWORK FIRST (always get latest HTML when online, fallback to cache if offline)
  if (req.mode === 'navigate' || (req.headers.get('accept') && req.headers.get('accept').includes('text/html'))) {
    event.respondWith(
      fetch(req)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }
          return networkResponse;
        })
        .catch(() => {
          console.log('[SW v3] Offline HTML fallback used');
          return caches.match(req).then((cached) => cached || caches.match('./index.html'));
        })
    );
    return;
  }

  // 3. All other static assets -> Stale While Revalidate
  event.respondWith(
    caches.match(req).then((cachedResponse) => {
      const fetchPromise = fetch(req).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          caches.open(CACHE_NAME).then((cache) => cache.put(req, networkResponse));
        }
        return networkResponse;
      }).catch(() => {/* Offline */});

      return cachedResponse || fetchPromise;
    })
  );
});
