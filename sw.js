const C='bkk-v2';
self.addEventListener('install',()=>{self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
// 有網路就永遠拿最新版；網路太慢（3.5 秒）或離線才用手機裡的備份
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  const net=fetch(req).then(r=>{if(r&&(r.ok||r.type==='opaque')){const cp=r.clone();caches.open(C).then(c=>c.put(req,cp))}return r});
  const slow=new Promise(res=>setTimeout(res,3500,null));
  e.respondWith(Promise.race([net.catch(()=>null),slow]).then(r=>r||caches.match(req).then(h=>h||caches.match('./index.html')).then(h=>h||net)));
});
