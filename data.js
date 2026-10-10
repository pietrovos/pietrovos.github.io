// Hallownest flavour on top of the portfolio content in content.js.
// Edit projects, skills and experience there; edit lore and map layout here.
(function () {
  const C = window.CONTENT;

  const lore = {
    supportlens: "It speaks only of what it has seen, and only to those permitted to hear.",
    fulfillops: "No crate leaves twice. No unit is promised to two masters.",
    scopeflow: "Every promise written down. Every revision remembered.",
    jobpilot: "A ledger of every door knocked upon.",
    scheduler: "Three hundred paths, each guarded by those that came before.",
    drones: "Twenty wings against the flame, and none left behind.",
  };

  // Map pin positions (% of the map area), oldest to newest along the path.
  const mapPins = {
    flyers: { x: 11, y: 40 },
    ubreakifix: { x: 34, y: 68 },
    carleton: { x: 62, y: 32 },
    next: { x: 88, y: 58 },
  };
  const mapOrder = ["flyers", "ubreakifix", "carleton", "next"];

  window.PORTFOLIO = {
    projects: C.projects.map((p) => ({ ...p, lore: lore[p.id] || "" })),
    charms: C.skills.map((s) => ({ name: s.name, notches: s.level, group: s.group, desc: s.desc })),
    map: mapOrder
      .map((id) => C.experience.find((e) => e.id === id))
      .filter(Boolean)
      .map((e) => ({ id: e.id, area: e.org, title: e.title, when: e.when, where: e.where, points: e.points, ...mapPins[e.id] })),
  };
})();
