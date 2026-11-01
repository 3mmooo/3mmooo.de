// 3mmooo.de – interaktives Sonnensystem
// Übersicht wie der iPhone-Sperrbildschirm, Klick auf einen Planeten zoomt heran.

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { SUN, PLANETS } from './content.js';
import { createUI } from './ui.js';
import { createSound } from './sound.js';
import { createEggs, EGG_DATES } from './eggs.js';
import { sunVertex, sunFragment, atmoVertex, atmoFragment, ringVertex, ringFragment, starVertex, starFragment } from './shaders.js';

const ORDER = [SUN, ...PLANETS];
const VISIBLE_ORDER = ORDER.filter((c) => !c.hidden);   // Pluto bleibt versteckt
const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const UP = new THREE.Vector3(0, 1, 0);
const SYSTEM_RADIUS = 86;
const EARTH_YEAR_SECONDS = 120;              // ein Erdjahr = 2 Minuten in der Übersicht
const SIM_DAYS_PER_SECOND = 365.25 / EARTH_YEAR_SECONDS;
const START_AZ = THREE.MathUtils.degToRad(-25);    // Blickrichtung der Ausgangsansicht

const sound = createSound();
const ui = createUI({
  order: VISIBLE_ORDER,
  onSelect: (id) => go(id),
  onBack: () => go(null),
  onTravel: (date) => setTravel(date),
  sound,
});
const eggs = createEggs({ toast: (t) => ui.toast(t), getLang: () => ui.lang });

// Für Neugierige, die die Konsole öffnen
console.log('%c3mmooo.de%c\nHallo Entwickler:in! 👾 Hier gibt es ein paar Easter Eggs.\nTipps: Fang einen Kometen. Kennst du den Konami-Code? Und tipp mal „pluto“.',
  'font: 700 22px system-ui; color: #ff6b4a', 'font: 13px system-ui; color: inherit');

// --- Renderer ---------------------------------------------------------------
const canvas = document.getElementById('scene');
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
} catch (err) {
  ui.fallback();
  throw err;
}
const isTouch = matchMedia('(pointer: coarse)').matches;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, isTouch ? 1.75 : 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.05, 8000);

const labelRenderer = new CSS2DRenderer({ element: document.getElementById('labels') });
labelRenderer.setSize(window.innerWidth, window.innerHeight);

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.6, 0.55, 0.9);
composer.addPass(bloom);
composer.addPass(new OutputPass());

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.enablePan = true;
controls.screenSpacePanning = true;
controls.rotateSpeed = 0.6;
controls.zoomSpeed = 0.8;
controls.autoRotateSpeed = 0.18;

// --- Licht ------------------------------------------------------------------
scene.add(new THREE.AmbientLight(0xffffff, 0.22));
const sunLight = new THREE.PointLight(0xfff1dc, 4.2, 0, 0);
scene.add(sunLight);

