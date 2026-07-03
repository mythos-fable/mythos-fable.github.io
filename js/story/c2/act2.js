/* Chapter 2, Act 2: the Drowned Market and the Nine Knots.
   The market hub, Mother Rook's table, the marsh and bell Anchors, the
   companions' own debts, and the road to the Great Ebb. */
(function (HC) {
  "use strict";

  const { has, hasnt, inp, notp, gold, item, ws, ws_god, appr } = HC.helpers;

  const SCENES = {

    // ------------------------------------------------------------- the hub
    "c2_drowned_market": {
      text: (s) => {
        if (s.flag("c2_market_seen")) {
          return `The Drowned Market, mid-ebb: lantern-lines swaying, scales ringing,
the tide-bell counting down the cave's borrowed hours. At the bright
end, commerce. At the dark end, the pale stall. In the black-painted
annex, the Lady's business, which is increasingly everyone's.`;
        }
        return `You walk the lantern-lines into the wet glittering heart of the
coast's commerce, and the Market sorts you as you go — a glance from
the knot-doctor, a half-bow from a cord-script scribe, the fish-
wives' frank stares. Word of the storm came down the stair ahead of
you. Whatever you did at the First Anchor, the Drowned Market has
already priced it.

The tide-bell over the cave mouth swings its slow count. Four hours,
the regulars' feet say, in the unhurried way they don't hurry.

Three things pull at you like moorings:

The pale stall in the deep end, where the Merchant's handbill
invited you by name he didn't write.

The black-painted Corvid annex, out of which a clerk in senior
feathers has already emerged, found your eye across the whole
cathedral of noise, and inclined his head toward the curtained
door behind him: the Lady's table, laid.

And the Market itself — rumor, salvage, scribes who read old cord,
and stallholders who have watched this coast fray for longer than
towns last.`;
      },
      on_enter: (s) => {
        if (!s.flag("c2_market_seen")) return { flags: { c2_market_seen: true }, xp: 10 };
        return null;
      },
      choices: [
        { text: "The pale stall, in the deep end.",
          when: hasnt("c2_pale_done"), goto: "c2_pale_stall" },
        { text: "The Lady's table. You were always going to have to sit at it.",
          when: hasnt("c2_rook_done"), goto: "c2_rook_table" },
        { text: "Hire a marsh-guide: the failing Anchor in the eel-country, " +
                "two days east.",
          when: (s) => s.flag("c2_pale_done") && !s.flag("c2_eel_done"),
          goto: "c2_eel_road" },
        { text: "Row out to the Bell Anchor, where the cracked bell keeps " +
                "its vigil.",
          when: (s) => s.flag("c2_pale_done") && !s.flag("c2_bell_done"),
          goto: "c2_bell_row" },
        { text: "Find a cord-script scribe for Quill's stolen page.",
          when: (s) => s.inParty("quill") && s.hasItem("c2_ledger_page")
            && !s.flag("c2_page_read"),
          goto: "c2_quill_scribe" },
        { text: "Vex wants a word, away from the lantern-light.",
          when: (s) => s.inParty("vex") && s.flag("c2_rook_done")
            && !s.flag("c2_vex_quest_done"),
          goto: "c2_vex_vault" },
        { text: "Make camp in the high dry gallery with the other overnighters.",
          when: (s) => (s.flag("c2_eel_done") || s.flag("c2_bell_done"))
            && !s.flag("c2_camped"),
          goto: "c2_camp" },
        { text: "Walk the stalls and let the Market talk.",
          goto: "c2_market_walk" },
        { text: "The Great Ebb is called — the lowest tide of the age. The " +
                "road to the Ninth Anchor is about to exist.",
          when: (s) => s.flag("c2_pale_done") && s.flag("c2_rook_done")
            && (s.flag("c2_eel_done") || s.flag("c2_bell_done")),
          fx: { xp: 15 }, goto: "c2_great_ebb" },
      ],
    },

    "c2_market_walk": {
      text: (s) => {
        const bits = [
          `A salvage stall sells the cargo of ships that sank before the towns
that built them had names. The stallholder dates everything by
Anchor: 'Third Anchor era. Fifth. This buckle here — First Knot
work, before the Nine were even nine.' Nobody calls her mad. On
this coast, that's just provenance.`,
          `The knot-doctor's queue is twice yesterday's. Frayed name-cords,
cold door-knots, a man who holds out a wrist with nothing on it and
can't say what used to be there. The doctor splints what she can.
What she can't, she writes on a slate, and the slate goes — you
watch it go — to the Corvid annex, where such things have a price.`,
          `Two fishwives argue the theology of the age in the only register
the coast knows, over a crate of eels: 'The Lady BUYS the slack,
she's the only one taking it up—' 'She's taking up the LINES, you
mud-brained — when your mooring's hers, YOU'RE hers—' The eels,
gleaming, say nothing, and are sold.`,
          `A child runs the lantern-lines barefoot, retying the stall-knots
that have worked loose, quick as a sail-needle, paid in pennies by
each holder. Behind her, you notice, the knots stay warmer longer.
Nobody else seems to see it. The coast is still making singers,
whatever the Ninth is unmaking.`,
        ];
        const idx = (s.flag("c2_walk_count") || 0) % bits.length;
        return bits[idx];
      },
      on_enter: (s) => ({ flags: { c2_walk_count: (s.flag("c2_walk_count") || 0) + 1 } }),
      choices: [
        { text: "Back along the lantern-lines.", goto: "c2_drowned_market" },
      ],
    },

    // ------------------------------------------------------ the pale stall
    "c2_pale_stall": {
      text: (s) => `The deep end of the Market is quieter, the lantern-lines sparser,
the sand underfoot unprinted — the stalls down here deal in things
that prefer fewer witnesses. And at the very end, where the dark
begins in earnest, the high narrow stall of pale wood stands with
its strings of keys and teeth and rings turning in their windless
wind, and behind the counter, ledger open, smile arriving early:

'The wanderer. PUNCTUAL. I do so prize that in an account.'

The Pale Merchant looks exactly as he has always looked, which on
this coast you finally understand to be the point: older than the
towns, older than the Lady's office, possibly older than the Nine.
${s.flag("c2_merchant_brought")
  ? `'You'll forgive me for not driving you further than the gate,' he
says. 'On this shore I keep to my stall. SENIORITY is a courtesy
one extends most carefully to those who hold it.'`
  : s.flag("met_merchant")
    ? `'You will recall our previous dealings,' he says, with a small bow
that manages to reference every one of them at once. 'A pleasure,
as ever, to serve a RETURNING customer.'`
    : `'We have not dealt before, you and I,' he says, 'though I have
carried paper on your road for some time. Introductions, then: a
merchant. Pale, they say. I buy endings, findings, and prior
arrangements, and I sell' — the early smile widens by one tooth —
'context.'`}

The counter between you is bare except for the open ledger and a
small brass scale, which weighs nothing, slowly.`,
      choices: [
        { text: "'Context, then. The First Debt. The Lady. The Ninth. I'm " +
                "buying.'",
          fx: { xp: 10 }, goto: "c2_pale_counsel" },
      ],
    },

    "c2_pale_counsel": {
      text: `The Merchant closes his ledger, which from him is the drawing of
curtains, and gives you, gratis — 'a loss-leader, wanderer; tell
your friends' — the shape of the coast:

'Before looms, before crowns, before my own modest practice, there
was a thing that wished to EXIST and lacked the capital. What it
borrowed, it borrowed from the substance of the world; whom it
borrowed FROM, history calls the Tidemother. Understand: she did
not DEFEAT it. Defeat is for soldiers. She UNDERWROTE it. The
Nine Anchors are not a prison, whatever the singers' children
sing. They are a repayment schedule. The First Debtor exists on
borrowed being, the Anchors meter the interest, the coast — its
lives, its lucks, its names, all moored to the Nine — is the
COLLATERAL. It was a sound instrument for four thousand years.'

He turns the ledger to face you. On the page, in script your eye
slides off: one account. One line legible, freshly entered, in his
own hand: TERM CONCLUDES.

'The Tidemother is gone — ask me not where; that page was eaten
before my time. Her estate, in the way of estates, found an
EXECUTOR.' The keys and teeth turn on their strings. 'The lady of
the feathers does not cause the Anchors to fail, whatever the
quays mutter. She is doing what executors do: securing the
collateral before the default. Every line she buys is a life that
will be HELD, by paper if not by pattern, when the Nine let go.
One may find her methods cold. One struggles, professionally
speaking, to call them WRONG.'

# 'The question on the coast, wanderer, is not whether the debt
comes due. It is who attends the settlement — and in what
CAPACITY. Do shop around.' The smile arrives early again. 'You
have, I estimate, until the Great Ebb.'`,
      on_enter: { flags: { c2_pale_done: true, met_merchant: true } },
      choices: [
        { text: "Trade with him before you go.", goto: "c2_pale_shop" },
        { text: "'One more thing — you knew the Tidemother?' Fish the deep " +
                "water.",
          fx: { xp: 10 }, goto: "c2_pale_tidemother" },
        { text: "Back into the lantern-light with your context.",
          fx: { xp: 10 }, goto: "c2_drowned_market" },
      ],
    },

    "c2_pale_tidemother": {
      text: `For the first time in your acquaintance, the Pale Merchant takes a
moment that is not for effect.

'Professional courtesy forbids much,' he says at last. 'She was —
a colleague is the wrong word; she would have loathed it. She did
not TRADE in held things. She held them. The one party on any coast
I ever worked who took the other side of every contract: where I
buy what people can no longer carry, she carried what people could
not bear to sell. We met, in the way of opposed professionals,
with great regularity and perfect cordiality, for longer than the
present arrangement of the stars.

'And then she co-signed the wrong note, and paid as guarantors
pay: entirely, and by installments, and out of sight. There is a
reason no singer sings a tenth psalm, wanderer. There was a tenth.
It was HERS, and the Nine were tied to spare the coast from ever
having to sing it.'

He reopens the ledger with the finality of a man re-shelving a
volume civilians should not have seen.

# 'I will say this much for free, because she would have: when you
reach the Ninth — and your account says you will — remember that
the thing beneath it is not the only party to the original note.
Read BOTH signatures. Settlements that honor one party only are
called, in my trade, thefts.'`,
      on_enter: { flags: { c2_knows_tidemother: true } },
      choices: [
        { text: "Trade with him.", goto: "c2_pale_shop" },
        { text: "Back into the lantern-light.", fx: { xp: 10 },
          goto: "c2_drowned_market" },
      ],
    },

    "c2_pale_shop": {
      text: (s) => `The stall's counter, when he wills it, is suddenly STOCKED: gear on
pale hooks, bottles in nets, blades sleeping in cloth. Prices are
chalked nowhere. He quotes by eye, by account, by whatever the
brass scale is weighing.

(You carry ${s.player.gold} gold.)`,
      choices: [
        { text: "The Knot-Knife — whale-bone and salt-iron, for cutting what " +
                "should not hold. (35 gold)",
          when: (s) => s.player.gold >= 35 && !s.hasItem("c2_knot_knife"),
          fx: { gold: -35, "items+": ["c2_knot_knife"] },
          goto: "c2_pale_shop" },
        { text: "Rook-Feather Coat — 'an awkward provenance, hence the " +
                "price.' (45 gold)",
          when: (s) => s.player.gold >= 45 && !s.hasItem("c2_rook_feathers"),
          fx: { gold: -45, "items+": ["c2_rook_feathers"] },
          goto: "c2_pale_shop" },
        { text: "A Dram of the Deep Pearl. (30 gold)",
          when: gold(30),
          fx: { gold: -30, "items+": ["c2_pearl_dram"] },
          goto: "c2_pale_shop" },
        { text: "Brine-Singer's Tonic, two for luck. (20 gold)",
          when: gold(20),
          fx: { gold: -20, "items+": ["c2_brine_tonic", "c2_brine_tonic"] },
          goto: "c2_pale_shop" },
        { text: "Sell him the soul-lantern of Ashfen. 'Still glaring. " +
                "Magnificent. One hundred and twenty.'",
          when: item("soul_lantern"),
          fx: { gold: 120, "items-": ["soul_lantern"], karma: -5,
                flags: { sold_lantern: true } },
          goto: "c2_pale_shop" },
        { text: "Conclude your business.",
          goto: "c2_drowned_market" },
      ],
    },

    // ------------------------------------------------------ the lady's table
    "c2_rook_table": {
      text: (s) => `The curtained door behind the Corvid annex opens on a room that
should not fit under the cliff: long, dry, paneled in black wood
that has never been wet, lit by candles that burn without motion.
A table runs its length, laid for two with the severity of an
altar.

At the far end sits Mother Rook.

She is exactly what the Gull's drinkers said and nothing like it:
a trim grey woman of maybe sixty, maybe — the candlelight declines
to settle the matter — with ink-dark eyes and the stillness of a
ledger between entries. No feathers. The feathers are for staff.
Power this old wears wool.

'The wanderer,' she says, and her voice is the counting-room hush
itself. 'Sit. Eat. The coast's courtesies are older than its
debts, and at MY table, both are honored.'

${s.flag("c2_bought_name")
  ? `'You redeemed a name out of my Saltmere office,' she says, pouring
two glasses of something the color of deep water. 'At a fair
price, cleanly, under my own terms. I am told the clerks are still
upset. GOOD. A house that cannot be beaten by its own rules is a
racket, and I do not run rackets.'`
  : `'You have been on my books since you crossed the Hem,' she says,
pouring two glasses of something the color of deep water. 'Walking
asset or walking liability — the column is not yet chosen. Hence
dinner.'`}

# ${s.inParty("vex")
  ? `Beside you, Vex has gone the particular shade of professional that
means the brand under the glove is BURNING.`
  : `On the table between the candles, small and exact as a place-card,
sits a single black tally-coin. Yours, the setting says. Already.`}`,
      choices: [
        { text: "Sit. Hear her out — all of it, from the beginning.",
          fx: { xp: 10 }, goto: "c2_rook_history" },
      ],
    },

    "c2_rook_history": {
      text: `She talks the way the candles burn: without waste.

'Four thousand years ago the Tidemother co-signed for a thing that
wished to exist, and the coast has lived on the interest of that
arrangement ever since — moored, held, SOLVENT. I was here. Believe
that or don't; the paneling believes it.' The ink-dark eyes do not
blink when other eyes would. 'I held the Tidemother's PAPER,
wanderer. Her working accounts. When she went down to settle her
guarantee in person and did not come back, someone had to keep the
coast's books from simple ROT. I have kept them since. The office.
The feather. The Lady keeps the coast — they think it's a motto.
It is a JOB DESCRIPTION, and I did not apply; I was the only
literate party still standing.'

She turns her glass once, a full revolution, like a clock being
set.

'Now the term concludes. The Debtor wakes; the Nine let go; every
moored life on this shore becomes, in the space of one Great Ebb,
LOOSE PAPER in a gale. Your singers cannot retie a four-thousand-
year guarantee with folk songs. Your gods' — the glass stops —
'cannot enter. The only institution on this coast with the
standing, the records, and the SPINE to hold what's coming loose
is mine.

# 'So I am buying the coast, yes. Every line, every brand, every
name my clerks can paper. Not because I want it. Because when the
Ninth parts, anything I do not HOLD goes down into the dark with
the stone — and I have read the original note, wanderer, and I
know what "down" MEANS.'`,
      choices: [
        { text: "'And the people you hold become — what? Assets in " +
                "perpetuity?' Make her say the price out loud.",
          fx: { xp: 10 }, goto: "c2_rook_offer" },
      ],
    },

    "c2_rook_offer": {
      text: (s) => `'Held,' she says, without apology. 'Alive. Themselves — under
paper. My paper does not fray, does not drown, and does not
DEFAULT. Ask the Hollowed of your inland country what the
alternative to a holder is.' For the first time, something moves
behind the ink: old, tired, and entirely sincere. 'It is not a
kind arrangement. It is the SOLVENT one. The Tidemother loved this
coast, wanderer, loved it like a holder, and her love is now a
hole in the sea floor. I do not love it. I will still be at my
desk in the morning. The coast may decide for itself which it
needs.'

She sets down her glass and lays her offer on the cloth like
cutlery, piece by piece:

'Work for me until the Great Ebb. Walk the failing Anchors —
you're doing it anyway, by all reports. Where a line can be
saved, save it; where it cannot, bring me the slack BEFORE the
dark takes it. In exchange: my ledgers are open to you' — beside
you, ${s.inParty("vex") ? "Vex's breath stops" : "the tally-coin on the cloth turns over, untouched"} — 'ALL of them. Every account. Including the ones
your companions carry, and the one at the bottom of the book.

# 'And when the settlement is attended — and it will be attended,
by me, in whatever capacity the night allows — you will have a
chair at the table, and not a line in the collateral. Few enough
on this coast will be able to say the same. Terms?'`,
      choices: [
        { text: "Take her terms. The coast needs a holder more than it " +
                "needs a hero.",
          fx: { xp: 20, karma: -4, flags: { c2_rook_pact: true },
                "items+": ["c2_tally_coin"],
                approval: { vex: -8, oshka: -6, quill: -4 } },
          goto: "c2_rook_dealt" },
        { text: "Refuse — civilly. 'A coast held by paper is a filing " +
                "cabinet, not a coast.'",
          fx: { xp: 20, karma: 5,
                approval: { vex: 5, oshka: 6, quill: 4 } },
          goto: "c2_rook_refused" },
        { text: "Counter: 'Open your ledgers and I'll walk your Anchors — " +
                "but every line I save STAYS SAVED. No buying the slack I " +
                "take up.' [Wits]",
          check: { stat: "wits", dc: 13, ok: "c2_rook_counter_ok",
                   fail: "c2_rook_counter_fail",
                   ok_fx: { xp: 30, karma: 3 } } },
      ],
    },

    "c2_rook_dealt": {
      text: `'Sensible,' says Mother Rook, in the tone of a column balancing,
and the table is suddenly less an altar and more a desk: papers
materializing between the candles, her pen moving, the contract
assembling itself in cord-script and common in parallel columns,
fair-copied as it grows.

The tally-coin is warm when you take it up, like a coin from a
counted pocket, and the moment it touches your palm you FEEL the
office: a faint counting-room hush behind the world's noise, the
sense of being, henceforth, a kept entry.

'My ledgers open to you at any office, any hour. The clerks will
know.' She rises; dinner, apparently, was the negotiation. 'One
counsel, gratis, between holder and held: the pale one in the deep
end has been on this coast longer than I have, and his ledger and
mine DISAGREE about the original note. When you read it — and
your column says you will — read it with my books in the other
hand.

# 'The Lady keeps the coast, wanderer. As of tonight, that
includes you.'`,
      on_enter: { flags: { c2_rook_done: true } },
      choices: [
        { text: "Out, past the annex, the coin counting quietly in your " +
                "pocket.",
          fx: { xp: 10 }, goto: "c2_drowned_market" },
      ],
    },

    "c2_rook_refused": {
      text: `Mother Rook receives the refusal the way black wood receives
candlelight: completely, and without change.

'Noted,' she says, and the word goes somewhere — you actually hear
it being FILED, a whisper of paper from beyond the paneling. 'You
decline the chair. The table remains. They always come back to the
table, wanderer; the tide brings them.' She rises, and the candles
lean with her, and for one unguarded instant you see the thing the
Gull's oldest drinker saw: the years on her, all of them, worn
like the office wears its paint — four thousand winters of being
the only literate party still standing, keeping books for a
drowning shore that calls her a vulture for it.

'You will walk the Anchors regardless. Save what you can. I will
buy what you cannot. Between us — though you will not enjoy the
arithmetic — the coast may yet come through the Ebb with most of
its souls on SOMEBODY'S books.'

At the curtained door, her voice catches you, dry as a ledger's
last line:

# 'When you meet the thing at the bottom, wanderer, ask it who
taught it that existing must be PAID FOR. The answer is in my
files. It has never once been asked the question.'`,
      on_enter: { flags: { c2_rook_done: true, c2_rook_refused: true } },
      choices: [
        { text: "Out, with the question already itching.",
          fx: { xp: 10 }, goto: "c2_drowned_market" },
      ],
    },

    "c2_rook_counter_ok": {
      text: `The ink-dark eyes hold you for three full candle-flickers, and then
Mother Rook does something the paneling has plainly not witnessed
in centuries.

She laughs. Once. A sound like a strongbox unlocking.

'STAYS SAVED. Four thousand years and the coast finally sends me
someone who negotiates like a HOLDER instead of a hero or a
debtor.' The pen is already moving, redrafting; she initials the
amendment with a single stroke of cord-script that briefly warms
the room. 'Terms: my ledgers open to you. The Anchors you re-tie
are SOVEREIGN — no Corvid paper touches a line you take up; the
amendment binds my office in perpetuity, which is a longer word in
my house than in most. In exchange, what you cannot save, you do
not romanticize: the slack comes to me, before the dark, every
time. Salvage, not sentiment.'

She slides the fair copy across. It reads exactly as spoken, which
on this coast you have learned to treasure like rain.

# 'A pleasure,' says Mother Rook, and means it, which is somehow
more unsettling than the paneling. 'The pale one will be INSUFFER-
ABLE about this. Tell him I said so.'`,
      on_enter: { flags: { c2_rook_done: true, c2_rook_amended: true },
                  approval: { vex: 4, oshka: 4, quill: 6 } },
      choices: [
        { text: "Sign, pocket your sovereign copy, and go.",
          fx: { xp: 15 }, goto: "c2_drowned_market" },
      ],
    },

    "c2_rook_counter_fail": {
      text: `'STAYS SAVED,' she repeats, and turns the phrase over with the pen
the way a jeweler turns paste. 'Charming. Define "saved", wanderer.
Saved against the next storm? The next century? Saved when the
Ninth parts and every sovereign little line you knotted goes down
trailing its grandmothers? My paper holds in the dark. Your
sentiment holds in fair weather. The amendment is declined.'

The papers fold themselves away; the table resumes being an altar.
You have not lost her — you understand this from the quality of
her stillness — but you have been RE-FILED, from possible peer to
confirmed romantic, and the room's temperature adjusts accordingly.

'The original offer stands until the Great Ebb. The tide brings
them all to my table eventually.' She rises. 'Walk your Anchors.
Sing your songs. And when the dark has eaten one thing you loved
and could not hold, come back and we will discuss SAVED like
adults.'

# At the curtain, dry as dust: 'No charge for dinner. First
lessons are always gratis.'`,
      on_enter: { flags: { c2_rook_done: true } },
      choices: [
        { text: "Out, unfiled and unfinanced.",
          fx: { xp: 10 }, goto: "c2_drowned_market" },
      ],
    },

    // ------------------------------------------------- the eel-marsh anchor
    "c2_eel_road": {
      text: (s) => `The marsh-guide is a silent brother of the Loomless Folk who takes
payment in salt-bread and conversation in nods. Two days east, the
coast unbuilds itself: town to hamlet, hamlet to stilt-path, path
to a maze of black water and whispering eel-grass where the sky
sits low enough to touch and the FOURTH Anchor's light comes up
through the murk in drowned green glimmers.

${s.inParty("oshka")
  ? `Oshka sings the road-psalm low the whole way — not for the Anchor
yet, for the MARSH, the way you'd talk steady to a big animal
while crossing its field. 'Eel-country was held before the Nine,'
she murmurs between verses. 'By something local. The Tidemother
TOOK OVER the holding, the way a big bank takes a little one. The
local something never left. It just — banks differently.'`
  : `The guide grows warier as the water darkens, tapping a rhythm on
his staff at each channel-mouth — announcing you, you realize, to
something. The eel-grass leans against the wind to watch you pass.
${s.hasItem("c2_knot_charm") ? "The charm at your chest warms toward the green glimmer ahead, then — strangely — turns COLD on one bearing, like a compass finding two norths." : "You are being escorted, and not only by the guide."}`}

