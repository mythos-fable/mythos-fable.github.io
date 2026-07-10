/* Chapter 2 data: new companions, items, enemies, the world-state mapping,
   and the two ways a Chapter 2 game begins — importState() carries a real
   Chapter 1 end-of-game snapshot across, presetState() builds the curated
   "as the legends tell it" start for endings discovered before snapshots
   existed. All ids are c2_-prefixed; ITEMS/ENEMIES/COMPANION_DEFS are global
   dicts shared across chapters. */
(function (HC) {
  "use strict";

  // ------------------------------------------------------- new companions
  Object.assign(HC.COMPANION_DEFS, {
    oshka: {
      name: "Oshka",
      title: "the Brine-Singer",
      atk: 3,
      desc: "A Loomless woman of the Mourncoast who remembers, in song, the way " +
            "the world was held before anyone thought to weave it. Gods cannot " +
            "see her. She finds this very funny.",
    },
    quill: {
      name: "Quill",
      title: "the Unbranded Clerk",
      atk: 2,
      desc: "A Corvid ledger-clerk who defected with one page of Mother Rook's " +
            "master book and the steadiest hands on the coast. Worries the way " +
            "other people breathe.",
    },
  });

  Object.assign(HC.COMPANION_LINES, {
    oshka: ["Oshka sings one low note and the enemy's footing forgets itself.",
            "\"The tide says DOWN,\" Oshka observes, helpfully.",
            "Oshka's boat-hook arrives like an argument settled."],
    quill: ["Quill flings a pot of ledger-ink, precisely, into the enemy's eyes.",
            "\"This is NOT in my job description,\" Quill notes, stabbing.",
            "Quill trips the enemy with a satchel-strap, then apologizes."],
  });

  // --------------------------------------------------------------- items
  Object.assign(HC.ITEMS, {
    // weapons
    "c2_boat_hook":     { name: "Saltmere Boat-Hook", kind: "weapon", power: 2,
                          desc: "Half tool, half argument. The Mourncoast settles most things with one." },
    "c2_knot_knife":    { name: "Knot-Knife", kind: "weapon", power: 3,
                          desc: "A Loomless blade of whale-bone and salt-iron, made for cutting what should not hold." },
    "c2_anchor_pick":   { name: "Tidemother's Pick", kind: "weapon", power: 4,
                          desc: "Bronze, barnacled, older than the loom. It remembers being used to TIE, not to break." },
    "c2_corvid_beak":   { name: "Corvid's Beak", kind: "weapon", power: 3,
                          desc: "A debt-collector's hooked dagger. The hook is for ledgers. Mostly." },
    // armor
    "c2_oilskin":       { name: "Mourncoast Oilskin", kind: "armor", power: 1,
                          desc: "Keeps out rain, spray, and most of the coast's opinions." },
    "c2_kelp_weave":    { name: "Kelp-Weave Jack", kind: "armor", power: 2,
                          desc: "Loomless armor, woven without a loom, out of principle and kelp." },
    "c2_rook_feathers": { name: "Rook-Feather Coat", kind: "armor", power: 3,
                          desc: "Blackened leather scaled like plumage. Wearing it, you feel watched — by the coat." },
    // consumables
    "c2_salt_bread":    { name: "Salt-Crust Loaf", kind: "consumable", power: 4,
                          desc: "Bread that fights back. Restores a little strength." },
    "c2_brine_tonic":   { name: "Brine-Singer's Tonic", kind: "consumable", power: 8,
                          desc: "Tastes like the sea forgiving you. Oshka's mother's recipe." },
    "c2_pearl_dram":    { name: "Dram of the Deep Pearl", kind: "consumable", power: 15,
                          desc: "Light from the bottom of the world, bottled. Heals what the dark took." },
    // quest
    "c2_ledger_page":   { name: "Page of the Master Ledger", kind: "quest", power: 0,
                          desc: "One page of Mother Rook's true accounts. The oldest entry is not in any living alphabet." },
    "c2_knot_charm":    { name: "First-Knot Charm", kind: "quest", power: 0,
                          desc: "A cord tied by the Tidemother's own hands, the Loomless say. It hums near the Anchors." },
    "c2_anchor_chart":  { name: "Chart of the Nine Anchors", kind: "quest", power: 0,
                          desc: "A sea-chart marking nine drowned moorings. Three have been crossed out by someone recent." },
    "c2_tally_coin":    { name: "Rook's Tally-Coin", kind: "quest", power: 0,
                          desc: "Mother Rook's marker. Carrying it means she expects to collect. She always collects." },
    "c2_tide_psalter":  { name: "The Tide Psalter", kind: "quest", power: 0,
                          desc: "Songs older than prayer, notated in knots along a cord. Oshka can read it. So, worryingly, can you." },
  });

  // -------------------------------------------------------------- enemies
  Object.assign(HC.ENEMIES, {
    c2_corvids:      { name: "Rook's Corvids", hp: 22, guard: 13, dmg: 6,
                       flavor: "Debt-collectors in feathered black, polite as undertakers. " +
                               "They show you the paperwork before they draw." },
    c2_wreck_gang:   { name: "Wreckers of the Shallows", hp: 18, guard: 12, dmg: 5,
                       flavor: "Lantern-luring scavengers who farm the tide for the drowned. " +
                               "Business has been excellent lately." },
    c2_knot_wraith:  { name: "A Slipped Mooring", hp: 26, guard: 13, dmg: 7,
                       flavor: "Someone the failing Anchor let go of: a shape of salt-water " +
                               "and grief, still wearing its name like a torn sail." },
    c2_marsh_thing:  { name: "The Eel-Mother's Get", hp: 28, guard: 13, dmg: 7,
                       flavor: "The marsh dreamed something up before the loom was here to " +
                               "say no. It has been patient. It is done being patient." },
    c2_tally_master: { name: "The Tally-Master", hp: 32, guard: 14, dmg: 7,
                       flavor: "Mother Rook's chief collector: a giant in a clerk's coat, " +
                               "an abacus of knuckle-bones, and no recorded sense of humor." },
    c2_undertow:     { name: "The Undertow", hp: 38, guard: 14, dmg: 8,
                       flavor: "The space under the lowest tide, given appetite. It pulls " +
                               "with the patience of a debt accruing." },
    c2_debtor_grasp: { name: "The Debtor's Grasp", hp: 46, guard: 15, dmg: 9,
                       flavor: "A hand of the thing beneath the Ninth Anchor — borrowed " +
                               "substance, five fingers of midnight water, reaching for " +
                               "more time." },
  });

  // ---------------------------------------------------- world-state table
  /* ws flag per chapter-1 ending: which world Chapter 2 happens in.
       vael      — the god rebound; the loom holds, silent.
       you_dawn / you_ash / you_grey — YOU hold the Crown (kind / cruel / both),
                   walking the coast mortal-shaped for a span.
       serra / maeve / hollow — a companion holds the Crown.
       mortal    — the Crown is broken; the world catches itself.
       unmade    — the world unclenched; the coast is the last living place. */
  const WS_BY_ENDING = {
    end_chained_god:  "vael",
    end_new_shepherd: "you_dawn",
    end_tyrant:       "you_ash",
    end_uneasy_god:   "you_grey",
    end_mortal_age:   "mortal",
    end_serra:        "serra",
    end_maeve:        "maeve",
    end_hollow_god:   "hollow",
    end_last_witness: "unmade",
  };

  const GOD_STATES = ["vael", "you_dawn", "you_ash", "you_grey",
                      "serra", "maeve", "hollow"];
  const PLAYER_GOD_STATES = ["you_dawn", "you_ash", "you_grey"];

  /* Chapter-1 flags whose memory Chapter 2 keeps. Everything else stays in
     the snapshot but does not follow the character into the new tale. */
  const FLAG_CARRYOVER = [
    // how chapter 1 ended
    "final_reforged", "final_claimed", "final_destroyed", "final_companion",
    "final_witness", "crowned_serra", "crowned_maeve", "crowned_hollow",
    // debts and merchants
    "rook_resolved", "rook_angry", "met_merchant", "sold_memory",
    "sold_lantern", "asked_merchant",
    // companions' unfinished business
    "vex_resolved", "vex_declined", "vex_lost", "maeve_saved", "maeve_burned",
    "took_locket",
    // deeds the coast may have heard about
    "saved_ashfen", "looted_ashfen", "lantern_taken", "killed_king",
    "knows_prince", "crayce_resolved", "have_letters",
  ];

  /* Gear that crosses the chapter break. Chapter-1 quest items stay in
     chapter 1 — except the soul-lantern, which is not done with you. */
  function carriesOver(itemId) {
    const it = HC.ITEMS[itemId];
    if (!it) return false;
    if (itemId === "soul_lantern") return true;
    return it.kind !== "quest";
  }

  // -------------------------------------------------------------- presets
  /* Curated starts for endings discovered before snapshots existed: a
     level-6 wanderer whose gear, karma and companion history match the
     legend of that ending. XP 1000 = exactly level 6; max_hp follows the
     +5-per-level rule. */
  const LEVEL6 = { level: 6, xp: 1000, max_hp: 45 };

  function basePreset() {
    return {
      stats: { might: 3, wits: 3, spirit: 2 },
      gold: 60,
      inventory: ["soldiers_blade", "shield_cloak", "poultice", "poultice", "bread"],
      karma: 15,
      companions: {
        serra:  { met: true, in_party: false, approval: 30, alive: true },
        vex:    { met: true, in_party: false, approval: 20, alive: true },
        maeve:  { met: true, in_party: false, approval: 25, alive: true },
        hollow: { met: true, in_party: false, approval: 30, alive: true },
      },
      flags: {},
    };
  }

  function preset(overrides) {
    const p = basePreset();
    Object.assign(p, overrides || {});
    return p;
  }

  const PRESETS = {
    end_chained_god: preset({
      karma: 25,
      flags: { final_reforged: true },
    }),
    end_new_shepherd: preset({
      karma: 45,
      stats: { might: 3, wits: 3, spirit: 3 },
      flags: { final_claimed: true },
    }),
    end_tyrant: preset({
      karma: -55,
      stats: { might: 4, wits: 3, spirit: 1 },
      gold: 120,
      inventory: ["wyrmglass_dagger", "rook_mail", "elixir", "poultice"],
      companions: {
        serra:  { met: true, in_party: false, approval: -50, alive: true },
        vex:    { met: true, in_party: false, approval: -10, alive: true },
        maeve:  { met: true, in_party: false, approval: -35, alive: true },
        hollow: { met: true, in_party: false, approval: -45, alive: true },
      },
      flags: { final_claimed: true },
    }),
    end_uneasy_god: preset({
      karma: 0,
      flags: { final_claimed: true },
    }),
    end_mortal_age: preset({
      karma: 20,
      inventory: ["soldiers_blade", "leather_jerkin", "poultice", "poultice",
                  "bread", "bread"],
      flags: { final_destroyed: true },
    }),
    end_serra: preset({
      karma: 30,
      companions: {
        serra:  { met: true, in_party: false, approval: 70, alive: true },
        vex:    { met: true, in_party: false, approval: 15, alive: true },
        maeve:  { met: true, in_party: false, approval: 25, alive: true },
        hollow: { met: true, in_party: false, approval: 30, alive: true },
      },
      flags: { final_companion: true, crowned_serra: true },
    }),
    end_maeve: preset({
      karma: 25,
      stats: { might: 2, wits: 4, spirit: 2 },
      companions: {
        serra:  { met: true, in_party: false, approval: 30, alive: true },
        vex:    { met: true, in_party: false, approval: 20, alive: true },
        maeve:  { met: true, in_party: false, approval: 70, alive: true },
        hollow: { met: true, in_party: false, approval: 30, alive: true },
      },
      flags: { final_companion: true, crowned_maeve: true },
    }),
    end_hollow_god: preset({
      karma: 35,
      companions: {
        serra:  { met: true, in_party: false, approval: 30, alive: true },
        vex:    { met: true, in_party: false, approval: 20, alive: true },
        maeve:  { met: true, in_party: false, approval: 25, alive: true },
        hollow: { met: true, in_party: false, approval: 75, alive: true },
      },
      flags: { final_companion: true, crowned_hollow: true },
    }),
    end_last_witness: preset({
      karma: -10,
      stats: { might: 2, wits: 3, spirit: 4 },
      gold: 0,
      inventory: ["wyrmglass_dagger", "shield_cloak", "elixir"],
      flags: { final_witness: true, met_merchant: true },
    }),
  };

  // ------------------------------------------------------- state builders
  function finishState(state, endingId) {
    state.chapter = "ch2";
    state.entered = null;
    state.path = [];
    state.ending = null;
    state.notices = [];
    state.pendingStatPicks = 0;
    state.flags.ws = WS_BY_ENDING[endingId];
    state.player.hp = state.player.max_hp;
    return state;
  }

  function presetState(endingId) {
    const p = PRESETS[endingId];
    const state = new HC.GameState();
    const pl = state.player;
    pl.background = null; // the legends never agree on who you were, either
    pl.level = LEVEL6.level;
    pl.xp = LEVEL6.xp;
    pl.max_hp = LEVEL6.max_hp;
    pl.stats = Object.assign({}, p.stats);
    pl.gold = p.gold;
    pl.inventory = p.inventory.slice();
    state.karma = p.karma;
    for (const [cid, c] of Object.entries(p.companions)) {
      state.companions[cid] = Object.assign({}, c);
    }
    Object.assign(state.flags, p.flags);
    return finishState(state, endingId);
  }

  function importState(snapshotDict, endingId) {
    const state = HC.GameState.fromDict(snapshotDict);
    // the new tale starts alone: party members rejoin (or don't) on the coast
    for (const c of Object.values(state.companions)) c.in_party = false;
    // gear crosses; chapter-1 quest items (almost all) do not
    state.player.inventory = state.player.inventory.filter(carriesOver);
    // memory crosses only where the whitelist says the coast would feel it
    const kept = {};
    for (const key of FLAG_CARRYOVER) {
      if (key in state.flags) kept[key] = state.flags[key];
    }
    state.flags = kept;
    return finishState(state, endingId);
  }

  // ------------------------------------------------- world-state helpers
  /* Predicates for scene conditions, alongside the chapter-1 set. */
  HC.helpers.ws = (...vals) => (s) => vals.includes(s.flag("ws"));
  HC.helpers.ws_not = (...vals) => (s) => !vals.includes(s.flag("ws"));
  HC.helpers.ws_god = (s) => GOD_STATES.includes(s.flag("ws"));
  HC.helpers.ws_no_god = (s) => !GOD_STATES.includes(s.flag("ws"));
  HC.helpers.ws_player_god = (s) => PLAYER_GOD_STATES.includes(s.flag("ws"));

  HC.story = HC.story || {};
  HC.story.c2_data = {
    WS_BY_ENDING, GOD_STATES, PLAYER_GOD_STATES, FLAG_CARRYOVER,
    PRESETS, presetState, importState,
  };
})(globalThis.HC);
