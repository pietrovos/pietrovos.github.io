// Music and sound effects.
// Files dropped into assets/audio and assets/sfx are used when present;
// otherwise everything is synthesised with the Web Audio API.
(function () {
  const EXT = ["mp3", "ogg", "wav", "m4a"];
  const SFX_NAMES = ["hover", "confirm", "back"];

  // Resolve the first file in `base.{ext}` that the browser can load.
  function probe(base) {
    const listed = window.ASSET_MANIFEST;
    if (listed) return Promise.resolve(listed[base] || null);
    return new Promise((resolve) => {
      let i = 0;
      const tryNext = () => {
        if (i >= EXT.length) return resolve(null);
        const src = `${base}.${EXT[i++]}`;
        const el = new Audio();
        el.preload = "auto";
        const ok = () => { cleanup(); resolve(src); };
        const fail = () => { cleanup(); tryNext(); };
        const cleanup = () => { el.removeEventListener("canplaythrough", ok); el.removeEventListener("error", fail); };
        el.addEventListener("canplaythrough", ok, { once: true });
        el.addEventListener("error", fail, { once: true });
        el.src = src;
        el.load();
      };
      tryNext();
    });
  }

  const Audio_ = {
    ctx: null,
    musicVol: 0.7,
    sfxVol: 0.7,
    files: { music: null, sfx: {} },
    musicEl: null,
    synthMusic: null,
    started: false,
    muted: false,

    async detect() {
      const [music, ...sfx] = await Promise.all([
        probe("assets/audio/music"),
        ...SFX_NAMES.map((n) => probe(`assets/sfx/${n}`)),
      ]);
      this.files.music = music;
      SFX_NAMES.forEach((n, i) => { if (sfx[i]) this.files.sfx[n] = sfx[i]; });
      return this.files;
    },

    // Must be called from a user gesture (browsers block autoplay).
    start() {
      if (this.started) return;
      this.started = true;
      this.away = false;
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : 1;
      this.master.connect(this.ctx.destination);
      this.reverb = this.makeReverb(3.2);
      this.reverb.connect(this.master);

      if (this.files.music) {
        this.musicEl = new Audio(this.files.music);
        this.musicEl.loop = true;
        this.musicEl.volume = 0;
        this.musicEl.muted = this.muted;
        this.musicEl.play().catch(() => {});
        this.fadeElement(this.musicEl, this.musicVol, 2500);
      } else {
        this.synthMusic = new AmbientMusic(this);
        this.synthMusic.start();
      }
    },

    setMusicVolume(v) {
      this.musicVol = v;
      if (this.musicEl && !this.away) { this.fadeId++; this.musicEl.volume = v; }
      if (this.synthMusic) this.synthMusic.setVolume(v);
    },
    setSfxVolume(v) { this.sfxVol = v; },

    setMuted(m) {
      this.muted = m;
      if (this.musicEl) this.musicEl.muted = m;
      if (this.master) this.master.gain.setTargetAtTime(m ? 0 : 1, this.ctx.currentTime, 0.05);
    },

    fadeElement(el, target, ms, done) {
      const from = el.volume, t0 = performance.now(), id = ++this.fadeId;
      const step = (t) => {
        if (id !== this.fadeId) return; // a newer fade took over
        // rAF timestamps can be slightly earlier than t0, so clamp at 0 too.
        const k = Math.min(1, Math.max(0, (t - t0) / ms));
        el.volume = from + (target - from) * k;
        if (k < 1) requestAnimationFrame(step);
        else done?.();
      };
      requestAnimationFrame(step);
    },
    fadeId: 0,

    // Pause everything while the visitor is somewhere else, and pick up where it left off.
    setAway(away) {
      if (!this.started) return;
      const el = this.musicEl;
      const stop = () => {
        this.fadeId++;
        if (el) { el.pause(); el.volume = 0; }
        this.ctx.suspend();
      };
      // A hidden tab stops animation frames, which would freeze a fade half way,
      // so stop at once (switching tabs fires blur first, then hides the page).
      if (away && document.hidden) { this.away = true; return stop(); }
      if (away === this.away) return;
      this.away = away;
      if (away) {
        if (el) this.fadeElement(el, 0, 400, stop);
        else stop();
      } else {
        this.ctx.resume();
        if (el) {
          el.play().catch(() => {});
          this.fadeElement(el, this.musicVol, 800);
        }
      }
    },

    makeReverb(seconds) {
      const ctx = this.ctx, len = ctx.sampleRate * seconds;
      const buf = ctx.createBuffer(2, len, ctx.sampleRate);
      for (let c = 0; c < 2; c++) {
        const d = buf.getChannelData(c);
        for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
      }
      const conv = ctx.createConvolver();
      conv.buffer = buf;
      return conv;
    },

    play(name) {
      if (!this.started || this.muted || this.sfxVol <= 0) return;
      const file = this.files.sfx[name];
      if (file) {
        const el = new Audio(file);
        el.volume = this.sfxVol;
        el.play().catch(() => {});
        return;
      }
      const fn = this.synth[name];
      if (fn) fn.call(this);
    },

    // Synthesised fallbacks, tuned to sound like soft menu chimes.
    synth: {
      hover() {
        const ctx = this.ctx, t = ctx.currentTime;
        this.tone(1568, t, 0.18, 0.10 * this.sfxVol, "sine", 0.35);
        this.tone(2349, t + 0.01, 0.12, 0.04 * this.sfxVol, "sine", 0.35);
        this.noise(t, 0.05, 0.03 * this.sfxVol, 5000);
      },
      confirm() {
        const ctx = this.ctx, t = ctx.currentTime;
        [587.33, 880, 1174.66].forEach((f, i) => this.tone(f, t + i * 0.025, 0.9, 0.09 * this.sfxVol, "triangle", 0.5));
        this.noise(t, 0.25, 0.05 * this.sfxVol, 1800, true);
      },
      back() {
        const ctx = this.ctx, t = ctx.currentTime;
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = "sine";
        o.frequency.setValueAtTime(880, t);
        o.frequency.exponentialRampToValueAtTime(330, t + 0.25);
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.09 * this.sfxVol, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
        o.connect(g); g.connect(this.master); g.connect(this.reverb);
        o.start(t); o.stop(t + 0.4);
        this.noise(t, 0.3, 0.04 * this.sfxVol, 900, true);
      },
    },

    tone(freq, t, dur, vol, type, wet) {
      const ctx = this.ctx;
      const o = ctx.createOscillator(), g = ctx.createGain(), w = ctx.createGain();
      o.type = type;
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(Math.max(vol, 0.0002), t + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      w.gain.value = wet;
      o.connect(g); g.connect(this.master); g.connect(w); w.connect(this.reverb);
      o.start(t); o.stop(t + dur + 0.05);
    },

    noise(t, dur, vol, cutoff, sweep) {
      const ctx = this.ctx, len = Math.ceil(ctx.sampleRate * dur);
      const buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      const src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
      src.buffer = buf;
      f.type = "bandpass";
      f.frequency.setValueAtTime(cutoff, t);
      if (sweep) f.frequency.exponentialRampToValueAtTime(cutoff * 0.3, t + dur);
      f.Q.value = 0.8;
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      src.connect(f); f.connect(g); g.connect(this.master); g.connect(this.reverb);
      src.start(t);
    },
  };

  // A slow, melancholy ambient loop: a low drone, a breathing pad
  // and sparse reverberant piano-like notes in D minor.
  function AmbientMusic(owner) {
    const ctx = owner.ctx;
    const out = ctx.createGain();
    out.gain.value = 0;
    out.connect(owner.master);
    const wet = ctx.createGain();
    wet.gain.value = 0.9;
    out.connect(wet); wet.connect(owner.reverb);

    const D = 146.83;
    const scale = [0, 3, 5, 7, 10, 12, 15, 17, 19]; // minor pentatonic-ish, semitones above D3
    const chords = [[0, 7, 15], [-2, 5, 12], [-4, 3, 10], [-5, 2, 10]]; // Dm, C, Bb, A-ish
    let timer = null, chordIdx = 0, padNodes = [];

    const hz = (semi) => D * Math.pow(2, semi / 12);

    function drone() {
      [D / 2, D / 2 * 1.5].forEach((f, i) => {
        const o = ctx.createOscillator(), g = ctx.createGain(), lfo = ctx.createOscillator(), lg = ctx.createGain();
        o.type = "sine"; o.frequency.value = f;
        g.gain.value = i ? 0.05 : 0.09;
        lfo.frequency.value = 0.07 + i * 0.03; lg.gain.value = 0.03;
        lfo.connect(lg); lg.connect(g.gain);
        o.connect(g); g.connect(out);
        o.start(); lfo.start();
      });
    }

    function pad(chord) {
      const t = ctx.currentTime;
      padNodes.forEach(({ g, o }) => { g.gain.setTargetAtTime(0.0001, t, 1.5); o.stop(t + 6); });
      padNodes = chord.map((s) => {
        const o = ctx.createOscillator(), f = ctx.createBiquadFilter(), g = ctx.createGain();
        o.type = "sawtooth"; o.frequency.value = hz(s); o.detune.value = (Math.random() - 0.5) * 12;
        f.type = "lowpass"; f.frequency.value = 520; f.Q.value = 0.3;
        g.gain.value = 0.0001; g.gain.setTargetAtTime(0.018, t, 2.2);
        o.connect(f); f.connect(g); g.connect(out); o.start(t);
        return { g, o };
      });
    }

    function pluck(semi, t, vel) {
      const f = hz(semi + 12);
      [1, 2, 3].forEach((h, i) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = "sine"; o.frequency.value = f * h;
        const v = vel * [0.12, 0.035, 0.015][i];
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(v, t + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 3.5 / h);
        o.connect(g); g.connect(out); o.start(t); o.stop(t + 4);
      });
    }

    function bar() {
      const t = ctx.currentTime + 0.05;
      pad(chords[chordIdx]);
      const root = chords[chordIdx][0];
      const notes = 2 + Math.floor(Math.random() * 3);
      for (let i = 0; i < notes; i++) {
        if (Math.random() < 0.25) continue;
        const s = scale[Math.floor(Math.random() * scale.length)] + (Math.random() < 0.3 ? root : 0);
        pluck(s, t + i * 1.6 + Math.random() * 0.4, 0.6 + Math.random() * 0.4);
      }
      chordIdx = (chordIdx + 1) % chords.length;
    }

    this.start = () => {
      drone();
      bar();
      timer = setInterval(bar, 7000);
      out.gain.setTargetAtTime(owner.musicVol, ctx.currentTime, 2);
    };
    this.setVolume = (v) => out.gain.setTargetAtTime(v, ctx.currentTime, 0.1);
    this.stop = () => clearInterval(timer);
  }

  const away = () => document.hidden || !document.hasFocus();
  const update = () => Audio_.setAway(away());
  document.addEventListener("visibilitychange", update);
  addEventListener("blur", update);
  addEventListener("focus", update);
  addEventListener("pagehide", () => Audio_.setAway(true));
  addEventListener("pageshow", update);

  window.GameAudio = Audio_;
})();
