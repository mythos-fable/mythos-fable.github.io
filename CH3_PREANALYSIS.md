# Chapter 3 Pre-Analysis

Working notes distilled from a full read of Chapters 1–2 (`js/story/*`,
`js/story/c2/*`, `js/story/packs/ch2.js`) and `CHAPTER_AUTHORING.md`.
Purpose: everything Chapter 3 must honor, connect to, or decide, in one
place, before a word of it is written.

---

## 1. Where the story stands

**Chapter 1 (The Hollow Crown, inland):** the woven world, Vael's loom, the
burned village Ashfen, the soul-lantern, the Millrun bridge, Greyfield,
Mother Rook's debt-office, the Pale Merchant. It ended with 9 fates for the
Crown: rebound on Vael, claimed by the player (kind/cruel/balanced), given
to Serra/Maeve/Hollow, destroyed (mortal age), or the world unmade (last
witness).

**Chapter 2 (The Unwoven Shore, the Mourncoast):** a coast that was never
woven, moored instead by the Tidemother's Nine Anchors — collateral on the
**First Debt**, the note by which "That Which Would Be" (the First Debtor)
borrowed its existence. Revealed structure of the note: Borrower (the
Debtor, who *asked* for a price it could believe in), Surety (the
Tidemother, who knelt in the deep holding it for 4,000 years and is now a
cracking salt figure), Clerk (Mother Rook, who drafted it at the Borrower's
instruction and administered it without fee ever since). The chapter ends
at the Great Ebb: the whole coast walks down the naked seafloor to the
Ninth Anchor and the player chooses the settlement.

**Core theme engine:** *holding*. Every chapter re-frames it — ch1: weaving
/ crowns (who holds the world), ch2: mooring / debt (what holding costs and
who pays). Recurring thesis lines: "a knot is attention that holds",
"attention is love with its sleeves rolled up", "the cost of existing is
nothing; the price of believing it is each other." **Chapter 3 needs a
third lens on holding** — candidates in §8.

---

## 2. The nine Chapter 2 endings (ch3's required entry points)

Every opening scene of ch3 needs `entry_from` + `ws` + `preset`, one per
ending below (validator enforces full coverage). Scene ids from
`js/story/c2/endings.js`; the flag each ending sets is what ch3 can read.

