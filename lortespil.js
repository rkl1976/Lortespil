/* Lortespil v2 - shared foundation module
 * Exposes window.LS with coin economy, highscores, SFX, daily challenges, hats and toasts.
 * Vanilla JS, no deps. Keep legacy localStorage keys intact.
 */
(function () {
  'use strict';

  var LS = {};

  // ---------- safe localStorage ----------
  function lsGet(k, def) {
    try { var v = window.localStorage.getItem(k); return v === null ? def : v; }
    catch (e) { return def; }
  }
  function lsSet(k, v) {
    try { window.localStorage.setItem(k, String(v)); } catch (e) {}
  }
  function lsGetJSON(k, def) {
    try {
      var raw = window.localStorage.getItem(k);
      if (raw === null) return def;
      return JSON.parse(raw);
    } catch (e) { return def; }
  }
  function lsSetJSON(k, v) {
    try { window.localStorage.setItem(k, JSON.stringify(v)); } catch (e) {}
  }

  // ---------- coin economy ----------
  LS.getCoins = function () {
    var n = parseInt(lsGet('lorte_coins', '0'), 10);
    return isNaN(n) ? 0 : n;
  };
  LS.addCoins = function (n, opts) {
    n = Math.max(0, Math.floor(Number(n) || 0));
    opts = opts || {};
    var bal = LS.getCoins() + n;
    lsSet('lorte_coins', bal);
    if (n > 0 && !opts.silent) {
      LS.toast('+' + n + ' 🪙', { duration: 1400, color: '#ffd23f' });
    }
    return bal;
  };
  LS.spendCoins = function (n) {
    n = Math.max(0, Math.floor(Number(n) || 0));
    var bal = LS.getCoins();
    if (bal < n) return false;
    lsSet('lorte_coins', bal - n);
    return true;
  };

  // ---------- highscores ----------
  var HIGH_KEYS = {
    poop: 'poop_highscore',
    racer: 'racer_highscore',
    tetris: 'tetris_highscore',
    invaders: 'invaders_highscore',
    flappy: 'flappy_highscore',
    hop: 'hop_highscore',
    snake: 'snake_highscore',
    plop: 'plop_highscore',
    bobble: 'bobble_highscore',
    putt: 'putt_highscore',
    stink: 'stink_highscore',
    sorter: 'sorter_highscore',
    klatrer: 'klatrer_highscore'
  };
  LS.getHigh = function (gameKey) {
    var k = HIGH_KEYS[gameKey]; if (!k) return 0;
    var n = parseInt(lsGet(k, '0'), 10);
    return isNaN(n) ? 0 : n;
  };
  LS.setHigh = function (gameKey, score) {
    var k = HIGH_KEYS[gameKey]; if (!k) return false;
    score = Math.floor(Number(score) || 0);
    var cur = LS.getHigh(gameKey);
    if (score > cur) { lsSet(k, score); return true; }
    return false;
  };

  // ---------- hats ----------
  LS.HATS = [
    { emoji: '🎓', name: 'Studielort',       price: 75  },
    { emoji: '🎩', name: 'Gentlemanlort',    price: 100 },
    { emoji: '🤠', name: 'Cowboylort',       price: 150 },
    { emoji: '👑', name: 'Kronelort',        price: 200 },
    { emoji: '🦄', name: 'Enhjørnings-lort', price: 500 }
  ];
  LS.getEquippedHat = function () { return lsGet('lorte_equipped_hat', '') || ''; };
  LS.setEquippedHat = function (emoji) { lsSet('lorte_equipped_hat', emoji || ''); };
  LS.getUnlockedHats = function () {
    var arr = lsGetJSON('lorte_unlocked_hats', []);
    return Array.isArray(arr) ? arr.slice() : [];
  };
  LS.unlockHat = function (emoji) {
    if (!emoji) return;
    var arr = LS.getUnlockedHats();
    if (arr.indexOf(emoji) === -1) { arr.push(emoji); lsSetJSON('lorte_unlocked_hats', arr); }
  };

  // ---------- daily challenge ----------
  var DAILY_CATALOG = [
    { id: 'flappy-nopaper', gameKey: 'flappy', title: 'Dagens Lort: FLAPPY-ASKESE',
      desc: 'Nå 25 point i Lort-Flappy UDEN at samle et eneste 🧻', multiplier: 3,
      check: function (e) { e = e || {}; return (e.score | 0) >= 25 && (e.papers | 0) === 0; } },
    { id: 'tetris-trippel', gameKey: 'tetris', title: 'Dagens Lort: TRIPPEL-SKYL',
      desc: 'Ryd 3 rækker på samme level i Toilet-Tetris', multiplier: 2,
      check: function (e) { e = e || {}; return !!e.tripleClear; } },
    { id: 'racer-clean', gameKey: 'racer', title: 'Dagens Lort: RENT LØB',
      desc: 'Kør 400m i Kloak-Racer uden at blive ramt', multiplier: 3,
      check: function (e) { e = e || {}; return (e.distance | 0) >= 400 && !e.crashedOn; } },
    { id: 'invaders-streak', gameKey: 'invaders', title: 'Dagens Lort: FLUE-SNIGSKYTTE',
      desc: '50 kills i Flue-Invaders uden at miste et liv', multiplier: 2,
      check: function (e) { e = e || {}; return (e.kills | 0) >= 50 && (e.livesLost | 0) === 0; } },
    { id: 'poop-world3', gameKey: 'poop', title: 'Dagens Lort: VERDENSTURISTEN',
      desc: 'Nå verden 3 i Lort på Løb i ét enkelt run', multiplier: 2,
      check: function (e) { e = e || {}; return (e.worldReached | 0) >= 3; } },
    { id: 'hop-double', gameKey: 'hop', title: 'Dagens Lort: HOPPE-MESTER',
      desc: 'Kryds 5 baner i Kloak-Hop i ét run', multiplier: 2,
      check: function (e) { e = e || {}; return (e.crossings | 0) >= 5; } },
    { id: 'snake-long', gameKey: 'snake', title: 'Dagens Lort: LANGE TARM',
      desc: 'Bliv mindst 15 segmenter lang i Tarm-Slange', multiplier: 2,
      check: function (e) { e = e || {}; return (e.length | 0) >= 15; } },
    { id: 'plop-combo', gameKey: 'plop', title: 'Dagens Lort: PLOP-COMBO',
      desc: 'Drop 15 bobler på en gang i Plop-Pop', multiplier: 3,
      check: function (e) { e = e || {}; return (e.maxCombo | 0) >= 15; } },
    { id: 'bobble-noloss', gameKey: 'bobble', title: 'Dagens Lort: BOBBEL-MESTER',
      desc: 'Ryd 2 levels i Lorte-Bobble uden at miste et liv', multiplier: 3,
      check: function (e) { e = e || {}; return (e.levelsCleared | 0) >= 2 && (e.livesLost | 0) === 0; } },
    { id: 'putt-underpar', gameKey: 'putt', title: 'Dagens Lort: UNDER PAR',
      desc: 'Gennemfør alle 9 huller i Kloak-Putt på under par', multiplier: 3,
      check: function (e) { e = e || {}; return !!e.completedAll && (e.underPar | 0) >= 1; } },
    { id: 'stink-streak', gameKey: 'stink', title: 'Dagens Lort: FLUSH-STRIBE',
      desc: 'Ram 20 lorte i træk i Stink-Stop uden at misse', multiplier: 2,
      check: function (e) { e = e || {}; return (e.bestStreak | 0) >= 20; } },
    { id: 'sorter-streak', gameKey: 'sorter', title: 'Dagens Lort: PERFEKT SORTERING',
      desc: 'Sorter 30 i træk rigtigt i Lort-Sorter', multiplier: 2,
      check: function (e) { e = e || {}; return (e.bestStreak | 0) >= 30; } },
    { id: 'klatrer-high', gameKey: 'klatrer', title: 'Dagens Lort: HØJDE-REKORD',
      desc: 'Nå 1000m op i Kloak-Klatrer', multiplier: 2,
      check: function (e) { e = e || {}; return (e.height | 0) >= 1000; } }
  ];

  function todayUTC() {
    var d = new Date();
    var y = d.getUTCFullYear(), m = d.getUTCMonth() + 1, dd = d.getUTCDate();
    return y + '-' + (m < 10 ? '0' + m : m) + '-' + (dd < 10 ? '0' + dd : dd);
  }
  function dayOfYearUTC() {
    var now = new Date();
    var start = Date.UTC(now.getUTCFullYear(), 0, 0);
    var diff = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) - start;
    return Math.floor(diff / 86400000);
  }
  function readDailyState() {
    var s = lsGetJSON('lorte_daily_state', null);
    var today = todayUTC();
    if (!s || s.date !== today) {
      s = { date: today, gameKey: DAILY_CATALOG[dayOfYearUTC() % DAILY_CATALOG.length].gameKey, completed: false, firstTimeBonusPaid: false };
      lsSetJSON('lorte_daily_state', s);
    }
    return s;
  }
  LS.getDaily = function () {
    var tpl = DAILY_CATALOG[dayOfYearUTC() % DAILY_CATALOG.length];
    var st = readDailyState();
    return {
      id: tpl.id,
      gameKey: tpl.gameKey,
      title: tpl.title,
      desc: tpl.desc,
      multiplier: tpl.multiplier,
      check: tpl.check,
      active: true,
      completed: !!st.completed
    };
  };
  LS.markDailyDone = function (gameKey, extra) {
    var d = LS.getDaily();
    if (d.gameKey !== gameKey) return { completed: false, bonusPaid: false };
    var ok = false;
    try { ok = !!d.check(extra || {}); } catch (e) { ok = false; }
    if (!ok) return { completed: false, bonusPaid: false };
    var st = readDailyState();
    var bonusPaid = false;
    if (!st.completed) {
      st.completed = true;
      if (!st.firstTimeBonusPaid) {
        st.firstTimeBonusPaid = true;
        bonusPaid = true;
      }
      lsSetJSON('lorte_daily_state', st);
    }
    return { completed: true, bonusPaid: bonusPaid };
  };

  // ---------- reportGameEnd ----------
  LS.reportGameEnd = function (args) {
    args = args || {};
    var gameKey = args.gameKey;
    var score = Math.floor(Number(args.score) || 0);
    var extra = args.extra || {};
    var result = { coinsEarned: 0, dailyCompleted: false, isNewHigh: false, dailyBonus: 0, totalCoins: LS.getCoins() };
    if (!gameKey || !HIGH_KEYS[gameKey]) return result;

    result.isNewHigh = LS.setHigh(gameKey, score);

    var daily = LS.getDaily();
    var dailyMet = false;
    var multiplier = 1;
    if (daily.active && daily.gameKey === gameKey) {
      try { dailyMet = !!daily.check(extra); } catch (e) { dailyMet = false; }
      if (dailyMet) multiplier = daily.multiplier || 1;
    }

    var base = Math.floor(score / 10);
    var coins = base * multiplier;

    var dm = LS.markDailyDone(gameKey, extra);
    result.dailyCompleted = dm.completed;
    if (dm.completed && dm.bonusPaid) {
      coins += 50;
      result.dailyBonus = 50;
    }

    result.coinsEarned = coins;
    result.totalCoins = LS.addCoins(coins, { silent: true, gameKey: gameKey, reason: 'game-end' });
    return result;
  };

  // ---------- WebAudio SFX ----------
  var audioCtx = null;
  var masterGain = null;
  var engineNodes = null;

  function ensureCtx() {
    if (audioCtx) return audioCtx;
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      audioCtx = new AC();
      masterGain = audioCtx.createGain();
      masterGain.gain.value = 0.7;
      masterGain.connect(audioCtx.destination);
    } catch (e) { audioCtx = null; }
    return audioCtx;
  }
  function resumeCtx() { if (audioCtx && audioCtx.state === 'suspended') { try { audioCtx.resume(); } catch (e) {} } }

  // Unlock audio on first user gesture (iOS)
  function unlock() { ensureCtx(); resumeCtx(); }
  try {
    window.addEventListener('click', unlock, { once: true, passive: true });
    window.addEventListener('touchstart', unlock, { once: true, passive: true });
    window.addEventListener('keydown', unlock, { once: true });
  } catch (e) {}

  function noiseBuffer(ctx, dur, type) {
    var len = Math.floor(ctx.sampleRate * dur);
    var buf = ctx.createBuffer(1, len, ctx.sampleRate);
    var d = buf.getChannelData(0);
    if (type === 'pink') {
      var b0 = 0, b1 = 0, b2 = 0;
      for (var i = 0; i < len; i++) {
        var w = Math.random() * 2 - 1;
        b0 = 0.99765 * b0 + w * 0.0990460;
        b1 = 0.96300 * b1 + w * 0.2965164;
        b2 = 0.57000 * b2 + w * 1.0526913;
        d[i] = (b0 + b1 + b2 + w * 0.1848) * 0.15;
      }
    } else {
      for (var j = 0; j < len; j++) d[j] = Math.random() * 2 - 1;
    }
    return buf;
  }

  function env(ctx, gainNode, t0, attack, peak, decay, sustain, release, dur) {
    var g = gainNode.gain;
    g.cancelScheduledValues(t0);
    g.setValueAtTime(0.0001, t0);
    g.exponentialRampToValueAtTime(Math.max(0.0002, peak), t0 + attack);
    g.exponentialRampToValueAtTime(Math.max(0.0002, sustain), t0 + attack + decay);
    g.exponentialRampToValueAtTime(0.0001, t0 + dur + release);
  }

  function tone(ctx, dest, type, freqStart, freqEnd, dur, vol, t0) {
    var osc = ctx.createOscillator();
    var g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freqStart, t0);
    if (freqEnd !== freqStart) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(10, freqEnd), t0 + dur);
    }
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + Math.min(0.01, dur * 0.2));
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g).connect(dest);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
    return osc;
  }

  var SOUNDS = {
    jump: function (ctx, dest, o) {
      var t = ctx.currentTime;
      tone(ctx, dest, 'square', 220, 440, 0.08, 0.22 * o.volume, t);
    },
    collect: function (ctx, dest, o) {
      var t = ctx.currentTime;
      tone(ctx, dest, 'triangle', 523.25 * o.pitch, 523.25 * o.pitch, 0.06, 0.3 * o.volume, t);
      tone(ctx, dest, 'triangle', 659.25 * o.pitch, 659.25 * o.pitch, 0.06, 0.3 * o.volume, t + 0.06);
    },
    splat: function (ctx, dest, o) {
      var t = ctx.currentTime;
      var src = ctx.createBufferSource(); src.buffer = noiseBuffer(ctx, 0.2, 'pink');
      var lp = ctx.createBiquadFilter(); lp.type = 'lowpass';
      lp.frequency.setValueAtTime(2000, t);
      lp.frequency.exponentialRampToValueAtTime(200, t + 0.2);
      var g = ctx.createGain();
      g.gain.setValueAtTime(0.4 * o.volume, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      src.connect(lp).connect(g).connect(dest);
      src.start(t); src.stop(t + 0.22);
    },
    flush: function (ctx, dest, o) {
      var t = ctx.currentTime;
      var src = ctx.createBufferSource(); src.buffer = noiseBuffer(ctx, 0.45, 'white');
      var lp = ctx.createBiquadFilter(); lp.type = 'lowpass';
      lp.frequency.setValueAtTime(3000, t);
      lp.frequency.exponentialRampToValueAtTime(300, t + 0.4);
      var g = ctx.createGain();
      g.gain.setValueAtTime(0.35 * o.volume, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
      src.connect(lp).connect(g).connect(dest);
      src.start(t); src.stop(t + 0.47);
    },
    fart: function (ctx, dest, o) {
      var t = ctx.currentTime;
      var osc = ctx.createOscillator(); osc.type = 'sawtooth';
      var lfo = ctx.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = 14;
      var lfoGain = ctx.createGain(); lfoGain.gain.value = 12;
      lfo.connect(lfoGain).connect(osc.frequency);
      osc.frequency.setValueAtTime(110, t);
      osc.frequency.exponentialRampToValueAtTime(80, t + 0.3);
      var g = ctx.createGain();
      g.gain.setValueAtTime(0.3 * o.volume, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      osc.connect(g).connect(dest);
      osc.start(t); lfo.start(t);
      osc.stop(t + 0.32); lfo.stop(t + 0.32);
    },
    coin: function (ctx, dest, o) {
      var t = ctx.currentTime;
      tone(ctx, dest, 'triangle', 659.25, 659.25, 0.04, 0.28 * o.volume, t);
      tone(ctx, dest, 'triangle', 783.99, 783.99, 0.04, 0.28 * o.volume, t + 0.04);
      tone(ctx, dest, 'triangle', 1046.5, 1046.5, 0.04, 0.28 * o.volume, t + 0.08);
    },
    levelup: function (ctx, dest, o) {
      var t = ctx.currentTime;
      var notes = [261.63, 329.63, 392.0, 523.25];
      for (var i = 0; i < notes.length; i++) {
        tone(ctx, dest, 'triangle', notes[i], notes[i], 0.05, 0.28 * o.volume, t + i * 0.05);
      }
    },
    gameover: function (ctx, dest, o) {
      var t = ctx.currentTime;
      var notes = [293.66, 233.08, 196.0];
      for (var i = 0; i < notes.length; i++) {
        tone(ctx, dest, 'sawtooth', notes[i], notes[i], 0.2, 0.25 * o.volume, t + i * 0.2);
      }
    },
    click: function (ctx, dest, o) {
      var t = ctx.currentTime;
      tone(ctx, dest, 'triangle', 880, 880, 0.04, 0.18 * o.volume, t);
    },
    engine: function (ctx, dest, o) {
      if (engineNodes) return;
      var t = ctx.currentTime;
      var osc = ctx.createOscillator(); osc.type = 'sawtooth'; osc.frequency.value = 180;
      var lfo = ctx.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = 6;
      var lfoGain = ctx.createGain(); lfoGain.gain.value = 18;
      lfo.connect(lfoGain).connect(osc.frequency);
      var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 600;
      var g = ctx.createGain(); g.gain.value = 0.0001;
      g.gain.exponentialRampToValueAtTime(0.18 * o.volume, t + 0.1);
      osc.connect(lp).connect(g).connect(dest);
      osc.start(t); lfo.start(t);
      engineNodes = { osc: osc, lfo: lfo, g: g };
    },
    zap: function (ctx, dest, o) {
      var t = ctx.currentTime;
      tone(ctx, dest, 'square', 1600, 200, 0.1, 0.22 * o.volume, t);
    },
    powerup: function (ctx, dest, o) {
      var t = ctx.currentTime;
      var notes = [523.25, 587.33, 659.25, 783.99, 1046.5];
      for (var i = 0; i < notes.length; i++) {
        tone(ctx, dest, 'triangle', notes[i], notes[i], 0.06, 0.26 * o.volume, t + i * 0.05);
      }
    },
    megaflush: function (ctx, dest, o) {
      var t = ctx.currentTime;
      // layer 1: white noise sweep
      var s1 = ctx.createBufferSource(); s1.buffer = noiseBuffer(ctx, 0.7, 'white');
      var lp1 = ctx.createBiquadFilter(); lp1.type = 'lowpass';
      lp1.frequency.setValueAtTime(3500, t);
      lp1.frequency.exponentialRampToValueAtTime(250, t + 0.7);
      var g1 = ctx.createGain();
      g1.gain.setValueAtTime(0.32 * o.volume, t);
      g1.gain.exponentialRampToValueAtTime(0.001, t + 0.7);
      s1.connect(lp1).connect(g1).connect(dest);
      s1.start(t); s1.stop(t + 0.72);
      // layer 2: pink noise reverb-ish tail
      var s2 = ctx.createBufferSource(); s2.buffer = noiseBuffer(ctx, 0.7, 'pink');
      var bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 1.2;
      bp.frequency.setValueAtTime(900, t);
      bp.frequency.exponentialRampToValueAtTime(150, t + 0.7);
      var g2 = ctx.createGain();
      g2.gain.setValueAtTime(0.0001, t);
      g2.gain.exponentialRampToValueAtTime(0.22 * o.volume, t + 0.15);
      g2.gain.exponentialRampToValueAtTime(0.001, t + 0.7);
      s2.connect(bp).connect(g2).connect(dest);
      s2.start(t); s2.stop(t + 0.72);
    },
    boost: function (ctx, dest, o) {
      var t = ctx.currentTime;
      tone(ctx, dest, 'sawtooth', 200, 1200, 0.25, 0.24 * o.volume, t);
    }
  };

  LS.sfx = {
    play: function (name, opts) {
      if (LS.isMuted()) return;
      var ctx = ensureCtx(); if (!ctx) return;
      resumeCtx();
      var fn = SOUNDS[name]; if (!fn) return;
      var o = { volume: 0.6, pitch: 1 };
      if (opts) { if (typeof opts.volume === 'number') o.volume = opts.volume; if (typeof opts.pitch === 'number') o.pitch = opts.pitch; }
      try { fn(ctx, masterGain, o); } catch (e) {}
    },
    stop: function (name) {
      if (name === 'engine' && engineNodes) {
        try {
          var t = audioCtx.currentTime;
          engineNodes.g.gain.cancelScheduledValues(t);
          engineNodes.g.gain.setValueAtTime(engineNodes.g.gain.value, t);
          engineNodes.g.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);
          engineNodes.osc.stop(t + 0.12);
          engineNodes.lfo.stop(t + 0.12);
        } catch (e) {}
        engineNodes = null;
      }
    }
  };

  // ---------- mute ----------
  LS.isMuted = function () { return lsGet('lorte_muted', '0') === '1'; };
  LS.setMuted = function (b) {
    lsSet('lorte_muted', b ? '1' : '0');
    if (b) { LS.sfx.stop('engine'); }
    updateMuteBtn();
  };
  LS.toggleMute = function () { LS.setMuted(!LS.isMuted()); };

  var muteBtn = null;
  function updateMuteBtn() {
    if (!muteBtn) return;
    muteBtn.textContent = LS.isMuted() ? '🔇' : '🔊';
    muteBtn.setAttribute('aria-label', LS.isMuted() ? 'Slå lyd til' : 'Slå lyd fra');
  }
  LS.mountMuteButton = function (parent) {
    parent = parent || document.body;
    if (muteBtn && muteBtn.parentNode) muteBtn.parentNode.removeChild(muteBtn);
    muteBtn = document.createElement('button');
    muteBtn.type = 'button';
    muteBtn.className = 'ls-mute';
    muteBtn.addEventListener('click', function (e) {
      e.preventDefault(); e.stopPropagation();
      LS.toggleMute();
      LS.sfx.play('click');
    });
    parent.appendChild(muteBtn);
    updateMuteBtn();
    return muteBtn;
  };

  // ---------- toast ----------
  LS.toast = function (text, opts) {
    opts = opts || {};
    var dur = opts.duration || 1800;
    try {
      var el = document.createElement('div');
      el.className = 'ls-toast';
      el.textContent = String(text);
      if (opts.color) el.style.color = opts.color;
      (document.body || document.documentElement).appendChild(el);
      // force reflow then add visible
      // eslint-disable-next-line no-unused-expressions
      el.offsetHeight;
      el.classList.add('ls-toast-show');
      setTimeout(function () {
        el.classList.remove('ls-toast-show');
        el.classList.add('ls-toast-hide');
        setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 400);
      }, dur);
    } catch (e) {}
  };

  window.LS = LS;
})();
