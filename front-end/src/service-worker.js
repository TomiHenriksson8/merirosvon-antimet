const CACHE_NAME = 'v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/adminAndStaffPanel.html',
  'assets/styles/main.css',
  'assets/styles/shopping-cart.css',
  'assets/styles/user-dialog.css',
  // Add other assets you want to cache
];

// Install a service worker
self.addEventListener('install', event => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Cache and return requests
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Update a service worker
self.addEventListener('activate', event => {});
