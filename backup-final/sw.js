// The Stove Specialist - Service Worker
// Advanced caching strategies and offline functionality

const CACHE_NAME = 'stove-specialist-v1.0.0';
const STATIC_CACHE = 'stove-specialist-static-v1';
const DYNAMIC_CACHE = 'stove-specialist-dynamic-v1';
const IMAGE_CACHE = 'stove-specialist-images-v1';

// Files to cache immediately
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/assets/css/styles.css',
    '/assets/js/main.js',
    '/assets/js/animations.js',
    '/manifest.json',
    // External resources
    'https://cdn.tailwindcss.com',
    'https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@400;600;700&family=Lobster&display=swap'
];

// Network-first resources
const NETWORK_FIRST = [
    '/api/',
    '/booking/',
    '/contact/'
];

// Cache-first resources (images, fonts)
const CACHE_FIRST = [
    '/assets/images/',
    'https://fonts.gstatic.com/',
    'https://fonts.googleapis.com/'
];

// Install event - cache static assets
self.addEventListener('install', event => {
    console.log('[SW] Installing Service Worker');
    
    event.waitUntil(
        caches.open(STATIC_CACHE).then(cache => {
            console.log('[SW] Caching static assets');
            return cache.addAll(STATIC_ASSETS);
        }).then(() => {
            return self.skipWaiting();
        })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('[SW] Activating Service Worker');
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== STATIC_CACHE && 
                        cacheName !== DYNAMIC_CACHE && 
                        cacheName !== IMAGE_CACHE) {
                        console.log('[SW] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            return self.clients.claim();
        })
    );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // Skip chrome-extension and non-http requests
    if (!request.url.startsWith('http')) return;

    // Handle different types of requests
    if (isImage(request.url)) {
        event.respondWith(handleImageRequest(request));
    } else if (isStaticAsset(request.url)) {
        event.respondWith(handleStaticAsset(request));
    } else if (isNetworkFirst(request.url)) {
        event.respondWith(handleNetworkFirst(request));
    } else {
        event.respondWith(handleDefault(request));
    }
});

// Handle image requests with cache-first strategy
async function handleImageRequest(request) {
    try {
        const cache = await caches.open(IMAGE_CACHE);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        
        if (networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.log('[SW] Image request failed:', error);
        return new Response('Image not available', { 
            status: 200,
            statusText: 'OK',
            headers: { 'Content-Type': 'text/plain' }
        });
    }
}

// Handle static assets with cache-first strategy
async function handleStaticAsset(request) {
    try {
        const cache = await caches.open(STATIC_CACHE);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            // Update cache in background
            fetch(request).then(response => {
                if (response.status === 200) {
                    cache.put(request, response);
                }
            }).catch(() => {});
            
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        
        if (networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.log('[SW] Static asset request failed:', error);
        return getOfflinePage();
    }
}

// Handle network-first requests (API, dynamic content)
async function handleNetworkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.status === 200) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.log('[SW] Network request failed, trying cache:', error);
        
        const cache = await caches.open(DYNAMIC_CACHE);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        return getOfflinePage();
    }
}

// Default handling strategy
async function handleDefault(request) {
    try {
        // Try network first
        const networkResponse = await fetch(request);
        
        if (networkResponse.status === 200) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        // Fallback to cache
        const cache = await caches.open(DYNAMIC_CACHE);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Final fallback
        return getOfflinePage();
    }
}

// Utility functions
function isImage(url) {
    return /\.(jpg|jpeg|png|gif|webp|svg|ico)$/i.test(url);
}

function isStaticAsset(url) {
    return CACHE_FIRST.some(pattern => url.includes(pattern)) ||
           /\.(css|js|woff|woff2|ttf|eot)$/i.test(url);
}

function isNetworkFirst(url) {
    return NETWORK_FIRST.some(pattern => url.includes(pattern));
}

