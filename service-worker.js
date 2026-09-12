// ============================================================
// 🚀 Mia va al Colegio - Service Worker
// ============================================================
// Versión del caché. 
// ⚠️ IMPORTANTE: Incrementar este número cada vez que hagas deploy
// Ejemplo: 'v1' → 'v2' → 'v3' ...
// ============================================================
// Antes
// Después de otro cambio
const CACHE_VERSION = 'v3';
const CACHE_NAME = `mia-colegio-${CACHE_VERSION}`;

// Archivos que se cachean al instalar (para funcionar offline)
const ARCHIVOS_CACHE = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icon-192.png',
    '/icon-512.png',
    'https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600;700&display=swap'
];

// ============================================================
// INSTALL - Se ejecuta cuando se instala el SW
// ============================================================
self.addEventListener('install', (event) => {
    console.log('📦 Mia - Service Worker instalando...');
    console.log('📦 Versión del caché:', CACHE_VERSION);

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('📦 Cache abierto:', CACHE_NAME);
                // addAll falla si un recurso no existe, por eso los añadimos uno a uno
                return Promise.all(
                    ARCHIVOS_CACHE.map((url) =>
                        cache.add(url).catch((err) => {
                            console.warn('⚠️ No se pudo cachear:', url, err.message);
                        })
                    )
                );
            })
            .then(() => {
                console.log('✅ Service Worker instalado');
                // Activa el nuevo SW inmediatamente sin esperar a cerrar pestañas
                return self.skipWaiting();
            })
    );
});

// ============================================================
// ACTIVATE - Se ejecuta cuando el SW toma el control
// ============================================================
self.addEventListener('activate', (event) => {
    console.log('🔄 Mia - Service Worker activando...');

    event.waitUntil(
        caches.keys()
            .then((nombresCaches) => {
                // Elimina TODOS los cachés antiguos que NO sean el actual
                return Promise.all(
                    nombresCaches.map((nombre) => {
                        if (nombre !== CACHE_NAME) {
                            console.log('🗑️ Eliminando caché antiguo:', nombre);
                            return caches.delete(nombre);
                        }
                    })
                );
            })
            .then(() => {
                console.log('✅ Service Worker activado');
                // Toma el control de todas las pestañas abiertas inmediatamente
                return self.clients.claim();
            })
            .then(() => {
                // Notifica a todas las pestañas que hay nueva versión
                return self.clients.matchAll().then((clients) => {
                    clients.forEach((client) => {
                        client.postMessage({
                            tipo: 'NUEVA_VERSION',
                            version: CACHE_VERSION
                        });
                    });
                });
            })
    );
});

// ============================================================
// FETCH - Estrategia de caché para cada petición
// ============================================================
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Ignorar peticiones que no son GET
    if (request.method !== 'GET') return;

    // Ignorar peticiones al backend (siempre deben ir a la red)
    if (url.origin.includes('backend-mia.arnaldoeuropa66.workers.dev')) {
        return;
    }

    // Ignorar peticiones de extensiones del navegador
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

    // ============================================================
    // Estrategia 1: NETWORK-FIRST para el index.html
    // Siempre intenta la red primero, cae al caché si falla.
    // Así los cambios se ven INMEDIATAMENTE.
    // ============================================================
    if (url.pathname === '/' || url.pathname === '/index.html') {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    // Guarda una copia actualizada en caché
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseClone);
                    });
                    return response;
                })
                .catch(() => {
                    // Si no hay red, sirve la versión cacheada
                    console.log('📴 Offline - sirviendo index.html desde caché');
                    return caches.match(request);
                })
        );
        return;
    }

    // ============================================================
    // Estrategia 2: CACHE-FIRST para recursos estáticos
    // (iconos, manifest, fuentes) - más rápido
    // ============================================================
    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    // Actualiza el caché en segundo plano (stale-while-revalidate)
                    fetch(request).then((networkResponse) => {
                        if (networkResponse && networkResponse.ok) {
                            caches.open(CACHE_NAME).then((cache) => {
                                cache.put(request, networkResponse);
                            });
                        }
                    }).catch(() => {});
                    return cachedResponse;
                }

                // No está en caché: búscalo en la red y guárdalo
                return fetch(request).then((response) => {
                    // No cachear respuestas que no sean OK
                    if (!response || response.status !== 200 || response.type === 'opaque') {
                        return response;
                    }
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseClone);
                    });
                    return response;
                });
            })
            .catch(() => {
                // Si todo falla y es una navegación, devuelve el index cacheado
                if (request.mode === 'navigate') {
                    return caches.match('/index.html');
                }
            })
    );
});

// ============================================================
// MENSAJES desde la app
// ============================================================
self.addEventListener('message', (event) => {
    if (event.data && event.data.tipo === 'SKIP_WAITING') {
        console.log('⏭️ Saltando espera del Service Worker');
        self.skipWaiting();
    }
    if (event.data && event.data.tipo === 'OBTENER_VERSION') {
        event.ports[0].postMessage({ version: CACHE_VERSION });
    }
});

console.log('🚀 Mia - Service Worker cargado | Versión:', CACHE_VERSION);
