/* Story registry: merges a chapter's modules into one scene graph.
   Story modules register themselves on HC.story.<name>.SCENES as they load;
   missing modules are tolerated so the selftest can validate partial ports.
   Called with no argument it builds chapter 1 (the original behavior, kept
   so selftest --dump / crosscheck stay byte-compatible with the Python game). */
(function (HC) {
  "use strict";

  HC.story = HC.story || {};
  HC.STORY_MODULES = ["prologue", "act1", "act2", "act3", "endings"];

  HC.buildScenes = function (moduleNames) {
    const names = moduleNames || HC.STORY_MODULES;
    const scenes = {};
    for (const name of names) {
      const module = HC.story[name];
      if (!module || !module.SCENES) continue;
      for (const sid of Object.keys(module.SCENES)) {
        if (sid in scenes) throw new Error(`Duplicate scene id: ${sid}`);
        scenes[sid] = module.SCENES[sid];
      }
    }
    return scenes;
  };

  HC.loadedStoryModules = function () {
    return HC.STORY_MODULES.filter((n) => HC.story[n] && HC.story[n].SCENES);
  };
})(globalThis.HC);
