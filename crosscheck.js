#!/usr/bin/env node
/* Crosscheck: verify the JS story port against the Python sources without
   running Python. Tokenizes mythos/story/*.py directly, extracts a
   normalized scene graph, and diffs it against `node selftest.js --dump`.

   Texts are compared as lowercase alphanumerics (punctuation/case-blind) so
   the web port's punchline splits ("# " / "= " markers, added quotes) pass,
   while dropped sentences, reworded lines, or wrong targets are caught.
   The epilogue() composer in endings.py is NOT covered (functions, not
   scenes); it was ported by hand and is exercised by the selftest runs.

   Usage: node crosscheck.js */
"use strict";

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const PY_DIR = path.join(__dirname, "..", "mythos", "story");
const PY_FILES = ["prologue.py", "act1.py", "act2.py", "act3.py", "endings.py"];

// --------------------------------------------------- python source scanner
// Minimal tokenizer: tracks strings (single/double/triple quoted, escapes)
// and # comments so brackets can be matched reliably.

function makeScanner(src) {
  return { src, pos: 0 };
}

function skipBlank(sc) {
  while (sc.pos < sc.src.length) {
    const ch = sc.src[sc.pos];
    if (ch === "#") {
      while (sc.pos < sc.src.length && sc.src[sc.pos] !== "\n") sc.pos++;
    } else if (" \t\r\n".includes(ch)) {
      sc.pos++;
    } else {
      return;
    }
  }
}

function stringQuoteAt(sc) {
  // returns the quote token ("'''", '"""', "'", '"') at pos, or null
  const s = sc.src, p = sc.pos;
  for (const q of ['"""', "'''"]) {
    if (s.startsWith(q, p)) return q;
  }
  if (s[p] === '"' || s[p] === "'") return s[p];
  return null;
}

function readString(sc) {
  // sc.pos is at the opening quote; returns decoded value, advances past it
  const s = sc.src;
  const q = stringQuoteAt(sc);
  if (!q) throw new Error(`not a string at ${sc.pos}`);
  let p = sc.pos + q.length;
  let out = "";
  while (p < s.length) {
    if (s[p] === "\\") {
      const esc = s[p + 1];
      out += esc === "n" ? "\n" : esc === "t" ? "\t" : esc;
      p += 2;
    } else if (s.startsWith(q, p)) {
      sc.pos = p + q.length;
      return out;
    } else {
      out += s[p];
      p++;
    }
  }
  throw new Error("unterminated python string");
}

function skipString(sc) { readString(sc); }

// Reads a balanced bracket region starting at sc.pos (which must be at an
// opener). Returns the inner source (without the outer brackets).
const CLOSER = { "{": "}", "[": "]", "(": ")" };

function readBalanced(sc) {
  const s = sc.src;
  const open = s[sc.pos];
  const close = CLOSER[open];
  if (!close) throw new Error(`not an opener at ${sc.pos}: ${s[sc.pos]}`);
  const start = sc.pos + 1;
  let depth = 1;
  sc.pos++;
  while (sc.pos < s.length) {
    const ch = s[sc.pos];
    if (ch === "#") {
      while (sc.pos < s.length && s[sc.pos] !== "\n") sc.pos++;
    } else if (stringQuoteAt(sc)) {
      skipString(sc);
    } else {
      if ("{[(".includes(ch)) depth++;
      else if ("}])".includes(ch)) {
        depth--;
        if (depth === 0) {
          const inner = s.slice(start, sc.pos);
          sc.pos++;
          return inner;
        }
      }
      sc.pos++;
    }
  }
  throw new Error("unbalanced brackets");
}

// Reads one value expression at top level: stops at a "," or end-of-input
// at depth 0. Returns the raw source slice.
function readValueExpr(sc) {
  const s = sc.src;
  const start = sc.pos;
  let depth = 0;
  while (sc.pos < s.length) {
    const ch = s[sc.pos];
    if (ch === "#") {
      while (sc.pos < s.length && s[sc.pos] !== "\n") sc.pos++;
    } else if (stringQuoteAt(sc)) {
      skipString(sc);
    } else if ("{[(".includes(ch)) {
      depth++; sc.pos++;
    } else if ("}])".includes(ch)) {
      if (depth === 0) break;
      depth--; sc.pos++;
    } else if (ch === "," && depth === 0) {
      break;
    } else {
      sc.pos++;
    }
  }
  return s.slice(start, sc.pos);
}

