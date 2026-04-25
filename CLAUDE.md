# Lortespil — Projekt-overblik for Claude

## Hvad er det?

"Lortespil" er en samling af **12 retro-arkadespil** med et brun/gul lort/toilet-tema, samlet i én portal. Alt er ren vanilla HTML + CSS + JavaScript, intet build-step, ingen frameworks. Spillene kører direkte fra `index.html` via `file://` eller en simpel http-server. Sproget er **dansk**.

Projektet er bygget som hyggekodning sammen med brugeren — ikke et kommercielt produkt. Målet er sjov, kreativitet og senere som læringsplatform for hans søn (11 år).

## Filer

```
Lortespil/
├── index.html              ← Portal med alle spil + mønter + hat-shop + dagens udfordring
├── lortespil.js            ← Delt modul: window.LS API
├── lortespil.css           ← Delte CSS-variabler og komponenter
├── CLAUDE.md               ← Du læser den
├── TUTORIAL.md             ← Læringstutorial til 11-årig
│
├── lort-paa-loeb.html      ← Survival, 5 verdener (poop)
├── kloak-racer.html        ← Endless runner med scooter (racer)
├── toilet-tetris.html      ← Tetris med stink-meter, flush, dingleberries (tetris)
├── flue-invaders.html      ← Space Invaders (invaders)
├── lort-flappy.html        ← Flappy Bird med papir-vækst + fart-boost (flappy)
├── kloak-hop.html          ← Frogger (hop)
├── tarm-slange.html        ← Snake i tarm-system (snake)
├── plop-pop.html           ← Puzzle Bobble bubble-shooter (plop)
├── lorte-bobble.html       ← Bubble Bobble platform-arkade (bobble)
├── kloak-putt.html         ← 9-hul mini-golf (putt)
├── stink-stop.html         ← Whack-a-mole (stink)
├── lort-sorter.html        ← Sorterings-reaktionsspil (sorter)
└── kloak-klatrer.html      ← Vertical platformer med stigende vand (klatrer)
```

Hver `<spil>.html` er **selvstændig** — én fil, alt indlejret. Det er bevidst: nemt at åbne, nemt at læse, nemt at vise et barn hvordan kode → spil.

## Arkitektur

Hvert spil består af:
- Ét `<canvas>`-element (eller DOM-baseret for nogle, fx Lort-Sorter)
- Et HUD (DOM-baseret)
- Start-overlay og game-over-overlay
- Et `requestAnimationFrame`-loop med `update(dt)` + `draw()`
- LocalStorage til highscore (key: `<gameKey>_highscore`)
- Indkluderer det delte modul:
```html
<link rel="stylesheet" href="lortespil.css">
<script src="lortespil.js" defer></script>
```

### `window.LS` — det delte API

Alle spil kalder ind i samme namespace:

```js
LS.getCoins() / LS.addCoins(n) / LS.spendCoins(n)
LS.getHigh(gameKey) / LS.setHigh(gameKey, score)
LS.reportGameEnd({gameKey, score, extra})  // alt-i-én ved game-over
LS.sfx.play('jump'|'coin'|'splat'|...)     // 14 procedurelle WebAudio-lyde
LS.isMuted() / LS.setMuted(v) / LS.mountMuteButton()
LS.getDaily()                              // dagens udfordring
LS.getEquippedHat() / LS.setEquippedHat(emoji) / LS.HATS
LS.toast(text, {duration})
```

**Vigtigt**: hver `LS.*`-call er guarded med `if (window.LS)` så spillene virker standalone hvis modulet fejler at loade. Hver fil har også fallback til direkte localStorage-skrivning af highscore.

### Storage-keys (alle prefix `lorte_` for delt state)

- `lorte_coins` — integer
- `lorte_muted` — '0' | '1'
- `lorte_equipped_hat` — emoji
- `lorte_unlocked_hats` — JSON array
- `lorte_daily_state` — `{date, gameKey, completed, firstTimeBonusPaid}`

Plus per-spil: `<gameKey>_highscore` (eksisterende konvention bevaret).

### gameKeys

`poop, racer, tetris, invaders, flappy, hop, snake, plop, bobble, putt, stink, sorter, klatrer`

Disse bruges som nøgler i `LS.HIGH_KEYS`-mappen i `lortespil.js` og som første led i highscore-keys.

### Daily challenge

`lortespil.js` har et `DAILY_CATALOG` med 13 challenge-skabeloner (én pr. spil). Roterer dagligt via `dayOfYearUTC() % DAILY_CATALOG.length`. Når en bruger laver det dagens-mål kalder game-koden `LS.reportGameEnd(...)` med relevant `extra`-objekt; LS tjekker selv om udfordringen er opfyldt og giver bonus-mønter (×2 eller ×3 af score, plus 50-coin first-time-bonus).

## Konventioner

