/* Tiny predicate combinators so scene conditions read declaratively.
   Ported from mythos/story/helpers.py. */
(function (HC) {
  "use strict";

  const H = {
    inp: (cid) => (s) => s.inParty(cid),
    notp: (cid) => (s) => !s.inParty(cid),
    met: (cid) => (s) => s.companions[cid].met,
    not_met: (cid) => (s) => !s.companions[cid].met,
    appr: (cid, n) => (s) => s.approval(cid) >= n,
    has: (flag) => (s) => Boolean(s.flag(flag)),
    hasnt: (flag) => (s) => !s.flag(flag),
    item: (iid) => (s) => s.hasItem(iid),
    no_item: (iid) => (s) => !s.hasItem(iid),
    gold: (n) => (s) => s.player.gold >= n,
    bg: (b) => (s) => s.player.background === b,
    karma_ge: (n) => (s) => s.karma >= n,
    karma_le: (n) => (s) => s.karma <= n,
    all_of: (...preds) => (s) => preds.every((p) => p(s)),
    any_of: (...preds) => (s) => preds.some((p) => p(s)),
  };

  /* Companions whose patience has run out leave at camp. Returns farewell text. */
  H.camp_departures = function (state, threshold) {
    if (threshold === undefined) threshold = -40;
    const lines = [];
    const farewells = {
      serra: "Serra packs in silence. At the edge of the firelight she pauses. " +
             "\"I followed you because I hoped you were better than the people who " +
             "broke me. You are not.\" She does not look back.",
      vex: "In the morning, Vex is gone. So is a tenth of your gold — precisely a " +
           "tenth, counted out, the rest untouched. A professional's farewell. A " +
           "note reads: 'Severance. -V'",
      maeve: "Maeve unhooks her charms from your packs one by one. \"I have buried " +
             "better people than you, and burned worse,\" she says. \"I no longer " +
             "know which grave I'd dig for yours.\" The mire-light follows her out.",
      hollow: "Brother Hollow stands a long while at the fire. \"Even the Hollowed " +
              "remember kindness,\" he says softly. \"I waited to feel it from you. " +
              "I am done waiting.\" He walks into the grey.",
    };
    for (const cid of state.party()) {
      if (state.approval(cid) <= threshold) {
        state.companions[cid].in_party = false;
        lines.push(farewells[cid]);
      }
    }
    return lines.length ? lines.join("\n\n") + "\n\n" : "";
  };

  HC.helpers = H;
})(globalThis.HC);