On the second evening you reach it: a Loomless fishing village on
stilts above the Anchor-pool, lamplit, net-hung — and silent. Nets
in. Boats up. Doors knotted shut with cord gone GREY.

# In the pool below the village, the Fourth Anchor's green-gold
light gutters like a lamp running out of someone to burn for.`,
      choices: [
        { text: "Into the village, to whoever's left.",
          fx: { xp: 15 }, goto: "c2_eel_village" },
      ],
    },

    "c2_eel_village": {
      text: (s) => `One door is unknotted. Inside, around a peat-fire, the village's
remnant sits vigil: nine Loomless elders and one woman young enough
to still be angry, who rises with a fish-spear when you enter and
sets it down only when ${s.inParty("oshka")
  ? "Oshka sings the threshold-note, and every grey head turns to her like flowers to a window"
  : "you show empty hands and road-manners"}.

The story comes in pieces, in the cord-thick coastal tongue:

The Fourth Anchor began to gutter at the spring tide. The village
sang to her — they are Loomless, every soul here can carry the
psalms — and the guttering SLOWED, and all was vigil and worry but
not yet ruin. Then, a month ago, the eel-grass brought a new thing:
the EEL-MOTHER, the marsh's own old holder, the something local —
risen from whatever bank she banks in, circling the Anchor-pool
nightly, feeding on the fraying light itself. 'She drinks the
slack,' the young woman says, knuckles white on the spear. 'Every
line the Anchor lets slip, SHE takes up. Our dead. Our names. Not
into the dark below — into HERSELF. She's re-holding us, the old
way, the way her marsh held things before the Nine: WHOLE, and
hungry, and hers.'

