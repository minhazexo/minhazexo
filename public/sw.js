const CACHE = 'mehrab-portfolio-v1'
const PRECACHE_URLS = [
  '/',
  '/manifest.json',
  '/favicon_io/favicon.ico',
]

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(PRECACHE_URLS))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (e) => {
  const clearOld = caches.keys().then((keys) =>
    Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
  )
  e.waitUntil(clearOld)
  e.waitUntil(clients.claim())
})

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return
  e.respondWith(
    caches.match(e.request).then((r) => {
      const fetchPromise = fetch(e.request).then((res) => {
        if (res.ok) {
          const cache = caches.open(CACHE)
          cache.then((c) => c.put(e.request, res.clone()))
        }
        return res
      }).catch(() => caches.match('/') as Promise<Response>)
      return r || fetchPromise
    })
  )
})