// --- Sterne -----------------------------------------------------------------
function createStars() {
  const count = 9000;
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const size = new Float32Array(count);
  const phase = new Float32Array(count);
  const tint = [new THREE.Color('#ffffff'), new THREE.Color('#cfe0ff'), new THREE.Color('#ffe7c4'), new THREE.Color('#ffd2b0')];
  // Milchstraßen-Band: geneigter Großkreis
  const bandNormal = new THREE.Vector3(0.3, 1, 0.45).normalize();
  const v = new THREE.Vector3();
  for (let i = 0; i < count; i++) {
    const inBand = i < count * 0.45;
    for (;;) {
      v.set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
      const l = v.length();
      if (l > 1 || l < 0.01) continue;
      v.divideScalar(l);
      if (inBand) {
        const d = v.dot(bandNormal);
        if (Math.abs(d) > 0.18 * Math.random() + 0.02) continue;
      }
      break;
    }
    const r = 2500 + Math.random() * 1500;
    pos.set([v.x * r, v.y * r, v.z * r], i * 3);
    const c = tint[Math.floor(Math.random() ** 2 * tint.length)];
    const b = inBand ? 0.35 + Math.random() * 0.5 : 0.45 + Math.random() * 0.75;
    col.set([c.r * b, c.g * b, c.b * b], i * 3);
    size[i] = Math.random() < 0.015 ? 3.2 + Math.random() * 2 : 1.0 + Math.random() ** 3 * 2.2;
    phase[i] = Math.random() * Math.PI * 2;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  geo.setAttribute('size', new THREE.BufferAttribute(size, 1));
  geo.setAttribute('phase', new THREE.BufferAttribute(phase, 1));
  const mat = new THREE.ShaderMaterial({
    uniforms: { time: { value: 0 }, pixelRatio: { value: renderer.getPixelRatio() } },
    vertexShader: starVertex,
    fragmentShader: starFragment,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const points = new THREE.Points(geo, mat);
  points.frustumCulled = false;
  return points;
}
const stars = createStars();
scene.add(stars);

// --- Sonne ------------------------------------------------------------------
const sphereGeo = new THREE.SphereGeometry(1, 96, 64);
const hitGeo = new THREE.SphereGeometry(1, 16, 12);
const hitMat = new THREE.MeshBasicMaterial({ visible: false });

const sunMat = new THREE.ShaderMaterial({
  uniforms: { time: { value: 0 } },
  vertexShader: sunVertex,
  fragmentShader: sunFragment,
});
const sunMesh = new THREE.Mesh(sphereGeo, sunMat);
sunMesh.scale.setScalar(SUN.radius);
const sunGroup = new THREE.Group();
sunGroup.add(sunMesh);
scene.add(sunGroup);

function glowTexture(stops) {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  for (const [o, col] of stops) grd.addColorStop(o, col);
  g.fillStyle = grd;
  g.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
const corona = new THREE.Sprite(new THREE.SpriteMaterial({
  map: glowTexture([[0, 'rgba(255,220,160,0.9)'], [0.25, 'rgba(255,170,80,0.42)'], [0.5, 'rgba(255,120,40,0.08)'], [0.8, 'rgba(255,90,30,0.015)'], [1, 'rgba(0,0,0,0)']]),
  blending: THREE.AdditiveBlending,
  depthWrite: false,
  transparent: true,
}));
corona.scale.setScalar(SUN.radius * 5);
sunGroup.add(corona);

const sunBody = {
  cfg: SUN,
  isSun: true,
  group: sunGroup,
  radius: SUN.radius,
  hit: new THREE.Mesh(hitGeo, hitMat),
};
sunBody.hit.scale.setScalar(SUN.radius * 1.15);
sunBody.hit.userData.body = sunBody;
sunGroup.add(sunBody.hit);
sunBody.label = new CSS2DObject(ui.makeLabel(SUN));
sunBody.label.position.set(0, -SUN.radius - 1.2, 0);
sunBody.label.center.set(0.5, 0);
sunGroup.add(sunBody.label);

// --- Planeten ---------------------------------------------------------------
const J2000 = Date.UTC(2000, 0, 1, 12);
const daysSinceJ2000 = (Date.now() - J2000) / 86400000;

function atmosphere(radius, { color, strength }, scale = 1.04) {
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      color: { value: new THREE.Color(color) },
      strength: { value: strength },
      sunPos: { value: new THREE.Vector3() },
    },
    vertexShader: atmoVertex,
    fragmentShader: atmoFragment,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const m = new THREE.Mesh(sphereGeo, mat);
  m.scale.setScalar(radius * scale);
  return m;
}

const bodies = [];
for (const cfg of PLANETS) {
  const group = new THREE.Group();
  scene.add(group);

  const tiltGroup = new THREE.Group();
  tiltGroup.rotation.z = cfg.tilt;
  group.add(tiltGroup);

  const mat = new THREE.MeshStandardMaterial({ color: cfg.accent, roughness: 1, metalness: 0 });
  const mesh = new THREE.Mesh(sphereGeo, mat);
  mesh.scale.setScalar(cfg.radius);
  mesh.rotation.y = Math.random() * Math.PI * 2;
  tiltGroup.add(mesh);

  const body = { cfg, group, tiltGroup, mesh, mat, radius: cfg.radius };

  if (cfg.clouds) {
    body.clouds = new THREE.Mesh(sphereGeo, new THREE.MeshStandardMaterial({ transparent: true, depthWrite: false, roughness: 1, visible: false }));
    body.clouds.scale.setScalar(cfg.radius * 1.012);
    tiltGroup.add(body.clouds);
  }

  if (cfg.atmosphere) {
    body.atmo = atmosphere(cfg.radius, cfg.atmosphere, 1.03);
    tiltGroup.add(body.atmo);
  }

  if (cfg.ring) {
    const inner = cfg.radius * 1.24, outer = cfg.radius * 2.3;
    const geo = new THREE.RingGeometry(inner, outer, 192, 1);
    const p = geo.attributes.position, uv = geo.attributes.uv, tmp = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) {
      tmp.fromBufferAttribute(p, i);
      uv.setXY(i, (tmp.length() - inner) / (outer - inner), 0.5);
    }
    const ringMat = new THREE.ShaderMaterial({
      uniforms: {
        map: { value: null },
        planetCenter: { value: new THREE.Vector3() },
        planetRadius: { value: cfg.radius },
        sunPos: { value: new THREE.Vector3() },
        hasMap: { value: 0 },
      },
      vertexShader: ringVertex,
      fragmentShader: ringFragment,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    body.ring = new THREE.Mesh(geo, ringMat);
    body.ring.rotation.x = -Math.PI / 2;
    tiltGroup.add(body.ring);
  }

  if (cfg.moon) {
    body.moonPivot = new THREE.Group();
    body.moonPivot.rotation.z = 0.09;
    group.add(body.moonPivot);
    body.moonMat = new THREE.MeshStandardMaterial({ color: '#9a9893', roughness: 1 });
    body.moon = new THREE.Mesh(sphereGeo, body.moonMat);
    body.moon.scale.setScalar(cfg.radius * 0.27);
    body.moon.position.set(cfg.radius * 2.6, 0, 0);
    body.moonPivot.add(body.moon);
  }

  // Unsichtbare, größere Kugel zum leichteren Antippen
  body.hit = new THREE.Mesh(hitGeo, hitMat);
  body.hit.scale.setScalar(cfg.radius * (cfg.ring ? 2.3 : 1.6) + 1.2);
  body.hit.userData.body = body;
  group.add(body.hit);

  // Umlaufbahn
  const pts = [];
  for (let i = 0; i <= 256; i++) {
    const a = (i / 256) * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(a) * cfg.distance, 0, -Math.sin(a) * cfg.distance));
  }
  body.orbit = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(pts),
    new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.12, depthWrite: false }),
  );
  if (cfg.hidden) body.orbit.visible = false;   // Easter Egg: keine Bahnlinie
  scene.add(body.orbit);

  // Label
  body.label = new CSS2DObject(ui.makeLabel(cfg));
  body.label.position.set(0, -cfg.radius * (cfg.ring ? 1.3 : 1) - 0.5, 0);
  body.label.center.set(0.5, 0);
  group.add(body.label);

  // echte heutige Stellung (mittlere Länge) als Startwinkel
  body.angle = THREE.MathUtils.degToRad((cfg.L0 + cfg.n * daysSinceJ2000) % 360);
  body.angle0 = body.angle; // Ausgangsposition (heutige echte Stellung)
  body.angularSpeed = THREE.MathUtils.degToRad(cfg.n) * SIM_DAYS_PER_SECOND;

  bodies.push(body);
}

