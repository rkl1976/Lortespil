# Sådan laver du dine egne computerspil 🎮💩

**En guide til dig der gerne vil lære at programmere spil — fra ingenting til en hel bunke små arkadespil.**

Hej! Hvis du læser det her, vil du gerne lære at lave computerspil. Det er sjovere end du tror, og du behøver IKKE være en matematik-geni eller en hacker. Du skal bare bruge:

1. **En computer** (Windows, Mac eller Chromebook — alt virker)
2. **En browser** (Chrome, Firefox eller Edge)
3. **Et tekst-program** — Notepad er fint at starte med, men [VS Code](https://code.visualstudio.com/) er gratis og 100x bedre når du bliver vant til det
4. **Tålmodighed** og lyst til at prøve ting der måske ikke virker første gang

Alle spillene i den her mappe — Kloak-Racer, Lort-Flappy, Tarm-Slange, alle 12 — er lavet med præcis de værktøjer. Ingen magi.

---

## Indholdsfortegnelse

1. [Hvordan virker et computerspil egentlig?](#1-hvordan-virker-et-computerspil-egentlig)
2. [Dit første spil — på 5 minutter](#2-dit-første-spil--på-5-minutter)
3. [Game-loopet — hjertet i ALLE spil](#3-game-loopet--hjertet-i-alle-spil)
4. [Tegn ting på skærmen med canvas](#4-tegn-ting-på-skærmen-med-canvas)
5. [Få computeren til at lytte til dig](#5-få-computeren-til-at-lytte-til-dig)
6. [Kollision — når ting støder ind i hinanden](#6-kollision--når-ting-støder-ind-i-hinanden)
7. [Et komplet eksempel: Lort-Catcher](#7-et-komplet-eksempel-lort-catcher)
8. [Tag de rigtige spil under huden](#8-tag-de-rigtige-spil-under-huden)
9. [Næste skridt og udfordringer](#9-næste-skridt-og-udfordringer)

---

## 1. Hvordan virker et computerspil egentlig?

Et computerspil er bare et program der:

1. **Tegner noget** på skærmen 60 gange i sekundet
2. **Lytter efter** hvad du gør (taster, mus, finger på skærmen)
3. **Beregner** hvad der skal ske bagefter (er fjenden ramt? scorede vi? er vi døde?)
4. **Tegner igen**, lidt anderledes

Det er det. Det gentager sig. Igen og igen. Hver eneste gang du spiller Minecraft eller Fortnite, sker præcis de 4 ting 60 gange i sekundet bag kulisserne.

Vi laver vores spil med tre teknologier:

- **HTML** — strukturen. Som skelettet i et hus.
- **CSS** — udseendet. Som farverne på væggene og møblerne.
- **JavaScript (JS)** — handlingen. Som elektriciteten der får alt til at virke.

Det smarte er at de tre ting kan ligge i den **samme** fil hvis spillet er lille. Kig i `lort-flappy.html` — alt ligger i én fil. Den fil indeholder et helt spil.

---

## 2. Dit første spil — på 5 minutter

Lad os lave noget der virker. Åbn Notepad (eller VS Code), skriv det her, og gem det som `mit-spil.html`:

```html
<!DOCTYPE html>
<html>
<head><title>Mit første spil</title></head>
<body>
  <h1>💩 KLIK MIG!</h1>
  <p>Du har klikket: <span id="score">0</span> gange</p>

  <script>
    let score = 0;
    document.querySelector('h1').addEventListener('click', () => {
      score = score + 1;
      document.getElementById('score').textContent = score;
    });
  </script>
</body>
</html>
```

Dobbeltklik på filen. Den åbner i din browser. Klik på lorten. **Tillykke — du har lige lavet et spil.** Det er kedeligt, men det er et spil.

**Hvad sker der?**

- `<h1>💩 KLIK MIG!</h1>` viser teksten
- `<span id="score">0</span>` er stedet vi opdaterer
- `<script>...</script>` er JavaScript-koden — den der gør at noget sker
- `addEventListener('click', ...)` betyder "når brugeren klikker, kør den her funktion"
- Hver gang det sker: tæl én op, og opdater teksten

---

## 3. Game-loopet — hjertet i ALLE spil

Det forrige spil er reaktivt — der sker kun noget når du klikker. Rigtige spil har figurer der bevæger sig HELE TIDEN. Det kræver et **game-loop**.

I JavaScript bruger vi `requestAnimationFrame` (eller `rAF` for korte). Det betyder: "browser, kald min funktion næste gang du tegner skærmen — typisk om 1/60 sekund."

Skabelonen:

```js
function gameLoop() {
  update();   // beregn ny tilstand (hvor er spilleren? er fjenden ramt?)
  draw();     // tegn det hele
  requestAnimationFrame(gameLoop);  // gør det igen
}
requestAnimationFrame(gameLoop);
```

Det er **det**. Hvert eneste spil i den her mappe har den her struktur. Søg efter `requestAnimationFrame` i `lort-flappy.html` eller `kloak-racer.html` så ser du det.

**Eksempel** — en firkant der bevæger sig:

```html
<!DOCTYPE html>
<html>
<body>
  <canvas id="c" width="400" height="300" style="border:2px solid black"></canvas>
  <script>
    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');
    let x = 0;

    function gameLoop() {
      // Slet den gamle tegning
      ctx.clearRect(0, 0, 400, 300);

      // Tegn en firkant ved position x
      ctx.fillStyle = 'red';
      ctx.fillRect(x, 100, 50, 50);

      // Flyt firkanten 2 pixels til højre
      x = x + 2;
      if (x > 400) x = -50;  // når den ryger ud, kom tilbage fra venstre

      requestAnimationFrame(gameLoop);
    }
    gameLoop();
  </script>
</body>
</html>
```

Gem og åbn. Du har en rød firkant der suser tværs over skærmen. **Det er et game-loop**.

---

## 4. Tegn ting på skærmen med canvas

`<canvas>` er som et tomt lærred. Du tegner på det med JavaScript via `ctx` (forkortelse for "context").

De 5 vigtigste tegne-kommandoer:

```js
ctx.fillStyle = 'blue';                  // vælg farve
ctx.fillRect(x, y, bredde, højde);       // tegn en udfyldt firkant
ctx.beginPath();
ctx.arc(x, y, radius, 0, Math.PI*2);     // tegn en cirkel
ctx.fill();
ctx.font = '40px sans-serif';            // vælg font
ctx.fillText('💩', x, y);                 // skriv tekst eller emoji
ctx.clearRect(0, 0, w, h);               // slet alt
```

Næsten alle spillene i den her mappe bruger den her teknik. I `kloak-racer.html` linje 448-570 tegnes hele scooteren — chassis, hjul, styr, udstødning — kun med de her grundkommandoer.

**Prøv det selv**: åbn `lort-flappy.html`, find linjen der tegner spilleren (`💩` lorten der flapper), og prøv at ændre farven på rørene.

---

## 5. Få computeren til at lytte til dig

For at spille har du brug for at trykke på taster eller bruge musen/fingeren. Det er **input**.

```js
// Lyt efter tastatur
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    console.log('Du trykkede SPACE!');
  }
  if (e.code === 'ArrowLeft')  { /* gå venstre */ }
  if (e.code === 'ArrowRight') { /* gå højre */ }
});

// Lyt efter klik
canvas.addEventListener('click', (e) => {
  console.log('Du klikkede ved', e.clientX, e.clientY);
});

// Lyt efter touch (på mobil)
canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  const touch = e.touches[0];
  console.log('Finger landede ved', touch.clientX, touch.clientY);
});
```

Når du laver et spil til både computer OG mobil skal du lytte til **alle** disse. Kig i `lort-flappy.html` omkring linje 500 — der ligger samtlige tre input-typer side om side.

---

## 6. Kollision — når ting støder ind i hinanden

Det her lyder svært, men det er bare matematik fra 4. klasse.

To firkanter rører hinanden hvis ALLE de her er sande:

```js
// Firkant A er ved (a.x, a.y) og er a.w bred + a.h høj
// Firkant B er ved (b.x, b.y) og er b.w bred + b.h høj
function rør(a, b) {
  return a.x < b.x + b.w &&
         a.x + a.w > b.x &&
         a.y < b.y + b.h &&
         a.y + a.h > b.y;
}
```

Det kaldes "AABB-kollision" (axis-aligned bounding box) og er den mest almindelige form for kollisionscheck i 2D-spil. Det bruges i Kloak-Racer (linje 306-309), Lort-Flappy, Toilet-Tetris og mange flere.

For cirkler er det endnu nemmere:

```js
function cirklerRører(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const afstand = Math.sqrt(dx*dx + dy*dy);
  return afstand < a.radius + b.radius;
}
```

---

## 7. Et komplet eksempel: Lort-Catcher

Lad os bygge et helt spil sammen. 80 linjer kode. Du fanger faldende lorte med en kurv. Pseudokode først:

1. Tegn en kurv i bunden, brugeren styrer den med musen
2. Lorte falder ovenfra på tilfældige x-positioner
3. Hvis kurven rører en lort: +1 point
4. Hvis en lort rammer bunden: -1 liv
5. 0 liv: game over

Her er hele spillet:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Lort-Catcher</title>
  <style>
    body { margin:0; background:#3b2509; color:#fff9e6; font-family:sans-serif; text-align:center; }
    canvas { display:block; margin:0 auto; background:#a8e0ff; border:5px solid #3b2509; }
    h1 { font-family:'Bungee', sans-serif; }
  </style>
</head>
<body>
  <h1>💩 LORT-CATCHER</h1>
  <p>Score: <span id="score">0</span> · Liv: <span id="lives">3</span></p>
  <canvas id="c" width="600" height="400"></canvas>
  <script>
    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');
    const scoreEl = document.getElementById('score');
    const livesEl = document.getElementById('lives');

    // Spillerens kurv
    let basket = { x: 300, y: 360, w: 80, h: 30 };

    // Liste over faldende lorte
    let lorte = [];

    let score = 0;
    let lives = 3;
    let spawnTimer = 0;

    // Lyt efter musen
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      basket.x = e.clientX - rect.left - basket.w/2;
    });

    function spawnLort() {
      lorte.push({
        x: Math.random() * (600 - 30),
        y: -30,
        w: 30,
        h: 30,
        vy: 2 + Math.random() * 2  // faldhastighed
      });
    }

    function rør(a, b) {
      return a.x < b.x + b.w &&
             a.x + a.w > b.x &&
             a.y < b.y + b.h &&
             a.y + a.h > b.y;
    }

    function gameLoop() {
      // Slet skærm
      ctx.clearRect(0, 0, 600, 400);

      // Spawn nye lorte ind imellem
      spawnTimer++;
      if (spawnTimer > 40) {  // hver 40. frame, ca. hvert 0.7 sekund
        spawnLort();
        spawnTimer = 0;
      }

      // Flyt og tegn alle lorte
      for (let i = lorte.length - 1; i >= 0; i--) {
        const l = lorte[i];
        l.y = l.y + l.vy;

        ctx.font = '30px sans-serif';
        ctx.fillText('💩', l.x, l.y);

        // Tjek om kurven fanger
        if (rør(basket, l)) {
          score++;
          scoreEl.textContent = score;
          lorte.splice(i, 1);  // fjern lorten
        }
        // Tjek om den ramte bunden
        else if (l.y > 400) {
          lives--;
          livesEl.textContent = lives;
          lorte.splice(i, 1);
          if (lives <= 0) {
            alert('Game over! Score: ' + score);
            score = 0;
            lives = 3;
            scoreEl.textContent = 0;
            livesEl.textContent = 3;
            lorte = [];
          }
        }
      }

      // Tegn kurven
      ctx.fillStyle = '#ffd23f';
      ctx.fillRect(basket.x, basket.y, basket.w, basket.h);
      ctx.strokeStyle = '#3b2509';
      ctx.lineWidth = 4;
      ctx.strokeRect(basket.x, basket.y, basket.w, basket.h);

      requestAnimationFrame(gameLoop);
    }
    gameLoop();
  </script>
</body>
</html>
```

Gem som `lort-catcher.html`, åbn i browseren. **Du har lige bygget et helt spil.**

Læg mærke til det her:

- `lorte = []` er en **liste** (array). Sådan styrer man "mange ting samtidig" — fjender, kugler, partikler, alt
- `for (let i = lorte.length - 1; i >= 0; i--)` — vi går baglæns gennem listen så vi kan fjerne ting undervejs uden at få fejl
- `lorte.splice(i, 1)` fjerner én lort
- `Math.random()` giver et tilfældigt tal mellem 0 og 1 — det er sådan vi laver ting tilfældige

**Lige nu**: prøv at ændre i koden. Lav lorte hurtigere. Gør kurven større. Tilføj en ny type "rotte" (🐀) der trækker score fra hvis du fanger den.

---

## 8. Tag de rigtige spil under huden

Nu hvor du forstår basics, kan du læse de "rigtige" spil i mappen. Her er nogle gode steder at starte:

### `lort-flappy.html` — godt sted at læse
- Linje 408: `inputFlap()` viser hvordan input → fysik virker
- Linje 320-397: tegnefunktionen for ceramic-rørene — flot canvas-kunst
- Linje 542: `activateBoost()` viser hvordan power-ups laves

### `kloak-racer.html` — fed canvas-tegning
- Linje 448-570: HELE scooteren tegnes manuelt med chassis, hjul, styr. Læs det. Det er sjovt.
- Linje 306-309: AABB-kollision i 4 linjer

### `kloak-hop.html` — tile-baseret spil
- Hele spillet er bygget med et 11×13 tile-grid. Lær hvordan grid-spil virker.
- Vis dig selv hvordan vehicles og floaters er forskellige objekter med samme update-loop.

### `tarm-slange.html` — interpoleret bevægelse
- Snake bevæger sig stødvist hvert tick, men ser smooth ud. Find ud af hvordan ved at lede efter `tween` eller interpolation.

### `lortespil.js` — det delte modul
- Procedurel WebAudio. Sådan laver man lyde uden lydfiler. Linje 399 og frem.
- Coin-økonomi, daily challenges, hatte. Alt på under 500 linjer ren JavaScript.

**Tip**: brug `Ctrl+F` (Cmd+F på Mac) i din editor til at søge efter ord. Søg efter `gameOver` for at finde game-over-logik. Søg efter `addEventListener` for at finde input-håndtering.

---

## 9. Næste skridt og udfordringer

Du kan altid:

1. **Modificere et eksisterende spil**. Find Lort-Flappy, gør lorten større, lav rør i en anden farve, tilføj en helt ny power-up.
2. **Lav en ny power-up** til et af spillene. Det kan være `🍀 held` der gør dig usynlig 3 sekunder.
3. **Lav et nyt spil**. Tag inspiration fra de eksisterende — kopier en fil som skabelon, omdøb og byg om.

### Udfordringer at prøve (i stigende sværhed)

- ⭐ **Modificer Lort-Catcher**: tilføj 🪰-fluer der koster -2 hvis fanget
- ⭐⭐ **Tilføj lyd** til Lort-Catcher. Brug `LS.sfx.play('coin')` når noget fanges (kræver at du loader `lortespil.js`)
- ⭐⭐ **Lav Pong**: to bats, en bold der hopper. Klassisk. Kan laves på 100 linjer.
- ⭐⭐⭐ **Lav et boss-fight-spil**: én stor fjende, mange angrebsmønstre, du skal undvige + skyde
- ⭐⭐⭐⭐ **Lav et spil med rigtig grafik**. Tegn dine egne sprites i Aseprite (gratis: piskel.com), brug dem i stedet for emojis

### Steder hvor du kan lære mere

- **MDN Web Docs** — den bedste reference for JavaScript: developer.mozilla.org
- **scratch.mit.edu** — blok-baseret programmering. Perfekt til at få idéer og forstå koncepter visuelt
- **codecombat.com** — lær at programmere ved at spille (kan både være sjov og lærerigt)
- **YouTube**: søg "javascript game tutorial" eller "html canvas game"

### Lav noget hver dag

Den vigtigste regel: **lav noget**. Det behøver ikke være stort. 10 linjer kode der gør én ting du ikke vidste hvordan i går. Det summer sig.

De 12 spil i den her mappe er ikke lavet på én dag. Hvert af dem er bygget af mange smådele — render-kode, input-kode, kollision-kode, score-kode. Hvis du forstår de smådele kan du bygge hvad som helst.

---

## Hjælp og fejlfinding

**Min kode virker ikke**: åbn browser-konsollen (F12 i Chrome → Console-fanen). Den viser alle fejl. Læs fejlen — JavaScript er meget god til at sige hvilken linje der er problemet.

**Skærmen er sort**: tjek at `canvas.width` og `canvas.height` er sat. Tjek at du faktisk kalder din `draw()`-funktion.

**Min figur bliver ikke tegnet**: tjek `ctx.fillStyle` (farve) og at du tegner inden for `canvas.width` × `canvas.height`.

**Knappen virker ikke**: åbn konsollen. Tjek at du staver `addEventListener` rigtigt. Tjek at id'et i HTML matcher det du bruger i JS.

---

**God fornøjelse, fremtidige spiludvikler. 💩👑**

Hvis du laver noget fedt — vis det til din far. Han ved hvor man finder folk der hjælper dig videre.