The elders murmur. The fire pops. The young woman says the thing
the vigil exists to not say:

# 'And gods help us — some nights, with the Anchor going and the
dark below waiting — some of us go down to the pool and WONDER if
hers is the better offer.'`,
      choices: [
        { text: "Go down to the pool at moonrise and see the Eel-Mother " +
                "for yourself.",
          fx: { xp: 10 }, goto: "c2_eel_mother" },
      ],
    },

    "c2_eel_mother": {
      text: (s) => `She comes at moonrise, as billed, and she is worse and better than
the fireside made her: a glistening dark coil as long as the
village is wide, moving through the black water with the silence
of something the water loves, eyes like green coals spaced down
her flank — and around her, swimming WITH her, in her wake and her
keeping, the lights of the taken lines. Dozens of them. Small and
bright and held.

They do not look tormented. That is the deep trouble of the
Eel-Mother's offer, the one the vigil wonders about at night: the
held lights look HELD. The old way. Whole, and hungry, and hers.

She raises her great head from the pool and regards you, and when
she speaks it is straight into the parts of you that predate
words:

I HELD THIS WATER BEFORE THE KNOTS. I LENT MY HOLDING TO THE
SALT-MOTHER FOR HER GREAT SURETY, AND SHE IS GONE, AND THE SURETY
FAILS, AND I AM TAKING BACK WHAT WAS ALWAYS MINE. THE DEEP DARK
WOULD EAT THEM, WALKER. I KEEP THEM LIT.

${s.inParty("quill") ? `Beside you, Quill is scribbling in the dark, hands shaking, and
whispers the thing that reframes the night: 'She's not lying and
she's not right. She LENT her holding — it's IN the master page,
"local sureties subsumed" — she's a CREDITOR of the original note
too. A small one. Taking unilateral repossession.'` : `The First-Knot charm at your chest does its strange double thing
again: warm toward the guttering Anchor, cold toward HER — two
norths, two holders, one drowning village between them.`}

# CHOOSE FOR THEM, WALKER, says the Eel-Mother, and the green
coals bank with something older than malice and more dangerous —
GRIEF. THEY HAVE FORGOTTEN HOW. THE KNOTS MADE THEM SOFT.`,
      choices: [
        { text: "Re-tie the Fourth Anchor here and now — take the lines BACK " +
                "from her keeping. She will not permit it quietly.",
          combat: { enemy: "c2_marsh_thing", win: "c2_eel_anchor",
                    win_fx: { xp: 35 } } },
        { text: "Negotiate the old way: offer her a CO-HOLDING — her marsh-" +
                "keeping woven into a re-tied Anchor, creditor honored, " +
                "village moored. [Spirit]",
          check: { stat: "spirit", dc: 14, ok: "c2_eel_pact",
                   fail: "c2_eel_fight",
                   ok_fx: { xp: 40, karma: 6 } } },
        { text: "Cede the marsh. The old holder's offer is real holding; " +
                "the village can be hers, and lit, and lost to the coast.",
          fx: { karma: -8, xp: 20, flags: { c2_eel_done: true,
                                            c2_eel_ceded: true },
                approval: { oshka: -10, quill: -5 } },
          goto: "c2_eel_ceded" },
      ],
    },

    "c2_eel_fight": {
      text: `The old grief does not negotiate twice.

THEY ARE MINE, says the Eel-Mother, and the pool stands up.`,
      choices: [
        { text: "Then it's the hard way, in the water, at night.",
          combat: { enemy: "c2_marsh_thing", win: "c2_eel_anchor",
                    win_fx: { xp: 35 } } },
      ],
    },

    "c2_eel_pact": {
      text: (s) => `It has never once been asked the question — Rook's words, about a
different creditor, and they unlock this one too.

You ask the Eel-Mother what she is OWED.

The green coals gutter. The great coil stills. And out of the
grief comes the account, four thousand years in arrears: she lent
her holding to the Salt-Mother's great surety and was never paid
so much as ACKNOWLEDGMENT — subsumed, the cord-script says, a
local power filed as an asset, her name dropped from the singing,
her water knotted over, and when the knots began to fail she was
not even ANGRY, walker, she was only certain that holding was
hers to do alone again, because no one had ever once held HER.

So you offer the thing no party to the original note ever offered
a creditor: a SEAT.

${s.inParty("oshka")
  ? `Oshka — singing softly through the whole negotiation, the marsh-
psalm and the Fourth psalm interleaved — does the work no living
singer has done: she sings the Eel-Mother's NAME back into the
song, a verse the Psalter dropped forty centuries ago, and the
marsh itself leans in to hear it.`
  : `Your hands and the charm do the work the singers would have done:
the Fourth Anchor's pattern offered open, one whole strand of the
re-tying left LOOSE, deliberately, an unfinished loop the old
holder herself must close.`}

The Eel-Mother regards the offered loop for a long, black,
glistening time. Then she takes it — one vast soft coil through
the Anchor's pattern — and the Fourth Anchor comes ALIGHT, green-
gold and green-coal interwoven, double-held, and every taken
light in her wake swims home into the mooring without one being
dropped.

# CO-SIGNED, says the Eel-Mother, tasting the word, and sinks,
satisfied, a creditor of record at last. The village above is
already singing the new verse back, badly, weeping.`,
      on_enter: { flags: { c2_eel_done: true, c2_eel_pact: true,
                           c2_anchor_lesson: true } },
      choices: [
        { text: "Back toward the Market with the marsh's first new song in " +
                "forty centuries.",
          fx: { xp: 25, karma: 4 }, goto: "c2_eel_after" },
      ],
    },

    "c2_eel_anchor": {
      text: (s) => `The pool settles. The Eel-Mother withdraws into the deep channels —
not destroyed; her kind is not destroyed, only ARGUED WITH, and
tonight's argument carried — and the taken lights hang free in the
black water, unheld, flickering, with the deep dark below already
reaching up its patient interest.

So you dive, and you tie.

The Fourth Anchor's pattern is smaller than the First's and
wearier: a green-gold coil tied by the same vanished hands,
guttering around its black stone. ${s.inParty("oshka")
  ? "Oshka treads water above you, singing the Fourth psalm down through the murk, and the pattern rises to her voice like eels to a lamp."
  : "The charm conducts; your hands follow; the pattern offers itself to the only hands that came."}
Loop into loop. Light into light. The freed lines come home one by
one — names, lucks, dead grandmothers, all the village's swimming
brightness — and the Anchor draws tight and RINGS, soundless, the
second bell of held lives you have rung on this coast.

Above, the village vigil becomes, in the space of one verse,
a festival with wet faces.

# But you felt it, down there at the closing of the knot: the
pattern is thinner than the First's. The slack ran OUT of this one
for a month before you came — out, and down, and into the ledger
of the thing beneath the Ninth, which has tasted this village now,
and found it nourishing.`,
      on_enter: { flags: { c2_eel_done: true, c2_eel_tied: true } },
      choices: [
        { text: "Back toward the Market, two Anchors wiser.",
          fx: { xp: 25, karma: 3 }, goto: "c2_eel_after" },
      ],
    },

    "c2_eel_ceded": {
      text: `You walk out of eel-country in the grey morning, and behind you the
village makes its choice the way drowning choices are made: not all
at once, and then all at once.

The vigil-fires go out one by one over your shoulder. The unknotted
door is knotted. And down in the pool the Eel-Mother rises in
daylight for the first time in forty centuries and begins, with
vast unhurried tenderness, to take up every line the Fourth Anchor
still holds — names, dead, lucks, the village whole — into the old
way: held, and lit, and HERS, a marsh full of small bright lights
swimming forever in the wake of something that will never, ever
let them go.

It is not the dark below. You tell yourself the whole two days back
that it is not the dark below.

# The coast's maps will go on showing a village there. The coast's
singers already don't sing toward it. And in the Corvid office,
you have no doubt at all, a clerk has moved forty-one lines from
one column to another and dated the entry.`,
      choices: [
        { text: "Back to the Market, lighter one village.",
          fx: { xp: 10 }, goto: "c2_eel_after" },
      ],
    },

    "c2_eel_after": {
      text: (s) => `The road back gives you time to count what the marsh taught.

${s.flag("c2_eel_pact")
  ? `The Anchors can be RE-SIGNED, not merely re-tied. The original
note had more creditors than history kept names for, and honoring
one bought a holding stronger than the Tidemother's own work —
double-held, the new verse already spreading singer to singer up
the coast ahead of you.`
  : s.flag("c2_eel_tied")
    ? `The Anchors can be re-tied — by hands, at cost, one drowning
village at a time. And every one of them has been bleeding slack
DOWNWARD for a season into something that is no longer merely
sleeping.`
    : `The old holders are rising as the Nine fail — every marsh and
sound and cove with something local and ancient in it, taking
back its water, and the coast between them and the deep dark has
never been thinner.`}

${s.inParty("quill")
  ? `Quill has filled nine pages and stopped twice to be quietly sick
with excitement or dread, unclear which. 'It all KEYS,' they keep
saying. 'The master page's margin-entries — "local sureties" —
there's a LIST, I'm sure there's a list, I need that scribe—'`
  : ""}

# Ahead, the cliff-smoke of Saltmere, and below it the Market's
ebb-lamps. The tide-bell is counting. It is always counting now.`,
      choices: [
        { text: "Down to the Drowned Market.",
          goto: "c2_drowned_market" },
      ],
    },

    // ------------------------------------------------------- the bell anchor
    "c2_bell_row": {
      text: (s) => `The Bell Anchor lies two hours' pull off the headland, where the
SECOND of the Nine moors the fishing grounds and the drowned of
four thousand years of fishing. Above it, on a reef awash at half-
tide, hangs the bell — green bronze, house-tall, cracked clean
down one shoulder — in a frame of salt-eaten oak no one alive
admits to having maintained.

It is ringing as you row out. Slow. Patient. Long gaps. The vigil-
toll you heard from the Hem road, that the whole coast has heard
all year and rows wide around.

${s.inParty("vex")
  ? `'I've cased some unpromising premises,' Vex says, shipping oars to
glove the brand, which has begun to PULL toward the reef like a
dog scenting home, 'but a haunted bell in open water is new
ground even for — oh, WONDERFUL, look at that.'`
  : `Your boat's borrowed boatman stops rowing a quarter-mile out,
crosses his wrists in the coast's warding sign, and will go no
closer for doubled pay. You take the oars yourself.`}