const allBodies = [sunBody, ...bodies];
const byId = new Map(allBodies.map((b) => [b.cfg.id, b]));
const hitTargets = allBodies.map((b) => b.hit);

function placeBodies() {
  for (const b of bodies) {
    const x = Math.cos(b.angle) * b.cfg.distance, z = -Math.sin(b.angle) * b.cfg.distance;
    const inc = b.cfg.inclination || 0;   // geneigte Bahn (Pluto)
    b.group.position.set(x, -z * Math.sin(inc), z * Math.cos(inc));
  }
}
placeBodies();

// --- Asteroidengürtel zwischen Mars und Jupiter ----------------------------------
const belt = (() => {
  const count = isTouch ? 900 : 1600;
  const geo = new THREE.IcosahedronGeometry(1, 0);
  const mat = new THREE.MeshStandardMaterial({ color: '#8f8578', roughness: 1, flatShading: true });
  const mesh = new THREE.InstancedMesh(geo, mat, count);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), v = new THREE.Vector3(), sc = new THREE.Vector3();
  const color = new THREE.Color();
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = 34 + Math.random() * 5.5 + (Math.random() - 0.5) * 1.5;
    v.set(Math.cos(a) * r, (Math.random() - 0.5) * 1.6, -Math.sin(a) * r);
    e.set(Math.random() * 6, Math.random() * 6, Math.random() * 6);
    const k = 0.05 + Math.random() ** 3 * 0.22;
    sc.set(k * (0.7 + Math.random() * 0.6), k, k * (0.7 + Math.random() * 0.6));
    m.compose(v, q.setFromEuler(e), sc);
    mesh.setMatrixAt(i, m);
    mesh.setColorAt(i, color.setHSL(0.08, 0.12 + Math.random() * 0.1, 0.32 + Math.random() * 0.25));
  }
  mesh.frustumCulled = false;
  const group = new THREE.Group();
  group.add(mesh);
  scene.add(group);
  return { group, speed: THREE.MathUtils.degToRad(0.224) * SIM_DAYS_PER_SECOND };  // ~4,4 Jahre Umlauf
})();

