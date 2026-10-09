// Which optional asset files exist, so the site loads them directly instead of
// probing every extension (and logging a 404 for each miss). Keys are the base
// names the site looks for. Delete this file to fall back to probing.
window.ASSET_MANIFEST = {
  "assets/background/background": "assets/background/background.jpg",
  "assets/audio/music": "assets/audio/music.mp3",
  "assets/sfx/hover": "assets/sfx/hover.wav",
  "assets/sfx/confirm": "assets/sfx/confirm.wav",
  "assets/sfx/back": "assets/sfx/back.wav",
  "assets/ui": true,
};
