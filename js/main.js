/* Boot: title screen, new game / continue, name entry. Ported from main.py. */
(function (HC) {
  "use strict";

  const $ = (sel) => document.querySelector(sel);

  const TITLE_ART =
"        ..      .\n" +
"      .' ;    .'.;.\n" +
"     :  :    :  ; :\n" +
"     ;  ;____;  :_;\n" +
"     :          ;\n" +
"      '.______.'\n" +
"        |    |";

  function el(tag, cls, text) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function validSave(scenes) {
    const saved = HC.save.read();
    if (saved && saved.scene in scenes && saved.scene !== "death") return saved;
    return null;
  }

  async function showTitle() {
    const scenes = HC.presenter.getScenes();
    HC.meta.setToolbarVisible(false);
    await HC.presenter.clearStage();

    const screen = el("div");
    screen.id = "title-screen";
    screen.appendChild(el("pre", "", TITLE_ART));
    screen.appendChild(el("h1", "", "MYTHOS'S FABLE"));
    screen.appendChild(el("div", "chapter", "Chapter 1: The Hollow Crown"));
    screen.appendChild(el("div", "subtitle", "a tale of the dying god Vael"));
    screen.appendChild(el("div", "subtitle",
      "in which every road is open, and every road remembers"));

    const buttons = el("div", "title-buttons");
    const saved = validSave(scenes);
    if (saved) {
      const btn = el("button", "btn", "Continue the saved tale");
      btn.addEventListener("click", () => {
        HC.presenter.start(saved);
      });
      buttons.appendChild(btn);
      buttons.appendChild(el("div", "save-hint",
        `${saved.player.name}, level ${saved.player.level} — the road remembers.`));
    }
    if (HC.meta.anyLoadableSlot()) {
      const loadBtn = el("button", "btn", "Load a saved tale");
      loadBtn.addEventListener("click", () => HC.meta.openLoadMenu());
      buttons.appendChild(loadBtn);
    }
    if (HC.map.hasEndingRecorded()) {
      const mapBtn = el("button", "btn", "The map of roads");
      mapBtn.addEventListener("click", () => HC.map.open({ path: [] }));
      buttons.appendChild(mapBtn);
    }
    const anew = el("button", "btn", "Begin anew");
    anew.addEventListener("click", () => {
      if (validSave(scenes)) {
        confirmNewGame();
      } else {
        nameEntry();
      }
    });
    buttons.appendChild(anew);
    screen.appendChild(buttons);
    $("#scroll").appendChild(screen);
  }

  function confirmNewGame() {
    const body = el("div", "modal-body");
    body.appendChild(el("div", "entry",
      "A tale is already underway. Begin anew, and the old tale will be forgotten."));
    const modal = HC.meta.openModal("BEGIN ANEW", body);
    const confirm = el("button", "btn", "Let it be forgotten");
    confirm.addEventListener("click", () => {
      modal.close();
      HC.save.clear();
      nameEntry();
    });
    modal.buttons.prepend(confirm);
  }

  async function nameEntry() {
    await HC.presenter.clearStage();
    const scroll = $("#scroll");
    const intro = el("div", "beat");
    scroll.appendChild(intro);
    await HC.presenter.typeInto(intro,
      "The world is ending slowly enough to walk through. " +
      "Before you take the first step —",
      HC.presenter.msPerChar());

    const wrap = el("div", "name-entry");
    wrap.appendChild(el("div", "", "What is your name, traveler?"));
    const input = document.createElement("input");
    input.type = "text";
    input.maxLength = 24;
    input.autocomplete = "off";
    input.spellcheck = false;
    wrap.appendChild(input);
    const go = el("button", "btn", "Set out");
    wrap.appendChild(go);
    scroll.appendChild(wrap);
    input.focus();

    let started = false;
    function begin() {
      const name = input.value.trim();
      if (!name) {
        input.focus();
        return;
      }
      if (started) return;
      started = true;
      const state = new HC.GameState();
      state.player.name = name.slice(0, 24);
      HC.presenter.start(state, "intro");
    }
    go.addEventListener("click", begin);
    input.addEventListener("keydown", (e) => {
      if (e.code === "Enter") { e.preventDefault(); begin(); }
    });
  }

  function boot() {
    const scenes = HC.buildScenes();
    HC.presenter.init(scenes);
    HC.meta.initToolbar();
    showTitle();
  }

  HC.main = { showTitle };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})(globalThis.HC);
