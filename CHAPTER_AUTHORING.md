# Authoring a Chapter

A chapter is **one pack file** (manifest + scenes) plus, for big chapters,
**part files** that hold more scenes. Everything else — the manifest entry,
endings table, entry points, world-state map, presets, import/preset bridge,
save keys, map wiring — is derived by convention at load time. You write
prose, choices, and a small bridge config; the framework does the rest.

The game is plain scripts off `file://`: no build step, no modules, no JSON
loading. A pack is an ordinary `.js` file added to the two HTML script lists.

## Release checklist

1. Create `js/story/packs/chN.js` — the manifest (`HC.registerChapter({...})`).
   Put scenes inline for a small chapter, or split them into part files
   `js/story/packs/chN-openings.js`, `chN-act1.js`, ... each ending with
   `HC.registerScenes("chN", SCENES);`. Keep each part under ~1,500 lines.
2. Add the script tags to **both** `index.html` and `dev-smoke.html`, after
   the previous chapter's files: the `chN.js` manifest first, then its parts.
3. Validate: `node selftest.js --chapter chN` while iterating, then a full
   `node selftest.js` before release.

## The manifest

```js
(function (HC) {
  "use strict";
  HC.registerChapter({
    number: 3,                       // id "ch3"; every scene id starts "c3_"
    title: "The Example Tale",
    subtitle: "a tale of examples",
    from: "ch2",                     // default ch(number-1); rarely needed
    // thanks: defaults to "Thank you for playing <title>."

    companions: { /* new HC.COMPANION_DEFS entries (optional) */ },
    companionLines: { /* combat quips per new companion */ },
    items:   { /* new HC.ITEMS, ids prefixed c3_ */ },
    enemies: { /* new HC.ENEMIES, ids prefixed c3_ */ },

    bridge: {
      // previous-chapter flags this chapter remembers (never "ws")
      flagCarryover: ["c2_debt_settled", "c2_met_rook"],
      // gear crosses the break by default; quest items don't, unless listed
      keepQuestItems: ["c2_knot_charm"],
      dropItems: [],                 // gear that explicitly does NOT cross
      // "as the legends tell it" preset: character level and base sheet;
      // per-ending overrides live on the opening scenes (below)
      presetLevel: 7,                // xp/max_hp derived from the level rules
      presetBase: {
        stats: { might: 3, wits: 3, spirit: 3 },
        gold: 80, karma: 10,
        inventory: ["c2_knot_knife", "c2_kelp_weave", "poultice", "bread"],
        companions: {
          oshka: { met: true, in_party: false, approval: 25, alive: true },
        },
        flags: {},
      },
    },

    scenes: { /* SCENES here, or in part files via HC.registerScenes */ },
    epilogue: (s) => "...",          // or assign HC.story.c3_epilogue in a part
  });
})(globalThis.HC);
```

Derived automatically: the endings table (from scenes bearing `ending:`),
`entry.points` / world states / presets (from the opening markers),
`importState`/`presetState` (from `bridge`), save and map storage keys.

## Scenes

```js
"c3_harbor": {
  text: "The harbor remembers you, {name}.",   // {name} = player's name
  on_enter: { xp: 25, flags: { c3_seen_harbor: true } },  // fx, once per arrival
  choices: [
    { text: "Ask about the ships.", goto: "c3_ships" },
    { text: "Pay the toll.", fx: { gold: -10 }, goto: "c3_inside" },
    { text: "Climb the sea-wall.",
      check: { stat: "might", dc: 12, ok: "c3_wall_top", fail: "c3_fall",
               ok_fx: { xp: 20 }, fail_fx: { hp: -4 } } },
    { text: "Fight the wardens.",
      combat: { enemy: "c3_wardens", win: "c3_won", flee: "c3_fled",
                win_fx: { xp: 40 } } },
  ],
},
"c3_end_example": { text: "It ends.", ending: "The Example Ending" },
"death":          { text: "It ends badly.", ending: "A Salted Grave" },
```

