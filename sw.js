const APP_CACHE_NAME = 'isr-asistente-cache-app-v1';
const VIDEO_CACHE_NAME = 'isr-asistente-cache-video-v1';

// Assets de la App (esenciales, se cachean al instalar)
const APP_ASSETS_TO_CACHE = [
  '/',
  'index.html',
  'manifest.json',
  'mallampati.jpg', // Añadida la imagen de Mallampati al caché
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
];

// Assets de Video (opcionales, se cachean bajo demanda)
const VIDEO_ASSET = 'guia_intubacion.mp4';


// Evento de Instalación: Guarda los assets ESENCIALES de la app.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(APP_CACHE_NAME)
      .then(cache => {
        console.log('Cache de App abierto: Guardando assets principales');
        return cache.addAll(APP_ASSETS_TO_CACHE);
      })
  );
});

// Evento de Activación: Limpia cachés antiguos
self.addEventListener('activate', event => {
  const cacheWhitelist = [APP_CACHE_NAME, VIDEO_CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Limpiando caché antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Evento de Fetch: Sirve desde el caché primero
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si el archivo está en caché, lo sirve desde allí.
        if (response) {
          return response;
        }
        // Si no, lo busca en la red (para assets no cacheados, ej. plugins de tailwind)
        return fetch(event.request);
      })
  );
});
