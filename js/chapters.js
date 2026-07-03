/* Chapter manifest: the single registry of every released chapter.

   Chapter 1 predates the pack format and stays hardcoded below (its legacy
   save/map keys and title<->id ending table must never change). Every later
   chapter is a pack: one file under js/story/packs/ calling
   HC.registerChapter(spec), plus optional part files calling
   HC.registerScenes(chapterId, SCENES). See CHAPTER_AUTHORING.md.

   Entry kinds:
     { kind: "fixed", scene }  — chapter starts at one scene (chapter 1).
     { kind: "continuation", from, points, importState, presetState }
        — chapter starts from a previous chapter's ending. `points` maps
          that chapter's ending scene ids to entry scenes here; an ending
          missing from `points` (e.g. "death") cannot be continued from.
   For packs the whole entry block is derived: `points` from the opening
   scenes' entry_from markers, import/preset from HC.bridge.makeEntry, and
   the endings table from the scenes bearing `ending:`.

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
  ];

  // ------------------------------------------------------- pack registry
  /* Packs register while their script tags load; finalizeChapters() (called
     at boot, and defensively by buildChapterScenes) derives the manifest
     entries once every part file has contributed its scenes. */
  const pending = {}; // chapter id -> { spec, scenes, openings }

  function assignNew(target, source, what, chapterId) {
    for (const key of Object.keys(source || {})) {
      if (key in target) {
        throw new Error(`${chapterId}: ${what} id '${key}' already exists`);
      }
      target[key] = source[key];
    }
  }

  HC.registerChapter = function (spec) {
    if (!Number.isInteger(spec.number) || spec.number < 2) {
      throw new Error("registerChapter: spec.number must be an integer >= 2");
    }
    const id = `ch${spec.number}`;
    if (HC.getChapter(id) || pending[id]) {
      throw new Error(`registerChapter: chapter '${id}' already registered`);
    }
    if (!spec.title) throw new Error(`${id}: pack needs a title`);
    if (!spec.bridge) throw new Error(`${id}: pack needs a bridge config`);
    if ((spec.bridge.flagCarryover || []).includes("ws")) {
      throw new Error(`${id}: 'ws' must not be in flagCarryover (set per chapter by the bridge)`);
    }

    assignNew(HC.COMPANION_DEFS, spec.companions, "companion", id);
    assignNew(HC.COMPANION_LINES, spec.companionLines, "companion lines", id);
    assignNew(HC.ITEMS, spec.items, "item", id);
    assignNew(HC.ENEMIES, spec.enemies, "enemy", id);

    HC.story = HC.story || {};
    const moduleName = `c${spec.number}_pack`;
    const scenes = {};
    HC.story[moduleName] = { SCENES: scenes };
    if (spec.epilogue) HC.story[`c${spec.number}_epilogue`] = spec.epilogue;

    pending[id] = { spec, scenes, openings: {} };
    if (spec.scenes) HC.registerScenes(id, spec.scenes);
  };

  HC.registerScenes = function (chapterId, SCENES) {
    const p = pending[chapterId];
    if (!p) {
      throw new Error(`registerScenes: unknown chapter '${chapterId}' `
        + "(its registerChapter pack file must load first)");
    }
    const { openings } = HC.dsl.compileScenes(chapterId, p.spec.number, SCENES);
    for (const sid of Object.keys(SCENES)) {
      if (sid in p.scenes) throw new Error(`${chapterId}: duplicate scene id '${sid}'`);
      p.scenes[sid] = SCENES[sid];
    }
    Object.assign(p.openings, openings);
  };

  /* Turn every pending pack into a full HC.CHAPTERS entry. Idempotent. */
  HC.finalizeChapters = function () {
    const ids = Object.keys(pending);
    if (!ids.length) return;

    for (const id of ids) {
      const { spec, scenes, openings } = pending[id];
      delete pending[id];

      const endings = [];
      for (const [sid, scene] of Object.entries(scenes)) {
        if ("ending" in scene) {
          endings.push(sid === "death"
            ? { id: sid, title: scene.ending, isDeath: true }
            : { id: sid, title: scene.ending });
        }
      }

      const points = {};   // prev ending id -> entry scene here
      const wsByEnding = {};
      const presets = {};
      for (const [sid, mark] of Object.entries(openings)) {
        if (mark.entry_from in points) {
          throw new Error(`${id}: two opening scenes for ending '${mark.entry_from}'`);
        }
        points[mark.entry_from] = sid;
        wsByEnding[mark.entry_from] = mark.ws;
        presets[mark.entry_from] = mark.preset;
      }

      const def = {
        id,
        number: spec.number,
        title: spec.title,
        subtitle: spec.subtitle || "",
        modules: [`c${spec.number}_pack`],
        thanks: spec.thanks || `Thank you for playing ${spec.title}.`,
        endings,
        continuation: { points, wsByEnding, presets },
        bridge: spec.bridge,
        entry: {
          kind: "continuation",
          from: spec.from || `ch${spec.number - 1}`,
          points,
        },
      };
      if (HC.story[`c${spec.number}_epilogue`]) {
        def.epilogue = `c${spec.number}_epilogue`;
      }
      const made = HC.bridge.makeEntry(def);
      def.entry.importState = made.importState;
      def.entry.presetState = made.presetState;

      HC.CHAPTERS.push(def);
    }
    HC.CHAPTERS.sort((a, b) => a.number - b.number);
  };

  // ------------------------------------------------------------- lookups
  HC.getChapter = (id) => HC.CHAPTERS.find((c) => c.id === id) || null;

  HC.chapterAfter = function (id) {
    const idx = HC.CHAPTERS.findIndex((c) => c.id === id);
    return idx === -1 ? null : (HC.CHAPTERS[idx + 1] || null);
  };

  // memoized per-chapter scene dicts
  const cache = {};
  HC.buildChapterScenes = function (chapterId) {
    HC.finalizeChapters();
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
