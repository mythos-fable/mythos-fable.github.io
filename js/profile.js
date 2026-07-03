/* Cross-chapter progress: which endings of which chapter this browser has
   discovered, and a full character snapshot taken at the moment each ending
   was reached. The snapshot is what a later chapter imports when the player
   continues from that ending; endings discovered before this store existed
   are migrated from the title-keyed map memory with a null snapshot, and the
   continuing chapter falls back to its hand-tuned preset for them.

   Snapshot policy: the latest run to reach an ending wins. Replaying an
   ending you already found refreshes its snapshot. */
(function (HC) {
  "use strict";

  const KEY = "mythos_fable_profile_v1";
  let cache = null;

  function store() {
    if (cache) return cache;
    let p = null;
    try { p = JSON.parse(localStorage.getItem(KEY)); } catch (e) { /* ignore */ }
    if (!p || typeof p !== "object") p = {};
    p.version = 1;
    p.chapters = p.chapters || {};
    cache = p;
    return p;
  }

  function persist() {
    try { localStorage.setItem(KEY, JSON.stringify(store())); } catch (e) { /* ignore */ }
  }

  function chapterEntry(chapterId) {
    const p = store();
    p.chapters[chapterId] = p.chapters[chapterId] || { endings: {} };
    return p.chapters[chapterId];
  }

  function recordEnding(chapterId, endingId, snapshotDict) {
    const endings = chapterEntry(chapterId).endings;
    endings[endingId] = {
      discovered_at: (endings[endingId] && endings[endingId].discovered_at)
        || new Date().toISOString(),
      snapshot: snapshotDict || (endings[endingId] && endings[endingId].snapshot) || null,
    };
    persist();
  }

  function endingsFor(chapterId) {
    return chapterEntry(chapterId).endings;
  }

  function hasEnding(chapterId, endingId) {
    return endingId in chapterEntry(chapterId).endings;
  }

  function snapshotFor(chapterId, endingId) {
    const e = chapterEntry(chapterId).endings[endingId];
    return (e && e.snapshot) || null;
  }

  /* A chapter with a fixed entry is always unlocked. A continuation chapter
     unlocks once any continuable ending (a key of entry.points — so never
     "death") of its source chapter is discovered. */
  function isUnlocked(chapterId) {
    const def = HC.getChapter(chapterId);
    if (!def) return false;
    if (def.entry.kind === "fixed") return true;
    const found = endingsFor(def.entry.from);
    return Object.keys(def.entry.points).some((endingId) => endingId in found);
  }

  /* One-time (but idempotent) import of pre-chapters progress: the old map
     memory recorded chapter-1 endings by TITLE; translate them to ids via
     the manifest and seed the profile with snapshot-less entries. Reads the
     map key directly so this works before HC.map is loaded. */
  function migrate() {
    const ch1 = HC.getChapter("ch1");
    if (!ch1) return;
    let mapMem = null;
    try { mapMem = JSON.parse(localStorage.getItem(ch1.mapKey)); } catch (e) { /* ignore */ }
    const titles = (mapMem && mapMem.endings) || {};
    const byTitle = {};
    for (const e of ch1.endings) byTitle[e.title] = e.id;
    const endings = chapterEntry("ch1").endings;
    let changed = false;
    for (const title of Object.keys(titles)) {
      const id = byTitle[title];
      if (id && !(id in endings)) {
        endings[id] = { discovered_at: null, snapshot: null };
        changed = true;
      }
    }
    if (changed) persist();
  }

  HC.profile = {
    KEY, recordEnding, endingsFor, hasEnding, snapshotFor, isUnlocked, migrate,
  };
})(globalThis.HC);
