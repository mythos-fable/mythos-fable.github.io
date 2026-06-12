/* Item catalog. kind: weapon (power = attack bonus), armor (power = damage soak),
   consumable (power = healing), quest (story keys, sometimes sellable). */
(function (HC) {
  "use strict";

  HC.ITEMS = {
    // --- weapons ---
    "rusted_sword":   { name: "Rusted Shortsword", kind: "weapon", power: 1,
                        desc: "Standard issue of the Greyfield levies. The rust might be blood." },
    "quill_knife":    { name: "Scribe's Quill-Knife", kind: "weapon", power: 1,
                        desc: "Made for trimming quills. It trims other things too." },
    "gutter_shiv":    { name: "Gutter Shiv", kind: "weapon", power: 1,
                        desc: "A nail, a rag handle, and a great deal of practice." },
    "soldiers_blade": { name: "Soldier's Blade", kind: "weapon", power: 2,
                        desc: "Plain, balanced, honest steel." },
    "barrow_sword":   { name: "Sword of the First King", kind: "weapon", power: 4,
                        desc: "Bronze that never tarnished. It hums in the presence of oaths." },
    "wyrmglass_dagger": { name: "Wyrmglass Dagger", kind: "weapon", power: 3,
                        desc: "Black glass that drinks the light. The Pale Merchant smiled when he sold it." },
    "ember_brand":    { name: "Ember Brand", kind: "weapon", power: 3,
                        desc: "A cultist's sword, still warm. It whispers about cleansing." },

    // --- armor ---
    "leather_jerkin": { name: "Leather Jerkin", kind: "armor", power: 1,
                        desc: "Smells of the road and other people's campfires." },
    "shield_cloak":   { name: "Dawnward Travel-Cloak", kind: "armor", power: 2,
                        desc: "Grey wool, sun-and-shield clasp. A gift that means something." },
    "rook_mail":      { name: "Rookery Mail", kind: "armor", power: 3,
                        desc: "Blackened rings, silent as a held breath. Mother Rook outfits her own." },

    // --- consumables ---
    "bread":          { name: "Travel Bread", kind: "consumable", power: 4,
                        desc: "Dense enough to stop an arrow. Restores a little strength." },
    "poultice":       { name: "Herbal Poultice", kind: "consumable", power: 8,
                        desc: "Maeve's recipe: moss, honey, and three words said backwards." },
    "elixir":         { name: "Pale Elixir", kind: "consumable", power: 15,
                        desc: "Tastes of winters you never lived through. Heals deeply." },

    // --- quest items ---
    "soul_lantern":   { name: "Soul-Lantern of Ashfen", kind: "quest", power: 0,
                        desc: "The gathered last breaths of a burned village. It glows when you lie." },
    "crown_shard_1":  { name: "Crown Shard (Barrow)", kind: "quest", power: 0,
                        desc: "A sliver of the Hollow Crown. Holding it, you can hear the world breathing." },
    "crown_shard_2":  { name: "Crown Shard (Pyre)", kind: "quest", power: 0,
                        desc: "A sliver of the Hollow Crown, hot to the touch. It dreams of fire." },
    "grimoire":       { name: "Maeve's Grimoire", kind: "quest", power: 0,
                        desc: "Heretical marginalia in four hands. Two of the hands are dead." },
    "debt_ledger":    { name: "Mother Rook's Ledger", kind: "quest", power: 0,
                        desc: "Names, debts, and brands. Vex's name is underlined twice." },
    "crayce_letters": { name: "Commander Crayce's Letters", kind: "quest", power: 0,
                        desc: "Orders for the Greyfield massacre, sealed and signed. Proof." },
    "sister_locket":  { name: "Maeve's Locket", kind: "quest", power: 0,
                        desc: "Cold silver. Something inside it turns over in its sleep." },
    "barrow_oath":    { name: "Oath-Knot of the First King", kind: "quest", power: 0,
                        desc: "A cord of bronze wire tied in a knot no living hand could make." },
    "writ_regent":    { name: "The Queen Regent's Writ", kind: "quest", power: 0,
                        desc: "Safe passage, royal favor, and a debt you will be asked to repay." },
  };

  HC.itemName = function (itemId) { return HC.ITEMS[itemId].name; };
})(globalThis.HC);
