#!/usr/bin/env node
/* Validation for the web port: static graph checks + golden-path runs +
   seeded random-walk playthroughs. Ported from mythos/selftest.py.

   Usage:
     node selftest.js                 full validation (story files that exist)
     node selftest.js --dump          print the ch1 scene graph as JSON (for crosscheck)
     node selftest.js --dump-chapter chN   print one chapter's scene graph as JSON
     node selftest.js --runs N        number of ch1 random playthroughs (default 300)
     node selftest.js --entry-runs N  runs per continuation entry (default 8)
     node selftest.js --chapter chN   fast authoring loop: chapter/static/map
                                      checks + entry runs for one chapter only

   While the story port is incomplete, targets pointing at not-yet-ported
   scenes are reported as a "frontier" count instead of failures, and random
   walks count reaching the frontier as a successful end. */
"use strict";

const path = require("path");
const fs = require("fs");

const JS_DIR = path.join(__dirname, "js");

// minimal localStorage so profile/map exploration code paths run under Node
(function () {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => { store.set(k, String(v)); },
    removeItem: (k) => { store.delete(k); },
  };
})();

const CORE_FILES = [
  "00-namespace.js", "items.js", "dice.js", "state.js", "combat.js", "fx.js",
  path.join("story", "helpers.js"), "dsl.js", "chapters.js", "bridge.js",
];
const STORY_FILES = ["prologue.js", "act1.js", "act2.js", "act3.js", "endings.js"]
  .map((f) => path.join("story", f));
// chapter 2's part files predate the packs dir and stay in story/c2
const C2_FILES = ["openings.js", "act1.js", "act2.js", "act3.js", "endings.js"]
  .map((f) => path.join("story", "c2", f));
const TAIL_FILES = [path.join("story", "index.js"), "engine.js",
                    "map.js", "profile.js"];

for (const f of CORE_FILES) require(path.join(JS_DIR, f));
const missingStory = [];
for (const f of STORY_FILES) {
  const full = path.join(JS_DIR, f);
  if (fs.existsSync(full)) require(full);
  else missingStory.push(path.basename(f, ".js"));
}
// chapter packs: every manifest (chN.js) loads before any part file
const PACKS_DIR = path.join(JS_DIR, "story", "packs");
const packFiles = fs.existsSync(PACKS_DIR)
  ? fs.readdirSync(PACKS_DIR).filter((f) => f.endsWith(".js")) : [];
const isManifest = (f) => /^ch\d+\.js$/.test(f);
const manifests = packFiles.filter(isManifest)
  .sort((a, b) => parseInt(a.slice(2), 10) - parseInt(b.slice(2), 10));
const packParts = packFiles.filter((f) => !isManifest(f)).sort();
for (const f of manifests) require(path.join(PACKS_DIR, f));
for (const f of C2_FILES) {
  const full = path.join(JS_DIR, f);
  if (fs.existsSync(full)) require(full);
}
for (const f of packParts) require(path.join(PACKS_DIR, f));
for (const f of TAIL_FILES) require(path.join(JS_DIR, f));

const HC = globalThis.HC;
HC.finalizeChapters();
const partial = missingStory.length > 0;

