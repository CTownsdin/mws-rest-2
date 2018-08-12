var CACHE_NAME = 'restaurant-stage-1'
var urlsToCache = [
  '/',
  // '/styles/main.css',
  // '/script/main.js'
]

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME)
    .then(cache => cache.addAll(urlsToCache))
    .catch(err => console.error(`Some error caching: ${err}`))
  )
})

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) return response // if match, respond with match

        // else, cache it for next time
        const fetchRequest = event.request.clone()
        return fetch(event.request).then(response => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response; // basic requests are requests from our origin, if not our origin, do not cache
          }
          const responseToCache = response.clone()
          caches.open(CACHE_NAME)
            .then(cache => cache.put(event.request, responseToCache))
            .catch(err => console.error(`Some error caching: ${err}`))
          return response // finally return response post caching
        })
    })
  )
})
