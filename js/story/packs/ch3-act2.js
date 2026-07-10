/* Chapter 3, Act 2: the Wrack Market and the deep Roads.
   The mid-chapter hub: the Pale Merchant's stall, the Moorwife's table and
   her warden's writ, the expedition to the charter vault at the Bitts, the
   descent to Berth One and the Oldest Tenant, Nan's and Cobb's personal
   reckonings, the Tidemother's last verse, camp — and the Overtide, which
   ends the arguing and starts the finale. */
(function (HC) {
  "use strict";

  const SCENES = {

    // ---------------------------------------------------------------- hub
    "c3_wrack_market": {
      text: [
        { if: { has: "c3_overtide_called" },
          text: `The Wrack Market is battening down. Stalls fold; rafts double
their lines; the retired riding lights burn low and close, like
lamps in a house that has heard the weather coming. Down the
market's length, everything that can hold is holding, out of ten
thousand years of habit — and everything that can't is looking,
for the first time, at the stair to the Breakwater.` },
        { text: `The Wrack Market is the only commerce an afterward has, and it
turns out an afterward has plenty: stalls of spent luck, sold by
the pinch for remembering with; secondhand rests ('gently used,
owner unexpectedly retained'); a bottle-fleet exchanging old names
like scrimshaw. The stallholders are moored. The customers are
moored. The gossip is EXCELLENT, being ten thousand years deep
and fact-checked by lintels.

At the market's deep end, high and narrow and pale, the Merchant's
stall stands unfolded, doing brisk trade. Near the fish-stalls —
there are fish-stalls; you decide not to ask — the Moorwife keeps
a plain table with two chairs and a pot of tea, the way other
monarchs keep a throne room. And past the market's edge, down
their separate waters, lie the two places every whisper in the
market keeps circling: the Bitts, where the charter is chained —
and Berth One, at the harbor's root, where the oldest arrival
has been moored, at its own request, since keeping began.` },
      ],
      choices: [
        { text: "The pale stall at the deep end.",
          goto: "c3_pale_stall" },
        { text: "The Moorwife's table. Two chairs, and one of them for you.",
          when: { hasnt: "c3_table_done" },
          goto: "c3_moor_table" },
        { text: "The Bitts. The charter vault, and the page that ends " +
                "mid-sentence.",
          when: { hasnt: "c3_vault_done" },
          goto: "c3_bitts" },
        { text: "Berth One. Down the harbor's root, to the oldest tenant.",
          when: { hasnt: "c3_tenant_met" },
          goto: "c3_berth_row" },
        { text: "Nan has stopped walking. She is looking down a pier row like " +
                "a woman reading her own headstone. Go with her.",
          when: { all: [{ inp: "nan" }, { hasnt: "c3_nan_quest_done" }] },
          goto: "c3_nan_raft" },
        { text: "Cobb has his head cocked at the water. 'Bell,' he says. " +
                "There is no bell. Go with him.",
          when: { all: [{ inp: "cobb" }, { hasnt: "c3_cobb_quest_done" }] },
          goto: "c3_cobb_buoy" },
        { text: "The white ship. She asked you to come again — and to carry " +
                "something.",
          when: { all: [{ has: "c3_white_done" },
                        { hasnt: "c3_verse_given" }] },
          goto: "c3_white_verse" },
        { text: "Stand the towed-back rafts new lines and stores, quietly, " +
                "through a stallholder. (-30 gold)",
          when: { all: [{ gold: 30 }, { hasnt: "c3_funded_rafts" }] },
          fx: { gold: -30, karma: 5, xp: 15,
                flags: { c3_funded_rafts: true } },
          goto: "c3_wrack_market" },
        { text: "Make camp on a hulk deck among the rafts.",
          when: { hasnt: "c3_camped" },
          goto: "c3_camp" },
        { text: "Back up the stair to the quay.",
          goto: "c3_quay" },
        { text: "The water is WRONG. The whole market feels it at once — the " +
                "Long Water is rising, all of it, everywhere. Go to the " +
                "Moorage bell. (There is no coming back from what follows.)",
          when: { any: [{ has: "c3_knows_clause" },
                        { has: "c3_tenant_met" }] },
          fx: { xp: 15 }, goto: "c3_overtide" },
      ],
    },

    // ------------------------------------------------------ the pale stall
    "c3_pale_stall": {
      text: (s) => {
        const greeting = s.flag("met_merchant")
          ? `'Wanderer.' The Pale Merchant does not look up from his ledger,
because he does not need to; your account, you suspect, announced
you from the stair. 'Three coasts, now. You do keep turning up at
the ends of things — a valuable trait in a customer. In inventory,
fatal.'`
          : `'A LIVE one.' The Pale Merchant looks up from his ledger with the
pleasure of a man finding an error in his favor. 'And new to my
counter. Remarkable. I had an annotation ready for you regardless
— I keep them ready for everyone. Sound practice, in my trade.'`;
        return `${greeting}

The stall's stock, here at the market's deep end, is the purest
expression of his trade you have ever seen: shelf on shelf of
CONCLUDED BUSINESS. Final words, certified. Endings of stories
otherwise lost. A small brass case labeled LAST CHANCES, ASSORTED,
SURRENDERED UNUSED.

'Everything here is finished, you see,' he says, following your
eye. 'Finished is my favorite condition of merchandise. It holds
its value forever — nothing appreciates like a thing that cannot
happen again.' He closes the ledger on a ribbon. 'Which is why
this harbor offends me, wanderer, professionally: ten thousand
years of the finest concluded stock in existence, and the
management will not let one item LEAVE THE SHELF.'

# 'Ask your questions. The first is free. The first is always
free; it is the finest pricing discovery in the trade.'`;
      },
      choices: [
        { text: "'You've traded here across worlds. Tell me about the Roads, " +
                "the charter, and what got eaten.'",
          fx: { xp: 10 }, goto: "c3_pale_counsel" },
        { text: "See his wares.",
          goto: "c3_pale_shop" },
        { text: "Back into the market.",
          goto: "c3_wrack_market" },
      ],
    },

    "c3_pale_counsel": {
      on_enter: { flags: { c3_asked_pale: true }, xp: 20 },
      text: `He tells it the way he tells everything: as provenance.

'The Roads predate my custom, which is saying a great deal. The
charter is older than the loom, older than the Nine — it is, in my
professional assessment, the SECOND arrangement ever made. The
first arrangement was that things would hold. The second was that
things which finished holding would be received. Somebody had to
draft where the tides go, wanderer. You have met the sort of
parties who draft such things. They are all VERY careful with
their paper.'

He aligns his ledger a quarter-inch, which is his way of clearing
a throat.

'The charter ran two pages. Page one: NOTHING THAT HELD SHALL BE
LOST — receipt, berth, keeping, everything this harbor executes so
beautifully. Page two: the RELEASE. The lock-hours of the gate,
the going-out, the rest itself, drawn in full. And in the first
age of the Roads, page two was eaten. Not stolen — I could FIND
stolen — eaten, wanderer, chewed and swallowed by something small
and terrified in the dark of the vault, and the Moorage has kept
the survivors moored on page one's authority ever since. One
sentence, no ending. The keeper is not a tyrant. She is an office
executing HALF A DOCUMENT, forever.'

You ask — because with him there is always inventory — whether
copies exist.

The pause that follows is the most expensive silence you have ever
stood in.

'One,' says the Pale Merchant. 'Certified. Acquired at ruinous
cost, three worlds ago, from a party I will not name in a
jurisdiction that no longer exists. It is not for sale for GOLD,
before you insult us both. Should the moment come — you will know
the moment; it will be loud — my price is the usual price, the
only price I have ever charged you: something of yours that is
FINISHED. Paid at the counter, at the moment, in view of the
whole Roads.'

# 'ALL DEBTS HONORED, wanderer. Mine, yours — and this harbor's.
The sign has been waiting ten thousand years to mean it.'`,
      choices: [
        { text: "'Keep it certified, merchant. The moment is coming.' Back " +
                "to his wares.",
          goto: "c3_pale_shop" },
        { text: "Back into the market, carrying the shape of a plan.",
          goto: "c3_wrack_market" },
      ],
    },

    "c3_pale_shop": {
      text: `The practical shelf — 'for the still-breathing trade; niche, but I
keep it stocked' — offers salvage refitted with his usual unnerving
exactness, each tag in a hand too fine to read without wanting to.

A wrack-gaff, balanced like an argument won. A stillwater oar,
'previously owned by a strong opinion.' A drowned wool coat. Harbor
hardtack, Moorage tea 'liberated from the towing-back stores,' and
a squat black bottle of Last-Light Cordial that glows faintly, like
the hour it was distilled from.

He will also, the small sign notes, BUY. The sign is looking at
you when it notes this.`,
      choices: [
        { text: "Buy the wrack-gaff. (25 gold)",
          when: { gold: 25 },
          fx: { gold: -25, "items+": ["c3_wrack_gaff"] },
          goto: "c3_pale_shop" },
        { text: "Buy the stillwater oar. (45 gold)",
          when: { gold: 45 },
          fx: { gold: -45, "items+": ["c3_grey_oar"] },
          goto: "c3_pale_shop" },
        { text: "Buy the drowned wool coat. (30 gold)",
          when: { gold: 30 },
          fx: { gold: -30, "items+": ["c3_drowned_coat"] },
          goto: "c3_pale_shop" },
        { text: "Buy harbor hardtack. (10 gold)",
          when: { gold: 10 },
          fx: { gold: -10, "items+": ["c3_hardtack"] },
          goto: "c3_pale_shop" },
        { text: "Buy Moorage tea. (20 gold)",
          when: { gold: 20 },
          fx: { gold: -20, "items+": ["c3_moorage_tea"] },
          goto: "c3_pale_shop" },
        { text: "Buy the Last-Light Cordial. (40 gold)",
          when: { gold: 40 },
          fx: { gold: -40, "items+": ["c3_last_cordial"] },
          goto: "c3_pale_shop" },
        { text: "Sell him the page of the master ledger. He has wanted it " +
                "across two worlds. (+30 gold)",
          when: { item: "c2_ledger_page" },
          fx: { gold: 30, "items-": ["c2_ledger_page"],
                flags: { c3_sold_page: true } },
          goto: "c3_pale_shop" },
        { text: "Sell him your berth token. ('A prepaid berth on the Roads? " +
                "VERY collectible.') (+25 gold)",
          when: { item: "c3_berth_token" },
          fx: { gold: 25, "items-": ["c3_berth_token"], karma: -2,
                flags: { c3_sold_token: true } },
          goto: "c3_pale_shop" },
        { text: "Back into the market.",
          goto: "c3_wrack_market" },
      ],
    },

    // -------------------------------------------------- the moorwife's table
    "c3_moor_table": {
      on_enter: { flags: { c3_table_done: true }, xp: 20 },
      text: `The Moorwife pours before you sit. The tea is the grey strong kind,
the towed-back kind, and she serves it to you personally with the
unhurried certainty of a woman who has outlasted every argument
ever brought to this table.

'You've been busy,' she says, comfortably. 'The deep berths. The
office desk. The Bitts next, I expect, or the root — the live ones
always work inward.' She turns her cup a quarter-turn. 'So before
you get to the middle of my harbor and decide what I am, wanderer,
you will do me the courtesy of hearing what I am FROM me.'

She tells you. It takes one cup.

'I have kept the Roads for ten thousand years, and in ten thousand
years I have lost NOTHING. Say it back to yourself slowly, because
no keeper of anything, anywhere, in any world you have walked, can
say it: not one soul. Not one luck. Not one lullaby, not one name,
not one god of one doorstep — everything that was ever spent
holding your worlds together came down that water worn to
threads, and I took every one of them in, and spliced every line,
and trimmed every light, and NOT ONE OF THEM HAS EVER BEEN LOST.
Every keeper above me holds by letting the water take the spent
away and calling it rest because the alternative is unbearable.
I AM the alternative. I bear it.'

She refills your cup, exactly.

'And now the settlements have shaken the water, and the rafts try
the gap, and a live one walks my quay pulling on lines, and
everyone says the word REST at me as though I have not stood at
that gate ten thousand years watching the Open give back NOTHING.
Show me rest, wanderer. Show me one wake that ever returned to say
the word was true.' She sets down the pot. 'Until then: nothing
that held shall be lost. Not while I keep.'

# It is the best case you have ever heard argued for a jail, and
she makes it with her own hands cracked from ten thousand years of
splicing, and the terrible thing, the truly terrible thing, is
that every word of it is LOVE.`,
      choices: [
        { text: "'Then deputize me. Give me a warden's writ and open your " +
                "harbor's books. If keeping is defensible, let it be SEEN.'",
          fx: { xp: 15 }, goto: "c3_moor_offer" },
        { text: "'You bear it so well that nobody's allowed to put it down — " +
                "including you.' Decline the tea, gently, and the premise " +
                "with it.",
          fx: { xp: 15, karma: 2 }, goto: "c3_moor_refused" },
      ],
    },

    "c3_moor_offer": {
      text: `She studies you one long splice-checking moment — then reaches into
her coat and lays a paper on the table: tarred ink, one page, and
the seal of the coiled line.

'Warden's writ. Bearer acts for the Moorage in all matters of
KEEPING.' The word does a small amount of work in her mouth. 'The
Bitts will pass you. The wardens will answer you. The books are
the walls, wanderer — you've seen my office; every line is the
ledger and every ledger is live.' She stands, gathering the pot.
'I give this to the live ones who ask, once a millennium or so,
because keeping that cannot be inspected is exactly what you
suspect me of. Inspect. You will find what the last five found:
nothing lost. Nothing lost, forever.'

At the market's edge she pauses, her back to you.

'The last five,' she says, 'all asked me the same question at the
end, before their waters took them home. You'll ask it too. Ask
it now and save us the tide.'

You ask it: WHO KEEPS THE KEEPER?

# 'There it is.' She almost, almost laughs. 'Ten thousand years,
wanderer. If anything were keeping me, don't you think it would
have TRIMMED MY LIGHT by now?' And she walks back to her office,
broad-handed, unheld, the only unmoored soul in her whole harbor.`,
      on_enter: { "items+": ["c3_moor_writ"], flags: { c3_moor_sworn: true },
                  xp: 15 },
      choices: [
        { text: "Pocket the writ. Back into the market.",
          goto: "c3_wrack_market" },
      ],
    },

    "c3_moor_refused": {
      text: `She takes the refusal without a flicker — files it, the way this
harbor files everything, somewhere safe where it will never be
lost or looked at.

'The live ones usually say something of the kind.' She stacks
your untouched cup on the pot, wipes the ring it left, restores
the table to perfect order. 'You'll go to the Bitts anyway, and
the root, and my wardens will be gentle with you, because my
wardens are gentle with everything; it is the entire discipline.
And when your water calls you home, wanderer, the Roads will
still be here, and every light will still be burning, and you
may tell whatever you serve up there' — the first edge she has
ever shown, fine as the sixth strand — 'that the woman at the
bottom of the world KEEPS WHAT THEY SPEND.'

# She leaves you with the bill, which is nothing, which is the
whole trouble: nothing here costs anything, ever, except the one
thing, which costs everything.`,
      on_enter: { flags: { c3_moor_refused_f: true }, xp: 15 },
      choices: [
        { text: "Back into the market.",
          goto: "c3_wrack_market" },
      ],
    },

    // ------------------------------------------------- the bitts (charter)
    "c3_bitts": {
      text: `The Bitts stand at the end of a causeway off the market's edge: two
ancient iron bollards, each thicker than a mast, and between them —
chained through both, chained the way you chain a thing from
ITSELF — a vault of grey stone with a door of grey iron, the oldest
structure on the Roads by the look of the water-wear.

The charter is in there. The whole harbor knows it the way a body
knows where its heart is kept.

Two wardens hold the causeway, soft rope coiled, gentle as ever
and immovable as ever, and the tide-slick stones between you and
the door offer exactly three kinds of approach.`,
      choices: [
        { text: "Present the warden's writ. Bearer acts for the Moorage in " +
                "all matters of keeping — and this is a matter of keeping.",
          when: { item: "c3_moor_writ" },
          fx: { xp: 15 }, goto: "c3_charter_vault" },
        { text: "[Wits] The wardens change at the turning of the watch, and " +
                "the causeway has a tide-shadow. Time it. Walk it.",
          check: { stat: "wits", dc: 13,
                   ok: "c3_charter_vault", fail: "c3_bitts_caught",
                   ok_fx: { xp: 25 },
                   fail_fx: { xp: 10 } } },
        { text: "The direct approach: gaff against soft rope, on the " +
                "causeway, for the charter of the afterward.",
          combat: { enemy: "c3_moor_wardens",
                    win: "c3_charter_vault", flee: "c3_wrack_market",
                    win_fx: { xp: 30 } } },
      ],
    },

    "c3_bitts_caught": {
      text: `The tide-shadow, it turns out, is where the RELIEF watch stands.

They take you up the way they take up everything — gently,
completely, with tea already steeping somewhere behind them — and
walk you back down the causeway with your arms held the way
mothers hold the arms of children near deep water.

'The vault is a matter of keeping,' the elder warden explains,
kind and final. 'Keeping matters keep. If you want the door, the
door has a keeper, and the keeper has a table, and the table has
two chairs. Everything here is ASKABLE, live one.' A pause, and
then, softer, the crack in the whole institution showing for one
heartbeat: 'Everything except the one question, anyway.'

You could go be asked to leave politely. Or you could stop being
polite about it.`,
      choices: [
        { text: "Stop being polite about it.",
          combat: { enemy: "c3_moor_wardens",
                    win: "c3_charter_vault", flee: "c3_wrack_market",
                    win_fx: { xp: 30 } } },
        { text: "Withdraw to the market and come at the vault another way.",
          fx: { xp: 5 }, goto: "c3_wrack_market" },
      ],
    },

    "c3_charter_vault": {
      text: `The vault is one room, and the room is one table, and the table is
one book — chained through its spine to both Bitts at once, so
that the harbor's two oldest fixtures exist, you now see, purely
as this book's shackles.

THE CHARTER OF THE ROADS. The hand is older than Rook's, older
than cord-script, the letters half knot and half wound. Page one
lies open, immaculate, ten thousand years read and re-read:
RECEIPT. BERTH. KEEPING. And the sentence, the whole scripture of
this place, inked at the bottom like a horizon: NOTHING THAT HELD
SHALL BE LOST —

and there the page turns, and there is no page.

A stub. A torn margin, close against the spine, the wound of it
old and dry — and moving on the stub, pale and patient, fat as a
mooring line, a LEECH of the vault's own dark, grazing along the
torn edge the way stock grazes a fence line, keeping the wound
OPEN. It has been eating the regrowth, you understand with a lurch:
the charter has been trying to heal for ten thousand years, and
something keeps cropping the new words as they come.`,
      choices: [
        { text: "Kill it. Whatever's been keeping the ending cropped short " +
                "dies today.",
          combat: { enemy: "c3_ledger_leech",
                    win: "c3_charter_read",
                    win_fx: { xp: 30, flags: { c3_leech_slain: true } } } },
        { text: "[Spirit] Still it. It is small, and blind, and somebody SET " +
                "it here — grazing beasts don't choose the field.",
          check: { stat: "spirit", dc: 13,
                   ok: "c3_charter_read", fail: "c3_charter_read",
                   ok_fx: { xp: 30, karma: 3,
                            flags: { c3_leech_stilled: true } },
                   fail_fx: { xp: 15, hp: -5, karma: -1 } } },
      ],
    },

    "c3_charter_read": {
      text: (s) => {
        const leech = s.flag("c3_leech_stilled")
          ? `The leech stills under your hand like a fear talked down, and when
it stops grazing you can read what it was set to crop.`
          : `With the leech dealt with, the wound in the book lies bare, and
along the torn margin — regrown, faint, like skin over an old
scar — you can read what it was set to keep eaten.`;
        const page = s.hasItem("c2_ledger_page")
          ? `

And the page of the master ledger in your pack — page seventy-one,
the one the blind scribe would not read at ebb-tide over open water
— goes WARM against your back as you read, and you finally take it
out, here, at the bottom of everything, and set the two documents
side by side. The itemization, nine knots deep, the price existence
itemized: it is the SAME HAND as the charter. The First Debt's
schedule and the Roads' release were drafted by the same pen, as
two halves of one arrangement: what it costs to hold — and what
the holders are owed AFTER. The note was never the whole
instrument. It had a companion piece all along, and you are
standing in its vault.`
          : ``;
        return `${leech}

Four words, in the oldest hand there is, torn off mid-thought:

...AND THEN LET GO.

That is the ending the Roads have run without for ten thousand
years. You stand with it in the lamplight and reconstruct the
sentence the way the whole harbor will soon have to: NOTHING THAT
HELD SHALL BE LOST — the line every warden lives by — was never
the charter. It was the charter's FIRST HALF. Received, berthed,
kept, every light trimmed, nothing lost, AND THEN — and then the
gate, and the going-out, and the rest at the end of the music.
The keeping was always the middle of the sentence. Somebody ate
the end, and the middle has been keeping ever since, faithful as
a lintel, wrong as a wall where a door was promised.${page}

You take the stub. It comes away from the spine like a splinter
leaving, and the whole vault seems to breathe.

# Teeth-marks edge the tear. You look at them a long time in the
lamplight. They are small. They are, you would swear before any
session in any world, TERRIFIED.`;
      },
      on_enter: { flags: { c3_knows_clause: true },
                  "items+": ["c3_charter_stub"], xp: 35 },
      choices: [
        { text: "Back to the market, carrying the end of the sentence.",
          fx: (s) => s.hasItem("c2_ledger_page")
                ? { flags: { c3_page_matched: true }, xp: 15 }
                : { xp: 5 },
          goto: "c3_wrack_market" },
      ],
    },

    // ---------------------------------------------------------- berth one
    "c3_berth_row": {
      text: `Berth One is not down a pier. Berth One is down a WATER — the
harbor's root, a channel that descends below the level of the
Roads themselves, where the moorings get older and stranger and
then stop entirely, and the last riding lights fall behind like
the last houses of a town, and the dark ahead of the boat begins,
very faintly, to breathe.

Halfway down, the water rises against you.

Not a wave. A SWELL — slack water with something unfinished in it,
grief pooled ten thousand years deep at the bottom of a harbor
where nothing is ever allowed to finish, and your boat has stirred
it, and it stands up off the channel in a shape that has too many
hands, all of them holding on.`,
      choices: [
        { text: "[Spirit] Ship your oars and speak to it. It is not a guard. " +
                "It is a QUEUE, remembering.",
          check: { stat: "spirit", dc: 13,
                   ok: "c3_berth_one", fail: "c3_berth_one",
                   ok_fx: { xp: 30, karma: 3,
                            flags: { c3_swell_soothed: true } },
                   fail_fx: { xp: 15, hp: -6 } } },
        { text: "Cut through it. The root is past it, and the tide is not " +
                "getting younger.",
          combat: { enemy: "c3_grief_swell",
                    win: "c3_berth_one",
                    win_fx: { xp: 35 } } },
      ],
    },

    "c3_berth_one": {
      on_enter: { flags: { c3_tenant_met: true }, xp: 20 },
      text: `Berth One is not a number. It is a direction, and the direction is
DOWN, and at the bottom of it, moored by a chain whose links were
forged before links, lies the Oldest Tenant.

It is a hull. Not a ship — the thing ships have been copies of
ever since: a shape for crossing dark water, keel up, vast beyond
the lamplight's patience, barnacled with ten thousand years of
carefully not being looked at. What it held, nobody moored
remembers — itself included, they say. The old entries say only
that it held the dark before the first world, so there would be
somewhere to PUT one.

The first thing that ever finished. The first arrival. The one
that wept at the lip of the Open and asked to be moored forever —
and the chain, you can see from here, is not a Moorage chain. The
splice is different. The Tenant tied it ITSELF.

It knows why you've come. The whole hull attends you, the way the
dark attends a candle.

'LIVE ONE,' it says, in a voice like a harbor settling. 'You have
been to the vault. You smell of the torn page.' A groundswell of
something moving that has not moved in an age. 'Say it, then.
Whatever you have come down ten thousand years of water to say
to the OLDEST COWARD IN CREATION. It will be said eventually.
Everything is, eventually. I have heard the ferryman say so.'`,
      choices: [
        { text: "[Spirit] 'You were FIRST. Nobody held the door for you, and " +
                "the dark you'd held was all you knew of deep water. Say " +
                "what you saw at the lip. I'll stand here while you say it.'",
          check: { stat: "spirit", dc: 14,
                   ok: "c3_tenant_calm", fail: "c3_tenant_rise",
                   ok_fx: { xp: 40, karma: 5 },
                   fail_fx: { xp: 15 } } },
        { text: "[Wits] 'You ate the release. Not to save yourself — you " +
                "could have just refused to sail. You ate it so nobody ELSE " +
                "could ever be sent out. Confess the arithmetic, Tenant.'",
          check: { stat: "wits", dc: 13,
                   ok: "c3_tenant_confess", fail: "c3_tenant_rise",
                   ok_fx: { xp: 40 },
                   fail_fx: { xp: 15 } } },
        { text: "'Ten thousand years of queue, because you were afraid.' " +
                "Draw, and let the harbor's oldest fear come up and answer " +
                "for itself.",
          combat: { enemy: "c3_tenant_dread",
                    win: "c3_tenant_beaten",
                    win_fx: { xp: 45 } } },
      ],
    },

    "c3_tenant_rise": {
      text: `You misjudge it — the word, the tone, the fathom of the thing —
and the Tenant does not answer. The Tenant's FEAR answers.

It comes off the hull like weather off a cliff: the Oldest Dread,
the fright of the first thing that ever finished, wearing ten
thousand years of the dark it used to hold — and it is off its
chain, because fear always is; that was never what the chain was
for.

# 'FORGIVE IT,' the Tenant grinds out, beneath, ashamed to the
keel. 'IT WAS ALL I KEPT.'`,
      choices: [
        { text: "Stand and meet it.",
          combat: { enemy: "c3_tenant_dread",
                    win: "c3_tenant_beaten",
                    win_fx: { xp: 45 } } },
      ],
    },

    "c3_tenant_calm": {
      text: `It is a long time answering. When it does, the voice has changed —
smaller, closer, the harbor-settling gone out of it, and what is
left is the thing that wept at a gate in the first age, speaking
from the bottom of everything it built to never speak again.

'I held the dark. Before the first world — I held the dark OPEN,
so there would be somewhere to put one. And when they lit it, and
it was finished, and it was GOOD, they brought me down the new
water to the gate and said: rest now. And I looked at the Open,
live one. I looked longer than anyone has ever looked.

'And there was NOTHING UNDERNEATH.

'I had been the underneath. All my work, the whole of me: I was
what was under things. And out on that last water there was no
under at all, and every soul that sailed it would be — HELD BY
NOTHING — and they were calling it rest, and singing over the
side, and I thought: they do not know. They cannot see it. Only I
can see it, because underneath was my TRADE.'

The chain, the self-tied chain, shifts along its whole vast length.

'So I would not go. And when they honored that — when the keeper
spliced me a line and said NOTHING THAT HELD SHALL BE LOST, and
meant me, MEANT ME — I went down into the vault that same tide,
and I ate the going-out, page and clause and lock-hour, so that no
soul would ever again be sent onto water with nothing underneath.
I was not saving myself, live one. I had already been saved. I
was saving THEM. I have been saving them for ten thousand years.'

A silence, at the bottom of the harbor, in which entire the
Moorwife's charter, her keeping, her wardens, her tea — the whole
apparatus above you — resolves into what it always was: one
frightened holder's kindness, institutionalized.

# 'Say the rest,' you say, gently, because there is more; there is
always more at the bottom. And the Oldest Tenant says, in a voice
like the first crack in a seawall: 'I have watched that gate ten
thousand years, live one. And the Open has never once looked like
NOTHING to anyone but me. I no longer believe my own eyes. And I
cannot stop. THAT is what I would confess, if anyone still took
confession at this depth: I think I built the wall out of my own
missing courage, and I think the door was TRUE.'`,
      on_enter: { flags: { c3_tenant_eased: true } },
      choices: [
        { text: "'Then when the gate opens, Tenant — and it will — the first " +
                "keel out is yours, and I'll walk at the rail. WITNESSED.' " +
                "Row back up with the promise made.",
          fx: { xp: 25, karma: 3, flags: { c3_tenant_promise: true } },
          goto: "c3_wrack_market" },
        { text: "Say nothing. Some confessions want a witness, not a reply. " +
                "Row back up.",
          fx: { xp: 20 }, goto: "c3_wrack_market" },
      ],
    },

    "c3_tenant_confess": {
      text: `The arithmetic gets it, where mercy might have slid off the hull —
because the Tenant has been running the same arithmetic for ten
thousand years, and no one has ever once checked its working.

'Yes,' it says. 'I ate it. Not the going — the going I could have
refused alone; the keeper honored refusals from the first tide.
I ate the INSTRUMENT, so the going would stop being possible. For
everyone. Forever. Run the sum yourself, live one: one gate. One
last water, with nothing underneath — I had been the underneath;
I KNEW — and souls queuing for it trusting a promise nobody could
verify. Weigh a certain keeping against an unverifiable rest.
Weigh ten thousand years of trimmed lights against one wake that
never reports back. The keeping WINS. The keeping wins every
time you run it.'

The hull settles, vast and tired.

'It has won every night for ten thousand years, and I run it every
night, and here is the figure I do not enter in the sum, because
entering it would end me: I never verified the NOTHING either. I
looked at the Open with a coward's eyes in the first age, one
time, and I have compounded that one glance into everyone's
forever. My books balance, live one. They have always balanced.
I built the ledger so they would.'

# 'Audit me,' says the Oldest Tenant, at the bottom of everything.
'Somebody FINALLY audit me.'`,
      on_enter: { flags: { c3_tenant_heard: true } },
      choices: [
        { text: "'Consider yourself audited: your books balance and your " +
                "premise was never tested. The remedy is a test.' Row back " +
                "up with the confession.",
          fx: { xp: 25, flags: { c3_tenant_promise: true } },
          goto: "c3_wrack_market" },
        { text: "'The clause you ate had four words you never chewed: AND " +
                "THEN LET GO. Even your charter knew holding wasn't the " +
                "whole sentence.' Row back up.",
          fx: { xp: 25 }, goto: "c3_wrack_market" },
      ],
    },

    "c3_tenant_beaten": {
      text: `The Dread comes apart the way fear does when it is finally faced —
all at once, and confusingly grateful about it — and the harbor's
root goes quiet, and the Oldest Tenant lies under your lamplight,
unguarded for the first time in ten thousand years.

'So,' it says. Small, for a hull the size of an age. 'That was
mine. The oldest thing I kept. You have just beaten the only
cargo I had left.'

And it tells you — flat, spent, the way the emptied tell things —
what it did in the first age, and why: the lip of the Open, the
NOTHING UNDERNEATH that only it could see, the vault, the page,
the clause chewed and swallowed so no soul would ever be sent out
onto unheld water. Ten thousand years of everyone's forever,
compounded from one coward's glance.

'You want the gate open,' it says. 'You will likely get it. Live
ones get what they pull for; I have watched it happen for an age.
Only mind this, at the end, whoever walks out first: I looked at
that water ONCE, and what I saw has kept a harbor shut for ten
millennia.'

# 'Either I was wrong, live one — or I am the only honest surveyor
this water ever had. There has never been a third possibility.
That is what NOBODY WILL VERIFY does to arithmetic.'`,
      on_enter: { flags: { c3_tenant_fought: true }, karma: -3 },
      choices: [
        { text: "Row back up, past the settling grief, with the truth got " +
                "the hard way.",
          fx: { xp: 20 }, goto: "c3_wrack_market" },
      ],
    },

    // ------------------------------------------------------ nan's reckoning
    "c3_nan_raft": {
      on_enter: { flags: { c3_nan_quest_done: true }, xp: 20 },
      text: `The pier row Nan cannot stop looking down is P-row — the pier
berths, the smallest moorings, the bottle-fleets and rafted lucks —
and at the end of it rides a single long raft, tidy as a swept
hearth, hung with lights trimmed lovingly low.

The raft is Weir-under-Fell. All of it. The drowned village entire:
its hearth-lucks and door-lucks, its bridge-toll and its bell-tone,
its festival morning and its winter store-song — every small held
thing of one small held place, moored together, keeping each
other's lights, nine hundred years of Nan's work riding at one
family mooring.

They see her. The whole raft brightens like a window at dusk.

'NAN,' calls the well's own echo — the luck of the sweet water
itself, her opposite number, the thing she stood surety FOR nine
centuries. 'Nan Weir. Nan of ours. You STOPPED. You finally—'

'I did NOT stop,' Nan says, to the raft, to the row, to the whole
listening harbor, in a voice you have not heard her use: not the
chisel voice — the one underneath it. 'I was FILED. There's a
difference.'

'Nan,' says the well-echo, gently, nine hundred years of being
held by her in the word, 'love. Who are you arguing with?'

# And Nan Weir, Well-Wife, three hundred and sixteen escape
attempts, both fists and nothing but time, stands on the pier with
her bucket and — for the first time since the fell slipped — has
no answer on hand.`,
      choices: [
        { text: "[Spirit] 'Sit with them, Nan. Not forever — one watch. " +
                "Holding was never the hard part. Sit.'",
          check: { stat: "spirit", dc: 12,
                   ok: "c3_nan_answer", fail: "c3_nan_answer",
                   ok_fx: { xp: 30, approval: { nan: 15 },
                            flags: { c3_nan_sat: true } },
                   fail_fx: { xp: 15, approval: { nan: 5 } } } },
        { text: "'She's not arguing with anyone. She's WORKING. Nine hundred " +
                "years didn't file themselves.' Back her, and let the raft " +
                "hear it.",
          fx: { xp: 20, approval: { nan: 10 },
                flags: { c3_nan_backed: true } },
          goto: "c3_nan_answer" },
      ],
    },

    "c3_nan_answer": {
      text: [
        { if: { has: "c3_nan_sat" },
          text: `She sits.

It takes her three tries, like a swimmer entering cold water, and
then Nan Weir is sitting on the family raft among the lucks of
Weir-under-Fell, bucket on her knees, while the well-echo tells
the story of the morning the fell slipped — tells it PLAINLY, no
sparing anyone, the water in the lanes and the singing in the
dark and every bucket coming up full and sweet to the very last,
because their Nan held to the very last, their Nan held PAST the
very last —

'—and then it was over, love. And you never once put the bucket
down to hear that it was over. That's all this is. Nobody filed
you. Nobody concluded you. We just — finished. And we've been
waiting nine hundred–odd years at this mooring, all of us
together, to say the one thing the water never gave you time to
hear: THANK YOU. It was enough. It was ALWAYS enough. You can
put the bucket down, or carry it forever, love, but carry it
KNOWING: it was enough.'

Nan looks into the bucket a long time. Checking the level. Then
she laughs — cracked, furious, wet — and does not put it down,
and pats the raft-edge like a well-head, and says:

'When the gate opens — and my live one here is going to open it —
you're all going OUT, on the first water, rested and sung to.
And I'm going to stand on that Breakwater and WAVE, loves,
because somebody has to see you off who held you. And THEN we'll
see about the bucket.'

# The raft glows like festival morning. On the walk back she says
nothing, and grips your shoulder once, hard, like a flood
grabbing a fence. It is the most articulate she has ever been.` },
        { text: `'WORKING,' Nan repeats, and takes the word like a rope thrown to
her, and stands there holding it.

The well-echo looks at her a long, kind, nine-hundred-year
moment. 'Aye,' it says at last. 'Working. She was that. She was
that the morning the fell slipped — every bucket came up full and
sweet to the very last, loves, because our Nan held PAST the
last. We got to finish inside her holding. Do you know what a
gift that is, live one? To get to finish HELD?' The raft-lights
sway. 'We never got to thank her. She was filed before the water
settled. Nine hundred years of work, love, and nobody ever said
the words over it.'

'Then say them NOW,' you say, 'she's standing right here' — and
the raft says them: all of it, hearth-lucks and bridge-toll and
winter store-song, the whole drowned village of Weir-under-Fell,
in chorus, the words that go over finished work:

IT WAS ENOUGH. IT WAS ALWAYS ENOUGH.

Nan Weir stands on the pier and takes it the way a seawall takes
a king tide — holding, holding, visibly holding — and then nods,
once, and picks up the bucket, and turns to go, and her face is
a mess and her voice is the chisel again and what it says is:

# 'RIGHT. Well. The gate won't open itself. Move, live one —
we're WORKING.'` },
      ],
      on_enter: { flags: { c3_nan_answered: true }, xp: 20 },
      choices: [
        { text: "Back into the market, with the Well-Wife squared away " +
                "beside you.",
          goto: "c3_wrack_market" },
      ],
    },

    // ------------------------------------------------------ cobb's reckoning
    "c3_cobb_buoy": {
      on_enter: { flags: { c3_cobb_quest_done: true }, xp: 20 },
      text: (s) => {
        const partial = s.flag("c2_bell_anchor") === "partial";
        const heart = partial
          ? `'It's MINE,' Cobb says, finally. 'The bell. My old bell — the reef
watch, the cracked one. It rings the hours down the long water;
always has; you learn to not-hear it, the way you learn old rain.
Only it's not ringing hours tonight.' He listens again, four
hundred years of watch-craft in the set of his head. 'It's ringing
a MUSTER. Post unmanned. Warm hands wanted.' A silence, the pipe
forgotten. 'They kept my post, live one. Four hundred years dead,
and there's a sou'wester on the frame and my name still chalked
on the watch-board. Somebody's been keeping my place the whole
time I've been down here keeping everyone else's.'`
          : `'It's the reef bell,' Cobb says, finally. 'The Watch, up your
water. Rings the hours; rings the taken down the long water;
you learn to not-hear it, like old rain. Only tonight it's
carrying all the way DOWN, which it never does, which means
they're ringing it with intent.' He listens, four hundred years
of watch-craft in the set of his head. 'The Watch keeps its
rolls, live one. Every name that ever stood a post. Mine's still
on them somewhere, chalk under four centuries of chalk. Rowing
the run was never a discharge. It was a SECONDMENT. Tonight it
sounds like the Watch remembers that too.'`;
        return `Cobb stands at the market's water-edge with his head cocked at the
grey, listening to a bell that is not, by any evidence available
to your ears, ringing.

${heart}

He knocks the pipe out, deliberate as a verdict, and asks the
water the question — asks it to your face, which for Cobb is an
intimacy:

# 'So which is it, live one? A man's owed his rest, they tell me —
been telling me four hundred years, mostly to keep me rowing. But
a POST. A kept post, and warm hands wanted, and somebody has to.
Rest, or the oar? You've seen more ends of more waters than any
fare I've carried. Which is it?'`;
      },
      choices: [
        { text: "'The oar, Cobb. Rest is for the finished, and you're not — " +
                "you're SECONDED. When this harbor's settled, go answer " +
                "your bell.'",
          fx: (s) => {
            const fx = { xp: 25, approval: { cobb: 15 },
                         flags: { c3_cobb_answered: true } };
            if (s.flag("c2_bell_anchor") === "partial") {
              fx["items+"] = ["c3_watch_souwester"];
            }
            return fx;
          },
          goto: "c3_cobb_answer" },
        { text: "'Four hundred years, ferryman. You're allowed to be DONE. " +
                "When the gate opens, you could be the first keel out, and " +
                "nobody who ever mattered would call it desertion.'",
          fx: { xp: 25, approval: { cobb: 10 },
                flags: { c3_cobb_rested: true } },
          goto: "c3_cobb_answer" },
      ],
    },

    "c3_cobb_answer": {
      text: [
        { if: { has: "c3_cobb_answered" },
          text: `Cobb takes it the way he takes everything: a long look at the
water, a longer one at you, and a nod you could moor a ship to.

'The oar, then.' He refills the pipe, hands steady. 'Aye. I knew.
Wanted it said by somebody living, is all — the dead talk each
other into rest down here the way sailors talk each other into
one more port. It's the living who know what a POST is worth.'

And the water beside the market steps — the grey, slack,
ten-thousand-year water of the Roads — hands something up.

It surfaces without a ripple, the way meant things arrive:
oilskin, folded Watch-fashion, dry as a wardroom. He looks at it
a long time and does not pick it up, so the water sets it,
gently, against the step by your boot.

'For the live one, then,' Cobb says, gruff as shingle. 'Watch
issue. It'll turn worse weather than any coat of the living —
and mind: wearing it means something, up my water. Warm hands
of good faith. Don't shame the frame it hung on.'

# He stands the rest of the watch beside you at the water-edge,
smoking, at parade ease, a man with a POST again. The bell you
cannot hear rings the hour, and this time, you'd swear, he
lets himself hear it.` },
        { text: `Cobb takes it the way he takes everything: a long look at the
water, a longer one at you, and a slow turn of the pipe.

'Done,' he says, tasting it. 'Four hundred years, and nobody's
once said I was ALLOWED.' He smokes a while. 'I'll tell you the
ferryman's secret, live one, since you've earned it: every fare I
ever rowed, I envied. Every single one. Rowing them to their rest
and back to my oar, and telling myself somebody has to, and
somebody DOES have to — but the Watch relieves its posts. That's
the whole difference between a post and a sentence, and I forgot
it for four centuries, and you just handed it back over the
gunwale like it was nothing.'

He knocks the pipe out and squares his shoulders, and the grey
water lies patient below the steps.

'When the gate opens — IF you open it, and I'm rowing for you
till it does — I'll make my last run. Both ways or one way, I'll
decide at the gap.' The barnacle-grey eyes crease, the nearest
he comes to a grin. 'Either way, the Eventually finally lives up
to her name.'

# He stands the rest of the watch beside you at the water-edge,
at ease in a way you have not seen him: a man off the clock for
the first time in four hundred years, and discovering that the
water, unsupervised, goes on lying there perfectly well by
itself.` },
      ],
      choices: [
        { text: "Back into the market.",
          goto: "c3_wrack_market" },
      ],
    },

    // -------------------------------------------------------- the last verse
    "c3_white_verse": {
      on_enter: { flags: { c3_verse_given: true }, xp: 25 },
      text: (s) => {
        const lantern = s.hasItem("soul_lantern") && !s.flag("sold_lantern")
          ? `

The soul-lantern in your pack — carried across two chapter-breaks,
never done with you — goes quiet as you step aboard. Not dark:
QUIET, the way a child goes quiet in a doorway of somewhere holy.
Whatever it has been wanting of you since Ashfen, you have finally
carried it within sight of it.`
          : ``;
        return `The white ship rides where she rode, light trimmed, line tended,
and the salt figure is waiting at the rail as though the tide
brought word ahead of you — which, on this water, it may have.${lantern}

'You came back. Good. What I have kept, I will give you now,
because whatever you intend at that gate, walker, you will need
the OLD authority for it, and there are only two of us left who
hold it. She will not use it. That leaves the one who taught her.'

She holds out her hands — salt and pearl, the hands that tied the
seam, the hands that held a coast four thousand years — and looped
across them lies a cord. Pale. Short. Knotted in a script older
than the Psalter, older than the charter, the hand the charter was
LEARNING.

'The Tenth Song's last verse. The rest at the end of the music.
My mothers sang it at the gate, in the age when the gate opened —
sang the finished OUT, so that no soul ever crossed the last water
unsung. It is not a key, walker. It is older than keys. It is
PERMISSION — the water's own, from before anyone presumed to
keep it on the water's behalf.'

You take it. It weighs nothing, and your hands know better.

'It is very short,' she says, and the salt of her face shifts —
the smile of a holder, passing the last thing she holds. 'Most
true things are. Sing it plainly, at the gap, when the moment
comes. And walker — a request, from one who is owed nothing
further by anyone:

# 'When the gate opens, whoever else it opens for — sing it once
for ME. I have sung every soul of a coast to their rest, four
thousand years of them, every one witnessed, every one unsung
never. No one has ever once sung it FOR the singer. I find, at
the very end of the waiting, that it is the only thing I have
ever wanted that I could not hold my own way to.'`;
      },
      choices: [
        { text: "'You will not cross unsung. My word on it — and my word has " +
                "held up under worse.' Take the verse, and the request with " +
                "it.",
          fx: { xp: 25, karma: 3, "items+": ["c3_verse_cord"],
                flags: { c3_white_promise: true } },
          goto: "c3_wrack_market" },
      ],
    },

    // ---------------------------------------------------------------- camp
    "c3_camp": {
      text: (s) => {
        const departures = HC.helpers.camp_departures(s);
        return `${departures}You make camp on the deck of a bone-yard hulk at the market's
edge — a retired ship whose riding light burns on out of
hospitality — and the Roads settle around the fire the way the
Roads settle around everything: patiently, at a slight list.

The moored drift near in ones and twos, drawn to the novelty of
a fire that somebody LIT rather than trimmed, and for a while
the deck is nearly a hearth: a spent festival-luck teaches Nan a
counting song; a bottle-fleet of old names rides at your stern
like ducklings; somewhere down the row, the lullaby — recovered,
mostly, from the towing-back — sings itself, and half the pier
pretends not to be listening.

# It is the closest thing to a living evening this water has seen
in an age, and it costs you nothing but the match, and you would
not trade it for the whole glazed solvency of any coast you have
saved.`;
      },
      choices: [
        { text: "Sit with Nan at the rail.",
          when: { inp: "nan" }, goto: "c3_camp_nan" },
        { text: "Share a pipe-lighting with Cobb.",
          when: { inp: "cobb" }, goto: "c3_camp_cobb" },
        { text: "Sleep. Whatever the tide brings next, meet it rested.",
          fx: { heal_full: true, xp: 10, flags: { c3_camped: true } },
          goto: "c3_wrack_market" },
      ],
    },

    "c3_camp_nan": {
      text: `Nan sits with the bucket between her boots, watching the
riding lights the way farm-wives watch other people's weather.

'Nine hundred years,' she says, without preamble, 'and you know
what I never once did? WONDERED. Not once. The well wants
holding, you hold the well, the buckets come up sweet, what's to
wonder. It's this place puts the wondering in you. All these
lights, all this keeping, everybody moored to a number and
polite about it.' She nudges the bucket with a boot. 'Then I
wonder: was I the well's Nan — or was the well MY well, and I
just the last one that couldn't hear the sentence end?'

She looks at you, wire-grey and level, and for a moment you can
see all nine centuries at once.

'Don't answer. There's no answer; I checked, three hundred–odd
times, with a chisel.' The grin comes back like weather turning.
'But you PULL, live one, and you don't file people, and if
anyone's fit to open a gate that's rusted shut since before my
fell had a name — it's the one who came down here to check on
everyone ELSE'S wells.'

# 'Mind you open it FOR them,' she says, 'not just AT them.
There's a difference. The difference is the whole of the work.'`,
      choices: [
        { text: "Back to the fire-circle.",
          fx: { xp: 10, approval: { nan: 10 } }, goto: "c3_camp" },
      ],
    },

    "c3_camp_cobb": {
      text: `Cobb lights the pipe off your fire with ceremony — a coal handed
over on a knife-tip, the old way, the way you do it when fire is
scarce and company scarcer.

'Four hundred years of fares,' he says, settling against the
rail. 'You get a feel for the last conversations. Everybody
wants the same three things said, at the end of the water:
that it mattered. That it's kept. That they can stop.' He
smokes. 'This harbor got two out of three right, and the miss
is ruining the lot. Like a splice with two strands. Holds till
you trust it.'

He watches the fire a while, barnacle-grey eyes gone somewhere
up a different water.

'The kneeling one. My biggest fare. You know what she said to
me, mid-run, four hundred days ago? Only thing she said the
whole row, besides thank you.' The pipe crackles. 'She said:
YOUR OAR IS A HOLDING TOO, FERRYMAN. MIND SOMEONE SINGS FOR YOU
AS WELL, AT THE END OF IT.' He shakes his head slowly. 'Four
thousand years holding a coast, on her way to her own rest —
and she's minding the FERRYMAN'S send-off.'

# 'Whatever you do at that gate, live one — do it so's SHE gets
hers. The rest of us are negotiable. I've kept the fares' words
four hundred years; I know exactly how negotiable we all are.
She isn't.'`,
      choices: [
        { text: "Back to the fire-circle.",
          fx: { xp: 10, approval: { cobb: 10 } }, goto: "c3_camp" },
      ],
    },

    // ------------------------------------------------------- the overtide
    "c3_overtide": {
      text: (s) => {
        const why = {
          tide_you: `You know this water the way only a holder knows water: it is
YOURS, arriving — the year of your coast's spending, every
finished thing the witnessed holding released, riding down the
Long Water in one season instead of forty.`,
          paid: `It is the paid debt's wake, arriving: a year of a world learning
that accounts can END, and ten thousand years of backlog behind
it deciding, all at once, to come and see the far end for
themselves.`,
          lien: `It is the office's perfect coast, arriving: a year of closed
accounts and cleared lines, everything the black glaze concluded,
shipped down the Long Water in immaculate order — the Lady's
solvency, presenting itself at the one office that never posts
a credit.`,
          commons: `It is the Session's doing, arriving: a year of the commons
reading terms aloud and letting the held object — and everything
that finally finished ARGUING, ten thousand grievances settled
in one year, all riding down the Long Water at once.`,
          adrift: `It is the loose coast's wake, arriving: a year of a country that
would not come in, and behind it every finished thing that
watched it ride free and finally let GO of wherever it had been
gripping, all down the Long Water at once.`,
          corded: `It is the corded coast's music, arriving: a year of the song
holding everything, and everything the song finished — grief
sung out, old holdings eased, ten thousand years of the
coast's backlog released in one singing year — riding down
the Long Water together.`,
          forgiven: `It is the Forgiven Ledger's doing, arriving: a year of
discharges, brands voided, lines ended — everything the office
freed, all finished at once, all riding down the Long Water to
a harbor that has refused every delivery.`,
          woven: `It is the weave's doing, arriving: a year of everything held
all the way to the last row — and everything the mending
FINISHED, ten thousand loose ends taken up and tied off at
once, riding down the Long Water together.`,
          harbor: `It is the young world's first season, arriving — and the old
world's last backlog with it: two creations' finished things,
the newest and the oldest there are, riding down the Long Water
in one impossible tide.`,
        };
        return `The bell at the Moorage rings a note nobody living or moored has
ever heard it ring, and you come up the stair into a harbor
staring, all of it, every light and line and warden, up the Long
Water.

The water is coming down WHOLE.

Not a wave — a TIDE, the Overtide, the ebb of everything at once:
the Long Water swollen bank to bank with finished things as far
up as sight goes, ten thousand years of jammed queue with a
year's flood behind it, all of it arriving NOW.

${why[s.flag("ws")] || `It is the settlements' doing, arriving: the year the water was
shaken, and ten thousand years of backlog behind it, all coming
down at once.`}

The Roads cannot hold it. That is not opinion; it is freeboard.
Every berth is kept and every line is spliced and the harbor is
FULL, and has been full for an age, and the Overtide will crest
the Breakwater by the next slack — and either the gate opens,
or the Grey Roads become the thing their keeper swore to
prevent: the place where everything that ever held is LOST,
together, in perfect order, all lights burning to the last.

The Moorwife stands at her office door with a splice in her
hands, looking up the water at the end of ten thousand years of
never losing anything. Then she turns, and her eyes find YOU —
the live one, the puller of lines, the one soul in her harbor
that no keeping binds — and she says, in the voice of an office
concluding, at last, that the matter has exceeded its authority:

'The Breakwater. All of us. NOW.'

# Whatever the Grey Roads are to become, it is decided at the gap,
this tide, in front of everything that ever finished. There is no
coming back up this stair.`;
      },
      on_enter: { flags: { c3_overtide_called: true } },
      choices: [
        { text: "Eat what there is, check every line you own, and go. The " +
                "gap decides everything now.",
          fx: { heal_full: true, xp: 25 },
          goto: "c3_break_road" },
      ],
    },
  };

  HC.registerScenes("ch3", SCENES);
})(globalThis.HC);
