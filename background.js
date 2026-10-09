// Background: a user-supplied video or image from assets/background if one exists,
// otherwise a procedurally drawn underground city with rain and drifting light motes.
(function () {
  const VIDEO_EXT = ["webm", "mp4"];
  const IMAGE_EXT = ["jpg", "jpeg", "png", "webp", "gif"];
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const BASE = "assets/background/background";
  const listed = window.ASSET_MANIFEST && (window.ASSET_MANIFEST[BASE] || "");
  const isVideo = (src) => VIDEO_EXT.some((ext) => src.endsWith("." + ext));

  function probeVideo(video) {
    if (listed != null) {
      if (!isVideo(listed)) return Promise.resolve(false);
      video.src = listed;
      return new Promise((resolve) => {
        video.addEventListener("loadeddata", () => resolve(true), { once: true });
        video.addEventListener("error", () => resolve(false), { once: true });
      });
    }
    return new Promise((resolve) => {
      let i = 0;
      const next = () => {
        if (i >= VIDEO_EXT.length) return resolve(false);
        const src = `assets/background/background.${VIDEO_EXT[i++]}`;
        const ok = () => { off(); resolve(true); };
        const fail = () => { off(); next(); };
        const off = () => { video.removeEventListener("loadeddata", ok); video.removeEventListener("error", fail); };
        video.addEventListener("loadeddata", ok, { once: true });
        video.addEventListener("error", fail, { once: true });
        video.src = src;
        video.load();
      };
      next();
    });
  }

  function probeImage() {
    if (listed != null) return Promise.resolve(listed && !isVideo(listed) ? listed : null);
    return new Promise((resolve) => {
      let i = 0;
      const next = () => {
        if (i >= IMAGE_EXT.length) return resolve(null);
        const src = `assets/background/background.${IMAGE_EXT[i++]}`;
        const img = new Image();
        img.onload = () => resolve(src);
        img.onerror = next;
        img.src = src;
      };
      next();
    });
  }

  // Seeded RNG so the city looks the same on every resize.
  function rng(seed) {
    return () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  }

  const bg = document.getElementById("bg-canvas");
  const mc = document.getElementById("motes");
  const bctx = bg.getContext("2d");
  const mctx = mc.getContext("2d");
  let W = 0, H = 0, DPR = 1, layers = [], motes = [], drops = [];
  let mouseX = 0, mouseY = 0, px = 0, py = 0;
  let useCanvasCity = true, particles = true, raf = 0;

  // One silhouette layer of spires, domes and arches.
  function drawLayer(depth, seed) {
    const c = document.createElement("canvas");
    const margin = 80;
    c.width = (W + margin * 2) * DPR;
    c.height = H * DPR;
    const g = c.getContext("2d");
    g.scale(DPR, DPR);
    const r = rng(seed);
    const shade = [
      { fill: "#1a2a44", lamp: 0.35 },
      { fill: "#101b30", lamp: 0.6 },
      { fill: "#070d1a", lamp: 0.9 },
    ][depth];
    const baseY = H * [0.62, 0.72, 0.86][depth];
    const scale = [0.55, 0.8, 1.15][depth];
    g.fillStyle = shade.fill;

    let x = -20;
    const lamps = [];
    while (x < W + margin * 2) {
      const w = (40 + r() * 90) * scale;
      const h = (80 + r() * 260) * scale * (H / 900);
      const top = baseY - h;
      g.beginPath();
      g.moveTo(x, H);
      g.lineTo(x, top + w * 0.4);
      const style = r();
      if (style < 0.45) {
        // Pointed spire
        g.lineTo(x + w * 0.15, top + w * 0.4);
        g.lineTo(x + w * 0.5, top - h * 0.35);
        g.lineTo(x + w * 0.85, top + w * 0.4);
      } else if (style < 0.8) {
        // Dome with finial
        g.quadraticCurveTo(x + w * 0.5, top - w * 0.55, x + w, top + w * 0.4);
        g.moveTo(x + w * 0.48, top - w * 0.1);
        g.lineTo(x + w * 0.5, top - w * 0.6);
        g.lineTo(x + w * 0.52, top - w * 0.1);
      } else {
        // Flat-topped tower with crenellations
        const n = 4;
        for (let k = 0; k < n; k++) {
          const cx = x + (w / n) * k;
          g.lineTo(cx, top);
          g.lineTo(cx + (w / n) * 0.5, top);
          g.lineTo(cx + (w / n) * 0.5, top + 8 * scale);
          g.lineTo(cx + w / n, top + 8 * scale);
        }
      }
      g.lineTo(x + w, top + w * 0.4);
      g.lineTo(x + w, H);
      g.closePath();
      g.fill();

      // Arched windows
      if (r() < 0.7) {
        const rows = 1 + Math.floor(r() * 3);
        for (let k = 0; k < rows; k++) {
          const wy = top + w * 0.7 + k * 34 * scale;
          if (wy > baseY) break;
          lamps.push({ x: x + w * 0.5, y: wy, s: scale, lit: r() < 0.5 });
        }
      }
      x += w + r() * 18 * scale;
    }

    // Ground bridge for the nearest layer
    g.fillRect(-20, baseY, W + margin * 2 + 40, H - baseY);

    for (const l of lamps) {
      const ww = 7 * l.s, wh = 13 * l.s;
      g.save();
      if (l.lit) {
        const grad = g.createRadialGradient(l.x, l.y, 0, l.x, l.y, 26 * l.s);
        grad.addColorStop(0, `rgba(170, 220, 255, ${0.22 * shade.lamp})`);
        grad.addColorStop(1, "rgba(170, 220, 255, 0)");
        g.fillStyle = grad;
        g.fillRect(l.x - 30 * l.s, l.y - 30 * l.s, 60 * l.s, 60 * l.s);
        g.fillStyle = `rgba(200, 235, 255, ${0.5 * shade.lamp})`;
      } else {
        g.fillStyle = "rgba(0,0,0,0.35)";
      }
      g.beginPath();
      g.moveTo(l.x - ww / 2, l.y + wh / 2);
      g.lineTo(l.x - ww / 2, l.y - wh / 4);
      g.quadraticCurveTo(l.x, l.y - wh, l.x + ww / 2, l.y - wh / 4);
      g.lineTo(l.x + ww / 2, l.y + wh / 2);
      g.closePath();
      g.fill();
      g.restore();
    }
    return { canvas: c, depth, margin };
  }

  // Gradients and glow sprites are built once per resize, never per frame.
  let skyGrad, glowGrad, fogGrads = [], glowSprites = {};

  function makeGlowSprite(color) {
    const size = 64, c = document.createElement("canvas");
    c.width = c.height = size;
    const g = c.getContext("2d");
    const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, `rgba(${color}, 1)`);
    grad.addColorStop(0.3, `rgba(${color}, 0.35)`);
    grad.addColorStop(1, `rgba(${color}, 0)`);
    g.fillStyle = grad;
    g.fillRect(0, 0, size, size);
    return c;
  }

  function build() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    for (const c of [bg, mc]) {
      c.width = Math.round(W * DPR); c.height = Math.round(H * DPR);
      c.style.width = W + "px"; c.style.height = H + "px";
    }
    bctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    mctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    glowSprites = { cool: makeGlowSprite("200, 230, 255"), warm: makeGlowSprite("255, 230, 180") };

    if (useCanvasCity) {
      layers = [drawLayer(0, 11), drawLayer(1, 29), drawLayer(2, 53)];
      skyGrad = bctx.createLinearGradient(0, 0, 0, H);
      skyGrad.addColorStop(0, "#04070f");
      skyGrad.addColorStop(0.45, "#0c1a33");
      skyGrad.addColorStop(0.75, "#13284a");
      skyGrad.addColorStop(1, "#05080f");
      glowGrad = bctx.createRadialGradient(W * 0.5, H * 0.55, 0, W * 0.5, H * 0.55, Math.max(W, H) * 0.6);
      glowGrad.addColorStop(0, "rgba(90, 140, 210, 0.22)");
      glowGrad.addColorStop(1, "rgba(90, 140, 210, 0)");
      fogGrads = [0, 1].map((depth) => {
        const fog = bctx.createLinearGradient(0, H * 0.45, 0, H);
        fog.addColorStop(0, "rgba(40, 70, 110, 0)");
        fog.addColorStop(1, `rgba(40, 70, 110, ${0.18 - depth * 0.05})`);
        return fog;
      });
    }

    const area = W * H;
    motes = Array.from({ length: Math.round(area / 16000) }, () => newMote(true));
    drops = useCanvasCity ? Array.from({ length: Math.round(area / 9000) }, () => newDrop(true)) : [];
  }

  // Speeds are in pixels (or radians) per second, so motion is identical at 60 Hz and 240 Hz.
  function newMote(anywhere) {
    return {
      x: Math.random() * W,
      y: anywhere ? Math.random() * H : H + 10,
      r: 0.6 + Math.random() * 2.2,
      vy: -(5 + Math.random() * 21),
      sway: Math.random() * Math.PI * 2,
      swaySpeed: 0.25 + Math.random() * 0.6,
      a: 0.25 + Math.random() * 0.6,
      warm: Math.random() < 0.12,
    };
  }

  function newDrop(anywhere) {
    return {
      x: Math.random() * (W + 200) - 100,
      y: anywhere ? Math.random() * H : -20 - Math.random() * 100,
      len: 8 + Math.random() * 18,
      v: 360 + Math.random() * 420,
      layer: Math.floor(Math.random() * 3),
    };
  }

  function drawCity() {
    bctx.fillStyle = skyGrad;
    bctx.fillRect(0, 0, W, H);
    bctx.fillStyle = glowGrad;
    bctx.fillRect(0, 0, W, H);
    for (const l of layers) {
      const k = [6, 16, 34][l.depth];
      bctx.drawImage(l.canvas, -l.margin - px * k, -py * k * 0.4, W + l.margin * 2, H);
      if (l.depth < 2) {
        bctx.fillStyle = fogGrads[l.depth];
        bctx.fillRect(0, 0, W, H);
      }
    }
  }

  const RAIN_ALPHA = [0.06, 0.1, 0.15];

  function drawParticles(dt) {
    mctx.clearRect(0, 0, W, H);
    if (!particles) return;

    if (drops.length) {
      // One stroke per brightness layer instead of one per drop.
      mctx.strokeStyle = "rgb(170, 200, 240)";
      mctx.lineWidth = 1;
      for (let layer = 0; layer < 3; layer++) {
        mctx.globalAlpha = RAIN_ALPHA[layer];
        mctx.beginPath();
        for (const d of drops) {
          if (d.layer !== layer) continue;
          d.y += d.v * dt; d.x -= d.v * 0.12 * dt;
          if (d.y > H) Object.assign(d, newDrop(false));
          mctx.moveTo(d.x, d.y);
          mctx.lineTo(d.x - d.len * 0.12, d.y + d.len);
        }
        mctx.stroke();
      }
    }

    for (const m of motes) {
      m.sway += m.swaySpeed * dt;
      m.y += m.vy * dt;
      m.x += Math.sin(m.sway) * 15 * dt;
      if (m.y < -10) Object.assign(m, newMote(false));
      const s = m.r * 10;
      mctx.globalAlpha = m.a * (0.75 + Math.sin(m.sway * 3) * 0.25);
      mctx.drawImage(m.warm ? glowSprites.warm : glowSprites.cool, m.x - s / 2, m.y - s / 2, s, s);
    }
    mctx.globalAlpha = 1;
  }

  let last = 0;
  function frame(now) {
    // Cap the step so a backgrounded tab doesn't teleport everything on return.
    const dt = last ? Math.min((now - last) / 1000, 0.1) : 1 / 60;
    last = now;
    const ease = 1 - Math.pow(0.96, dt * 60);
    px += (mouseX - px) * ease;
    py += (mouseY - py) * ease;
    if (useCanvasCity) drawCity();
    drawParticles(dt);
    raf = requestAnimationFrame(frame);
  }

  addEventListener("mousemove", (e) => {
    mouseX = e.clientX / innerWidth - 0.5;
    mouseY = e.clientY / innerHeight - 0.5;
  });
  addEventListener("resize", build);

  window.GameBackground = {
    source: "procedural",
    async init() {
      const video = document.getElementById("bg-video");
      const imageEl = document.getElementById("bg-image");
      if (await probeVideo(video)) {
        video.hidden = false;
        if (!reduceMotion) video.play().catch(() => {});
        useCanvasCity = false;
        this.source = "video";
      } else {
        video.removeAttribute("src");
        const img = await probeImage();
        if (img) {
          imageEl.style.backgroundImage = `url("${img}")`;
          imageEl.hidden = false;
          useCanvasCity = false;
          this.source = "image";
        }
      }
      bg.hidden = !useCanvasCity;
      build();
      if (reduceMotion) {
        if (useCanvasCity) drawCity();
      } else {
        raf = requestAnimationFrame(frame);
      }
    },
    setParticles(on) { particles = on; if (!on) mctx.clearRect(0, 0, W, H); },
  };
})();
