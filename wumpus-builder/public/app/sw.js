const CACHE='wumpus-builder-v1-'+new URL(self.registration.scope).pathname;
const FILES=['./','index.html','styles.css','config.js','program.js','engine.js','app.js','manifest.webmanifest','assets/hero.png','assets/avatar.jpeg','assets/banner.jpeg','assets/wumpy.jpg','assets/icon-192.png','assets/icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES))));
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin||new URL(e.request.url).pathname.startsWith('/api/'))return;e.respondWith(fetch(e.request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));}return response;}).catch(()=>caches.match(e.request)));});