On the reef, around the bell-frame, figures stand in the wash:
grey, patient, salt-run shapes in the rags of every era of
oilskin at once. The Drowned Watch. They do not menace. They
RING — one bends to the great cracked lip each time the toll
comes due, regular as a heartbeat that outlived its body.

# Between the boat and the bell, riding low, three hulls flying
wrecker-lanterns: the living, come to strip the frame's bronze
and the Watch's hoard, finding out at low tide why no one
maintains the bell and no one robs it either.`,
      choices: [
        { text: "Put your boat between the wreckers and the bell.",
          combat: { enemy: "c2_wreck_gang", win: "c2_bell_watch",
                    win_fx: { xp: 30, karma: 4 } } },
        { text: "Hail the wreckers first — every hand on this coast can be " +
                "hired cheaper than buried. [Wits]",
          check: { stat: "wits", dc: 12, ok: "c2_bell_hired",
                   fail: "c2_bell_fight",
                   ok_fx: { xp: 25, karma: 3 } } },
      ],
    },

    "c2_bell_fight": {
      text: `The wrecker-captain hears your offer out, looks at your boat's
waterline, counts your blades, and smiles the smile of a man who
has already weighed you for salvage.

# 'Generous,' he calls across the swell. 'Counter-offer: the sea
takes all deposits.'`,
      choices: [
        { text: "Then it's boat-work.",
          combat: { enemy: "c2_wreck_gang", win: "c2_bell_watch",
                    win_fx: { xp: 30 } } },
      ],
    },

    "c2_bell_hired": {
      text: `Coin, plus the observation that bronze stripped from a haunted
frame has never once been successfully fenced on this coast — the
Drowned Market wouldn't touch it and the Corvids would BUY it and
then own the curse and the seller both — plus the visible fact of
the Watch standing in the wash not ten oars away, arithmetic the
wrecker-captain can do.

'The reef's yours, hero,' he decides, with the grace of a man
discovering principles at a favorable exchange rate. His hulls
sheer off east. One wrecker, the youngest, stands at the stern
staring back at the bell the whole way out of sight — coastal
blood; somebody's line is rung in that bronze.

# The Watch has not moved. The toll comes due; the bent grey
figure rings it; the crack in the bell shoulders the note into
something between a knell and a NAME.`,
      choices: [
        { text: "Land on the reef among the Drowned Watch.",
          fx: { xp: 10 }, goto: "c2_bell_watch" },
      ],
    },

    "c2_bell_watch": {
      text: (s) => `You land in the wash among them, and the Drowned Watch makes room —
courteous as old sailors, cold as the grounds they keep. Up close
you understand the vigil: each grey figure stands a post around
the bell-frame, and below, in the clear deep water inside the
reef's arms, the Second Anchor burns its drowned blue-gold among
four thousand years of nets and keels and bones. The fishing
grounds' dead, all moored, all HELD — and the bell is how the
Watch takes up the Anchor's fraying slack: every toll a stitch,
every ring a re-saying of the names, the whole crack-shouldered
liturgy one long manual re-tying that has gone on since the
Anchor first began to gutter.

They have been ringing for a YEAR. They are spent — you can see
it, grey shapes worn thin as net-shadow — and the gaps between
tolls are widening, and the blue-gold below gutters in time with
the gaps.

The post-captain of the Watch — sou'wester, pipe long out, a face
like kind weather — regards you, and the toll he rings as you
meet his eyes arrives shaped like a question.

${s.inParty("oshka")
  ? `Oshka is weeping openly, hands already at her Psalter-cord. 'The
SECOND psalm,' she says. 'They're singing it in BRONZE. A year,
unrelieved, unthanked — walker, the Watch can't retie her, they
can only SLOW her, and they know it, and they're ringing anyway.'`
  : `${s.hasItem("c2_knot_charm")
      ? "The charm at your chest tolls warm with the bell, a tiny answering stitch."
      : "Each toll moves through your boots, your ribs, the water, the light below — one liturgy, fraying."}`}

# The Watch cannot leave their posts to tie. The bell cannot ring
forever. Somebody with warm hands is standing on the reef.`,
      choices: [
        { text: "Dive the inside-water and re-tie the Second Anchor while " +
                "the Watch rings the pattern down to you. [Spirit]",
          check: { stat: "spirit", dc: 13, ok: "c2_bell_tied",
                   fail: "c2_bell_partial",
                   ok_fx: { xp: 40, karma: 5 } } },
        { text: "Take a post first: ring the great bell yourself and give " +
                "the Watch's worn-thin shapes one watch of RELIEF. Then dive. " +
                "[Might]",
          check: { stat: "might", dc: 12, ok: "c2_bell_relief",
                   fail: "c2_bell_partial",
                   ok_fx: { xp: 35, karma: 7 } } },
      ],
    },

    "c2_bell_relief": {
      text: `The bell's rope is sized for the drowned, who do not tire the way
the living tire — one pull and your shoulders understand the
year these grey shapes have stood. You ring. The crack shoulders
the note into its knell-name. You ring. The Watch, post by post,
eases — grey figures sitting down in the wash for the first time
in a liturgy, leaning on the frame, on each other, thin as net-
shadow and resting.

The post-captain stands his post beside you the whole watch,
relieved of nothing by choice, and somewhere past the hundredth
toll you stop counting and the ringing becomes what it is: the
names, re-said. You ring the fishing grounds' dead for one whole
watch of the world, and the bell teaches your arms what the
psalms teach singers — that holding is work, that work is love
with its sleeves rolled, that somebody has to, that SOMEBODY HAS.

When the Watch takes back the rope, the toll comes easier. Rested
bronze, rested dead.

# Then you dive, and the Second Anchor rises to your hands like
something that heard you ringing.`,
      on_enter: { flags: { c2_bell_rang: true } },
      choices: [
        { text: "Tie, with the Watch's liturgy carrying the pattern down.",
          fx: { xp: 20 }, goto: "c2_bell_tied" },
      ],
    },

    "c2_bell_tied": {
      text: (s) => `Blue-gold, the Second Anchor, and her pattern comes to your hands
willing — rung into readiness by a year of bronze, ${
        s.flag("c2_bell_rang") ? "by your own watch at the rope," : ""
      } by four thousand years of being the mooring fishermen trusted
their dead to. Loop into loop. The nets and keels and bones below
brighten line by line as the lines come taut, and the drowned of
the fishing grounds settle into the re-tied holding with a long
ease you feel through the water like warmth.

You surface inside the reef's arms to the sound of the bell
ringing CHANGES — quick, glad, unliturgical, the post-captain
hauling the rope like a man ringing in a harvest, the whole
Drowned Watch standing easy at their posts for the first time in
a year.

${s.inParty("oshka")
  ? `And Oshka, standing in the wash among them, sings them the
SECOND PSALM entire while they rest — and at its end, the verse
that isn't in it: the new verse, the Eel-Mother's lesson if you
learned it, or simply their NAMES, the post-captain's first of
all, read off the bell's bronze where four millennia of salt
spelled them. The Watch stands very still. Grey faces under
sou'westers do something faces do.`
  : `The post-captain meets you at the water's edge and gives you, in
exchange for everything, the only coin the Watch has struck in
four thousand years: he takes his pipe from his teeth, and he
BOWS.`}

