/* Boot: chapter menu, new game / continue, the continuation picker that
   starts a chapter from a previous chapter's discovered ending, and name
   entry. Grew out of the single-chapter title screen ported from main.py. */
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

  function validSave(chapterId) {
    const saved = HC.save.read(chapterId);
    const scenes = HC.buildChapterScenes(chapterId);
    if (saved && scenes && saved.scene in scenes && saved.scene !== "death") return saved;
    return null;
  }

  /* Non-death endings discovered / total, for the chapter card. */
  function endingTally(def) {
    const found = HC.profile.endingsFor(def.id);
    const real = def.endings.filter((e) => !e.isDeath);
    const n = real.filter((e) => e.id in found).length;
    return { n, total: real.length };
  }

  // -------------------------------------------------------------- title
  async function showTitle() {
    HC.meta.setToolbarVisible(false);
    await HC.presenter.clearStage();

    const screen = el("div");
    screen.id = "title-screen";
    screen.appendChild(el("pre", "", TITLE_ART));
    screen.appendChild(el("h1", "", "MYTHOS'S FABLE"));
    screen.appendChild(el("div", "subtitle",
      "in which every road is open, and every road remembers"));

    const buttons = el("div", "title-buttons");

    // the most advanced unlocked chapter gets the prominent button
    const unlocked = HC.CHAPTERS.filter((c) => HC.profile.isUnlocked(c.id));
    const suggested = unlocked[unlocked.length - 1];
    if (suggested) {
      const saved = validSave(suggested.id);
      if (saved) {
        const btn = el("button", "btn btn-primary",
          `Continue the saved tale — Chapter ${suggested.number}: ${suggested.title}`);
        btn.addEventListener("click", () => HC.presenter.start(saved));
        buttons.appendChild(btn);
        buttons.appendChild(el("div", "save-hint",
          `${saved.player.name}, level ${saved.player.level} — the road remembers.`));
      } else if (suggested.number > 1) {
        const btn = el("button", "btn btn-primary",
          `Continue the tale — Chapter ${suggested.number}: ${suggested.title}`);
        btn.addEventListener("click", () => openChapterStart(suggested.id));
        buttons.appendChild(btn);
      }
    }

    // one card per chapter
    const list = el("div", "chapter-list");
    for (const def of HC.CHAPTERS) {
      list.appendChild(chapterCard(def));
    }
    screen.appendChild(buttons);
    screen.appendChild(list);

    const tail = el("div", "title-buttons");
    if (HC.meta.anyLoadableSlot()) {
      const loadBtn = el("button", "btn", "Load a saved tale");
      loadBtn.addEventListener("click", () => HC.meta.openLoadMenu());
      tail.appendChild(loadBtn);
    }
    screen.appendChild(tail);
    $("#scroll").appendChild(screen);
  }

  function chapterCard(def) {
    const card = el("div", "chapter-card");
    card.appendChild(el("div", "chapter-head",
      `Chapter ${def.number}: ${def.title}`));
    card.appendChild(el("div", "chapter-sub", def.subtitle));

    if (!HC.profile.isUnlocked(def.id)) {
      card.classList.add("locked");
      const prev = HC.getChapter(def.entry.from);
      card.appendChild(el("div", "chapter-sealed",
        `Sealed — reach an ending of Chapter ${prev ? prev.number : "?"} to break the seal.`));
      return card;
    }

    const actions = el("div", "chapter-actions");
    const saved = validSave(def.id);
    if (saved) {
      const btn = el("button", "btn", "Continue");
      btn.addEventListener("click", () => HC.presenter.start(saved));
      actions.appendChild(btn);
    }
    const beginBtn = el("button", "btn", saved ? "Begin anew" : "Begin");
    beginBtn.addEventListener("click", () => {
      if (validSave(def.id)) confirmNewGame(def);
      else beginChapter(def);
    });
    actions.appendChild(beginBtn);
    if (HC.map.hasEndingRecorded(def.id)) {
      const mapBtn = el("button", "btn", "Map");
      mapBtn.addEventListener("click", () => HC.map.open(def.id, { path: [] }));
      actions.appendChild(mapBtn);
    }
    card.appendChild(actions);

    const tally = endingTally(def);
    if (tally.n > 0) {
      card.appendChild(el("div", "endings-count",
        `${tally.n} of ${tally.total} endings found`));
    }
    return card;
  }

  function beginChapter(def) {
    if (def.entry.kind === "fixed") {
      nameEntry(
        "The world is ending slowly enough to walk through. "
        + "Before you take the first step —",
        (name) => {
          const state = new HC.GameState();
          state.chapter = def.id;
          state.player.name = name;
          HC.save.clear(def.id);
          HC.presenter.start(state, def.entry.scene);
        });
    } else {
      openChapterStart(def.id);
    }
  }

  function confirmNewGame(def) {
    const body = el("div", "modal-body");
    body.appendChild(el("div", "entry",
      `A tale is already underway in Chapter ${def.number}. `
      + "Begin anew, and the old tale will be forgotten."));
    const modal = HC.meta.openModal("BEGIN ANEW", body);
    const confirm = el("button", "btn", "Let it be forgotten");
    confirm.addEventListener("click", () => {
      modal.close();
      HC.save.clear(def.id);
      beginChapter(def);
    });
    modal.buttons.prepend(confirm);
  }

  // -------------------------------------------- continuation start flow
  /* Pick which discovered ending of the previous chapter this tale follows.
     opts.preselect skips the picker (used by the post-ending button). */
  async function openChapterStart(chapterId, opts) {
    opts = opts || {};
    const def = HC.getChapter(chapterId);
    if (!def || def.entry.kind !== "continuation") return beginChapter(def);
    if (opts.preselect && HC.profile.hasEnding(def.entry.from, opts.preselect)) {
      return startContinuation(def, opts.preselect);
    }

    const prev = HC.getChapter(def.entry.from);
    const found = HC.profile.endingsFor(prev.id);
    HC.meta.setToolbarVisible(false);
    await HC.presenter.clearStage();

    const screen = el("div");
    screen.id = "title-screen";
    screen.appendChild(el("div", "chapter", `Chapter ${def.number}: ${def.title}`));
    screen.appendChild(el("div", "subtitle", def.subtitle));
    screen.appendChild(el("div", "subtitle",
      `Every tale of ${def.title} begins where a tale of ${prev.title} ended. `
      + "Which ending does this one follow?"));

    const list = el("div", "chapter-list");
    for (const e of prev.endings) {
      if (e.isDeath || !def.entry.points[e.id]) continue;
      const card = el("div", "chapter-card");
      if (e.id in found) {
        card.appendChild(el("div", "chapter-head", e.title));
        const snap = HC.profile.snapshotFor(prev.id, e.id);
        card.appendChild(el("div", "chapter-sub", snap
          ? `${snap.player.name}, level ${snap.player.level}, `
            + `karma ${snap.karma >= 0 ? "+" : ""}${snap.karma} — as you left them.`
          : "As the legends tell it."));
        const actions = el("div", "chapter-actions");
        const btn = el("button", "btn", "Set out from this ending");
        btn.addEventListener("click", () => startContinuation(def, e.id));
        actions.appendChild(btn);
        card.appendChild(actions);
      } else {
        card.classList.add("locked");
        card.appendChild(el("div", "chapter-head", "???"));
        card.appendChild(el("div", "chapter-sub",
          "An ending you have not yet found."));
      }
      list.appendChild(card);
    }
    screen.appendChild(list);

    const tail = el("div", "title-buttons");
    const back = el("button", "btn", "Return to the title");
    back.addEventListener("click", () => showTitle());
    tail.appendChild(back);
    screen.appendChild(tail);
    $("#scroll").appendChild(screen);
  }

  function startContinuation(def, endingId) {
    const proceed = () => {
      const snap = HC.profile.snapshotFor(def.entry.from, endingId);
      if (snap) {
        const state = def.entry.importState(snap, endingId);
        HC.save.clear(def.id);
        HC.presenter.start(state, def.entry.points[endingId]);
      } else {
        // a legend, not a save: the preset needs a name for its wanderer
        nameEntry(
          "The legends never agree on the name. Before this tale settles it —",
          (name) => {
            const state = def.entry.presetState(endingId);
            state.player.name = name;
            HC.save.clear(def.id);
            HC.presenter.start(state, def.entry.points[endingId]);
          });
      }
    };
    if (validSave(def.id)) {
      const body = el("div", "modal-body");
      body.appendChild(el("div", "entry",
        `A tale is already underway in Chapter ${def.number}. `
        + "Set out afresh, and the old tale will be forgotten."));
      const modal = HC.meta.openModal("SET OUT AFRESH", body);
      const confirm = el("button", "btn", "Let it be forgotten");
      confirm.addEventListener("click", () => { modal.close(); proceed(); });
      modal.buttons.prepend(confirm);
    } else {
      proceed();
    }
  }

  // --------------------------------------------------------- name entry
  async function nameEntry(introText, onName) {
    await HC.presenter.clearStage();
    const scroll = $("#scroll");
    const intro = el("div", "beat");
    scroll.appendChild(intro);
    await HC.presenter.typeInto(intro, introText, HC.presenter.msPerChar());

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
      onName(name.slice(0, 24));
    }
    go.addEventListener("click", begin);
    input.addEventListener("keydown", (e) => {
      if (e.code === "Enter") { e.preventDefault(); begin(); }
    });
  }

  function boot() {
    HC.finalizeChapters();
    HC.profile.migrate();
    HC.presenter.init();
    HC.meta.initToolbar();
    showTitle();
  }

  HC.main = { showTitle, openChapterStart };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})(globalThis.HC);
