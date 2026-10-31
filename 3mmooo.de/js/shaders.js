// GLSL-Shader für Sonne, Atmosphären, Saturnring und Sterne.

// 3D Simplex Noise – Ashima Arts / Stefan Gustavson (MIT-Lizenz)
const simplex = /* glsl */`
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+10.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.5-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 105.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

export const sunVertex = /* glsl */`
varying vec3 vPos;
varying vec3 vNormalW;
varying vec3 vWorld;
void main(){
  vPos = position;
  vNormalW = normalize(mat3(modelMatrix) * normal);
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}`;

export const sunFragment = /* glsl */`
uniform float time;
varying vec3 vPos;
varying vec3 vNormalW;
varying vec3 vWorld;
${simplex}
void main(){
  vec3 p = normalize(vPos);
  float n = 0.0, a = 0.5;
  vec3 q = p * 2.2;
  for (int i = 0; i < 5; i++) {
    n += a * snoise(q + vec3(time * 0.02 * float(i + 1)));
    q *= 2.15; a *= 0.5;
  }
  float cells = snoise(p * 22.0 + vec3(time * 0.08)) * 0.5 + 0.5;
  vec3 V = normalize(cameraPosition - vWorld);
  float mu = clamp(dot(normalize(vNormalW), V), 0.0, 1.0);
  float limb = pow(mu, 0.5);
  float t = clamp(0.55 + n * 0.85 + (cells - 0.5) * 0.3, 0.0, 1.0);
  vec3 c1 = vec3(1.0, 0.30, 0.04);
  vec3 c2 = vec3(1.0, 0.62, 0.18);
  vec3 c3 = vec3(1.0, 0.92, 0.70);
  vec3 col = mix(c1, c2, smoothstep(0.0, 0.55, t));
  col = mix(col, c3, smoothstep(0.55, 1.0, t));
  col *= mix(0.5, 1.0, limb) * 1.55;
  gl_FragColor = vec4(col, 1.0);
}`;

export const atmoVertex = /* glsl */`
varying vec3 vNormalW;
varying vec3 vWorld;
void main(){
  vNormalW = normalize(mat3(modelMatrix) * normal);
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}`;

export const atmoFragment = /* glsl */`
uniform vec3 color;
uniform float strength;
uniform vec3 sunPos;
varying vec3 vNormalW;
varying vec3 vWorld;
void main(){
  vec3 N = normalize(vNormalW);
  vec3 V = normalize(cameraPosition - vWorld);
  vec3 L = normalize(sunPos - vWorld);
  float vn = clamp(dot(V, N), 0.0, 1.0);
  // Glühen nimmt zum Rand hin zu, läuft aber ganz außen weich aus (kein harter Ring)
  float rim = pow(1.0 - vn, 2.5) * smoothstep(0.0, 0.32, vn);
  float lit = smoothstep(-0.35, 0.5, dot(N, L));
  float a = rim * lit * strength * 1.6;
  gl_FragColor = vec4(color * a, a);
}`;

export const ringVertex = /* glsl */`
varying vec2 vUv;
varying vec3 vWorld;
varying vec3 vNormalW;
void main(){
  vUv = uv;
  vNormalW = normalize(mat3(modelMatrix) * normal);
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}`;

export const ringFragment = /* glsl */`
uniform sampler2D map;
uniform float hasMap;
uniform vec3 planetCenter;
uniform float planetRadius;
uniform vec3 sunPos;
varying vec2 vUv;
varying vec3 vWorld;
varying vec3 vNormalW;
void main(){
  vec4 tex = hasMap > 0.5 ? texture2D(map, vec2(vUv.x, 0.5)) : vec4(0.8, 0.72, 0.55, 0.5);
  vec3 L = normalize(sunPos - vWorld);
  // Schatten des Planeten auf dem Ring (Strahl Richtung Sonne trifft Kugel?)
  vec3 oc = vWorld - planetCenter;
  float b = dot(oc, L);
  float c = dot(oc, oc) - planetRadius * planetRadius;
  float h = b * b - c;
  float shadow = (h > 0.0 && b < 0.0) ? 1.0 - smoothstep(0.0, planetRadius * 0.15, h) * 0.9 : 1.0;
  float light = 0.55 + 0.45 * abs(dot(normalize(vNormalW), L));
  gl_FragColor = vec4(tex.rgb * light * shadow * 1.1, tex.a);
}`;

export const starVertex = /* glsl */`
attribute float size;
attribute float phase;
attribute vec3 color;
uniform float time;
uniform float pixelRatio;
varying vec3 vColor;
void main(){
  float tw = 0.78 + 0.22 * sin(time * (0.8 + fract(phase) * 1.6) + phase * 7.0);
  vColor = color * tw;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = size * pixelRatio;
}`;

export const starFragment = /* glsl */`
varying vec3 vColor;
void main(){
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d);
  gl_FragColor = vec4(vColor, a * a);
}`;
