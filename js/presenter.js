/* Presenter: turns scene text into a sequence of "beats" — paragraphs typed
   out letter by letter, punchlines revealed whole, mechanical notices shown
   instantly — each advanced with a Next button. Drives the pure engine. */
(function (HC) {
  "use strict";

  const SPEEDS = { slow: 30, normal: 18, fast: 8, instant: 0 };
  const SPEED_ORDER = ["slow", "normal", "fast", "instant"];
  const PUNCHLINE_MAX = 90; // chars; shorter paragraphs hit harder alone

  const P = {
    state: null,
    scenes: null,
    speed: "normal",
    reduceMotion: false,
    currentSkip: null,   // finishes the current animation instantly
    advance: null,       // what Space/Enter triggers when nothing is animating
    choiceButtons: null, // for number-key shortcuts
    lastLeftScene: null, // for the shop-loop instant-revisit shortcut
  };

  try { P.speed = localStorage.getItem("hc_speed") || "normal"; } catch (e) { /* ignore */ }
  if (!(P.speed in SPEEDS)) P.speed = "normal";

  const $ = (sel) => document.querySelector(sel);
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  function el(tag, cls, text) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function msPerChar() {
    if (P.reduceMotion) return 0;
    return SPEEDS[P.speed];
  }

  function scrollBottom() {
    window.scrollTo({ top: document.body.scrollHeight });
  }

  function toast(text) {
    const t = el("div", "toast", text);
    $("#toast-root").appendChild(t);
    setTimeout(() => t.remove(), 2600);
  }

  // ------------------------------------------------------------ beats
  /* Split scene text on blank lines; collapse the source's hard wrapping.
     "# " forces punchline styling, "= " forces plain; short paragraphs
     punchline automatically. */
  function splitBeats(text) {
    return text.split(/\n{2,}/)
      .map((p) => p.replace(/\s+/g, " ").trim())
      .filter(Boolean)
      .map((p) => {
        if (p.startsWith("# ")) return { text: p.slice(2), punch: true };
        if (p.startsWith("= ")) return { text: p.slice(2), punch: false };
        return { text: p, punch: p.length <= PUNCHLINE_MAX };
      });
  }

  /* Letter-by-letter reveal with small pauses on punctuation.
     Click / Space / Enter completes the beat instantly. */
  function typeInto(node, text, msChar) {
    return new Promise((resolve) => {
      if (msChar <= 0) {
        node.textContent = text;
        scrollBottom();
        resolve();
        return;
      }
      let idx = 0;
      let last = performance.now();
      let budget = 0;
      let extra = 0;
      let done = false;
      node.classList.add("typing");
      const pauseFor = (ch) =>
        ".!?—".includes(ch) ? 160 : ",;:".includes(ch) ? 70 : 0;
      const finish = () => {
        if (done) return;
        done = true;
        node.textContent = text;
        node.classList.remove("typing");
        P.currentSkip = null;
        scrollBottom();
        resolve();
      };
      P.currentSkip = finish;
      function frame(now) {
        if (done) return;
        budget += now - last;
        last = now;
        while (budget >= msChar + extra && idx < text.length) {
          budget -= msChar + extra;
          idx += 1;
          extra = pauseFor(text[idx - 1]);
        }
        node.textContent = text.slice(0, idx);
        scrollBottom();
        if (idx >= text.length) { finish(); return; }
        requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    });
  }

  /* Punchlines don't typewrite: a beat of silence, then the whole line
     fades up. The pause is what sells it. */
  async function showPunchline(node) {
    scrollBottom();
    if (msPerChar() <= 0) {
      node.classList.add("show", "no-anim");
      return;
    }
    let skipped = false;
    P.currentSkip = () => {
      skipped = true;
      node.classList.add("show", "no-anim");
      P.currentSkip = null;
    };
    await sleep(350);
    if (skipped) return;
    node.classList.add("show");
    await sleep(720);
    P.currentSkip = null;
  }

  function waitNext(label) {
    return new Promise((resolve) => {
      const btn = el("button", "continue-btn", label || "Next  ▸");
      $("#controls").appendChild(btn);
      const done = () => {
        btn.remove();
        P.advance = null;
        resolve();
      };
      btn.addEventListener("click", done);
      P.advance = done;
      scrollBottom();
    });
  }

  function divider(label) {
    return el("div", "divider", label ? `✦ ${label} ✦` : "✦");
  }

  // ------------------------------------------------- notices and rolls
  function noticeLine(n) {
    return el("div", `notice-line ${n.kind}`, `[ ${n.text} ]`);
  }

  function rollLine(roll) {
    const div = el("div", "roll-line");
    div.append(
      `[${roll.statName} check, DC ${roll.dc}]  d20: ${roll.roll} + ${roll.bonus} = ${roll.total} — `);
    div.appendChild(el("span", roll.success ? "verdict-ok" : "verdict-fail",
      roll.success ? "Success" : "Failure"));
    if (roll.crit) div.appendChild(el("span", "crit", "  Critical!"));
    if (roll.fumble) div.appendChild(el("span", "fumble", "  Fumble!"));
    return div;
  }

  /* items: [{type:"notice", n} | {type:"roll", roll}] — rendered instantly
     as one block so the player gets a single Next, not click fatigue. */
  function mechBlock(items) {
    const block = el("div", "mech-block");
    for (const it of items) {
      block.appendChild(it.type === "roll" ? rollLine(it.roll) : noticeLine(it.n));
    }
    return block;
  }

  function mechItems(preNotices, roll, postNotices, enterNotices) {
    const items = [];
    for (const n of preNotices || []) items.push({ type: "notice", n });
    if (roll) items.push({ type: "roll", roll });
    for (const n of postNotices || []) items.push({ type: "notice", n });
    for (const n of enterNotices || []) items.push({ type: "notice", n });
    return items;
  }

  // ------------------------------------------------------------ choices
  function presentChoices(choices) {
    return new Promise((resolve) => {
      const list = el("div", "choice-list");
      const buttons = [];
      choices.forEach((c, i) => {
        const btn = el("button", "btn");
        btn.style.animationDelay = `${i * 60}ms`;
        if (c.check) {
          btn.appendChild(el("span", "tag tag-check",
            `[${HC.dice.STAT_NAMES[c.check.stat]}]`));
        }
        if (c.combat) {
          btn.appendChild(el("span", "tag tag-fight", "[Fight]"));
        }
        btn.append(HC.engine.resolve(c.text, P.state));
        btn.addEventListener("click", () => {
          list.remove();
          P.choiceButtons = null;
          resolve(c);
        });
        list.appendChild(btn);
        buttons.push(btn);
      });
      P.choiceButtons = buttons;
      $("#controls").appendChild(list);
      scrollBottom();
    });
  }

  // ----------------------------------------------------------- stat picks
  async function resolveStatPicks() {
    while (P.state.pendingStatPicks > 0) {
      const stat = await HC.meta.statPickModal(P.state);
      P.state.applyStatPick(stat);
    }
    for (const n of P.state.drainNotices()) toast(n.text);
  }

  // -------------------------------------------------------------- combat
  function hpRow(name, cls) {
    const row = el("div", "combat-row");
    row.appendChild(el("span", `combat-name ${cls}`, name));
    const num = el("span", "combat-hp-num");
    row.appendChild(num);
    const bar = el("div", "hpbar");
    const fill = el("div", `hpbar-fill ${cls}`);
    bar.appendChild(fill);
    return { row, bar, num, fill };
  }

  async function runCombatUI(enemyId, preNotices) {
    HC.meta.setToolbarEnabled(false);
    const combat = HC.createCombat(P.state, enemyId);
    const maxEnemyHp = combat.enemy.hp;
    const scroll = $("#scroll");

    scroll.appendChild(divider("COMBAT"));
    if (preNotices && preNotices.length) {
      scroll.appendChild(mechBlock(preNotices.map((n) => ({ type: "notice", n }))));
    }
    const flavorNode = el("div", "beat");
    scroll.appendChild(flavorNode);
    await typeInto(flavorNode, combat.enemy.flavor, msPerChar());

    // panel: enemy bar on top, player bar below, five actions
    const panel = el("div");
    panel.id = "combat-panel";
    const enemyUi = hpRow(combat.enemy.name, "enemy");
    const playerUi = hpRow(P.state.player.name, "player");
    panel.append(enemyUi.row, enemyUi.bar, playerUi.row, playerUi.bar);
    const actionBar = el("div", "action-bar");
    const submenu = el("div", "combat-submenu");
    panel.append(actionBar, submenu);
    $("#controls").appendChild(panel);

    const ACTIONS = [
      ["attack", "Attack"], ["feint", "Feint"], ["invoke", "Invoke"],
      ["item", "Use Item"], ["flee", "Flee"],
    ];
    const actionButtons = {};
    let onAction = null;
    for (const [id, label] of ACTIONS) {
      const btn = el("button", "btn", label);
      btn.addEventListener("click", () => { if (onAction) onAction(id); });
      actionBar.appendChild(btn);
      actionButtons[id] = btn;
    }

    function updateBars() {
      const e = Math.max(combat.enemy.hp, 0);
      const p = Math.max(P.state.player.hp, 0);
      enemyUi.fill.style.width = `${(e / maxEnemyHp) * 100}%`;
      enemyUi.num.textContent = `${e} HP`;
      playerUi.fill.style.width = `${(p / P.state.player.max_hp) * 100}%`;
      playerUi.num.textContent = `${p}/${P.state.player.max_hp} HP`;
      actionButtons.attack.classList.toggle("primed", combat.feintPrimed);
    }

    function setEnabled(on) {
      for (const btn of Object.values(actionButtons)) btn.disabled = !on;
    }

    function awaitAction() {
      return new Promise((resolve) => {
        setEnabled(true);
        onAction = (id) => {
          if (id !== "item") {
            onAction = null;
            submenu.innerHTML = "";
            resolve({ action: id });
            return;
          }
          // inline consumable submenu
          submenu.innerHTML = "";
          const usable = P.state.player.inventory
            .filter((i) => HC.ITEMS[i].kind === "consumable");
          if (!usable.length) {
            onAction = null;
            resolve({ action: "item" }); // "nothing useful to hand" — free round
            return;
          }
          const seen = new Set();
          for (const iid of usable) {
            if (seen.has(iid)) continue;
            seen.add(iid);
            const count = usable.filter((x) => x === iid).length;
            const btn = el("button", "btn",
              `${HC.ITEMS[iid].name} (heals ${HC.ITEMS[iid].power})`
              + (count > 1 ? ` ×${count}` : ""));
            btn.addEventListener("click", () => {
              onAction = null;
              submenu.innerHTML = "";
              resolve({ action: "item", itemId: iid });
            });
            submenu.appendChild(btn);
          }
          const cancel = el("button", "btn", "Put it away");
          cancel.addEventListener("click", () => { submenu.innerHTML = ""; });
          submenu.appendChild(cancel);
          scrollBottom();
        };
      });
    }

    updateBars();
    scrollBottom();

    while (true) {
      const { action, itemId } = await awaitAction();
      setEnabled(false);
      const res = combat.act(action, itemId);
      const logSpeed = Math.min(msPerChar(), 8);
      for (const line of res.log) {
        const node = el("div", `combat-log-line ${line.kind}`);
        scroll.appendChild(node);
        await typeInto(node, line.text, logSpeed);
        updateBars();
      }
      updateBars();
      if (res.over) {
        panel.remove();
        HC.meta.setToolbarEnabled(true);
        return res.result;
      }
    }
  }

  // -------------------------------------------------------- scene driver
  async function clearStage() {
    const col = $("#column");
    col.classList.add("fade-out");
    await sleep(220);
    $("#scroll").innerHTML = "";
    $("#controls").innerHTML = "";
    col.classList.remove("fade-out");
    window.scrollTo(0, 0);
  }

  async function playBeats(beats, revisit) {
    const scroll = $("#scroll");
    for (let i = 0; i < beats.length; i++) {
      const b = beats[i];
      const node = b.punch ? el("div", "punchline", b.text) : el("div", "beat");
      scroll.appendChild(node);
      if (revisit) {
        node.textContent = b.text;
        if (b.punch) node.classList.add("show", "no-anim");
        continue;
      }
      if (b.punch) {
        await showPunchline(node);
      } else {
        await typeInto(node, b.text, msPerChar());
      }
      if (i < beats.length - 1) await waitNext();
    }
    scrollBottom();
  }

  async function playEnding(title) {
    P.state.ending = title;
    HC.map.recordEnding(title);
    const scroll = $("#scroll");
    await waitNext();

    scroll.appendChild(el("div", "heading-beat", `ENDING: ${title.toUpperCase()}`));
    scrollBottom();
    await waitNext();

    if (HC.story.epilogue) {
      await playBeats(splitBeats(HC.story.epilogue(P.state)), false);
      await waitNext();
    }

    const footer = el("div", "footer-beat");
    footer.appendChild(el("div", "thanks", "Thank you for playing The Hollow Crown."));
    footer.appendChild(el("div", "", `Final karma ${P.state.karma >= 0 ? "+" : ""}${P.state.karma}   ·   Level ${P.state.player.level}`));
    scroll.appendChild(footer);

    const list = el("div", "choice-list");
    const addBtn = (label, fn) => {
      const btn = el("button", "btn", label);
      btn.addEventListener("click", fn);
      list.appendChild(btn);
    };
    if (title === "An Unmarked Grave") {
      // Death is not always the end of a tale: the autosave still points at
      // the last camp (the engine never saves a transition into "death").
      const saved = HC.save.read();
      if (saved && saved.scene in P.scenes && saved.scene !== "death") {
        addBtn("Rise from your last camp", () => {
          P.state = saved;
          P.lastLeftScene = null;
          playScene(saved.scene, {});
        });
      }
    }
    addBtn("View the map of roads", () => HC.map.open({ path: P.state.path }));
    addBtn("Return to the title", () => HC.main.showTitle());
    $("#controls").appendChild(list);
    scrollBottom();
  }

  async function playScene(id, carried) {
    carried = carried || {};
    const revisit = id === P.lastLeftScene; // e.g. the merchant's shop loop
    const data = HC.engine.enterScene(P.state, P.scenes, id);
    if (P.state.path[P.state.path.length - 1] !== id) P.state.path.push(id);
    HC.map.recordVisit(id);
    HC.meta.setToolbarVisible(true);
    await clearStage();

    const items = mechItems(carried.preNotices, carried.roll,
      carried.postNotices, data.notices);
    if (items.length) {
      $("#scroll").appendChild(mechBlock(items));
      if (!revisit) await waitNext();
    }

    await playBeats(splitBeats(data.text), revisit);

    if (data.ending !== null) {
      await playEnding(data.ending);
      return;
    }

    const visible = HC.engine.visibleChoices(P.state, data.scene);
    if (!visible.length) {
      throw new Error(`Scene ${id} has no available choices`);
    }
    const choice = await presentChoices(visible);
    P.lastLeftScene = id;

    let preNotices = HC.engine.applyChoiceFx(P.state, choice);
    await resolveStatPicks();

    const t = HC.engine.transition(P.state, choice);
    let target;
    let roll = null;
    let postNotices = [];
    if (t.kind === "combat") {
      const result = await runCombatUI(t.enemyId, preNotices);
      preNotices = [];
      const out = HC.engine.combatOutcome(P.state, choice, result);
      target = out.target;
      postNotices = out.notices;
    } else {
      target = t.target;
      roll = t.roll || null;
      postNotices = t.notices || [];
    }
    await resolveStatPicks();

    P.state.scene = target;
    HC.map.recordEdge(id, target);
    if (target !== "death") HC.save.write(P.state);
    playScene(target, { preNotices, roll, postNotices });
  }

  // ----------------------------------------------------------- input glue
  function bindInput() {
    document.addEventListener("keydown", (e) => {
      const tag = e.target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (!$("#modal-root").classList.contains("hidden")) return;
      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();
        if (P.currentSkip) P.currentSkip();
        else if (P.advance) P.advance();
        return;
      }
      if (P.choiceButtons && /^Digit[1-9]$/.test(e.code)) {
        const idx = Number(e.code.slice(5)) - 1;
        if (idx < P.choiceButtons.length) P.choiceButtons[idx].click();
      }
    });
    document.getElementById("stage").addEventListener("click", (e) => {
      if (e.target.closest("button, input, a")) return;
      if (P.currentSkip) P.currentSkip();
    });
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    P.reduceMotion = mq.matches;
    if (mq.addEventListener) {
      mq.addEventListener("change", () => { P.reduceMotion = mq.matches; });
    }
  }

  function cycleSpeed() {
    const idx = SPEED_ORDER.indexOf(P.speed);
    P.speed = SPEED_ORDER[(idx + 1) % SPEED_ORDER.length];
    try { localStorage.setItem("hc_speed", P.speed); } catch (e) { /* ignore */ }
    return P.speed;
  }

  HC.presenter = {
    init(scenes) {
      P.scenes = scenes;
      bindInput();
    },
    start(state, sceneId) {
      P.state = state;
      P.lastLeftScene = null;
      playScene(sceneId !== undefined ? sceneId : state.scene, {});
    },
    getState() { return P.state; },
    getScenes() { return P.scenes; },
    getSpeed() { return P.speed; },
    cycleSpeed,
    clearStage,
    typeInto,
    msPerChar,
    splitBeats,
    waitNext,
    toast,
    el,
  };
})(globalThis.HC);
