// ============================================================
// SERVICE WORKER - Mia va al Colegio
// Estrategia: Cache-first para assets, network-first para API
// ============================================================

const CACHE_NAME = 'mia-colegio-v2.1';
const CACHE_STATIC = 'mia-static-v2.1';
const CACHE_DYNAMIC = 'mia-dynamic-v2.1';

// Assets que se cachean en la instalación
const ASSETS_ESTATICOS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/privacidad.html',
  '/icon-192.png',
  '/icon-512.png',
  '/musica-fondo.mp3',
  // Iconos principales
  '/iconos/oso.png',
  '/iconos/perro.png',
  '/iconos/gato.png',
  '/iconos/zorro.png',
  '/iconos/koala.png',
  '/iconos/leon.png',
  '/iconos/cohete.png',
  '/iconos/avion.png',
  '/iconos/casa.png',
  '/iconos/sol.png',
  '/iconos/luna.png',
  '/iconos/estrella.png',
  '/iconos/flor.png',
  '/iconos/pelota.png',
  '/iconos/libro.png',
  '/iconos/lapiz.png',
  '/iconos/silla.png',
  '/iconos/mama.png',
  '/iconos/papa.png',
  '/iconos/bebe-persona.png',
  '/iconos/abuelo.png',
  '/iconos/abuela.png',
  '/iconos/pato.png',
  '/iconos/tigre.png',
  '/iconos/pan.png',
  '/iconos/leche.png',
  '/iconos/manzana.png',
  '/iconos/uva.png',
  '/iconos/queso.png',
  '/iconos/arbol.png',
  // Iconos de sílabas
  '/iconos/mesa.png',
  '/iconos/miel.png',
  '/iconos/mono.png',
  '/iconos/musica.png',
  '/iconos/pina.png',
  '/iconos/pollo.png',
  '/iconos/puerta.png',
  '/iconos/loro.png',
  '/iconos/sapo.png',
  '/iconos/semaforo.png',
  '/iconos/submarino.png',
  '/iconos/taza.png',
  '/iconos/telefono.png',
  '/iconos/tomate.png',
  '/iconos/tucan.png',
  // Iconos de S
  '/iconos/sopa.png',
  '/iconos/sandia.png',
  '/iconos/sombrero.png',
  '/iconos/cangrejo.png',
  '/iconos/cancion.png',
  '/iconos/salsa.png',
  '/iconos/isla.png',
  '/iconos/piscina.png',
  '/iconos/vaso.png',
  '/iconos/beso.png',
  '/iconos/autobus.png',
  '/iconos/pez.png',
  '/iconos/nariz.png',
  '/iconos/ajedrez.png',
  '/iconos/delfin.png',
  '/iconos/helado.png',
  '/iconos/raton.png',
  '/iconos/nube.png',
  '/iconos/nandu.png',
  '/iconos/tortuga.png',
  '/iconos/vaca.png',
  '/iconos/regalo.png',
  '/iconos/xilofono.png',
  '/iconos/jirafa.png',
  // Iconos nuevos (sílabas ampliadas)
  '/iconos/naranja.png',
  '/iconos/nino.png',
  '/iconos/dado.png',
  '/iconos/diente.png',
  '/iconos/dormir.png',
  '/iconos/dulce.png',
  '/iconos/ballena.png',
  '/iconos/bicicleta.png',
  '/iconos/boton.png',
  '/iconos/buho.png',
  '/iconos/ventana.png',
  '/iconos/violin.png',
  '/iconos/volcan.png',
  '/iconos/vuelo.png',
  '/iconos/rana.png',
  '/iconos/risa.png',
  '/iconos/rueda.png',
  '/iconos/cebra.png',
  '/iconos/cielo.png',
  '/iconos/conejo.png',
  '/iconos/cuna.png',
  '/iconos/gemelo.png',
  '/iconos/girasol.png',
  '/iconos/gorro.png',
  '/iconos/gusano.png',
  '/iconos/foca.png',
  '/iconos/feria.png',
  '/iconos/fiesta.png',
  '/iconos/foco.png',
  '/iconos/fuego.png',
  '/iconos/jardin.png',
  '/iconos/jefe.png',
  '/iconos/joya.png',
  '/iconos/juguete.png'
];

