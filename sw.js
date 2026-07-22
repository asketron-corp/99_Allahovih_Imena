const CACHE_NAME = '99-names-cache-v3';
const ASSETS = [
  './',
  './index.html',
  './99_Allahovih_Imena_Offline.html',
  './names.json',
  './manifest.json',
  './icon.svg'
];

// Install Event - cache assets immediately
self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching app shell and names data v3');
      return cache.addAll(ASSETS);
    })
  );
});

// Activate Event - purge all old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event (Network First for names.json & HTML, Fallback to Cache)
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  
  if (url.pathname.endsWith('names.json') || url.pathname.endsWith('index.html') || url.pathname.endsWith('/')) {
    // Network First strategy so updates are immediately reflected when online
    e.respondWith(
      fetch(e.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, responseClone));
        }
        return networkResponse;
      }).catch(() => {
        return caches.match(e.request);
      })
    );
  } else {
    // Cache First for static assets (images, icons, etc.)
    e.respondWith(
      caches.match(e.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(e.request);
      })
    );
  }
});
