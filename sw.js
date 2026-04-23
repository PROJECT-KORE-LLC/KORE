/* PROJECT KORE // SERVICE WORKER v1.0
   IDENT-LOCK: Akasia Moon // Forensic Infrastructure
*/

const CACHE_NAME = 'KORE-V1-SOVEREIGN';

// THE ASSET VAULT: Every file required for full offline functionality.
const ASSETS = [
    'teaser.html',
    'guild.html',
    'covenant.html',
    'archive.html',
    'hearth.html',
    'gallery.html',
    'manifest.json',
    'audio-engine.js',
    'atrium_8k.webp',
    'command_8k.webp',
    'logistics_8k.webp',
    'gallery_8k.webp',
    'Apotheosis.png',
    'waves.mp3',
    'icon_512.jpg'
    // NOTE: Add your other 21 MP3 tracks here if you want them 100% offline.
];

// 1. INSTALL: Forging the local cache on the S9 hardware.
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('KORE // Shielding Assets: Protocol Initiated.');
            return cache.addAll(ASSETS);
        })
    );
    // Force the waiting service worker to become the active service worker.
    self.skipWaiting();
});

// 2. ACTIVATE: Purging legacy data to ensure 8K AAA parity.
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        console.log('KORE // Purging Legacy Cache:', key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    // Ensure the SW takes control of the page immediately.
    return self.clients.claim();
});

// 3. FETCH: The Sovereign Hijack.
// Prioritizes the local vault (cache) over the network for zero-latency.
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // Return from vault OR fetch from network if not vaulted.
            return cachedResponse || fetch(event.request).then((networkResponse) => {
                return networkResponse;
            });
        }).catch(() => {
            // If both fail (Offline + Not in Cache), return a blank state.
            console.error('KORE // Sovereign Shield: Asset not found in vault.');
        })
    );
});