# And as you ship oars for home, the bell falls quiet behind you —
not stopped: RELIEVED, ringing now only on the hours, like any
honest harbor bell — and in the gap where the toll was, you hear
what the Watch heard begin a year ago: far southwest, under the
world's lowest water, something very large, counting.`,
      on_enter: { flags: { c2_bell_done: true, c2_bell_anchor: "tied",
                           c2_ninth_heard: true } },
      choices: [
        { text: "Back to the Market with the Watch's bearing on the Ninth.",
          fx: { xp: 25 }, goto: "c2_drowned_market" },
      ],
    },

    "c2_bell_partial": {
      text: `The pattern is willing but the water inside the reef is a year
deep in slack, and your hands — mortal, cold, one diver where the
work wants nine singers — take up what they can hold and no more.

You tie off short. A carrying hitch, Marta would call it: the
Second Anchor steadied, not saved, her blue-gold burning surer
around the black stone but the deep fray still running southwest
out of her, thread by thread, toward the patient counting dark.

The Watch receives your best the way the drowned receive
everything: without judgment, which is worse than judgment. The
post-captain rings the next toll himself, and the liturgy
resumes — easier than before, you tell yourself, climbing wet
into the boat; slower to fray; weeks bought, maybe a season.

# Bought, the bell says behind you, in its crack-shouldered knell-
voice, all the way back to the headland. Bought, not paid.
Everything on this coast knows the difference now.`,
      on_enter: { flags: { c2_bell_done: true, c2_bell_anchor: "partial",
                           c2_ninth_heard: true } },
      choices: [
        { text: "Back to the Market.",
          fx: { xp: 15 }, goto: "c2_drowned_market" },
      ],
    },

    // ----------------------------------------------------- quill: the page
    "c2_quill_scribe": {
      text: (s) => `The cord-script scribe Quill trusts works the Market's quietest
corner: an ancient Loomless man called Tally-of-Welt, blind these
thirty years, who reads by running cord through his fingers and
writes by tying. Quill lays the master page on his folding desk
like a relic and an accusation at once.

The old man does not touch it at first. He holds his hands an
inch above the vellum, the way you'd warm them at a fire.

'Where,' he says, 'did a feather-clerk get a page of the DEEP
BOOK.'

'Page seventy-one,' Quill says, steady, 'of the Lady's master
ledger, cut out by me, carried by me, and if it gets me filed
I'd at least like to know what I died of. Read it, grandfather.'

${s.inParty("oshka")
  ? `Oshka adds her Psalter-cord to the desk — collateral of standing,
singer to scribe — and the old man's face turns toward her like
the blind turning toward sun. 'A singer vouches. Well then.'`
  : `The old man weighs the silence, and then the page, and chooses
the way the coast always chooses: for knowing over safe.`}

His fingers descend to the cord-script, and begin to walk it, and
his face goes through forty centuries in four minutes.

# 'Sit down, children,' says Tally-of-Welt at last. 'This is not
a ledger page. This is a CONTRACT. And there are three parties
on it.'`,
      choices: [
        { text: "Hear the contract read entire.",
          fx: { xp: 15 }, goto: "c2_quill_reading" },
      ],
    },

    "c2_quill_reading": {
      text: `'Party the first: the BORROWER.' The blind fingers walk the opening
knots. 'No name — a description: THAT WHICH WOULD BE. It borrowed
substance against the world's stock to purchase existence. The
loan is itemized, children, and the itemization runs nine knots
deep, and I will not read it aloud at ebb-tide over open water.

'Party the second: the SURETY. The Salt-Mother, the Tidemother,
she of the Tenth Song. She guaranteed the borrower's repayments —
pledged her OWN holding against its defaults. The Nine Anchors
are her collateral posted: nine points of held coast, value
sufficient to cover the principal.' The fingers pause. 'Her
co-signature is tied in grief-cord. She did not guarantee the
thing because she trusted it. She guaranteed it because it could
not otherwise have existed at all, and she was a HOLDER, and it
asked.'

The fingers reach the third signature block, and stop, and Tally-
of-Welt lifts his blind face to where Quill breathes.

'Party the third, witnessing and administering, holder of record,
collector of schedule: the OFFICE OF THE SHORE. The feather,
children. The feather is ON the original note.' The old man's
voice goes thin as worn cord. 'Your Lady did not inherit the
Tidemother's accounts after the fact. She DRAFTED this. Four
thousand years ago. She is not the executor of the arrangement.

# 'She is its CLERK. And a clerk who has administered one loan for
forty centuries, children, has had a very long time to decide
what happens at the term's end — and a very long time to make
sure the deep book said whatever she needed it to say.'`,
      on_enter: { flags: { c2_page_read: true, c2_quill_quest_done: true },
                  approval: { quill: 8 } },
      choices: [
        { text: "Fold the page away. The Great Ebb just changed meaning.",
          fx: { xp: 25 }, goto: "c2_drowned_market" },
      ],
    },

    // -------------------------------------------------------- vex: the name
    "c2_vex_vault": {
      text: (s) => `Vex finds you in the lee of a salvage stall, and for once there is
no patter at all.

'Her ledgers are open to you,' they say. 'Or open enough. So I
went and READ MY ACCOUNT, like an idiot, like you do.' The glove
comes off. The brand has grown another ring of cord-lines, fine
as engraving, tightening toward the wrist-bones. 'The debt's not
MONEY, friend. It was never money. Money she shreds for bedding.
The principal on a Rook brand is the NAME. You borrow, and what
you've pledged is who you are — and when the Great Ebb comes and
she calls the book, every branded name on this coast goes into
her keeping. Mine's just further along: I've been hers so long
there's a JAR, an actual jar, in the annex vault, with my name in
it, and the thing on my wrist is the RECEIPT.'

${s.flag("c2_rook_pact")
  ? `'And you're her CONTRACTOR now, which makes this conversation
insubordination, probably.' The grin is a ruin. 'So. Insubordinate
with me? The vault posts thin at the ebb-change. I know the annex.
I know the filing system. I have spent eleven years not asking
you for things, and I am asking.'`
  : `'I can't lift it alone. Annex vault, cord-locks, a Tally-Master
who never sleeps because he never anything-elses either. But the
posts thin at the ebb-change, and I know the filing system, and I
have spent eleven years not asking you for things.' The grin is
a ruin. 'I'm asking.'`}

