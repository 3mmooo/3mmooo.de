// Weltraum-Ambient komplett per Web Audio erzeugt (keine Audiodateien).
// Startet nur nach einem Klick (Browser erlauben keinen Autoplay mit Ton).

const STORE = '3mmooo-sound';

export function createSound() {
  let ctx = null, master = null, noiseBuf = null;
  let on = false;

  function build() {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    // weicher Hall durch zwei Delays mit Rückkopplung
    const delayL = ctx.createDelay(1.5), delayR = ctx.createDelay(1.5);
    delayL.delayTime.value = 0.43; delayR.delayTime.value = 0.61;
    const fb = ctx.createGain(); fb.gain.value = 0.38;
    const wet = ctx.createGain(); wet.gain.value = 0.5;
    const merger = ctx.createChannelMerger(2);
    delayL.connect(fb); delayR.connect(fb); fb.connect(delayL); fb.connect(delayR);
    delayL.connect(merger, 0, 0); delayR.connect(merger, 0, 1);
    merger.connect(wet); wet.connect(master);
    const bus = ctx.createGain();
    bus.connect(master); bus.connect(delayL); bus.connect(delayR);

    // Drone: tiefe Töne (A1, E2, A2, C#3) mit langsam atmendem Tiefpass
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass'; filter.frequency.value = 420; filter.Q.value = 6;
    filter.connect(bus);
    const lfo = ctx.createOscillator(), lfoGain = ctx.createGain();
    lfo.frequency.value = 0.05; lfoGain.gain.value = 260;
    lfo.connect(lfoGain); lfoGain.connect(filter.frequency); lfo.start();
    [[55, 'sine', 0.32], [82.41, 'sine', 0.18], [110.3, 'triangle', 0.09], [138.6, 'sine', 0.05]].forEach(([f, type, g], i) => {
      const o = ctx.createOscillator(), gain = ctx.createGain();
      o.type = type; o.frequency.value = f; o.detune.value = (i - 1.5) * 4;
      gain.gain.value = g;
      // jede Stimme schwillt langsam an und ab
      const sw = ctx.createOscillator(), swg = ctx.createGain();
      sw.frequency.value = 0.03 + i * 0.017; swg.gain.value = g * 0.6;
      sw.connect(swg); swg.connect(gain.gain); sw.start();
      o.connect(gain); gain.connect(filter); o.start();
    });

    // Sonnenwind: gefiltertes Rauschen
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < d.length; i++) { last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02; d[i] = last * 3.5; }
    const wind = ctx.createBufferSource(); wind.buffer = noiseBuf; wind.loop = true;
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 700; bp.Q.value = 0.8;
    const wg = ctx.createGain(); wg.gain.value = 0.05;
    const wl = ctx.createOscillator(), wlg = ctx.createGain();
    wl.frequency.value = 0.07; wlg.gain.value = 400; wl.connect(wlg); wlg.connect(bp.frequency); wl.start();
    wind.connect(bp); bp.connect(wg); wg.connect(bus); wind.start();
  }

  function setOn(v) {
    on = v;
    try { localStorage.setItem(STORE, on ? '1' : '0'); } catch {}
    if (on) {
      if (!ctx) build();
      ctx.resume();
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setTargetAtTime(0.32, ctx.currentTime, 1.2);
    } else if (ctx) {
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setTargetAtTime(0, ctx.currentTime, 0.4);
      setTimeout(() => { if (!on) ctx.suspend(); }, 2000);
    }
  }

  // Rauschen beim Fliegen: Bandpass gleitet hoch und wieder runter
  function whoosh(duration = 2) {
    if (!on || !ctx) return;
    const t = ctx.currentTime, d = Math.max(0.6, duration);
    const src = ctx.createBufferSource(); src.buffer = noiseBuf;
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 1.4;
    bp.frequency.setValueAtTime(180, t);
    bp.frequency.exponentialRampToValueAtTime(1600, t + d * 0.45);
    bp.frequency.exponentialRampToValueAtTime(220, t + d);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.5, t + d * 0.45);
    g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    src.connect(bp); bp.connect(g); g.connect(master);
    src.start(t); src.stop(t + d + 0.1);
  }

  let wanted = false;
  try { wanted = localStorage.getItem(STORE) === '1'; } catch {}

  return {
    get on() { return on; },
    // war beim letzten Besuch an -> beim ersten Tippen wieder einschalten
    get wanted() { return wanted; },
    toggle() { setOn(!on); return on; },
    setOn,
    whoosh,
  };
}
