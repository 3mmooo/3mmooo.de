// Erzeugt prozedurale Planeten-Texturen (equirectangular) in einem Web Worker,
// damit die Animation auf dem Hauptthread flüssig bleibt.
// Zeile 0 = Südpol (passt zu den UVs von THREE.SphereGeometry).

function makeNoise(seed) {
  let s = seed >>> 0;
  const rnd = () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296);
  const perm = new Uint8Array(256);
  for (let i = 0; i < 256; i++) perm[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    const t = perm[i]; perm[i] = perm[j]; perm[j] = t;
  }
  const p = new Uint8Array(512);
  for (let i = 0; i < 512; i++) p[i] = perm[i & 255];

  const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
  const lerp = (a, b, t) => a + t * (b - a);
  const grad = (h, x, y, z) => {
    h &= 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : (h === 12 || h === 14 ? x : z);
    return ((h & 1) ? -u : u) + ((h & 2) ? -v : v);
  };

  function noise(x, y, z) {
    const X = Math.floor(x) & 255, Y = Math.floor(y) & 255, Z = Math.floor(z) & 255;
    x -= Math.floor(x); y -= Math.floor(y); z -= Math.floor(z);
    const u = fade(x), v = fade(y), w = fade(z);
    const A = p[X] + Y, AA = p[A] + Z, AB = p[A + 1] + Z;
    const B = p[X + 1] + Y, BA = p[B] + Z, BB = p[B + 1] + Z;
    return lerp(
      lerp(lerp(grad(p[AA], x, y, z), grad(p[BA], x - 1, y, z), u),
           lerp(grad(p[AB], x, y - 1, z), grad(p[BB], x - 1, y - 1, z), u), v),
      lerp(lerp(grad(p[AA + 1], x, y, z - 1), grad(p[BA + 1], x - 1, y, z - 1), u),
           lerp(grad(p[AB + 1], x, y - 1, z - 1), grad(p[BB + 1], x - 1, y - 1, z - 1), u), v),
      w);
  }

  function fbm(x, y, z, oct = 5, lac = 2.0, gain = 0.5) {
    let a = 1, f = 1, sum = 0, norm = 0;
    for (let i = 0; i < oct; i++) {
      sum += a * noise(x * f, y * f, z * f);
      norm += a; a *= gain; f *= lac;
    }
    return sum / norm; // ca. -0.7 .. 0.7
  }

  return { noise, fbm, rnd };
}

// --- Hilfsfunktionen ----------------------------------------------------
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const mix = (c1, c2, t) => [c1[0] + (c2[0] - c1[0]) * t, c1[1] + (c2[1] - c1[1]) * t, c1[2] + (c2[2] - c1[2]) * t];
const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];

function ramp(stops, t) {
  t = clamp(t);
  for (let i = 1; i < stops.length; i++) {
    if (t <= stops[i][0]) {
      const [t0, c0] = stops[i - 1], [t1, c1] = stops[i];
      return mix(c0, c1, (t - t0) / (t1 - t0 || 1));
    }
  }
  return stops[stops.length - 1][1];
}

function paint(w, h, fn) {
  const data = new Uint8ClampedArray(w * h * 4);
  for (let j = 0; j < h; j++) {
    const lat = ((j + 0.5) / h - 0.5) * Math.PI; // -pi/2 (Süd) .. pi/2 (Nord)
    const cl = Math.cos(lat), y = Math.sin(lat);
    for (let i = 0; i < w; i++) {
      const lon = ((i + 0.5) / w) * Math.PI * 2;
      const x = cl * Math.cos(lon), z = cl * Math.sin(lon);
      const c = fn(x, y, z, lat, lon);
      const k = (j * w + i) * 4;
      data[k] = c[0]; data[k + 1] = c[1]; data[k + 2] = c[2]; data[k + 3] = c.length > 3 ? c[3] : 255;
    }
  }
  return data;
}

