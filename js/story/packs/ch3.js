/* Chapter 3 pack: The Grey Roads — the final chapter of Mythos's Fable.

   The manifest, new companions/items/enemies, and the continuation bridge
   config. The scenes live in the part files js/story/packs/ch3-*.js, which
   call HC.registerScenes("ch3", SCENES) as they load; the per-ending entry
   wiring (entry_from / ws / preset) sits on the nine opening scenes in
   ch3-openings.js.

   The stage: beyond the lowest tide of every world runs the Long Water,
   and at the end of the Long Water lies the Roadstead — the Grey Roads —
   the harbor where everything that ever finished holding rides at mooring,
   waiting for the Open. Nothing has ever been allowed to sail out.

   World states (the `ws` flag, one per chapter-2 ending):
     tide_you  — YOU hold the Nine, the first holder who does not hold alone.
     paid      — the First Debt is paid; the Debtor is a shy tenth power.
     lien      — Rook's office novated the note; the coast lives in black
                 glaze and perfect records.
     commons   — the Nine are a commons; the Session stands, arguing.
     adrift    — the coast cut its signatures and sailed off every chart.
     corded    — Oshka tied herself in; she is everywhere the song is.
     forgiven  — Vex holds the black book; the office forgives, ruinously,
                 and it holds.
     woven     — the coast consented into the weave; the margin is gone.
     harbor    — a new creation's first port grows from the Debtor's roots. */
