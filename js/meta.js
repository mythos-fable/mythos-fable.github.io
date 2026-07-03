/* Meta screens: toolbar, inventory/character/party/use-item panels, and the
   level-up stat pick. These render instantly (no typewriter) but keep an
   explicit Close button, per the house style. Ported from the show_* helpers
   in mythos/engine.py. */
(function (HC) {
  "use strict";

  const $ = (sel) => document.querySelector(sel);

  function el(tag, cls, text) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  let escHandler = null;

  function openModal(title, body, opts) {
    opts = opts || {};
    const root = $("#modal-root");
    root.innerHTML = "";
    const card = el("div", "modal-card");
    card.appendChild(el("h2", "modal-title", title));
    card.appendChild(body);
    const buttons = el("div", "modal-buttons");
    card.appendChild(buttons);
    root.appendChild(card);
    root.classList.remove("hidden");

    function close() {
      root.classList.add("hidden");
      root.innerHTML = "";
      if (escHandler) {
        document.removeEventListener("keydown", escHandler);
        escHandler = null;
      }
    }
    if (!opts.required) {
      const closeBtn = el("button", "btn", "Close");
      closeBtn.addEventListener("click", close);
      buttons.appendChild(closeBtn);
      escHandler = (e) => { if (e.code === "Escape") close(); };
      document.addEventListener("keydown", escHandler);
    }
    return { close, buttons, card };
  }

  // ------------------------------------------------------------ panels
  function characterBody(state) {
    const p = state.player;
    const body = el("div", "modal-body");
    const bg = { veteran: "Veteran of Greyfield",
                 scribe: "Scribe of the Shattered Temple",
                 gutterborn: "Gutterborn of Cindral" }[p.background] || "Wanderer";
    const head = el("div", "entry");
    head.appendChild(el("div", "entry-name", `${p.name}, ${bg}`));
    head.appendChild(el("div", "entry-sub", `Level ${p.level} (${p.xp} XP)`));
    body.appendChild(head);
    body.appendChild(el("div", "statline", `HP ${p.hp}/${p.max_hp}   ·   Gold ${p.gold}`));
    body.appendChild(el("div", "statline",
      `Might ${p.stats.might}   ·   Wits ${p.stats.wits}   ·   Spirit ${p.stats.spirit}`));
    const soul = state.karma >= 15 ? "a soul the color of dawn"
      : state.karma > -15 ? "a soul still weighing itself"
      : "a soul the color of ash";
    body.appendChild(el("div", "soul-line",
      `Those with the sight say you have ${soul}.`));
    return body;
  }

  function inventoryBody(state) {
    const p = state.player;
    const body = el("div", "modal-body");
    if (!p.inventory.length) {
      body.appendChild(el("div", "entry",
        "Your pockets hold nothing but lint and resolve."));
    }
    for (const iid of p.inventory) {
      const it = HC.ITEMS[iid];
      const tag = { weapon: `weapon +${it.power}`, armor: `armor +${it.power}`,
                    consumable: `heals ${it.power}`, quest: "quest" }[it.kind];
      const entry = el("div", "entry");
      entry.appendChild(el("div", "entry-name", `${it.name}  (${tag})`));
      entry.appendChild(el("div", "entry-sub", it.desc));
      body.appendChild(entry);
    }
    body.appendChild(el("div", "statline", `Gold: ${p.gold}`));
    return body;
  }

  function partyBody(state) {
    const body = el("div", "modal-body");
    let anyMet = false;
    for (const [cid, cdef] of Object.entries(HC.COMPANION_DEFS)) {
      const c = state.companions[cid];
      if (!c.met) continue;
      anyMet = true;
      const [tier, color] = HC.approvalTier(c.approval);
      const status = !c.alive ? "fallen" : c.in_party ? "with you" : "elsewhere";
      const entry = el("div", "entry");
      const name = el("div", "entry-name");
      name.append(`${cdef.name}, ${cdef.title} — ${status}, `);
      const sign = c.approval > 0 ? "+" : "";
      name.appendChild(el("span", `c-${color}`, `${tier} (${sign}${c.approval})`));
      entry.appendChild(name);
      entry.appendChild(el("div", "entry-sub", cdef.desc));
      body.appendChild(entry);
    }
    if (!anyMet) {
      body.appendChild(el("div", "entry", "You walk alone, for now."));
    }
    return body;
  }

  function openUseItem(state) {
    const body = el("div", "modal-body");
    const modal = openModal("USE ITEM", body);

    function render() {
      body.innerHTML = "";
      const p = state.player;
      body.appendChild(el("div", "statline", `HP ${p.hp}/${p.max_hp}`));
      const usable = p.inventory.filter((i) => HC.ITEMS[i].kind === "consumable");
      if (!usable.length) {
        body.appendChild(el("div", "entry", "Nothing to use."));
        return;
      }
      const seen = new Set();
      for (const iid of usable) {
        if (seen.has(iid)) continue;
        seen.add(iid);
        const count = usable.filter((x) => x === iid).length;
        const row = el("div", "entry use-row");
        const label = el("div");
        label.appendChild(el("div", "entry-name",
          `${HC.ITEMS[iid].name}${count > 1 ? ` ×${count}` : ""}`));
        label.appendChild(el("div", "entry-sub", `heals ${HC.ITEMS[iid].power}`));
        row.appendChild(label);
        const useBtn = el("button", "btn", "Use");
        useBtn.addEventListener("click", () => {
          const idx = p.inventory.indexOf(iid);
          if (idx === -1) return;
          p.inventory.splice(idx, 1);
          p.hp = Math.min(p.max_hp, p.hp + HC.ITEMS[iid].power);
          HC.presenter.toast(`You use the ${HC.ITEMS[iid].name} (${p.hp}/${p.max_hp} HP)`);
          HC.save.write(state);
          render();
        });
        row.appendChild(useBtn);
        body.appendChild(row);
      }
    }
    render();
    return modal;
  }

  // -------------------------------------------------------- save / load
  function loadableSlot(n) {
    const slot = HC.save.readSlot(n);
    if (!slot) return null;
    const scenes = HC.buildChapterScenes(slot.chapter);
    if (!scenes || !(slot.state.scene in scenes) || slot.state.scene === "death") {
      return null;
    }
    return slot;
  }

  function anyLoadableSlot() {
    for (let n = 1; n <= HC.save.SLOT_COUNT; n++) {
      if (loadableSlot(n)) return true;
    }
    return false;
  }

  function slotLabel(n, slot) {
    const label = el("div");
    if (!slot) {
      label.appendChild(el("div", "entry-name", `Slot ${n} — empty`));
      label.appendChild(el("div", "entry-sub", "The page is blank."));
      return label;
    }
    const p = slot.state.player;
    label.appendChild(el("div", "entry-name", `Slot ${n} — ${p.name}, level ${p.level}`));
    const when = slot.saved_at ? new Date(slot.saved_at).toLocaleString() : "";
    const def = HC.getChapter(slot.chapter);
    const chap = def ? `Chapter ${def.number}` : slot.chapter;
    label.appendChild(el("div", "entry-sub",
      `${chap} · HP ${p.hp}/${p.max_hp} · ${p.gold} gold${when ? ` · ${when}` : ""}`));
    return label;
  }

  function openSaveMenu(state) {
    const body = el("div", "modal-body");
    const modal = openModal("RECORD THE TALE", body);

    function render() {
      body.innerHTML = "";
      if (state.scene === "death") {
        body.appendChild(el("div", "entry", "The dead keep no journals."));
        return;
      }
      for (let n = 1; n <= HC.save.SLOT_COUNT; n++) {
        const slot = HC.save.readSlot(n);
        const row = el("div", "entry use-row");
        row.appendChild(slotLabel(n, slot));
        const btn = el("button", "btn", slot ? "Overwrite" : "Save");
        btn.addEventListener("click", () => {
          if (HC.save.writeSlot(n, state)) {
            HC.presenter.toast(`The tale is recorded in slot ${n}.`);
            render();
          } else {
            HC.presenter.toast("The ink would not take. (Storage unavailable.)");
          }
        });
        row.appendChild(btn);
        body.appendChild(row);
      }
    }
    render();
    return modal;
  }

  function openLoadMenu() {
    const body = el("div", "modal-body");
    const modal = openModal("TAKE UP A TALE", body);
    let any = false;
    for (let n = 1; n <= HC.save.SLOT_COUNT; n++) {
      const slot = loadableSlot(n);
      const row = el("div", "entry use-row");
      row.appendChild(slotLabel(n, slot));
      if (slot) {
        any = true;
        const btn = el("button", "btn", "Load");
        btn.addEventListener("click", () => {
          modal.close();
          HC.presenter.start(slot.state);
        });
        row.appendChild(btn);
      }
      body.appendChild(row);
    }
    if (any && HC.presenter.getState()) {
      body.appendChild(el("div", "entry-sub",
        "Loading sets the tale in progress aside; it is kept only as far as its last autosave."));
    }
    return modal;
  }

  // -------------------------------------------------------- level-up pick
  function statPickModal(state) {
    return new Promise((resolve) => {
      const p = state.player;
      const body = el("div", "modal-body");
      body.appendChild(el("div", "entry",
        `You have reached level ${p.level}. Raise a stat:`));
      const modal = openModal("LEVEL UP", body, { required: true });
      for (const stat of ["might", "wits", "spirit"]) {
        const label = stat[0].toUpperCase() + stat.slice(1);
        const btn = el("button", "btn", `${label}  (${p.stats[stat]} → ${p.stats[stat] + 1})`);
        btn.addEventListener("click", () => {
          modal.close();
          resolve(stat);
        });
        modal.buttons.appendChild(btn);
      }
    });
  }

  // ------------------------------------------------------------- toolbar
  let toolbarEnabled = true;

  function initToolbar() {
    const bar = $("#toolbar");
    const speedLabel = () =>
      `Aa · ${HC.presenter.getSpeed()[0].toUpperCase() + HC.presenter.getSpeed().slice(1)}`;
    const buttons = [
      ["Inventory", () => openModal("INVENTORY", inventoryBody(HC.presenter.getState()))],
      ["Character", () => openModal("CHARACTER", characterBody(HC.presenter.getState()))],
      ["Party", () => openModal("COMPANIONS", partyBody(HC.presenter.getState()))],
      ["Use Item", () => openUseItem(HC.presenter.getState())],
      ["Save", () => openSaveMenu(HC.presenter.getState())],
      ["Load", () => openLoadMenu()],
    ];
    for (const [label, fn] of buttons) {
      const btn = el("button", "", label);
      btn.addEventListener("click", () => {
        if (!toolbarEnabled || !HC.presenter.getState()) return;
        fn();
      });
      bar.appendChild(btn);
    }
    const speedBtn = el("button", "", "");
    speedBtn.textContent = speedLabel();
    speedBtn.title = "Text speed";
    speedBtn.addEventListener("click", () => {
      HC.presenter.cycleSpeed();
      speedBtn.textContent = speedLabel();
    });
    bar.appendChild(speedBtn);
  }

  HC.meta = {
    initToolbar,
    statPickModal,
    openModal,
    openLoadMenu,
    anyLoadableSlot,
    setToolbarVisible(on) { $("#toolbar").classList.toggle("hidden", !on); },
    setToolbarEnabled(on) { toolbarEnabled = on; },
  };
})(globalThis.HC);
