(function () {
  const data = window.PORTFOLIO;
  const audio = window.GameAudio;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  // ---------- Progress (geo, completion) ----------
  const STORE_KEY = "hallownest-portfolio-progress";
  const store = {
    get() { try { return JSON.parse(localStorage.getItem(STORE_KEY)) || null; } catch { return null; } },
    set(v) { try { localStorage.setItem(STORE_KEY, JSON.stringify(v)); } catch {} },
  };
  const progress = Object.assign({ seen: [], geo: 0 }, store.get() || {});
  delete progress.achievements; // from older saves

  const discoverables = [
    ...["about", "journal", "charms", "map", "contact"].map((s) => "screen:" + s),
    ...data.projects.map((p) => "project:" + p.id),
    ...data.charms.map((c) => "charm:" + c.name),
    ...data.map.map((m) => "map:" + m.id),
  ];

  function seen(key) { return progress.seen.includes(key); }

  function discover(key, geo = 15) {
    if (seen(key)) return;
    progress.seen.push(key);
    progress.geo += geo;
    store.set(progress);
    renderProgress();
    $$(`[data-key="${CSS.escape(key)}"]`).forEach((el) => el.classList.add("seen"));
  }

  function renderProgress(animate = true) {
    const geoEl = $("#geo");
    const target = progress.geo;
    const from = animate ? Number(geoEl.textContent) || 0 : target;
    const t0 = performance.now();
    const step = (t) => {
      const k = Math.min(1, (t - t0) / 600);
      geoEl.textContent = Math.round(from + (target - from) * k);
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    const pct = Math.round((discoverables.filter(seen).length / discoverables.length) * 100);
    $("#completion").textContent = pct + "%";
  }

  let toastTimer = 0;
  const toastQueue = [];
  function toast(title, desc, label) {
    toastQueue.push({ title, desc, label });
    if (toastQueue.length === 1) showNextToast();
  }
  function showNextToast() {
    const t = toastQueue[0];
    if (!t) return;
    const el = $("#toast");
    el.innerHTML = `<span class="ach-fleur left" aria-hidden="true"></span><span class="ach-fleur right" aria-hidden="true"></span><span class="toast-label">${t.label}</span><strong>${t.title}</strong><span>${t.desc}</span>`;
    el.classList.add("show");
    document.body.classList.add("toasting");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      el.classList.remove("show");
      document.body.classList.remove("toasting");
      setTimeout(() => { toastQueue.shift(); showNextToast(); }, 500);
    }, 3200);
  }

  // ---------- Content rendering ----------
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function buildJournal() {
    const list = $(".journal-list");
    list.innerHTML = data.projects.map((p, i) => `
      <li><button class="entry-btn" role="option" data-key="project:${p.id}" data-index="${i}">
        <span class="entry-glyph" aria-hidden="true"></span>${esc(p.name)}
      </button></li>`).join("");
    $$(".entry-btn", list).forEach((btn) => btn.addEventListener("focus", () => showProject(+btn.dataset.index)));
    showProject(0, false);
  }

  function showProject(i, mark = true) {
    const p = data.projects[i];
    $$(".entry-btn").forEach((b, k) => b.classList.toggle("active", k === i));
    const entry = $(".journal-entry");
    entry.classList.remove("reveal");
    void entry.offsetWidth;
    entry.innerHTML = `
      <h3>${esc(p.name)}</h3>
      <p class="kind">${esc(p.kind)}</p>
      <svg class="flourish small" viewBox="0 0 600 60" aria-hidden="true"><use href="#flourish"/></svg>
      <span class="mini-fleur" aria-hidden="true"></span>
      <p class="lore">${esc(p.lore)}</p>
      <ul>${p.points.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
      <p class="stack">${p.stack.map((s) => `<span>${esc(s)}</span>`).join("")}</p>
      ${p.url ? `<a class="link" href="${esc(p.url)}" target="_blank" rel="noopener">View on GitHub →</a>` : ""}`;
    entry.classList.add("reveal");
    if (mark) discover("project:" + p.id, 25);
  }

  function buildCharms() {
    const grid = $(".charm-grid");
    grid.innerHTML = data.charms.map((c, i) => `
      <button class="charm" role="option" data-key="charm:${esc(c.name)}" data-index="${i}" aria-label="${esc(c.name)}">
        <span class="charm-icon" aria-hidden="true">${charmGlyph(i)}</span>
        <span class="charm-name">${esc(c.name)}</span>
      </button>`).join("");
    $$(".charm", grid).forEach((btn) => btn.addEventListener("focus", () => showCharm(+btn.dataset.index)));
    showCharm(0, false);
  }

  // Simple geometric charm sigils, varied per index.
  function charmGlyph(i) {
    const sides = 3 + (i % 5);
    const pts = (r, rot) => Array.from({ length: sides }, (_, k) => {
      const a = rot + (k / sides) * Math.PI * 2;
      return `${30 + Math.cos(a) * r},${30 + Math.sin(a) * r}`;
    }).join(" ");
    return `<svg viewBox="0 0 60 60">
      <circle cx="30" cy="30" r="26" class="ring"/>
      <polygon points="${pts(18, -Math.PI / 2)}" class="outer"/>
      <polygon points="${pts(9, Math.PI / 2 + i)}" class="inner"/>
      <circle cx="30" cy="30" r="3" class="core"/>
    </svg>`;
  }

  function showCharm(i, mark = true) {
    const c = data.charms[i];
    $$(".charm").forEach((b, k) => b.classList.toggle("active", k === i));
    const el = $(".charm-detail");
    el.classList.remove("reveal");
    void el.offsetWidth;
    el.innerHTML = `
      <div class="charm-big" aria-hidden="true">${charmGlyph(i)}</div>
      <h3>${esc(c.name)}</h3>
      <p class="kind">${esc(c.group)}</p>
      <p class="notches" aria-label="${c.notches} of 3 notches">${"<span class=on></span>".repeat(c.notches)}${"<span></span>".repeat(3 - c.notches)}</p>
      <p>${esc(c.desc)}</p>`;
    el.classList.add("reveal");
    if (mark) discover("charm:" + c.name, 10);
  }

  // A smooth route through every pin, one path per leg so the legs walked so far can light up.
  function mapLegs(pts) {
    return pts.slice(1).map((b, i) => {
      const a = pts[i], before = pts[i - 1] || a, after = pts[i + 2] || b;
      const c1 = { x: a.x + (b.x - before.x) / 6, y: a.y + (b.y - before.y) / 6 };
      const c2 = { x: b.x - (after.x - a.x) / 6, y: b.y - (after.y - a.y) / 6 };
      return `M${a.x} ${a.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${b.x} ${b.y}`;
    });
  }

  function buildMap() {
    const nodes = $(".map-nodes");
    $(".map-paths", nodes).innerHTML = mapLegs(data.map)
      .map((d, i) => `<path class="trail" d="${d}"/><path class="walked" data-leg="${i}" d="${d}"/>`).join("");
    nodes.insertAdjacentHTML("beforeend", data.map.map((m, i) => `
      <button class="map-node${i === data.map.length - 1 ? " here" : ""}" data-key="map:${m.id}" data-index="${i}" style="left:${m.x}%;top:${m.y}%">
        <span class="pin" aria-hidden="true"></span><span class="area">${esc(m.area)}</span>
        <span class="when">${esc(m.when)}</span>
      </button>`).join(""));
    $$(".map-node", nodes).forEach((btn) => btn.addEventListener("focus", () => showMapNode(+btn.dataset.index)));
    showMapNode(0, false);
  }

  function showMapNode(i, mark = true) {
    const m = data.map[i];
    $$(".map-node").forEach((b, k) => b.classList.toggle("active", k === i));
    $$(".map-paths .walked").forEach((leg) => leg.classList.toggle("on", +leg.dataset.leg < i));
    const el = $(".map-detail");
    el.classList.remove("reveal");
    void el.offsetWidth;
    el.innerHTML = `
      <h3>${esc(m.title)}</h3>
      <p class="kind">${esc(m.area)} · ${esc(m.where)} · ${esc(m.when)}</p>
      <ul>${m.points.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`;
    el.classList.add("reveal");
    if (mark) discover("map:" + m.id, 20);
  }

  // ---------- Screens & navigation ----------
  let current = "title";
  let busy = false;
  const lastFocus = {};

  function navItems(screen) {
    return $$("button, a, input", screen).filter((el) => !el.disabled && el.offsetParent !== null);
  }

  const SCREENS = ["title", "menu", "about", "journal", "charms", "map", "contact", "options"];
  const screenFromHash = () => {
    const id = location.hash.slice(1);
    return SCREENS.includes(id) ? id : "title";
  };

  let depth = 0; // screens we've pushed onto browser history

  function go(id, { sound = "confirm", push = true } = {}) {
    if (busy || id === current) return;
    busy = true;
    if (push) history.pushState({ depth: ++depth }, "", id === "title" ? location.pathname + location.search : "#" + id);
    if (sound) audio.play(sound);
    const from = $("#" + current), to = $("#" + id);
    lastFocus[current] = document.activeElement;
    from.classList.remove("active");
    to.classList.add("active");
    current = id;
    if (id !== "menu" && id !== "title" && id !== "options") discover("screen:" + id, 10);
    const restore = id === "menu" ? lastFocus.menu : null;
    const first = restore && to.contains(restore) ? restore : navItems(to)[0];
    quietFocus(first);
    // The initially shown entry counts as viewed.
    if (id === "journal") showProject(0);
    if (id === "charms") showCharm(0);
    if (id === "map") showMapNode(0);
    setTimeout(() => { busy = false; }, 300);
  }

  // Focus without the hover sound (used when screens change).
  let silent = false;
  function quietFocus(el) {
    if (!el) return;
    silent = true;
    el.focus({ preventScroll: true });
    silent = false;
  }

  document.addEventListener("focusin", (e) => {
    const el = e.target;
    if (!el.matches("button, a, input") || el.id === "mute") return;
    $$(".selected").forEach((s) => s.classList.remove("selected"));
    el.classList.add("selected");
    if (!silent) audio.play("hover");
  });

  // Mouse hover selects, like the in-game menus.
  document.addEventListener("mouseover", (e) => {
    const el = e.target.closest("button, a");
    if (el && el !== document.activeElement && $("#" + current).contains(el)) el.focus({ preventScroll: true });
  });

  function moveFocus(dir, axis) {
    const screen = $("#" + current);
    const items = navItems(screen).filter((el) => el.type !== "range");
    const active = document.activeElement;
    let i = items.indexOf(active);

    // Charm grid: up/down jump by row.
    if (axis === "y" && active?.classList.contains("charm")) {
      const charms = $$(".charm", screen);
      const cols = charms.filter((c) => c.offsetTop === charms[0].offsetTop).length;
      const ci = charms.indexOf(active) + dir * cols;
      if (ci >= 0 && ci < charms.length) return charms[ci].focus();
    }
    if (i === -1) i = dir > 0 ? -1 : items.length;
    const next = items[(i + dir + items.length) % items.length];
    next?.focus();
  }

  // Browser back/forward moves between screens.
  addEventListener("popstate", (e) => {
    depth = e.state?.depth || 0;
    busy = false;
    go(screenFromHash(), { sound: "back", push: false });
  });

  function back() {
    // Unwind our own history entries so the browser's back button stays in step.
    if (depth > 0) return history.back();
    if (current === "menu") return go("title", { sound: "back" });
    if (current !== "title") go("menu", { sound: "back" });
  }

  document.addEventListener("keydown", (e) => {
    if ((e.key === "m" || e.key === "M") && !e.ctrlKey && !e.metaKey && !e.altKey) return toggleMute();
    if (current === "title") {
      if (e.key === "Tab") return;
      e.preventDefault();
      return enter();
    }
    const tag = document.activeElement?.type;
    switch (e.key) {
      case "ArrowDown": case "s": case "S":
        e.preventDefault(); moveFocus(1, "y"); break;
      case "ArrowUp": case "w": case "W":
        e.preventDefault(); moveFocus(-1, "y"); break;
      case "ArrowRight": case "d": case "D":
        if (tag === "range") return;
        e.preventDefault(); moveFocus(1, "x"); break;
      case "ArrowLeft": case "a": case "A":
        if (tag === "range") return;
        e.preventDefault(); moveFocus(-1, "x"); break;
      case "Escape": case "Backspace":
        e.preventDefault(); back(); break;
    }
  });

  document.addEventListener("click", (e) => {
    if (e.target.closest("#mute")) return toggleMute();
    if (current === "title") { e.preventDefault(); return enter(); }
    const el = e.target.closest("button, a");
    if (!el) return;
    if (el.matches("[data-copy]")) return copyText(el.dataset.copy);
    // On narrow screens the detail sits below the list, so bring it into view.
    if (el.matches(".entry-btn, .charm") && matchMedia("(max-width: 760px)").matches) {
      $(el.matches(".charm") ? ".charm-detail" : ".journal-entry").scrollIntoView({ behavior: "smooth", block: "start" });
    }
    if (el.dataset.go) go(el.dataset.go);
    else if (el.hasAttribute("data-back")) back();
    else audio.play("confirm");
  });

  function enter() {
    if (busy) return;
    audio.start();
    go("menu");
  }

  // Arriving on a deep link skips the title screen; the music then starts on the first interaction.
  ["pointerdown", "keydown"].forEach((type) => addEventListener(type, () => audio.start(), { once: true, capture: true }));

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      audio.play("confirm");
      toast("Copied", text, "Clipboard");
    } catch {
      toast("Couldn't copy", text, "Clipboard");
    }
  }

  function buildContact() {
    const p = window.CONTENT.person;
    const short = (url) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
    const ext = 'target="_blank" rel="noopener"';
    $(".contact-list").innerHTML = `
      <li class="email-row"><a href="mailto:${esc(p.email)}">${esc(p.email)}</a><button class="copy" data-copy="${esc(p.email)}" aria-label="Copy email address">Copy</button></li>
      <li><a href="${esc(p.github)}" ${ext}>${esc(short(p.github))}</a></li>
      <li><a href="${esc(p.linkedin)}" ${ext}>${esc(short(p.linkedin))}</a></li>
      <li><a href="${esc(p.resume)}" ${ext}>Resume (PDF)</a></li>`;
  }

  // ---------- Options ----------
  let toggleMute = () => {};
  function bindOptions() {
    const prefs = (() => { try { return JSON.parse(localStorage.getItem(STORE_KEY + "-prefs")) || {}; } catch { return {}; } })();
    const save = () => { try { localStorage.setItem(STORE_KEY + "-prefs", JSON.stringify(prefs)); } catch {} };

    const music = $("#vol-music"), sfx = $("#vol-sfx"), parts = $("#opt-particles");
    if (prefs.music != null) music.value = prefs.music;
    if (prefs.sfx != null) sfx.value = prefs.sfx;
    if (prefs.particles != null) parts.checked = prefs.particles;

    const apply = () => {
      music.nextElementSibling.value = music.value;
      sfx.nextElementSibling.value = sfx.value;
      [music, sfx].forEach((el) => el.style.setProperty("--fill", el.value + "%"));
      audio.setMusicVolume(music.value / 100);
      audio.setSfxVolume(sfx.value / 100);
      window.GameBackground.setParticles(parts.checked);
    };
    music.addEventListener("input", () => { prefs.music = +music.value; save(); apply(); });
    sfx.addEventListener("input", () => { prefs.sfx = +sfx.value; save(); apply(); });
    sfx.addEventListener("change", () => audio.play("hover"));
    parts.addEventListener("change", () => { prefs.particles = parts.checked; save(); apply(); audio.play("confirm"); });
    apply();

    const muteBtn = $("#mute");
    const showMute = () => {
      muteBtn.setAttribute("aria-pressed", String(audio.muted));
      muteBtn.setAttribute("aria-label", audio.muted ? "Unmute sound" : "Mute sound");
      muteBtn.title = (audio.muted ? "Unmute" : "Mute") + " sound (M)";
    };
    toggleMute = () => {
      audio.setMuted(!audio.muted);
      prefs.muted = audio.muted;
      save();
      showMute();
      muteBtn.blur();
    };
    audio.setMuted(!!prefs.muted);
    showMute();
  }

  // Swap the SVG ornaments for the game's own sprites when assets/ui is present.
  function loadGameUi() {
    if (window.ASSET_MANIFEST && !window.ASSET_MANIFEST["assets/ui"]) return Promise.resolve(false);
    return new Promise((resolve) => {
      const probe = new Image();
      probe.onload = () => {
        document.documentElement.classList.add("hk-ui");
        const img = (file, cls) => Object.assign(document.createElement("img"), { src: "assets/ui/" + file, className: cls, alt: "" });
        const span = (cls) => Object.assign(document.createElement("span"), { className: cls, ariaHidden: "true" });
        $("#title .flourish.top").replaceWith(img("title-top.png", "title-fleur top"));
        $("#title .flourish.bottom").replaceWith(img("title-bottom.png", "title-fleur bottom"));
        $$(".panel > header, .menu-head").forEach((h) => {
          h.querySelector(".flourish")?.replaceWith(span("bottom-fleur"));
          if (h.closest(".panel")) h.prepend(span("top-fleur"));
        });
        resolve(true);
      };
      probe.onerror = () => resolve(false);
      probe.src = "assets/ui/cursor-strip.png";
    });
  }

  function reportAssets(files, gameUi) {
    const sfxCount = Object.keys(files.sfx).length;
    const bgSource = window.GameBackground.source;
    $("#asset-status").textContent =
      `Background: ${bgSource === "procedural" ? "drawn" : bgSource} · ` +
      `Music: ${files.music ? "file" : "synthesised"} · ` +
      `Effects: ${sfxCount ? `${sfxCount} of 4 from files` : "synthesised"} · ` +
      `Ornaments: ${gameUi ? "game sprites" : "drawn"}`;
  }

  // ---------- Debug: add ?fps to the URL to see the real frame rate ----------
  if (new URLSearchParams(location.search).has("fps")) {
    const meter = Object.assign(document.createElement("div"), { className: "fps-meter" });
    document.body.append(meter);
    let frames = 0, worst = 0, prev = performance.now(), windowStart = prev;
    const tick = (t) => {
      frames++;
      worst = Math.max(worst, t - prev);
      prev = t;
      if (t - windowStart >= 500) {
        meter.textContent = `${Math.round((frames * 1000) / (t - windowStart))} fps · worst ${worst.toFixed(1)} ms`;
        frames = 0; worst = 0; windowStart = t;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  // ---------- Boot ----------
  buildJournal();
  buildCharms();
  buildMap();
  buildContact();
  bindOptions();
  if (matchMedia("(hover: none)").matches) $("#title .press").textContent = "Tap to begin";
  if (new URLSearchParams(location.search).has("debug")) $("#asset-status").hidden = false;
  progress.seen.forEach((k) => $$(`[data-key="${CSS.escape(k)}"]`).forEach((el) => el.classList.add("seen")));
  renderProgress(false);

  Promise.all([window.GameBackground.init(), audio.detect(), loadGameUi()]).then(([, files, gameUi]) => reportAssets(files, gameUi));

  // Open straight onto a linked screen, e.g. index.html#journal
  depth = history.state?.depth || 0;
  const initial = screenFromHash();
  if (initial !== "title") go(initial, { sound: null, push: false });
})();