// --- Komet: fliegt ab und zu durchs Sonnensystem, Schweif zeigt immer von der Sonne weg ---
const comet = (() => {
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 12), new THREE.MeshBasicMaterial({ color: new THREE.Color(2.2, 2.4, 2.6) }));
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTexture([[0, 'rgba(210,235,255,1)'], [0.3, 'rgba(150,200,255,0.35)'], [1, 'rgba(0,0,0,0)']]),
    blending: THREE.AdditiveBlending, depthWrite: false, transparent: true,
  }));
  glow.scale.setScalar(4);
  const tailGeo = new THREE.CylinderGeometry(0.05, 1, 1, 24, 1, true);
  tailGeo.translate(0, 0.5, 0);
  const tailMat = new THREE.ShaderMaterial({
    uniforms: { strength: { value: 0 } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: 'uniform float strength; varying vec2 vUv; void main(){ float a = pow(1.0 - vUv.y, 2.2) * strength; gl_FragColor = vec4(vec3(0.55,0.75,1.0) * a * 1.6, a); }',
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
  });
  const tail = new THREE.Mesh(tailGeo, tailMat);
  const group = new THREE.Group();
  const hit = new THREE.Mesh(hitGeo, hitMat);   // großzügige Trefferfläche
  hit.scale.setScalar(3.2);
  hit.userData.egg = 'komet';
  group.add(head, glow, tail, hit);
  group.visible = false;
  scene.add(group);
  const c = { group, hit, tail, tailMat, t: 0, active: false, wait: 12 + Math.random() * 20, p0: new THREE.Vector3(), p1: new THREE.Vector3(), p2: new THREE.Vector3(), dur: 26 };
  c.launch = () => {
    const a = Math.random() * Math.PI * 2, b = a + Math.PI * (0.6 + Math.random() * 0.8);
    const tilt = (Math.random() - 0.5) * 60;
    c.p0.set(Math.cos(a) * 170, tilt, Math.sin(a) * 170);
    c.p2.set(Math.cos(b) * 170, -tilt * 0.6, Math.sin(b) * 170);
    const mid = (a + b) / 2;
    c.p1.set(Math.cos(mid) * 6, 0, Math.sin(mid) * 6).multiplyScalar(-1);   // Kontrollpunkt nahe der Sonne
    c.t = 0; c.active = true; group.visible = true;
  };
  const pos = new THREE.Vector3(), away = new THREE.Vector3();
  c.update = (dt) => {
    if (!c.active) {
      c.wait -= dt;
      if (c.wait <= 0 && !REDUCED_MOTION) c.launch();
      return;
    }
    c.t += dt / c.dur;
    if (c.t >= 1) { c.active = false; group.visible = false; c.wait = 35 + Math.random() * 45; return; }
    const u = c.t, iu = 1 - u;
    pos.set(0, 0, 0).addScaledVector(c.p0, iu * iu).addScaledVector(c.p1, 2 * iu * u).addScaledVector(c.p2, u * u);
    group.position.copy(pos);
    const dist = pos.length();
    away.copy(pos).normalize();
    const len = THREE.MathUtils.clamp(260 / (dist + 8), 2, 22);   // Schweif wird nahe der Sonne länger
    c.tail.quaternion.setFromUnitVectors(UP, away);
    c.tail.scale.set(len * 0.09, len, len * 0.09);
    c.tailMat.uniforms.strength.value = THREE.MathUtils.clamp(1.4 - dist / 140, 0.15, 1);
  };
  return c;
})();

// --- Prozedurale Texturen im Hintergrund erzeugen ---------------------------
const maxAniso = renderer.capabilities.getMaxAnisotropy();
function dataTexture(data, w, h) {
  const t = new THREE.DataTexture(data, w, h, THREE.RGBAFormat);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = THREE.RepeatWrapping;
  t.magFilter = THREE.LinearFilter;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.generateMipmaps = true;
  t.anisotropy = maxAniso;
  t.needsUpdate = true;
  return t;
}

const jobs = [
  { type: 'earth', w: 2048, h: 1024, body: 'erde' },
  { type: 'jupiter', w: 2048, h: 1024, body: 'jupiter' },
  { type: 'saturn', w: 1024, h: 512, body: 'saturn' },
  { type: 'mars', w: 1024, h: 512, body: 'mars' },
  { type: 'moon', w: 512, h: 256, body: 'erde', moon: true },
  { type: 'neptune', w: 1024, h: 512, body: 'neptun' },
  { type: 'uranus', w: 512, h: 256, body: 'uranus' },
  { type: 'venus', w: 1024, h: 512, body: 'venus' },
  { type: 'mercury', w: 1024, h: 512, body: 'merkur' },
  { type: 'pluto', w: 512, h: 256, body: 'pluto' },
];

function applyTexture(msg) {
  const job = jobs[msg.id];
  const body = byId.get(job.body);
  const tex = dataTexture(msg.color, msg.w, msg.h);
  const rocky = ['mercury', 'mars', 'moon', 'pluto'].includes(job.type);
  const mat = job.moon ? body.moonMat : body.mat;
  mat.map = tex;
  mat.color.set(0xffffff);
  if (rocky) {
    mat.bumpMap = tex;
    mat.bumpScale = job.type === 'mars' ? 0.5 : 1.0;
  }
  mat.needsUpdate = true;
  if (msg.clouds && body.clouds) {
    const c = dataTexture(msg.clouds, msg.w, msg.h);
    body.clouds.material.map = c;
    body.clouds.material.visible = true;
    body.clouds.material.needsUpdate = true;
  }
  if (msg.ring && body.ring) {
    const r = new THREE.DataTexture(msg.ring, msg.ringWidth, 1, THREE.RGBAFormat);
    r.colorSpace = THREE.SRGBColorSpace;
    r.magFilter = THREE.LinearFilter;
    r.minFilter = THREE.LinearFilter;
    r.needsUpdate = true;
    body.ring.material.uniforms.map.value = r;
    body.ring.material.uniforms.hasMap.value = 1;
  }
}

