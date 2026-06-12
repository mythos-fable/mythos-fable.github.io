/* Simple round-based combat, ported from mythos/combat.py.

   Player actions:
     attack — d20+2*Might vs enemy guard; damage = d6 + Might + weapon
     feint  — d20+2*Wits; success doubles your next hit and dodges this round
     invoke — d20+2*Spirit; success deals Spirit-fueled damage and steadies you (small heal)
     item   — use a consumable (the presenter picks which; consumes the round)
     flee   — d20+2*Wits vs enemy guard+2 (not always allowed)
   Companions each add their attack value in damage per round and occasionally interject.

   The blocking input loop becomes createCombat(): each act() call resolves one
   full round and returns log lines for the presenter to type out. */
(function (HC) {
  "use strict";

  HC.ENEMIES = {
    deserters:    { name: "Crayce's Deserters", hp: 18, guard: 12, dmg: 5,
                    flavor: "Three men in stripped Greyfield colors, hungry and past shame." },
    barrow_wight: { name: "Aldous, the First King", hp: 30, guard: 14, dmg: 7,
                    flavor: "A king of bronze and bone rises from the cairn-throne, " +
                            "crowned in verdigris, eyes like drowned stars." },
    pyre_guard:   { name: "The Pyre-Warden", hp: 26, guard: 13, dmg: 6,
                    flavor: "An Ember Cult champion in scorched plate, carrying a " +
                            "censer that weeps burning oil." },
    rook_killers: { name: "Mother Rook's Knives", hp: 24, guard: 13, dmg: 6,
                    flavor: "Two quiet professionals. They apologize, sincerely, " +
                            "before drawing." },
    ash_spawn:    { name: "The Ash-Spawn", hp: 28, guard: 13, dmg: 7,
                    flavor: "Grief given a body: a thing of cinders in the rough " +
                            "shape of everyone you have failed." },
    shepherd:     { name: "The Shepherd of Ash", hp: 45, guard: 15, dmg: 9,
                    flavor: "He wears a face you almost recognize — the god's pain, " +
                            "walking. Where he steps, the world forgets itself." },
    vex_hostile:  { name: "Vex, Bought and Sold", hp: 22, guard: 14, dmg: 6,
                    flavor: "You sold them back to Mother Rook. The brand on their " +
                            "wrist glows; their eyes do not." },
    queens_blades: { name: "The Regent's Blades", hp: 26, guard: 14, dmg: 7,
                    flavor: "The Queen Regent's household guard: lacquered brass, " +
                            "perfect drill, and orders that admit no shading." },
  };

  HC.COMPANION_LINES = {
    serra: ["Serra's blade traces a sunrise arc.", "Serra steps between you and the blow.",
            "\"Stand fast!\" Serra calls."],
    vex:   ["Vex appears behind the enemy, briefly and expensively.",
            "A knife you never saw thrown is suddenly somewhere important.",
            "\"This is the part I'm good at,\" Vex mutters."],
    maeve: ["Maeve speaks three words; the air forgets to hold its shape.",
            "Bog-light coils from Maeve's fingers.",
            "Maeve's shadow moves a half-second before she does."],
    hollow: ["Brother Hollow does not fight. He simply stands where the enemy must " +
             "look at what the world has done.", "Brother Hollow hums an old harvest " +
             "song; the enemy falters."],
  };

  function createCombat(state, enemyId) {
    const enemy = Object.assign({}, HC.ENEMIES[enemyId]);
    const p = state.player;
    const d = HC.dice.d;
    let feintPrimed = false;

    function companionsAndEnemyAct(log, dodging) {
      for (const cid of state.party()) {
        const cdef = HC.COMPANION_DEFS[cid];
        const cdmg = cdef.atk + d(4);
        enemy.hp -= cdmg;
        if (enemy.hp > 0 && HC.rng() < 0.4) {
          const lines = HC.COMPANION_LINES[cid];
          log.push({ text: lines[Math.floor(HC.rng() * lines.length)], kind: "companion" });
        }
      }
      if (enemy.hp > 0) {
        if (dodging) {
          log.push({ text: `${enemy.name} strikes at where you were.`, kind: "grey" });
        } else {
          const dmg = Math.max(1, enemy.dmg + d(4) - 2 - p.armorBonus());
          p.hp -= dmg;
          log.push({ text: `${enemy.name} hits you for ${dmg} damage.`, kind: "enemy" });
        }
      }
    }

    /* action: "attack" | "feint" | "invoke" | "item" | "flee"
       itemId: required for "item" (a consumable currently in inventory).
       Returns {log: [{text, kind}], over: bool, result?: "win"|"death"|"flee"} */
    function act(action, itemId) {
      const log = [];
      let dodging = false;

      if (action === "attack") {
        const raw = d(20);
        const roll = raw + 2 * p.stats.might;
        if (roll >= enemy.guard || raw === 20) {
          let dmg = d(6) + p.stats.might + p.weaponBonus();
          if (feintPrimed) {
            dmg *= 2;
            feintPrimed = false;
            log.push({ text: "Your feint pays off — the blow lands twice as hard!", kind: "good" });
          }
          enemy.hp -= dmg;
          log.push({ text: `You strike for ${dmg} damage.`, kind: "good" });
        } else {
          log.push({ text: "Your blow glances off.", kind: "miss" });
        }
      } else if (action === "feint") {
        if (d(20) + 2 * p.stats.wits >= enemy.guard) {
          feintPrimed = true;
          dodging = true;
          log.push({ text: "You slip aside, reading the enemy's stance. " +
                           "Your next attack is primed.", kind: "good" });
        } else {
          log.push({ text: "The enemy isn't fooled.", kind: "miss" });
        }
      } else if (action === "invoke") {
        if (d(20) + 2 * p.stats.spirit >= enemy.guard) {
          const dmg = d(6) + 2 * p.stats.spirit;
          enemy.hp -= dmg;
          const heal = Math.min(2, p.max_hp - p.hp);
          p.hp += heal;
          log.push({ text: `You call on something older than fear: ${dmg} damage, ` +
                           "and your wounds knit slightly.", kind: "spirit" });
        } else {
          log.push({ text: "The words scatter like startled birds.", kind: "miss" });
        }
      } else if (action === "item") {
        const idx = p.inventory.indexOf(itemId);
        if (idx === -1 || HC.ITEMS[itemId].kind !== "consumable") {
          return { log: [{ text: "You have nothing useful to hand.", kind: "miss" }], over: false, free: true };
        }
        p.inventory.splice(idx, 1);
        p.hp = Math.min(p.max_hp, p.hp + HC.ITEMS[itemId].power);
        log.push({ text: `You use the ${HC.ITEMS[itemId].name}. ` +
                         `(${p.hp}/${p.max_hp} HP)`, kind: "good" });
      } else if (action === "flee") {
        if (d(20) + 2 * p.stats.wits >= enemy.guard + 2) {
          log.push({ text: "You break away into the dark.", kind: "flee" });
          return { log, over: true, result: "flee" };
        }
        log.push({ text: "No way out — the enemy cuts off your retreat.", kind: "enemy" });
      }

      companionsAndEnemyAct(log, dodging);

      if (p.hp <= 0) {
        return { log, over: true, result: "death" };
      }
      if (enemy.hp <= 0) {
        log.push({ text: `${enemy.name} falls.`, kind: "victory" });
        return { log, over: true, result: "win" };
      }
      return { log, over: false };
    }

    return {
      enemy,
      get feintPrimed() { return feintPrimed; },
      act,
    };
  }

  HC.createCombat = createCombat;
})(globalThis.HC);