// Parses dict source (inner text of {...}) into [key, rawValueExpr] pairs.
// Only string keys are expected (story dicts).
function parseDict(inner) {
  const sc = makeScanner(inner);
  const entries = [];
  for (;;) {
    skipBlank(sc);
    if (sc.pos >= sc.src.length) break;
    if (!stringQuoteAt(sc)) {
      throw new Error(`expected string key at ...${inner.slice(sc.pos, sc.pos + 40)}`);
    }
    let key = readString(sc);
    skipBlank(sc);
    // adjacent string concatenation in a key is not used, but ':' must follow
    if (sc.src[sc.pos] !== ":") throw new Error(`expected ':' after key ${key}`);
    sc.pos++;
    skipBlank(sc);
    const value = readValueExpr(sc);
    entries.push([key, value.trim()]);
    skipBlank(sc);
    if (sc.src[sc.pos] === ",") sc.pos++;
  }
  return entries;
}

function parseList(inner) {
  const sc = makeScanner(inner);
  const items = [];
  for (;;) {
    skipBlank(sc);
    if (sc.pos >= sc.src.length) break;
    const value = readValueExpr(sc);
    if (value.trim()) items.push(value.trim());
    skipBlank(sc);
    if (sc.src[sc.pos] === ",") sc.pos++;
  }
  return items;
}

// If the expression is purely string literals joined by +/adjacency (parens
// allowed), returns the concatenated value; otherwise null (=> dynamic).
function staticString(expr) {
  const sc = makeScanner(expr);
  let out = "";
  let sawString = false;
  for (;;) {
    skipBlank(sc);
    if (sc.pos >= sc.src.length) break;
    const ch = sc.src[sc.pos];
    if (stringQuoteAt(sc)) {
      out += readString(sc);
      sawString = true;
    } else if (ch === "+" || ch === "(" || ch === ")") {
      sc.pos++;
    } else {
      return null; // lambda, identifier, conditional...
    }
  }
  return sawString ? out : null;
}

function exprToDict(expr) {
  const sc = makeScanner(expr);
  skipBlank(sc);
  if (sc.src[sc.pos] !== "{") return null;
  return parseDict(readBalanced(sc));
}

function fxShapePy(expr) {
  if (expr === undefined) return null;
  const d = exprToDict(expr);
  if (d === null) return "<dyn>"; // lambda fx
  return d.map(([k]) => k).sort();
}

function targetPy(expr) {
  if (expr === undefined) return null;
  const s = staticString(expr);
  return s === null ? "<dyn>" : s;
}

