/* d20 checks. Simple rules: d20 + 2*stat vs DC. Nat 20 always passes, nat 1 always fails.
   All randomness flows through HC.rng so the selftest can seed it. */
(function (HC) {
  "use strict";

  HC.rng = Math.random; // injectable

  const STAT_NAMES = { might: "Might", wits: "Wits", spirit: "Spirit" };

  function d(sides) {
    return Math.floor(HC.rng() * sides) + 1;
  }

  /* Returns a structured roll result; the presenter renders it, nothing prints here. */
  function check(state, stat, dc) {
    const roll = d(20);
    const bonus = 2 * state.player.stats[stat];
    const total = roll + bonus;
    let success;
    if (roll === 20) success = true;
    else if (roll === 1) success = false;
    else success = total >= dc;
    return {
      stat, statName: STAT_NAMES[stat], dc, roll, bonus, total, success,
      crit: roll === 20, fumble: roll === 1,
    };
  }

  HC.dice = { d, check, STAT_NAMES };
})(globalThis.HC);