(function startWorkers() {
  const workerCount = Math.min(2, navigator.hardwareConcurrency || 2);
  for (let w = 0; w < workerCount; w++) {
    const worker = new Worker(new URL('./texture-worker.js', import.meta.url));
    worker.onmessage = (e) => applyTexture(e.data);
    jobs.forEach((job, id) => {
      if (id % workerCount === w) worker.postMessage({ id, type: job.type, w: job.w, h: job.h });
    });
  }
})();

// --- Layout (Panel rechts am Desktop, Bottom-Sheet am Handy) ----------------
const layout = { mobile: false, panelW: 0, sheetH: 0 };
function updateLayout() {
  const w = window.innerWidth, h = window.innerHeight;
  layout.mobile = w < 760;
  layout.panelW = Math.round(Math.min(440, Math.max(340, w * 0.36)));
  layout.sheetH = Math.round(h * 0.54);
  document.documentElement.style.setProperty('--panel-w', layout.panelW + 'px');
  document.documentElement.style.setProperty('--sheet-h', layout.sheetH + 'px');
}
updateLayout();

// Bildausschnitt verschieben, damit der Planet neben/über dem Panel sitzt
const viewShift = { x: 0, y: 0, tx: 0, ty: 0 };
function updateShiftTarget() {
  if (!state.focus) { viewShift.tx = 0; viewShift.ty = 0; return; }
  if (layout.mobile) { viewShift.tx = 0; viewShift.ty = layout.sheetH / 2; }
  else { viewShift.tx = (layout.panelW + 24) / 2; viewShift.ty = 0; }
}

// --- Kamera-Posen -------------------------------------------------------------
const TAN_HALF_FOV = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));

function overviewPolar() {
  return THREE.MathUtils.degToRad(camera.aspect < 1 ? 48 : 60);
}
function overviewDistance() {
  const dW = SYSTEM_RADIUS / (TAN_HALF_FOV * camera.aspect);
  const dH = (SYSTEM_RADIUS * Math.cos(overviewPolar()) + 8) / TAN_HALF_FOV;
  return Math.min(Math.max(dW, dH) * 1.02, camera.aspect < 1 ? 330 : 400);
}
function overviewPose(azimuth) {
  const d = overviewDistance(), pol = overviewPolar();
  return new THREE.Vector3(Math.sin(azimuth) * Math.sin(pol) * d, Math.cos(pol) * d, Math.cos(azimuth) * Math.sin(pol) * d);
}

function focusDistance(body) {
  const h = window.innerHeight, w = window.innerWidth;
  const availW = (layout.mobile ? w : w - layout.panelW - 48) / h;
  const availH = layout.mobile ? (h - layout.sheetH) / h : 1;
  const effR = body.radius * (body.cfg.ring ? 2.0 : body.isSun ? 1.35 : 1.0);
  const fill = layout.mobile ? 0.62 : 0.58;
  return (2 * effR) / (fill * 2 * TAN_HALF_FOV * Math.min(availW, availH));
}

const tmpV = new THREE.Vector3();
function bodyPos(body, out = new THREE.Vector3()) {
  return body.group.getWorldPosition(out);
}
function focusOffset(body) {
  const d = focusDistance(body);
  if (body.isSun) {
    const az = Math.atan2(camera.position.x, camera.position.z);
    return new THREE.Vector3(Math.sin(az), 0.35, Math.cos(az)).normalize().multiplyScalar(d);
  }
  // von der Sonnenseite schräg anschauen -> Planet ist zu ~3/4 beleuchtet (wie beim iPhone)
  const dir = bodyPos(body, tmpV).clone().negate().setY(0).normalize();
  dir.applyAxisAngle(UP, THREE.MathUtils.degToRad(62));
  dir.y = 0.32;
  return dir.normalize().multiplyScalar(d);
}

// --- Zustand & Kamerafahrten ------------------------------------------------
const state = {
  mode: 'intro',      // intro | overview | flying | focus
  focus: null,
  fly: null,
  timeScale: 1,
  lastFocusPos: new THREE.Vector3(),
  idleUntil: 0,
  moved: false,
  travel: null,
  warp: null,         // Konami-Code-Effekt       // { days, returning } – Zeitreise aktiv
};

// --- Zeitreise --------------------------------------------------------------------
const toDays = (date) => (date.getTime() - J2000) / 86400000;
function travelAngle(b) {
  return b.angle0 + THREE.MathUtils.degToRad(b.cfg.n) * (state.travel.days - daysSinceJ2000);
}
function setTravel(date) {
  if (date) {
    const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    if (EGG_DATES.includes(iso)) eggs.trigger('zeitreise', iso);
    state.travel = { days: toDays(date), returning: false };
  } else if (state.travel) {
    state.travel = { days: daysSinceJ2000, returning: true };   // sanft zurück nach heute
  }
}

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t) => 1 - Math.pow(1 - t, 3);

