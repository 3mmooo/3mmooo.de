// Service Worker: macht 3mmooo.de installierbar und offline startfähig.
// Strategie: immer zuerst das Netz (damit Updates sofort ankommen), bei Offline der Cache.
const CACHE = '3mmooo-v1';
const CORE = [
  './',
  'index.html',
  'css/style.css',
  'js/main.js',
  'js/ui.js',
  'js/content.js',
  'js/shaders.js',
  'js/sound.js',
  'js/texture-worker.js',
  'lib/three/build/three.module.min.js',
  'lib/three/addons/controls/OrbitControls.js',
  'lib/three/addons/renderers/CSS2DRenderer.js',
  'lib/three/addons/postprocessing/EffectComposer.js',
  'lib/three/addons/postprocessing/RenderPass.js',
  'lib/three/addons/postprocessing/UnrealBloomPass.js',
  'lib/three/addons/postprocessing/OutputPass.js',
  'lib/three/addons/postprocessing/ShaderPass.js',
  'lib/three/addons/postprocessing/MaskPass.js',
  'lib/three/addons/postprocessing/Pass.js',
  'lib/three/addons/shaders/CopyShader.js',
  'lib/three/addons/shaders/LuminosityHighPassShader.js',
  'lib/three/addons/shaders/OutputShader.js',
  'favicon.svg',
  'manifest.webmanifest',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'hack.html',
  'snake.html',
  'nettools.html',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => Promise.all(CORE.map((url) => cache.add(url).catch(() => {}))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);
  // nur eigene Dateien, nur GET – externe Anfragen (z. B. DNS-Abfragen der NetTools) laufen normal
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;
  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req, { ignoreSearch: true }).then((hit) => hit || caches.match('index.html'))),
  );
});