// ------------------------------------------------------------- seeded rng
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ------------------------------------------------------------- dump mode
function normText(t) {
  return t.split(/\n{2,}/)
    .map((p) => p.replace(/^[#=] /, "").replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join(" ");
}

function fxShape(fx) {
  if (fx === undefined || fx === null) return null;
  if (typeof fx === "function") return "<dyn>";
  return Object.keys(fx).sort();
}

function dumpGraph(scenes) {
  const out = {};
  for (const sid of Object.keys(scenes).sort()) {
    const scene = scenes[sid];
    const entry = {
      text: typeof scene.text === "function" ? "<dyn>" : normText(scene.text),
      on_enter: "on_enter" in scene ? fxShape(scene.on_enter) : null,
      ending: "ending" in scene
        ? (typeof scene.ending === "function" ? "<dyn>" : scene.ending) : null,
      choices: (scene.choices || []).map((ch) => ({
        text: typeof ch.text === "function" ? "<dyn>" : normText(ch.text),
        when: "when" in ch,
        fx: "fx" in ch ? fxShape(ch.fx) : null,
        goto: "goto" in ch
          ? (typeof ch.goto === "function" ? "<dyn>" : ch.goto) : null,
        check: ch.check ? {
          stat: ch.check.stat, dc: ch.check.dc,
          ok: typeof ch.check.ok === "function" ? "<dyn>" : ch.check.ok,
          fail: typeof ch.check.fail === "function" ? "<dyn>" : ch.check.fail,
          ok_fx: "ok_fx" in ch.check ? fxShape(ch.check.ok_fx) : null,
          fail_fx: "fail_fx" in ch.check ? fxShape(ch.check.fail_fx) : null,
        } : null,
        combat: ch.combat ? {
          enemy: ch.combat.enemy,
          win: typeof ch.combat.win === "function" ? "<dyn>" : ch.combat.win,
          flee: "flee" in ch.combat
            ? (typeof ch.combat.flee === "function" ? "<dyn>" : ch.combat.flee) : null,
          win_fx: "win_fx" in ch.combat ? fxShape(ch.combat.win_fx) : null,
        } : null,
      })),
    };
    out[sid] = entry;
  }
  return out;
}

// ------------------------------------------------------------ static checks
function staticChecks(scenes, isPartial) {
  const errors = [];
  const frontier = new Set();

  function checkTarget(src, target) {
    if (typeof target === "string" && !(target in scenes)) {
      if (isPartial) frontier.add(target);
      else errors.push(`${src}: missing scene target '${target}'`);
    }
  }

  for (const [sid, scene] of Object.entries(scenes)) {
    if ("ending" in scene) continue;
    if (!scene.choices || !scene.choices.length) {
      errors.push(`${sid}: non-ending scene with no choices`);
    }
    (scene.choices || []).forEach((ch, n) => {
      const src = `${sid}#${n}`;
      if ("goto" in ch) checkTarget(src, ch.goto);
      if ("check" in ch) {
        checkTarget(src, ch.check.ok);
        checkTarget(src, ch.check.fail);
      }
      if ("combat" in ch) {
        if (!(ch.combat.enemy in HC.ENEMIES)) {
          errors.push(`${src}: unknown enemy '${ch.combat.enemy}'`);
        }
        checkTarget(src, ch.combat.win);
        if ("flee" in ch.combat) checkTarget(src, ch.combat.flee);
      }
      if (!("goto" in ch || "check" in ch || "combat" in ch)) {
        errors.push(`${src}: choice with no transition`);
      }
      for (const fx of [ch.fx, scene.on_enter]) {
        if (fx && typeof fx === "object") {
          for (const iid of (fx["items+"] || []).concat(fx["items-"] || [])) {
            if (!(iid in HC.ITEMS)) errors.push(`${src}: unknown item '${iid}'`);
          }
          const cids = Object.keys(fx.approval || {});
          for (const key of ["recruit", "meet", "leave", "kill_companion"]) {
            if (key in fx) cids.push(fx[key]);
          }
          for (const cid of cids) {
            if (!(cid in HC.COMPANION_DEFS)) {
              errors.push(`${src}: unknown companion '${cid}'`);
            }
          }
        }
      }
    });
  }
  return { errors, frontier };
}

// --------------------------------------------------------- random playthrough
function randomPlaythrough(scenes, seed) {
  const rng = mulberry32(seed * 2654435761 + 1);
  HC.rng = mulberry32(seed + 1);
  const state = new HC.GameState();
  state.player.name = `Bot${seed}`;
  const stats = ["might", "wits", "spirit"];
  const actions = ["attack", "feint", "invoke", "item", "flee"];
  try {
    return HC.engine.runHeadless(state, scenes, {
      pick: (visible) => visible[Math.floor(rng() * visible.length)],
      statPick: () => stats[Math.floor(rng() * 3)],
      combatAction: () => actions[Math.floor(rng() * actions.length)],
      maxSteps: 4000,
      allowFrontier: partial,
    });
  } finally {
    HC.rng = Math.random;
  }
}

// ------------------------------------------------------------- golden path
const GOLDEN_PATH = [
  "veteran of the Greyfield", "Shoulder your pack", "Rush the grain-hall",
  "Go to the chapel", "Swear it", "Build her a cairn", "Walk on",
  "Wade in beside her", "Talk with the woman", "Walk with me",
  "On to Briarwatch", "Greyfield colors", "Enter the town",
  "Call at the reeve", "Appeal to the man", "Back to the square",
  "Set out for the Howling Barrow", "Speak to what's left", "Climb back up",
  "Puzzle the script", "Descend", "Take the Oath-Knot",
  "Walk the processional", "Answer true", "Mend it", "Bow to the First King",
  "Take the south road", "Into the city", "Step out of the crowd",
  "Get her clear", "I carry a piece", "Find the way into the undercroft",
  "Raise the soul-lantern", "Up the turning stair", "Visit the Shield Chapel",
  "Confront Crayce", "I was AT Greyfield", "Let the city",
  "Return to camp", "Ask Maeve", "Let her go", "Keep the fire fed",
  "Sit with Serra", "Keep the watch", "Sleep",
  "dusk service", "Trial of Flame", "Unhood the lantern", "Carry them out",
  "Leave Cindral", "Walk into the grey", "Walk on",
  "Speak to the young pilgrim", "Down the processional stair",
  "forgive the twenty-year-old", "Deliver the First King", "Rise",
  "Hear him out", "Let Brother Hollow answer", "Approach the dying god",
  "Make the choice",
];

/* Scripted ideal run: checks auto-succeed, combats auto-win. */
function goldenPlaythrough(scenes, finalPick) {
  const state = new HC.GameState();
  state.player.name = "Golden";
  state.player.background = "veteran"; // set again by the intro choice fx
  const resolve = HC.engine.resolve;

  const settle = () => {
    while (state.pendingStatPicks > 0) state.applyStatPick("might");
    state.drainNotices();
  };

  const script = GOLDEN_PATH.concat([finalPick]);
  for (const pattern of script) {
    const scene = scenes[state.scene];
    if (!scene) throw new Error(`golden path: missing scene '${state.scene}'`);
    if ("on_enter" in scene) HC.applyFx(state, scene.on_enter);
    if (typeof scene.text === "function") scene.text(state); // exercise dynamic text
    settle();
    const visible = HC.engine.visibleChoices(state, scene);
    const match = visible.find((c) => {
      const t = typeof c.text === "function" ? c.text(state) : c.text;
      return t.toLowerCase().includes(pattern.toLowerCase());
    });
    if (!match) {
      throw new Error(`golden path: no choice matching '${pattern}' in '${state.scene}'`);
    }
    HC.applyFx(state, match.fx);
    settle();
    if ("check" in match) {
      HC.applyFx(state, match.check.ok_fx);
      state.scene = match.check.ok;
    } else if ("combat" in match) {
      HC.applyFx(state, match.combat.win_fx);
      state.scene = resolve(match.combat.win, state);
    } else {
      state.scene = resolve(match.goto, state);
    }
    settle();
  }
  const final = scenes[state.scene];
  if (!final) throw new Error(`golden path: missing final scene '${state.scene}'`);
  if ("on_enter" in final) HC.applyFx(state, final.on_enter);
  settle();
  if (!("ending" in final)) {
    throw new Error(`golden path ended on non-ending scene '${state.scene}'`);
  }
  const title = resolve(final.ending, state);
  const approvals = {};
  for (const cid of Object.keys(state.companions)) approvals[cid] = state.approval(cid);
  return [title, approvals];
}

// -------------------------------------------------------- map graph checks
function mapChecks(scenes, seeds) {
  seeds = seeds || ["intro"];
  const errors = [];
  const graph = HC.map.buildGraph(scenes);

  // every function-valued target has a DYN_TARGETS entry...
  for (const miss of graph.missingDyn) {
    errors.push(`map: dynamic target with no DYN_TARGETS entry: ${miss}`);
  }
  // ...and every DYN_TARGETS entry for THIS chapter's scenes still matches a
  // function goto in the story (the table is global across chapters)
  for (const [key, targets] of Object.entries(HC.map.DYN_TARGETS)) {
    const [sid, idx] = key.split("#");
    if (!(sid in scenes)) continue;
    const ch = (scenes[sid].choices || [])[Number(idx)];
    if (!ch || typeof ch.goto !== "function") {
      errors.push(`map: stale DYN_TARGETS key ${key} (no function goto there)`);
    }
    for (const t of targets) {
      if (!(t in scenes)) errors.push(`map: DYN_TARGETS ${key} -> missing scene ${t}`);
    }
  }
  // every edge target is a real scene
  for (const e of graph.edges) {
    if (!(e.to in scenes)) errors.push(`map: edge ${e.from} -> missing scene ${e.to}`);
  }
  // every scene is a node, reachable from the entry seeds over map edges
  const adj = {};
  for (const e of graph.edges) (adj[e.from] = adj[e.from] || []).push(e.to);
  const reached = new Set(seeds);
  const queue = seeds.slice();
  while (queue.length) {
    const id = queue.shift();
    for (const t of adj[id] || []) {
      if (!reached.has(t)) { reached.add(t); queue.push(t); }
    }
  }
  for (const id of Object.keys(scenes)) {
    if (!(id in graph.nodes)) errors.push(`map: scene ${id} missing from nodes`);
    if (!reached.has(id)) errors.push(`map: scene ${id} unreachable from entry`);
  }
  // layout terminates with finite positions
  const lay = HC.map.layout(graph, seeds);
  for (const id of Object.keys(graph.nodes)) {
    const p = lay.pos[id];
    if (!p || !Number.isFinite(p.x) || !Number.isFinite(p.y)) {
      errors.push(`map: no finite layout position for ${id}`);
    }
  }
  return { errors, edges: graph.edges.length };
}

// ----------------------------------------------------- chapter framework
/* Validation of the multi-chapter layer: per-chapter graphs, the manifest's
   entry points and ending tables, presets/import for continuation chapters,
   and the profile migration from title-keyed map memory. */
function chapterChecks() {
  const errors = [];
  const owner = {}; // scene id -> chapter id, "death" exempt

  for (const def of HC.CHAPTERS) {
    const missingMods = def.modules.filter(
      (m) => !HC.story[m] || !HC.story[m].SCENES);
    const emptyMods = def.modules.filter(
      (m) => HC.story[m] && HC.story[m].SCENES
        && Object.keys(HC.story[m].SCENES).length === 0);
    const chPartial = missingMods.length > 0 || emptyMods.length > 0;
    const scenes = HC.buildScenes(def.modules);
    const ids = Object.keys(scenes);

    // namespace: chapters beyond ch1 prefix every id except "death"
    if (def.id !== "ch1") {
      const prefix = `c${def.number}_`;
      for (const id of ids) {
        if (id !== "death" && !id.startsWith(prefix)) {
          errors.push(`${def.id}: scene '${id}' missing ${prefix} prefix`);
        }
      }
    }
    // no scene id may belong to two chapters (the per-chapter death excepted)
    for (const id of ids) {
      if (id === "death") continue;
      if (owner[id]) errors.push(`scene '${id}' in both ${owner[id]} and ${def.id}`);
      owner[id] = def.id;
    }

    const sc = staticChecks(scenes, chPartial);
    for (const e of sc.errors) errors.push(`${def.id}: ${e}`);
    console.log(`Chapter ${def.number} (${def.id}): ${ids.length} scenes, `
      + `static OK${chPartial
        ? ` (PARTIAL — ${sc.frontier.size} frontier targets; `
          + `unwritten: ${missingMods.concat(emptyMods).join(", ")})`
        : ""}`);

    if (!chPartial) {
      const mc = mapChecks(scenes, HC.chapterMapSeeds(def.id));
      for (const e of mc.errors) errors.push(`${def.id}: ${e}`);
      // a complete chapter must have its own death scene
      if (!("death" in scenes)) errors.push(`${def.id}: no death scene`);
      // manifest endings table matches the scene data (pins title<->id map)
      for (const e of def.endings) {
        const scene = scenes[e.id];
        if (!scene) { errors.push(`${def.id}: manifest ending '${e.id}' has no scene`); continue; }
        if (typeof scene.ending === "string" && scene.ending !== e.title) {
          errors.push(`${def.id}: ending '${e.id}' title mismatch: `
            + `scene says '${scene.ending}', manifest says '${e.title}'`);
        }
      }
      const manifestIds = new Set(def.endings.map((e) => e.id));
      for (const id of ids) {
        if ("ending" in scenes[id] && !manifestIds.has(id)) {
          errors.push(`${def.id}: ending scene '${id}' missing from manifest`);
        }
      }
    }

    // continuation wiring
    if (def.entry.kind === "continuation") {
      const prev = HC.getChapter(def.entry.from);
      if (!prev) {
        errors.push(`${def.id}: entry.from '${def.entry.from}' is not a chapter`);
        continue;
      }
      const prevEndings = new Set(
        prev.endings.filter((e) => !e.isDeath).map((e) => e.id));
      for (const [endingId, target] of Object.entries(def.entry.points)) {
        if (!prevEndings.has(endingId)) {
          errors.push(`${def.id}: entry point for unknown/death ending '${endingId}'`);
        }
        if (!(target in scenes) && !chPartial) {
          errors.push(`${def.id}: entry scene '${target}' does not exist`);
        }
      }
      // every real ending of the previous chapter must be continuable
      for (const endingId of prevEndings) {
        if (!(endingId in def.entry.points)) {
          errors.push(`${def.id}: no opening scene for ${prev.id} ending '${endingId}'`);
        }
      }
      // pack-derived tables: a world state and a preset per entry
      for (const endingId of Object.keys(def.entry.points)) {
        if (typeof def.continuation.wsByEnding[endingId] !== "string") {
          errors.push(`${def.id}: no ws for ending '${endingId}'`);
        }
        if (!def.continuation.presets[endingId]) {
          errors.push(`${def.id}: no preset for ending '${endingId}'`);
        }
      }
    }
  }

  // every DYN_TARGETS key must point at a scene that exists in SOME chapter
  // (per-chapter mapChecks skips foreign keys, so orphans are caught here)
  for (const key of Object.keys(HC.map.DYN_TARGETS)) {
    const sid = key.split("#")[0];
    if (!(sid in owner) && sid !== "death") {
      errors.push(`DYN_TARGETS key ${key}: scene exists in no chapter`);
    }
  }
  return errors;
}

/* Every continuation chapter playable from every entry: preset starts and
   imported previous-chapter snapshots both reach an ending (or the frontier
   while a chapter is partial). The import donor for chapter n is a seeded
   random playthrough of chapter n-1 — so the checks walk the whole chain. */
function chainRuns(runsPerEntry, onlyChapterId) {
  const stats = ["might", "wits", "spirit"];
  const actions = ["attack", "feint", "invoke", "item", "flee"];

  function seededRun(state, scenes, pickSeed, diceSeed, opts) {
    const rng = mulberry32(pickSeed);
    HC.rng = mulberry32(diceSeed);
    try {
      return HC.engine.runHeadless(state, scenes, Object.assign({
        pick: (visible) => visible[Math.floor(rng() * visible.length)],
        statPick: () => stats[Math.floor(rng() * 3)],
        combatAction: () => actions[Math.floor(rng() * actions.length)],
        maxSteps: 4000,
      }, opts || {}));
    } finally {
      HC.rng = Math.random;
    }
  }

  // a real end-of-chapter snapshot per chapter, for the import path
  const donors = {};
  function donorFor(def) {
    if (!donors[def.id]) {
      const scenes = HC.buildScenes(def.modules);
      let state;
      if (def.entry.kind === "fixed") {
        state = new HC.GameState();
      } else {
        const firstEnding = Object.keys(def.entry.points)[0];
        state = def.entry.presetState(firstEnding);
        state.scene = def.entry.points[firstEnding];
      }
      state.player.name = "Importee";
      seededRun(state, scenes, 424242 + def.number, 99 + def.number,
        { epilogue: def.epilogue ? HC.story[def.epilogue] : undefined });
      donors[def.id] = state.toDict();
    }
    return donors[def.id];
  }

  const results = [];
  for (const def of HC.CHAPTERS) {
    if (def.entry.kind !== "continuation") continue;
    if (onlyChapterId && def.id !== onlyChapterId) continue;
    const missing = def.modules.filter((m) => !HC.story[m] || !HC.story[m].SCENES
      || Object.keys(HC.story[m].SCENES).length === 0);
    const chPartial = missing.length > 0;
    const scenes = HC.buildScenes(def.modules);
    const snapshot = donorFor(HC.getChapter(def.entry.from));

    const endingsReached = {};
    let runs = 0;
    for (const [endingId, entryScene] of Object.entries(def.entry.points)) {
      for (let i = 0; i < runsPerEntry; i++) {
        const seed = i * 7919 + endingId.length;
        const useImport = i % 2 === 1;
        const state = useImport
          ? def.entry.importState(snapshot, endingId)
          : def.entry.presetState(endingId);
        if (state.chapter !== def.id) throw new Error(`start state not ${def.id}`);
        if (state.flags.ws !== def.continuation.wsByEnding[endingId]) {
          throw new Error(`ws flag wrong for ${endingId}`);
        }
        if (state.party().length) {
          throw new Error(`${def.id} must start without a party`);
        }
        state.scene = entryScene;
        try {
          const title = seededRun(state, scenes, seed * 2654435761 + 17, seed + 5, {
            allowFrontier: chPartial,
            epilogue: def.epilogue ? HC.story[def.epilogue] : undefined,
          });
          endingsReached[title] = (endingsReached[title] || 0) + 1;
          runs += 1;
        } catch (e) {
          console.log(`\nFAILED ${def.id} run from ${endingId} (seed ${seed}, `
            + `${useImport ? "import" : "preset"}): ${e.message}`);
          throw e;
        }
      }
    }
    results.push({ def, runs, endingsReached, chPartial });
  }
  return results;
}

/* Profile migration: title-keyed map memory becomes id-keyed profile entries,
   and the grave alone never unlocks the next chapter. */
function profileChecks() {
  const errors = [];
  const mapKey = HC.getChapter("ch1").mapKey;

  // grave-only memory: ch1 map button would show, but ch2 stays sealed
  localStorage.setItem(mapKey, JSON.stringify(
    { scenes: {}, edges: {}, endings: { "An Unmarked Grave": 1 } }));
  HC.profile.migrate();
  if (!HC.profile.hasEnding("ch1", "death")) {
    errors.push("profile: grave title did not migrate to 'death'");
  }
  if (HC.profile.isUnlocked("ch2")) {
    errors.push("profile: grave alone must not unlock ch2");
  }
  // a real ending unlocks ch2, with a null snapshot (preset fallback)
  localStorage.setItem(mapKey, JSON.stringify(
    { scenes: {}, edges: {}, endings: { "An Unmarked Grave": 1, "The Risen Shield": 1 } }));
  HC.profile.migrate();
  if (!HC.profile.hasEnding("ch1", "end_serra")) {
    errors.push("profile: 'The Risen Shield' did not migrate to end_serra");
  }
  if (HC.profile.snapshotFor("ch1", "end_serra") !== null) {
    errors.push("profile: migrated ending should have no snapshot");
  }
  if (!HC.profile.isUnlocked("ch2")) {
    errors.push("profile: a migrated real ending must unlock ch2");
  }
  // a recorded snapshot round-trips
  const snap = new HC.GameState().toDict();
  HC.profile.recordEnding("ch1", "end_maeve", snap);
  const got = HC.profile.snapshotFor("ch1", "end_maeve");
  if (!got || got.scene !== snap.scene) {
    errors.push("profile: recorded snapshot did not round-trip");
  }
  localStorage.removeItem(mapKey);
  return errors;
}

// ------------------------------------------------------------------- main
function main() {
  const args = process.argv.slice(2);
  const scenes = HC.buildScenes();

  if (args.includes("--dump")) {
    process.stdout.write(JSON.stringify(dumpGraph(scenes), null, 1));
    return;
  }

  const dumpChIdx = args.indexOf("--dump-chapter");
  if (dumpChIdx !== -1) {
    const def = HC.getChapter(args[dumpChIdx + 1]);
    if (!def) {
      console.error(`--dump-chapter: unknown chapter '${args[dumpChIdx + 1]}'`);
      process.exit(1);
    }
    process.stdout.write(JSON.stringify(dumpGraph(HC.buildScenes(def.modules)), null, 1));
    return;
  }

  const entryRunsIdx = args.indexOf("--entry-runs");
  const entryRuns = entryRunsIdx !== -1 ? parseInt(args[entryRunsIdx + 1], 10) : 8;

  /* --chapter chN: the authoring inner loop. Chapter/static/map checks run
     for every chapter (cross-chapter wiring is cheap and load-bearing), but
     the expensive playthroughs only run for the named chapter. */
  const focusIdx = args.indexOf("--chapter");
  const focus = focusIdx !== -1 ? args[focusIdx + 1] : null;
  if (focus) {
    if (!HC.getChapter(focus)) {
      console.log(`--chapter: unknown chapter '${focus}'`);
      process.exit(1);
    }
    const chErrors = chapterChecks();
    if (chErrors.length) {
      console.log("CHAPTER CHECK FAILURES:");
      for (const e of chErrors) console.log(" -", e);
      process.exit(1);
    }
    console.log("Chapter manifest checks: OK");
    reportChainRuns(chainRuns(entryRuns, focus));
    return;
  }

  console.log(`Scenes: ${Object.keys(scenes).length}`
    + (partial ? `  (PARTIAL — missing story modules: ${missingStory.join(", ")})` : ""));

  const { errors, frontier } = staticChecks(scenes, partial);
  if (errors.length) {
    console.log("STATIC CHECK FAILURES:");
    for (const e of errors) console.log(" -", e);
    process.exit(1);
  }
  console.log("Static graph checks: OK"
    + (frontier.size ? `  (frontier: ${frontier.size} unported targets)` : ""));

  if (!partial) {
    const mc = mapChecks(scenes);
    if (mc.errors.length) {
      console.log("MAP GRAPH CHECK FAILURES:");
      for (const e of mc.errors) console.log(" -", e);
      process.exit(1);
    }
    console.log(`Map graph checks: OK (${mc.edges} edges, layout finite)`);
  }

  if (!partial) {
    let approvals = null;
    for (const [pick, want] of [["Crown SERRA", "The Risen Shield"],
                                ["Crown MAEVE", "The Open Library"]]) {
      const [title, appr] = goldenPlaythrough(scenes, pick);
      if (title !== want) {
        console.log(`golden path: got '${title}', wanted '${want}'`);
        process.exit(1);
      }
      approvals = appr;
    }
    console.log(`Golden-path runs: OK (companion endings reachable; `
      + `approvals ${JSON.stringify(approvals)})`);
  } else {
    console.log("Golden-path runs: SKIPPED (partial story)");
  }

  const runsIdx = args.indexOf("--runs");
  const runs = runsIdx !== -1 ? parseInt(args[runsIdx + 1], 10) : 300;
  const endings = {};
  for (let seed = 0; seed < runs; seed++) {
    let title;
    try {
      title = randomPlaythrough(scenes, seed);
    } catch (e) {
      console.log(`\nFAILED on seed ${seed}: ${e.message}`);
      throw e;
    }
    endings[title] = (endings[title] || 0) + 1;
  }
  console.log(`Random playthroughs: ${runs} OK`);
  console.log("Endings reached:");
  for (const [title, n] of Object.entries(endings).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${String(n).padStart(4)}  ${title}`);
  }

  // --------------------------------------------------- chapter framework
  const chErrors = chapterChecks();
  if (chErrors.length) {
    console.log("CHAPTER CHECK FAILURES:");
    for (const e of chErrors) console.log(" -", e);
    process.exit(1);
  }
  console.log("Chapter manifest checks: OK");

  const pErrors = profileChecks();
  if (pErrors.length) {
    console.log("PROFILE CHECK FAILURES:");
    for (const e of pErrors) console.log(" -", e);
    process.exit(1);
  }
  console.log("Profile migration checks: OK");

  reportChainRuns(chainRuns(entryRuns));
}

function reportChainRuns(results) {
  for (const r of results) {
    console.log(`Chapter ${r.def.number} runs: ${r.runs} OK from ${Object.keys(
      r.def.entry.points).length} entry endings`
      + (r.chPartial ? " (to frontier — chapter partial)" : ""));
    if (!r.chPartial) {
      console.log(`Chapter ${r.def.number} endings reached:`);
      for (const [title, n] of Object.entries(r.endingsReached)
        .sort((a, b) => b[1] - a[1])) {
        console.log(`  ${String(n).padStart(4)}  ${title}`);
      }
    }
  }
}

if (require.main === module) {
  main();
} else {
  // required as a library (e.g. make-golden-save.js): expose the script
  module.exports = { GOLDEN_PATH };
}
