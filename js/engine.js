/* Scene engine, ported from the while-loop in mythos/engine.py into pure,
   presenter-free functions. The presenter (browser) and runHeadless (selftest)
   both drive the game exclusively through these. */
(function (HC) {
  "use strict";

  function resolve(value, state) {
    return typeof value === "function" ? value(state) : value;
  }

  /* Enter a scene: fire on_enter once per arrival (state.entered persists through
     saves), resolve dynamic text. Returns everything the presenter needs. */
  function enterScene(state, scenes, id) {
    const scene = scenes[id];
    if (!scene) throw new Error(`Unknown scene: ${id}`);
    state.scene = id;
    if (scene.on_enter && state.entered !== id) {
      state.entered = id;
      HC.applyFx(state, scene.on_enter);
    }
    state.entered = id;
    const text = resolve(scene.text, state);
    const notices = state.drainNotices();
    const ending = "ending" in scene ? resolve(scene.ending, state) : null;
    return { scene, text, notices, ending };
  }

  function visibleChoices(state, scene) {
    return scene.choices.filter((c) => !("when" in c) || c.when(state));
  }

  /* Apply the choice's own fx (in Python this happens before the check roll,
     so level-ups from it can raise the stat being checked). */
  function applyChoiceFx(state, choice) {
    HC.applyFx(state, choice.fx);
    return state.drainNotices();
  }

  /* Resolve where the choice leads. For combat the presenter (or headless
     driver) runs the fight itself, then calls combatOutcome. */
  function transition(state, choice) {
    if (choice.check) {
      const ck = choice.check;
      const roll = HC.dice.check(state, ck.stat, ck.dc);
      let target;
      if (roll.success) {
        HC.applyFx(state, ck.ok_fx);
        target = resolve(ck.ok, state);
      } else {
        HC.applyFx(state, ck.fail_fx);
        target = resolve(ck.fail, state);
      }
      return { kind: "check", roll, target, notices: state.drainNotices() };
    }
    if (choice.combat) {
      return { kind: "combat", enemyId: choice.combat.enemy };
    }
    return { kind: "goto", target: resolve(choice.goto, state), notices: [] };
  }

  function combatOutcome(state, choice, result) {
    const cb = choice.combat;
    if (result === "death") {
      return { target: "death", notices: [] };
    }
    if (result === "flee") {
      // No flee target = stay in the current scene and face it again
      // (on_enter won't refire; state.entered is already set).
      const target = "flee" in cb ? resolve(cb.flee, state) : state.scene;
      return { target, notices: [], stayed: !("flee" in cb) };
    }
    HC.applyFx(state, cb.win_fx);
    return { target: resolve(cb.win, state), notices: state.drainNotices() };
  }

  /* Drive a whole game without a presenter. Used by the selftest.
     opts: {
       pick(visible, state) -> choice            (default: first)
       statPick(state) -> "might"|"wits"|"spirit" (default: "might")
       combatAction(state, combat) -> action      (default: "attack")
       maxSteps                                   (default: 4000)
       allowFrontier: treat missing scene targets as a reachable end
                      (for partially translated story graphs)
     } */
  function runHeadless(state, scenes, opts) {
    opts = opts || {};
    const pick = opts.pick || ((visible) => visible[0]);
    const statPick = opts.statPick || (() => "might");
    const combatAction = opts.combatAction || (() => "attack");
    const maxSteps = opts.maxSteps || 4000;
    let steps = 0;

    const settleStatPicks = () => {
      while (state.pendingStatPicks > 0) {
        state.applyStatPick(statPick(state));
      }
      state.drainNotices();
    };

    while (true) {
      if (++steps > maxSteps) {
        throw new Error(`runaway game (${maxSteps} steps) at scene ${state.scene}`);
      }
      if (!(state.scene in scenes)) {
        if (opts.allowFrontier) {
          state.ending = "<frontier>";
          return state.ending;
        }
        throw new Error(`Unknown scene: ${state.scene}`);
      }
      const { scene, ending } = enterScene(state, scenes, state.scene);
      settleStatPicks();

      if (ending !== null) {
        state.ending = ending;
        if (HC.story && HC.story.epilogue) HC.story.epilogue(state); // exercise dynamic text
        return state.ending;
      }

      const visible = visibleChoices(state, scene);
      if (!visible.length) {
        throw new Error(`Scene ${state.scene} has no available choices`);
      }
      const choice = pick(visible, state);
      applyChoiceFx(state, choice);
      settleStatPicks();

      let target;
      const t = transition(state, choice);
      if (t.kind === "combat") {
        const combat = HC.createCombat(state, t.enemyId);
        let result = null;
        while (result === null) {
          if (++steps > maxSteps) {
            throw new Error(`runaway combat (${maxSteps} steps) at scene ${state.scene}`);
          }
          const action = combatAction(state, combat);
          let itemId;
          if (action === "item") {
            const usable = state.player.inventory.filter((i) => HC.ITEMS[i].kind === "consumable");
            itemId = usable.length ? usable[Math.floor(HC.rng() * usable.length)] : undefined;
          }
          const res = combat.act(action, itemId);
          if (res.over) result = res.result;
        }
        const out = combatOutcome(state, choice, result);
        target = out.target;
      } else {
        target = t.target;
      }
      settleStatPicks();
      state.scene = target;
    }
  }

  HC.engine = {
    resolve, enterScene, visibleChoices, applyChoiceFx, transition,
    combatOutcome, runHeadless,
  };
})(globalThis.HC);
