# Hallownest Portfolio

My portfolio as a game title screen: a menu you move through with the keyboard or mouse, a Hunter's Journal of projects, a charm grid of skills, and a map of where I've been.

Plain HTML, CSS and JavaScript. No build step.

## Run it

Serve this folder directly:

```sh
cd ~/work/Portfolio/hallownest-portfolio
python -m http.server 8765
# open http://localhost:8765/
```

## Controls

| Key | Action |
| --- | --- |
| Any key / click | Leave the title screen and start the music |
| ↑ ↓ ← → or WASD | Move the selection |
| Enter / Space | Select |
| Esc / Backspace | Go back |
| M or the speaker icon (top left) | Mute or unmute all sound |

Every screen has its own link (`#journal`, `#charms`, `#map`, `#contact`, ...), so you can send someone straight to your projects, and the browser's back button moves between screens.

## Adding the Hollow Knight background, music and sound effects

The included Hollow Knight assets belong to Team Cherry. If assets are missing, the site draws its own underground city and synthesizes ambient music and menu sounds in the browser.

Drop files with these names into `assets/` and the site picks them up automatically:

| File | Used for |
| --- | --- |
| `assets/background/background.webm` or `.mp4` | Looping video background (takes priority) |
| `assets/background/background.jpg` / `.png` / `.webp` / `.gif` | Still background |
| `assets/audio/music.mp3` / `.ogg` / `.wav` / `.m4a` | Looping background music |
| `assets/sfx/hover.*` | Moving the menu selection |
| `assets/sfx/confirm.*` | Selecting an item |
| `assets/sfx/back.*` | Going back |
| `assets/ui/*.png` | Game ornaments: menu cursor, heading fleurs, title flourishes, popup brackets (sprite strips, played frame by frame) |

Any of these can be left out; whatever is missing falls back to the built-in version. Open the page with `?debug` to see what's being used under **Options**.

`assets/manifest.js` lists which of these files exist so the site loads them directly instead of probing every extension. Update it when you add or remove a file, or delete it to go back to probing.

Places to get them:

- **Music**: the official soundtrack by Christopher Larkin, sold on Bandcamp and Steam. "Title" or "Dirtmouth" works well as a loop.
- **Menu sounds and backgrounds**: from your own copy of the game, or a wallpaper or menu-background video you have rights to use.

If the site goes on a public host, check that you're allowed to redistribute whatever you put in `assets/`. Using your own original or royalty-free audio avoids the problem.

## Editing content

Projects, skills and experience live in `content.js`, initially copied from `../shared/content.js` so this site can deploy independently. `data.js` adds the Hallownest flavour: the lore line for each project and the map pin positions. The resume lives in `assets/Pietro_Adamvoski_Resume.pdf`. Progress (geo and completion) and options are saved in `localStorage`.

## Deployment

Live site: https://pietrovos.github.io

GitHub Pages publishes the root of the `main` branch. Push changes to `main` to update the site. `.nojekyll` keeps the site as plain static files.
