/* Persistence: localStorage instead of savegame.json, same payload shape.
   Chapter-aware: each chapter has its own autosave key. Chapter 1 keeps the
   original pre-chapters key so existing saves load with no migration. */
(function (HC) {
  "use strict";

  const LEGACY_KEY = "hollow_crown_save_v1";

  function keyFor(chapterId) {
    const def = HC.getChapter && HC.getChapter(chapterId);
    return (def && def.saveKey) || `mythos_fable_save_${chapterId}`;
  }

  function write(state) {
    try {
      localStorage.setItem(keyFor(state.chapter), JSON.stringify(state.toDict()));
      return true;
    } catch (e) {
      return false;
    }
  }

  function read(chapterId) {
    chapterId = chapterId || "ch1";
    try {
      const raw = localStorage.getItem(keyFor(chapterId));
      if (!raw) return null;
      const state = HC.GameState.fromDict(JSON.parse(raw));
      state.chapter = state.chapter || chapterId;
      return state;
    } catch (e) {
      return null;
    }
  }

  function exists(chapterId) { return read(chapterId) !== null; }

  function clear(chapterId) {
    try { localStorage.removeItem(keyFor(chapterId || "ch1")); } catch (e) { /* ignore */ }
  }

  // ----------------------------------------------------- manual save slots
  // Slots are global across chapters; the payload's own `chapter` field
  // (absent in version-1 saves => ch1) routes a load into the right chapter.
  const SLOT_COUNT = 3;
  const slotKey = (n) => `${LEGACY_KEY}_slot_${n}`;

  function writeSlot(n, state) {
    try {
      localStorage.setItem(slotKey(n), JSON.stringify({
        saved_at: new Date().toISOString(),
        save: state.toDict(),
      }));
      return true;
    } catch (e) {
      return false;
    }
  }

  /* Returns { saved_at, chapter, state } or null for an empty/corrupt slot. */
  function readSlot(n) {
    try {
      const raw = localStorage.getItem(slotKey(n));
      if (!raw) return null;
      const payload = JSON.parse(raw);
      const state = HC.GameState.fromDict(payload.save);
      return { saved_at: payload.saved_at || null,
               chapter: state.chapter,
               state };
    } catch (e) {
      return null;
    }
  }

  function clearSlot(n) {
    try { localStorage.removeItem(slotKey(n)); } catch (e) { /* ignore */ }
  }

  HC.save = { KEY: LEGACY_KEY, keyFor, write, read, exists, clear,
              SLOT_COUNT, writeSlot, readSlot, clearSlot };
})(globalThis.HC);