- Every scene id starts with the chapter prefix (`c3_`); the one exception is
  `death`, which every chapter must define (its ending gets `isDeath`).
- A scene either has `ending: "<static title>"` and no choices, or a
  non-empty `choices` array. Each choice has exactly one of
  `goto` / `check` / `combat`. `check.stat` is `might`/`wits`/`spirit`.
- fx keys: `karma, gold, hp, heal_full, xp, "items+", "items-", flags,
  approval: {cid: delta}, recruit, meet, leave, kill_companion,
  "stat+", "stat-"`. An fx may also be a function `(s) => fxObject`.
- Ending scenes' titles are the endings table; scene definition order is the
  order the next chapter's picker shows them.

## Openings (one per previous non-death ending)

Every real ending of the previous chapter needs an opening scene carrying
three markers (the validator enforces full coverage):

```js
"c3_open_paid": {
  entry_from: "c2_end_paid",      // the ch2 ending this opening continues
  ws: "debt_paid",                // value of flags.ws for this world state
  preset: {                       // overrides merged over bridge.presetBase
    karma: 30,                    // (top-level blocks replace, not merge)
    flags: { c2_debt_settled: true },
  },
  text: "...", choices: [ ... ],
},
```

Openings typically converge on a shared hub scene after a few beats. In
scenes, branch on the world state with `when: { ws: ["debt_paid", ...] }`.

## Declarative conditions and branching (the DSL)

Prefer data forms — they need no JS and the map/validator can see through
them. Plain functions still work everywhere as an escape hatch.

**Conditions** (`when:` on choices, `if:` in variants/picks):

```
{ has: "flag" }  { hasnt: "flag" }      { item: "id" }  { no_item: "id" }
{ inp: "cid" }   { notp: "cid" }        { met: "cid" }  { not_met: "cid" }
{ appr: ["cid", 40] }  { gold: 50 }     { karma_ge: 20 }  { karma_le: -20 }
{ ws: ["vael", "mortal"] }  { ws_not: [...] }  { bg: "veteran" }
{ all: [c1, c2] }  { any: [c1, c2] }  { not: c }
```

**Conditional text** (first matching variant wins; last must be unconditional):

```js
text: [
  { if: { ws: ["debt_paid"] }, text: "The ledgers lie open and empty." },
  { text: "The ledgers are still counting." },
],
```

**Conditional branching** (same shape for `goto`, `check.ok/fail`,
`combat.win/flee`; last arm unconditional):

```js
goto: { pick: [
  { if: { has: "c3_warned" }, to: "c3_ambush_ready" },
  { to: "c3_ambush" },
] },
```

If you must use a function target, declare its possible destinations beside
it so the map can draw the edges: `goto: (s) => ..., targets: ["c3_a", "c3_b"]`
(for checks/combat: `ok_targets`, `fail_targets`, `win_targets`, `flee_targets`).

## Conventions

- Prefix everything the chapter introduces — scene ids, flags, items,
  enemies — with `c<N>_`. Cross-pack collisions become impossible.
- Don't add to `HC.helpers` from a pack; define chapter predicates as local
  functions in the pack file (or use the DSL).
- Aim for the shape chapters 1–2 set: ~9 real endings plus `death`,
  openings → hub → acts → finale, a camp scene, 2 recruitable companions.
- `presetLevel`: ch2 used 6. The level table currently caps at 8 (1900 xp);
  raising the cap means extending `XP_THRESHOLDS` in `js/state.js` first.
- An epilogue is optional but chapters 1–2 both have one: a composer
  function that reflects companions and world state before the ending card.

## Validation

```
node selftest.js --chapter ch3     # fast loop: wiring, statics, map, entry runs
node selftest.js                   # full run before release
node selftest.js --dump-chapter ch3   # normalized scene graph (for diffing)
```

The selftest discovers packs automatically (no test edits needed) and
checks: every target resolves, every previous ending has an opening, world
states and presets are complete, items/enemies/companions referenced exist,
and seeded random playthroughs from every entry (both preset and imported
snapshots) reach an ending. `dev-smoke.html?steps=300` drives the real UI.
