console.log("Service worker loaded")
    self.addEventListener('install',function(event){
        console.log("installed")
        event.waitUntil(
            caches.open('pages-cache-v1').then(function(cache){
                return cache.addAll([
                    'logo144.png',
                    'index.html',
                    'mainkot_manifest.json',
                    'client.js',
                    'worker.js',
                    '/'
                ])
            })
        )
    })
self.addEventListener('push', e => {
    const data = e.data.json();
    console.log('Push Received');
    self.registration.showNotification(data.title, {
        body : data.body,
        icon : 'https://img.icons8.com/color/50/000000/appointment-reminders.png',
        vibrate : [200, 100, 200, 100, 200, 100, 200]
    })
})

self.addEventListener('fetch', event =>{
      console.log('Fetch event for ', event.request.url);
  event.respondWith(
    caches.match(event.request)
    .then(response => {
      if (response) {
        console.log('Found ', event.request.url, ' in cache');
        return response;
      }
      console.log('Network request for ', event.request.url);
      return fetch(event.request)

      // TODO 4 - Add fetched files to the cache

    }).catch(error => {

      // TODO 6 - Respond with custom offline page

    })
  );
})