function flyTo({ pos, target, duration, arc = 0, onDone, toOverview = false, rewind = false }) {
  if (state.mode !== 'intro') sound.whoosh(duration);
  controls.enabled = false;
  controls.autoRotate = false;
  state.mode = state.mode === 'intro' ? 'intro' : 'flying';
  state.fly = {
    t: 0,
    duration: REDUCED_MOTION ? Math.min(duration, 0.5) : duration,
    fromPos: camera.position.clone(),
    fromTarget: controls.target.clone(),
    pos, target, arc, onDone, toOverview, rewind,
  };
}

function stepFly(dt) {
  const f = state.fly;
  f.t = Math.min(1, f.t + dt / f.duration);
  const k = easeInOut(f.t);
  const kt = easeOut(Math.min(1, f.t * 1.25));
  const endPos = f.pos(), endTarget = f.target();
  camera.position.lerpVectors(f.fromPos, endPos, k);
  camera.position.y += Math.sin(Math.PI * k) * f.arc;
  controls.target.lerpVectors(f.fromTarget, endTarget, kt);
  camera.lookAt(controls.target);
  if (f.t >= 1) {
    state.fly = null;
    controls.enabled = true;
    f.onDone?.();
  }
}

// Keine Blickgrenzen: rundherum drehen, auch unter die Planetenebene, weit hinaus zoomen
function setOverviewLimits() {
  controls.enablePan = true;
  controls.minDistance = SUN.radius * 1.6;
  controls.maxDistance = 1600;
  controls.minPolarAngle = 0;
  controls.maxPolarAngle = Math.PI;
}
function setFocusLimits(body) {
  const r = body.radius * (body.cfg.ring ? 2.4 : body.isSun ? 1.3 : 1);
  controls.enablePan = false; // Blick bleibt auf dem Planeten, er bewegt sich ja weiter
  controls.minDistance = r * 1.3;
  controls.maxDistance = 900;
  controls.minPolarAngle = 0;
  controls.maxPolarAngle = Math.PI;
}

function focus(body) {
  state.focus = body;
  if (body.cfg.id === 'pluto') setTimeout(() => eggs.trigger('pluto'), 1200);
  ui.showPanel(body.cfg);
  updateShiftTarget();
  for (const b of allBodies) b.label.element.classList.toggle('active', b === body);
  const from = camera.position.distanceTo(bodyPos(body, tmpV));
  flyTo({
    pos: () => bodyPos(body).add(focusOffset(body)),
    target: () => bodyPos(body),
    duration: THREE.MathUtils.clamp(1.2 + from / 160, 1.4, 2.6),
    arc: Math.min(from * 0.08, 14),
    onDone: () => {
      state.mode = 'focus';
      bodyPos(body, state.lastFocusPos);
      setFocusLimits(body);
      controls.update();
    },
  });
}

function overview(duration = 2.2) {
  state.focus = null;
  state.moved = false;
  ui.hidePanel();
  updateShiftTarget();
  for (const b of allBodies) b.label.element.classList.remove('active');
  // Planeten auf dem kürzesten Weg zurück an ihre Ausgangsposition
  for (const b of bodies) {
    const goal = state.travel ? travelAngle(b) : b.angle0;
    const diff = state.travel ? goal - b.angle : THREE.MathUtils.euclideanModulo(goal - b.angle + Math.PI, Math.PI * 2) - Math.PI;
    b.rewindFrom = b.angle;
    b.rewindTo = b.angle + diff;
  }
  flyTo({
    pos: () => overviewPose(START_AZ),
    target: () => new THREE.Vector3(0, 0, 0),
    duration,
    toOverview: true,
    rewind: true,
    onDone: () => {
      state.mode = 'overview';
      setOverviewLimits();
      controls.update();
      controls.autoRotate = !REDUCED_MOTION;
      state.idleUntil = performance.now() + 4000;
    },
  });
}
// „Ansicht zurücksetzen“-Knopf in der Übersicht
ui.onReset(() => { if (!state.focus) overview(1.6); else go(null); });

// --- Routing (#erde, #jupiter …) – Browser-Zurück funktioniert -----------------
function hashId() { return decodeURIComponent(location.hash.slice(1)).toLowerCase(); }
function route(id) {
  const body = byId.get(id);
  if (body) { if (state.focus !== body) focus(body); }
  else if (state.focus || (state.mode !== 'overview' && !state.fly?.toOverview)) overview();
}
function go(id) {
  const current = state.focus?.cfg.id ?? null;
  if (id === current) return;
  try {
    history.pushState(null, '', id ? '#' + id : location.pathname + location.search);
  } catch {
    // z. B. in abgesicherten iframes: dann über den Hash navigieren (löst hashchange aus)
    location.hash = id || '';
    return;
  }
  route(id);
}
window.addEventListener('popstate', () => route(hashId()));
window.addEventListener('hashchange', () => route(hashId()));