(function (HC) {
  "use strict";

  HC.registerChapter({
    number: 3,
    title: "The Grey Roads",
    subtitle: "a tale of letting go",
    thanks: "Thank you for playing The Grey Roads — and for walking the " +
            "whole of Mythos's Fable, from a burned village to the last " +
            "water. The tale is told entire. ALL DEBTS HONORED.",
    from: "ch2",

    // ----------------------------------------------------- new companions
    companions: {
      nan: {
        name: "Nan Weir",
        title: "the Well-Wife",
        atk: 3,
        desc: "A spent surety who held the luck of one village well for nine " +
              "hundred years and never got the knack of stopping. The Roads " +
              "have spent a century trying to rest her. The Roads are losing.",
      },
      cobb: {
        name: "Cobb",
        title: "the Long-Water Ferryman",
        atk: 2,
        desc: "A Drowned Watch oarsman, four hundred years dead and never " +
              "once off duty. Rows the spent down to their moorings in a " +
              "skiff named the Eventually. Talks to the water. Reports that " +
              "the water talks back, but only shop.",
      },
    },
    companionLines: {
      nan: ["Nan hits the enemy the way a flood hits a fence: thoroughly, and without apology.",
            "\"I held a WELL, you know,\" Nan mentions, breaking something load-bearing off the enemy.",
            "Nan's grip closes. Nine hundred years of not letting go, all in one fist."],
      cobb: ["Cobb's oar arrives flat-side first, with the authority of four hundred years of dock disputes.",
             "\"Mind the gunwale,\" Cobb advises, tipping the enemy over it.",
             "Cobb rows the fight somewhere less convenient for the enemy, then stops rowing."],
    },

    // --------------------------------------------------------------- items
    items: {
      // weapons
      "c3_wrack_gaff":     { name: "Wrack-Gaff", kind: "weapon", power: 3,
                             desc: "A long-hook of grey driftwood and salvage iron. Everything on the Roads was something else first." },
      "c3_grey_oar":       { name: "Stillwater Oar", kind: "weapon", power: 4,
                             desc: "An oar cut for water that never moves. It swings like it has an opinion about where things ought to go, and the opinion is OUT." },
      // armor
      "c3_drowned_coat":   { name: "Drowned Wool Coat", kind: "armor", power: 2,
                             desc: "Wool that has been to the bottom and come back up. Nothing the weather says impresses it anymore." },
      "c3_watch_souwester":{ name: "The Watch's Sou'wester", kind: "armor", power: 3,
                             desc: "Oilskin off the post the Drowned Watch keeps empty. It fits. That is either an honor or a summons, and the Watch declines to say which." },
      // consumables
      "c3_hardtack":       { name: "Harbor Hardtack", kind: "consumable", power: 4,
                             desc: "Bread's unkillable cousin. The Roads bake it fresh, which raises questions nobody on the Roads asks." },
      "c3_moorage_tea":    { name: "Moorage Tea", kind: "consumable", power: 8,
                             desc: "Grey, hot, and strong enough to moor a skiff. Issued to the towed-back, with blankets. It tastes like being kept." },
      "c3_last_cordial":   { name: "Last-Light Cordial", kind: "consumable", power: 15,
                             desc: "Distilled from the hour the riding lights come on. Heals what waiting takes." },
      // quest
      "c3_berth_token":    { name: "Berth Token", kind: "quest", power: 0,
                             desc: "A tarred wooden tag: your name on one side, a berth number on the other. You never gave the office your name." },
      "c3_charter_stub":   { name: "Stub of the Last Page", kind: "quest", power: 0,
                             desc: "The torn inner margin of the charter's final leaf. Four words survive along the tear: '...AND THEN LET GO.'" },
      "c3_moor_writ":      { name: "Warden's Writ", kind: "quest", power: 0,
                             desc: "The Moorwife's paper: bearer acts for the Moorage in all matters of keeping. The ink smells of tar and ten thousand careful years." },
      "c3_verse_cord":     { name: "The Last Verse", kind: "quest", power: 0,
                             desc: "The Tenth Song's ending, knotted along a pale cord by hands that waited four thousand years to teach it. It is very short. Most true things are." },
    },

    // -------------------------------------------------------------- enemies
    enemies: {
      c3_wrack_dogs:    { name: "Wrack-Dogs", hp: 24, guard: 13, dmg: 6,
                          flavor: "Salvage that learned to want. They circle new arrivals the " +
                                  "way gulls circle a gutting table, and they have never once " +
                                  "been early." },
      c3_moored_wraith: { name: "A Slipped Berth", hp: 27, guard: 13, dmg: 7,
                          flavor: "A moored one whose waiting went bad — grief run aground, " +
                                  "still wearing its riding light. It does not want your life. " +
                                  "It wants your PLACE IN LINE." },
      c3_ledger_leech:  { name: "The Ledger-Leech", hp: 30, guard: 14, dmg: 7,
                          flavor: "Vault vermin, pale and patient, that eats records where " +
                                  "they lie. Whatever it bites was never written. Ask the " +
                                  "charter." },
      c3_moor_wardens:  { name: "Wardens of the Moorage", hp: 33, guard: 14, dmg: 8,
                          flavor: "Constables in oilcloth with soft voices and softer rope. " +
                                  "They have towed back everything that ever tried the Open, " +
                                  "and they are gentle about it, which is worse." },
      c3_grief_swell:   { name: "A Grief-Swell", hp: 38, guard: 15, dmg: 8,
                          flavor: "Slack water with something unfinished in it. It rises when " +
                                  "the moored remember, all at once, what they are waiting " +
                                  "for." },
      c3_breakwater:    { name: "The Breakwater's Warden", hp: 46, guard: 15, dmg: 9,
                          flavor: "The harbor's outer arm, given shape and standing orders. It " +
                                  "has held the line for ten thousand years against everything: " +
                                  "the tide, the moored, and reason." },
      c3_tenant_dread:  { name: "The Oldest Dread", hp: 55, guard: 16, dmg: 10,
                          flavor: "The fear of the first thing that ever finished, off its " +
                                  "chain at last. It is older than falling. It is what falling " +
                                  "was afraid of." },
    },

    // --------------------------------------------------------------- bridge
    bridge: {
      /* Chapter-2 flags whose memory Chapter 3 keeps. Everything else stays
         in the snapshot but does not follow the character out onto the
         Long Water. */
      flagCarryover: [
        // how chapter 2 ended
        "c2_final_tidemother", "c2_final_paid", "c2_final_rook",
        "c2_final_hearing", "c2_final_adrift", "c2_final_oshka",
        "crowned_oshka", "c2_final_vex", "c2_final_woven",
        "c2_final_last_harbor",
        // the state the coast was left in
        "c2_first_anchor", "c2_saved_shallows", "c2_refused_shallows",
        "c2_eel_pact", "c2_eel_tied", "c2_eel_ceded",
        "c2_bell_anchor", "c2_bell_rang",
        // the office, and your own outstanding paper
        "c2_rook_pact", "c2_rook_amended", "c2_rook_refused",
        "c2_bought_name", "c2_self_pledged",
        // companions' fates
        "c2_vex_freed", "c2_vex_brand_carried", "c2_quill_sent_away",
        "c2_quill_gone", "c2_page_read",
        // knowledge and deeds the water heard about
        "c2_knows_tidemother", "c2_marta_heard", "c2_paid_undertow",
        "c2_ninth_heard", "sold_lantern",
        // chapter-1 memory, still riding along
        "crowned_serra", "crowned_maeve", "crowned_hollow",
        "final_reforged", "final_claimed", "final_destroyed",
        "final_companion", "final_witness", "met_merchant",
      ],
      /* Gear crosses the chapter break; chapter-2 quest items stay behind —
         except the charm that hums near holdings, the coin the Lady always
         collects, the page nobody read aloud, and the lantern, which is
         still not done with you. */
      keepQuestItems: ["c2_knot_charm", "c2_tally_coin", "c2_ledger_page",
                       "soul_lantern"],
      /* Curated preset starts: a level-7 wanderer whose legend matches the
         settlement chosen at the bottom of the world — per-ending details
         on the opening scenes. */
      presetLevel: 7,
      presetBase: {
        stats: { might: 3, wits: 3, spirit: 3 },
        gold: 80,
        inventory: ["c2_knot_knife", "c2_kelp_weave", "c2_knot_charm",
                    "c2_brine_tonic", "poultice", "bread"],
        karma: 15,
        companions: {
          serra:  { met: true, in_party: false, approval: 30, alive: true },
          vex:    { met: true, in_party: false, approval: 25, alive: true },
          maeve:  { met: true, in_party: false, approval: 25, alive: true },
          hollow: { met: true, in_party: false, approval: 30, alive: true },
          oshka:  { met: true, in_party: false, approval: 30, alive: true },
          quill:  { met: true, in_party: false, approval: 25, alive: true },
        },
        flags: {},
      },
    },
  });
})(globalThis.HC);
