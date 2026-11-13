// 有谱 Prepo v0.1.3 —— 缓存名带 prepo-shell- 前缀，只清理自己的旧缓存
const PFX='prepo-shell-',CACHE=PFX+'v0.1.3';
const FILES=['./','index.html','manifest.webmanifest','icon-180.png','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.indexOf(PFX)===0&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
 // 网络优先，离线时只在自己的缓存里找（不用全局 caches.match）
 e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp));return res}).catch(()=>caches.open(CACHE).then(c=>c.match(r,{ignoreSearch:true}))))});