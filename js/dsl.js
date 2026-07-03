/* Declarative scene DSL for chapter packs (see CHAPTER_AUTHORING.md).

   Pack scenes may express conditions, text and branching as plain data
   instead of functions; compileScenes() turns those data forms into the
   ordinary functions/strings the engine already understands, so the engine,
   map and selftest never learn about the DSL. Plain functions remain a
   first-class escape hatch everywhere a data form is accepted.

   Data forms:
     Cond      { has:"flag" } { hasnt } { item } { no_item } { inp } { notp }
               { met } { not_met } { appr:["cid",n] } { gold:n } { bg:"..." }
               { karma_ge:n } { karma_le:n } { ws:[...] } { ws_not:[...] }
               { all:[Cond,...] } { any:[Cond,...] } { not:Cond }
     Target    "scene_id"
               { pick: [{ if:Cond, to:"a" }, ..., { to:"fallback" }] }
               a function plus a declared target list beside it (goto ->
               choice.targets; check.ok/fail -> choice.ok_targets/fail_targets;
               combat.win/flee -> choice.win_targets/flee_targets), copied
               onto the function as fn.targets so the map can draw the edges.
     Text      "prose" ("{name}" interpolates the player's name)
               [{ if:Cond, text:"..." }, ..., { text:"fallback" }]

   Opening-scene markers (entry_from / ws / preset) are collected for the
   chapter registry and stripped from the scene, so compiled scenes are
   indistinguishable from hand-written ones. */
