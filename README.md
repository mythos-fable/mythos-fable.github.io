# Mythos's Fable (web version)

A vanilla HTML/JS narrative game. No build step, no dependencies: open
`index.html` in a browser (works straight off `file://`).

Two chapters so far — **Chapter 1: The Hollow Crown** (also playable as the
Python terminal game in `../mythos`, which stays frozen at chapter 1) and
**Chapter 2: The Unwoven Shore**, which unlocks once any Chapter 1 ending has
been discovered and can be started from *each* ending you have found.
Finishing a chapter snapshots your character; Chapter 2 imports it (or uses a
curated per-ending preset for endings discovered before snapshots existed).
See `../RELEASING.md` for how chapters are structured and released.

## Playing

- Narrative text types out letter by letter; click, Space, or Enter finishes
  the current block instantly, and the **Next ▸** button advances to the
  following one. Number keys 1–9 pick choices.
- Short, weighty lines are staged alone as "punchlines" with a fade-up
  instead of the typewriter.
- The **Aa** toolbar button cycles text speed (slow / normal / fast /
  instant); the setting persists. Info screens (Inventory, Character, Party)
  display instantly with a Close button.
- Progress autosaves to localStorage after every scene (never on a
  transition into death), so "An Unmarked Grave" offers *Rise from your last
  camp*.
- **Save** / **Load** in the toolbar give three manual slots on top of the
  autosave; the title screen offers *Load a saved tale* whenever a slot
  holds one. Saving is disabled while a fight is on.
- Note: typing is intentionally skipped when the OS asks for reduced motion
  (`prefers-reduced-motion`) or when the Aa speed is set to Instant — both
  make text appear all at once.
- **Chapters**: the title screen lists every released chapter as a card —
  Continue / Begin / Map per chapter, with later chapters sealed until the
  previous one has a discovered ending. Each chapter keeps its own autosave
  (chapter 1 keeps the original `hollow_crown_save_v1` key, so old saves
  just work; manual slots are shared and remember which chapter they hold).
  Reaching an ending records it — plus a full character snapshot — in the
  `mythos_fable_profile_v1` store; starting Chapter 2 lets you pick any
  discovered Chapter 1 ending to continue from.
- **The Map of Roads** (`js/map.js`): every ending screen offers *View the
  map of roads* — an SVG graph of the chapter's scenes, laid out left→right
  with pan/zoom (a continuation chapter has all of its entry openings at the
  left edge). Scenes you've walked (any playthrough) show their names;
  unknown roads stay as dimmed "???" so the map fills in over replays; the
  just-finished route is highlighted in gold. Exploration memory is
  per-chapter (`hollow_crown_map_v1` for chapter 1, `mythos_fable_map_chN`
  after); once a chapter has a recorded ending, its card gains a *Map*
  button. Function-valued `goto`s in the story are mirrored in `DYN_TARGETS`
  (map.js), which the selftest asserts against the story so they can't
  drift.

## Layout

| Path | Role |
| --- | --- |
| `js/items.js`, `js/dice.js`, `js/state.js`, `js/combat.js`, `js/fx.js` | DOM-free ports of the Python game logic |
| `js/story/*.js` | Chapter 1 scene data, translated 1:1 from `mythos/story/*.py` |
| `js/story/c2/*.js` | Chapter 2 scene data + `data.js` (presets, state import, new companions/items/enemies) |
| `js/chapters.js` | Chapter manifest: modules, entry points, ending tables (see `../RELEASING.md`) |
| `js/profile.js` | Cross-chapter progress: discovered endings, end-of-chapter snapshots, unlock rules |
| `js/engine.js` | Event-driven scene engine (`enterScene` / `transition` / `runHeadless`) |
| `js/presenter.js`, `js/meta.js`, `js/main.js` | Typewriter presenter, info modals, chapter menu |
| `js/save.js` | localStorage persistence, per-chapter autosaves + shared manual slots |

Story text conventions: paragraphs split on blank lines; a paragraph of ≤90
characters renders as a punchline automatically; a leading `# ` forces
punchline styling, a leading `= ` forces plain styling (both markers are
stripped before display and ignored by the crosscheck).

## Validation (Node, no browser needed)

```
node selftest.js            # static graph checks, golden paths, 300 random runs
node selftest.js --runs 60  # fewer random runs
node selftest.js --dump     # normalized scene-graph JSON
node crosscheck.js          # diff the JS port against the Python story sources
```

`crosscheck.js` tokenizes `mythos/story/*.py` directly (no Python runtime
required) and compares scene ids, texts (punctuation/case-blind), choices,
effect shapes, and check/combat targets against `selftest.js --dump`.

`dev-smoke.html` is a dev-only harness that loads the real game and
auto-clicks through it (random choices) so a headless browser run surfaces
presenter errors: append `?steps=N` to set the click budget. It clears the
save on load — don't open it with a playthrough you care about.
