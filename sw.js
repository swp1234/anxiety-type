const CACHE_PREFIX = 'anxiety-type-';
const CACHE_NAME = 'anxiety-type-v2';
const APP_PATH = '/anxiety-type/';
const urlsToCache = [
  './',
  './index.html',
  './css/style.css',
  './js/app.js',
  './js/i18n.js',
  './icon-192.svg',
  './icon-512.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(APP_PATH)) return;
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request).then(networkResponse => {
      if (networkResponse.ok) {
        const copy = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
      }
      return networkResponse;
    }))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => Promise.all(
      cacheNames.filter(cacheName => cacheName.startsWith(CACHE_PREFIX) && cacheName !== CACHE_NAME).map(cacheName => caches.delete(cacheName))
    )).then(() => self.clients.claim())
  );
});
