const CACHE_NAME = 'KORE-V1-SOVEREIGN';
const ASSETS = [
    'guild.html',
    'covenant.html',
    'archive.html',
    'hearth.html',
    'gallery.html',
    'manifest.json',
    'audio-engine.js',
    'atrium_8k.webp',
    'Apotheosis.png',
    'waves.mp3'
    // Add all your mp3s and images here
];

// INSTALL: Forge the Cache
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('KORE // Vaulting Assets...');
            return cache.addAll(ASSETS);
        })
    );
});

// ACTIVATE: Purge Old Data
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) return caches.delete(key);
                })
            );
        })
    );
});

// FETCH: Sovereign Offline Protocol
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
