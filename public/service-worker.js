const CACHE_NAME = 'fakestore-pwa-v2';
const RUNTIME_CACHE = 'fakestore-runtime-v2';
const API_CACHE = 'fakestore-api-v2';

const APP_SHELL_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/logo192.png',
  '/logo512.png',
  '/favicon.ico'
];

const API_BASE_URL = 'https://fastapi-endterm.onrender.com';

// Install event - cache app shell
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker v2...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Pre-caching app shell');
        return cache.addAll(APP_SHELL_FILES).catch((error) => {
          console.warn('[SW] Some app shell files failed to cache:', error);
        });
      })
      .then(() => {
        console.log('[SW] App shell cached successfully');
        return self.skipWaiting(); // Activate immediately
      })
      .catch((error) => {
        console.error('[SW] Install failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker v2...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && 
              cacheName !== RUNTIME_CACHE && 
              cacheName !== API_CACHE) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      console.log('[SW] Service worker activated');
      return self.clients.claim(); // Take control of all pages immediately
    })
  );
});

// Helper functions
function isAPIRequest(url) {
  return url.origin === API_BASE_URL || url.href.includes(API_BASE_URL);
}

function isStaticAsset(url) {
  return url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/);
}

function shouldCache(request) {
  const url = new URL(request.url);
  // Don't cache POST, PUT, DELETE requests
  if (request.method !== 'GET') {
    return false;
  }
  // Don't cache service worker itself
  if (url.pathname.includes('/service-worker.js')) {
    return false;
  }
  // Don't cache Firebase/Firestore requests
  if (url.origin.includes('firebase') || url.origin.includes('googleapis')) {
    return false;
  }
  return true;
}

// Network first strategy for API calls
async function networkFirstWithCache(request, cacheName) {
  const cache = await caches.open(cacheName);
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      // Cache successful responses
      const responseClone = response.clone();
      cache.put(request, responseClone);
    }
    return response;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    // Return offline response for API calls
    if (isAPIRequest(new URL(request.url))) {
      return new Response(
        JSON.stringify({ 
          error: 'Offline',
          message: 'You are offline. Showing cached data if available.',
          offline: true
        }),
        {
          headers: { 'Content-Type': 'application/json' },
          status: 503,
          statusText: 'Service Unavailable'
        }
      );
    }
    throw error;
  }
}

// Cache first strategy for static assets
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error('[SW] Failed to fetch:', request.url, error);
    // Return a basic offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/index.html') || new Response('Offline', {
        headers: { 'Content-Type': 'text/html' }
      });
    }
    throw error;
  }
}

// Stale while revalidate for product listings
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => {
    return cachedResponse || new Response(
      JSON.stringify({ error: 'Offline', offline: true }),
      { headers: { 'Content-Type': 'application/json' }, status: 503 }
    );
  });
  
  return cachedResponse || fetchPromise;
}

// Fetch event handler
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  if (!shouldCache(request)) {
    return;
  }
  
  // Handle navigation requests (page loads)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful navigation
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          console.log('[SW] Navigation failed, serving cached index.html');
          return caches.match('/index.html') || caches.match('/');
        })
    );
    return;
  }
  
  // Handle API requests
  if (isAPIRequest(url)) {
    // Use network first for API calls, fallback to cache
    event.respondWith(
      networkFirstWithCache(request, API_CACHE)
    );
    return;
  }
  
  // Handle static assets (JS, CSS, images)
  if (isStaticAsset(url) && url.origin === self.location.origin) {
    event.respondWith(
      cacheFirst(request, CACHE_NAME)
    );
    return;
  }
  
  // Handle other same-origin requests
  if (url.origin === self.location.origin) {
    event.respondWith(
      staleWhileRevalidate(request, RUNTIME_CACHE)
    );
    return;
  }
});

// Message handler for cache management
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.delete(CACHE_NAME);
    caches.delete(RUNTIME_CACHE);
    caches.delete(API_CACHE);
  }
});

// Push event handler for push notifications
self.addEventListener('push', (event) => {
  console.log('[SW] Push event received');
  
  let notificationData = {
    title: 'New Update',
    body: 'You have a new notification',
    icon: '/logo192.png',
    badge: '/logo192.png',
  };
  
  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = {
        title: data.title || notificationData.title,
        body: data.body || notificationData.body,
        icon: data.icon || notificationData.icon,
        badge: data.badge || notificationData.badge,
        tag: data.tag,
        data: data.data,
        requireInteraction: data.requireInteraction || false,
      };
    } catch (e) {
      notificationData.body = event.data.text() || notificationData.body;
    }
  }
  
  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      tag: notificationData.tag,
      data: notificationData.data,
      requireInteraction: notificationData.requireInteraction,
      vibrate: [200, 100, 200],
    })
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.notification.tag);
  
  event.notification.close();
  
  const notificationData = event.notification.data || {};
  
  // Handle different notification types
  if (notificationData.type === 'cart-add') {
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        // Focus existing window or open new one
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url === '/' || client.url.includes('/cart')) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/cart');
        }
      })
    );
  } else if (notificationData.type === 'checkout') {
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url.includes('/cart')) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/cart');
        }
      })
    );
  } else {
    // Default: focus or open the app
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        if (clientList.length > 0) {
          return clientList[0].focus();
        }
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  }
});

// Notification close handler
self.addEventListener('notificationclose', (event) => {
  console.log('[SW] Notification closed:', event.notification.tag);
});

