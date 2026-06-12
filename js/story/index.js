/* Story registry: merges every act's scenes into one graph.
   Story modules register themselves on HC.story.<name>.SCENES as they load;
   missing modules are tolerated so the selftest can validate partial ports. */
(function (HC) {
  "use strict";

  HC.story = HC.story || {};
  HC.STORY_MODULES = ["prologue", "act1", "act2", "act3", "endings"];

  HC.buildScenes = function () {
    const scenes = {};
    for (const name of HC.STORY_MODULES) {
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
