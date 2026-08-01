const CACHE = 'mehrab-portfolio-v2'
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

  const url = new URL(e.request.url)

  // Never cache API responses — always fetch fresh data from the network.
  // This keeps admin edits and DB updates visible immediately.
  if (url.pathname.startsWith('/api/')) {
    e.respondWith(fetch(e.request).catch(() => new Response('', { status: 503 })))
    return
  }

  // Same-origin assets only; don't cache cross-origin requests.
  if (url.origin !== self.location.origin) return

  // Cache-first for static assets.
  e.respondWith(
    caches.match(e.request).then((r) => {
      if (r) return r
      return fetch(e.request).then((res) => {
        if (res.ok) {
          const cache = caches.open(CACHE)
          cache.then((c) => c.put(e.request, res.clone()))
        }
        return res
      })
    })
  )
})
