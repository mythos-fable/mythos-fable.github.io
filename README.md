# DISCLAIMER

This project is primarily meant as a fun experiment for testing the capabilities of Claude's newest model, Fable 5. While using AI is certainly advantageous in certain fields and aspects of life, we condone using it as a complete replacement of writers and story designers.
Art is a human skill, and therefore its quality can only be measured on the man-controlled aspect of its creation. For this and for the sake of transparency, we want to share the list of prompts that led to this final result:

-  I want you to create a command line text game which is highly decision based with many branching paths and endings. The game should be simple gameplaywise, however immensly rich in lore and story. The setting should be fantasy and the gameplay should be dungeons and dragons based with only very simple rules. There  should be an inventory system and leveling system for the player. There should be no strict guardrails in the story so the player can choose any path and between good and honorable or really dark and cruel path - but the endings should reflect the choices that the player makes. Player should be able to recruit companions with the companions having some kind of approval meter for the player - reflecting its story choices. Try to reflect as many player choices as  possible with emphasis of story depth.

- I want to turn this project into an HTML/JS game. It should have basic UI and big text in a gamey font. Now, the importat thing is that the text should be typed out letter by letter instead of the whole block at once, and divided into paragraphs or block that require user continuation by clicking a "Next" button. The only time when the text shouldnt be rolled out is inventory and similar info stuff, but the next button should exists with those two. Play with the stylization of the text and make sure that certain "punchline" sentences are by itself so that the impact feels real. See what you can do.

- I need to do a few things:
    a. Rename the webpage to "Mythos's Fable" with the sub-title "Chapter 1: The Hollow Crown"
    b. The text typing seems to not work but some users claim it works fine, I am trying to find out what could be the issue.
    c. We need a manual saving feature with the possibility to reload previous saves.

- Okay, now I need to add a new feature. I want to create a tree-map graph, basically a visualizer of various ways this game can be played. I want it to become visible to the player at the end of the playthrough, and make it dynamic so it works in browser based on existing "nodes"

# Mythos's Fable — Chapter 1: The Hollow Crown (web version)

A vanilla HTML/JS port of the Python terminal game in `../mythos`. No build
step, no dependencies: open `index.html` in a browser (works straight off
`file://`).

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
- **The Map of Roads** (`js/map.js`): every ending screen offers *View the
  map of roads* — an SVG graph of all 179 scenes, laid out left→right with
  pan/zoom. Scenes you've walked (any playthrough) show their names; unknown
  roads stay as dimmed "???" so the map fills in over replays; the
  just-finished route is highlighted in gold. Exploration memory lives in
  localStorage key `hollow_crown_map_v1`; once an ending is recorded, the
  title screen gains *The map of roads* too. The three function-valued
  `goto`s in the story are mirrored in `DYN_TARGETS` (map.js), which the
  selftest asserts against the story so they can't drift.

## Layout

| Path | Role |
| --- | --- |
| `js/items.js`, `js/dice.js`, `js/state.js`, `js/combat.js`, `js/fx.js` | DOM-free ports of the Python game logic |
| `js/story/*.js` | Scene data, translated 1:1 from `mythos/story/*.py` |
| `js/engine.js` | Event-driven scene engine (`enterScene` / `transition` / `runHeadless`) |
| `js/presenter.js`, `js/meta.js`, `js/main.js` | Typewriter presenter, info modals, title screen |
| `js/save.js` | localStorage persistence, same JSON shape as `savegame.json` |

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
