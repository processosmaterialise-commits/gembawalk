// Service worker simples — cacheia o app shell pra abrir rápido/offline.
// Não intercepta chamadas de API (Google Sheets, xlsx CDN) — só o HTML/ícones locais.
var CACHE_NAME = "quadro-cnc-v1";
var ASSETS = ["./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", function(e){
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){ return cache.addAll(ASSETS); })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){ return k!==CACHE_NAME; }).map(function(k){ return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function(e){
  var url = e.request.url;
  // não mexe em chamadas externas (CDN, Google APIs) — só no app shell local
  if(url.indexOf(self.location.origin) !== 0) return;
  e.respondWith(
    caches.match(e.request).then(function(cached){
      return cached || fetch(e.request);
    })
  );
});
