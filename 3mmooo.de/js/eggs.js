// Easter Eggs: Fortschritt (nur lokal im Browser) und Texte in DE/EN.

const STORE = '3mmooo-eggs';

export const EGG_IDS = ['komet', 'mond', 'pluto', 'warp', 'zeitreise'];

const TEXT = {
  de: {
    found: (n, total) => `Easter Egg ${n} von ${total} gefunden`,
    again: 'Schon gefunden – aber schön, dich wiederzusehen.',
    all: 'Alle Easter Eggs gefunden! Du bist offiziell Astronaut:in 👩‍🚀',
    komet: {
      title: '☄️ Sternschnuppe! Wünsch dir was …',
      facts: [
        'Kometen sind schmutzige Schneebälle aus Eis, Staub und Gestein – übrig geblieben aus der Entstehung des Sonnensystems.',
        'Der Schweif zeigt immer von der Sonne weg, egal in welche Richtung der Komet fliegt. Schuld ist der Sonnenwind.',
        'Der Halleysche Komet kommt alle 75 bis 76 Jahre vorbei – das nächste Mal im Jahr 2061.',
        'Ein Kometenschweif kann über 100 Millionen Kilometer lang werden – weiter als von der Erde zur Sonne.',
        'Sternschnuppen sind meist winzige Staubkörner aus alten Kometenschweifen, die in unserer Atmosphäre verglühen.',
      ],
    },
    mond: {
      title: '🌕 Hallo Mond!',
      facts: [
        'Der Mond entfernt sich jedes Jahr etwa 3,8 cm von der Erde.',
        'Wir sehen immer dieselbe Seite des Mondes – er dreht sich genau einmal pro Umlauf um sich selbst.',
        'Auf dem Mond stehen noch die Fußabdrücke von Apollo 11 – ohne Wind verwehen sie nicht.',
      ],
    },
    pluto: { title: '🪐 Pluto entdeckt!', text: 'Der vergessene Zwergplanet ganz am Rand. Gut gesucht!' },
    warp: { title: '🚀 Warp-Antrieb aktiviert!', text: 'Der Konami-Code funktioniert auch im Weltall. Respekt, Gamer.' },
    zeitreise: {
      title: '⏳ Historischer Moment!',
      dates: {
        '1969-07-20': 'Mondlandung: „Ein kleiner Schritt für einen Menschen, ein riesiger Sprung für die Menschheit.“',
        '1930-02-18': 'An diesem Tag entdeckte Clyde Tombaugh den Pluto.',
        '1957-10-04': 'Sputnik 1 – der erste künstliche Satellit – startet ins All.',
        '1961-04-12': 'Juri Gagarin fliegt als erster Mensch ins Weltall.',
        '2061-07-28': 'Der Halleysche Komet ist zurück – zumindest ungefähr. Merk dir den Termin!',
      },
    },
  },
  en: {
    found: (n, total) => `Easter egg ${n} of ${total} found`,
    again: 'Already found – but nice to see you again.',
    all: 'All Easter eggs found! You are officially an astronaut 👩‍🚀',
    komet: {
      title: '☄️ Shooting star! Make a wish …',
      facts: [
        'Comets are dirty snowballs of ice, dust and rock – leftovers from the birth of the solar system.',
        'A comet’s tail always points away from the Sun, whichever way it flies. The solar wind pushes it.',
        'Halley’s Comet returns every 75 to 76 years – next time in 2061.',
        'A comet tail can be over 100 million kilometres long – farther than from Earth to the Sun.',
        'Shooting stars are mostly tiny dust grains from old comet tails burning up in our atmosphere.',
      ],
    },
    mond: {
      title: '🌕 Hello Moon!',
      facts: [
        'The Moon drifts about 3.8 cm farther from Earth every year.',
        'We always see the same side of the Moon – it rotates exactly once per orbit.',
        'Apollo 11’s footprints are still on the Moon – without wind, nothing blows them away.',
      ],
    },
    pluto: { title: '🪐 Pluto discovered!', text: 'The forgotten dwarf planet at the very edge. Nice find!' },
    warp: { title: '🚀 Warp drive engaged!', text: 'The Konami code works in space too. Respect, gamer.' },
    zeitreise: {
      title: '⏳ Historic moment!',
      dates: {
        '1969-07-20': 'Moon landing: “That’s one small step for man, one giant leap for mankind.”',
        '1930-02-18': 'On this day Clyde Tombaugh discovered Pluto.',
        '1957-10-04': 'Sputnik 1 – the first artificial satellite – launches into space.',
        '1961-04-12': 'Yuri Gagarin becomes the first human in space.',
        '2061-07-28': 'Halley’s Comet is back – roughly. Save the date!',
      },
    },
  },
};

export const EGG_DATES = Object.keys(TEXT.de.zeitreise.dates);

function load() {
  try { return new Set(JSON.parse(localStorage.getItem(STORE)) || []); } catch { return new Set(); }
}

export function createEggs({ toast, getLang }) {
  const found = load();
  const pick = (list) => list[Math.floor(Math.random() * list.length)];

  // id: welches Ei; extra: optionaler Zusatz (z. B. Datum bei der Zeitreise)
  let last = { key: '', at: 0 };
  function trigger(id, extra) {
    // dasselbe Ereignis kurz hintereinander nur einmal melden
    const key = id + (extra || '');
    if (key === last.key && performance.now() - last.at < 4000) return;
    last = { key, at: performance.now() };
    const t = TEXT[getLang()] || TEXT.de;
    const egg = t[id];
    let body = egg.text || '';
    if (egg.facts) body = pick(egg.facts);
    if (id === 'zeitreise') body = egg.dates[extra] || '';

    const isNew = !found.has(id);
    if (isNew) {
      found.add(id);
      try { localStorage.setItem(STORE, JSON.stringify([...found])); } catch {}
    }
    const allDone = found.size === EGG_IDS.length;
    const footer = isNew
      ? (allDone ? t.all : t.found(found.size, EGG_IDS.length))
      : (id === 'komet' || id === 'mond' ? '' : t.again);
    toast({ title: egg.title, body, footer, big: isNew && allDone });
  }

  return { trigger, get count() { return found.size; } };
}
