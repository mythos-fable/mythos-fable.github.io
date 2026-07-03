/* Chapter 2, Act 1: Saltmere and the First Anchor.
   The nine openings converge at the town gate. Act 1 introduces the coast,
   Oshka and Quill, brings Vex's debt back due, and ends with the First
   Anchor slipping under the harbor in the storm-tide. */
(function (HC) {
  "use strict";

  const { has, hasnt, inp, gold, ws, ws_not, ws_god, appr } = HC.helpers;

  const SCENES = {

    // ------------------------------------------------------------ arrival
    "c2_saltmere_gate": {
      text: (s) => {
        const base = `Saltmere announces itself by smell — tar, kelp, woodsmoke, and under
it all the wet-iron smell of a sea that means business — and then by
sound: gulls, hammers, a town crier with a voice like a cracked horn
announcing the tide-tables as if they were war news. Which, you will
learn, here they are.

The town stacks itself up a cliff-knee above a harbor of patched
boats. Every roofline sags toward the water. Every door-post, every
boat-prow, every wellhead wears a knot of tarred cord — not
decoration; they're too worn for decoration, retied too many times.
And down the main street, past the fish-stalls, a queue of grey-faced
families stands outside a black-painted office under a sign of a
single feather.

They are holding out their wrists to a clerk. They are selling
something. Nobody in the queue looks at anybody else.`;
        const tails = {
          vael: `

The chapel-of-knots by the gate has no sun-sigil, no loom-wheel —
none of your world's furniture. A god saved everything, everywhere,
and this town has plainly never heard of it. The knot on the gatepost
hums faintly as you pass, like a struck tuning fork.

# Bray spits over the rail, comfortably. 'Home,' she says. 'Mind the
moorings, miracle.'`,
          you_dawn: `

No one kneels. No one ever kneels here, you remind yourself. You held
every one of these lives a month ago — no. You held every life but
THESE. The town bustles past you, unwitnessed, unwoven, and your new
heart does something complicated about it.

# Somewhere underfoot, very deep, something turns over. You feel it
through your boot-soles like a sleeper's cough through a floor.`,
          you_ash: `

No tithe-board. No registry. No portrait of you over the gate — and
the gate WANTS one, the wall has a bracket where every town in your
world mounts the eyes that follow congregations home. The bracket
holds a knot of tarred cord instead.

# You own everything. The cord, fraying gently in the wind, declines
to be included.`,
          you_grey: `

This is the inside of the blind spot, then. It looks like fish-stalls
and laundry. The watcher's missing province, the hole your crown was
built around, and it is full of ordinary people arguing about the
price of rope — and a queue of them, you notice, selling their wrists
to an office with a feather on it.

# Watch the watcher, the old woman prayed. Out here, you finally
understand the prayer: there is no watcher. There is whatever's
UNDER the harbor.`,
          mortal: `

No undercroft. No forty chalked on a beam. The coast never lost a
god, so it never built what you built — but the knots on the
door-posts are the same idea in older handwriting, you realize.
Hands, holding. The town is one big ladle.

# And the moorings it hangs from are coming undone.`,
          serra: `

THE WEAK ARE NOT CURRENCY, says the sky of the world you left. Here
the sky says nothing, and outside the feather-sign office the weak
are queuing up to be priced, wrists out, eyes down.

# You touch her gift in your pocket and feel, faint as a parade-
ground heard across a valley, the whetstone fall silent, listening.`,
          maeve: `

Her lamplight doesn't reach here, but information, as ever, leaks:
a bill on the gate offers coin for 'readers of the old cord-script,'
and somebody has chalked beneath it, in a marginal hand you'd swear
was learned off her posted ledgers: CHECK THE WORKING. ALWAYS.

# The town is full of text, none of it on paper. Knots everywhere.
You are inside the page the universe doesn't want checked.`,
          hollow: `

You listen the way he taught you, without meaning to teach: under
the gulls, under the hammers — there. The town has a sound at its
bottom, a fraying sound, soft as rope over stone. The falling, with
no one underneath.

# You set down your pack a moment and just stand with it, the whole
town, in your hearing. Somebody has to. That's the entire liturgy.`,
          unmade: `

ALIVE. The whole street of them: arguing, haggling, lying, coughing,
ALIVE, and you walk through the noise of it like a man walking into
a bonfire after years of cold. You catalogue faces helplessly — old
habit — and give it up within twenty paces. Too many. Too quick.
Too wonderfully unfiled.

# The last living town in the world is worried about rope. You could
kiss every fraying inch of it.`,
        };
        return base + (tails[s.flag("ws")] || "");
      },
      on_enter: { flags: { c2_arrived: true } },
      choices: [
        { text: "Into the town square.", fx: { xp: 10 }, goto: "c2_saltmere_square" },
      ],
    },

    // ---------------------------------------------------------- town hub
    "c2_saltmere_square": {
      text: (s) => {
        if (s.flag("c2_square_seen")) {
          return `The square again: tide-tables, gull-arguments, the knot on the
wellhead worn smooth by three thousand years of worried thumbs.
The town moves around you with its ear cocked to the harbor, the way
towns near a sick neighbor live with one ear toward the wall.`;
        }
        return `Saltmere's square is a sloping cobbled apron around a wellhead, and
the wellhead wears the biggest knot you've seen yet: cord as thick as
your wrist, tarred black, tied in a pattern your eye follows and then
respectfully gives up on.

Around the square: the harbor steps, down which the whole town's
livelihood walks twice a day. A chapel — they call it the knotworks
here, you'll learn, a low salt-stained hall with cord where another
country would put stained glass. The reeve's house, sandbagged to the
windowsills, queue out the door. The Patient Gull, a tavern with a
stuffed and visibly impatient gull over the lintel. And the black
office of the feather, where the Corvids buy what people shouldn't
have to sell.

A crier works the corner: 'Ebb at six! Storm-glass FALLING! The
Watch reminds all residents the Shallows are CONDEMNED, repeat,
CONDEMNED —'`;
      },
      on_enter: (s) => {
        if (!s.flag("c2_square_seen")) return { flags: { c2_square_seen: true }, xp: 5 };
        return null;
      },
      choices: [
        { text: "Take the harbor steps down to the water.",
          when: hasnt("c2_harbor_done"), goto: "c2_harbor" },
        { text: "Visit the knotworks — the chapel of cord.",
          when: hasnt("c2_oshka_done"), goto: "c2_knot_chapel" },
        { text: "Call on the Salt Reeve about that 'condemned' business.",
          when: hasnt("c2_reeve_done"), goto: "c2_reeve" },
        { text: "Take a seat in the Patient Gull and let the town talk.",
          when: hasnt("c2_gull_done"), goto: "c2_gull" },
        { text: "Walk into the Corvids' office under the feather sign.",
          when: hasnt("c2_corvid_done"), goto: "c2_corvid_office" },
        { text: "The storm-glass is still falling. Find shelter and wait it out.",
          when: (s) => s.flag("c2_oshka_done") && s.flag("c2_gull_done")
            && s.flag("c2_reeve_done"),
          fx: { xp: 10 }, goto: "c2_storm_breaks" },
      ],
    },

    // ------------------------------------------------------------ harbor
    "c2_harbor": {
      text: `The harbor at half-tide is a forest of masts and a single argument
conducted in eleven directions at once. You find the harbormaster by
following the argument to its source: a barrel-shaped woman on the
quay-end, directing the warping of a coaster with two fingers and a
vocabulary that would strip paint.

Past her, out in the harbor's mouth, you see it: a buoy of pale wood,
old as driftwood bones, and under the glass-green water beneath it a
LIGHT. Deep down. A warm, patient, golden coil of light, like a knot
tied in lamplight, fastened to something far below.

It flickers as you watch. The whole harbor pauses — gulls and all —
for the space of one missed heartbeat. Then it steadies, and everyone
resumes, too quickly, the way people resume around an invalid who has
coughed.

'That,' says the harbormaster, arriving at your elbow with the
suddenness of weather, 'is the First Anchor, and if you stare at it
like that you'll buy me a round for the privilege. Dagny. You're the
new blade everyone's on about. Walk with me — gawping's extra.'`,
      choices: [
        { text: "Walk with Dagny. Ask what an Anchor actually is.",
          fx: { xp: 10 }, goto: "c2_harbor_dagny" },
      ],
    },

    "c2_harbor_dagny": {
      text: `'Nine of them,' Dagny says, walking you down the quay like cargo
she's decided to keep. 'Nine Anchors, drowned along this coast since
before anyone counted. Your inland gods weave, I'm told — well,
nobody wove US. The Tidemother MOORED us. Every life on this shore is
a line bent to one of the nine, and the knots hold you to yourself,
if you follow. Your name. Your dead. Your luck. All riding at anchor.'

She stops at the quay-end and nods at the deep gold coil.

'First Anchor's held Saltmere four thousand years, maybe more. This
past year she's been FRAYING. You saw the flicker — when she
flickers, lines come loose. Old Maren forgot her wedding morning,
whole and clean, like a parted hawser. The Brennis boy's LUCK parted
— walked under the one falling block in a harbor that hadn't dropped
a block in nine years. And out in the Shallows it's worse; out there
whole HOUSES are coming unmoored, sliding into a tide that doesn't
give back.

'And while the knots fail,' — her voice drops to coastal volume, and
her eyes go to the black office above — 'Mother Rook's crows are at
every door, buying. Buying brands, buying debts, buying the LINES
THEMSELVES, son. When a mooring fails, whoever holds your line holds
YOU. The old Lady kept the coast; this one's BUYING it, slip by
slip.'

# 'The knot-singers say the Ninth is waking what it holds,' she says.
'I say: hire on, stranger, whatever you are. The coast needs hands
that don't shake.'`,
      on_enter: { flags: { c2_harbor_done: true } },
      choices: [
        { text: "Back to the square, with the shape of the trouble in your head.",
          fx: { xp: 15 }, goto: "c2_saltmere_square" },
      ],
    },

    // ------------------------------------------------------- the knotworks
    "c2_knot_chapel": {
      text: (s) => `The knotworks is dim and smells of tar and beeswax. Cord everywhere:
braided pillars of it, walls hung with knots the size of fists and
knots the size of cartwheels, every one different, every one — you
feel it as you pass — slightly warm, like a sleeping animal.

${ws_god(s)
  ? `No altar. No god-shape anywhere. You spent time at the top of a loom
and you recognize what this is instead: not worship — MAINTENANCE.
A working relationship with whatever holds you, conducted with your
own hands.`
  : `No altar. At the center, where another country would put its god,
there is simply a hole in the floor — round, stone-lipped, breathing
cold sea-air — and the great cable that rises out of it, up through
the roof: the town's own line, bent to the First Anchor far below.`}

And there is singing. One voice, low, working — not performing,
WORKING, the way a sailor sings to time a pull. A woman kneels by the
stone lip with a frayed cord across her knees, singing to it, and
under her voice the cord's loose fibers are LIFTING, slow as
underwater weed, and reaching for each other.

She finishes the verse. The cord is whole. She bites off the tar-end
like thread, looks up at you, and grins with every tooth.

'Woven folk,' she says. 'You walk loud. Come in anyway.'`,
      choices: [
        { text: "Ask about the singing.", fx: { xp: 5 }, goto: "c2_oshka_song" },
      ],
    },

    "c2_oshka_song": {
      text: (s) => `'Oshka,' she says, by way of everything. 'Brine-singer. Last one on
this stretch, which is the trouble, or part of it.'

She talks the way she sings — working, unhurried. The songs are the
Tide Psalter: nine of them, one per Anchor, older than prayer. Not
magic, she insists, tapping the mended cord; ATTENTION. 'A knot is
just attention that holds. Sing to it, it remembers being attended.
Same as people.'

${s.flag("ws") === "unmade"
  ? `She studies you long, tide-eyed. 'You're the one who came in on the
pale wagon,' she says quietly. 'The world out past the Hem went
still, didn't it. We felt it let go, all at once, like a far ship's
lights going out.' She doesn't ask what you said yes to. She looks
at you like a sailor looking at someone who has been over the side
and come back up. 'And still you came to a shore that's drowning.
Huh.'`
  : ws_god(s)
    ? `She squints at you suddenly, leans close, and laughs — a short bark
of delight. 'HA. You smell of high places, woven one. Don't worry —'
she pats the great cable ' — out here that's nobody's business but
the water's. The Anchors don't care what you were. Only what you
hold.'`
    : `She reads your road off you the way harbor folk read weather: the
inland dust, the way you stand, the gear that's seen use. 'Long way
from the loom-lands, you. Good. We need hands that have held things
that pull.'`}

'Here's the chart of it, plain,' Oshka says. 'The Anchors fail one
by one, oldest first. The singing slows the fraying; it no longer
stops it. Something under the Ninth is pulling slack faster than the
coast can take it up — and the feather-office buys every line that
parts. I mean to walk the Nine and sing what can be sung, and find
out what the Ninth has under it, and I am one voice, and the marsh
between here and there eats single voices.'

# 'So,' she says, standing, boat-hook in hand, 'are you the kind of
loud that's useful, woven folk?'`,
      choices: [
        { text: "'I'm walking to the Ninth myself. Sing; I'll keep the marsh " +
                "off you.' (Oshka joins you)",
          fx: { xp: 15, recruit: "oshka", approval: { oshka: 10 } },
          goto: "c2_oshka_join" },
        { text: "'I work better alone. But I'll clear the road ahead of you.'",
          fx: { xp: 10, flags: { c2_oshka_solo: true } },
          goto: "c2_oshka_decline" },
      ],
    },

    "c2_oshka_join": {
      text: `Oshka travels light: the boat-hook, a sailcloth roll, and a knotted
cord around her neck that she calls the Psalter — 'the whole book,'
she says, running a thumb down its knots like a blind woman reading.
'Nine songs and the spaces between them. The spaces matter most.
That's where the held things breathe.'

At the chapel door she stops, turns back to the stone lip and the
great cable, and sings one short phrase — three notes, descending,
like something set down gently. The cable's deep hum answers a
half-tone truer.

'Habit,' she says, catching your look. 'You say goodbye to the line
that held you. Even if you're coming back. ESPECIALLY if you're
coming back; that's what makes it a line and not a leash.'

# In your pack, faintly, in a voice like cord under load, the Psalter
song goes on humming for an hour after she stops.`,
      on_enter: { flags: { c2_oshka_done: true } },
      choices: [
        { text: "Back to the square together.", goto: "c2_saltmere_square" },
      ],
    },

    "c2_oshka_decline": {
      text: `Oshka takes the refusal the way the coast takes weather: noted,
factored, no offense done or taken.

'Alone, then. You'll want this regardless.' She unpicks a single
small knot from the end of her neck-cord — it comes free reluctantly,
like a tooth — and presses it into your palm. It is warm, and it
hums, and holding it you can suddenly feel, faint and far below the
town, the First Anchor's deep gold attention, the way you can feel
a fire through a wall.

'First-Knot charm. It knows where the Anchors are; it warms when a
mooring's near, frets when one's failing. Singers tie them for the
marsh-walkers. Last singer, last charm — don't lose it, and don't
SELL it.' Her tide-eyes hold yours, suddenly all reef. 'The feathers
will offer. They offer for everything. The price will be fair, and
that's the trap. On this coast the fair price of a held thing is
always exactly the cost of letting go.'

# She turns back to her mending. 'Walk loud, woven folk. I'll be a
verse behind you the whole way.'`,
      on_enter: { flags: { c2_oshka_done: true }, "items+": ["c2_knot_charm"] },
      choices: [
        { text: "Back to the square, the charm warm in your pocket.",
          fx: { xp: 10 }, goto: "c2_saltmere_square" },
      ],
    },

    // ------------------------------------------------------ the salt reeve
    "c2_reeve": {
      text: `The Salt Reeve's house is sandbagged like a redoubt and run like one.
Inside, a gaunt man with a tide-table where his soul should be is
triaging a queue of the recently unmoored: a fisherman whose name
parted last week (his wife answers for him, twice, everything), a
girl carrying a door-knot that's gone cold, an old man who insists,
politely, repeatedly, that his house has begun to drift and nobody
will believe him.

'BELIEVE him,' the Reeve snaps at a clerk, not looking up. 'Shallows
file. Next.' Then, to you, in the same breath: 'You're the armed
rumor. Good. Here's the arithmetic: the Shallows — fishing hamlet,
forty-one souls, built on the mudflats because the fishing's rich
and the rent's nothing. Their mooring-stone was the first to start
slipping. I condemned the place in spring. They didn't go. You don't
go, do you, when it's your grandmother's floor. Now the storm-glass
is falling, the tide tonight will be the worst of the year, and I
have one Watch-boat, no singers to spare, and forty-one souls sitting
on mud that has stopped agreeing to be land.'

He finally looks up. His eyes are red-rimmed and exact.

# 'I can't order you into the Shallows. I'm asking. The tide turns in
three hours.'`,
      choices: [
        { text: "Go to the Shallows now, ahead of the storm.",
          fx: { xp: 10, karma: 4 }, goto: "c2_shallows" },
        { text: "Fund the evacuation properly first — boats, carters, bribes. " +
                "(give 30 gold)",
          when: gold(30),
          fx: { gold: -30, karma: 6, xp: 10, flags: { c2_funded_evac: true } },
          goto: "c2_shallows" },
        { text: "'Forty-one people who ignored a lawful order. Not my " +
                "arithmetic.' Walk out.",
          fx: { karma: -8, xp: 5, flags: { c2_refused_shallows: true } },
          goto: "c2_reeve_refused" },
      ],
    },

    "c2_reeve_refused": {
      text: `The Reeve doesn't curse you. Worse: he NODS, files you under what you
are, and turns to the next case before the door swings shut behind
you.

Outside, the storm-glass in the square has dropped another finger.
The crier has stopped crying the tide-tables and started crying
names — the Watch mustering anyone who'll row.

You tell yourself the coast was drowning before you got here. It's
even true. The knot on the wellhead creaks in the rising wind like
a ship working at her cable, like a town working at its own.

# Forty-one souls. The number files itself somewhere you don't
control and stays there, accruing.`,
      on_enter: { flags: { c2_reeve_done: true } },
      choices: [
        { text: "Back to the square.", goto: "c2_saltmere_square" },
      ],
    },

    "c2_shallows": {
      text: (s) => `The Shallows at falling light is a place already half-claimed: a
dozen stilt-houses on the glistening mud, walkways of grey plank,
and everywhere the FEEL of slippage — the charm in your pocket${
        s.hasItem("c2_knot_charm") ? " fretting like a trapped wasp" : ""
      }, the door-knots cold, the whole hamlet riding loose on its line.

${s.flag("c2_funded_evac")
  ? `Your gold worked ahead of you: carters and Watch-folk are already
loading grandmothers and net-bundles, and the argument is half-won
by the time you wade in. What's left is the hard residue — the ones
who won't leave for money or sense.`
  : `Nobody has started loading. They watched you come up the plank-road
with arms crossed: forty-one people on doomed mud, and every face
wearing the same look, which is not stupidity, whatever the Reeve's
files say. It's the look of people holding the only thing that's
ever held them back.`}

In the largest house, the holdout: Wide Marta, the hamlet's
grandmother-general, in a chair by a cold hearth with the Shallows'
mooring-knot in her lap — a great black braid, generations old,
visibly parting strand by strand even as you watch.

'My mother tied into this,' she says, not looking up. 'And hers. You
feel them, in a held knot. Faint. Like voices through a floor. If I
let the feathers buy it, or the tide take it —' her thumb moves over
the fraying ' — who holds THEM, stranger? Where do the held dead go
when the line parts?'

# Outside, the tide turns. You hear it turn. It sounds like a key.`,
      choices: [
        { text: "Carry her out, chair, knot and all, arguing the whole way. " +
                "[Might]",
          check: { stat: "might", dc: 11, ok: "c2_shallows_rescue",
                   fail: "c2_shallows_wraith",
                   ok_fx: { karma: 5, xp: 20 } } },
        { text: "Sit down. Take a strand of the knot in your own hand, and " +
                "answer her question like it deserves. [Spirit]",
          check: { stat: "spirit", dc: 12, ok: "c2_shallows_rescue",
                   fail: "c2_shallows_wraith",
                   ok_fx: { karma: 8, xp: 25,
                            flags: { c2_marta_heard: true } } } },
      ],
    },

    "c2_shallows_rescue": {
      text: (s) => `${s.flag("c2_marta_heard")
  ? `You hold the strand and you answer her: that a knot is attention,
that attention can be carried as well as moored, that her mother's
voice through the floor will come WITH the knot if the knot comes
with her — you don't know the cord-script, but you have carried a
lantern of last breaths, or broken a crown, or stood where the dead
sit up; you know with some authority that the held dead are not so
easily lost.

Marta studies you a long moment. Then she bites off the trailing
strand, ties the great braid off short — 'a carrying hitch,' she
says, 'my mother showed me, I never thought I'd stoop to it' — and
stands up out of the chair on her own two feet.`
  : `Marta curses you up the plank-road, down the shore, and well out
onto the flats, in cord-script and common both, hammering your
shoulder with a fist like a belaying pin. She does not, however,
let go of your neck, and the knot rides in her lap like a cat.`}

The hamlet follows its grandmother. It was always going to; that's
what she was holding. Forty-one souls, two mules, one black braid
and a chair come up the cliff road in the first horizontal rain,
and the Watch-boat takes the stragglers off the last walkway as the
mud under it exhales and lets the sea in over the floors.

By full dark the Shallows is a memory with lamplight in it, looking
back down at the tide closing over the stilts.

# Forty-one. The number settles somewhere in you, paid in full.`,
      on_enter: { flags: { c2_reeve_done: true, c2_saved_shallows: true } },
      choices: [
        { text: "Back up to Saltmere through the rising storm.",
          fx: { xp: 15 }, goto: "c2_saltmere_square" },
      ],
    },

    "c2_shallows_wraith": {
      text: `The tide does not wait out your argument.

It comes across the flats not as water but as a LETTING GO — the
walkways shrug, the stilt-houses lean like tired men, and the
Shallows' mooring-braid in Marta's lap parts its last generation of
strands with a sound like a sigh through a floor.

And what the parted line lets go of comes up out of the mud.

It wears the hamlet's shape the way fog wears a valley: a figure of
salt-water and silt, tall as a stilt-house, trailing plank and net
and the cold smell of every winter the Shallows ever survived. It is
not angry. That's the terrible thing. It reaches for Marta, for the
knot, for all of them, with the fumbling tenderness of something
trying to GATHER WHAT IT HELD —

— and it has forgotten that hands like that crush what they gather.

'MOVE THEM!' Marta is up, hauling neighbors herself. 'It's the old
mooring — it doesn't know it's dead! Cut it loose of us or nobody
leaves this mud!'`,
      choices: [
        { text: "Stand between the hamlet and its drowned mooring.",
          combat: { enemy: "c2_knot_wraith", win: "c2_shallows_after",
                    win_fx: { xp: 35, karma: 3 } } },
      ],
    },

    "c2_shallows_after": {
      text: `It comes apart like a wave deciding against the shore — a long
collapse of salt-water and silt, and at the end, just before the mud
takes it back, a sound. Not a scream. A settling. The sound a house
makes when everyone is finally home and the door is shut.

Marta stands over the wet ruin of the old braid, rain hammering her
shoulders, and ties the last sound of it into the carrying-hitch on
her shortened knot, lips moving. Then she looks up at you with her
general's face back on.

'Well,' she says. 'Now it's a procession.'

Forty-one souls come up the cliff road through the storm's first real
violence, in better order than the Watch thought possible and worse
temper than the storm itself. The Reeve meets the column at the gate
with dry blankets and his tide-table face, and Marta hands him her
shortened knot to log like a captain surrendering a sword, and takes
it straight back.

# Behind and below, the sea closes over the Shallows without one
light left burning in it. The held dead, you have to believe, came
up the road with the rest.`,
      on_enter: { flags: { c2_reeve_done: true, c2_saved_shallows: true } },
      choices: [
        { text: "Into the lee of the square as the storm gets to work.",
          fx: { xp: 15 }, goto: "c2_saltmere_square" },
      ],
    },

    // ------------------------------------------------------ the patient gull
    "c2_gull": {
      text: (s) => `The Patient Gull is everything a coast tavern should be: low beams,
wet wool, a fire of wreck-timber that burns in colors, and a
clientele that goes quiet for exactly two heartbeats when you enter
— measuring — before the noise closes back over you like water.

You take a corner with a mug of something the landlord calls beer
and the sea calls a misunderstanding${
        s.inParty("oshka")
          ? `. Oshka is received like weather — nods, raised mugs, a stool
appearing for her unasked. Last singer on the stretch. The coast
knows what it has left`
          : ""}.

The town talks. You listen. It's a skill the road taught you, and
the Gull rewards it.`,
      choices: [
        { text: "Let the rumors come to you.", fx: { xp: 5 }, goto: "c2_gull_rumors" },
      ],
    },

    "c2_gull_rumors": {
      text: (s) => {
        const base = `Three mugs' worth of coast, sorted:

THE DROWNED MARKET. Under the cliffs south of town, reachable only at
ebb, there's a market in a sea-cave the size of a cathedral — tide
in the morning, commerce in the afternoon, the law nowhere ever. 'If
it can be bought, it's down there. If it CAN'T be bought, it's down
there twice.' A pale stall has lately set up in the deep end, the
kind of stall the older drinkers won't describe past a certain point.

MOTHER ROOK. Not new, the regulars insist — RETURNED. 'Her
grandmother's grandmother ran the same office under the same
feather.' Except, says the oldest drinker, into his mug, that's the
joke, isn't it: it's no dynasty. Same office. Same feather. Same
LADY, wearing the years like the office wears its paint. She holds
paper on half the coast, and lately she's not collecting — she's
BUYING. Failed moorings. Parted lines. Slack.

THE NINTH ANCHOR. Out past the marsh, under the lowest water of the
world's lowest tide. The knot-singers' psalter ends there, and so do
the singers — none in living memory has sung the ninth song at the
ninth stone and come back the same, or come back. 'Something under
it is BORROWING,' the oldest drinker says, with the queer precision
of the very drunk. 'That's the old word for it. Borrowing. And the
collateral's US, and the term's nearly up.'`;
        const vexAlive = s.companions.vex && s.companions.vex.alive
          && !s.flag("vex_lost");
        const tail = vexAlive
          ? `

And then the room does the two-heartbeat quiet again — but not for
you. For the figure that has just come in out of the storm with no
wet on their coat at all, scanning the corners with professional
speed, finding you on the second pass.

# Vex. A year older, dressed for richer weather, with one glove on —
and under the glove, glowing through the leather like a coal through
a stove door, the brand.`
          : `

And at the bottom of your third mug, the landlord brings what no one
ordered: a letter. Pale envelope, no name, your seal — YOUR seal,
the one that doesn't exist. 'Came in on the morning cart,' he says,
not meeting your eye. 'The pale one's cart.'

# Inside, in a clerk's perfect hand: one debt outlives its debtor.
And folded in the paper, cold as a drowned thing: a strip of branded
leather you last saw on a living wrist.`;
        return base + tail;
      },
      on_enter: { flags: { c2_gull_done: true } },
      choices: [
        { text: "Cross the room to Vex.",
          when: (s) => s.companions.vex && s.companions.vex.alive
            && !s.flag("vex_lost"),
          fx: { xp: 5 }, goto: "c2_vex_arrives" },
        { text: "Pocket the brand. Some debts you inherit; this one you'll " +
                "carry to the creditor personally.",
          when: (s) => !(s.companions.vex && s.companions.vex.alive)
            || s.flag("vex_lost"),
          fx: { xp: 15, flags: { c2_vex_brand_carried: true } },
          goto: "c2_vex_post" },
      ],
    },

    "c2_vex_arrives": {
      text: (s) => `'Don't,' Vex says, before you've said anything, sliding into your
corner like the corner owed them money, 'say it.'

You say nothing. Vex tells you everything anyway; it was always
their tell — silence in, torrent out.

'Year went FINE, thanks. Worked the river towns. Kept the tenth-
rule.' ${s.approval("vex") >= 25
  ? "A flicker of the old crooked grin. 'Kept your address too, not that you have one. You're murder to send severance to.'"
  : "No grin. The year sits on them like wet rope."} 'Then a month
ago the brand WOKE UP. Not a debt-tug — I know the tug, the tug and
I are old dance partners. This was a SUMMONS. North-west, it said,
the way a hook says "upstream" to a fish. I fought it for three
weeks. Lost ground every night I slept. Woke up four days ago on a
mail-coach to the coast with no memory of buying the seat, and the
brand purring like a fed cat, and the coachman saying "Saltmere,
end of the line."'

Vex peels back the glove. The brand has CHANGED: Mother Rook's mark,
yes, but new lines grown through it, fine as engraving — cord-lines,
knot-lines, the same pattern that's on every doorpost in this town.

'It's not just my debt anymore,' Vex says, very quietly, the
professional gone out of their voice and something much younger left
behind. 'She's TYING it to something. Down here. Something old. And
the worst part —' the glove goes back on, the grin comes back up,
broken at one corner ' — is she didn't even bother to summon me
HERSELF. The COAST did it. I'm in somebody's ledger as
COLLATERAL, friend, and I would very much like to know for WHAT.'`,
      choices: [
        { text: "'Then we find out together. Like the old road.' (Vex rejoins)",
          fx: { xp: 20, recruit: "vex", approval: { vex: 10 } },
          goto: "c2_vex_rejoin" },
        { text: "'Stay close, but off my line of approach. If Rook's tied " +
                "you, she can pull you.' Honest, and it lands like a slap.",
          fx: { xp: 10, approval: { vex: -6 },
                flags: { c2_vex_kept_distant: true } },
          goto: "c2_vex_rejoin" },
      ],
    },

    "c2_vex_rejoin": {
      text: (s) => `${s.inParty("vex")
  ? `Vex exhales something that's been held for a month, and the
professional slides back into place over it like a well-oiled bolt.

'Right. Terms: I steal nothing that doesn't deserve it, you don't
ask me to be brave before breakfast, and if I say a room smells like
arithmetic, we LEAVE the room.' The grin finds its old shape. 'Gods,
it's good to — yes. Fine. Don't make it a thing.'`
  : `Vex takes it like a knife-thrower's assistant: absolutely still,
absolutely professional, hurt only somewhere behind the eyes where
they think the house lights don't reach.

'Sensible,' they say lightly. 'Sensible's your whole genre.' They
stand, flip a salt-stamped coin onto the table for the beers, and
pause one heartbeat. 'I'll be where I'm useful. Try not to need me
anywhere fatal.'`}

The wreck-fire pops blue. Out in the storm the crier's horn sounds
the hour, and under the floorboards — everyone in the Gull pretends
not to feel it — the whole tavern leans a half-inch seaward and
comes back, like a ship testing her cable.

# Saltmere is riding at a fraying anchor, and the storm of the year
has just put its shoulder against the town.`,
      on_enter: { flags: { c2_vex_thread: true } },
      choices: [
        { text: "Back to the square. The storm-glass has nowhere left to fall.",
          goto: "c2_saltmere_square" },
      ],
    },

    "c2_vex_post": {
      text: `You sit with the strip of branded leather a long time while the Gull
roars gently around you.

The brand still GLOWS, faint as marsh-light. A debt outlives its
debtor. You'd thought — when you thought of it at all — that of all
the road's unfinished business, Vex's ledger-line at least had
closed itself. But Mother Rook does not write off; she CARRIES
FORWARD. And now the carried-forward has cord-lines grown through
it, fine as engraving, the same knotwork that's on every doorpost
in Saltmere, and the letter's clerk-hand has a postscript you keep
rereading:

'The bearer is advised that assumption of a debt is a recognized
form of payment. The Lady's table is always laid. — R.'

She wants you to take it on. She's INVITING you to take it on. Which
means either she has no idea who you are, or — the wreck-fire pops
blue; the tavern leans seaward and comes back — she knows exactly,
and a debt of yours is worth more to her than a debt of anyone's.

# You fold the leather into your inmost pocket, where it sits against
your chest like a small cold ember, accruing.`,
      on_enter: { flags: { c2_vex_thread: true } },
      choices: [
        { text: "Back to the square, carrying the inheritance.",
          fx: { xp: 10 }, goto: "c2_saltmere_square" },
      ],
    },

    // ------------------------------------------------------ the corvid office
    "c2_corvid_office": {
      text: `Inside, the office of the feather is the quietest room on the coast:
black wood, brass rails, ledger-stands like lecterns, and clerks in
feathered half-cloaks moving with the hush of a profession that has
learned its customers cry easily.

The queue ends at a counting table where a Corvid with kind eyes and
terrible arithmetic is doing brisk trade in the only commodity the
drowning have left. A fisherman sells the debt on his boat — and
the boat's LINE with it, the clerk's pen scratching the cord-script
sigils with notarial care. An old woman sells her late husband's
brand 'to stop it pulling at her.' A young man, grey-faced, sells —
you watch it happen, watch the pen pause and dip with relish — his
NAME, against passage inland, and signs the receipt with a mark,
because between pen-lift and ink-dry he can no longer write it.

On the wall behind the table, framed in black, the office's terms,
in lettering old enough to predate every law you know:

ALL DEBTS HONORED. ALL HOLDINGS HELD.
THE LADY KEEPS THE COAST.

A senior clerk materializes at your shoulder, feathered, polite,
with eyes like a ledger's idea of friendship. 'The wanderer. Madam
flagged your account the day you crossed the Hem.' The bow is
exquisite. 'Browsing? Or shall I quote you?'`,
      choices: [
        { text: "Buy out the grey-faced young man's contract before the ink " +
                "dries. (40 gold)",
          when: gold(40),
          fx: { gold: -40, karma: 8, xp: 15, flags: { c2_bought_name: true },
                approval: { oshka: 5, vex: 3 } },
          goto: "c2_brand_buyout" },
        { text: "'Quote me.' Hear what the Corvids think you're worth.",
          fx: { xp: 10 }, goto: "c2_corvid_quote" },
        { text: "Walk out before the room's arithmetic gets on your skin.",
          fx: { xp: 5, flags: { c2_corvid_done: true } },
          goto: "c2_saltmere_square" },
      ],
    },

    "c2_brand_buyout": {
      text: `The pen stops. The whole office stops — a hush inside the hush — as
your gold goes onto the counting table, and you understand from the
quality of the silence that this has happened here before, but not
often, and never well for anyone the clerks remembered afterward.

'Redemption by third party,' the senior clerk says at last, in the
tone of a man citing scripture for a heresy. 'Recognized. Rare.' The
pen reverses; the cord-script sigils are struck through one by one,
and with each stroke the grey-faced young man gets some of his face
back, like a tide turning in a person. When the clerk reaches the
name-line he hesitates — looks at you, something underneath the
ledger-friendship for just a moment, something almost like appetite,
or warning — and strikes it.

The young man says his own name out loud. Once. Twice. Then he's
crying and trying to give you a boat-hook, his coat, anything, and
you're steering him out the door into the rain where his sister is
waiting, and the office closes around the interruption like water.

But you heard it, just before the door: the senior clerk, murmuring
to his ledger, in the voice of a man making a note that will be
READ:

# 'Madam will want to meet this one at table.'`,
      on_enter: { flags: { c2_corvid_done: true } },
      choices: [
        { text: "Out into the storm-light, lighter by forty gold and heavier " +
                "by a flag in Mother Rook's ledger.",
          fx: { xp: 10 }, goto: "c2_quill_alley" },
      ],
    },

    "c2_corvid_quote": {
      text: (s) => {
        const lines = [];
        lines.push(`The senior clerk produces, from nowhere, a slate already written.

'Standing offer, subject to madam's pleasure. For the contents of
your pack: market rates, dull, I won't insult you.' The chalk taps
down the slate.`);
        if (s.hasItem("soul_lantern")) {
          lines.push(`'For the LANTERN — and do tell it to stop glaring at my clerks —
two hundred in salt-gold, and madam instructs me to add: she knew
Ashfen. Before. Her condolences are on file.'`);
        }
        if (s.hasItem("c2_knot_charm")) {
          lines.push(`'For the singer's charm at your breast: three hundred. The last
of anything appreciates beautifully.'`);
        }
        lines.push(`'And for the account you carry that is not gear, not gold, and not,
strictly speaking, YOURS —' the chalk stops; the ledger-friendship
in his eyes folds back like a shutter, and what's behind it has been
doing this arithmetic for a very, very long time ' — for THAT,
madam quotes no figure in a public room. The Lady's table is always
laid, wanderer. Bring your appetite.'

# He means the brand, or the debt, or the choice you made at the
bottom of the world. Possibly he means you. The quote, you realize,
was never the point: the FLAGGING was.`);
        return lines.join("\n\n");
      },
      on_enter: { flags: { c2_corvid_done: true } },
      choices: [
        { text: "Decline everything, with the road's politeness, and leave.",
          fx: { xp: 10 }, goto: "c2_quill_alley" },
      ],
    },

    // --------------------------------------------------------------- quill
    "c2_quill_alley": {
      text: `The side door lets you into the alley behind the office, where the
storm is auditioning between the walls — and where three Corvids
have a fourth figure backed against the wet brick.

The fourth is small, drenched, weighted with a satchel hugged to the
chest the way drowning people hug spars, and talking very fast: '—
absolutely standard records transfer, NOTHING irregular, if you'd
simply consult the duty ledger, which, FUN FACT, I keep, or KEPT—'

'Page seventy-one,' says the lead Corvid, with no friendship in the
voice at all, and the small figure flinches like the number is a
thrown knife, and that's all you really need to know about who has
what in the satchel.

The lead Corvid registers you without turning. 'Office business,
wanderer. The clerk Quill has madam's property. Walk on.'

'I AM madam's property, TECHNICALLY, which is page seventy-one's
whole POINT—' Quill's eyes find yours over the feathered shoulders:
grey, terrified, and absolutely, lucidly furious. 'They're not going
to file me, friend. People who read page seventy-one don't get
FILED.'`,
      choices: [
        { text: "Step in. Three on one is bad bookkeeping.",
          combat: { enemy: "c2_corvids", win: "c2_quill_join",
                    win_fx: { xp: 30, karma: 4 } } },
        { text: "'Office business needs a docket. Show me the writ for a " +
                "street seizure, clerk.' Bury them in their own procedure. [Wits]",
          check: { stat: "wits", dc: 12, ok: "c2_quill_join",
                   fail: "c2_quill_fight",
                   ok_fx: { xp: 30, karma: 3,
                            flags: { c2_quill_paper: true } } } },
        { text: "Walk on. The coast's ledgers are not your war.",
          fx: { karma: -6, xp: 5, flags: { c2_quill_gone: true,
                                           c2_corvid_done: true } },
          goto: "c2_quill_lost" },
      ],
    },

    "c2_quill_fight": {
      text: `The lead Corvid hears out your procedural objection with genuine
professional appreciation — 'nice form, wanderer, madam would enjoy
you' — and then nods to the other two, because the trouble with
arguing procedure with the people who write the procedure is that
page one says the Lady keeps the coast.

# Knives, then. The old appendix to every procedure there is.`,
      choices: [
        { text: "Appendix it is.",
          combat: { enemy: "c2_corvids", win: "c2_quill_join",
                    win_fx: { xp: 30, karma: 3 } } },
      ],
    },

    "c2_quill_join": {
      text: `The alley empties of feathers — limping, deferred, NOT concluded,
the lead Corvid's parting look says the matter has merely been moved
to a later page — and the small drenched clerk slides down the wall
into a crouch, satchel still clutched, breathing like a landed fish.

'Quill,' they manage. 'Records clerk, formerly of the office, three
years, EXEMPLARY appraisals, not that it — okay. Okay.' A long
breath. The eyes come up, and the lucid fury is still there, banked
now into something steadier. 'You want to know what's on page
seventy-one. Everyone sensible would.'

They open the satchel two inches: oilcloth, and inside it one page —
ONE page, heavy as vellum, edges charred where it was cut from its
binding — covered in cord-script older and denser than anything on
the doorposts, and at the head of it one entry, one line, in ink
that your eye slides off exactly the way a certain blind spot
slides a god's.

'The master ledger's first page,' Quill says, very quietly, under
the storm. 'The Lady's oldest account. I filed for three years
twenty feet above it and believed the office's own fairy tale that
the vault was empty. It's the FIRST DEBT, friend. The original. The
one all the others are interest on. I can't read the old script —
but I can read a balance column, and the balance column says it
comes due THIS SEASON, and the collateral entry —' the satchel
shuts; the grey eyes are older than the face for one bad moment
' — the collateral entry is longer than the page. It just says:
THE SHORE.'

# 'So. You seem to hit people for sensible reasons. I'm with you,
if you'll have a clerk. I'm a disaster in a fight and the best
records-keeper madam ever branded, and I am NOT getting filed.'`,
      on_enter: { flags: { c2_corvid_done: true } },
      choices: [
        { text: "'I'll have the clerk. Keep the page hidden and the pencil " +
                "sharp.' (Quill joins you)",
          fx: { xp: 15, recruit: "quill", approval: { quill: 10 },
                "items+": ["c2_ledger_page"] },
          goto: "c2_saltmere_square" },
        { text: "'Keep your page, give me the gist, and get inland tonight. " +
                "This coast is about to be a bad place for footnotes.'",
          fx: { xp: 10, karma: 2, flags: { c2_quill_sent_away: true },
                approval: { quill: 3 } },
          goto: "c2_saltmere_square" },
      ],
    },

    "c2_quill_lost": {
      text: `You walk on. The alley does what alleys do behind people who walk
on: it goes quiet in stages — the fast talking, then the scuffle,
then a short sharp sound like a satchel-strap parting, or something
lighter than a satchel-strap.

At the alley's end, pinned under a loose cobble where the wind
can't take it, a page of cheap duty-paper flaps. Salvaged habit, or
a drowning clerk's last filing. In a small, fast, terrified hand:

'TO WHOEVER: p.71. FIRST DEBT. DUE THIS SEASON. COLLATERAL: THE
SHORE — ALL OF IT. The Lady doesn't keep the coast. The Lady KEEPS
the coast. Tell SOMEONE. Tell anyone who hits people for sensible
reasons. — Q.'

# You pocket the page. The rain fills in the alley behind you,
thorough as a clerk, balancing the day.`,
      choices: [
        { text: "Back to the square, reading the note again.",
          fx: { xp: 5 }, goto: "c2_saltmere_square" },
      ],
    },

    // ------------------------------------------------------------ the storm
    "c2_storm_breaks": {
      text: (s) => `The storm of the year arrives at full dark, and Saltmere fights it
the way a crew fights, not a town: shutters battened in relays, the
Watch-horn talking up and down the streets in short codes, the whole
cliff-stacked warren of the place working its cable.

You're in the Gull's lee with half the street when the COLOR
changes. Down in the harbor's black mouth, the deep gold coil of
the First Anchor — visible even through storm-water, even from
here — flickers. Steadies.

Flickers.

${s.inParty("oshka")
  ? `Oshka is already moving, boat-hook in hand, Psalter-cord swinging
free. 'It's TONIGHT,' she shouts over the wind, and her voice has
the first fear you've heard in it. 'She's been waiting for a tide
heavy enough to pull against — UP, woven folk, the harbor, NOW—'`
  : `And the bells begin — not the storm-code, the OTHER one, the one
you've heard the whole coast dread sideways in three days of
listening. The Anchor-toll. Slow, cracked, total: the sound of a
town discovering its hand is slipping off the rail.`}

The harbor-front, when you fight your way down to it, is bedlam in
oilskins. Dagny stands at the quay-end with a storm-lantern,
counting the flickers like a surgeon counting a pulse, and what she
says when you reach her she says flat, without turning, in the
voice of someone already past the bad news into logistics:

# 'She's letting go, hero. Tonight. Tide's bottom is in one hour —
the only hour in ten years a body can get DOWN to her. Singers used
to do it roped, in pairs, in CALM weather.' The lantern swings to
the boiling black water. 'Well?'`,
      choices: [
        { text: "Go down to the First Anchor.",
          fx: { xp: 15 }, goto: "c2_anchor_descent" },
      ],
    },

    "c2_anchor_descent": {
      text: (s) => `Down is a word that loses its manners fast.

Dagny's crew ropes you to the quay-winch and feeds you into a
gap in the storm's argument — down a weed-slick maintenance stair
older than the harbor, then hand over hand along the GREAT CABLE
itself, the town's mother-line, thrumming under your grip like a
struck bridge. The water when it takes you is cold as arithmetic.
${s.inParty("oshka")
  ? `

Oshka comes down the cable above you, singing as she climbs — you
can't hear it through the water, you FEEL it, conducted down the
line into your hands: the First Psalm, the Saltmere song, steady as
a heartbeat lent to someone whose own is failing.`
  : `

The First-Knot charm at your chest burns warm against the cold,
fretting, pulling DOWN — a small loyal panicked thing dragging you
toward what it loves.`}

And then the harbor floor opens below you and there she is.

The First Anchor.

Not a stone. Not a knot. Both, and neither: a coil of patient gold
light the size of a millhouse, tied around a black stone older than
the idea of stones, and every line of light is a LIFE — you can see
them, thousands, the whole town and its dead and its luck and its
names, bent to her in fine bright threads — and she is FRAYING,
great loops of her pattern hanging slack in the black water,
unravelling in slow gold rags with each pull of the storm-tide
above.

# And between you and her, treading the dark with horrible patience,
is everything she has already let go of.`,
      choices: [
        { text: "Through it. The Anchor first; grief after.",
          combat: { enemy: "c2_knot_wraith", win: "c2_anchor_choice",
                    win_fx: { xp: 35 } } },
      ],
    },

    "c2_anchor_choice": {
      text: (s) => `The water stills around the Anchor the way air stills in a sickroom.
Up close, her light comes through you rather than at you, and in it
you can hear — not with ears — the held: a tidal murmur of names and
mornings and wedding-days and debts, four thousand years of Saltmere
riding at this one mooring.

And you can hear the FRAY: a long soft parting note under
everything, the sound of attention coming to its end.

${s.inParty("oshka")
  ? `Oshka reaches her, lays both palms against the gold, and her song
comes conducted through the light into your bones: the First Psalm,
complete, the way it hasn't been sung down here in a hundred years.
The slack loops stir. Lift. REACH, like the chapel cord-fibers,
groping for their pattern — but the pattern needs more than song.
The song is attention; the knot needs a HAND. 'Now!' her voice rings
through the gold. 'She remembers! Help her remember — TIE!'`
  : `The charm at your chest is incandescent now, hauling you forward,
and when your hands touch the gold the Psalter's pattern floods up
your arms uninvited — not knowledge, OFFER: the Anchor herself,
showing her own knot to the only hands that came down.`}

This is the moment, then. Tonight, in the deep, with a town riding
on it.

# Below you — below the Anchor, below the stone, down where the
harbor floor falls away into the real dark — something vast shifts,
interested, and a pressure brushes your mind like a creditor's
finger running down a column to your name.`,
      choices: [
        { text: "Tie. Give the Anchor your hands and whatever in you has " +
                "ever held anything. [Spirit]",
          check: { stat: "spirit", dc: 12, ok: "c2_anchor_tied",
                   fail: "c2_anchor_slipping",
                   ok_fx: { xp: 40, karma: 6 } } },
        { text: "Tie with main strength — haul the slack bodily into the " +
                "pattern the light shows you. [Might]",
          check: { stat: "might", dc: 13, ok: "c2_anchor_tied",
                   fail: "c2_anchor_slipping",
                   ok_fx: { xp: 40, karma: 5 } } },
        { text: "Let her go. Four thousand years is a watch stood long " +
                "enough; ease the parting instead of fighting it.",
          when: hasnt("c2_saved_shallows"),
          fx: { karma: -10, xp: 25, flags: { c2_first_anchor: "slipped" } },
          goto: "c2_anchor_slipped" },
      ],
    },

    "c2_anchor_tied": {
      text: (s) => `Your hands learn, in one cold gold hour, what the singers always
meant: a knot is attention that holds, and attention is just love
with its sleeves rolled up.

You tie. The Anchor shows; you follow — loop into loop, life into
life, the slack rags of her pattern drawing up taut through your
fingers, and every loop that closes is a SOUND somewhere far above:
a name remembered mid-sentence, a door-knot warming on its post, an
old woman in a storm-shuttered house upstairs getting her wedding
morning back like a tide turning in her.

${s.inParty("oshka")
  ? `Oshka sings the closing verse with tears boiling off into the
seawater, and the last loop draws shut to the last note, knot and
song arriving home together, the way they were made to.`
  : `The charm at your chest sings the closing of it, tiny and fierce,
the last singer's last knot conducting four thousand years of
pattern through your borrowed hands.`}

The First Anchor comes TIGHT. The gold steadies — brightens —
remembers itself all the way down to the black stone, and the whole
drowned coil of her rings once, soundless, a bell of held lives,
and far above you feel the town stop sliding.

You hang there in the gold, spent, roped to a winch at the bottom
of a storm, and the held murmur washes through you — and just for
a moment, clear among the thousands, you'd swear you hear voices
you know: a floor's worth of Shallows dead, settling into the new
hitch, home.

# Below, in the real dark, the vast interest withdraws — unhurried,
noting, the way a creditor notes a payment that changes nothing
about the principal.`,
      on_enter: { flags: { c2_first_anchor: "tied" } },
      choices: [
        { text: "Up, to the surface and the spent storm.",
          fx: { xp: 20 }, goto: "c2_act1_after" },
      ],
    },

    "c2_anchor_slipping": {
      text: `The pattern is too much. It was always going to be too much — four
thousand years of holding, offered to two mortal hands in one hour —
and the slack runs through your grip like the tide itself, gold
rags unravelling faster now, the parting note rising under
everything, and somewhere above a bell you can feel through the
water begins to toll the worst code there is.

The Anchor is going. Not tonight, you understand suddenly, with her
light pouring through you — she has WEEKS, the last knots are the
oldest and strongest — but going, and no hands, no song, no single
night's heroism is going to re-tie four millennia.

Unless.

The light shows you one more thing, because you're holding her and
she has no one else to show: the FIRST knot. The pattern under her
pattern. Tied not here but at the NINTH stone, by hands that tied
all nine as one work — the Anchors are not nine moorings, they are
ONE mooring with nine points, and the slack is running out of all
of them toward the Ninth, toward the deep dark where the vast
interest waits, because that is where the work was signed.

# Hold what you can, the light says, in the voice of every tired
holder you have ever met. And then go where the holding started.`,
      on_enter: { flags: { c2_first_anchor: "slipping" } },
      choices: [
        { text: "Tie off what your hands can hold, and surface with the " +
                "Anchor's last instruction burning in you.",
          fx: { xp: 30 }, goto: "c2_act1_after" },
      ],
    },

    "c2_anchor_slipped": {
      text: `You open your hands.

It is not violence. That's what no one up there will believe, after:
it is the gentlest thing you have ever done, and the most enormous.
You ease your grip loop by loop, and the First Anchor — four
thousand years of holding, asked one hour too many — sighs out of
her pattern like a watchstander relieved at last, gold rags
unravelling into the black water, soft, final, GRATEFUL, which is
the part you will never tell anyone.

The held lines part one by one, each with its small distinct sound
somewhere above: a name going. A luck going. A door-knot, cold. The
murmur of four thousand years thins, and thins, and stills.

The black stone, unmoored, goes down into the real dark without a
sound. Something down there receives it the way a ledger receives
an entry.

You surface into a town that is screaming.

Not loudly. That's the horror of it. Saltmere stands at her rails
and quays in the spent storm, hundreds of faces, and the screaming
is all INSIDE — people clutching at names going vague, at dead
parents suddenly unrememberable, at the particular silence where a
held thing was. Dagny hauls you over the quay-edge, takes one look
at your open empty hands, and does not say one word. Ever again,
to you.

# The harbor-quarter of Saltmere came off her mooring tonight. The
town will float, the way hulks float. And the Corvid office, you
notice, has lit every lamp it owns, and the clerks are already
moving through the crowd with their slates, buying.`,
      on_enter: { flags: { c2_reeve_done: true } },
      choices: [
        { text: "Walk through what you chose, to the cliff stair.",
          fx: { xp: 15 }, goto: "c2_act1_after" },
      ],
    },

    // ------------------------------------------------------------ aftermath
    "c2_act1_after": {
      text: (s) => {
        const open = {
          tied: `Dawn after the storm of the year, and Saltmere is LOUD with relief:
bells rung in the good code, the Gull serving breakfast-beer free
to anyone wet, Dagny telling the story at the quay-end with your
part getting larger by the telling. The town held. The town KNOWS
it held by one night and two hands, and the coast's gratitude is
like its weather — total, physical, and brief.`,
          slipping: `Dawn after the storm of the year, and Saltmere wears the face of a
family after a deathbed rally: relieved, and not fooled. The First
Anchor held — mostly. You hear the gaps all morning: a fishmonger
mid-sale groping for her dead sister's name; a child's door-knot
gone cold in the night, reknotted by a grim-faced father who
doesn't believe in it anymore. The town knows what you bought it.
Weeks. The town has decided to spend them well, which is the most
coastal thing you've seen yet.`,
          slipped: `Dawn after the storm of the year, and Saltmere buries what a town
buries when no one has died: names, lucks, mornings. The unmoored
walk the streets with the careful gait of people carrying bowls
filled past the brim. The Corvid office does not close all day.
You walk through it all unspoken-to, which on this coast is a
verdict.`,
        };
        const tail = `

At the cliff's south shoulder, where the ebb has drawn the sea back
from a stair cut into the living rock, a handbill is nailed to the
tide-post. Pale paper. Perfect clerk's hand. You know the stationery
before you're close enough to read:

'THE DROWNED MARKET sits at ebb. All custom welcome. The undersigned
begs to announce a stall of ENDINGS, FINDINGS, and PRIOR
ARRANGEMENTS, and would be honored by the wanderer's visit at the
earliest tide.

P.S. — The Lady's table is also laid, and it is laid for YOU, and
one does so hate to see anyone go to THAT table unadvised. Come
down first. Bring the questions. I shall have the answers out on
the counter, priced to move. — P.M.'

# Below, under the cliffs, the ebb uncovers the sea-cave's mouth:
lamplight already moving in it, and the day's commerce going down
the stair. The Drowned Market is open, and the Pale Merchant is
expecting you.`;
        return (open[s.flag("c2_first_anchor")] || open.slipping) + tail;
      },
      choices: [
        { text: "Down the cliff stair at the ebb, into the Drowned Market.",
          fx: { xp: 15 }, goto: "c2_market_stair" },
      ],
    },

    "c2_market_stair": {
      text: (s) => `The stair down is a negotiation with the sea about whose turn it is:
weed-slick steps, rope rails spliced by generations of nervous
hands, and tide-marks on the rock above your head — well above your
head — that you decline to think about in detail.

${s.inParty("quill")
  ? `Quill descends behind you reciting the market's tide-table from
memory, in the tone other people use for psalms. 'Four hours of ebb.
Four. Then the sea audits the cave and EVERYTHING gets filed. The
stallholders set their clocks by — that bell. That one. You'll
hear it.' `
  : ""}${s.inParty("oshka")
  ? `Oshka touches the rock as she goes, reading the tide-marks like a
ledger of her own. 'The Market's older than the town,' she says.
'The Drowned Watch ran it before there WAS money. You traded what
held you for what held them. Cleaner days.' `
  : ""}${s.inParty("vex")
  ? `Vex has gone quiet and bright-eyed, the professional posture of a
thief entering the cathedral of the trade. 'Rules,' they murmur,
mostly to themselves. 'No law, so it'll be RULES, and the rules
will be worse. Touch nothing that's tied down. ESPECIALLY touch
nothing that's tied down.' `
  : ""}

And then the stair turns out of the wind, the cave's mouth takes
you in, and the Drowned Market opens below like a geode:

A cathedral-vault of black rock, floored with wet sand and lit by
five hundred storm-lanterns, strung stall to stall on tarred lines.
Fish, rope, salvage; cord-script scribes at folding desks; a
knot-doctor splinting a child's frayed name-cord while the mother
watches like a hawk. Wreck-gold weighed on scales against salt. A
Corvid annex, black-painted, doing brisk and quiet trade at the
shadowed end.

# And in the deep end, past it all, where the lantern-lines run out
and the dark begins in earnest: a single high narrow stall of pale
wood, its strings of keys and teeth and rings turning in a wind
that isn't there.`,
      choices: [
        { text: "Into the market, toward the pale stall.",
          fx: { xp: 10 }, goto: "c2_drowned_market" },
      ],
    },
  };

  HC.registerScenes("ch2", SCENES);
})(globalThis.HC);