(function (HC) {
  "use strict";

  const MARKER_KEYS = ["entry_from", "ws", "preset"];

  function fail(ctx, msg) {
    throw new Error(`dsl: ${ctx}: ${msg}`);
  }

  // ------------------------------------------------------------ conditions
  function cond(c, ctx) {
    if (typeof c === "function") return c;
    if (!c || typeof c !== "object" || Array.isArray(c)) {
      fail(ctx, `condition must be a function or a one-key object, got ${JSON.stringify(c)}`);
    }
    const keys = Object.keys(c);
    if (keys.length !== 1) fail(ctx, `condition must have exactly one key, got {${keys.join(", ")}}`);
    const k = keys[0];
    const v = c[k];
    const H = HC.helpers;
    switch (k) {
      case "has": case "hasnt": case "item": case "no_item":
      case "inp": case "notp": case "met": case "not_met":
      case "gold": case "bg": case "karma_ge": case "karma_le":
        return H[k](v);
      case "appr":
        if (!Array.isArray(v) || v.length !== 2) fail(ctx, "appr takes [companionId, n]");
        return H.appr(v[0], v[1]);
      case "ws":
        return H.ws(...(Array.isArray(v) ? v : [v]));
      case "ws_not":
        return H.ws_not(...(Array.isArray(v) ? v : [v]));
      case "all": case "any": {
        if (!Array.isArray(v) || !v.length) fail(ctx, `${k} takes a non-empty array`);
        const preds = v.map((x, i) => cond(x, `${ctx}.${k}[${i}]`));
        return k === "all" ? H.all_of(...preds) : H.any_of(...preds);
      }
      case "not": {
        const p = cond(v, `${ctx}.not`);
        return (s) => !p(s);
      }
      default:
        fail(ctx, `unknown condition '${k}'`);
    }
  }

  // ------------------------------------------------------------------ text
  function compileText(t, ctx) {
    if (typeof t === "function") return t;
    if (typeof t === "string") {
      if (!t.includes("{name}")) return t;
      return (s) => t.split("{name}").join(s.player.name);
    }
    if (Array.isArray(t)) {
      if (!t.length) fail(ctx, "text variant list is empty");
      const variants = t.map((v, i) => {
        const vctx = `${ctx}[${i}]`;
        if (!v || typeof v !== "object" || typeof v.text !== "string") {
          fail(vctx, "text variant must be { if?, text }");
        }
        const last = i === t.length - 1;
        if (last && "if" in v) fail(vctx, "last text variant must be unconditional");
        if (!last && !("if" in v)) fail(vctx, "only the last text variant may omit 'if'");
        return { when: "if" in v ? cond(v.if, vctx) : null, text: compileText(v.text, vctx) };
      });
      return (s) => {
        for (const v of variants) {
          if (!v.when || v.when(s)) {
            return typeof v.text === "function" ? v.text(s) : v.text;
          }
        }
        return "";
      };
    }
    fail(ctx, "text must be a string, function, or variant array");
  }

  // --------------------------------------------------------------- targets
  function isPick(t) {
    return t && typeof t === "object" && !Array.isArray(t) && "pick" in t;
  }

  function compilePick(spec, ctx) {
    const arms = spec.pick;
    if (!Array.isArray(arms) || arms.length < 2) fail(ctx, "pick needs at least two arms");
    const compiled = arms.map((a, i) => {
      const actx = `${ctx}.pick[${i}]`;
      if (!a || typeof a !== "object" || typeof a.to !== "string") {
        fail(actx, "pick arm must be { if?, to:'scene_id' }");
      }
      const last = i === arms.length - 1;
      if (last && "if" in a) fail(actx, "last pick arm must be unconditional");
      if (!last && !("if" in a)) fail(actx, "only the last pick arm may omit 'if'");
      return { when: "if" in a ? cond(a.if, actx) : null, to: a.to };
    });
    const fn = (s) => {
      for (const a of compiled) if (!a.when || a.when(s)) return a.to;
      return compiled[compiled.length - 1].to;
    };
    fn.targets = [...new Set(compiled.map((a) => a.to))];
    return fn;
  }

  /* Compile one target slot: static string passes through, pick compiles to
     a function with .targets, a plain function picks up a declared target
     list (from `declared`) as fn.targets. */
  function compileTarget(t, declared, ctx) {
    if (typeof t === "string") {
      if (declared) fail(ctx, "declared targets on a static target");
      return t;
    }
    if (isPick(t)) {
      if (declared) fail(ctx, "declared targets on a pick target");
      return compilePick(t, ctx);
    }
    if (typeof t === "function") {
      if (declared) {
        if (!Array.isArray(declared) || !declared.length
            || declared.some((x) => typeof x !== "string")) {
          fail(ctx, "declared targets must be a non-empty array of scene ids");
        }
        t.targets = declared.slice();
      }
      return t;
    }
    fail(ctx, "target must be a scene id string, { pick: [...] }, or a function");
  }

  // ---------------------------------------------------------------- scenes
  function compileChoice(ch, ctx) {
    if (!ch || typeof ch !== "object") fail(ctx, "choice must be an object");
    const transitions = ["goto", "check", "combat"].filter((k) => k in ch);
    if (transitions.length !== 1) {
      fail(ctx, `choice must have exactly one of goto/check/combat, has [${transitions.join(", ")}]`);
    }
    ch.text = compileText(ch.text, `${ctx}.text`);
    if ("when" in ch) ch.when = cond(ch.when, `${ctx}.when`);

    if ("goto" in ch) {
      ch.goto = compileTarget(ch.goto, ch.targets, `${ctx}.goto`);
      delete ch.targets;
    }
    if ("check" in ch) {
      const c = ch.check;
      if (!c || typeof c !== "object") fail(ctx, "check must be an object");
      if (!["might", "wits", "spirit"].includes(c.stat)) {
        fail(ctx, `check.stat must be might/wits/spirit, got '${c.stat}'`);
      }
      c.ok = compileTarget(c.ok, ch.ok_targets, `${ctx}.check.ok`);
      c.fail = compileTarget(c.fail, ch.fail_targets, `${ctx}.check.fail`);
      delete ch.ok_targets;
      delete ch.fail_targets;
    }
    if ("combat" in ch) {
      const c = ch.combat;
      if (!c || typeof c !== "object") fail(ctx, "combat must be an object");
      c.win = compileTarget(c.win, ch.win_targets, `${ctx}.combat.win`);
      if ("flee" in c) c.flee = compileTarget(c.flee, ch.flee_targets, `${ctx}.combat.flee`);
      delete ch.win_targets;
      delete ch.flee_targets;
    }
  }

  /* Compile a pack's SCENES dict in place. Returns the opening markers found:
     { <sceneId>: { entry_from, ws, preset } }. Scene ids must carry the
     chapter's `c<n>_` prefix ("death" excepted). */
  HC.dsl = HC.dsl || {};
  HC.dsl.cond = cond;
  HC.dsl.compileScenes = function (chapterId, number, SCENES) {
    const prefix = `c${number}_`;
    const openings = {};
    for (const [sid, scene] of Object.entries(SCENES)) {
      const ctx = `${chapterId}/${sid}`;
      if (sid !== "death" && !sid.startsWith(prefix)) {
        fail(ctx, `scene id must start with '${prefix}' (or be 'death')`);
      }
      if (!scene || typeof scene !== "object") fail(ctx, "scene must be an object");

      if ("entry_from" in scene) {
        if (typeof scene.entry_from !== "string") fail(ctx, "entry_from must be an ending id");
        if (typeof scene.ws !== "string") fail(ctx, "opening scene needs a 'ws' world-state string");
        openings[sid] = {
          entry_from: scene.entry_from,
          ws: scene.ws,
          preset: scene.preset || {},
        };
      } else if ("ws" in scene || "preset" in scene) {
        fail(ctx, "ws/preset markers only belong on opening scenes (with entry_from)");
      }
      for (const k of MARKER_KEYS) delete scene[k];

      scene.text = compileText(scene.text, `${ctx}.text`);
      if ("ending" in scene) {
        if (typeof scene.ending !== "string") fail(ctx, "pack ending titles must be static strings");
        if (scene.choices && scene.choices.length) fail(ctx, "ending scenes take no choices");
        scene.choices = scene.choices || [];
        continue;
      }
      if (!Array.isArray(scene.choices) || !scene.choices.length) {
        fail(ctx, "non-ending scene needs a non-empty choices array");
      }
      scene.choices.forEach((choice, i) => compileChoice(choice, `${ctx}#${i}`));
    }
    return { openings };
  };
})(globalThis.HC);
