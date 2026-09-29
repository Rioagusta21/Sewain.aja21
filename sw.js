const C='owner-v1',SHELL=['./owner.html','./icon-192.png','./icon-512.png','./manifest-owner.webmanifest'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(SHELL)).catch(()=>{}));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
// Jaringan dulu supaya selalu versi terbaru; cache hanya cadangan saat offline.
// Data Firebase/Firestore tidak pernah di-cache oleh service worker ini.
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==location.origin)return;
  e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));return r;}).catch(()=>caches.match(e.request).then(m=>m||caches.match('./owner.html'))));
});
