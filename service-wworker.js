// service-worker.js - Mia va al Colegio
const CACHE_NAME = 'mia-colegio-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Mia - Cache abierto');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.error('❌ Error al cachear:', err))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Mia - Cache antiguo eliminado:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) return response;
        return fetch(event.request)
          .then(response => {
            if (!response || response.status !== 200 || response.type !== 'basic') return response;
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                try { cache.put(event.request, responseToCache); } catch (e) {}
              });
            return response;
          })
          .catch(() => {
            return new Response('😅 ¡Ups! Sin conexión. Conéctate para seguir aprendiendo con Mia.', {
              status: 503,
              statusText: 'Sin conexión',
              headers: new Headers({ 'Content-Type': 'text/plain' })
            });
          });
      })
  );
});

console.log('🚀 Mia - Service Worker cargado correctamente');