# 'Help me steal my name back.'`,
      choices: [
        { text: "'Eleven years you've had my answer. Map the vault.'",
          fx: { xp: 15, approval: { vex: 10 } }, goto: "c2_vex_heist" },
        { text: "'There's another door: I'm flagged for her table. I'll " +
                "BUY your name out, face to face, on the record.'",
          fx: { xp: 15, approval: { vex: 4 },
                flags: { c2_vex_by_table: true } },
          goto: "c2_vex_heist" },
      ],
    },

    "c2_vex_heist": {
      text: (s) => `${s.flag("c2_vex_by_table")
  ? `The table, then. You walk into the annex at open business hours
with Vex at your shoulder wearing the expression of a cat being
carried into water, and you put it to the duty-clerk in the
coast's own language: REDEMPTION BY THIRD PARTY, account of Vex,
full principal, quote me.

The annex goes counting-room quiet. The duty-clerk descends to
the vault and returns not with a quote but with the Tally-Master
himself, who sets the jar — small, black-glazed, sealed in
cord-script — on the counter between you like a piece in a game
whose rules he is about to enjoy explaining.

'Principal: one name, eleven years seasoned, tied' — the abacus
of knuckle-bones clicks once — 'to the deep book. Madam's terms
for THIS account, wanderer: not gold. Gold is for debts. For a
NAME, the price is a name. Pledge your own — one ring, one
season's lien, a formality for an account in your standing —
and the clerk Vex walks out whole.'

Vex's hand closes on your arm: 'NO. That's the HOOK, that's how
she—'`
  : `The ebb-change, then. The annex at slack water is four clerks,
one lamp, and the Tally-Master at his eternal desk — and Vex
takes you in through the salvage-hatch nobody files because
nobody else can fit, down a crawl of black wood and brass to
the vault's cord-locked door.

The locks are knots. Of course the locks are knots. ${
    s.inParty("oshka") ? "And you have brought, against all the annex's actuarial tables, the last brine-singer on the coast, who kneels at the door and sings the locks the song they were tied to, and they open like flowers deciding it's morning."
    : s.hasItem("c2_knot_knife") ? "And you have brought the Knot-Knife, whale-bone and salt-iron, made for exactly the heresy of cutting what should not hold."
    : "Vex's hands walk them, eleven years of debtor's intimacy with the house's systems turned at last to burglary."}

Inside: shelves to the dark, jars beyond counting, each black-
glazed, each sealed, each NAMED — the principal of the whole
coast's borrowing, ranked and racked. Vex finds their own by
feel, like a man finding a wound.

And the lamp behind you says, conversationally:

'Withdrawal, is it.'

# The Tally-Master fills the vault door, abacus in hand, and
begins, unhurried, to count you.`}`,
      choices: (function () {
        return [
          { text: "Pledge the ring. One season of YOUR name on her books, " +
                  "against everything you already are.",
            when: has("c2_vex_by_table"),
            fx: { xp: 30, karma: 6, flags: { c2_vex_freed: true,
                                             c2_self_pledged: true },
                  approval: { vex: 15 } },
            goto: "c2_vex_freed" },
          { text: "Counter at the table: her own amendment binds her — " +
                  "'lines I take up STAY SAVED.' Vex is a line. Take it up. " +
                  "[Wits]",
            when: (s) => s.flag("c2_vex_by_table") && s.flag("c2_rook_amended"),
            check: { stat: "wits", dc: 12, ok: "c2_vex_freed",
                     fail: "c2_vex_priced",
                     ok_fx: { xp: 35, karma: 5,
                              flags: { c2_vex_freed: true } } } },
          { text: "Fight the Tally-Master in his own vault.",
            when: (s) => !s.flag("c2_vex_by_table"),
            combat: { enemy: "c2_tally_master", win: "c2_vex_freed",
                      win_fx: { xp: 40,
                                flags: { c2_vex_freed: true,
                                         c2_vault_robbed: true } } } },
          { text: "Talk him still: he's a CLERK — demand the withdrawal " +
                  "form. There is always a form. [Wits]",
            when: (s) => !s.flag("c2_vex_by_table"),
            check: { stat: "wits", dc: 14, ok: "c2_vex_form",
                     fail: "c2_vex_vault_fight",
                     ok_fx: { xp: 35, karma: 2 } } },
        ];
      })(),
    },

    "c2_vex_vault_fight": {
      text: `'Form 9-Black,' the Tally-Master allows, knuckle-bones clicking
