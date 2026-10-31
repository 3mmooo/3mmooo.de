// Inhalte & Planetendaten für 3mmooo.de
// -------------------------------------------------------------
// Hier kannst du Texte, Links und Zuordnungen anpassen, ohne den
// 3D-Code anfassen zu müssen. Jeder Eintrag ist ein Himmelskörper.
//
//   section  -> Name des Bereichs (null = nur Planeten-Infos)
//   text     -> Absatz(e) im Panel (HTML erlaubt)
//   links    -> Karten mit Titel, Beschreibung und URL
//   chips    -> kleine Schlagwort-Kacheln
//   facts    -> echte astronomische Daten (werden unten angezeigt)
//
// Visuelle Werte (radius, distance …) sind bewusst NICHT maßstabsgetreu,
// sondern so gewählt, dass alles schön auf den Bildschirm passt.

export const SUN = {
  id: 'sonne',
  name: 'Sonne',
  section: 'Willkommen',
  accent: '#ffb347',
  radius: 6,
  text: `
    <p>Willkommen auf <strong>3mmooo.de</strong> – meinem kleinen Sonnensystem rund um
    IT, Netzwerke und IT-Security.</p>
    <p>Jeder Planet ist ein Bereich der Seite. Tippe einen an und flieg hin.</p>`,
  nav: true, // zeigt eine Liste aller Bereiche
  facts: [
    ['Durchmesser', '1,39 Mio. km'],
    ['Oberfläche', '≈ 5.500 °C'],
    ['Alter', '4,6 Mrd. Jahre'],
    ['Licht zur Erde', '8 min 20 s'],
  ],
};

