#!/usr/bin/env node
/* Generates a save positioned at the END of the golden road: the scripted
   ideal playthrough from selftest.js, halted at "final_choice" — every
   companion recruited, the shards gathered, the Shepherd of Ash witnessed —
   so the loaded game opens directly onto the crowning decision with all the
   golden options (Crown Serra / Maeve / Brother Hollow) unlocked.

   Outputs:
     golden-save.json        the raw autosave payload
     golden-save-import.txt  a paste-into-console one-liner that installs it

   Usage: node make-golden-save.js */
"use strict";

const fs = require("fs");
const path = require("path");

const { GOLDEN_PATH } = require("./selftest.js");
require("./js/save.js"); // for the autosave key (selftest doesn't load it)
const HC = globalThis.HC;

function makeGoldenState(scenes) {
  const state = new HC.GameState();
  state.player.name = "Golden";
  state.player.background = "veteran"; // set again by the intro choice fx
  const resolve = HC.engine.resolve;

  const settle = () => {
    while (state.pendingStatPicks > 0) state.applyStatPick("might");
    state.drainNotices();
  };

  state.path.push(state.scene);
  for (const pattern of GOLDEN_PATH) {
    const scene = scenes[state.scene];
    if (!scene) throw new Error(`golden save: missing scene '${state.scene}'`);
    if ("on_enter" in scene) HC.applyFx(state, scene.on_enter);
    settle();
    const visible = HC.engine.visibleChoices(state, scene);
    const match = visible.find((c) => {
      const t = typeof c.text === "function" ? c.text(state) : c.text;
      return t.toLowerCase().includes(pattern.toLowerCase());
    });
    if (!match) {
      throw new Error(`golden save: no choice matching '${pattern}' in '${state.scene}'`);
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
    if (state.path[state.path.length - 1] !== state.scene) {
      state.path.push(state.scene);
    }
  }
  return state;
}

function main() {
  const scenes = HC.buildScenes();
  const state = makeGoldenState(scenes);

  // sanity: we are standing at the final choice with the golden options open
  if (state.scene !== "final_choice") {
    throw new Error(`golden save ends at '${state.scene}', expected 'final_choice'`);
  }
  const visible = HC.engine.visibleChoices(state, scenes.final_choice)
    .map((c) => (typeof c.text === "function" ? c.text(state) : c.text));
  for (const want of ["Crown SERRA", "Crown MAEVE", "Crown BROTHER HOLLOW"]) {
    if (!visible.some((t) => t.includes(want))) {
      throw new Error(`golden save: '${want}' not available at final_choice`);
    }
  }

  const payload = state.toDict();
  const json = JSON.stringify(payload);
  fs.writeFileSync(path.join(__dirname, "golden-save.json"),
    JSON.stringify(payload, null, 2) + "\n");
  fs.writeFileSync(path.join(__dirname, "golden-save-import.txt"),
    `localStorage.setItem(${JSON.stringify(HC.save.KEY)}, ${JSON.stringify(json)}); location.reload();\n`);

  const p = state.player;
  console.log(`golden save written: scene=${state.scene}, ${p.name} level ${p.level}, ` +
    `HP ${p.hp}/${p.max_hp}, ${p.gold} gold, karma ${state.karma >= 0 ? "+" : ""}${state.karma}, ` +
    `path ${state.path.length} scenes`);
  console.log(`party: ${state.party().join(", ")}`);
  console.log(`final choices open: ${visible.length}`);
}

main();
