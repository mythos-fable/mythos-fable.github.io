/* Chapter manifest: the single registry of every released chapter.
   Releasing a new chapter = add its story module files + script tags in
   index.html + one entry here (see RELEASING.md).

   Entry kinds:
     { kind: "fixed", scene }  — chapter starts at one scene (chapter 1).
     { kind: "continuation", from, points, importState, presetState }
        — chapter starts from a previous chapter's ending. `points` maps
          that chapter's ending scene ids to entry scenes here; an ending
          missing from `points` (e.g. "death") cannot be continued from.

   The `endings` table doubles as the title<->id mapping used to migrate
   pre-chapters map memory (title-keyed) into the id-keyed profile. */
(function (HC) {
  "use strict";

  HC.CHAPTERS = [
    {
      id: "ch1",
      number: 1,
      title: "The Hollow Crown",
      subtitle: "a tale of the dying god Vael",
      modules: ["prologue", "act1", "act2", "act3", "endings"],
      epilogue: "epilogue",
      thanks: "Thank you for playing The Hollow Crown.",
      entry: { kind: "fixed", scene: "intro" },
      // legacy keys from before chapters existed; later chapters use the
      // default mythos_fable_* scheme
      saveKey: "hollow_crown_save_v1",
      mapKey: "hollow_crown_map_v1",
      endings: [
        { id: "end_chained_god",  title: "The Chained God" },
        { id: "end_new_shepherd", title: "The Shepherd Who Visits" },
        { id: "end_tyrant",       title: "The Crown of Ash" },
        { id: "end_uneasy_god",   title: "The Uneasy God" },
        { id: "end_mortal_age",   title: "The Mortal Age" },
        { id: "end_serra",        title: "The Risen Shield" },
        { id: "end_maeve",        title: "The Open Library" },
        { id: "end_hollow_god",   title: "The Quiet Shepherd" },
        { id: "end_last_witness", title: "The Last Witness" },
        { id: "death",            title: "An Unmarked Grave", isDeath: true },
      ],
    },
    {
      id: "ch2",
      number: 2,
      title: "The Unwoven Shore",
      subtitle: "a tale of debts older than gods",
      modules: ["c2_openings", "c2_act1", "c2_act2", "c2_act3", "c2_endings"],
      epilogue: "c2_epilogue",
      thanks: "Thank you for playing The Unwoven Shore.",
      entry: {
        kind: "continuation",
        from: "ch1",
        points: {
          end_chained_god:  "c2_open_chained",
          end_new_shepherd: "c2_open_dawn",
          end_tyrant:       "c2_open_ash",
          end_uneasy_god:   "c2_open_grey",
          end_mortal_age:   "c2_open_mortal",
          end_serra:        "c2_open_serra",
          end_maeve:        "c2_open_maeve",
          end_hollow_god:   "c2_open_hollow",
          end_last_witness: "c2_open_witness",
        },
        importState: (snapshot, endingId) =>
          HC.story.c2_data.importState(snapshot, endingId),
        presetState: (endingId) =>
          HC.story.c2_data.presetState(endingId),
      },
      endings: [
        { id: "c2_end_tidemother",  title: "The New Tidemother" },
        { id: "c2_end_paid",        title: "The Debt Paid" },
        { id: "c2_end_rook",        title: "The Rook's Lien" },
        { id: "c2_end_hearing",     title: "The First Hearing" },
        { id: "c2_end_adrift",      title: "The Unmoored Shore" },
        { id: "c2_end_oshka",       title: "The Brine-Crowned" },
        { id: "c2_end_vex",         title: "The Forgiven Ledger" },
        { id: "c2_end_woven",       title: "The Woven Shore" },
        { id: "c2_end_last_harbor", title: "The Last Harbor" },
        { id: "death",              title: "Taken by the Tide", isDeath: true },
      ],
    },
  ];

  HC.getChapter = (id) => HC.CHAPTERS.find((c) => c.id === id) || null;

  HC.chapterAfter = function (id) {
    const idx = HC.CHAPTERS.findIndex((c) => c.id === id);
    return idx === -1 ? null : (HC.CHAPTERS[idx + 1] || null);
  };

  // memoized per-chapter scene dicts
  const cache = {};
  HC.buildChapterScenes = function (chapterId) {
    if (!cache[chapterId]) {
      const def = HC.getChapter(chapterId);
      if (!def) return null;
      cache[chapterId] = HC.buildScenes(def.modules);
    }
    return cache[chapterId];
  };

  /* The map's BFS roots: a fixed-entry chapter starts at its one scene; a
     continuation chapter has every entry point at layer zero. */
  HC.chapterMapSeeds = function (chapterId) {
    const def = HC.getChapter(chapterId);
    if (!def) return [];
    if (def.entry.kind === "fixed") return [def.entry.scene];
    return Object.values(def.entry.points);
  };
})(globalThis.HC);
