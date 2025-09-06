// public/sw.js - Service Worker for Nederlandse Bond der Croquet PWA
const CACHE_NAME = 'nbdc-v1.0.0';
const STATIC_CACHE_NAME = 'nbdc-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'nbdc-dynamic-v1.0.0';

// Resources to cache immediately
const STATIC_ASSETS = [
  '/',
  '/rules',
  '/tournaments',
  '/championships',
  '/newsletter',
  '/members',
  '/login',
  '/_next/static/css/app.css',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/manifest.json'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets...');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Failed to cache static assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Service worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle API requests differently
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle static assets and pages
  event.respondWith(handleStaticRequest(request));
});

// Handle API requests - network first, cache fallback
async function handleApiRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Try network first for API calls
    const networkResponse = await fetch(request);
    
    // Cache successful responses (except auth endpoints)
    if (networkResponse.ok && !url.pathname.includes('/auth/')) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed for API request:', url.pathname);
    
    // Try to serve from cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log('[SW] Serving API request from cache:', url.pathname);
      return cachedResponse;
    }
    
    // Return offline fallback for specific endpoints
    if (url.pathname.includes('/rules')) {
      return new Response(
        JSON.stringify({
          message: 'Rules available offline soon',
          offline: true
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    throw error;
  }
}

// Handle static requests - cache first, network fallback
async function handleStaticRequest(request) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log('[SW] Serving from cache:', request.url);
      return cachedResponse;
    }
    
    // Fallback to network
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed for static request:', request.url);
    
    // Serve offline fallback page
    if (request.destination === 'document') {
      const offlineResponse = await caches.match('/');
      if (offlineResponse) {
        return offlineResponse;
      }
    }
    
    throw error;
  }
}

// Background sync for offline form submissions
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'tournament-registration') {
    event.waitUntil(syncTournamentRegistrations());
  }
  
  if (event.tag === 'member-update') {
    event.waitUntil(syncMemberUpdates());
  }
});

// Sync tournament registrations when back online
async function syncTournamentRegistrations() {
  try {
    const requests = await getStoredRequests('tournament-registration');
    
    for (const request of requests) {
      try {
        await fetch('/api/tournaments/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(request.data)
        });
        
        // Remove successful request from storage
        await removeStoredRequest('tournament-registration', request.id);
        
        // Notify user of successful sync
        self.registration.showNotification('Registration Confirmed', {
          body: `Your tournament registration has been confirmed.`,
          icon: '/icons/icon-192x192.png',
          badge: '/icons/badge-72x72.png',
          tag: 'tournament-success'
        });
      } catch (error) {
        console.error('[SW] Failed to sync tournament registration:', error);
      }
    }
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

// Sync member updates when back online
async function syncMemberUpdates() {
  try {
    const requests = await getStoredRequests('member-update');
    
    for (const request of requests) {
      try {
        await fetch(`/api/members/${request.memberId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(request.data)
        });
        
        await removeStoredRequest('member-update', request.id);
      } catch (error) {
        console.error('[SW] Failed to sync member update:', error);
      }
    }
  } catch (error) {
    console.error('[SW] Member sync failed:', error);
  }
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  const options = {
    body: 'You have new updates from Nederlandse Bond der Croquet',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Updates',
        icon: '/icons/action-view.png'
      },
      {
        action: 'close',
        title: 'Dismiss',
        icon: '/icons/action-close.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('NBdC Update', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Helper functions for offline storage
async function getStoredRequests(type) {
  // Implementation depends on your IndexedDB setup
  return [];
}

async function removeStoredRequest(type, id) {
  // Implementation depends on your IndexedDB setup
  console.log(`[SW] Removed stored request: ${type}:${id}`);
}