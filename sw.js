const CACHE_NAME='anti-sleep-v2-shell-v4';
const APP_SHELL=['./','./index.html','./manifest.json','./i18n.js','./favicon.png','./icons/favicon.png','./Algeria%20Heart%20Flag.png'];

async function cacheShellSafely(){
  const cache=await caches.open(CACHE_NAME);
  await Promise.all(APP_SHELL.map(async url=>{
    try{
      const response=await fetch(new Request(url,{cache:'no-cache'}));
      if(response.ok) await cache.put(url,response);
    }catch(error){
      console.warn('Service Worker: skipped cache item',url,error);
    }
  }));
}

self.addEventListener('install',event=>{
  event.waitUntil(cacheShellSafely().then(()=>self.skipWaiting()));
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET') return;
  const url=new URL(req.url);
  if(url.pathname.startsWith('/api/')) return;
  if(url.origin!==self.location.origin) return;

  event.respondWith(
    caches.match(req).then(cached=>
      cached || fetch(req).then(res=>{
        if(res && res.ok){
          const copy=res.clone();
          caches.open(CACHE_NAME).then(cache=>cache.put(req,copy)).catch(()=>{});
        }
        return res;
      }).catch(()=>cached || new Response('',{status:503,statusText:'Offline'}))
    )
  );
});
