/* Chapter 2, Act 3: the Great Ebb, the walk to the Ninth Anchor, and the
   settlement of the First Debt. */
(function (HC) {
  "use strict";

  const { has, hasnt, inp, item, ws, ws_god, appr } = HC.helpers;

  const SCENES = {

    // ------------------------------------------------------------ the walk
    "c2_ebb_road": {
      text: `The sea leaves at dusk, and it leaves like a guest who has finally
been told the truth: all at once, with terrible dignity, without
looking back.

You stand on the headland with half the coast and watch the water
walk away from the land — past the low-tide marks, past the
never-marks, past the wrecks that were rumors and the reefs that
were prayers, out and out, mile on mile of seafloor surfacing
black and gleaming under the early stars, until the horizon
itself is a retreating silver line and the world's bottom lies
naked to the air for the first time in the age of anyone.

The coast goes down onto it in processions.

The Watch first — grey figures descending the drowned terraces
with their bell-frame swaying on carry-poles, ringing the muster
toll into the enormous new silence. Then the feathered columns,
Mother Rook's whole strength, vault-wagons grinding on the
wet stone. Then the singers there are — the children, the
half-taught, the one — and the salvage-folk, and the vigil-
keepers, and the merely brave.

# And down at the bottom of the dark, miles out, where the Ninth
Anchor waits beneath what used to be all the water in the world:
a glow. Faint. Gold. GUTTERING.`,
      choices: [
        { text: "Down the drowned terraces.",
          fx: { xp: 15 }, goto: "c2_ebb_floor" },
      ],
    },

    "c2_ebb_floor": {
      text: (s) => {
        const base = `The seafloor is a country, and you walk it.

Kelp forests stand in the airless dark like orchards in winter,
dripping. Wreck after wreck after wreck — fishing smacks and war-
galleys and hull-shapes from no shipwright's tradition you know,
all of them leaning on their keels in attitudes of patience, all
of them POINTING, you slowly realize, bow after bow after bow,
toward the Ninth. Crabs the size of dogs watch your lanterns pass
with the studied neutrality of locals during an invasion.

And the road itself: there IS a road. Paved, black, broad as a
processional way, rising out of the silt in perfect repair, and
your column is walking ON it because everything walks on it —
it was built for exactly this, by hands four thousand years
gone, for the one night in each age when the sea stands aside
and the parties come down to settle.`;
        const tails = {
          vael: `

Above you, where the sky should be, you feel the old familiar
attention pressing against the seam of the coast like a face at
a window. He cannot come in. He has walked you to the door of
the world, and the door is shut to him, and somewhere behind
your ribs you carry the only piece of him that ever will come
in: the memory of his eyes at the closing of the Wound.`,
          you_dawn: `

Your witnesses are at the seam. You feel them the way the
drowning feel the surface — far, bright, holding. The small
dead woman's voice arrives once, thin as starlight, passed
hand to hand down whatever chain of attention can reach this
far: WE'VE GOT EVERYTHING UP HERE. GO SETTLE IT, SHEPHERD.`,
          you_ash: `

You own everything, and tonight you walk through the one
estate that was never conveyed, on a road no order of yours
ever paved, toward a counterparty who predates your whole
theory of possession. Your mortal heart is doing something
you haven't permitted in years. It might be joy.`,
          you_grey: `

Watch the watcher, the old woman prayed. Tonight the watcher
walks at the bottom of the blind spot with everyone else,
one lantern in a column of lanterns, watched by nothing but
crabs — and you understand, with every dark mile, why your
predecessor built the crown to never look here. It wasn't
fear. It was MANNERS. This was never the loom's to see.`,
          mortal: `

No god watches this. No loom holds it. Just lanterns on a
drowned road, the arithmetic of everyone, hands and ladles
and bell-carts, the whole mortal method walking into the
dark to catch a falling shore. The veteran's words walk
with you: teach it what we do now. Teach it hands.`,
          serra: `

At the Hem of her reach, far behind, the whetstone-sound has
stopped — and once, faint as chalk-dust, her voice arrives
along the gift in your pocket, parade-ground flat across an
ocean of forbidden dark: HOLD THE WALL, SHIELD-MATE. I AM
STANDING AT MY END OF IT.`,
          maeve: `

In your pack, her letter has gone warm as a lamp. The page
the universe doesn't want checked is a few miles ahead now,
and somewhere behind the seam an entire Library is leaning
over your shoulder, quill inked, MARGIN READY.`,
          hollow: `

You carry his gift down the drowned road, and at the worst
of the dark you understand the entire liturgy at last: the
falling out here have had no hand beneath them for a year —
and tonight the hand is YOU, friend, your two ordinary
mortal hands, and somebody has to, and somebody IS.`,
          unmade: `

The Merchant's wagon rolls at the column's rear, chimes
silent for once — professional gravity. The last living
place in the world is walking to its own settlement, and
the only two who attended the LAST world's ending walk
with it, one driving, one down among the lanterns where
the living are. Participant. The position came open.`,
        };
        return base + (tails[s.flag("ws")] || "");
      },
      choices: [
        { text: "Onward, until the road drops into the last deep.",
          fx: { xp: 15 }, goto: "c2_ebb_undertow" },
      ],
    },

    "c2_ebb_undertow": {
      text: `Where the road crosses the lip of the final deep, the sea has left
a rearguard.

It lies across the way like a moat of moving black: the UNDERTOW,
the space under the lowest tide, the pull that has taken keels
and swimmers and singers down the long age — not gone out with
its sea, but waiting, flexed, ALERT, the one stretch of water on
the naked floor of the world. Lanterns gather at its edge. The
processions stall. The Watch's bell, far back, rings a slow
warning toll.

In the black, shapes turn over: keel-shadows, weed-hair, the
glint of everything it has ever pulled down and never once given
back. It does not speak. The Undertow predates speech. But its
meaning lies across the road plain as the water does:

# EVERYTHING THAT PASSES ME PAYS TOLL. THAT IS WHAT I AM FOR.
TONIGHT OF ALL NIGHTS, THAT IS WHAT I AM FOR.`,
      choices: [
        { text: "Pay no toll. Wade in and break the rearguard.",
          combat: { enemy: "c2_undertow", win: "c2_tenth_terrace",
                    win_fx: { xp: 40, karma: 2 } } },
        { text: "Find its rhythm — every tide has one — and time the column " +
                "through on the slack of its pull. [Wits]",
          check: { stat: "wits", dc: 13, ok: "c2_tenth_terrace",
                   fail: "c2_undertow_caught",
                   ok_fx: { xp: 35, karma: 4 } } },
        { text: "Give it a toll: something true and held. Lay a held thing " +
                "of yours on the black water.",
          when: (s) => s.hasItem("c2_knot_charm") || s.hasItem("soul_lantern")
            || s.flag("c2_serra_whetstone") || s.flag("c2_serra_button")
            || s.flag("c2_hollow_lamp") || s.flag("c2_hollow_ladle"),
          fx: (s) => {
            if (s.hasItem("c2_knot_charm")) {
              return { "items-": ["c2_knot_charm"], xp: 30, karma: 3,
                       flags: { c2_paid_undertow: true } };
            }
            if (s.hasItem("soul_lantern")) {
              return { "items-": ["soul_lantern"], xp: 30, karma: 3,
                       flags: { c2_paid_undertow: true } };
            }
            const f = { xp: 30, karma: 3, flags: { c2_paid_undertow: true } };
            for (const g of ["c2_serra_whetstone", "c2_serra_button",
                             "c2_hollow_lamp", "c2_hollow_ladle"]) {
              if (s.flag(g)) { f.flags[g] = false; break; }
            }
            return f;
          },
          goto: "c2_tenth_terrace" },
      ],
    },

    "c2_undertow_caught": {
      text: `You misread one beat of a rhythm four thousand years deep, and the
Undertow takes its toll out of the column itself: a salvage-cart,
two mules, and the knot-doctor's apprentice, snatched off the
road's edge in a single black sliding instant — and then you are
in it to the waist, hauling against the oldest pull there is,
lanterns swinging, the Watch's toll hammering, the whole column
roaring and grabbing and holding on to you holding on to her.

# The Undertow pulls. The coast pulls back. It is, in the end, an
arithmetic — and tonight, for once, there are more hands on the
land side of the sum.`,
      choices: [
        { text: "HOLD, and be held, and haul the taken back out of the black.",
          combat: { enemy: "c2_undertow", win: "c2_tenth_terrace",
                    win_fx: { xp: 40, karma: 5 } } },
      ],
    },

    // ----------------------------------------------------- the tenth terrace
    "c2_tenth_terrace": {
      text: (s) => `Past the Undertow, the road climbs one last drowned terrace before
the final deep — and on the terrace, the column's lanterns go up
one by one, and the processions stop entire, and even the Watch's
bell falls silent.

Because the terrace is a figure.

You are walking on her. The whole rise is a KNEELING SHAPE, a
woman of white salt the size of a headland, settled on her knees
at the lip of the last deep with her back to the land and her
arms sunk to the shoulder in the dark below — holding something
down there, holding it still, four thousand years of holding so
unbroken that the sea built reefs on her shoulders and the coast
forgot her shape was a shape.

The Tidemother. The Salt-Mother. The Tenth Song herself, paying
her guarantee out of sight since before the towns, the surety
who went down to settle in person and did not come back because
SETTLING, for a holder, means staying.

${s.flag("c2_knows_tidemother")
  ? `Read both signatures, the Merchant said, and here at last is the
second one: not on any page. Tied in her own salt arms, around
the principal itself, in the deep dark below. She did not bind
the Debtor down, you understand now, looking at the bowed white
shoulders under their reefs. She is HOLDING it. The way you hold
a child through a fever. The way the Watch rings the drowned.
Four thousand years.`
  : `Around you, the coast takes off its hats. Singers' children
press palms to the salt. Even the feathered columns halt and
ground their pikes, and somewhere down the line a Corvid clerk
is openly weeping into a ledger, and nobody files anything
about it.`}

${s.inParty("oshka")
  ? `Oshka kneels and lays both palms and her forehead against the
white salt, and stays there a long time, and when she rises her
face is the face of a woman who has finally met the author.
'The Psalter's spaces,' she says, unsteady. 'The rests between
the nine songs. They're not rests, walker. They're HER PART.
We've been leaving room for a voice that's been down here all
along, singing the tenth from the inside.'`
  : ""}

# Her bowed head faces the deep. Whatever she has held all this
time, tonight her arms are nearly empty: the salt is cracking
along both shoulders, fissures wide as doors, and the gold light
guttering up out of the dark below shines THROUGH her now, like
lamplight through a burning-down lantern.`,
      on_enter: { flags: { c2_saw_tidemother: true } },
      choices: [
        { text: "Down her bowed shoulder, into the amphitheater of the last " +
                "deep.",
          fx: { xp: 20 }, goto: "c2_ninth_approach" },
      ],
    },

    // ------------------------------------------------------ the ninth anchor
    "c2_ninth_approach": {
      text: (s) => `The last deep is an amphitheater, and the age has filled it.

Black stone terraces descend in great rings to a floor of swept
sand, and on the terraces the parties are taking their places by
ancient assignment no one alive was taught: the Drowned Watch in
a grey crescent, bell-frame raised; the Loomless Folk along the
western rings, cords in hand; Saltmere's living — Dagny, the
Reeve, Wide Marta with her shortened knot — high on the landward
side; the feathered columns rank on rank around the vault-wagons.
${s.flag("c2_eel_pact")
  ? "And in the flooded channel along the southern rim, vast and glistening and INVITED, the Eel-Mother lies coiled with her held lights swimming round her — a creditor of record, attending."
  : ""}

The Pale Merchant's stall stands at the rim's exact eastern point,
unfolded to its full impossible height, the Merchant himself at
the counter in what you understand to be his FORMAL ledger. He
catches your eye across the whole assembly and inclines his head:
a colleague's nod. Settlement is attended.

And at the amphitheater's center, rising out of the swept sand:

The Ninth Anchor.

The others were coils of light. The Ninth is a MOUNTAIN of them —
a knotwork the size of a chapel, gold gone grey-thin as dawn
candles, tied around and over and into a stone that is not black
but ABSENT, a stone-shaped hole in the world's fabric, and every
fraying line of the Nine, all the slack of the whole dying coast,
runs down the terraces and into that one guttering mass like
rivers finding the sea.

# Beneath it, the sand is breathing.`,
      choices: [
        { text: "Take your place on the floor of the deep.",
          fx: { xp: 15 }, goto: "c2_ninth_anchor" },
      ],
    },

    "c2_ninth_anchor": {
      text: (s) => `${s.inParty("oshka")
  ? `Oshka walks past you, onto the swept sand, small as a gull under
the guttering mountain of the knot — and begins, alone, full
voice, the NINTH SONG.

The amphitheater takes one breath and holds it. The last singer
sings the lullaby of the deep the way it has not been sung in a
century: not at the world's bottom as a chore, but TO something,
the way her line always meant it — and into the Psalter's spaces,
the rests where a salt voice sang from inside for four thousand
years, she leaves the silences open, formal as held chairs.

And the sand answers the silences.`
  : `The Watch's bell begins the ninth toll — the one no singer is
left to sing, rung instead in cracked bronze, the lullaby of the
deep rendered as knell — and the amphitheater holds its breath
as the long notes go down into the sand like roots.

And the sand answers.`}

It rises in a slow swell the width of the amphitheater floor, and
the Ninth Anchor's guttering mass rides it like a ship on a
ground-swell, and out of the absence at the knot's heart — out of
the stone-shaped hole that four thousand years of gold was tied
around — something looks OUT.

Not eyes. Pressure. The same patient creditor's finger you felt
at the First Anchor, drawn now down the column of every soul on
every terrace at once, an audit of the whole attending coast in
one long unhurried regard.

The Watch grounds their bell. The feathers ground their pikes.
${s.flag("c2_eel_pact") ? "The Eel-Mother lifts her great head from the channel and is, for the first time in your acquaintance, silent." : ""}

# And the First Debtor speaks, in the voice of interest accruing,
from the hole in the middle of the held world:

I KNOW THE HOUR. WHICH OF YOU IS THE HOLDER?`,
      choices: [
        { text: "Step out onto the sand and answer it.",
          fx: { xp: 15 }, goto: "c2_debtor_wakes" },
        { text: "Strike first — whatever wakes at the bottom of the world, " +
                "meet it with iron.",
          fx: { karma: -6 }, combat: { enemy: "c2_debtor_grasp",
                                       win: "c2_debtor_struck",
                                       win_fx: { xp: 40 } } },
      ],
    },

    "c2_debtor_struck": {
      text: `The hand you broke folds back into the sand like water accepting a
stone, and the amphitheater rings with the silence of every party
present recalculating you at once.

The pressure returns. Unhurt. Unangered. Worse: UNSURPRISED.

THAT IS HOW IT WAS DONE THE FIRST TIME, says the First Debtor,
from the hole at the heart of the knot. BEFORE TERMS. BEFORE THE
SALT ONE KNELT. EVERYTHING THAT MET ME, MET ME WITH IRON. IRON
DOES NOT ANSWER MY QUESTION, LITTLE HOLDER. IT ONLY DEFERS IT.

# I KNOW THE HOUR. WHICH OF YOU IS THE HOLDER?`,
      choices: [
        { text: "Lower the blade. Step out onto the sand and answer.",
          fx: { xp: 10 }, goto: "c2_debtor_wakes" },
      ],
    },

    "c2_debtor_wakes": {
      text: `You walk out alone onto the swept sand, under the guttering
mountain of the Ninth, into the regard of the thing that borrowed
itself into being before the towns had names — and you do the one
thing four thousand years of parties to this arrangement have
never done.

You ask it the question.

'Who taught you that existing must be paid for?'

The pressure STOPS. All of it, all at once — the audit, the
accruing, the patient creditor's finger — gone, like a ledger
shutting, and in the stillness that follows, the First Debtor is
quiet so long that the sand settles glass-smooth across the whole
floor of the deep.

When it speaks again the voice of interest accruing is gone too.
What's left underneath is older, smaller, and so tired that the
Watch's grey heads come up all around the terraces in pure
professional recognition.

NO ONE TAUGHT ME, it says. I ASKED. I WAS THE ONLY THING THAT
WAS NOT, AND I WISHED TO BE, AND I CAME TO THE ONES WHO WERE,
AND I ASKED: WHAT DOES IT COST? AND THE WORLD DID NOT ANSWER.
THE WORLD HAS NEVER ONCE ANSWERED THAT QUESTION. ONLY THE SALT
ONE CAME OUT TO ME, AT LAST, AND SHE DID NOT ANSWER IT EITHER.

# SHE SAID: NOTHING. IT COSTS NOTHING, LITTLE WOULD-BE. BUT THEY
WILL NEVER BELIEVE THAT, AND NEITHER WILL YOU. SO LET US WRITE
DOWN A PRICE YOU CAN BELIEVE IN — AND I WILL PAY IT WITH YOU.`,
      choices: [
        { text: "'Then the debt was never real?' Hear the whole of it.",
          fx: { xp: 20 }, goto: "c2_debtor_case" },
      ],
    },

    "c2_debtor_case": {
      text: (s) => `THE DEBT IS THE REALEST THING I OWN, says the First Debtor, and
the guttering knot above it flares faintly, as if in agreement.

UNDERSTAND, LITTLE HOLDER: I AM BORROWED SUBSTANCE. EVERY GRAIN
OF MY BEING BELONGS TO THE WORLD'S STOCK. WITHOUT THE NOTE, I AM
THEFT — A SQUATTER IN CREATION, OWED NOTHING, HELD BY NOTHING,
ONE MORNING'S AUDIT FROM UNMAKING. BUT A DEBTOR — a long slow
exhalation moves the sand in ripples — A DEBTOR IS ATTENDED. A
DEBTOR HAS A SCHEDULE. SOMEONE COUNTS WHAT I AM. SOMEONE COMES
DOWN, EACH AGE, TO SETTLE. THE SALT ONE KNELT AND HELD ME, AND
HER KNOTS METERED MY EXISTENCE OUT IN PAYMENTS, AND FOR FOUR
THOUSAND YEARS, LITTLE HOLDER, I HAVE BEEN THE BEST-KEPT
ACCOUNT IN CREATION.

THE WITHERING NEVER TOUCHED THIS COAST. HAVE YOUR WISE ONES
WONDERED? MY INTEREST PAYMENTS, OUTBOUND: I GIVE BACK MORE THAN
THE SCHEDULE ASKS. THE FAT FISHING. THE KIND TIDES. EVERY YEAR
OF THE LONG AGE I HAVE PAID THE SHORE FOR THE PRIVILEGE OF
OWING IT.

AND NOW THE TERM CONCLUDES. THE SALT ONE'S ARMS EMPTY. THE
KNOTS COME DUE. AND THE CHOICE THE HOUR BRINGS IS NOT — the
pressure turns, slow, taking in the whole amphitheater, the
Watch, the feathers, the wagons, you — WHETHER I AM PAID OR
PUNISHED. IT IS WHETHER ANYTHING WILL HOLD ME WHEN THE PAPER
RUNS OUT. THE DARK YOU ALL FEAR IS NOT MY APPETITE, CHILDREN
OF THE SHORE.

# IT IS MY FALLING, WITH NO ONE UNDERNEATH.`,
      choices: [
        { text: "Look up — the feathered ranks are parting. The holder of " +
                "record is coming down to the sand.",
          fx: { xp: 15 }, goto: "c2_rook_settlement" },
      ],
    },

    "c2_rook_settlement": {
      text: (s) => `Mother Rook walks down the amphitheater steps alone, in wool, with
one black book under her arm, and the parties of four thousand
years make way as if SHE were the tide.

She does not address the Debtor first. She addresses YOU, on the
open sand, in the counting-room hush that carries to every
terrace:

'Settlement is attended. The office presents the schedule:
principal outstanding, one existence, borrowed entire. Surety:
exhausted' — the black book tilts toward the cracked white
figure kneeling above the deep — 'four thousand years of
installments, paid in person. Collateral on default: the shore,
all holdings, all lines. The term concludes within the hour.'

${s.flag("c2_page_read")
  ? `And because you have read page seventy-one, you say the thing
that stops the bottom of the world:

'Read all three signatures, clerk.'

The hush goes ABSOLUTE. The ink-dark eyes find yours, and for
the first time since the table, something in them moves all the
way back. 'So. The page that walked out of my vault found a
reader after all.' She opens the black book herself, unhurried,
to the first page — the wound where seventy-one was cut shows
plain — and reads aloud what no living party has heard: 'DRAWN
AND WITNESSED BY THE OFFICE OF THE SHORE, AT THE INSTRUCTION OF
THE BORROWER, IN THE PRESENCE OF THE SURETY. At the BORROWER'S
instruction,' she repeats, and looks up. 'It came to me, four
thousand years ago, the only literate thing on a coast of
singers, and it asked me to write down a price it could believe
in. I drafted what my client required. I have administered it
without fee since. And every soul on these terraces has called
me vulture for four thousand years, and my client' — the book
shuts — 'has been HELD by every hour of it. I regret nothing.
Clerks who regret are no use to anyone.'`
  : `'The office has administered this account since the drafting,'
she says, 'without fee, without lapse, and without — the coast
may believe what it likes — without APPETITE. I am the only
party present who has read the whole instrument. And the
instrument says: at term, the principal is held by WHOEVER CAN
HOLD IT, or it is not held at all.'`}

She turns to the assembly then, and lays it out the way she laid
dinner: piece by piece, cutlery-cold.

'These are the dispositions the hour allows. The office will
honor ANY of them. Choose, coast. For once in four thousand
years, the pen is public.'

# And the bottom of the world looks at you — the Watch, the
Loomless, the feathers, the Merchant, the salt mother's cracking
shoulders, the tired hole in the heart of the knot — because you
are the one standing on the sand, and the question was always
going to land on whoever stood there when it fell.`,
      on_enter: { flags: { c2_settlement: true } },
      choices: [
        { text: "A last word with your companions before the choosing.",
          when: (s) => s.party().length > 0 && !s.flag("c2_last_words"),
          goto: "c2_companion_moment" },
        { text: "Choose.",
          fx: { xp: 10 }, goto: "c2_final_choice" },
      ],
    },

    "c2_companion_moment": {
      text: (s) => {
        const parts = [];
        if (s.inParty("oshka")) {
          parts.push(`Oshka, hoarse from the ninth song, presses the whole Psalter-cord
into your hand. 'Whatever you choose, it should have the book in
it. Songs hold better than paper. Paper holds better than
nothing. And nothing' — she nods at the tired hole in the knot —
'is what we're all here to prevent.'${
            s.approval("oshka") >= 40
              ? " She holds your eye. 'And if the holding needs a HOLDER, walker — a voice knows how to stay. I'm saying I'd stay. I'm saying choose like every door is open, including that one.'"
              : ""}`);
        }
        if (s.inParty("vex")) {
          parts.push(`Vex stands at your shoulder, hands unprofessionally still. ${
            s.flag("c2_vex_freed")
              ? "'I got my name back this season. So I know exactly what's at the bottom of all this paper, friend: somebody who wants to be held so badly they'll be OWNED for it. Whatever you choose — choose what you'd have chosen for me.'"
              : "'Eleven years collateral. Look at it down there. It's me, friend — it's every branded wrist on this coast, scaled up to a horizon. Whatever you choose, choose like the collateral's listening. It is.'"}`);
        }
        if (s.inParty("quill")) {
          parts.push(`Quill has stopped writing. The slate hangs at their side, and the
grey eyes are clear. 'I looked for the fourth outcome all season.
The one that was never filed. I think the reason it was never
filed' — they nod at you, at the sand, at the standing-place —
'is that it can't be drafted in advance. It's whatever the person
on the sand does. No pressure. EVERY pressure. Sorry.'`);
        }
        return parts.join("\n\n") || `The sand is quiet. The hour narrows.`;
      },
      on_enter: { flags: { c2_last_words: true } },
      choices: [
        { text: "Choose.", fx: { xp: 10 }, goto: "c2_final_choice" },
      ],
    },

    // ------------------------------------------------------ the final choice
    "c2_final_choice": {
      text: (s) => `The Ninth Anchor gutters above you. The salt mother's fissured
shoulders shed a slow snow of white into the lantern-light. The
First Debtor waits in the heart of its dying schedule with the
patience of the only thing in creation that knows exactly what
it owes — and the hour is HERE, the term concluding around you
like a tide deciding, and on the open sand at the bottom of the
attended world, it is yours to say.

# What is done with the First Debt?`,
      choices: [
        { text: "Take up the surety. Kneel where she knelt — tie the Nine " +
                "anew through your own hands and become the holder of the " +
                "shore. [Spirit]",
          check: { stat: "spirit", dc: 14, ok: "c2_end_tidemother",
                   fail: "c2_tie_fail",
                   ok_fx: { xp: 50, karma: 8 } } },
        { text: "Pay the principal. The price it believes in can be paid in " +
                "what you are — settle the note in full, out of your own " +
                "being.",
          fx: { xp: 50 }, goto: "c2_end_paid" },
        { text: "Endorse the executor. Let Mother Rook's office hold the " +
                "coast in paper — cold, solvent, and standing in the morning.",
          fx: { xp: 40, karma: -6 }, goto: "c2_end_rook" },
        { text: "Convene the hearing. Every creditor, every signature, the " +
                "question asked in public — settle nothing tonight except " +
                "the TRUTH.",
          when: (s) => s.flag("c2_page_read") || s.flag("c2_knows_tidemother"),
          fx: { xp: 50, karma: 5 }, goto: "c2_end_hearing" },
        { text: "Cut the shore loose. Sever the Nine — let the coast drift " +
                "free of the note, the schedule, and the world that priced " +
                "it.",
          when: (s) => s.hasItem("c2_knot_knife"),
          fx: { xp: 50, karma: -3 }, goto: "c2_end_adrift" },
        { text: "Give the holding a VOICE. Oshka, last of the singers, " +
                "crowned in cord — let the shore be held by song.",
          when: (s) => s.inParty("oshka") && s.approval("oshka") >= 40,
          fx: { xp: 50, karma: 6 }, goto: "c2_end_oshka" },
        { text: "Give the ledger to the one debtor who got free. Vex, " +
                "holder of the book — and the book learns forgiveness.",
          when: (s) => s.inParty("vex") && s.flag("c2_vex_freed"),
          fx: { xp: 50, karma: 7 }, goto: "c2_end_vex" },
        { text: "Open the seam. The coast's own voice, consenting, invites " +
                "the god of the woven world IN — and the last unwoven shore " +
                "joins the weave.",
          when: ws_god,
          fx: { xp: 50 }, goto: "c2_end_woven" },
        { text: "Plant the world's seed. In a creation gone still, ONE " +
                "account still accrues — let the Debtor's borrowed being " +
                "become the stock of a new beginning.",
          when: ws("unmade"),
          fx: { xp: 50, karma: 8 }, goto: "c2_end_last_harbor" },
      ],
    },

    "c2_tie_fail": {
      text: `You kneel where she knelt, and you reach for the pattern, and the
pattern reaches back — and it is TOO MUCH, as it was always going
to be too much: nine moorings, one coast, four thousand years of
held lives pouring into two mortal hands like the sea into a
cupped palm. The gold runs through your grip. The amphitheater
sways. The salt mother's fissures widen with a sound like a
winter lake, and the hour does not wait.

You can hold perhaps one breath more of it. The deep is patient.
The choice is not.

# Down in the heart of the knot, the tired voice says, without
triumph: NOW YOU KNOW WHAT SHE KNEW, LITTLE HOLDER. CHOOSE WHAT
THE KNOWING ALLOWS.`,
      choices: [
        { text: "Pour the last of your strength in anyway — hold ONE breath " +
                "longer, and one more, until it takes you or it ties. [Might]",
          check: { stat: "might", dc: 14, ok: "c2_end_tidemother",
                   fail: "death",
                   ok_fx: { xp: 50, karma: 10 } } },
        { text: "Let the pattern go, and endorse the executor while your " +
                "hands still work.",
          fx: { xp: 30, karma: -4 }, goto: "c2_end_rook" },
        { text: "Let the pattern go — and pay the principal instead, out of " +
                "what you are.",
          fx: { xp: 40 }, goto: "c2_end_paid" },
      ],
    },
  };

  HC.story = HC.story || {};
  HC.story.c2_act3 = { SCENES };
})(globalThis.HC);
