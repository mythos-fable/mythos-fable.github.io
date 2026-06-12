#!/usr/bin/env node
/* Validation for the web port: static graph checks + golden-path runs +
   seeded random-walk playthroughs. Ported from mythos/selftest.py.

   Usage:
     node selftest.js            full validation (story files that exist)
     node selftest.js --dump     print the scene graph as JSON (for crosscheck)
     node selftest.js --runs N   number of random playthroughs (default 300)

   While the story port is incomplete, targets pointing at not-yet-ported
   scenes are reported as a "frontier" count instead of failures, and random
   walks count reaching the frontier as a successful end. */
"use strict";

const path = require("path");
const fs = require("fs");

const JS_DIR = path.join(__dirname, "js");
const CORE_FILES = [
  "00-namespace.js", "items.js", "dice.js", "state.js", "combat.js", "fx.js",
  path.join("story", "helpers.js"),
];
const STORY_FILES = ["prologue.js", "act1.js", "act2.js", "act3.js", "endings.js"]
  .map((f) => path.join("story", f));
const TAIL_FILES = [path.join("story", "index.js"), "engine.js", "map.js"];

for (const f of CORE_FILES) require(path.join(JS_DIR, f));
const missingStory = [];
for (const f of STORY_FILES) {
  const full = path.join(JS_DIR, f);
  if (fs.existsSync(full)) require(full);
  else missingStory.push(path.basename(f, ".js"));
}
for (const f of TAIL_FILES) require(path.join(JS_DIR, f));

const HC = globalThis.HC;
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
function staticChecks(scenes) {
  const errors = [];
  const frontier = new Set();

  function checkTarget(src, target) {
    if (typeof target === "string" && !(target in scenes)) {
      if (partial) frontier.add(target);
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
function mapChecks(scenes) {
  const errors = [];
  const graph = HC.map.buildGraph(scenes);

  // every function-valued target has a DYN_TARGETS entry...
  for (const miss of graph.missingDyn) {
    errors.push(`map: dynamic target with no DYN_TARGETS entry: ${miss}`);
  }
  // ...and every DYN_TARGETS entry still matches a function goto in the story
  for (const [key, targets] of Object.entries(HC.map.DYN_TARGETS)) {
    const [sid, idx] = key.split("#");
    const ch = scenes[sid] && (scenes[sid].choices || [])[Number(idx)];
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
  // every scene is a node, reachable from intro over map edges
  const adj = {};
  for (const e of graph.edges) (adj[e.from] = adj[e.from] || []).push(e.to);
  const reached = new Set(["intro"]);
  const queue = ["intro"];
  while (queue.length) {
    const id = queue.shift();
    for (const t of adj[id] || []) {
      if (!reached.has(t)) { reached.add(t); queue.push(t); }
    }
  }
  for (const id of Object.keys(scenes)) {
    if (!(id in graph.nodes)) errors.push(`map: scene ${id} missing from nodes`);
    if (!reached.has(id)) errors.push(`map: scene ${id} unreachable from intro`);
  }
  // layout terminates with finite positions
  const lay = HC.map.layout(graph);
  for (const id of Object.keys(graph.nodes)) {
    const p = lay.pos[id];
    if (!p || !Number.isFinite(p.x) || !Number.isFinite(p.y)) {
      errors.push(`map: no finite layout position for ${id}`);
    }
  }
  return { errors, edges: graph.edges.length };
}

// ------------------------------------------------------------------- main
function main() {
  const args = process.argv.slice(2);
  const scenes = HC.buildScenes();

  if (args.includes("--dump")) {
    process.stdout.write(JSON.stringify(dumpGraph(scenes), null, 1));
    return;
  }

  console.log(`Scenes: ${Object.keys(scenes).length}`
    + (partial ? `  (PARTIAL — missing story modules: ${missingStory.join(", ")})` : ""));

  const { errors, frontier } = staticChecks(scenes);
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
}

if (require.main === module) {
  main();
} else {
  // required as a library (e.g. make-golden-save.js): expose the script
  module.exports = { GOLDEN_PATH };
}
