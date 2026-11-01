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
    IT-Security, eigene Software und Browserspiele.</p>
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
    section: 'Referenzen',
    accent: '#b9b2a8',
    texture: 'mercury',
    radius: 0.75,
    distance: 13,
    tilt: 0.03,
    spin: 0.05,
    // mittlere Länge (J2000, Grad) und Bewegung (Grad/Tag) – für die echte Stellung heute
    L0: 252.25, n: 4.09233,
    text: `<p>Der schnellste Planet – passend für Projekte, die ich für Kundinnen und Kunden
      gebaut habe. Websites, Bestell- und Buchungsplattformen, alles live im Betrieb.</p>`,
    links: [
      { title: 'Notna Spice', desc: 'Bestellplattform · treevio.de', url: 'https://treevio.de/' },
      { title: 'BarberSino', desc: 'Online-Buchung für Barbershops', url: 'https://barbersino.de/' },
      { title: 'Kilic Dachtechnik', desc: 'Website', url: 'https://www.kilic-dachtechnik.de/' },
      { title: 'NIALMA', desc: 'Website', url: 'https://nialma.com/' },
      { title: 'Rhein Verpackung', desc: 'Shop mit 3D-Konfigurator (Demo)', url: 'https://eysec.de/rhein-verpackung/' },
      { title: 'Kilic Immobilien', desc: 'Website', url: 'https://eysec.de/immo/' },
      { title: 'Alle Referenzen auf eysec.de', desc: 'Mit Hintergründen zu jedem Projekt', url: 'https://eysec.de/#referenzen' },
    ],
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
    section: 'Projekte',
    accent: '#e8c27a',
    texture: 'venus',
    radius: 1.25,
    distance: 18.5,
    tilt: 3.09,
    spin: -0.02,
    atmosphere: { color: '#ffd89a', strength: 0.9 },
    L0: 181.98, n: 1.60213,
    text: `<p>Meine eigene Software für Betriebe – die 3vio-Familie und Dinervio.
      Mit echten Kunden, Preisen und Testphasen.</p>`,
    links: [
      { title: 'Fonavio', desc: 'KI-Telefonagent: nimmt jeden Anruf an, rund um die Uhr', url: 'https://fonavio.de/' },
      { title: 'Billavio', desc: 'Büro-Software fürs Handwerk: Angebote, E-Rechnung, DATEV', url: 'https://billavio.de/' },
      { title: 'Rotavio', desc: 'Dienstplan-Generator mit Regelprüfung', url: 'https://rotavio.de/' },
      { title: 'Dinervio', desc: 'Bestellshops für Restaurants – 0 % Provision', url: 'https://dinervio.de/' },
      { title: '3vio', desc: 'Die Software-Familie für Betriebe', url: 'https://3vio.de/' },
    ],
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
    text: `
      <p><strong>Emrah Yamak</strong> – Entwickler, Cybersecurity und Datenschutzbeauftragter aus Meerbusch.</p>
      <p>Im IT-Support und Second-Level-Support habe ich jeden Tag erlebt, woran Software im Alltag
      scheitert: an Abläufen, die keiner zu Ende gedacht hat, an Fehlern, die niemand nachvollziehen kann,
      und an Sicherheitslücken, die erst auffallen, wenn es zu spät ist.</p>
      <p>Darum habe ich mich zur Fachkraft für Systemadministration und Cybersecurity weitergebildet.
      Heute baue ich mit <strong>eysec</strong> eigene Software, Plattformen, Websites und Browserspiele –
      Sicherheit und Datenschutz von Anfang an mitgedacht.</p>
      <ol class="timeline">
        <li><span>Support</span>IT-Support &amp; Second-Level-Support</li>
        <li><span>2023 – 2024</span>Fachkraft Systemadministration &amp; Cybersecurity: Netzwerk- und Serversicherheit, Penetration Testing, Bedrohungsmodellierung</li>
        <li><span>2024</span>IT-Sicherheitsbeauftragter (ISO 27001), BSI IT-Grundschutz-Praktiker, Datenschutzbeauftragter (IHK)</li>
        <li><span>heute</span>eysec · eigene Software &amp; Kundenprojekte</li>
      </ol>`,
    chips: ['ISO 27001', 'BSI IT-Grundschutz', 'Datenschutz (IHK)', 'Penetration Testing', 'PowerShell', 'Python'],
    links: [
      { title: 'eysec.de', desc: 'Software & Websites nach Maß aus Meerbusch', url: 'https://eysec.de/' },
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
    text: `<p>Der Herr der Ringe – und Heimat der Spiele. Alle laufen direkt im Browser,
      auch auf dem Handy.</p>`,
    links: [
      { title: 'GameStation', desc: 'Alle Spiele auf einen Blick', url: 'https://eysec.de/GameStation/', highlight: true },
      { title: 'Ki-Krieger Arena', desc: '3D-Kampfspiel mit Superattacken, Fliegen und Online-Kämpfen zu viert', url: 'https://eysec.de/KiArena/' },
      { title: 'Kinderzimmer-Kommando', desc: 'Flieger-Shooter durch sechs Räume, im Team oder im Wettkampf', url: 'https://eysec.de/KinderzimmerKommando/' },
      { title: 'Konuş İdris', desc: 'Ein 3D-Tier, das alles nachplappert', url: 'https://eysec.de/Konusidris/' },
      { title: 'Klotzland', desc: 'Baukasten-Welt mit Höhlen, Monstern und deiner echten Straße', url: 'https://eysec.de/Klotzland/' },
      { title: 'Ki-Krieger', desc: 'Überleben bis zum Morgengrauen, Story mit fünf Welten', url: 'https://eysec.de/Kikrieger/' },
      { title: 'Döner Runner', desc: 'Fladenbrot vollstapeln, Messern ausweichen – 60 Level', url: 'https://eysec.de/DR/' },
      { title: 'Ameisen-Armee', desc: 'Eine riesige Kolonie sammeln und den Hügel stürmen', url: 'https://eysec.de/ArmeisenArme/' },
      { title: 'Mampfisch', desc: 'Kleinere Fische fressen und wachsen – bis zum Leviathan', url: 'https://eysec.de/Mampfisch/' },
      { title: 'Burgsturm', desc: 'Ein Ritterheer sammeln und die Burg stürmen', url: 'https://eysec.de/Burgsturm/' },
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
    text: `<p>Netzwerk-Werkzeuge, die direkt im Browser laufen – plus meine Python-Tools mit
      Quellcode auf GitHub.</p>`,
    links: [
      { title: 'NetTools öffnen', desc: 'Alle Werkzeuge auf einer Seite', url: 'nettools.html', internal: true, highlight: true },
      { title: 'Subnetzrechner', desc: 'IPv4 & IPv6: Netz, Broadcast, Hosts, Aufteilen', url: 'nettools.html#subnetz', internal: true },
      { title: 'DNS & E-Mail-Sicherheit', desc: 'DNS-Einträge abfragen, SPF und DMARC prüfen', url: 'nettools.html#dns', internal: true },
      { title: 'Ports & Nmap-Baukasten', desc: 'Port-Lexikon und Nmap-Befehle für eigene Scans', url: 'nettools.html#ports', internal: true },
      { title: 'Passwort-Generator', desc: 'Sichere Passwörter & Passphrasen mit Stärke-Check', url: 'nettools.html#passwort', internal: true },
      { title: 'Encoder & JWT', desc: 'Base64, URL, Hex, Hashes und JWT-Decoder', url: 'nettools.html#encoder', internal: true },
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
    text: `
      <p>Angaben gemäß § 5 DDG</p>
      <p>Emrah Yamak<br>eysec<br>Hochstr. 29<br>40670 Meerbusch<br>Deutschland</p>
      <p>E-Mail: <a href="mailto:kontakt@3vio.de">kontakt@3vio.de</a></p>
      <p>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV:<br>Emrah Yamak, Hochstr. 29, 40670 Meerbusch</p>
      <h3>Verbraucherstreitbeilegung</h3>
      <p>Ich bin nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer
      Verbraucherschlichtungsstelle teilzunehmen.</p>
      <h3>Haftung für Inhalte</h3>
      <p>Als Diensteanbieter bin ich gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten nach den
      allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG bin ich jedoch nicht verpflichtet,
      übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen,
      die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der
      Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine Haftung ist
      erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich; entsprechende Inhalte
      entferne ich dann umgehend.</p>
      <h3>Haftung für Links</h3>
      <p>Diese Seite verweist auf Websites, die ich für Kunden gebaut habe oder selbst betreibe, sowie auf
      externe Angebote. Für die Inhalte verlinkter Seiten sind die jeweiligen Anbieter verantwortlich.
      Zum Zeitpunkt der Verlinkung waren keine Rechtsverstöße erkennbar; bei Bekanntwerden entferne ich
      solche Links umgehend.</p>
      <h3>Urheberrecht</h3>
      <p>Texte, Gestaltung und Programmcode dieser Seite unterliegen dem deutschen Urheberrecht.
      Vervielfältigung und Verwertung außerhalb der Grenzen des Urheberrechts bedürfen der schriftlichen
      Zustimmung.</p>
      <h3>Datenschutz</h3>
      <p>Diese Seite setzt keine Tracking- oder Werbe-Cookies und bindet keine externen Dienste ein.
      Alle Dateien (auch die 3D-Bibliothek) werden vom Webserver dieser Seite geladen.</p>
      <p>Hosting: Die Seite wird über GitHub Pages der GitHub, Inc. (USA) bereitgestellt. Beim Aufruf
      verarbeitet GitHub technisch notwendige Verbindungsdaten wie die IP-Adresse, um die Seite
      auszuliefern und abzusichern. Details: <a href="https://docs.github.com/de/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener noreferrer">Datenschutzerklärung von GitHub</a>.</p>
      <p>Der Highscore von Snake, der Fortschritt der Hacking-Challenge und deine Einstellungen
      (Sprache, Sound) werden nur lokal in deinem Browser gespeichert. Die Challenge setzt während des
      Spiels ein technisch notwendiges Cookie (<code>mars_session</code>), das deinen Browser nicht verlässt.
      Damit die Seite auch offline startet, legt dein Browser eine Kopie der Dateien in seinem Cache ab.</p>
      <p>NetTools: Nur wenn du dort ausdrücklich auf „DNS abfragen“ oder „Meine IP anzeigen“ klickst,
      wird eine Anfrage an Cloudflare (1.1.1.1) bzw. ipify gesendet. Alle anderen Werkzeuge laufen nur in
      deinem Browser.</p>
      <p>Ausführliche Informationen und deine Rechte: <a href="https://eysec.de/datenschutz.html" target="_blank" rel="noopener noreferrer">Datenschutzerklärung auf eysec.de</a>.</p>`,
    facts: [
      ['Durchmesser', '49.244 km'],
      ['Abstand zur Sonne', '4,5 Mrd. km'],
      ['Umlaufzeit', '165 Jahre'],
      ['Tageslänge', '16 h 6 min'],
    ],
  },
  {
    // Easter Egg: kein Label, nicht im Dock – man muss ihn selbst finden
    id: 'pluto',
    name: 'Pluto',
    section: 'Geheimversteck',
    hidden: true,
    accent: '#e3c9a8',
    texture: 'pluto',
    radius: 0.55,
    distance: 96,
    inclination: 0.3, // ~17° geneigte Bahn
    tilt: 2.1,
    spin: 0.04,
    L0: 238.93, n: 0.00397,
    text: `<p>Glückwunsch, du hast Pluto gefunden! 🎉 Seit 2006 ist er offiziell kein Planet mehr –
      hier hat er trotzdem seinen Platz behalten.</p>
      <p>Wusstest du? Pluto ist kleiner als unser Mond, und ein Jahr dauert dort 248 Erdjahre.
      Seit seiner Entdeckung 1930 hat er die Sonne noch nicht einmal umrundet.</p>`,
    facts: [
      ['Durchmesser', '2.377 km'],
      ['Abstand zur Sonne', '5,9 Mrd. km'],
      ['Umlaufzeit', '248 Jahre'],
      ['Herz', 'Tombaugh Regio'],
    ],
  },
];

// ---------------------------------------------------------------
// Englische Version: überschreibt die Texte oben, wenn EN aktiv ist.
// links: Liste der Beschreibungen in derselben Reihenfolge wie oben.
export const EN = {
  sonne: {
    name: 'Sun', section: 'Welcome',
    text: `<p>Welcome to <strong>3mmooo.de</strong> – my little solar system about IT security,
      my own software and browser games.</p>
      <p>Every planet is a section of this site. Tap one and fly there.</p>`,
    facts: [['Diameter', '1.39 million km'], ['Surface', '≈ 5,500 °C'], ['Age', '4.6 billion years'], ['Light to Earth', '8 min 20 s']],
  },
  merkur: {
    name: 'Mercury', section: 'References',
    text: `<p>The fastest planet – for projects I built for clients. Websites, ordering and booking
      platforms, all live in production.</p>`,
    links: ['Ordering platform · treevio.de', 'Online booking for barbershops', 'Website', 'Website',
      'Shop with 3D configurator (demo)', 'Website', 'Background on every project'],
    linkTitles: { 6: 'All references on eysec.de' },
    facts: [['Diameter', '4,879 km'], ['Distance to Sun', '57.9 million km'], ['Orbit', '88 days'], ['Day length', '176 Earth days']],
  },
  venus: {
    name: 'Venus', section: 'Products',
    text: `<p>My own software for businesses – the 3vio family and Dinervio. With real customers,
      prices and trial periods.</p>`,
    links: ['AI phone agent: answers every call, around the clock', 'Office software for trades: quotes, e-invoicing, DATEV',
      'Shift-schedule generator with rule checks', 'Ordering shops for restaurants – 0 % commission', 'The software family for businesses'],
    facts: [['Diameter', '12,104 km'], ['Distance to Sun', '108.2 million km'], ['Orbit', '225 days'], ['Surface', '≈ 465 °C']],
  },
  erde: {
    name: 'Earth', section: 'About Me',
    text: `<p><strong>Emrah Yamak</strong> – developer, cybersecurity specialist and data protection officer from Meerbusch, Germany.</p>
      <p>Working in IT support and second-level support, I saw every day where software fails in real life:
      processes nobody thought through, bugs nobody can reproduce, and security holes that only show up
      when it is too late.</p>
      <p>So I trained as a specialist in system administration and cybersecurity. Today I build my own
      software, platforms, websites and browser games with <strong>eysec</strong> – with security and
      privacy built in from day one.</p>
      <ol class="timeline">
        <li><span>Support</span>IT support &amp; second-level support</li>
        <li><span>2023 – 2024</span>System administration &amp; cybersecurity specialist: network and server security, penetration testing, threat modelling</li>
        <li><span>2024</span>Information security officer (ISO 27001), BSI IT-Grundschutz practitioner, data protection officer (IHK)</li>
        <li><span>Today</span>eysec · own software &amp; client projects</li>
      </ol>`,
    chips: ['ISO 27001', 'BSI IT-Grundschutz', 'Data protection (IHK)', 'Penetration testing', 'PowerShell', 'Python'],
    links: ['Custom software & websites from Meerbusch', 'CV & contact'],
    facts: [['Diameter', '12,742 km'], ['Distance to Sun', '149.6 million km'], ['Orbit', '365.25 days'], ['Day length', '24 h']],
  },
  mars: {
    name: 'Mars', section: 'Red Teaming',
    text: `<p>The red planet – tools and resources for offensive security.</p>
      <p class="note">Only for authorised tests and learning.</p>`,
    links: ['CTF challenge: crack the login in 5 levels (German)', 'Distribution for penetration testing',
      'Generate reverse-shell payloads for pentests', 'Turn text into ASCII art'],
    facts: [['Diameter', '6,779 km'], ['Distance to Sun', '227.9 million km'], ['Orbit', '687 days'], ['Day length', '24 h 37 min']],
  },
  jupiter: {
    name: 'Jupiter', section: 'Blue Teaming',
    text: `<p>The largest planet shields the inner planets from comets – fitting for defensive tools.</p>`,
    links: ['Check and unmask shortened URLs', 'Scan files & links for malware', 'Check whether your data appeared in leaks',
      'Vulnerability & exploit database', 'Public exploits & vulnerabilities'],
    facts: [['Diameter', '139,820 km'], ['Distance to Sun', '778.5 million km'], ['Orbit', '11.9 years'], ['Day length', '9 h 56 min']],
  },
  saturn: {
    name: 'Saturn', section: 'Games',
    text: `<p>The lord of the rings – and home of the games. They all run right in your browser, on phones too.</p>`,
    links: ['All games at a glance', '3D fighting game with super attacks, flying and online battles for four',
      'Plane shooter through six rooms, as a team or head to head', 'A 3D pet that repeats everything you say',
      'Block world with caves, monsters and your real street', 'Survive until dawn, story with five worlds',
      'Stack flatbread, dodge knives – 60 levels', 'Gather a huge colony and storm the hill',
      'Eat smaller fish and grow – all the way to leviathan', 'Gather an army of knights and storm the castle',
      'The classic – with high score'],
    facts: [['Diameter', '116,460 km'], ['Distance to Sun', '1.43 billion km'], ['Orbit', '29.4 years'], ['Day length', '10 h 33 min']],
  },
  uranus: {
    name: 'Uranus', section: 'NetTools',
    text: `<p>Network tools that run right in your browser – plus my Python tools with source code on GitHub. (Tool pages are in German.)</p>`,
    links: ['All tools on one page', 'IPv4 & IPv6: network, broadcast, hosts, splitting', 'Query DNS records, check SPF and DMARC',
      'Port reference and nmap commands for your own scans', 'Strong passwords & passphrases with strength check',
      'Base64, URL, hex, hashes and JWT decoder', 'Python GUI: scan IP ranges for open ports',
      'Python GUI: test fonts, sizes & colours', 'Copy text from your latest screenshot via OCR'],
    linkTitles: { 0: 'Open NetTools', 1: 'Subnet calculator', 2: 'DNS & email security', 3: 'Ports & nmap builder', 4: 'Password generator' },
    facts: [['Diameter', '50,724 km'], ['Distance to Sun', '2.87 billion km'], ['Orbit', '84 years'], ['Day length', '17 h 14 min']],
  },
  neptun: {
    name: 'Neptune', section: 'Legal notice',
    prepend: `<p class="note">Legal notice (Impressum) and privacy note as required by German law – shown in German.</p>`,
    facts: [['Diameter', '49,244 km'], ['Distance to Sun', '4.5 billion km'], ['Orbit', '165 years'], ['Day length', '16 h 6 min']],
  },
  pluto: {
    name: 'Pluto', section: 'Secret hideout',
    text: `<p>Congratulations, you found Pluto! 🎉 It lost its planet status in 2006 – but here it keeps its place.</p>
      <p>Fun fact: Pluto is smaller than our Moon, and one year there lasts 248 Earth years. Since its discovery
      in 1930 it has not even completed one orbit.</p>`,
    facts: [['Diameter', '2,377 km'], ['Distance to Sun', '5.9 billion km'], ['Orbit', '248 years'], ['Heart', 'Tombaugh Regio']],
  },
};

// Oberflächentexte
export const UI_TEXT = {
  de: {
    hint: 'Tippe auf einen Planeten', back: 'Sonnensystem', soon: 'Download folgt',
    close: 'Schließen und zurück zum Sonnensystem', reset: 'Ansicht zurücksetzen',
    travel: 'Zeitreise', today: 'Heute', travelHint: 'Wo standen die Planeten an diesem Tag?',
    soundOn: 'Sound an', soundOff: 'Sound aus', lang: 'English', langShort: 'EN', locale: 'de-DE',
  },
  en: {
    hint: 'Tap a planet', back: 'Solar system', soon: 'Download coming soon',
    close: 'Close and return to the solar system', reset: 'Reset view',
    travel: 'Time travel', today: 'Today', travelHint: 'Where were the planets on this day?',
    soundOn: 'Sound on', soundOff: 'Sound off', lang: 'Deutsch', langShort: 'DE', locale: 'en-GB',
  },
};
