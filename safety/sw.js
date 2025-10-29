const CACHE_NAME = 'gotta-safety-v102';
const OFFLINE_FILES = [
  '/favicon.ico',
  '/js/link-checker.js',
  '/safety/',
  '/safety/index.html',
  '/safety/css/safety.css',
  '/safety/icons/icon-warning-avalanches-orange.svg',
  '/safety/icons/icon-warning-avalanches-red.svg',
  '/safety/icons/icon-warning-avalanches-yellow.svg',
  '/safety/icons/icon-warning-drivingconditions-orange.svg',
  '/safety/icons/icon-warning-drivingconditions-red.svg',
  '/safety/icons/icon-warning-drivingconditions-yellow.svg',
  '/safety/icons/icon-warning-extreme.svg',
  '/safety/icons/icon-warning-flood-orange.svg',
  '/safety/icons/icon-warning-flood-red.svg',
  '/safety/icons/icon-warning-flood-yellow.svg',
  '/safety/icons/icon-warning-forestfire-orange.svg',
  '/safety/icons/icon-warning-forestfire-red.svg',
  '/safety/icons/icon-warning-forestfire-yellow.svg',
  '/safety/icons/icon-warning-generic-orange.svg',
  '/safety/icons/icon-warning-generic-red.svg',
  '/safety/icons/icon-warning-generic-yellow.svg',
  '/safety/icons/icon-warning-ice-orange.svg',
  '/safety/icons/icon-warning-ice-red.svg',
  '/safety/icons/icon-warning-ice-yellow.svg',
  '/safety/icons/icon-warning-landslide-orange.svg',
  '/safety/icons/icon-warning-landslide-red.svg',
  '/safety/icons/icon-warning-landslide-yellow.svg',
  '/safety/icons/icon-warning-lightning-orange.svg',
  '/safety/icons/icon-warning-lightning-red.svg',
  '/safety/icons/icon-warning-lightning-yellow.svg',
  '/safety/icons/icon-warning-polarlow-orange.svg',
  '/safety/icons/icon-warning-polarlow-red.svg',
  '/safety/icons/icon-warning-polarlow-yellow.svg',
  '/safety/icons/icon-warning-rain-orange.svg',
  '/safety/icons/icon-warning-rain-red.svg',
  '/safety/icons/icon-warning-rain-yellow.svg',
  '/safety/icons/icon-warning-rainflood-orange.svg',
  '/safety/icons/icon-warning-rainflood-red.svg',
  '/safety/icons/icon-warning-rainflood-yellow.svg',
  '/safety/icons/icon-warning-snow-orange.svg',
  '/safety/icons/icon-warning-snow-red.svg',
  '/safety/icons/icon-warning-snow-yellow.svg',
  '/safety/icons/icon-warning-stormsurge-orange.svg',
  '/safety/icons/icon-warning-stormsurge-red.svg',
  '/safety/icons/icon-warning-stormsurge-yellow.svg',
  '/safety/icons/icon-warning-wind-orange.svg',
  '/safety/icons/icon-warning-wind-red.svg',
  '/safety/icons/icon-warning-wind-yellow.svg',
  '/safety/img/icon-192.png',
  '/safety/img/icon-512.png',
  '/safety/img/icon-cpr.svg',
  '/safety/img/qrshare.png',
  '/safety/js/link-checker.js',
  '/safety/js/weather-alerts.js',
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
  '/safety/norway/power.html',
  '/safety/norway/weather.html',
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