// --- Eingaben -----------------------------------------------------------------
const raycaster = new THREE.Raycaster();
const ndc = new THREE.Vector2();
function aim(e) {
  const rect = renderer.domElement.getBoundingClientRect();
  ndc.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
  raycaster.setFromCamera(ndc, camera);
}
function pick(e) {
  aim(e);
  const hit = raycaster.intersectObjects(hitTargets, false)[0];
  return hit ? hit.object.userData.body : null;
}
// Easter Eggs: Komet (nur wenn sichtbar) und Mond
const moonBody = bodies.find((b) => b.moon);
if (moonBody) moonBody.moon.userData.egg = 'mond';
function pickEgg(e) {
  aim(e);
  const targets = [];
  if (comet.group.visible) targets.push(comet.hit);
  if (moonBody) targets.push(moonBody.moon);
  const hit = raycaster.intersectObjects(targets, false)[0];
  return hit ? hit.object.userData.egg : null;
}
function catchComet() {
  comet.active = false;
  comet.group.visible = false;
  comet.wait = 25 + Math.random() * 30;
  sound.whoosh(0.9);
  eggs.trigger('komet');
}

// Tippen/Klicken (nicht Ziehen):
//  - auf einen Planeten  -> hinfliegen
//  - auf den Planeten, den man gerade anschaut, oder ins Leere -> zurück zur Übersicht
let down = null;
const activePointers = new Set();
renderer.domElement.addEventListener('pointerdown', (e) => {
  activePointers.add(e.pointerId);
  if (activePointers.size > 1) { down = null; return; }      // zwei Finger = Zoomen/Verschieben
  if (e.pointerType === 'mouse' && e.button !== 0) { down = null; return; }  // rechte Maustaste = Verschieben
  down = { x: e.clientX, y: e.clientY, t: performance.now(), id: e.pointerId };
  ui.hideHint();
});
const releasePointer = (e) => activePointers.delete(e.pointerId);
renderer.domElement.addEventListener('pointercancel', (e) => { releasePointer(e); down = null; });
renderer.domElement.addEventListener('pointerup', (e) => {
  releasePointer(e);
  if (!down || down.id !== e.pointerId) return;
  const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
  const quick = performance.now() - down.t < 500;
  down = null;
  if (moved > 8 || !quick) return;
  const egg = pickEgg(e);
  if (egg === 'komet') return catchComet();
  if (egg === 'mond') return eggs.trigger('mond');
  const body = pick(e);
  if (body && body !== state.focus) go(body.cfg.id);
  else if (state.focus) go(null);
});

let hovered = null;
renderer.domElement.addEventListener('pointermove', (e) => {
  if (e.pointerType !== 'mouse' || e.buttons) return;
  const body = pick(e);
  renderer.domElement.style.cursor = body || pickEgg(e) ? 'pointer' : '';
  if (body === hovered) return;
  hovered?.label.element.classList.remove('hover');
  hovered = body;
  hovered?.label.element.classList.add('hover');
});

controls.addEventListener('start', () => {
  if (state.mode === 'overview') state.moved = true;
  controls.autoRotate = false;
  state.idleUntil = performance.now() + 8000;
});

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konami = 0, typed = '';
function warp() {
  state.warp = { t: 0 };
  sound.whoosh(3);
  eggs.trigger('warp');
}
window.addEventListener('keydown', (e) => {
  if (e.target.closest?.('input, textarea, select')) return;
  const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  konami = key === KONAMI[konami] ? konami + 1 : (key === KONAMI[0] ? 1 : 0);
  if (konami === KONAMI.length) { konami = 0; warp(); return; }
  if (e.key.length === 1) {
    typed = (typed + key).slice(-12);
    if (typed.endsWith('pluto')) { typed = ''; go('pluto'); return; }
  }
  if (e.key === 'Escape') go(null);
  if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && konami < 5) {
    const i = state.focus ? VISIBLE_ORDER.indexOf(state.focus.cfg) : (e.key === 'ArrowRight' ? -1 : 0);
    const n = VISIBLE_ORDER.length;
    go(VISIBLE_ORDER[(Math.max(i, 0) + (e.key === 'ArrowRight' ? (i < 0 ? 0 : 1) : -1) + n) % n].id);
  }
});

window.addEventListener('resize', () => {
  const w = window.innerWidth, h = window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
  composer.setSize(w, h);
  bloom.setSize(w, h);
  labelRenderer.setSize(w, h);
  updateLayout();
  updateShiftTarget();
});

// --- Animationsschleife -------------------------------------------------------
const clock = new THREE.Clock();
const sunWorld = new THREE.Vector3(0, 0, 0);
let elapsed = 0;

