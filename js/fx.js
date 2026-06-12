/* Effect application, ported from engine.apply_fx in mythos/engine.py.
   Pure state mutation; all feedback goes through state.pushNotice and is
   rendered by the presenter between beats. */
(function (HC) {
  "use strict";

  function applyFx(state, fx) {
    if (fx === null || fx === undefined) return;
    if (typeof fx === "function") {
      fx = fx(state);
      if (fx === null || fx === undefined) return;
    }
    const p = state.player;
    if ("karma" in fx) {
      state.karma += fx.karma;
    }
    if ("gold" in fx) {
      p.gold = Math.max(0, p.gold + fx.gold);
      if (fx.gold > 0) state.pushNotice(`+${fx.gold} gold`, "gold");
      else state.pushNotice(`${fx.gold} gold`, "gold");
    }
    if ("hp" in fx) {
      p.hp = Math.max(0, Math.min(p.max_hp, p.hp + fx.hp));
      if (fx.hp < 0) state.pushNotice(`You take ${-fx.hp} damage (${p.hp}/${p.max_hp} HP)`, "hp-loss");
      else state.pushNotice(`You recover ${fx.hp} HP (${p.hp}/${p.max_hp} HP)`, "hp-gain");
    }
    if ("heal_full" in fx) {
      p.hp = p.max_hp;
      state.pushNotice(`You are fully rested (${p.hp}/${p.max_hp} HP)`, "hp-gain");
    }
    for (const iid of fx["items+"] || []) {
      p.inventory.push(iid);
      state.pushNotice(`Received: ${HC.ITEMS[iid].name}`, "item-gain");
    }
    for (const iid of fx["items-"] || []) {
      const idx = p.inventory.indexOf(iid);
      if (idx !== -1) {
        p.inventory.splice(idx, 1);
        state.pushNotice(`Lost: ${HC.ITEMS[iid].name}`, "item-loss");
      }
    }
    for (const [key, value] of Object.entries(fx.flags || {})) {
      state.flags[key] = value;
    }
    for (const [cid, delta] of Object.entries(fx.approval || {})) {
      state.changeApproval(cid, delta);
    }
    if ("recruit" in fx) {
      const cid = fx.recruit;
      const c = state.companions[cid];
      c.met = true;
      c.in_party = true;
      const cdef = HC.COMPANION_DEFS[cid];
      state.pushNotice(`${cdef.name}, ${cdef.title}, joins you`, "recruit");
    }
    if ("meet" in fx) {
      state.companions[fx.meet].met = true;
    }
    if ("leave" in fx) {
      const cid = fx.leave;
      if (state.companions[cid].in_party) {
        state.companions[cid].in_party = false;
        state.pushNotice(`${HC.COMPANION_DEFS[cid].name} leaves your company`, "leave");
      }
    }
    if ("kill_companion" in fx) {
      const cid = fx.kill_companion;
      state.companions[cid].alive = false;
      state.companions[cid].in_party = false;
    }
    if ("stat+" in fx) {
      const stat = fx["stat+"];
      p.stats[stat] = Math.min(5, p.stats[stat] + 1);
      state.pushNotice(`${stat[0].toUpperCase() + stat.slice(1)} increased to ${p.stats[stat]}`, "stat");
    }
    if ("stat-" in fx) {
      const stat = fx["stat-"];
      p.stats[stat] = Math.max(0, p.stats[stat] - 1);
      state.pushNotice(`${stat[0].toUpperCase() + stat.slice(1)} reduced to ${p.stats[stat]}`, "stat-loss");
    }
    if ("xp" in fx) {
      state.grantXp(fx.xp);
    }
  }

  HC.applyFx = applyFx;
})(globalThis.HC);