// ------------------------------------------------------------ text normal.
// Mirror of selftest normText, then case/punctuation-blind.
function normText(t) {
  return t.split(/\n{2,}/)
    .map((p) => p.replace(/^[#=] /, "").replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join(" ");
}

function looseNorm(t) {
  if (t === "<dyn>" || t === null) return t;
  return t.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function textPy(expr) {
  const s = staticString(expr);
  return s === null ? "<dyn>" : normText(s);
}

// ----------------------------------------------------- per-scene extraction
function sceneFromPy(rawDict) {
  const entries = parseDict(rawDict);
  const get = (k) => {
    const e = entries.find(([key]) => key === k);
    return e ? e[1] : undefined;
  };

  const out = {
    text: get("text") !== undefined ? textPy(get("text")) : "<dyn>",
    on_enter: get("on_enter") !== undefined ? fxShapePy(get("on_enter")) : null,
    ending: get("ending") !== undefined ? targetPy(get("ending")) : null,
    choices: [],
  };

  const choicesExpr = get("choices");
  if (choicesExpr !== undefined) {
    const sc = makeScanner(choicesExpr);
    skipBlank(sc);
    if (sc.src[sc.pos] === "[") {
      for (const item of parseList(readBalanced(sc))) {
        const cd = exprToDict(item);
        if (cd === null) throw new Error("choice is not a dict literal");
        const cget = (k) => {
          const e = cd.find(([key]) => key === k);
          return e ? e[1] : undefined;
        };
        const choice = {
          text: cget("text") !== undefined ? textPy(cget("text")) : "<dyn>",
          when: cget("when") !== undefined,
          fx: cget("fx") !== undefined ? fxShapePy(cget("fx")) : null,
          goto: cget("goto") !== undefined ? targetPy(cget("goto")) : null,
          check: null,
          combat: null,
        };
        const checkExpr = cget("check");
        if (checkExpr !== undefined) {
          const kd = exprToDict(checkExpr);
          const kget = (k) => {
            const e = kd.find(([key]) => key === k);
            return e ? e[1] : undefined;
          };
          choice.check = {
            stat: staticString(kget("stat")),
            dc: parseInt(kget("dc"), 10),
            ok: targetPy(kget("ok")),
            fail: targetPy(kget("fail")),
            ok_fx: kget("ok_fx") !== undefined ? fxShapePy(kget("ok_fx")) : null,
            fail_fx: kget("fail_fx") !== undefined ? fxShapePy(kget("fail_fx")) : null,
          };
        }
        const combatExpr = cget("combat");
        if (combatExpr !== undefined) {
          const bd = exprToDict(combatExpr);
          const bget = (k) => {
            const e = bd.find(([key]) => key === k);
            return e ? e[1] : undefined;
          };
          choice.combat = {
            enemy: staticString(bget("enemy")),
            win: targetPy(bget("win")),
            flee: bget("flee") !== undefined ? targetPy(bget("flee")) : null,
            win_fx: bget("win_fx") !== undefined ? fxShapePy(bget("win_fx")) : null,
          };
        }
        out.choices.push(choice);
      }
    }
  }
  return out;
}

function scenesFromFile(file) {
  const src = fs.readFileSync(file, "utf8");
  const m = src.match(/^SCENES = \{/m);
  if (!m) throw new Error(`no SCENES dict in ${file}`);
  const sc = makeScanner(src);
  sc.pos = m.index + "SCENES = ".length;
  const inner = readBalanced(sc);
  const scenes = {};
  for (const [sid, raw] of parseDict(inner)) {
    const dsc = makeScanner(raw);
    skipBlank(dsc);
    if (dsc.src[dsc.pos] !== "{") throw new Error(`scene ${sid} is not a dict`);
    scenes[sid] = sceneFromPy(readBalanced(dsc));
  }
  return scenes;
}

// ------------------------------------------------------------------- diff
function diffValue(label, py, js, problems) {
  const a = JSON.stringify(py);
  const b = JSON.stringify(js);
  if (a !== b) problems.push(`${label}: py=${a} js=${b}`);
}

function diffScene(sid, py, js, problems) {
  diffValue(`${sid}.text`, looseNorm(py.text), looseNorm(js.text), problems);
  diffValue(`${sid}.on_enter`, py.on_enter, js.on_enter, problems);
  diffValue(`${sid}.ending`, py.ending, js.ending, problems);
  if (py.choices.length !== js.choices.length) {
    problems.push(`${sid}.choices: py has ${py.choices.length}, js has ${js.choices.length}`);
    return;
  }
  py.choices.forEach((pc, i) => {
    const jc = js.choices[i];
    const tag = `${sid}.choices[${i}]`;
    diffValue(`${tag}.text`, looseNorm(pc.text), looseNorm(jc.text), problems);
    diffValue(`${tag}.when`, pc.when, jc.when, problems);
    diffValue(`${tag}.fx`, pc.fx, jc.fx, problems);
    diffValue(`${tag}.goto`, pc.goto, jc.goto, problems);
    diffValue(`${tag}.check`, pc.check, jc.check, problems);
    diffValue(`${tag}.combat`, pc.combat, jc.combat, problems);
  });
}

function main() {
  // python side
  const pyScenes = {};
  for (const f of PY_FILES) {
    const file = path.join(PY_DIR, f);
    const scenes = scenesFromFile(file);
    for (const sid of Object.keys(scenes)) {
      if (sid in pyScenes) throw new Error(`duplicate scene id ${sid} (${f})`);
      pyScenes[sid] = scenes[sid];
    }
  }

  // js side
  const dumpJson = execFileSync(process.execPath,
    [path.join(__dirname, "selftest.js"), "--dump"],
    { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  const jsScenes = JSON.parse(dumpJson);

  const problems = [];
  const pyIds = Object.keys(pyScenes).sort();
  const jsIds = Object.keys(jsScenes).sort();
  for (const sid of pyIds) {
    if (!(sid in jsScenes)) problems.push(`scene ${sid}: in python, MISSING from js port`);
  }
  for (const sid of jsIds) {
    if (!(sid in pyScenes)) problems.push(`scene ${sid}: in js port, not in python`);
  }
  for (const sid of pyIds) {
    if (sid in jsScenes) diffScene(sid, pyScenes[sid], jsScenes[sid], problems);
  }

  console.log(`Python scenes: ${pyIds.length}   JS scenes: ${jsIds.length}`);
  if (problems.length === 0) {
    console.log("Crosscheck: OK — JS port matches the Python story sources.");
    return;
  }
  console.log(`Crosscheck: ${problems.length} difference(s):`);
  for (const p of problems) console.log("  - " + p);
  process.exitCode = 1;
}

main();