- **Sprog**: alle UI-tekster på dansk. Code-comments på engelsk.
- **Fonte**: `Bungee` til overskrifter, `Fredoka` til body. Loadet fra Google Fonts i hver fil.
- **Palet**: `#fff9e6` cremehvid, `#3b2509` lortebrun, `#ffd23f` toiletgul, `#ff4e6b` pink.
- **Stil**: tykke borders (3-5px), offsætskygger (3-7px). Retro-arcade-look.
- **Mobile-first**: alle spil skal virke på touch + tastatur. `viewport-fit=cover`, `touch-action: none`.
- **Emoji-fonts**: brug `'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif` på canvas, ALDRIG `serif` (ser grimt ud cross-platform).

## Roadmap (det vi vil lave på sigt)

### 1. Rigtig grafik i stedet for emojis (top-prioritet)
Lige nu er alle figurer emoji-baserede. Det er hurtigt og charmerende, men begrænset:
- Emojis ser forskellige ud på Windows/Mac/iOS/Android
- Kan ikke animeres (gå-cyklus, dø-animation, blink osv.)
- Kan ikke skaleres rent (pixelering)

**Plan**: gradvist erstatte emoji-figurer med:
- **SVG-sprites** for små karakterer (lort, fluer, rotter) med flere frames til animation
- **Canvas-tegnede figurer** for køretøjer (scooter er allerede gjort i kloak-racer.html — god skabelon)
- **Sprite sheets** for komplekse animationer (gå, hop, dø, idle)

Spil med højest prioritet for grafisk opgradering: Lort på Løb, Lorte-Bobble, Kloak-Klatrer, Tarm-Slange (alle har figurer der ville have stor gevinst af animationer).

### 2. Frame-baserede animationer
- Idle-animation (lort wiggler), walk-cycle, hop-frame, splat-frame
- Bør implementeres som en delt `Sprite`-klasse i `lortespil.js`?
- Eller blive ved med per-spil-tilgang for læringsformål

### 3. Bedre baggrunde
- Parallax-scrolling i flere spil (kun Kloak-Racer har det rigtigt nu)
- Animerede baggrundselementer (toiletter der skyller, fluer der summer)

### 4. Lyd-opgradering
WebAudio-lydene er fine men generiske. Næste niveau:
- Procedurel-genererede 8-bit melodier som baggrundsmusik (kan loop)
- Mute-toggle pr. spil (ikke kun globalt)

### 5. Polish
- Bedre dø-animationer (slow-mo + zoom + partikler)
- Score-popup-animationer
- Bedre transitions mellem skærme

### 6. Måske
- 6-spil-leaderboard på en hjemmeside? (kræver backend)
- Multiplayer Snake?
- Avatarer udover hatte?

## Sådan tilføjer du et nyt spil

1. Kopier en eksisterende spil-fil som template (fx `kloak-hop.html` for tile-baseret, `lort-flappy.html` for canvas-physics)
2. Vælg en `gameKey` (kort, snake_case)
3. Tilføj keyen til `HIGH_KEYS` i `lortespil.js`
4. Tilføj evt. en daily-challenge-entry i `DAILY_CATALOG`
5. Tilføj `GAME_EMOJI`, `GAME_LINK`, og storage-key i `index.html`
6. Tilføj et `<a class="game-card">`-kort i grid'et
7. Spillet skal:
   - Inkludere `<link rel="stylesheet" href="lortespil.css">` og `<script src="lortespil.js" defer></script>`
   - Bruge `LS.sfx.play(...)` til lyde (guarded)
   - Kalde `LS.reportGameEnd(...)` ved game-over
   - Have `<a class="back-btn">← Portal</a>` der kun vises når ikke `playing`
   - Toggle `document.body.classList.add('playing')` ved start, fjern ved game-over
   - Have fallback til `localStorage.setItem('<gameKey>_highscore', ...)` hvis LS er væk

## Kendte quirks

- `lortespil.js` loades med `defer` så `window.LS` er ikke garanteret klar før `DOMContentLoaded`. Spillene venter typisk på `DOMContentLoaded` for `mountMuteButton()` og guarder alle øvrige LS-calls.
- WebAudio-context kan ikke starte før første user-gesture (iOS/Android-restriktion). LS håndterer det automatisk via `{once:true}`-listener på første click/touchstart/keydown.
- Nogle spil har egne `localStorage.setItem('<gameKey>_highscore', ...)`-fallbacks. Det er bevidst — hvis LS-modulet fejler, virker spillet stadig.
- `toilet-tetris.html` blev bygget i to omgange (først grund-twist, så toilet-bowl + dingleberries). Hvis noget ser inkonsistent ud, det er derfor.

## Brugerens preferences

- Brugeren skriver dansk og vil have respons på dansk
- Vil gerne have ambitiøse parallelle implementeringer ("alle agenter parallelt")
- Sætter pris på direkte, kort kommunikation
- Synes "lortet" tema skal være ægte indbygget, ikke bare emoji-pålimning
- Bygger projektet sammen med sin 11-årige søn som inspiration
