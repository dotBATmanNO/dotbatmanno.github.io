const CACHE_NAME = 'gotta-safety-v102';
const OFFLINE_FILES = [
  '/favicon.ico',
  '/js/link-checker.js',
  '/safety/',
  '/safety/index.html',
  '/safety/css/safety.css',
  '/safety/img/icon-192.png',
  '/safety/img/icon-512.png',
  '/safety/img/icon-cpr.svg',
  '/safety/img/qrshare.png',
  '/safety/js/link-checker.js',
  '/safety/android-chrome-192x192.png',
  '/safety/android-chrome-512x512.png',
  '/safety/apple-touch-icon.png',
  '/safety/favicon-16x16.png',
  '/safety/favicon-32x32.png',
  '/safety/favicon.ico',
  '/safety/manifest.json',
  '/safety/print.html',
  '/safety/cprhlr.html',
  '/safety/norway/',
  '/safety/norway/cprhlr.html',
  '/safety/norway/fire.html',
  '/safety/norway/index.html'
];

// Install and cache essential files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(OFFLINE_FILES))
  );
  self.skipWaiting();
});

// Activate and clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Serve cached content when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match(event.request).then(response =>
        response || caches.match('/safety/index.html')
      )
    )
  );
});