through the lamplight, 'does exist. Withdrawal of principal,
third-party, duress-adjacent.' The abacus stops. 'It requires
madam's counter-signature, the debtor's original wrist, and' —
he sets the abacus down, which you understand at once is the
worst sound the annex makes — 'the filing clerk's discretionary
approval. DENIED. I have been discretionary for nine hundred
years, little accounts.

# 'The house thanks you for your custom.'`,
      choices: [
        { text: "Vault-work, then.",
          combat: { enemy: "c2_tally_master", win: "c2_vex_freed",
                    win_fx: { xp: 40, flags: { c2_vex_freed: true,
                                               c2_vault_robbed: true } } } },
      ],
    },

    "c2_vex_form": {
      text: `Nine hundred years of discretion, and what undoes it is PROCEDURE,
lovingly weaponized.

You cite the redemption precedent from the Saltmere office, set
loose in the room like a ferret. You invoke the open-ledger
clause of your own standing. Quill's training, Vex's eleven
debtor's years, your road-lawyer nerve — between the three the
form assembles itself in the Tally-Master's own hands, every box
unrefusably ticked, and you watch a nine-century clerk confront
the one thing his kind cannot fight:

A correctly completed form.

'Madam,' he says at last, heavily, 'will want to have watched
this.' The knuckle-bones click once — an entry, a surrender, a
SALUTE, possibly all three — and he breaks the cord-seal himself,
because procedure, once satisfied, is satisfied entire.

# 'The house,' he says, with what is almost certainly irony,
nine hundred years cured, 'thanks you for your custom.'`,
      choices: [
        { text: "Take the jar into your own hands.",
          fx: { xp: 20 }, goto: "c2_vex_freed" },
      ],
    },

    "c2_vex_priced": {
      text: `The duty-clerks rule against your reading of the amendment —
'lines, wanderer, refers in the instrument to MOORING-lines;
see definitions, schedule C' — and the Tally-Master's abacus
clicks the verdict home with what might, in nine hundred years
of practice, be sympathy.

The jar goes back to the dark shelf. The price stands: a name
for a name, whenever you choose to pay it.

Vex walks out of the annex ahead of you, glove on, shoulders
set, and says nothing the length of the Market — and then, at
the lantern-lines' end, quietly, without turning:

'You tried the clean way first. Eleven years, nobody ever tried
the clean way first.' A breath. 'The ebb-change still thins the
posts, friend. When you're ready to be insubordinate properly,
I still know the filing system.'

# In your pocket, if it could, the tally-coin would be purring.`,
      on_enter: { flags: { c2_vex_quest_done: true },
                  approval: { vex: 6 } },
      choices: [
        { text: "Back into the Market's noise.",
          goto: "c2_drowned_market" },
      ],
    },

    "c2_vex_freed": {
      text: (s) => `The jar is lighter than it should be and warmer than it has any
right to be, and when Vex breaks the seal — nobody else's hands
would do; some things you repossess personally — what comes out
is not smoke or light or anything the stories stock.

It's a BREATH. The breath you take before you say who you are.

Vex inhales it the way the drowning inhale the surface, and for
one long moment stands there in the lamplight being entirely,
unwitnessably themselves — and you look away, because some
reunions are not for audiences, and looking away is the last
gift the road ever taught you to give.

The brand goes out like a watched coal. It doesn't vanish —
eleven years leave scar — but the cord-lines unpick themselves
ring by ring until what's left on the wrist is only history,
not LIEN.

'Right,' says Vex, at last, voice frayed and grin rebuilt,
flexing the unowned hand. 'Right. Whole new problem: who am I
when nobody holds the paper? Never had to know.' The grin
finds its true old shape, the one from before the Millrun.
'Looking forward to finding out. Drinks are on me for a DECADE.'

# ${s.flag("c2_self_pledged")
  ? "On your own wrist, faint as a watermark, one thin ring of cord-line settles in: her season's lien, your pledged ring, the price you chose. It does not hurt. That, you suspect, is the design."
  : "Somewhere above, in a black-wood room, a column has been adjusted, and you would bet the coast itself that the adjustment was initialed without surprise."}`,
      on_enter: { flags: { c2_vex_quest_done: true } },
      choices: [
        { text: "Out, with Vex walking lighter than you've ever seen.",
          fx: { xp: 20 }, goto: "c2_drowned_market" },
      ],
    },

    // ---------------------------------------------------------------- camp
    "c2_camp": {
      text: (s) => {
        const departures = HC.helpers.camp_departures(s);
        return `${departures}The high gallery is the Market's overnight commons: dry sand, old
fire-rings, the tide-bell's count softened by rock to a heartbeat.
Stallholders and marsh-guides and one off-duty knot-doctor share
embers and the coast's last commodity, which is company.

Your own fire draws its circle. The talk goes where fires take it.`;
      },
      choices: [
        { text: "Sit with Oshka and the Psalter.",
          when: inp("oshka"), goto: "c2_camp_oshka" },
        { text: "Sit with Quill and the terrible arithmetic.",
          when: inp("quill"), goto: "c2_camp_quill" },
        { text: "Sit with Vex and say nothing, professionally.",
          when: inp("vex"), goto: "c2_camp_vex" },
        { text: "Sleep, and let the bell count for you.",
          fx: { heal_full: true, xp: 10, flags: { c2_camped: true } },
          goto: "c2_drowned_market" },
      ],
    },

    "c2_camp_oshka": {
      text: (s) => `Oshka runs the Psalter-cord through her fingers in the firelight,
knot by knot, and for once the working voice is quiet.

'Nine songs,' she says. 'I learned them at my mother's oar-bench.
She learned them at her mother's. Four thousand years of singers,
and you know what we never asked? What the NINTH is FOR. The
first eight hold the coast. The ninth — the ninth doesn't hold
anything, walker. I know every verse, and it doesn't hold. It
SOOTHES.' Her fist closes on the cord. 'It's a lullaby. We've
been singing something at the bottom of the world to SLEEP, all
this time, in shifts, and calling it worship, and the shifts have
ended because the singers are dead, and it's waking up not
because the knots failed —

# ' — the knots are failing because NOBODY'S SINGING IT DOWN
THERE ANYMORE. The mooring was never only cord, walker. It was
attention. It always, always is.'

${s.approval("oshka") >= 25
  ? `She looks up, tide-eyes firelit. 'When we go down — at the Ebb —
I'm going to sing it the ninth song myself, last singer, full
voice, whatever else we do down there. Every held thing deserves
the song it was held with. Even that one. MAYBE especially that
one.'`
  : `She doesn't say what she's deciding. But the cord stays in her
fist all night, and the knot her thumb keeps finding is the
ninth.`}`,
      on_enter: { approval: { oshka: 5 } },
      choices: [
        { text: "Back to the fire-circle.", fx: { xp: 10 }, goto: "c2_camp" },
      ],
    },

    "c2_camp_quill": {
      text: (s) => `Quill has built, out of salvaged slate and ledger-discipline, a