export const PLANETS = [
  {
    id: 'merkur',
    name: 'Merkur',
    section: null,
    accent: '#b9b2a8',
    texture: 'mercury',
    radius: 0.75,
    distance: 13,
    tilt: 0.03,
    spin: 0.05,
    // mittlere Länge (J2000, Grad) und Bewegung (Grad/Tag) – für die echte Stellung heute
    L0: 252.25, n: 4.09233,
    text: `<p>Der kleinste Planet des Sonnensystems – und trotzdem nicht der heißeste.
      Tagsüber über 400 °C, nachts −180 °C.</p>`,
    facts: [
      ['Durchmesser', '4.879 km'],
      ['Abstand zur Sonne', '57,9 Mio. km'],
      ['Umlaufzeit', '88 Tage'],
      ['Tageslänge', '176 Erdtage'],
    ],
  },
  {
    id: 'venus',
    name: 'Venus',
    section: null,
    accent: '#e8c27a',
    texture: 'venus',
    radius: 1.25,
    distance: 18.5,
    tilt: 3.09,
    spin: -0.02,
    atmosphere: { color: '#ffd89a', strength: 0.9 },
    L0: 181.98, n: 1.60213,
    text: `<p>Ein Tag auf der Venus dauert länger als ein Jahr – und sie dreht sich
      rückwärts. Unter der dichten Wolkendecke ist sie der heißeste Planet.</p>`,
    facts: [
      ['Durchmesser', '12.104 km'],
      ['Abstand zur Sonne', '108,2 Mio. km'],
      ['Umlaufzeit', '225 Tage'],
      ['Oberfläche', '≈ 465 °C'],
    ],
  },
  {
    id: 'erde',
    name: 'Erde',
    section: 'About Me',
    accent: '#5aa9ff',
    texture: 'earth',
    radius: 1.35,
    distance: 25,
    tilt: 0.41,
    spin: 0.12,
    clouds: true,
    moon: true,
    atmosphere: { color: '#6fb6ff', strength: 1.4 },
    L0: 100.46, n: 0.98561,
    // TODO: Text über dich anpassen
    text: `
      <p>Hi! Hier auf der Erde wohne ich. 👋</p>
      <p>Ich beschäftige mich mit IT-Administration, Netzwerken und IT-Security –
      vom Verteidigen (Blue Teaming) bis zum Angreifen im erlaubten Rahmen (Red Teaming).
      Viele meiner Werkzeuge schreibe ich selbst.</p>`,
    chips: ['PowerShell', 'Python', 'Netzwerk-Management', 'Active Directory', 'IT-Security'],
    links: [
      { title: 'LinkedIn', desc: 'Lebenslauf & Kontakt', url: 'https://linkedin.com/in/emrah-yamak' },
    ],
    facts: [
      ['Durchmesser', '12.742 km'],
      ['Abstand zur Sonne', '149,6 Mio. km'],
      ['Umlaufzeit', '365,25 Tage'],
      ['Tageslänge', '24 h'],
    ],
  },
  {
    id: 'mars',
    name: 'Mars',
    section: 'Red Teaming',
    accent: '#ff6b4a',
    texture: 'mars',
    radius: 1.0,
    distance: 31.5,
    tilt: 0.44,
    spin: 0.11,
    atmosphere: { color: '#ff9b73', strength: 0.5 },
    L0: 355.45, n: 0.52403,
    text: `<p>Der rote Planet – Werkzeuge und Ressourcen für offensive Sicherheit.</p>
      <p class="note">Nur für autorisierte Tests und Lernzwecke verwenden.</p>`,
    links: [
      { title: 'Hack the Mars Base', desc: 'CTF-Challenge: knacke den Login in 5 Leveln', url: 'hack.html', internal: true, highlight: true },
      { title: 'Kali Linux', desc: 'Distribution für Penetrationstests', url: 'https://www.kali.org/' },
      { title: 'Reverse Shell Generator', desc: 'Reverse-Shell-Payloads für Pentests erzeugen', url: 'https://revshells.com/' },
      { title: 'ASCII Generator', desc: 'Text in ASCII-Art umwandeln', url: 'https://ascii-generator.site/' },
    ],
    facts: [
      ['Durchmesser', '6.779 km'],
      ['Abstand zur Sonne', '227,9 Mio. km'],
      ['Umlaufzeit', '687 Tage'],
      ['Tageslänge', '24 h 37 min'],
    ],
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    section: 'Blue Teaming',
    accent: '#f2b880',
    texture: 'jupiter',
    radius: 3.3,
    distance: 43,
    tilt: 0.05,
    spin: 0.3,
    atmosphere: { color: '#ffd9b0', strength: 0.55 },
    L0: 34.40, n: 0.08309,
    text: `<p>Der größte Planet beschützt die inneren Planeten vor Kometen –
      passend für die Werkzeuge zur Verteidigung.</p>`,
    links: [
      { title: 'URL-Checker', desc: 'Verkürzte URLs prüfen und enttarnen', url: 'https://urlxray.com' },
      { title: 'VirusTotal', desc: 'Dateien & Links auf Schadsoftware prüfen', url: 'https://www.virustotal.com/gui/home/upload' },
      { title: 'Have I Been Pwned?', desc: 'Prüfen, ob deine Daten in Leaks auftauchen', url: 'https://haveibeenpwned.com' },
      { title: 'Rapid7 DB', desc: 'Vulnerability- & Exploit-Datenbank', url: 'https://www.rapid7.com/db/' },
      { title: 'Exploit DB', desc: 'Öffentliche Exploits & Sicherheitslücken', url: 'https://www.exploit-db.com/' },
    ],
    facts: [
      ['Durchmesser', '139.820 km'],
      ['Abstand zur Sonne', '778,5 Mio. km'],
      ['Umlaufzeit', '11,9 Jahre'],
      ['Tageslänge', '9 h 56 min'],
    ],
  },
  {
    id: 'saturn',
    name: 'Saturn',
    section: 'Games',
    accent: '#e9d29a',
    texture: 'saturn',
    radius: 2.8,
    distance: 56,
    tilt: 0.47,
    spin: 0.28,
    ring: true,
    atmosphere: { color: '#ffe9b8', strength: 0.45 },
    L0: 49.94, n: 0.03346,
    text: `<p>Der Herr der Ringe – und Heimat der Spiele.</p>`,
    links: [
      { title: 'Snake', desc: 'Der Klassiker – mit Highscore', url: 'snake.html', internal: true },
    ],
    facts: [
      ['Durchmesser', '116.460 km'],
      ['Abstand zur Sonne', '1,43 Mrd. km'],
      ['Umlaufzeit', '29,4 Jahre'],
      ['Tageslänge', '10 h 33 min'],
    ],
  },
  {
    id: 'uranus',
    name: 'Uranus',
    section: 'NetTools',
    accent: '#8fe3ea',
    texture: 'uranus',
    radius: 1.9,
    distance: 68,
    tilt: 1.71,
    spin: -0.18,
    atmosphere: { color: '#b5f3ff', strength: 0.8 },
    L0: 313.23, n: 0.01173,
    // TODO: Beschreibungen und Download-Links eintragen, sobald die Dateien online sind
    text: `<p>Eigene Netzwerk- und Admin-Tools. Die Python-Tools gibt es mit Quellcode auf GitHub.</p>`,
    links: [
      { title: 'SubCalculator', desc: 'Subnetz-Rechner', soon: true },
      { title: 'NiP-NWTool', desc: 'Netzwerk-Tool', soon: true },
      { title: 'DuD-NWTool', desc: 'Netzwerk-Tool', soon: true },
      { title: 'AD-Tool', desc: 'Active-Directory-Tool', soon: true },
      { title: 'PortChecker', desc: 'Python-GUI: IP-Bereiche auf offene Ports scannen', url: 'https://github.com/3mmooo/Portchecker' },
      { title: 'FontChecker', desc: 'Python-GUI: Schriftarten, Größen & Farben testen', url: 'https://github.com/3mmooo/fontchecker' },
      { title: 'Scropy', desc: 'Text aus dem neuesten Screenshot per OCR kopieren', url: 'https://github.com/3mmooo/-Scropy' },
    ],
    facts: [
      ['Durchmesser', '50.724 km'],
      ['Abstand zur Sonne', '2,87 Mrd. km'],
      ['Umlaufzeit', '84 Jahre'],
      ['Tageslänge', '17 h 14 min'],
    ],
  },
  {
    id: 'neptun',
    name: 'Neptun',
    section: 'Impressum',
    accent: '#6f8cff',
    texture: 'neptune',
    radius: 1.85,
    distance: 79,
    tilt: 0.49,
    spin: 0.19,
    atmosphere: { color: '#7fa2ff', strength: 1.0 },
    L0: 304.88, n: 0.00598,
    // TODO: Impressum mit deinen echten Angaben füllen (Pflicht für Websites in Deutschland)
    text: `
      <h3>Impressum</h3>
      <p>Angaben gemäß § 5 DDG</p>
      <p>[Vor- und Nachname]<br>[Straße Hausnummer]<br>[PLZ Ort]</p>
      <p>E-Mail: [E-Mail-Adresse]</p>
      <h3>Datenschutz</h3>
      <p>Diese Seite setzt keine Cookies und nutzt kein Tracking. Alle Dateien
      (auch die 3D-Bibliothek) werden direkt von diesem Server geladen – es werden
      beim Aufruf keine Daten an Dritte übertragen. Der Highscore von Snake wird nur
      lokal in deinem Browser gespeichert.</p>
      <p>Externe Links öffnen fremde Websites, für deren Inhalte die jeweiligen
      Betreiber verantwortlich sind.</p>`,
    facts: [
      ['Durchmesser', '49.244 km'],
      ['Abstand zur Sonne', '4,5 Mrd. km'],
      ['Umlaufzeit', '165 Jahre'],
      ['Tageslänge', '16 h 6 min'],
    ],
  },
];