// Create offline fallback page
function getOfflinePage() {
    return new Response(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Offline - The Stove Specialist</title>
            <style>
                body {
                    font-family: 'Inter', sans-serif;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    text-align: center;
                    padding: 2rem;
                    margin: 0;
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }
                .container {
                    max-width: 500px;
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 20px;
                    padding: 3rem;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                }
                h1 {
                    font-size: 2.5rem;
                    margin-bottom: 1rem;
                    font-family: 'Lobster', cursive;
                }
                p {
                    font-size: 1.2rem;
                    margin-bottom: 2rem;
                    opacity: 0.9;
                }
                .icon {
                    font-size: 4rem;
                    margin-bottom: 2rem;
                }
                .retry-btn {
                    background: #f59e0b;
                    color: white;
                    border: none;
                    padding: 1rem 2rem;
                    border-radius: 50px;
                    font-size: 1.1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .retry-btn:hover {
                    background: #d97706;
                    transform: translateY(-2px);
                }
                .contact-info {
                    margin-top: 2rem;
                    padding-top: 2rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.2);
                }
                .phone {
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: #fbbf24;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="icon">📵</div>
                <h1>You're Offline</h1>
                <p>It looks like you're not connected to the internet. Don't worry, you can still contact us!</p>
                
                <button class="retry-btn" onclick="window.location.reload()">
                    Try Again
                </button>
                
                <div class="contact-info">
                    <p>For immediate service, call us:</p>
                    <div class="phone">📞 02 9365 2508</div>
                </div>
            </div>
        </body>
        </html>
    `, {
        headers: {
            'Content-Type': 'text/html'
        }
    });
}

// Background sync for form submissions
self.addEventListener('sync', event => {
    if (event.tag === 'background-booking') {
        event.waitUntil(syncBookings());
    }
});

// Handle background booking sync
async function syncBookings() {
    try {
        const bookings = await getStoredBookings();
        
        for (const booking of bookings) {
            try {
                const response = await fetch('/api/bookings', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(booking.data)
                });
                
                if (response.ok) {
                    await removeStoredBooking(booking.id);
                }
            } catch (error) {
                console.log('[SW] Failed to sync booking:', error);
            }
        }
    } catch (error) {
        console.log('[SW] Background sync failed:', error);
    }
}

// IndexedDB operations for offline storage
async function getStoredBookings() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('StoveSpecialistDB', 1);
        
        request.onerror = () => reject(request.error);
        
        request.onsuccess = () => {
            const db = request.result;
            const transaction = db.transaction(['bookings'], 'readonly');
            const store = transaction.objectStore('bookings');
            const getAllRequest = store.getAll();
            
            getAllRequest.onsuccess = () => resolve(getAllRequest.result);
            getAllRequest.onerror = () => reject(getAllRequest.error);
        };
        
        request.onupgradeneeded = () => {
            const db = request.result;
            const store = db.createObjectStore('bookings', { keyPath: 'id', autoIncrement: true });
            store.createIndex('timestamp', 'timestamp', { unique: false });
        };
    });
}

async function removeStoredBooking(id) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('StoveSpecialistDB', 1);
        
        request.onsuccess = () => {
            const db = request.result;
            const transaction = db.transaction(['bookings'], 'readwrite');
            const store = transaction.objectStore('bookings');
            const deleteRequest = store.delete(id);
            
            deleteRequest.onsuccess = () => resolve();
            deleteRequest.onerror = () => reject(deleteRequest.error);
        };
    });
}

// Push notification handling
self.addEventListener('push', event => {
    if (event.data) {
        const data = event.data.json();
        
        const options = {
            body: data.body,
            icon: '/assets/images/icon-192.png',
            badge: '/assets/images/badge-72.png',
            vibrate: [100, 50, 100],
            data: data.data,
            actions: [
                {
                    action: 'view',
                    title: 'View Details'
                },
                {
                    action: 'dismiss',
                    title: 'Dismiss'
                }
            ]
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

// Notification click handling
self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    if (event.action === 'view') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Periodic background sync
self.addEventListener('periodicsync', event => {
    if (event.tag === 'content-sync') {
        event.waitUntil(syncContent());
    }
});

async function syncContent() {
    try {
        // Update cached content in background
        const cache = await caches.open(DYNAMIC_CACHE);
        
        const urlsToUpdate = [
            '/',
            '/api/services',
            '/api/testimonials'
        ];
        
        for (const url of urlsToUpdate) {
            try {
                const response = await fetch(url);
                if (response.ok) {
                    cache.put(url, response);
                }
            } catch (error) {
                console.log('[SW] Failed to sync content for:', url, error);
            }
        }
    } catch (error) {
        console.log('[SW] Periodic sync failed:', error);
    }
}

// Cache management - limit cache sizes
const CACHE_LIMITS = {
    [STATIC_CACHE]: 50,
    [DYNAMIC_CACHE]: 100,
    [IMAGE_CACHE]: 200
};

async function limitCacheSize(cacheName, maxItems) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    
    if (keys.length > maxItems) {
        const keysToDelete = keys.slice(0, keys.length - maxItems);
        
        for (const key of keysToDelete) {
            await cache.delete(key);
        }
    }
}

// Run cache cleanup periodically
setInterval(() => {
    Object.entries(CACHE_LIMITS).forEach(([cacheName, limit]) => {
        limitCacheSize(cacheName, limit);
    });
}, 300000); // Every 5 minutes

// Service worker update handling
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

console.log('[SW] Service Worker loaded successfully');