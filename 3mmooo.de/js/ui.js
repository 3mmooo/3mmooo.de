// HTML-Oberfläche: Sperrbildschirm-Uhr, Planeten-Labels, Dock, Info-Panel,
// Zeitreise, Sound- und Sprachumschalter.

import { EN, UI_TEXT } from './content.js';

const $ = (sel) => document.querySelector(sel);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const CHEVRON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const LANG_STORE = '3mmooo-lang';
const DAY = 86400000;

function detectLang() {
  const q = new URLSearchParams(location.search).get('lang');
  if (q === 'de' || q === 'en') return q;
  try {
    const saved = localStorage.getItem(LANG_STORE);
    if (saved === 'de' || saved === 'en') return saved;
  } catch {}
  return (navigator.language || 'de').toLowerCase().startsWith('de') ? 'de' : 'en';
}

export function createUI({ order, onSelect, onBack, onTravel, sound }) {
  const body = document.body;
  const panel = $('#panel');
  const panelInner = $('#panel .panel-inner');
  const dock = $('#dock');
  const hint = $('#hint');
  let lang = detectLang();
  let T = UI_TEXT[lang];
  let currentCfg = null;
  let travelDate = null;

  // Inhalte in der aktiven Sprache
  function tr(cfg) {
    const en = lang === 'en' && EN[cfg.id];
    if (!en) return cfg;
    return {
      ...cfg,
      name: en.name ?? cfg.name,
      section: en.section ?? cfg.section,
      text: (en.prepend || '') + (en.text ?? cfg.text ?? ''),
      chips: en.chips ?? cfg.chips,
      facts: en.facts ?? cfg.facts,
      links: cfg.links?.map((l, i) => ({
        ...l,
        title: en.linkTitles?.[i] ?? l.title,
        desc: en.links?.[i] ?? l.desc,
      })),
    };
  }

  // --- Uhr (wie auf dem iPhone-Sperrbildschirm) ---------------------------
  const timeEl = $('#lock .time');
  const dateEl = $('#lock .date');
  let fmtDate, fmtTime, fmtFull;
  function makeFormats() {
    fmtDate = new Intl.DateTimeFormat(T.locale, { weekday: 'long', day: 'numeric', month: 'long' });
    fmtTime = new Intl.DateTimeFormat(T.locale, { hour: '2-digit', minute: '2-digit' });
    fmtFull = new Intl.DateTimeFormat(T.locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }
  function tick() {
    if (travelDate) {
      timeEl.textContent = String(travelDate.getFullYear());
      dateEl.textContent = fmtFull.format(travelDate);
    } else {
      const now = new Date();
      timeEl.textContent = fmtTime.format(now);
      dateEl.textContent = fmtDate.format(now);
    }
  }
  setInterval(tick, 1000);

  // --- Dock (Schnellnavigation, wichtig fürs Handy) -----------------------
  function renderDock() {
    dock.innerHTML = '';
    for (const raw of order) {
      if (!raw.section) continue;
      const cfg = tr(raw);
      const b = document.createElement('button');
      b.className = 'dock-item';
      b.style.setProperty('--accent', cfg.accent);
      b.innerHTML = `<span class="dot"></span><span class="t">${esc(cfg.section)}</span>`;
      b.title = `${cfg.name} – ${cfg.section}`;
      b.addEventListener('click', () => onSelect(cfg.id));
      dock.appendChild(b);
    }
  }

  $('#back').addEventListener('click', onBack);
  $('#panel-close').addEventListener('click', onBack);

  // Handy: Bottom-Sheet nach unten wischen zum Schließen
  let swipe = null;
  panel.addEventListener('touchstart', (e) => {
    swipe = { y: e.touches[0].clientY, top: panelInner.scrollTop, fromGrip: !!e.target.closest('.grip') };
  }, { passive: true });
  panel.addEventListener('touchmove', (e) => {
    if (!swipe) return;
    const dy = e.touches[0].clientY - swipe.y;
    if (dy > 0 && (swipe.top <= 0 || swipe.fromGrip)) {
      panel.classList.add('dragging');
      panel.style.setProperty('--drag', Math.min(dy, 300) + 'px');
    }
  }, { passive: true });
  panel.addEventListener('touchend', () => {
    const dy = parseFloat(panel.style.getPropertyValue('--drag')) || 0;
    panel.style.removeProperty('--drag');
    panel.classList.remove('dragging');
    swipe = null;
    if (dy > 90) onBack();
  });

  let resetHandler = () => {};
  $('#recenter').addEventListener('click', () => resetHandler());

  // --- Sound --------------------------------------------------------------
  const soundBtn = $('#sound-btn');
  function renderSound() {
    soundBtn.setAttribute('aria-pressed', String(sound.on));
    soundBtn.classList.toggle('on', sound.on);
    soundBtn.title = sound.on ? T.soundOff : T.soundOn;
    soundBtn.setAttribute('aria-label', soundBtn.title);
  }
  soundBtn.addEventListener('click', () => { sound.toggle(); renderSound(); });
  if (sound.wanted) {
    // Browser erlauben Ton erst nach einer Interaktion
    const resume = () => { if (!sound.on) { sound.setOn(true); renderSound(); } };
    window.addEventListener('pointerdown', resume, { once: true, capture: true });
  }

  // --- Sprache ------------------------------------------------------------
  const langBtn = $('#lang-btn');
  function applyStaticTexts() {
    document.documentElement.lang = lang;
    hint.textContent = T.hint;
    $('#back span').textContent = T.back;
    $('#back').setAttribute('aria-label', T.back);
    $('#panel-close').setAttribute('aria-label', T.close);
    $('#recenter').setAttribute('aria-label', T.reset);
    $('#recenter').title = T.reset;
    langBtn.textContent = T.langShort;
    langBtn.title = T.lang;
    langBtn.setAttribute('aria-label', T.lang);
    $('#travel-btn span').textContent = T.travel;
    $('#travel-hint').textContent = T.travelHint;
    $('#travel-today').textContent = T.today;
  }
  function setLang(next) {
    lang = next;
    T = UI_TEXT[lang];
    try { localStorage.setItem(LANG_STORE, lang); } catch {}
    makeFormats();
    applyStaticTexts();
    renderDock();
    labels.forEach(({ el, cfg }) => renderLabel(el, cfg));
    renderSound();
    tick();
    if (currentCfg) renderPanel(currentCfg, true);
  }
  langBtn.addEventListener('click', () => setLang(lang === 'de' ? 'en' : 'de'));

  // --- Zeitreise ----------------------------------------------------------
  const travelBar = $('#travelbar');
  const travelRange = $('#travel-range');
  const travelInput = $('#travel-date');
  const today = () => { const d = new Date(); d.setHours(12, 0, 0, 0); return d; };
  const isoDate = (d) => `${String(d.getFullYear()).padStart(4, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  function travelTo(d, from) {
    travelDate = d;
    if (from !== 'range') travelRange.value = String(Math.round((d - today()) / DAY));
    if (from !== 'input') travelInput.value = isoDate(d);
    tick();
    onTravel(d);
  }
  function openTravel() {
    body.classList.add('traveling');
    travelBar.hidden = false;
    hideHint();
    travelTo(today());
    travelRange.focus({ preventScroll: true });
  }
  function closeTravel() {
    body.classList.remove('traveling');
    travelBar.hidden = true;
    travelDate = null;
    tick();
    onTravel(null);
  }
  $('#travel-btn').addEventListener('click', () => (travelBar.hidden ? openTravel() : closeTravel()));
  $('#travel-close').addEventListener('click', closeTravel);
  $('#travel-today').addEventListener('click', () => travelTo(today()));
  travelRange.addEventListener('input', () => travelTo(new Date(today().getTime() + Number(travelRange.value) * DAY), 'range'));
  travelInput.addEventListener('change', () => {
    const [y, m, d] = travelInput.value.split('-').map(Number);
    if (!y || !m || !d) return;
    const date = new Date(y, m - 1, d, 12);
    if (!Number.isNaN(date.getTime())) travelTo(date, 'input');
  });

  // --- Labels unter den Planeten ------------------------------------------
  const labels = [];
  function renderLabel(el, raw) {
    const cfg = tr(raw);
    el.innerHTML = `<span class="n">${esc(cfg.name)}</span>` +
      (cfg.section ? `<span class="s">${esc(cfg.section)}</span>` : '');
  }
  function makeLabel(cfg) {
    const el = document.createElement('button');
    el.className = 'label' + (cfg.section ? '' : ' minor') + (cfg.distance && cfg.distance < 20 ? ' inner' : '') + (cfg.hidden ? ' secret' : '');
    el.style.setProperty('--accent', cfg.accent);
    renderLabel(el, cfg);
    el.addEventListener('click', (e) => { e.stopPropagation(); onSelect(cfg.id); });
    labels.push({ el, cfg });
    return el;
  }

  // --- Panel --------------------------------------------------------------
  function renderPanel(raw, keepScroll = false) {
    currentCfg = raw;
    const cfg = tr(raw);
    const i = order.indexOf(raw);

    let html = `
      <p class="eyebrow">${esc(cfg.name)}</p>
      <h2>${esc(cfg.section || cfg.name)}</h2>
      <div class="text">${cfg.text || ''}</div>`;

    if (cfg.chips) {
      html += `<div class="chips">${cfg.chips.map((c) => `<span>${esc(c)}</span>`).join('')}</div>`;
    }

    if (cfg.nav) {
      html += '<div class="links">' + order.filter((o) => o.section && o !== raw).map((o) => tr(o)).map((o) => `
        <button class="link-card nav" data-go="${o.id}" style="--accent:${o.accent}">
          <span class="dot"></span>
          <span class="lc-text"><span class="t">${esc(o.section)}</span><span class="d">${esc(o.name)}</span></span>
          ${CHEVRON}
        </button>`).join('') + '</div>';
    }

    if (cfg.links) {
      html += '<div class="links">' + cfg.links.map((l) => l.soon ? `
        <div class="link-card soon">
          <span class="lc-text"><span class="t">${esc(l.title)}</span><span class="d">${esc(l.desc || '')}</span></span>
          <span class="badge">${esc(T.soon)}</span>
        </div>` : `
        <a class="link-card${l.highlight ? ' highlight' : ''}" href="${esc(l.url)}" ${l.internal ? '' : 'target="_blank" rel="noopener noreferrer"'}>
          <span class="lc-text"><span class="t">${esc(l.title)}</span><span class="d">${esc(l.desc || '')}</span></span>
          ${l.internal ? CHEVRON : ARROW}
        </a>`).join('') + '</div>';
    }

    if (cfg.facts) {
      html += '<dl class="facts">' + cfg.facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('') + '</dl>';
    }

    if (i >= 0) {
      const prev = tr(order[(i - 1 + order.length) % order.length]);
      const next = tr(order[(i + 1) % order.length]);
      html += `
        <nav class="pager">
          <button data-go="${prev.id}" class="prev"><span class="arrow">‹</span>${esc(prev.name)}</button>
          <button data-go="${next.id}" class="next">${esc(next.name)}<span class="arrow">›</span></button>
        </nav>`;
    }

    const top = panelInner.scrollTop;
    panelInner.innerHTML = html;
    panel.style.setProperty('--accent', cfg.accent);
    panelInner.scrollTop = keepScroll ? top : 0;
    panelInner.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => onSelect(b.dataset.go)));
  }

  let hintHidden = false;
  function hideHint() {
    if (hintHidden) return;
    hintHidden = true;
    hint.classList.add('hidden');
  }

  makeFormats();
  applyStaticTexts();
  renderDock();
  renderSound();
  tick();

  // --- Toast (Easter Eggs) ---------------------------------------------------
  const toastEl = $('#toast');
  let toastTimer = 0;
  function toast({ title, body: text, footer, big }) {
    toastEl.innerHTML = `<strong>${esc(title)}</strong>` +
      (text ? `<p>${esc(text)}</p>` : '') + (footer ? `<small>${esc(footer)}</small>` : '');
    toastEl.classList.toggle('big', !!big);
    toastEl.hidden = false;
    requestAnimationFrame(() => toastEl.classList.add('show'));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(hideToast, big ? 9000 : 6500);
  }
  function hideToast() {
    toastEl.classList.remove('show');
    setTimeout(() => { if (!toastEl.classList.contains('show')) toastEl.hidden = true; }, 400);
  }
  toastEl.addEventListener('click', hideToast);

  return {
    makeLabel,
    toast,
    get lang() { return lang; },
    onReset(fn) { resetHandler = fn; },
    setOffCenter(on) { body.classList.toggle('off-center', !!on); },
    hideHint,
    showPanel(cfg) {
      renderPanel(cfg);
      body.classList.add('focused');
      panel.setAttribute('aria-hidden', 'false');
      hideHint();
    },
    hidePanel() {
      currentCfg = null;
      body.classList.remove('focused');
      panel.setAttribute('aria-hidden', 'true');
    },
    ready() {
      body.classList.add('ready');
    },
    fallback() {
      body.classList.add('no-webgl');
    },
  };
}
