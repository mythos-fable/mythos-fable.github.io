/* Game state: player, companions, flags, karma.
   Ported from mythos/state.py. Differences from the terminal version:
   - ui.notice() calls become a notice buffer (state.pushNotice / drainNotices)
     that the presenter renders between beats.
   - level-up stat choice can't block for input; it increments pendingStatPicks
     and the presenter shows a stat-pick panel before the next scene.
   - persistence lives in save.js (localStorage), but to_dict/from_dict keep the
     exact JSON shape of savegame.json (version 1). */
(function (HC) {
  "use strict";

  const XP_THRESHOLDS = [0, 100, 250, 450, 700, 1000, 1400, 1900]; // cumulative xp per level

  const COMPANION_DEFS = {
    serra: {
      name: "Serra Valebright",
      title: "the Oathbroken Shield",
      atk: 4,
      desc: "A knight of the Dawnward Shield, cast out for a massacre she did not " +
            "order. She still polishes the sun-sigil she is forbidden to wear.",
    },
    vex: {
      name: "Vex",
      title: "the Debt-Branded",
      atk: 3,
      desc: "A thief with quick hands, a quicker mouth, and Mother Rook's brand " +
            "burning on one wrist. Trusts you about as far as the next job.",
    },
    maeve: {
      name: "Maeve of the Mire",
      title: "the Twice-Burned Witch",
      atk: 3,
      desc: "A bog-witch and heretic scholar who has read books the gods tried to " +
            "burn. Wears her dead sister around her neck.",
    },
    hollow: {
      name: "Brother Hollow",
      title: "the Man Who Remained",
      atk: 2,
      desc: "A Hollowed man who somehow kept his mind. Grey-skinned, soft-spoken, " +
            "and living proof that the Withered are still people.",
    },
  };

  /* color names map to CSS classes (c-green, c-cyan, ...) */
  const APPROVAL_TIERS = [
    [60, "Devoted", "green"],
    [25, "Trusted", "green"],
    [10, "Warm", "cyan"],
    [-9, "Neutral", "grey"],
    [-24, "Wary", "yellow"],
    [-49, "Cold", "red"],
    [-999, "Hostile", "red"],
  ];

  function approvalTier(value) {
    for (const [threshold, label, color] of APPROVAL_TIERS) {
      if (value >= threshold) return [label, color];
    }
    return ["Hostile", "red"];
  }

  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  class Player {
    constructor() {
      this.name = "Stranger";
      this.background = null; // "veteran" | "scribe" | "gutterborn"
      this.stats = { might: 1, wits: 1, spirit: 1 };
      this.level = 1;
      this.xp = 0;
      this.max_hp = 20;
      this.hp = 20;
      this.gold = 10;
      this.inventory = []; // item ids, duplicates allowed
    }

    weaponBonus() {
      const powers = this.inventory.filter((i) => HC.ITEMS[i].kind === "weapon")
        .map((i) => HC.ITEMS[i].power);
      return powers.length ? Math.max(...powers) : 0;
    }

    armorBonus() {
      const powers = this.inventory.filter((i) => HC.ITEMS[i].kind === "armor")
        .map((i) => HC.ITEMS[i].power);
      return powers.length ? Math.max(...powers) : 0;
    }
  }

  class GameState {
    constructor() {
      this.player = new Player();
      this.chapter = "ch1";
      this.scene = "intro";
      this.entered = null; // scene whose on_enter has already fired
      this.karma = 0;
      this.flags = {};
      this.companions = {};
      for (const cid of Object.keys(COMPANION_DEFS)) {
        this.companions[cid] = { met: false, in_party: false, approval: 0, alive: true };
      }
      this.ending = null;
      this.path = [];           // ordered scene ids walked this run (for the map)
      this.notices = [];        // buffered mechanical feedback for the presenter
      this.pendingStatPicks = 0; // level-ups awaiting a stat choice
    }

    // ----- convenience -----
    flag(key) { return this.flags[key]; }
    hasItem(itemId) { return this.player.inventory.includes(itemId); }
    inParty(cid) {
      const c = this.companions[cid];
      return c.in_party && c.alive;
    }
    party() { return Object.keys(COMPANION_DEFS).filter((cid) => this.inParty(cid)); }
    approval(cid) { return this.companions[cid].approval; }

    // snake_case aliases so story lambdas translate 1:1 from the Python source
    has_item(itemId) { return this.hasItem(itemId); }
    in_party(cid) { return this.inParty(cid); }
    change_approval(cid, delta) { return this.changeApproval(cid, delta); }

    // ----- notices -----
    pushNotice(text, kind) { this.notices.push({ text, kind: kind || "info" }); }
    drainNotices() { const out = this.notices; this.notices = []; return out; }

    // ----- effects -----
    grantXp(amount) {
      this.player.xp += amount;
      this.pushNotice(`+${amount} XP`, "xp");
      while (this.player.level < XP_THRESHOLDS.length
             && this.player.xp >= XP_THRESHOLDS[this.player.level]) {
        this.levelUp();
      }
    }

    levelUp() {
      const p = this.player;
      p.level += 1;
      p.max_hp += 5;
      p.hp = Math.min(p.max_hp, p.hp + 10);
      this.pushNotice(`You have reached level ${p.level}! (+5 max HP)`, "levelup");
      this.pendingStatPicks += 1;
    }

    applyStatPick(stat) {
      this.player.stats[stat] += 1;
      this.pushNotice(`${cap(stat)} is now ${this.player.stats[stat]}`, "stat");
      this.pendingStatPicks = Math.max(0, this.pendingStatPicks - 1);
    }

    changeApproval(cid, delta) {
      const c = this.companions[cid];
      if (!c.met || !c.alive) return;
      c.approval = Math.max(-100, Math.min(100, c.approval + delta));
      const name = COMPANION_DEFS[cid].name.split(" ")[0];
      if (!c.in_party) return;
      if (delta >= 8) this.pushNotice(`${name} greatly approves (+${delta})`, "approval-up");
      else if (delta > 0) this.pushNotice(`${name} approves (+${delta})`, "approval-up");
      else if (delta <= -8) this.pushNotice(`${name} greatly disapproves (${delta})`, "approval-down");
      else if (delta < 0) this.pushNotice(`${name} disapproves (${delta})`, "approval-down");
    }

    // ----- persistence (shape identical to the Python savegame.json) -----
    toDict() {
      const p = this.player;
      return {
        version: 2,
        chapter: this.chapter,
        scene: this.scene,
        entered: this.entered,
        path: this.path,
        karma: this.karma,
        flags: this.flags,
        companions: this.companions,
        player: {
          name: p.name, background: p.background, stats: p.stats,
          level: p.level, xp: p.xp, max_hp: p.max_hp, hp: p.hp,
          gold: p.gold, inventory: p.inventory,
        },
      };
    }

    static fromDict(data) {
      const s = new GameState();
      s.chapter = data.chapter || "ch1"; // version-1 payloads predate chapters
      s.scene = data.scene;
      s.entered = data.entered !== undefined ? data.entered : null;
      s.path = Array.isArray(data.path) ? data.path : [];
      s.karma = data.karma;
      s.flags = data.flags;
      // overlay onto the constructor's defaults so companions added in later
      // chapters exist even when loading an older save
      Object.assign(s.companions, data.companions);
      const pd = data.player;
      const p = s.player;
      p.name = pd.name; p.background = pd.background;
      p.stats = pd.stats; p.level = pd.level; p.xp = pd.xp;
      p.max_hp = pd.max_hp; p.hp = pd.hp; p.gold = pd.gold;
      p.inventory = pd.inventory;
      return s;
    }
  }

  HC.Player = Player;
  HC.GameState = GameState;
  HC.COMPANION_DEFS = COMPANION_DEFS;
  HC.APPROVAL_TIERS = APPROVAL_TIERS;
  HC.approvalTier = approvalTier;
  HC.XP_THRESHOLDS = XP_THRESHOLDS;
})(globalThis.HC);