function animate() {
  const dt = Math.min(clock.getDelta(), 0.05);
  elapsed += dt;

  // Zeit läuft langsamer, wenn man einen Planeten anschaut
  const targetScale = state.focus ? 0.04 : 1;
  state.timeScale += (targetScale - state.timeScale) * (1 - Math.exp(-dt * 2.5));

  const rewindK = state.fly?.rewind ? easeInOut(state.fly.t) : null;
  const travelK = 1 - Math.exp(-dt * 3.5);
  let travelDone = !!state.travel?.returning;
  for (const b of bodies) {
    if (rewindK !== null) b.angle = b.rewindFrom + (b.rewindTo - b.rewindFrom) * rewindK;
    else if (state.travel) {
      const goal = travelAngle(b);
      b.angle += (goal - b.angle) * travelK;
      if (Math.abs(goal - b.angle) > 0.002) travelDone = false;
    } else b.angle += b.angularSpeed * dt * state.timeScale;
    b.mesh.rotation.y += b.cfg.spin * dt * 0.6;
    if (b.clouds) b.clouds.rotation.y += b.cfg.spin * dt * 0.75;
    if (b.moonPivot) b.moonPivot.rotation.y += dt * 0.35 * Math.max(state.timeScale, 0.15);
    const focusedOrHover = b === state.focus || b === hovered;
    const targetOpacity = state.focus ? 0.035 : focusedOrHover ? 0.4 : 0.12;
    b.orbit.material.opacity += (targetOpacity - b.orbit.material.opacity) * (1 - Math.exp(-dt * 5));
  }
  if (travelDone) { for (const b of bodies) b.angle = b.angle0; state.travel = null; }
  placeBodies();
  belt.group.rotation.y += belt.speed * dt * (state.travel ? 0 : state.timeScale);
  comet.update(dt);

  for (const b of bodies) {
    if (b.atmo) b.atmo.material.uniforms.sunPos.value.copy(sunWorld);
    if (b.ring) {
      b.group.getWorldPosition(b.ring.material.uniforms.planetCenter.value);
      b.ring.material.uniforms.sunPos.value.copy(sunWorld);
    }
  }
  sunMat.uniforms.time.value = elapsed;
  stars.material.uniforms.time.value = elapsed;
  sunMesh.rotation.y += dt * 0.02;

  // Kamera
  if (state.fly) {
    stepFly(dt);
  } else if (state.mode === 'focus' && state.focus) {
    const p = bodyPos(state.focus, tmpV);
    camera.position.add(p.clone().sub(state.lastFocusPos));
    state.lastFocusPos.copy(p);
    controls.target.copy(p);
    controls.update();
  } else {
    if (!controls.autoRotate && state.mode === 'overview' && !REDUCED_MOTION && performance.now() > state.idleUntil) {
      controls.autoRotate = true;
    }
    controls.update();
  }

  stars.position.copy(camera.position); // Sterne wirken unendlich weit entfernt
  ui.setOffCenter(state.mode === 'overview' && !state.fly && state.moved);

  // Bildausschnitt sanft verschieben
  const ks = 1 - Math.exp(-dt * 5);
  viewShift.x += (viewShift.tx - viewShift.x) * ks;
  viewShift.y += (viewShift.ty - viewShift.y) * ks;
  if (state.warp) {
    state.warp.t = Math.min(1, state.warp.t + dt / 2.8);
    camera.fov = 40 + Math.sin(Math.PI * state.warp.t) ** 2 * 70;
    if (state.warp.t >= 1) { camera.fov = 40; state.warp = null; }
  }
  camera.setViewOffset(window.innerWidth, window.innerHeight, viewShift.x, viewShift.y, window.innerWidth, window.innerHeight);

  // Glow der Sonne etwas zurücknehmen, wenn man nah dran ist
  const sunDist = camera.position.length();
  const targetBloom = THREE.MathUtils.clamp(0.3 + (sunDist - 20) / 160, 0.3, 0.62);
  bloom.strength += (targetBloom - bloom.strength) * ks;

  composer.render();
  labelRenderer.render(scene, camera);
  requestAnimationFrame(animate);
}

// --- Start: Intro-Flug ins Sonnensystem ---------------------------------------
camera.position.copy(overviewPose(START_AZ + 0.9).multiplyScalar(4.5)).add(new THREE.Vector3(0, 250, 0));
controls.target.set(0, 0, 0);
camera.lookAt(0, 0, 0);
setOverviewLimits();

const initial = byId.get(hashId());
if (initial) {
  state.mode = 'overview';
  focus(initial);
} else {
  flyTo({
    pos: () => overviewPose(START_AZ),
    target: () => new THREE.Vector3(0, 0, 0),
    duration: 3.6,
    onDone: () => {
      state.mode = 'overview';
      controls.update();
      controls.autoRotate = !REDUCED_MOTION;
    },
  });
}

animate();
requestAnimationFrame(() => ui.ready());

// Als App installierbar + offline startfähig
if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}

if (new URLSearchParams(location.search).has('debug')) window.__solar = { state, camera, controls, comet, sound, moonBody };
