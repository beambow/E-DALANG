const V = 'wayang-v8', INTI = ["./", "index.html", "manifest.webmanifest", "ikon-192.png", "ikon-512.png", "aset/kelir.jpg", "aset/gunungan.webp", "aset/kertas.jpg", "aset/hutan.jpg", "suara/gamelan.mp3", "aset/th_arjuna.webp", "aset/th_hanoman.webp", "aset/th_rahwana.webp", "aset/th_werkudara.webp", "aset/th_gatotkaca.webp", "aset/th_semar.webp", "aset/th_gunungan.webp", "aset/sil_arjuna.webp", "aset/sil_hanoman.webp", "aset/sil_rahwana.webp", "aset/sil_werkudara.webp", "aset/sil_gatotkaca.webp", "aset/sil_semar.webp", "aset/sil_gunungan.webp", "tokoh/arjuna.json", "tokoh/hanoman.json", "tokoh/rahwana.json", "tokoh/werkudara.json", "tokoh/gatotkaca.json", "tokoh/semar.json"];
self.addEventListener('install', e => e.waitUntil(caches.open(V).then(c => Promise.allSettled(INTI.map(u => c.add(u)))).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())));
async function rentang(r, res){            // dukungan Range untuk audio dari cache
  const b = await res.arrayBuffer(), m = /bytes=(\d*)-(\d*)/.exec(r.headers.get('range')), a = +m[1] || 0, z = m[2] ? +m[2] : b.byteLength - 1;
  return new Response(b.slice(a, z + 1), {status:206, headers:{'Content-Type':res.headers.get('Content-Type') || 'audio/mpeg', 'Content-Range':'bytes ' + a + '-' + z + '/' + b.byteLength}});
}
self.addEventListener('fetch', e => {
  const r = e.request; if(r.method !== 'GET') return; const u = new URL(r.url);
  if(r.mode === 'navigate'){ e.respondWith(fetch(r).then(x => { const c = x.clone(); caches.open(V).then(h => h.put('index.html', c)); return x; }).catch(() => caches.match('index.html'))); return; }
  e.respondWith((async () => {
    const c = await caches.open(V), hit = await c.match(r, {ignoreSearch:true});
    const ambil = () => fetch(u.origin === location.origin && r.headers.has('range') ? new Request(r.url) : r).then(x => { if(x.ok && x.status === 200) c.put(r.url, x.clone()); return x; });
    if(hit) { if(u.origin !== location.origin) ambil().catch(() => {}); return r.headers.has('range') ? rentang(r, hit) : hit; }
    const x = await ambil(); return r.headers.has('range') && x.status === 200 ? rentang(r, x) : x;
  })().catch(() => caches.match('index.html')));
});
