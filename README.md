# 3mmooo.de

Persönliche Website als interaktives 3D-Sonnensystem – inspiriert vom
Astronomie-Sperrbildschirm des iPhones. Jeder Planet ist ein Bereich der Seite:
Klick/Tipp auf einen Planeten zoomt heran und öffnet die Inhalte.

| Himmelskörper | Bereich |
|---|---|
| Sonne | Willkommen / Übersicht |
| Erde | About Me |
| Mars | Red Teaming |
| Jupiter | Blue Teaming |
| Saturn | Games (Snake) |
| Uranus | NetTools (Downloads) |
| Neptun | Impressum & Datenschutz |
| Merkur, Venus | nur Planeten-Infos |

## Features

- Planeten stehen beim Laden an ihrer **echten heutigen Position** und kreisen danach weiter
- Planeten-Oberflächen werden **prozedural erzeugt** (keine Bilddateien) – in einem Web Worker
- Sonne mit animierter Oberfläche & Glow, Saturnring mit Schattenwurf, Atmosphären, Erdwolken & Mond
- Uhr & Datum wie auf dem Sperrbildschirm
- Direktlinks wie `3mmooo.de/#jupiter`, Browser-Zurück funktioniert
- Steuerung: Maus/Touch (drehen, zoomen), Dock unten, Pfeiltasten ←/→, `Esc` = zurück
- Handy: Panel als Bottom-Sheet; ohne WebGL gibt es eine einfache Linkliste
- Keine externen Requests: three.js liegt lokal in `lib/three` (DSGVO-freundlich)

## Struktur

```
3mmooo.de/
├── index.html            # Einstieg
├── snake.html            # Snake-Spiel
├── css/style.css
├── js/
│   ├── content.js        # ← Texte, Links, Planetenzuordnung (hier anpassen!)
│   ├── main.js           # 3D-Szene, Kamerafahrten, Navigation
│   ├── ui.js             # Uhr, Panel, Dock, Labels
│   ├── shaders.js        # GLSL für Sonne, Atmosphäre, Ring, Sterne
│   └── texture-worker.js # prozedurale Planeten-Texturen
├── lib/three/            # three.js r170 (MIT-Lizenz)
└── alt/                  # alte A-Frame-Version inkl. Bilder (kann gelöscht werden)
```

## Lokal starten

Wegen ES-Modulen muss die Seite über einen Webserver laufen (nicht per Doppelklick):

```bash
cd 3mmooo.de
python3 -m http.server 8000
```

Dann <http://localhost:8000> öffnen.

## TODO

- Impressum in `js/content.js` (Neptun) mit echten Angaben füllen
- Download-Links für die NetTools (Uranus) eintragen
- About-Me-Text (Erde) nach Wunsch anpassen