// Krater: Liste zufälliger Punkte auf der Kugel
function makeCraters(rnd, count, minR, maxR) {
  const list = [];
  for (let i = 0; i < count; i++) {
    const u = rnd() * 2 - 1, phi = rnd() * Math.PI * 2, s = Math.sqrt(1 - u * u);
    const r = minR + Math.pow(rnd(), 3) * (maxR - minR);
    list.push([s * Math.cos(phi), u, s * Math.sin(phi), r]);
  }
  return list;
}
function craterShade(craters, x, y, z) {
  let shade = 0;
  for (const [cx, cy, cz, r] of craters) {
    const dx = x - cx, dy = y - cy, dz = z - cz;
    const d2 = dx * dx + dy * dy + dz * dz;
    if (d2 > r * r * 1.7) continue;
    const d = Math.sqrt(d2) / r;
    if (d < 1) shade -= 0.22 * (1 - d * d);           // Mulde
    else if (d < 1.3) shade += 0.18 * (1 - (d - 1) / 0.3); // heller Rand
  }
  return shade;
}

// --- Rezepte --------------------------------------------------------------
const recipes = {
  mercury(w, h) {
    const { fbm, rnd } = makeNoise(11);
    const craters = makeCraters(rnd, 420, 0.015, 0.16);
    return { color: paint(w, h, (x, y, z) => {
      const n = fbm(x * 3, y * 3, z * 3, 6);
      const m = fbm(x * 9 + 5, y * 9, z * 9, 3);
      const v = clamp(0.52 + n * 0.45 + m * 0.12 + craterShade(craters, x, y, z));
      return mix(hex('#4a4540'), hex('#c9c1b6'), v);
    }) };
  },

  moon(w, h) {
    const { fbm, rnd } = makeNoise(77);
    const craters = makeCraters(rnd, 260, 0.02, 0.2);
    return { color: paint(w, h, (x, y, z) => {
      const maria = smooth(0.05, 0.25, fbm(x * 1.6, y * 1.6, z * 1.6, 4));
      const n = fbm(x * 6, y * 6, z * 6, 4);
      const v = clamp(0.62 - maria * 0.3 + n * 0.18 + craterShade(craters, x, y, z));
      return mix(hex('#3f3f42'), hex('#d8d6d0'), v);
    }) };
  },

  venus(w, h) {
    const { fbm } = makeNoise(23);
    return { color: paint(w, h, (x, y, z) => {
      const q = fbm(x * 2, y * 2, z * 2, 4);
      const n = fbm(x * 2 + q * 2.2, y * 5 + q * 1.5, z * 2 + q * 2.2, 5);
      return ramp([
        [0, hex('#a5743a')], [0.35, hex('#d6a865')], [0.6, hex('#ecd29d')], [1, hex('#fbf0d2')],
      ], 0.5 + n * 1.1);
    }) };
  },

  earth(w, h) {
    const { fbm } = makeNoise(4242);
    const color = paint(w, h, (x, y, z, lat) => {
      const warp = fbm(x * 1.4 + 7, y * 1.4, z * 1.4, 3) * 0.6;
      const e = fbm(x * 1.6 + warp, y * 1.6 + warp, z * 1.6, 7) + 0.03;
      const alat = Math.abs(lat) / (Math.PI / 2);
      const ice = smooth(0.80, 0.86, alat + fbm(x * 8, y * 8, z * 8, 3) * 0.08);
      let c;
      if (e < 0) {
        // Ozean: tiefer = dunkler, Küste türkis
        c = ramp([[0, hex('#0a1f4d')], [0.75, hex('#123d7a')], [0.95, hex('#1d6aa0')], [1, hex('#3aa5b8')]], 1 + e * 2.2);
      } else {
        const dry = smooth(-0.1, 0.25, fbm(x * 3 + 3, y * 3, z * 3, 4) + (1 - Math.abs(Math.abs(lat) - 0.42) * 3) * 0.12);
        const hi = smooth(0.18, 0.4, e);
        c = mix(mix(hex('#2f6b2a'), hex('#b49a63'), dry), hex('#7b6a55'), hi * 0.7);
        c = mix(c, hex('#e8e4dc'), smooth(0.36, 0.48, e)); // Gipfel
        const tundra = smooth(0.55, 0.75, alat);
        c = mix(c, hex('#6b7a5e'), tundra * 0.6);
      }
      return mix(c, hex('#f2f6fa'), ice);
    });
    const { fbm: fbm2 } = makeNoise(99);
    const clouds = paint(w, h, (x, y, z, lat) => {
      const q = fbm2(x * 2, y * 2, z * 2, 3);
      const n = fbm2(x * 3 + q * 1.6, y * 6 + q, z * 3 + q * 1.6, 6);
      const band = 1 - Math.abs(Math.sin(lat * 3)) * 0.25;
      const a = smooth(0.02, 0.32, n * band) * 235;
      return [255, 255, 255, a];
    });
    return { color, clouds };
  },

  mars(w, h) {
    const { fbm, rnd } = makeNoise(31);
    const craters = makeCraters(rnd, 70, 0.012, 0.07);
    return { color: paint(w, h, (x, y, z, lat) => {
      const n = fbm(x * 2.2, y * 2.2, z * 2.2, 6);
      const dark = smooth(0.0, 0.25, fbm(x * 1.3 + 9, y * 1.8, z * 1.3, 5));
      const v = clamp(0.55 + n * 0.5 + craterShade(craters, x, y, z) * 0.35);
      let c = ramp([[0, hex('#5a2414')], [0.45, hex('#a2492a')], [0.75, hex('#c96d3f')], [1, hex('#e7a57a')]], v);
      c = mix(c, hex('#4a2a20'), dark * 0.55);
      const cap = smooth(0.86, 0.9, Math.abs(lat) / (Math.PI / 2) + fbm(x * 6, y * 6, z * 6, 3) * 0.05);
      return mix(c, hex('#f4ece4'), cap);
    }) };
  },

  jupiter(w, h) {
    const { fbm } = makeNoise(5);
    const lon0 = 2.2, lat0 = -0.38;
    return { color: paint(w, h, (x, y, z, lat, lon) => {
      const turb = fbm(x * 4, y * 4, z * 4, 5) * 0.35 + fbm(x * 14, y * 40, z * 14, 3) * 0.1;
      const b = y * 10 + turb + fbm(x * 1.5, y * 22, z * 1.5, 4) * 0.9;
      const t = 0.5 + 0.5 * Math.sin(b * 2.0);
      const t2 = 0.5 + 0.5 * Math.sin(y * 31 + turb * 3);
      let c = ramp([
        [0, hex('#9a6644')], [0.3, hex('#c79466')], [0.55, hex('#e0c49c')], [0.8, hex('#efe1c8')], [1, hex('#f7efe0')],
      ], t * 0.85 + t2 * 0.15);
      // Pole etwas dunkler/bläulicher
      c = mix(c, hex('#7a6e68'), smooth(0.55, 1.0, Math.abs(y)) * 0.6);
      // Großer Roter Fleck
      let dl = lon - lon0; if (dl > Math.PI) dl -= 2 * Math.PI; if (dl < -Math.PI) dl += 2 * Math.PI;
      const e = (dl / 0.3) ** 2 + ((lat - lat0) / 0.11) ** 2;
      if (e < 1.6) {
        const swirl = fbm(x * 12, y * 12, z * 12, 3) * 0.25;
        const k = smooth(1.3, 0.2, e + swirl);
        c = mix(c, mix(hex('#b5532f'), hex('#d98a5a'), smooth(0, 0.8, e)), k);
      }
      return c;
    }) };
  },

  saturn(w, h) {
    const { fbm } = makeNoise(8);
    const color = paint(w, h, (x, y, z) => {
      const turb = fbm(x * 3, y * 3, z * 3, 4) * 0.12;
      const b = y * 8 + turb + fbm(x, y * 18, z, 3) * 0.35;
      const t = 0.5 + 0.5 * Math.sin(b * 2.2);
      let c = ramp([[0, hex('#b08d5a')], [0.4, hex('#d6b981')], [0.75, hex('#ead6a6')], [1, hex('#f6ead0')]], t);
      c = mix(c, hex('#8d8a7a'), smooth(0.7, 1.0, Math.abs(y)) * 0.5);
      return c;
    });
    // Ringtextur: 1 Zeile, radial von innen nach außen
    const rw = 1024;
    const ring = new Uint8ClampedArray(rw * 4);
    const { noise } = makeNoise(13);
    for (let i = 0; i < rw; i++) {
      const r = i / (rw - 1);
      let a = 0.55 + 0.35 * noise(r * 60, 0.5, 0.5) + 0.2 * noise(r * 200, 1.5, 0.5);
      a *= smooth(0.0, 0.06, r) * smooth(1.0, 0.94, r);
      if (r > 0.18 && r < 0.42) a *= 0.35;               // C-Ring (schwach)
      if (r > 0.64 && r < 0.69) a *= 0.06;               // Cassini-Teilung
      if (r > 0.88 && r < 0.895) a *= 0.2;               // Encke-Lücke
      const c = mix(hex('#9e8a6a'), hex('#efe2c4'), clamp(0.4 + noise(r * 40, 3.5, 0.5) * 0.8 + (r > 0.42 && r < 0.64 ? 0.3 : 0)));
      ring[i * 4] = c[0]; ring[i * 4 + 1] = c[1]; ring[i * 4 + 2] = c[2]; ring[i * 4 + 3] = clamp(a) * 255;
    }
    return { color, ring, ringWidth: rw };
  },

  uranus(w, h) {
    const { fbm } = makeNoise(17);
    return { color: paint(w, h, (x, y, z) => {
      const b = y * 6 + fbm(x * 2, y * 2, z * 2, 3) * 0.1;
      const t = 0.5 + 0.5 * Math.sin(b * 2);
      let c = mix(hex('#9fd8e0'), hex('#c6eef2'), t * 0.35 + 0.3);
      c = mix(c, hex('#dff7f8'), smooth(0.6, 1, y) * 0.5);
      return c;
    }) };
  },

  neptune(w, h) {
    const { fbm } = makeNoise(29);
    return { color: paint(w, h, (x, y, z, lat, lon) => {
      const turb = fbm(x * 3, y * 3, z * 3, 4) * 0.3;
      const b = y * 7 + turb;
      const t = 0.5 + 0.5 * Math.sin(b * 2.3);
      let c = ramp([[0, hex('#1d2f8a')], [0.5, hex('#2f53c4')], [1, hex('#4c7ae0')]], t);
      // helle Zirruswolken
      const cir = smooth(0.25, 0.45, fbm(x * 2, y * 14, z * 2, 4) + 0.15 * Math.sin(y * 9));
      c = mix(c, hex('#dfe8ff'), cir * 0.6);
      // dunkler Fleck
      let dl = lon - 4.0; if (dl > Math.PI) dl -= 2 * Math.PI; if (dl < -Math.PI) dl += 2 * Math.PI;
      const e = (dl / 0.25) ** 2 + ((lat + 0.35) / 0.1) ** 2;
      c = mix(c, hex('#13205e'), smooth(1.2, 0.3, e) * 0.8);
      return c;
    }) };
  },
};

self.onmessage = (e) => {
  const { id, type, w, h } = e.data;
  const out = recipes[type](w, h);
  const transfer = Object.values(out).filter((v) => v && v.buffer).map((v) => v.buffer);
  self.postMessage({ id, type, w, h, ...out }, transfer);
};
