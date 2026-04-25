# 💩 Lortespil

> Tolv små retro-arkadespil med et lortet toilet-tema, samlet i én portal. Bygget i ren HTML, CSS og JavaScript — ingen frameworks, intet build-step.

🇩🇰 Sproget er dansk · 📱 Virker på mobil og desktop · 🎮 12 spil · 🪙 Mønter, hatte og dagens udfordring

---

## 🚀 Sådan kommer du i gang

```bash
git clone <dette repo>
cd Lortespil
# Åbn index.html i din browser. Det er det.
```

Det er bogstaveligt talt det. Ingen `npm install`, ingen webpack, ingen Docker. Dobbeltklik på `index.html` og spil.

> Tip: hvis lyd ikke virker eller hatte ikke gemmes, så kør en lille lokal server i stedet for `file://`:
> ```bash
> # Python:
> python -m http.server 8080
> # Eller Node:
> npx serve .
> ```
> Åbn så `http://localhost:8080`.

---

## 🎮 Spillene

| # | Spil | Genre | Beskrivelse |
|---|------|-------|-------------|
| 1 | 💩 **Lort på Løb** | Survival | Saml toiletpapir og undvig fluer i 5 tematiske verdener |
| 2 | 🛵 **Kloak-Racer** | Endless runner | Hop og duk gennem kloakken på en lort-scooter |
| 3 | 🚽 **Toilet-Tetris** | Puzzle | Tetris med stink-meter, flush-animation og dingleberries |
| 4 | 🪰 **Flue-Invaders** | Shooter | Skyd fluerne fra rummet med din toiletpapir-kanon |
| 5 | 💨 **Lort-Flappy** | Flappy Bird | Saml papir, voks dig stor, brug fart-boost til at slippe gennem |
| 6 | 🐸 **Kloak-Hop** | Frogger | Hop over trafik og kloakvand til toilettet |
| 7 | 🌭 **Tarm-Slange** | Snake | Spis pølser i tarmen — undgå broccoli og fluer |
| 8 | 🫧 **Plop-Pop** | Puzzle Bobble | Skyd farvede lort-bobler og match 3 |
| 9 | 🫧 **Lorte-Bobble** | Bubble Bobble | Hop på platforme og fang fjender i bobler |
| 10 | ⛳ **Kloak-Putt** | Mini-golf | 9 huller — putt lorten i toilettet på færrest slag |
| 11 | 🔨 **Stink-Stop** | Whack-a-mole | Ram lortene der popper op fra toiletter |
| 12 | 🗑️ **Lort-Sorter** | Reaktionsspil | Sortér faldende objekter i SKYL, UD eller GEM |
| 13 | 🪜 **Kloak-Klatrer** | Platformer | Hop opad mens kloakvandet stiger nedefra |

---

## ✨ Features

- **Mønter & belønninger** — hvert spil giver Lorte-mønter 🪙 baseret på din score
- **Lorte-butik** — brug mønterne på 5 hatte (🎓 🎩 🤠 👑 🦄) som bæres i Lort på Løb
- **Dagens Lort** — ny daglig udfordring med ×2 eller ×3 mønter (roterer mellem alle 13 spil)
- **Highscores** — gemmes lokalt pr. spil
- **Procedurel lyd** — 14 forskellige WebAudio-lyde, ingen lydfiler nødvendige
- **Mute-knap** der huskes på tværs af spil
- **Mobile-first** — touch-kontroller og responsive design i alle spil
- **Offline** — ingen netforbindelse nødvendig efter første load

---

## 🏗️ Sådan er det bygget

Alt er rene web-standarder:

- **HTML** for struktur
- **CSS** for styling (med Bungee + Fredoka fra Google Fonts)
- **JavaScript** med `<canvas>` og DOM
- **WebAudio API** til procedural lyd
- **localStorage** til persistence

Ingen React, ingen TypeScript, ingen bundler. Hver `<spil>.html` er **selvstændig** og kan åbnes direkte i en browser.

### Filstruktur

```
.
├── index.html              ← Portal med alle spil + butik + dagens udfordring
├── lortespil.js            ← Delt modul: window.LS API
├── lortespil.css           ← Delte CSS-variabler og komponenter
├── README.md               ← Du læser den
├── CLAUDE.md               ← Detaljeret arkitektur + roadmap
├── TUTORIAL.md             ← Læringstutorial (på dansk, til 11-årige)
│
└── <13 spil-filer>.html    ← Ét spil per fil, alt indlejret
```

### Det delte API: `window.LS`

Alle spil bruger samme namespace:

```js
LS.getCoins()                                    // → tæller mønter
LS.reportGameEnd({gameKey, score, extra})        // alt-i-én ved game-over
LS.sfx.play('jump'|'splat'|'flush'|'coin'|...)   // 14 procedurelle lyde
LS.getDaily()                                    // dagens udfordring
LS.getEquippedHat() / LS.setEquippedHat(emoji)   // hatte
LS.toast(text, {duration})                       // floating notifikation
```

Se `lortespil.js` for alle 19 metoder. Hver spilfil guarder kald med `if (window.LS)` så de virker standalone hvis modulet fejler at loade.

---

## 📚 Vil du lære at lave spil som disse?

👉 **Læs [`TUTORIAL.md`](TUTORIAL.md)** — en venlig dansk guide skrevet til en 11-årig, men også god for voksne nybegyndere.

Tutorial dækker:
- Hvordan computerspil egentlig virker
- Dit første spil på 5 minutter
- Game-loopet (`requestAnimationFrame`)
- Tegne med canvas
- Input fra mus, tastatur og touch
- Kollision
- **Et komplet eksempel: Lort-Catcher** — 80 linjer kode du kan kopiere
- Pegepinde til specifikke linjer i de "rigtige" spil
- Udfordringer i 4 sværhedsgrader + ressourcer

---

## 🛠️ Vil du tilføje et nyt spil?

Se `CLAUDE.md` for arkitektur-detaljer. Kort version:

1. Kopier en eksisterende spil-fil som template (fx `kloak-hop.html` for tile-baseret)
2. Vælg en kort `gameKey` (snake_case)
3. Tilføj keyen til `HIGH_KEYS` i `lortespil.js`
4. Tilføj evt. en daily challenge i `DAILY_CATALOG` samme sted
5. Tilføj `GAME_EMOJI`, `GAME_LINK` og storage-key i `index.html`
6. Tilføj et nyt `<a class="game-card">`-kort i grid'et
7. Spillet skal:
   - Inkludere `lortespil.css` + `lortespil.js`
   - Bruge `LS.sfx.play(...)` til lyde
   - Kalde `LS.reportGameEnd(...)` ved game-over
   - Have back-knap der vises når ikke `playing`

---

## 🗺️ Roadmap

På sigt vil vi:

- 🎨 **Erstatte emojis med rigtig grafik** (SVG-sprites + canvas-tegnede figurer + sprite sheets)
- 🏃 **Frame-baserede animationer** (gå-cyklus, hop, dø, idle)
- 🎬 **Bedre baggrunde** med parallax i flere spil
- 🎵 **Procedurel baggrundsmusik** (ikke kun lydeffekter)
- ✨ **Polish**: bedre dø-animationer, score-popups, transitions

Se `CLAUDE.md` for fuld roadmap.

---

## 🤝 Bidrag

Det er et hobbyprojekt — bygget for sjov, ikke for produktion. Forks, PRs og inspiration er velkomne. Hvis du laver et nyt lortespil, så tag mig med på en demo. 💩

---

## 📜 Licens

MIT — gør hvad du vil. Lav dit eget Lortespil-univers.

---

*Lavet med 💩 og kærlighed.*
