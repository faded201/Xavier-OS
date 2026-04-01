'use strict';

// Cache versioning
const CACHE_NAME = 'v1';
const ASSET_URLS = [
    '/',
    '/index.html',
    '/style.css',
    '/app.js',
    '/images/logo.png', // Add other assets as needed
];

// Install event
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSET_URLS);
        })
    );
});

// Fetch event
self.addEventListener('fetch', (event) => {
    if (event.request.url.includes('/api/')) {
        // Network-first strategy for API calls
        event.respondWith(
            fetch(event.request).catch(() => {
                return caches.match(event.request);
            })
        );
    } else {
        // Cache-first strategy for assets
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request);
            })
        );
    }
});

// Activate event
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((name) => {
                    if (name !== CACHE_NAME) {
                        return caches.delete(name);
                    }
                })
            );
        })
    );
});
