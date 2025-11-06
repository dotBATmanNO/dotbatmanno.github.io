const CACHE_NAME = 'gotta-beredskap-v104';
const OFFLINE_FILES = [
  '/favicon.ico',
  '/beredskap/',
  '/beredskap/index.html',
  '/beredskap/css/beredskap.css',
  '/beredskap/icons/icon-warning-avalanches-orange.svg',
  '/beredskap/icons/icon-warning-avalanches-red.svg',
  '/beredskap/icons/icon-warning-avalanches-yellow.svg',
  '/beredskap/icons/icon-warning-drivingconditions-orange.svg',
  '/beredskap/icons/icon-warning-drivingconditions-red.svg',
  '/beredskap/icons/icon-warning-drivingconditions-yellow.svg',
  '/beredskap/icons/icon-warning-extreme.svg',
  '/beredskap/icons/icon-warning-flood-orange.svg',
  '/beredskap/icons/icon-warning-flood-red.svg',
  '/beredskap/icons/icon-warning-flood-yellow.svg',
  '/beredskap/icons/icon-warning-forestfire-orange.svg',
  '/beredskap/icons/icon-warning-forestfire-red.svg',
  '/beredskap/icons/icon-warning-forestfire-yellow.svg',
  '/beredskap/icons/icon-warning-generic-orange.svg',
  '/beredskap/icons/icon-warning-generic-red.svg',
  '/beredskap/icons/icon-warning-generic-yellow.svg',
  '/beredskap/icons/icon-warning-ice-orange.svg',
  '/beredskap/icons/icon-warning-ice-red.svg',
  '/beredskap/icons/icon-warning-ice-yellow.svg',
  '/beredskap/icons/icon-warning-landslide-orange.svg',
  '/beredskap/icons/icon-warning-landslide-red.svg',
  '/beredskap/icons/icon-warning-landslide-yellow.svg',
  '/beredskap/icons/icon-warning-lightning-orange.svg',
  '/beredskap/icons/icon-warning-lightning-red.svg',
  '/beredskap/icons/icon-warning-lightning-yellow.svg',
  '/beredskap/icons/icon-warning-polarlow-orange.svg',
  '/beredskap/icons/icon-warning-polarlow-red.svg',
  '/beredskap/icons/icon-warning-polarlow-yellow.svg',
  '/beredskap/icons/icon-warning-rain-orange.svg',
  '/beredskap/icons/icon-warning-rain-red.svg',
  '/beredskap/icons/icon-warning-rain-yellow.svg',
  '/beredskap/icons/icon-warning-rainflood-orange.svg',
  '/beredskap/icons/icon-warning-rainflood-red.svg',
  '/beredskap/icons/icon-warning-rainflood-yellow.svg',
  '/beredskap/icons/icon-warning-snow-orange.svg',
  '/beredskap/icons/icon-warning-snow-red.svg',
  '/beredskap/icons/icon-warning-snow-yellow.svg',
  '/beredskap/icons/icon-warning-stormsurge-orange.svg',
  '/beredskap/icons/icon-warning-stormsurge-red.svg',
  '/beredskap/icons/icon-warning-stormsurge-yellow.svg',
  '/beredskap/icons/icon-warning-wind-orange.svg',
  '/beredskap/icons/icon-warning-wind-red.svg',
  '/beredskap/icons/icon-warning-wind-yellow.svg',
  '/beredskap/img/icon-192.png',
  '/beredskap/img/icon-512.png',
  '/beredskap/img/icon-cpr.svg',
  '/beredskap/img/qrshare.png',
  '/beredskap/js/link-checker.js',
  '/beredskap/js/weather-alerts.js',
  '/beredskap/android-chrome-192x192.png',
  '/beredskap/android-chrome-512x512.png',
  '/beredskap/apple-touch-icon.png',
  '/beredskap/favicon-16x16.png',
  '/beredskap/favicon-32x32.png',
  '/beredskap/favicon.ico',
  '/beredskap/manifest.json',
  '/beredskap/print.html',
  '/beredskap/lokalt/index.html',
  '/beredskap/pages/',
  '/beredskap/pages/cprhlr.html',
  '/beredskap/pages/fire.html',
  '/beredskap/pages/power.html',
  '/beredskap/pages/weather.html',
  '/beredskap/pages/index.html'
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
        response || caches.match('/beredskap/index.html')
      )
    )
  );
});

