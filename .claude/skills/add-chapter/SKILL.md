---
name: add-chapter
description: Generate and wire a new chapter for Mythos's Fable. Use when asked to write, add, or continue the game with a new chapter (ch3, ch4, ... up to 26).
---

# Add a chapter

Read `CHAPTER_AUTHORING.md` at the repo root first — it is the complete
contract (pack format, DSL, conventions, checklist). This skill only adds
process guidance so the session's tokens go into the story itself.

## Process

1. **Ground the continuation.** Read the previous chapter's ending scenes
   (its pack/part files) and its manifest `endings` list — every non-death
   ending needs an opening scene here, with `entry_from`, `ws`, and `preset`
   markers. Skim the previous chapter's `bridge.flagCarryover` and decide
   which of THIS chapter's flags the NEXT one should be able to remember.
2. **Design before prose.** Sketch the scene graph (openings → hub → acts →
   finale → ~9 endings + `death`), the new companions/items/enemies, and the
   stat/dc economy consistent with earlier chapters. Then write prose.
3. **Write the pack**: `js/story/packs/chN.js` (manifest) + part files
   `chN-openings.js`, `chN-act1.js`, ... each ≤ ~1,500 lines, ending with
   `HC.registerScenes("chN", SCENES);`. Prefer the DSL over functions.
4. **Wire it**: add the script tags to BOTH `index.html` and
   `dev-smoke.html` (manifest before parts).
5. **Validate as you go**: `node selftest.js --chapter chN` after each part
   file; full `node selftest.js` when done. Fix every failure — the checks
   are the release gate.

## Guardrails

- Never edit `js/state.js` save schema, `js/save.js` keys, or existing
  chapters' scene ids — old save files must keep loading.
- Prefix all new ids and flags with `c<N>_`; define chapter-local predicates
  in the pack, never on `HC.helpers`.
- Ending titles are static strings; scene order in the endings part is the
  next chapter's picker order.
