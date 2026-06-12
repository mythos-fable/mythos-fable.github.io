/* Persistence: localStorage instead of savegame.json, same payload shape. */
(function (HC) {
  "use strict";

  const KEY = "hollow_crown_save_v1";

  function write(state) {
    try {
      localStorage.setItem(KEY, JSON.stringify(state.toDict()));
      return true;
    } catch (e) {
      return false;
    }
  }

  function read() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return null;
      return HC.GameState.fromDict(JSON.parse(raw));
    } catch (e) {
      return null;
    }
  }

  function exists() { return read() !== null; }

  function clear() {
    try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ }
  }

  // ----------------------------------------------------- manual save slots
  // Same payload as the autosave, wrapped with a timestamp. The autosave
  // (KEY) keeps working untouched underneath.
  const SLOT_COUNT = 3;
  const slotKey = (n) => `${KEY}_slot_${n}`;

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

  /* Returns { saved_at, state } or null for an empty/corrupt slot. */
  function readSlot(n) {
    try {
      const raw = localStorage.getItem(slotKey(n));
      if (!raw) return null;
      const payload = JSON.parse(raw);
      return { saved_at: payload.saved_at || null,
               state: HC.GameState.fromDict(payload.save) };
    } catch (e) {
      return null;
    }
  }

  function clearSlot(n) {
    try { localStorage.removeItem(slotKey(n)); } catch (e) { /* ignore */ }
  }

  HC.save = { KEY, write, read, exists, clear,
              SLOT_COUNT, writeSlot, readSlot, clearSlot };
})(globalThis.HC);
