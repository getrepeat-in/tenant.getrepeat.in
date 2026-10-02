const CACHE_NAME = 'repeat-cache-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch((err) => {
      console.error('SW fetch failed:', err);
      // Return a basic fallback response to prevent the promise from being unhandled
      return new Response('', { status: 502, statusText: 'Bad Gateway' });
    })
  );
});
