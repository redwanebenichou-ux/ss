const CACHE='livesight-v1';
const CORE=[
  './',
  './login.html',
  './app.html',
  './admin.html',
  './manifest.json',
  './assets/css/styles.css',
  './assets/img/logo.png',
  './assets/icons/logo-192.png',
  './assets/icons/logo-512.png',
  './assets/js/i18n.js',
  './assets/js/data.js',
  './assets/js/auth.js',
  './assets/js/router.js',
  './assets/js/maps.js',
  './assets/js/qr.js',
  './assets/js/csv.js',
  './assets/js/common.js',
  './assets/js/app.js',
  './assets/js/admin.js'
];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const url=new URL(e.request.url);
  if(e.request.method!=='GET'||url.origin!==location.origin) return;
  if(url.pathname.endsWith('manifest.json')) return;
  e.respondWith(
    caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{
      const copy=res.clone();
      if(url.pathname.includes('/assets/')){ caches.open(CACHE).then(c=>c.put(e.request,copy)); }
      return res;
    }).catch(()=>caches.match('./login.html')))
  );
});