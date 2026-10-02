const CACHE_NAME = 'repeat-cache-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});



self.addEventListener('fetch', (event) => {
  // Empty fetch handler to satisfy PWA installability requirements
  // We don't intercept requests to avoid breaking analytics and navigation
});
