const CACHE_NAME = 'KORE_Sovereign_Shield_v2';

const ASSETS = [
    // --- CORE MAINframe ---
    './',
    'index.html',
    'teaser.html',
    'guild.html',
    'covenant.html',
    'archive.html',
    'hearth.html',
    'gallery.html',
    'manifest.json',
    'audio-engine.js',
    'kore-logo.png',

    // --- VISUAL RENDER ARRAY (WebP) ---
    'atrium_8k.webp',
    'command_8k.webp',
    'logistics_8k.webp',
    'gallery_8k.webp',

    // --- THE RESONANCE ARRAY (Audio) ---
    'waves.mp3',
    'rain.mp3',
    'thunder.mp3',
    'winterwind.mp3',
    'owls.mp3',
    'raven.mp3',
    'frogs.mp3',
    'crickets.mp3',
    'fire.mp3',
    'simmeringpot.mp3',
    'teacup.mp3',
    'clock.mp3',
    'cat.mp3',
    'windchimes.mp3',
    'musicbox1.mp3',
    'musicbox2.mp3',
    'musicbox3.mp3',
    'xmasmusicbox1.mp3',
    'xmasmusicbox2.mp3',
    'xmasmusicbox3.mp3',
    'darkmusic1.mp3',
    'binarymusicbox.mp3'
];

// Installation: Vaulting the Assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('KORE // Shielding the Resonance Array...');
            return cache.addAll(ASSETS);
        })
    );
    self.skipWaiting();
});

// Activation: Purging Old Ghost Data
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('KORE // Purging Stale Transmission:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch: Serving from the Vault (Offline Mode)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
