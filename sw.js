const CACHE_NAME = 'ipos-pwa-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.css',
  '/HQ_admin.html',
  '/index_saas.html',
  '/admin_saas.html',
  '/kds_saas.html',
  '/icon.svg',
  '/manifest.json'
];

// 安裝時快取核心資源
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// 啟動時清理舊快取
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// 請求攔截：Network-First (Fallback to Cache)
self.addEventListener('fetch', event => {
  // 只攔截 GET 請求
  if (event.request.method !== 'GET') return;
  
  // Firestore / Firebase API 請求交由它自己的離線機制處理，SW 不攔截
  if (event.request.url.includes('firestore.googleapis.com') || event.request.url.includes('firebase')) {
      return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // 放進快取更新
        const resClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
           // 只緩存 http / https 資源，避免 chrome-extension 報錯
           if(event.request.url.startsWith('http')) {
               cache.put(event.request, resClone);
           }
        });
        return response;
      })
      .catch(() => {
        // 斷網時從快取抓取
        return caches.match(event.request).then(res => {
            return res || new Response('Offline Content Not Available', { status: 503, statusText: 'Service Unavailable' });
        });
      })
  );
});