// ============================================================
// INSTALL - Cachear assets estáticos
// ============================================================
self.addEventListener('install', (event) => {
  console.log('📦 SW: Instalando versión', CACHE_NAME);

  event.waitUntil(
    caches.open(CACHE_STATIC)
      .then((cache) => {
        console.log('📦 SW: Cacheando assets estáticos...');
        // Cachear uno a uno para que un fallo no rompa todo
        return Promise.allSettled(
          ASSETS_ESTATICOS.map(url =>
            cache.add(url).catch(err => {
              console.warn('⚠️ SW: No se pudo cachear', url, err.message);
            })
          )
        );
      })
      .then(() => {
        console.log('✅ SW: Assets cacheados');
        return self.skipWaiting();
      })
  );
});

// ============================================================
// ACTIVATE - Limpiar caches antiguos
// ============================================================
self.addEventListener('activate', (event) => {
  console.log('🔄 SW: Activando', CACHE_NAME);

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_STATIC && name !== CACHE_DYNAMIC)
            .map((name) => {
              console.log('🗑️ SW: Eliminando cache antiguo:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        console.log('✅ SW: Activado y limpio');
        return self.clients.claim();
      })
  );
});

// ============================================================
// FETCH - Estrategias de cache
// ============================================================
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorar métodos que no sean GET
  if (request.method !== 'GET') return;

  // Ignorar extensiones de navegador
  if (url.protocol === 'chrome-extension:' || url.protocol === 'moz-extension:') return;

  // ============================================================
  // Estrategia 1: API del backend → Network-first
  // ============================================================
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cachear respuesta exitosa por si acaso
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_DYNAMIC).then(cache => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => {
          // Si falla la red, buscar en cache
          return caches.match(request).then(cached => {
            if (cached) {
              console.log('📡 SW: Sirviendo API desde cache');
              return cached;
            }
            // Devolver error JSON
            return new Response(JSON.stringify({ exito: false, offline: true }), {
              status: 503,
              headers: { 'Content-Type': 'application/json' }
            });
          });
        })
    );
    return;
  }

  // ============================================================
  // Estrategia 2: Google Fonts → Cache-first (larga duración)
  // ============================================================
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request).then(response => {
          const clone = response.clone();
          caches.open(CACHE_DYNAMIC).then(cache => cache.put(request, clone));
          return response;
        }).catch(() => cached);
      })
    );
    return;
  }

  // ============================================================
  // Estrategia 3: Backend externo → Network-only
  // ============================================================
  if (url.hostname.includes('workers.dev') || url.hostname.includes('cloudflare')) {
    event.respondWith(fetch(request).catch(() => new Response('', { status: 503 })));
    return;
  }

  // ============================================================
  // Estrategia 4: Assets locales → Cache-first con fallback
  // ============================================================
  event.respondWith(
    caches.match(request)
      .then((cached) => {
        if (cached) {
          // Devolver cache y actualizar en background (stale-while-revalidate)
          const fetchPromise = fetch(request)
            .then((response) => {
              if (response && response.status === 200) {
                const clone = response.clone();
                caches.open(CACHE_STATIC).then(cache => cache.put(request, clone));
              }
              return response;
            })
            .catch(() => null);
          return cached;
        }

        // No está en cache → buscar en red
        return fetch(request)
          .then((response) => {
            // Cachear si es un asset válido
            if (response && response.status === 200 && response.type === 'basic') {
              const clone = response.clone();
              caches.open(CACHE_DYNAMIC).then(cache => cache.put(request, clone));
            }
            return response;
          })
          .catch((err) => {
            console.warn('⚠️ SW: Fallo fetch', request.url, err.message);

            // Si es una navegación, servir el index cacheado
            if (request.mode === 'navigate') {
              return caches.match('/index.html');
            }

            // Si es un icono, devolver placeholder
            if (request.destination === 'image') {
              return caches.match('/icon-192.png');
            }

            // Si es audio, devolver silencio
            if (request.destination === 'audio') {
              return new Response('', { status: 204 });
            }

            return new Response('Offline', { status: 503 });
          });
      })
  );
});

// ============================================================
// MENSAJES DEL CLIENTE
// ============================================================
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then(names => {
      Promise.all(names.map(name => caches.delete(name)))
        .then(() => console.log('🗑️ SW: Todos los caches eliminados'));
    });
  }
});

// ============================================================
// SYNC EN BACKGROUND (opcional)
// ============================================================
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-progreso') {
    console.log('🔄 SW: Sincronizando progreso en background');
    // Aquí podrías sincronizar con el backend cuando vuelva la conexión
  }
});

console.log('🚀 SW: Mia va al Colegio cargado');