| ch2 ending scene | Title | Flag set | World it leaves behind |
|---|---|---|---|
| `c2_end_tidemother` | The New Tidemother | `c2_final_tidemother` | **The player** holds the Nine — the first holder who does not hold alone (witnessed, sung to). The salt mother rose and departed. |
| `c2_end_paid` | The Debt Paid | `c2_final_paid` | The player paid the principal out of what they are (godhead / catalogue / life's worth, by ws). The Debtor is now a free "tenth power," a shy solvent **neighbor**. The Nine untied themselves; the salt mother discharged and gone. |
| `c2_end_rook` | The Rook's Lien | `c2_final_rook` | Rook's office novated the whole note: the coast is alive, moored in "black glaze and perfect records," every wrist held by paper. Nobody sings. |
| `c2_end_hearing` | The First Hearing | `c2_final_hearing` | The Nine became a **commons**; the Debtor a member, not a principal; a standing public Session where the held read the terms of their holding and object. |
| `c2_end_adrift` | The Unmoored Shore | `c2_final_adrift` | The Knot-Knife cut the Nine's signatures; the whole coast **sailed off the edge of every chart**, a country under sail with the Debtor aboard as jointly-held estate. The world keeps a coastline-shaped absence. |
| `c2_end_oshka` | The Brine-Crowned | `c2_final_oshka`, `crowned_oshka` | Oshka tied herself in — CORDED, not crowned; she is everywhere the song is. Coast tuned, Debtor eased into the chord. Her boat-hook hangs on two pegs in the knotworks. |
| `c2_end_vex` | The Forgiven Ledger | `c2_final_vex` | Vex holds the black book; the office forgives strategically, publicly, "ruinously by every actuarial standard" — and it holds. Mother Rook retires, seen years later at a fish-stall looking decades younger. |
| `c2_end_woven` | The Woven Shore | `c2_final_woven` | The coast consented and the seam opened **from inside**: the shore was taken into the weave knot by knot, the Debtor's account assumed by the god of the woven world. The unwoven margin no longer exists. |
| `c2_end_last_harbor` | The Last Harbor | `c2_final_last_harbor` | (Only reachable from ws `unmade`.) The Debtor took root in the shore-soil of a dead creation; the **Last Harbor** is the first port of a world starting over. The Merchant opened VOLUME TWO; the player is invited as first witness of a beginning. |
| `death` | Taken by the Tide | `final_death` | (No opening needed — death endings are excluded.) |

**Availability quirks that shape openings:** `c2_end_woven` only occurs in
god world-states (vael / you_* / serra / maeve / hollow); `c2_end_last_harbor`
only in `unmade`. The other seven can occur under *any* ch2 ws — so those
seven openings must not assume anything about who (if anyone) rules the
inland world.

**Suggested ch3 `ws` slugs** (final call at authoring time):
`tide_you`, `paid`, `lien`, `commons`, `adrift`, `corded`, `forgiven`,
`woven`, `harbor`. Useful groupings to define as local predicates (NOT in
`HC.helpers` — ch2's `ws_god` etc. are grandfathered, ch3 must go local or
DSL): "coast-still-holds" (`tide_you/corded/commons/forgiven/paid`) vs
"coast transformed" (`lien`) vs "coast gone from the world"
(`adrift/woven/harbor`).

---

## 3. The setting problem (the one big design decision)

Chapter 2 solved "nine incompatible ch1 endings" by moving to a place
**outside their blast radius**: a shore no god or loom could reach, so all
nine inland outcomes could coexist as backstory. Chapter 3 has it harder:
three ch2 endings *remove or transform the stage itself* (adrift: coast
leaves the world; woven: coast absorbed; harbor: whole new creation).

So ch3 needs a stage that plausibly exists **after all nine settlements**.
Threads the text has already planted that point somewhere every ending can
reach:

- **Where the Tidemother went.** "Her going is a tide all its own"; "gone —
  ask me not where; that page was eaten before my time"; "goes wherever
  paid sureties go." A place/sea/afterward of *spent holders* works from
  every ending.
- **The Merchant's road.** His ch2 epilogue closer (fires in ALL endings):
  "something is always coming due somewhere, and business has honestly
  never been better." He can drive the frame to any next stage — he already
  did exactly that for the `unmade` opening.
- **The open water / OUT.** The adrift coast sails it; the Drowned Watch
  bell rings "down the long water"; sailors report "a light that is nine
  lights" hull-down on the horizon. A chapter at sea (or under it, or
  between worlds' waters) can receive arrivals from every ending.
- **The eaten pages.** Two separate self-censoring documents: the treaty
  page eaten out of Maeve's ledger, and the page-71 itemization "nine knots
  deep" that Tally-of-Welt "will not read aloud at ebb-tide over open
  water." Whatever those conceal predates and outranks the First Debt —
  natural ch3 antagonist/mystery material.
- **The other eight-and-more creditors.** "Local sureties subsumed" — the
  Eel-Mother was one of a *list*. Old holders "rising as the Nine fail" in
  every marsh, sound, and cove. This generalizes beyond the Mourncoast.

Whatever is chosen, keep the ch2 trick: openings (3–5 scenes each) that
dramatize the player's specific ending-world, then **converge on one gate
scene** (ch2's `c2_saltmere_gate`), with a ws-keyed tail on the gate text.

---

## 4. Bridge config: what ch3 should carry

### 4.1 Flag carryover candidates (from the ch2 save)

The ch2 flags a ch3 `bridge.flagCarryover` should list (grouped; trim at
authoring time — ch2 carried ~25 from ch1):

- **How ch2 ended (all nine):** `c2_final_tidemother`, `c2_final_paid`,
  `c2_final_rook`, `c2_final_hearing`, `c2_final_adrift`, `c2_final_oshka`,
  `crowned_oshka`, `c2_final_vex`, `c2_final_woven`, `c2_final_last_harbor`.
- **State of the Anchors/coast:** `c2_first_anchor` (values `"tied"` /
  `"slipping"` / `"slipped"` — note: a **string** flag, not boolean),
  `c2_saved_shallows`, `c2_refused_shallows`, `c2_eel_pact`, `c2_eel_tied`,
  `c2_eel_ceded`, `c2_bell_anchor` (`"tied"` / `"partial"`), `c2_bell_rang`.
- **Rook relationship:** `c2_rook_pact`, `c2_rook_amended`,
  `c2_rook_refused`, `c2_bought_name`, `c2_self_pledged` (⚠ the player's
  own **one-season name-lien** — a loaded gun ch3 should fire).
- **Companion outcomes:** `c2_vex_freed`, `c2_vex_kept_distant`,
  `c2_vex_brand_carried` (Vex-dead route), `c2_quill_sent_away`,
  `c2_quill_gone` (Quill abandoned in the alley — likely dead),
  `c2_oshka_solo`, `c2_page_read`.
- **Knowledge/deeds the world heard about:** `c2_knows_tidemother`,
  `c2_marta_heard`, `c2_paid_undertow`, `c2_ninth_heard`, `sold_lantern`.
- **Opening-gift keepsakes (from ch2's own openings):** `c2_serra_whetstone`,
  `c2_serra_button`, `c2_hollow_lamp`, `c2_hollow_ladle`, `c2_god_memory`,
  `c2_god_folded`, `c2_charter`, `c2_maeve_letter`, `c2_merchant_brought`.
  Note: paying the Undertow's toll can have set a gift flag to `false`.
- **Still-live ch1 flags worth re-carrying** (they're in the save; listing
  them keeps them "remembered"): `crowned_serra`, `crowned_maeve`,
  `crowned_hollow`, `final_reforged`, `final_claimed`, `final_destroyed`,
  `final_companion`, `final_witness`, `met_merchant`.

⚠ **Lost information:** `ws` itself is never carried (bridge rule). The ch2
ws distinguished `you_dawn` / `you_ash` / `you_grey`, but all three set only
`final_claimed` — after ch2, *flavor of the player's inland godhood is not
recoverable from flags* (only karma hints at it). If ch3 cares (e.g. the
`paid` opening: what the player paid differed by ws — godhead vs catalogue
vs deeds), either accept the ambiguity and write around it (karma-keyed
variants are the honest option) or don't lean on it.

### 4.2 Items

- **Gear crosses automatically.** Live ch2 gear the writing can reference:
  `c2_knot_knife` (power 3 — *the* heresy blade; note it was **consumed
  thematically** in the adrift ending — fine mechanically, but don't have
  the adrift opening celebrate still having it), `c2_anchor_pick` (4),
  `c2_boat_hook`, `c2_corvid_beak`, `c2_rook_feathers`, `c2_kelp_weave`,
  `c2_oilskin`, plus ch1 gear.
- **`keepQuestItems` candidates:** `c2_knot_charm` (the last First-Knot
  charm — warms near Anchors; ideal recurring compass), `c2_tally_coin`
  (Rook's marker: "she always collects"), `c2_ledger_page` (page 71 — its
  unread itemization is live ammunition), `c2_tide_psalter` (defined in the
  manifest but **never granted in ch2 scenes** — Oshka keeps the cord; safe
  to ignore or to finally hand over in ch3), `soul_lantern` (only if not
  sold; it crossed one break already — "it is not done with you").
- **Drop:** nothing obviously needs `dropItems`.

### 4.3 Preset ("as the legends tell it")

- `presetLevel: 7` (ch2 used 6; XP table caps at level 8 / 1900 xp — do
  **not** exceed without extending `XP_THRESHOLDS` in `js/state.js`).
- `presetBase` shape mirroring ch2's: stats ~3/3/3, gold ~80, inventory
  drawn from ch2 gear + consumables, companions block now includes
  **oshka and quill** (met, not in party, approval ~25) alongside the ch1
  four; per-ending overrides on opening scenes (e.g. `tide_you` preset
  should feel like the New Tidemother's legend: high karma, `c2_first_anchor:
  "tied"`, `c2_saved_shallows: true`; `lien` preset: `c2_rook_pact`, colder
  karma; `forgiven`: `c2_vex_freed: true`; etc.).
- Remember: preset top-level blocks **replace**, not merge.

---

## 5. Cast inventory (who can show up, and in what state)

**Companions (mechanical):**
- ch1: Serra (atk 4), Vex (3), Maeve (3), Hollow (2) — any may be crowned
  god, alive-and-mortal, or dead depending on flags. Serra/Maeve/Hollow as
  gods **cannot enter unwoven space** (unless ws `woven` erased that rule).
- ch2: Oshka (3) — *unavailable as companion* in `corded` ws (she IS the
  holding); Quill (2) — possibly dead (`c2_quill_gone`) or sent inland.
- Convention says ch3 adds **2 new recruitable companions** with
  `companionLines` combat quips (3 apiece, comic-deadpan register).
- Camp scene uses `HC.helpers.camp_departures(s)` (auto-leave at approval
  ≤ −40); ch2 gated its best ending choice on `approval("oshka") >= 40` —
  keep approval mattering at the finale.

**Powers and fixtures:**
- **The Pale Merchant** — appears in all three chapters; buys endings,
  findings, prior arrangements; sells context; *always gets the last word
  in the epilogue*. In `harbor` he has VOLUME TWO and offered the player
  "colleague." His unclosed-account motif is ch3's cheapest reliable engine.
- **Mother Rook** — fate varies hugely by ending: still executor-monarch
  (`lien`), retired and young (`forgiven`), amended-and-bound
  (`c2_rook_amended`), or simply enduring ("settlements end, but the office
  endures"). Four thousand years old; drafted the First Debt; wears wool.
- **The First Debtor** — now: the player's held charge (`tide_you`), a free
  neighbor (`paid`), a commons member (`commons`), an unmoored estate at
  sea (`adrift`), a chord-note (`corded`), a negotiating counterparty
  (`forgiven`/`lien`), assumed into the weave (`woven`), or the root-stock
  of a new world (`harbor`).
- **The Tidemother** — risen/discharged/departed in most endings; her
  destination is deliberately unwritten. The Tenth Song. Biggest open door.
- **The Eel-Mother & the other "local sureties"** — a co-signed creditor
  (if `c2_eel_pact`), or a possessive holder of a lost village
  (`c2_eel_ceded`), or an argued-with power in the deep channels.
- **The Drowned Watch** (post-captain with pipe and sou'wester; the cracked
  bell; the standing empty post "an open invitation to warm hands of good
  faith" if `c2_bell_anchor: "partial"`), **Dagny** the harbormaster (never
  speaks to you again if `c2_first_anchor: "slipped"`), **the Salt Reeve**,
  **Wide Marta** and her shortened knot, **Tally-of-Welt** the blind
  cord-script scribe, **Bray** the line-watcher (vael route only,
  `c2_met_bray`), **the child lantern-line singer** in the Drowned Market
  ("the coast is still making singers"), **the gods behind the seam** —
  Vael, or the player's witnesses, or Serra/Maeve/Hollow, per old ws flags.

---

## 6. Structure & scale template (the shape chapters 1–2 set)

- **~9 real endings + `death`** (both chapters did exactly 9). Ending scene
  ids `c3_end_*`; `death` scene is mandatory; ending titles form the table;
  **definition order = picker order**.
- **Flow:** 9 openings (3–5 scenes each, `entry_from`/`ws`/`preset` markers)
  → one convergence gate with ws-keyed text tails → a town/hub with 4–6
  visitable threads gated by `c3_*_done` flags → a mid-act hub (ch2: the
  Drowned Market) with shop + faction table + 2 field expeditions + 2
  companion personal quests + camp → a point-of-no-return muster (ch2: the
  Great Ebb, with `heal_full`) → finale gauntlet (toll-gate obstacle,
  revelation terrace, antagonist parley) → **one `c3_final_choice` scene**
  whose 5–9 choices fan out to the endings, several gated (`when:`) by
  items/companions/approval/knowledge flags, plus a fail-forward check
  route (ch2's `c2_tie_fail` → death or lesser endings).
- **Epilogue:** composer function reflecting 6–8 mid-chapter flags plus the
  Merchant's last word; assign as `HC.story.c3_epilogue` or `epilogue:` in
  the manifest.
- **Scale:** ch2 ≈ 5,250 lines across 5 files, ~100 scenes. Pack layout for
  ch3: `js/story/packs/ch3.js` (manifest) + `ch3-openings.js`, `ch3-act1.js`,
  `ch3-act2.js`, `ch3-act3.js`, `ch3-endings.js`, each ending with
  `HC.registerScenes("ch3", SCENES);`, each **under ~1,500 lines**. Script
  tags added to **both** `index.html` and `dev-smoke.html`, manifest first.

---

## 7. Mechanics & balance reference

- **Checks:** ch2 used DC 11–12 (act 1), 12–14 (act 2), 13–14 (finale;
  the Tidemother tie was Spirit 14 with a Might 14 fail-forward that can
  kill). Ch3 at level 7+ can run 12–15. Spread across all three stats;
  every check needs a *written* fail path, and the best fails advance the
  story worse rather than just damaging.
- **Enemies:** ch2 curve — hp 18→46, guard 12→15, dmg 5→9 (boss
  `c2_debtor_grasp` 46/15/9). Ch3: roughly hp 24→55, guard 13→16, dmg 6→10.
  Give each a two-sentence `flavor` in the coast's deadpan register.
- **Economy:** shop items 20–45 gold, a 30–40 gold karma-purchase early
  (ch2's name-buyout), a 30-gold generosity option (funding the
  evacuation), sell-hooks for morally loaded gear.
- **fx vocabulary:** `karma, gold, hp, heal_full, xp, items+/items-, flags,
  approval, recruit, meet, leave, kill_companion, stat+/stat-`; fx may be a
  function `(s) => fxObject` (ch2's Undertow toll is the precedent).
- **XP:** scenes hand out 5–50; finale choices 40–50. Level cap 8.
- **DSL first:** `when:`/`if:`/`pick:` data forms wherever possible;
  function texts `(s) => ...` for ws-keyed variants; function targets need
  `targets:` declared. Prefix **everything** `c3_`.

---

## 8. Theme, voice, and continuity obligations

**Candidate third lens on "holding"** (pick one and commit): letting go /
succession (who holds the holders? where do spent sureties go?); the open
water between held places (navigation as attention); memory as holding
(the eaten pages — what un-writes what the world may not know?); or
beginnings (what does the *first* act of holding cost — live in `harbor`,
but must generalize). The strongest candidates keep ch2's move of making
the antagonist *sympathetic accounting* rather than malice — ch1's god
begged to be relieved, ch2's monster was a debtor afraid of falling with
no one underneath. Ch3's "villain" should extend the pattern: something
whose grievance is real and whose books balance.

**Voice checklist (the house style, consistently in both chapters):**
- Second person, present tense; `{name}` in plain text, `${s.player.name}`
  in function text.
- Final beat of most scenes is a paragraph opening with `# ` — the punch
  line, often aphoristic.
- Emphasis by ALL CAPS on the load-bearing word, never italics.
- Coastal register: dry, practical, funny in a deadpan way; institutions
  speak in ledger-language; the profound is always phrased as logistics
  ("Somebody has to. That's the entire liturgy.").
- Choice labels are sentences with personality, sometimes bracket-tagged
  `[Might]`/`[Wits]`/`[Spirit]`, cost noted in parentheses.
- Recurring liturgical phrases to reuse *sparingly*: "the Lady's table is
  always laid", "ALL DEBTS HONORED", "mind the third stair; it turns",
  "walk loud", "sing loud — she's a verse behind you the whole way",
  "somebody has to", "the early smile".

**Debts the text owes the reader (planted, unpaid — prime ch3 material):**
1. The Tidemother's destination / the Tenth Song's owner now.
2. Page 71's itemization, "nine knots deep," unread by choice — *what did
   existence itemize?*
3. The eaten treaty page (who ate it; what arrangement preceded the loom
   *and* the Nine).
4. The player's own outstanding paper: `c2_self_pledged` season-lien, the
   `c2_tally_coin`, the Merchant's "small annotation" on the player's
   account in every epilogue.
5. The Watch's empty post with the sou'wester hung ready (`partial` bell).
6. The Eel-Mother's list — other subsumed local sureties, coast-wide.
7. Chapter 1 leftovers still flagged and portable: `knows_prince`,
   `killed_king`, `have_letters`/`crayce_resolved`, `took_locket` — inland
   politics ch2 deliberately ignored; usable if ch3 touches the woven side.
8. "The second mission didn't report" (vael opening) — someone from the
   chapels is unaccounted for on the coast.

---

## 9. Release/validator checklist (from CHAPTER_AUTHORING.md, verified against ch2)

1. Manifest `HC.registerChapter({ number: 3, ... })` in
   `js/story/packs/ch3.js`; scenes in part files via
   `HC.registerScenes("ch3", ...)`.
2. Every scene id `c3_*` except the mandatory `death`; every scene has
   `ending:` XOR non-empty `choices`; each choice exactly one of
   `goto`/`check`/`combat`.
3. Nine openings covering all nine `c2_end_*` scenes via `entry_from`;
   distinct `ws` per opening; `preset` overrides on each.
4. All referenced items/enemies/companions defined; no additions to
   `HC.helpers`; local predicates or DSL only.
5. Script tags in **both** `index.html` and `dev-smoke.html` (manifest
   before parts, after ch2's files).
6. `node selftest.js --chapter ch3` while iterating;
   full `node selftest.js` before release;
   `dev-smoke.html?steps=300` drives the real UI;
   `node selftest.js --dump-chapter ch3` for graph diffs.