model of the doom of the coast, and walks you through it because
sharing arithmetic is how clerks say they're frightened.

'Rate of mooring failure: doubling each season. The Lady's
acquisition rate: ALSO doubling, half a season behind. The term
concludes at the Great Ebb — that's not folklore, it's in the
note. So.' The chalk hovers. 'Either somebody re-ties or re-signs
the Nine — which singers say takes a holder the size of the
Tidemother, who is GONE. Or the Debtor defaults and the dark
takes the collateral, which is everyone. Or the Lady completes
her paper holding first, and the coast survives as — as an
ASSET, held in black glaze on a long shelf.' The chalk sets
down. 'Three outcomes, and the kindest one is a filing cabinet.'

${s.flag("c2_page_read")
  ? `'Except.' The grey eyes come up with the lucid fury banked to
coals. 'Page seventy-one has three signatures, and I keep
thinking about the third. She DRAFTED the note. Clerks draft to
the client's instruction, friend — I'd know. So whose CLIENT
was she, four thousand years ago? Find me that, down there,
and I'll find you a fourth outcome. There's always a fourth
outcome. It's just never been FILED.'`
  : `'There's a missing variable,' they say, tapping the slate's
one empty box. 'I was three years in that office. Nothing she
does is reactive. She's not racing the default, friend — she's
SCHEDULED around it. Like she's always known the date. I need
to get at why.'`}`,
      on_enter: { approval: { quill: 5 } },
      choices: [
        { text: "Back to the fire-circle.", fx: { xp: 10 }, goto: "c2_camp" },
      ],
    },

    "c2_camp_vex": {
      text: (s) => `You sit with Vex at the fire's edge, and you say nothing,
professionally, and Vex says nothing back, expertly, and a
quarter-hour of the tide-bell's count goes by like that, in the
craft's own companionable register.

${s.flag("c2_vex_freed")
  ? `'I keep TESTING it,' Vex says eventually, flexing the unowned
hand at the embers. 'The name. Saying it in my head with nobody
holding the paper. You know what it does, friend? NOTHING. It
just sits there, being mine. Eleven years I dreamed of how it'd
feel and the answer is it feels like a Tuesday, and I have
never in my life been so attached to a Tuesday.'`
  : s.flag("c2_vex_kept_distant")
    ? `'You keep your distance like a professional,' Vex says at last,
to the fire, 'and I keep mine, and between the two of us there's
a rope's length nobody's pulled on yet. She'll pull it at the
Ebb, you know. Whatever I'm collateral FOR, it's down there.'
The grin, sideways, a working tool. 'When she does — pull back.
That's all. Nobody ever pulls back.'`
    : `'Eleven years she's held the paper,' Vex says at last, to the
fire. 'After a while you forget which habits are yours and which
are the brand's. The tenth-rule. The exits-first thing. The not
sleeping until the room's cased.' A knife appears, turns over,
disappears — punctuation. 'At the Ebb she calls the book. One
way or the other, friend, I'm getting some habits back.'`}

# The fire pops. Down-cave, the tide-bell counts. It is, by the
craft's own register, an excellent conversation.`,
      on_enter: { approval: { vex: 5 } },
      choices: [
        { text: "Back to the fire-circle.", fx: { xp: 10 }, goto: "c2_camp" },
      ],
    },

    // ------------------------------------------------------- the great ebb
    "c2_great_ebb": {
      text: (s) => `The criers don't cry it. That's how you know.

It moves through the Drowned Market as a CHANGE OF WORK: scales
packed without haggling, lantern-lines doused section by section,
the knot-doctor distributing her splints for free with both hands.
The tide-bell has stopped counting hours, because the next ebb is
not an hour of the day. The Great Ebb. The lowest water of the
age. By the old reckoning — Oshka's reckoning, Quill's arithmetic,
the Watch's bearing, the note's own term — the sea will draw back
tomorrow night farther than living memory, and for one turning of
the glass the road to the Ninth Anchor will lie open across the
naked seafloor.

Everything on the coast that knows anything is converging on it.
The Watch's bell has begun a new toll — MUSTER. The Corvid annex
empties northward in feathered columns, madam's whole strength
moving toward the headland with vault-wagons in train. ${
        s.flag("c2_rook_pact")
          ? "Your tally-coin has gone cold and exact in your pocket: a summons, the office's own register. A chair is being carried down to the seafloor with your name on it."
          : "And a Corvid runner finds you even now, bows, and leaves a single black card: the Lady's table relocates, tomorrow, to the SETTLEMENT. Your chair travels with it, claimed or no."}

${s.inParty("oshka") || s.inParty("quill") || s.inParty("vex")
  ? `Your own people look to you across the dying lantern-light, and
nobody says the thing, because the thing has been said by the
whole coast all season:`
  : `You stand alone in the dying lantern-light, and the whole
season says the thing for you:`}

# Term concludes. Settlement attended. The bottom of the world is
about to be, for one hour, a PLACE — and every party to the
original note is invited.`,
      choices: [
        { text: "Make ready, and walk down with the tide.",
          fx: { xp: 20, heal_full: true }, goto: "c2_ebb_road" },
      ],
    },
  };

  HC.registerScenes("ch2", SCENES);
})(globalThis.HC);
