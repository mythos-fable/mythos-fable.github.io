/* Generic chapter-continuation bridge: the two ways a continuation chapter
   begins. importState() carries a real end-of-game snapshot across the
   chapter break; presetState() builds the curated "as the legends tell it"
   start for endings discovered before snapshots existed. Generalized from
   chapter 2's hand-written bridge; configured per chapter by the pack's
   `bridge` block plus the opening scenes' ws/preset markers.

   bridge config:
     flagCarryover  flags of the previous chapter that the new one remembers
     keepQuestItems quest items that still cross (gear crosses by default)
     dropItems      gear that explicitly does not cross
     presetLevel    preset character level; xp/max_hp follow the level rules
     presetBase     preset defaults (stats/gold/inventory/karma/companions/
                    flags), overridden per ending by the opening's `preset` */
(function (HC) {
  "use strict";

  HC.bridge = {};

  HC.bridge.makeEntry = function (def) {
    const bridge = def.bridge;
    const cont = def.continuation;
    const keepQuest = new Set(bridge.keepQuestItems || []);
    const dropped = new Set(bridge.dropItems || []);

    function carriesOver(itemId) {
      const it = HC.ITEMS[itemId];
      if (!it) return false;
      if (dropped.has(itemId)) return false;
      if (keepQuest.has(itemId)) return true;
      return it.kind !== "quest";
    }

    function finishState(state, endingId) {
      state.chapter = def.id;
      state.entered = null;
      state.path = [];
      state.ending = null;
      state.notices = [];
      state.pendingStatPicks = 0;
      state.flags.ws = cont.wsByEnding[endingId];
      state.player.hp = state.player.max_hp;
      return state;
    }

    function presetState(endingId) {
      // per-ending overrides replace whole top-level blocks of the base,
      // exactly like chapter 2's original preset() did
      const p = Object.assign(
        JSON.parse(JSON.stringify(bridge.presetBase)),
        cont.presets[endingId]);
      const level = Math.min(bridge.presetLevel, HC.XP_THRESHOLDS.length);
      const state = new HC.GameState();
      const pl = state.player;
      pl.background = null; // the legends never agree on who you were, either
      pl.level = level;
      pl.xp = HC.XP_THRESHOLDS[level - 1];
      pl.max_hp = 20 + 5 * (level - 1);
      pl.stats = Object.assign({}, p.stats);
      pl.gold = p.gold;
      pl.inventory = p.inventory.slice();
      state.karma = p.karma;
      for (const [cid, c] of Object.entries(p.companions || {})) {
        state.companions[cid] = Object.assign({}, c);
      }
      Object.assign(state.flags, p.flags);
      return finishState(state, endingId);
    }

    function importState(snapshotDict, endingId) {
      const state = HC.GameState.fromDict(snapshotDict);
      // the new tale starts alone: party members rejoin (or don't) later
      for (const c of Object.values(state.companions)) c.in_party = false;
      // gear crosses; the old chapter's quest items (almost all) do not
      state.player.inventory = state.player.inventory.filter(carriesOver);
      // memory crosses only where the whitelist says the new tale feels it
      const kept = {};
      for (const key of bridge.flagCarryover || []) {
        if (key in state.flags) kept[key] = state.flags[key];
      }
      state.flags = kept;
      return finishState(state, endingId);
    }

    return { importState, presetState };
  };
})(globalThis.HC);
