/* Chapter 2 pack: The Unwoven Shore.

   The manifest, new companions/items/enemies, and the continuation bridge
   config. The scenes live in the part files under js/story/c2/, which call
   HC.registerScenes("ch2", SCENES) as they load; the per-ending entry
   wiring (entry_from / ws / preset) sits on the nine opening scenes in
   js/story/c2/openings.js. Migrated from the pre-pack js/story/c2/data.js.

   World states (the `ws` flag, one per chapter-1 ending):
     vael      — the god rebound; the loom holds, silent.
     you_dawn / you_ash / you_grey — YOU hold the Crown (kind / cruel / both),
                 walking the coast mortal-shaped for a span.
     serra / maeve / hollow — a companion holds the Crown.
     mortal    — the Crown is broken; the world catches itself.
     unmade    — the world unclenched; the coast is the last living place. */
(function (HC) {
  "use strict";

  // ------------------------------------------------- world-state helpers
  /* Grandfathered: the c2 part files destructure these from HC.helpers at
     load time. Packs from chapter 3 on define such predicates locally (or
     use the DSL's ws forms) instead of growing the shared helper set. */
  const GOD_STATES = ["vael", "you_dawn", "you_ash", "you_grey",
                      "serra", "maeve", "hollow"];
  const PLAYER_GOD_STATES = ["you_dawn", "you_ash", "you_grey"];
  HC.helpers.ws_god = (s) => GOD_STATES.includes(s.flag("ws"));
  HC.helpers.ws_no_god = (s) => !GOD_STATES.includes(s.flag("ws"));
  HC.helpers.ws_player_god = (s) => PLAYER_GOD_STATES.includes(s.flag("ws"));

  HC.registerChapter({
    number: 2,
    title: "The Unwoven Shore",
    subtitle: "a tale of debts older than gods",
    thanks: "Thank you for playing The Unwoven Shore.",
    from: "ch1",

    // ----------------------------------------------------- new companions
    companions: {
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
    },
    companionLines: {
      oshka: ["Oshka sings one low note and the enemy's footing forgets itself.",
              "\"The tide says DOWN,\" Oshka observes, helpfully.",
              "Oshka's boat-hook arrives like an argument settled."],
      quill: ["Quill flings a pot of ledger-ink, precisely, into the enemy's eyes.",
              "\"This is NOT in my job description,\" Quill notes, stabbing.",
              "Quill trips the enemy with a satchel-strap, then apologizes."],
    },

    // --------------------------------------------------------------- items
    items: {
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
    },

    // -------------------------------------------------------------- enemies
    enemies: {
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
    },

    // --------------------------------------------------------------- bridge
    bridge: {
      /* Chapter-1 flags whose memory Chapter 2 keeps. Everything else stays
         in the snapshot but does not follow the character into the new tale. */
      flagCarryover: [
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
      ],
      /* Gear crosses the chapter break; chapter-1 quest items stay in
         chapter 1 — except the soul-lantern, which is not done with you. */
      keepQuestItems: ["soul_lantern"],
      /* Curated preset starts (for endings discovered before snapshots
         existed): a level-6 wanderer whose gear, karma and companion history
         match the legend — per-ending details on the opening scenes. */
      presetLevel: 6,
      presetBase: {
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
      },
    },
  });
})(globalThis.HC);
