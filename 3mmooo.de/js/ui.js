// HTML-Oberfläche: Sperrbildschirm-Uhr, Planeten-Labels, Dock, Info-Panel.

const $ = (sel) => document.querySelector(sel);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const CHEVRON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

export function createUI({ order, onSelect, onBack }) {
  const body = document.body;
  const panel = $('#panel');
  const panelInner = $('#panel .panel-inner');
  const dock = $('#dock');
  const hint = $('#hint');

  // --- Uhr (wie auf dem iPhone-Sperrbildschirm) ---------------------------
  const timeEl = $('#lock .time');
  const dateEl = $('#lock .date');
  const fmtDate = new Intl.DateTimeFormat('de-DE', { weekday: 'long', day: 'numeric', month: 'long' });
  const fmtTime = new Intl.DateTimeFormat('de-DE', { hour: '2-digit', minute: '2-digit' });
  function tick() {
    const now = new Date();
    timeEl.textContent = fmtTime.format(now);
    dateEl.textContent = fmtDate.format(now);
  }
  tick();
  setInterval(tick, 1000);

  // --- Dock (Schnellnavigation, wichtig fürs Handy) -----------------------
  for (const cfg of order) {
    if (!cfg.section) continue;
    const b = document.createElement('button');
    b.className = 'dock-item';
    b.style.setProperty('--accent', cfg.accent);
    b.innerHTML = `<span class="dot"></span><span class="t">${esc(cfg.section)}</span>`;
    b.title = `${cfg.name} – ${cfg.section}`;
    b.addEventListener('click', () => onSelect(cfg.id));
    dock.appendChild(b);
  }

  $('#back').addEventListener('click', onBack);

  // --- Labels unter den Planeten ------------------------------------------
  function makeLabel(cfg) {
    const el = document.createElement('button');
    el.className = 'label' + (cfg.section ? '' : ' minor');
    el.style.setProperty('--accent', cfg.accent);
    el.innerHTML = `<span class="n">${esc(cfg.name)}</span>` +
      (cfg.section ? `<span class="s">${esc(cfg.section)}</span>` : '');
    el.addEventListener('click', (e) => { e.stopPropagation(); onSelect(cfg.id); });
    return el;
  }

  // --- Panel --------------------------------------------------------------
  function renderPanel(cfg) {
    const i = order.indexOf(cfg);
    const prev = order[(i - 1 + order.length) % order.length];
    const next = order[(i + 1) % order.length];

    let html = `
      <button class="close" aria-label="Zurück zur Übersicht">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>
      </button>
      <p class="eyebrow">${esc(cfg.name)}</p>
      <h2>${esc(cfg.section || cfg.name)}</h2>
      <div class="text">${cfg.text || ''}</div>`;

    if (cfg.chips) {
      html += `<div class="chips">${cfg.chips.map((c) => `<span>${esc(c)}</span>`).join('')}</div>`;
    }

    if (cfg.nav) {
      html += '<div class="links">' + order.filter((o) => o.section && o !== cfg).map((o) => `
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
          <span class="badge">Download folgt</span>
        </div>` : `
        <a class="link-card${l.highlight ? ' highlight' : ''}" href="${esc(l.url)}" ${l.internal ? '' : 'target="_blank" rel="noopener noreferrer"'}>
          <span class="lc-text"><span class="t">${esc(l.title)}</span><span class="d">${esc(l.desc || '')}</span></span>
          ${l.internal ? CHEVRON : ARROW}
        </a>`).join('') + '</div>';
    }

    if (cfg.facts) {
      html += '<dl class="facts">' + cfg.facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('') + '</dl>';
    }

    html += `
      <nav class="pager">
        <button data-go="${prev.id}" class="prev"><span class="arrow">‹</span>${esc(prev.name)}</button>
        <button data-go="${next.id}" class="next">${esc(next.name)}<span class="arrow">›</span></button>
      </nav>`;

    panelInner.innerHTML = html;
    panel.style.setProperty('--accent', cfg.accent);
    panelInner.scrollTop = 0;
    panelInner.querySelector('.close').addEventListener('click', onBack);
    panelInner.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => onSelect(b.dataset.go)));
  }

  let hintHidden = false;
  function hideHint() {
    if (hintHidden) return;
    hintHidden = true;
    hint.classList.add('hidden');
  }

  return {
    makeLabel,
    hideHint,
    showPanel(cfg) {
      renderPanel(cfg);
      body.classList.add('focused');
      panel.setAttribute('aria-hidden', 'false');
      hideHint();
    },
    hidePanel() {
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
