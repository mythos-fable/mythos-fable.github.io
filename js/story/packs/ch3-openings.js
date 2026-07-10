/* Chapter 3 openings: nine roads down to the Grey Roads, one per Chapter 2
   ending. Each is a playable sequence that establishes the world your
   settlement made, then puts you on the Long Water — the tide beyond tides,
   the one all spent things ride OUT — where Cobb's ferry collects you and
   rows you down to the Roadstead. Each opening carries the pack entry
   markers (entry_from / ws / preset). */
(function (HC) {
  "use strict";

  const SCENES = {

    // ========================================== THE NEW TIDEMOTHER (tide_you)
    "c3_open_tide": {
      entry_from: "c2_end_tidemother",
      ws: "tide_you",
      preset: {
        karma: 40,
        flags: { c2_final_tidemother: true, c2_knows_tidemother: true,
                 c2_first_anchor: "tied", c2_saved_shallows: true },
      },
      text: (s) => `A year at the mooring. A year holding the Nine — witnessed, attended,
SUNG TO, the way you invented — and you have learned what the salt
mother could have told anyone who asked: holding is not heavy. It is
CONSTANT. The coast rides at you the way weight rides at a nail, all
day, all night, every luck and line and name of it, and the songs
they send down the pattern are the difference between a nail and a
hinge. You have been, on balance, happy. You checked. There was a
committee.

Tonight the ebb goes out, and does not come back.

Not the sea — the sea behaves. The OTHER tide. The one only you can
feel now, running under the bottom of the world, the out-going that
carries finished things away: spent lucks, worn-out names, holders
done holding. It has run under your pattern all year like a road
heard through a wall. And tonight, ${s.player.name}, it is standing
still. Backed up. JAMMED, the way a channel jams — against something
that will not let the finished pass.

And laid along that stalled water, still unfinished after a year,
you feel the one wake you have never stopped listening for.

# Hers. The salt mother went out on the tide of her own going, four
thousand years done, owed one rest by absolutely everything. The
wake has no end on it. She never arrived.`,
      choices: [
        { text: "Call the coast to the harbor. If the holder is leaving for a " +
                "season, the holder says so, out loud, to everyone.",
          fx: { xp: 15 }, goto: "c3_tide_signs" },
        { text: "Ask the bell first. The Drowned Watch rings the long water; " +
                "the Watch will know if the way down is fouled.",
          fx: { xp: 15, flags: { c3_asked_watch: true } },
          goto: "c3_tide_signs" },
      ],
    },

    "c3_tide_signs": {
      text: (s) => {
        const watch = s.flag("c3_asked_watch")
          ? `The Watch confirms it first, bell-talk down the reef in the old
dead code: LONG WATER FOULED. NOTHING ARRIVING. The post-captain
rows in at dawn to report in person, pipe unlit, which from him is
a state of alarm. 'Four hundred years we've rung the taken down the
long water,' he says. 'Every one of them ANSWERED FOR at the far
end, a name said slow and a place kept. A month now there's been no
answer. The far end has stopped taking deliveries.'

`
          : ``;
        return `${watch}You call the coast to the harbor terraces and tell them plainly:
the out-tide is jammed, the spent are not reaching their rest, and
the salt mother — who held all of you for four thousand years and
asked for nothing but the going-out at the end of it — is somewhere
down that stalled water, waiting still.

The coast takes this the way the coast takes everything: badly, then
practically. Dagny proposes a committee. Wide Marta proposes a
rescue. Oshka, who has sung the holding with you all year, proposes
the thing everyone is carefully not proposing:

'You'll have to go down and see. YOU. The pattern can spare you a
season — we'll sing it up between us; that was the whole point of
how you tied it, wasn't it? A holding that doesn't need its holder
standing on it every minute?' She grins, old and salt and sure.
'Consider it an audit, Tidemother. Of wherever tides go.'

# The coast votes. It is not close. The last hand up is yours.`;
      },
      choices: [
        { text: "Set the regency: the Watch keeps the hours, Marta keeps the " +
                "shore, Oshka leads the song. Then walk down the ebb road.",
          fx: { xp: 20, flags: { c3_regency_set: true } },
          goto: "c3_tide_down" },
      ],
    },

    "c3_tide_down": {
      text: `You walk out at the next low water, past the Ninth Anchor burning
steady gold under its living pattern — YOUR pattern — and on, out
past the lowest mark on any chart, to where the sand stops being
shore and starts being the top of something else.

The Long Water begins where the world's water gives up. It runs grey
and certain, one direction only, and riding it you can see the
jam-line of finished things backed up like weed against a grate:
worn lullabies, retired boundary stones, the small spent gods of
wells and fords and door-lintels, bobbing patiently in the queue
their whole afterward has become.

The holding tugs at you once, from behind — the whole coast, sung
up and carried by other hands for a season — and lets you go, the
way a good knot pays out line without letting go of the load.

# You are the first holder in the age of anyone to walk DOWN the
out-tide alive. Somebody has to. That's the entire liturgy.`,
      choices: [
        { text: "Follow the Long Water down.",
          fx: { xp: 20 }, goto: "c3_long_water" },
      ],
    },

    // ================================================== THE DEBT PAID (paid)
    "c3_open_paid": {
      entry_from: "c2_end_paid",
      ws: "paid",
      preset: {
        karma: 35,
        flags: { c2_final_paid: true, c2_marta_heard: true },
      },
      text: (s) => `A year since you paid the oldest bill in creation, and the coast has
spent it learning to live with a solvent neighbor the size of a
weather system.

It is going well, mostly. The tenth power is SHY. It mends weirs by
night and over-mends them — fishermen wake to find their nets not
only whole but improved, alarmingly, in ways that catch fish the
nets' owners have no names for. It returns borrowed things nobody
lent it. It leaves payment for the sound of the harbor bell, for
the smell of bread, for being waved at. Four thousand years of
owing, the Salt Reeve observes, does not wash out in a season:
the thing is FREE, and has not the first idea what free costs.

Tonight it is waiting for you on the tide-flat, politely, at the
distance it keeps so as not to bend the boats — a standing hill of
midnight water wearing the horizon like a coat. It has never once
asked for anything. It asks now.

'${s.player.name}.' The voice is the old voice, the deep one, but
steadier now, a paid man's voice. 'The one who held my note. My
surety. The kneeling one.' A pause, and the whole flat shivers.
'She never rested. I would know. A guarantee is a NERVE — mine is
discharged, but a nerve remembers its wire, and the wire still
reports. She went out on the long water and she is HELD somewhere
down it, and I am asking the only being I have ever met who settles
things:

# 'Go and see. Whatever she is owed, I am good for it now.'`,
      choices: [
        { text: "'You paid four thousand years for her holding. She gets her " +
                "rest if I have to argue the whole afterward.' Take the errand.",
          fx: { xp: 20, karma: 3 }, goto: "c3_paid_favor" },
        { text: "'The first favor you've ever asked, and it's for HER.' Note " +
                "that the neighbor is turning out well. Then take the errand.",
          fx: { xp: 20 }, goto: "c3_paid_favor" },
      ],
    },

    "c3_paid_favor": {
      text: `The Debtor shows you the way down the only road it knows: its own
old repayment channel, the groove worn under the bottom of the world
by four thousand years of payments crawling OUT — a channel that
runs, it turns out, straight into the Long Water, the way every
account on this coast runs eventually into every other.

The coast outfits you for the trip with the gravity of a state
funeral and the packing list of a fishing voyage. Marta puts up
food. Dagny lends oilskin and an opinion about your chances. The
Reeve issues you a letter of standing addressed TO WHOM IT MAY
CONCERN AT THE FAR END, which is, he admits, the office's first
attempt at diplomatic correspondence with an afterward.

The Debtor walks you out as far as it can go — to the lip of its
old cell, the stone-shaped hollow at the bottom of the amphitheater
where it waited out its debt — and stops there, vast and shy,
holding the dark open for you like a door.

'I would come,' it says. 'But a thing my size, arriving at a harbor
of the finished — they would file me. I am only a year old, this
way. I am not FINISHED with anything.'

# 'Neither,' it adds, with the first pride you have ever heard in
it, 'are you. Mind the current. It only runs one way.'`,
      choices: [
        { text: "Step past the old cell and down, into the channel where the " +
                "payments went.",
          fx: { xp: 15 }, goto: "c3_paid_down" },
      ],
    },

    "c3_paid_down": {
      text: `The channel is smooth as the inside of a shell — polished by an
eternity of worth flowing one direction — and it carries you down
in the dark with the gentleness of a thing that has never once been
allowed to keep what it touched.

Then the walls open out, and you are on the Long Water: grey, wide,
certain, running with finished things. Paid lucks. Kept promises,
complete. The small spent gods of fords and lintels, riding the
queue with their hands folded. And backed up — JAMMED — as far down
the water as you can see, because somewhere ahead of all of them,
something is not letting the finished through.

Far down the line, you feel more than see it: a wake with no end
on it. Hers.

# 'PAID IN FULL' settled the oldest account in creation. It did not,
you understand now, settle the oldest QUEUE.`,
      choices: [
        { text: "Follow the Long Water down.",
          fx: { xp: 20 }, goto: "c3_long_water" },
      ],
    },

    // ================================================== THE ROOK'S LIEN (lien)
    "c3_open_lien": {
      entry_from: "c2_end_rook",
      ws: "lien",
      preset: {
        karma: 0,
        gold: 100,
        inventory: ["c2_knot_knife", "c2_kelp_weave", "c2_knot_charm",
                    "c2_tally_coin", "poultice", "bread"],
        flags: { c2_final_rook: true, c2_rook_pact: true },
      },
      text: (s) => `The coast is solvent. You repeat it the way the coast repeats it,
which is the way a man taps a barometer: the coast is SOLVENT —
alive, fed, moored in black glaze and perfect records, every wrist
held by paper that never slips. Nobody sings. Nobody drowns, either.
You chose the outcome with the fewest funerals, and a year of
watching it work has taught you exactly what that sentence costs to
be true.

The summons finds you the way the office's mail always finds you:
your tally-coin goes warm in your pocket at breakfast, and by noon
a Corvid clerk is at your door with the Lady's compliments and a
folder.

Inside the folder is the only thing you have ever seen the office
fail at.

INSTRUMENT: DISCHARGE OF SURETY (FIRST DEBT). BENEFICIARY: THE
SURETY, CALLED TIDEMOTHER. STATUS: DELIVERY PENDING. PENDING. The
word is stamped, re-stamped, stamped again — four hundred and some
days of PENDING, in a filing system where pending is a mortal
insult. The salt mother's discharge — her rest, drawn up in the
office's own perfect hand on the night the note was novated — has
never reached her.

# The office does not lose instruments, ${s.player.name}. Somebody,
somewhere down the long water, is HOLDING the Lady's mail.`,
      choices: [
        { text: "Take the folder to the source. The Lady will want this run " +
                "by someone whose name is already in her book.",
          fx: { xp: 15 }, goto: "c3_lien_rook" },
      ],
    },

    "c3_lien_rook": {
      text: `Mother Rook receives you in the glazed quiet of the office of the
shore, four thousand winters of wool and patience behind a desk that
is, as ever, perfectly clear. She slides the folder back across it
with one finger, as if returning something distasteful found in the
accounts.

'I drafted her holding,' she says, without preamble. 'I drafted her
discharge. The first was honored for four thousand years. The second
has been DISHONORED for four hundred days, by an office at the far
end of the long water that styles itself the Moorage and answers my
correspondence with' — the pause of a woman selecting the worst word
she knows — 'FORM LETTERS.'

She rises. She goes to the window, where the moored coast glitters
black and orderly down to the tide-line.

'Understand me, auditor. I hold this shore because holding is what I
am FOR, and I execute it flawlessly, and I expect the same of every
office in existence. She knelt four thousand years on my paper. Her
rest is OWED, drawn, signed, and sealed, and some harbor-keeper of
spent things is sitting on it.' She turns. The old, dry, terrible
mildness. 'You will go down as the office's field auditor. You will
find out what the Moorage thinks it is doing. And you will see my
instrument DELIVERED.'

# 'The office endures, wanderer. It would prefer not to have to
endure INSOLENCE.'`,
      choices: [
        { text: "Take the writ, the folder, and the office launch. The Lady's " +
                "mail goes through.",
          fx: { xp: 20, flags: { c3_lien_writ: true } },
          goto: "c3_lien_down" },
        { text: "Take the job — but name your own reason on the way out: the " +
                "kneeling one is owed, and paper is just how this world says so.",
          fx: { xp: 20, karma: 3, flags: { c3_lien_writ: true } },
          goto: "c3_lien_down" },
      ],
    },

    "c3_lien_down": {
      text: `The office, of course, has a route. The office has ALWAYS had a
route: a black-lacquered launch in a covered slip below the
counting-rooms, crewed by nobody, oars that row themselves in a
rhythm you eventually recognize as double-entry. It has been making
the run to the far end since before the towns, carrying the office's
instruments down to wherever instruments conclude.

Lately, the boat-keeper admits, it has been coming back full. Every
delivery refused. RETURN TO SENDER, in a hand like tar.

The launch takes the Long Water at the lowest tide, and the grey
current opens ahead of it with the resignation of a queue admitting
an official vehicle. Finished things ride the water on every side —
spent lucks, retired names, the small done gods of doorsteps —
backed up, motionless, PENDING, as far down as the eye holds.

# The coast you left is the best-kept account in creation. The water
you are on, you begin to understand, is the account nobody kept.`,
      choices: [
        { text: "Follow the Long Water down.",
          fx: { xp: 20 }, goto: "c3_long_water" },
      ],
    },

    // ================================================ THE FIRST HEARING (commons)
    "c3_open_commons": {
      entry_from: "c2_end_hearing",
      ws: "commons",
      preset: {
        karma: 30,
        flags: { c2_final_hearing: true, c2_page_read: true,
                 c2_ninth_heard: true },
      },
      text: (s) => `Session forty-nine of the Commons of the Nine opens the way all of
them open: with the reading of the founding motion — 'the cost of
existing is nothing; the price of believing it is each other;
session open' — and then with arguing, which is the design, and
which the coast has taken to the way gulls take to a fish-cart.

You attend when you can, ${s.player.name}. Founder is not an office
— you saw to that — but it is a SEAT, and today the Session's clerk
of record interrupts the agenda to bring the seat something that
came up with the morning ebb, sealed in a stoneware jar, addressed
in cord-script to THE HEARING, IF IT IS REAL.

Inside is a letter. It is knotted, not written, and old rope at
that, and Tally-of-Welt reads it aloud with her fingertips, once,
and then sets it down and will not touch it again.

The whole of it, in the only translation the scribe will give:

WE ARE HELD. NOBODY ASKED.

# The Session, which argues everything, does not argue. The jar came
UP the long water — against the only current in existence that runs
one way. Somebody at the bottom of the afterward went to a great
deal of trouble to file a grievance.`,
      choices: [
        { text: "Move that the Commons hear it. The petition names no names; " +
                "someone must go down and take the deposition.",
          fx: { xp: 15 }, goto: "c3_commons_vote" },
      ],
    },

    "c3_commons_vote": {
      text: `The debate lasts one turning of the tide, which for the Session is
unseemly haste.

The Eel-Mother's delegate — a coil of green water in the visitors'
pool — testifies that her sister-holders, the little sureties
subsumed before the towns, went out on the long water when their
holdings failed, and that no song has ever come back up. The Drowned
Watch testifies that the bell's deliveries have stopped being
answered. The Pale Merchant, clerking as ever, produces from under
the exhibits table a form letter on grey paper — 'the far end's
entire correspondence, for those curious' — which reads, in full:
THE MOORAGE THANKS YOU. ALL BERTHS ARE KEPT.

'The Hearing exists,' Wide Marta says at last, standing, 'because
somebody walked down to the bottom of OUR water and asked the held
what they wanted. There's a bottom below that one, turns out, and
it's sent us a knot.' She holds up the letter. 'I know this hitch.
It's the one you tie one-handed. When the other hand's HELD.'

The vote is the second unanimous vote in the Commons' history.

# The motion, as entered: THE SESSION EXTENDS. Send the founder.`,
      choices: [
        { text: "Take the letter, the Session's writ, and the ebb road down. " +
                "The deposition of the moored will be heard.",
          fx: { xp: 20, flags: { c3_commons_writ: true } },
          goto: "c3_commons_down" },
      ],
    },

    "c3_commons_down": {
      text: `The Commons rows you out in the Session barge as far as living water
goes, the whole assembly singing the holding open ahead of you —
and then the Long Water takes the keel, and the singing fades behind,
and you are on the grey one-way tide with the finished things.

They notice the writ. That is the uncanny part. Spent lucks and
retired names drift aside to let you pass, and the small done gods
of wells and fords watch you go by with their hands folded, and one
of them — a hearth-holder, by the soot still on her — calls across
the current, matter-of-fact:

'Going DOWN, are you? Alive, with paper?' She looks you over the way
grandmothers look over weather. 'Tell them at the bottom: we never
minded the waiting so much. It's that nobody ever ASKED us how long
we'd wait. You tell them that.'

# You have a deposition before you even arrive. The queue has been
composing its testimony for ten thousand years.`,
      choices: [
        { text: "Follow the Long Water down.",
          fx: { xp: 20 }, goto: "c3_long_water" },
      ],
    },

    // ================================================ THE UNMOORED SHORE (adrift)
    "c3_open_adrift": {
      entry_from: "c2_end_adrift",
      ws: "adrift",
      preset: {
        karma: 20,
        inventory: ["c2_boat_hook", "c2_kelp_weave", "c2_knot_charm",
                    "c2_brine_tonic", "poultice", "bread"],
        flags: { c2_final_adrift: true },
      },
      text: (s) => `A year under way. A year of the Mourncoast as a country under sail —
Saltmere for a flagship, the marshes trailing to leeward, the
bell-reef ringing the watches, nine gold anchors streaming behind
like riding-lights — and the coast has settled into voyaging the way
it settles into everything: loudly, with committees.

There are no charts for where you are, because where you are is OFF
every chart, which was the point. There is also, the lookouts have
begun to report, TRAFFIC.

Wakes. Grey ones, dozens a day now, all running the same direction
across your course like carts converging on a market town — and none
of them coming BACK. The coast, which knows one-way water when it
sees it, comes about for a look, and finds itself sailing the
margin of a current wide as a country: the Long Water, the out-tide
of everything, jammed solid with finished things queuing patiently
toward a smudge of riding lights hull-down on the horizon.

Marta reads the water a long time from the Saltmere rail.

# 'That,' she says finally, 'is a HARBOR. And everything that ever
finished is anchored off it, waiting for a berth that never comes
free. Somebody down there is the worst harbormaster in creation,
${s.player.name}, or the best jailer.'`,
      choices: [
        { text: "Close with the harbor and take a look. The coast that kept " +
                "itself can spare its keeper for a fortnight.",
          fx: { xp: 15 }, goto: "c3_adrift_papers" },
      ],
    },

    "c3_adrift_papers": {
      text: `The cutter meets you a league off the roadstead: grey oilcloth, soft
oars, a crew of wardens with the gentle unhurried manner of people
who have never once been disobeyed successfully. Their officer comes
up the Saltmere side with a satchel and the early confidence of a
process-server.

The document he presents to the assembled coast is a marvel of its
kind. The coast passes it hand to hand down the rail, reading aloud,
with rising joy:

'INSTRUMENT OF IMPOUND. Whereas the estate styled THE MOURNCOAST,
being finished with the world' — here the whole rail says OHO —
'has failed to make port at the Roads; and whereas all finished
things are due a berth and OWED A KEEPING; the said estate is
directed to proceed to the Moorage forthwith, there to be moored,
kept, and LOST NO FURTHER.' Signature: a hitch of tarred cord,
tied one-handed.

Wide Marta laughs so hard she has to sit on a bollard. Then she
stops laughing, all at once, the way weather changes.

'Finished,' she says. 'They think — because we cut loose, because we
sailed OUT — that we're DONE. That out is the same as over.' She
looks at the grey cutter, and the queue beyond it, ten thousand
years deep. 'And every poor spent soul in that water believed it
too, didn't they. Nobody told them different at the door.'

# The coast declines the invoice. The coast, further, resolves to
send a delegation ashore to explain — in the person of the one who
cut the Nine.`,
      choices: [
        { text: "Go down to the Roads under the coast's own colors. Anchors " +
                "UP, and make sure they see it.",
          fx: { xp: 20, flags: { c3_adrift_colors: true } },
          goto: "c3_adrift_down" },
        { text: "Go down quiet, alone, in a work-boat. Jurisdiction is an " +
                "argument you'd rather have AFTER looking around.",
          fx: { xp: 20 }, goto: "c3_adrift_down" },
      ],
    },

    "c3_adrift_down": {
      text: `The coast stands off the Roads at the edge of the grey current,
nine gold anchors catted and visible, riding NOTHING — the only
thing on the whole horizon holding its place by choice alone. It is
the loudest statement anyone has ever made in this water, and the
queue of the finished stares at it the whole time you are rowing
away from it, like a congregation watching a window open in a wall
they'd been told was the edge of the room.

The Long Water takes your boat at the margin. One-way, grey,
certain. Finished things close in around you: spent lucks, worn
names, small done gods riding with folded hands, and every one of
them asks you some version of the same question as you pass.

'Is it true? The loose country. Did it really not COME IN?'

'It really didn't,' you say, and the word travels down the queue
behind you faster than the current, in every direction, like heat.

# You came to argue one impound. You appear to be towing a
PRECEDENT.`,
      choices: [
        { text: "Follow the Long Water down.",
          fx: { xp: 20 }, goto: "c3_long_water" },
      ],
    },

    // ================================================ THE BRINE-CROWNED (corded)
    "c3_open_corded": {
      entry_from: "c2_end_oshka",
      ws: "corded",
      preset: {
        karma: 30,
        flags: { c2_final_oshka: true, crowned_oshka: true },
      },
      text: (s) => `A year of the corded coast, and the tellings are already going
inland: the shore where the tide keeps time, where the harbor-knots
hum in thirds, where the singer is not gone — everywhere the song
is, is her. You have learned to live inside a friend the way other
people live inside weather. It is better than the tellings say.
You would not trade it for any of the other worlds you almost chose.

Which is how you know, before anyone, when the song loses a verse.

Not one of the nine — the nine holdings ring on, gold and steady.
The TENTH. The going-out verse, the one the Psalter kept for the
ends of things: it was never sung AT the coast, you understand now;
it was sung as a call, and something down past the lowest water
always, always answered — a far low note under the world, the rest
at the end of the song, confirming it was there. The coast never
noticed. The coast had a singer to do its noticing.

Tonight, at the turning of the ebb, every knot on every doorpost of
Saltmere hums the call. You stand on the quay among fishermen who
hear nothing wrong and wait with her for the answer.

# Nothing. For the first time in the memory of the song, the far
end of the Tenth does not answer. The rest at the end of the music
has gone silent, ${s.player.name} — or been STOPPED UP.`,
      choices: [
        { text: "Go to the knotworks, where her boat-hook hangs on two pegs, " +
                "and ask her straight.",
          fx: { xp: 15 }, goto: "c3_corded_ask" },
      ],
    },

    "c3_corded_ask": {
      text: `In the knotworks, under the boat-hook on its two pegs, the
harbor-knots gather her voice the way a shell gathers the sea —
nearby, unhurried, amused at your formality, the same Oshka who
sang footing out from under wreckers.

'You heard it too. Good. I'd hate to be the only one losing sleep
I don't technically have.' The knots hum, thinking. 'The Tenth's
the going-out song. Mother taught it me at the oar-bench: you sing
the nine to HOLD, and the tenth so the held know there's a rest at
the end of the holding. And the rest answers. Always has. It's the
answering that makes it true, love — a promise nobody confirms is
just a NICE NOISE.'

The boat-hook turns on its pegs, gently, pointing the way the ebb
runs.

'Down the long water there's supposed to be a going-OUT. Every
spent thing this coast ever sang over the side rode that tide, and
the song promised every one of them the rest at the end. If the far
end's gone quiet — either the rest is gone, or something's between
it and the ones it was promised to. I can't go look. I'm the
holding now; I don't get to leave the room.' A pause, and the whole
knotworks softens. 'But you do. And you know the way I know the
song's still good, somewhere past the stop?'

# 'Because I wrote a new last line the night I tied in, and the
water TOOK it. SING LOUD. SHE'S A VERSE BEHIND YOU THE WHOLE WAY.
That wasn't for the coast, love. That was for whoever walked down
next.'`,
      choices: [
        { text: "'Then sing me down.' Take the ebb road out past the Ninth, " +
                "with the song at your back.",
          fx: { xp: 20, approval: { oshka: 5 } }, goto: "c3_corded_down" },
      ],
    },

    "c3_corded_down": {
      text: `You walk out at low water, and the coast sings you down.

It starts at the knotworks and spreads — doorpost to doorpost, boat
to boat, the bell-reef taking the bass — the Tenth Song, entire,
sung not as a call this time but as an ESCORT, and you walk down
the naked ebb inside it like a lantern carried down a stair.

Where the world's water gives up and the Long Water begins, the
song thins to one voice. Hers. It does not stop at the boundary the
way the loom stopped, the way the Crown's light stopped. It leans
on the boundary, and holds — one verse, repeating, pitched to carry.

The grey current takes you. Finished things ride it on every side,
patient, backed up toward a smudge of riding lights far down. And
the small spent gods lift their heads as you pass, every one,
because they can hear it too:

a verse behind you. The whole way.

# Somewhere at the bottom of this water, something stopped the rest
at the end of the song. It has not yet met the song's OWNER.`,
      choices: [
        { text: "Follow the Long Water down.",
          fx: { xp: 20 }, goto: "c3_long_water" },
      ],
    },

    // ============================================== THE FORGIVEN LEDGER (forgiven)
    "c3_open_forgiven": {
      entry_from: "c2_end_vex",
      ws: "forgiven",
      preset: {
        karma: 30,
        flags: { c2_final_vex: true, c2_vex_freed: true },
      },
      text: (s) => `The Forgiven Ledger is a year old, and by every actuarial standard
it should be six months dead. Instead: the office that forgives —
publicly, strategically, ruinously — holds, because the freed pay
forward what the held could only pay down, and the coast has begun,
cautiously, to believe the arithmetic.

Vex runs it from Mother Rook's old desk with the black book, an
abacus nobody has seen used, and a standing rule that the office
regrets EVERYTHING, out loud, on the record. Once a season, the
office holds a Day of Discharges: names returned, brands voided,
lines forgiven, each one read to the room.

Today the office attempted its masterpiece — the oldest small line
in the book. LOCAL SURETY, SUBSUMED: one of the little holders the
Nine swallowed before the towns, a marsh-light god that stood
security for one drowned hamlet and went out on the long water when
its holding failed, ten thousand years ago. Forgiven in full. The
discharge drawn in Vex's own hand, entrusted to the office launch,
sent down the ebb with ceremony.

It came back at the evening tide. Unopened. Stamped, in tar, in a
hand like a hitch tied one-handed:

REFUSED. HOLDER RETAINS.

# Vex reads the stamp for a long, professional moment, and then says
the worst thing you have ever heard the coast's chief clerk say
about anyone: 'They're not even CHARGING for it.'`,
      choices: [
        { text: "Ask the obvious: retained by WHOM? The far end of the long " +
                "water is supposed to be a rest, not a counterparty.",
          fx: { xp: 15 }, goto: "c3_forgiven_vex" },
      ],
    },

    "c3_forgiven_vex": {
      text: `Vex spreads the returned discharges across the desk — there are, it
turns out, DOZENS, going back months: every forgiveness the office
ever aimed at a spent holder, every voided line whose beneficiary
had already gone out, all of it refused at the far end by an office
styling itself THE MOORAGE.

'Here's what eleven years as collateral teaches you that no
clerkship does,' Vex says, glove off, scarred wrist bare on the
black book, 'you can tell what's holding someone by what it does
with their MAIL. A rest doesn't refuse a discharge — a rest doesn't
answer at all; it's a REST. An office refuses. An office with a
policy. Someone down there is holding every spent soul that ever
went out this coast's water, holding them CAREFULLY, holding them
in such good order that they can return-to-sender ten thousand
years of freedom without one envelope going astray.'

The crooked grin, for the first time all day — the old one, the
dangerous one.

'I know that kind of holding, wanderer. I LIVED in it. It calls
itself keeping, and it keeps, and keeps, and keeps.' The satchel
lands on the desk, packed: every refused discharge, re-sealed, plus
one fresh instrument on top. 'Forgiveness that can't be delivered
is just FILING. So we deliver by hand. Or rather — the office's
oldest field agent does.'

# The fresh instrument on top of the stack has no beneficiary line
filled in. 'Blank discharge,' says Vex. 'Office policy: never go
down a debtor's hole without one. You'll know who it's for when you
meet them.'`,
      choices: [
        { text: "Take the satchel. Every freed name gets its paper, if you " +
                "have to put each one in each hand yourself.",
          fx: { xp: 20, karma: 3, flags: { c3_discharge_satchel: true } },
          goto: "c3_forgiven_down" },
      ],
    },

    "c3_forgiven_down": {
      text: `The office launch takes you down the ebb at slack, past the lowest
mark, to where the Long Water takes the keel like a hand taking a
ledger.

The grey current is a queue ten thousand years deep. Finished
things ride it patiently — spent lucks, worn names, the small done
gods of wells and fords and door-lintels — and when word moves down
the water of what you are carrying, the queue does something the
Long Water has plainly never seen.

It ORGANIZES. Hands — those that have them — fold and unfold. The
little gods confer. Somewhere a spent festival-luck starts a rumor,
and the rumor comes back up the line as a question, asked of you a
hundred ways in a hundred worn-out voices:

'Is one of those MINE?'

You stop answering after the tenth time, because the truth — that
you carry a few dozen papers into a harbor holding everything that
ever finished — is not a thing to say into ten thousand years of
queue.

# But the blank one rides at the top of the satchel, and you begin
to understand Vex's policy. Somewhere down there is the holder
doing all this keeping. Even jailers, the office regrets, out loud,
on the record, are usually somebody's held.`,
      choices: [
        { text: "Follow the Long Water down.",
          fx: { xp: 20 }, goto: "c3_long_water" },
      ],
    },

    // ================================================== THE WOVEN SHORE (woven)
    "c3_open_woven": {
      entry_from: "c2_end_woven",
      ws: "woven",
      preset: {
        karma: 30,
        flags: { c2_final_woven: true, final_reforged: true },
      },
      text: (s) => `A year since the seam opened from inside, and the weave has kept
every promise the opening made. The coast's knots ride in the
world's fabric, pattern preserved; the chapels inland sing their
first verse in cord-script; the Nine are retired with honors; and
the tellings have already smoothed the whole terrifying night into
a hymn. WE WERE HELD ALL ALONG. WE JUST WANTED TO BE ASKED.

You live at the hem of it, ${s.player.name} — the one soul the
whole arrangement ran through — and so it is you the god comes to,
on an evening of the world, in whatever way the god comes: a leaning
of lamps, a margin note, a quiet at the door. The message, under
all its courtesy, is one sentence.

THERE IS A THREAD I CANNOT TAKE UP.

At the selvage of everything, where the weave binds off, one thread
runs OUT of the fabric entire: pale, salt-stiff, four thousand years
long. A wake. HER wake — the Tidemother's going-out, the tide of her
own departure, never taken up, never finished, trailing off the edge
of the world into water no loom has ever been allowed to touch.

# The weave assumed her whole coast, every knot and note of it. It
cannot assume HER. She went out before the seam opened — out past
everything — and her wake just ends, mid-water, the way a sentence
ends when the writer is interrupted.`,
      choices: [
        { text: "Go to the selvage and see the thread yourself.",
          fx: { xp: 15 }, goto: "c3_woven_selvage" },
      ],
    },

    "c3_woven_selvage": {
      text: (s) => {
        const god =
          s.flag("crowned_serra") ? `Serra — the unfinished sun herself, armored in morning`
          : s.flag("crowned_maeve") ? `Maeve — the Library walking, lamps lit along her sleeves`
          : s.flag("crowned_hollow") ? `Hollow — the quiet hand, present the way floors are present`
          : s.flag("final_claimed") ? `the watch you set aside, wearing the witnesses like weather`
          : `the Shepherd, the mended loom entire, leaning close`;
        return `The selvage of the world is a place very few woven things can stand:
the last row of everything, where the pattern binds off and the
threads turn back into the fabric — all but one.

It runs out over the edge like a jib-sheet somebody dropped: pale,
salted, humming faintly with the memory of holding. Beyond it, past
the bind-off, there is water. Grey water, running one way, far
below and far out, streaked with finished things.

And beside you at the selvage stands ${god} — as much of the god as
can bear to come this close to its own edge — and the whole
enormous presence is bent toward that one loose thread with an
attention you recognize. It is the way you look at a debt you
cannot pay.

'She tied the seam that kept us out,' the presence says, in the way
it says things. 'To keep the weave from swallowing what was never
its to hold. Then she held her coast four thousand years, and when
it was settled she went OUT — past our reach, past the pattern,
trusting there was a rest out there. The coast came in. Her wake
never ended. Nothing that goes out that water comes back, and no
thread of mine can follow.'

A pause, and every loom in creation seems to lean.

# 'You have crossed a hem before, when I could not. I am asking
again. Find where the tides go, and why hers never arrived — and if
the rest she trusted is not there, ${s.player.name}, then somebody
built a wall where a door was promised, and I want to KNOW.'`;
      },
      choices: [
        { text: "Take hold of the wake-thread and go down it, hand over hand, " +
                "off the edge of the woven world.",
          fx: { xp: 20 }, goto: "c3_woven_down" },
      ],
    },

    "c3_woven_down": {
      text: `Climbing down a wake is like climbing down a memory of rope: it
holds because it once held, and it hums where her hands wore it.

The weave's light thins above you — the last row of the world
becoming a ceiling, then a sky, then a rumor — and the grey water
rises to meet your boots, and takes you, one-way, certain, the way
it takes everything finished.

You are not finished. The water can tell. It carries you anyway,
with a kind of professional reservation, the way a ferryman carries
a passenger he suspects of planning to swim back.

Finished things ride the current on every side: spent lucks, worn
names, small done gods with folded hands — and, backed up down the
water as far as sight goes, a QUEUE, jammed against a smudge of
riding lights on the horizon. Her wake runs past all of it, dead
straight, toward the lights.

# The weave holds everything now, all the way to the world's last
row. It is a strange comfort, out here past the bind-off, to learn
that even everything has an OUT — and a strange dread to see the
out has a gate across it.`,
      choices: [
        { text: "Follow the Long Water down.",
          fx: { xp: 20 }, goto: "c3_long_water" },
      ],
    },

    // ================================================= THE LAST HARBOR (harbor)
    "c3_open_harbor": {
      entry_from: "c2_end_last_harbor",
      ws: "harbor",
      preset: {
        karma: 35,
        gold: 90,
        flags: { c2_final_last_harbor: true, met_merchant: true,
                 final_witness: true },
      },
      text: (s) => `VOLUME TWO is a year old, and the Last Harbor has begun to be a
world the way a keel begins to be a ship.

There are two more islands than there were. There is weather with
opinions, still deciding what seasons are. There are children — the
first children — who will never believe the world was ever only one
harbor wide, and there is you, ${s.player.name}, FIRST WITNESS,
walking the new coast with the catalogue habit you never lost,
filing sunrises. The Debtor's roots hold it all: borrowed being,
compounding honestly at last.

And this month, the new world's first true ebb went out.

It was expected — a world must exhale; the Merchant has a whole
page on it — but what was not expected is that the ebb has not come
BACK. The new sea is shoaling. And the first spent things of the
young creation — a worn-out first lullaby, the luck of a boat that
sank, one small drowned name — went out on that ebb, trusting it
the way everything trusts its first tide, and have not arrived
anywhere. The water of the new world, the divers report, runs
downhill somewhere old.

# 'Of course it does,' says the Pale Merchant, when you bring him
the soundings. He does not look up from VOLUME TWO. 'All water
drains to the Roads eventually, wanderer. Ours has simply found
the pipe. The concerning part is that the Roads appear to be FULL.'`,
      choices: [
        { text: "'You know the place, then.' Get the whole story out of him " +
                "for once.",
          fx: { xp: 15 }, goto: "c3_harbor_merchant" },
      ],
    },

    "c3_harbor_merchant": {
      text: `He closes VOLUME TWO on a ribbon, which from him is the raising of
a curtain.

'The Roads,' he says, 'are where finished things ride at mooring:
the harbor at the far end of every world's long water. Spent lucks.
Paid sureties. Retired keepers of retired creations. I have a stall
there — naturally; it is the best address in existence for a dealer
in concluded business — and I can report that in all my visits,
across the tenure of several worlds, I have never once seen a ship
SAIL. Arrivals only. The Moorage keeps them. The Moorage has always
kept them. It is the going concern of an office with one clause
missing, and I have watched it fill, tide by tide, the way one
watches a ledger that never posts a credit.'

He begins, with ceremony, to pack the stall.

'It was a curiosity, while it was somebody else's afterward. It is
now OUR drainage problem. A world without a working out-tide,
colleague, is a shop without a back room: everything piles up on
the counter, and presently you cannot see the customers.' The
early smile, exactly on time. 'And besides. Your account and mine
both route through that harbor eventually. I prefer my
counterparties SOLVENT and my afterwards functional.'

# 'Come. First expedition of Volume Two: we are going to see a
woman about a harbor.'`,
      choices: [
        { text: "Sail with the Merchant down the young world's ebb, out of " +
                "the new water and into the oldest.",
          fx: { xp: 20, flags: { c3_merchant_passage: true } },
          goto: "c3_harbor_down" },
      ],
    },

    "c3_harbor_down": {
      text: `You go out on the young ebb in a hired boat with a folded stall for
cargo and the owner of the only ledger that spans two creations for
crew. The Merchant rows. This is so wrong that you offer twice to
take the oars, and are twice declined: 'The fare,' he says, 'is the
fare.'

Where the new world's water gives up, the Long Water begins — old,
grey, one-way, wide as a country — and the young ebb pours into it
like a stream finding a river that was always there.

Finished things ride the current: the old creation's backlog, ten
thousand years of spent lucks and worn names and small done gods,
queued patient and motionless toward the riding lights hull-down
ahead. And bobbing among the ancient traffic, heartbreakingly new:
one worn-out lullaby, the luck of one sunk boat, one small drowned
name — the young world's first finished things, holding each other,
very far from home in the oldest water there is.

You take them aboard. Nobody stops you. The Merchant enters them in
VOLUME TWO under CARGO, MINDED, NO CHARGE, which you pretend not to
see him do.

# 'Every world sends its finished things here,' he says, rowing.
'Ours sent US. Do note the distinction on the manifest.'`,
      choices: [
        { text: "Follow the Long Water down.",
          fx: { xp: 20 }, goto: "c3_long_water" },
      ],
    },

    // ======================================================== CONVERGENCE
    "c3_long_water": {
      text: (s) => {
        const tails = {
          tide_you: `

The ferryman studies you a long moment, and his oar goes still.
'You're a HOLDER,' he says. 'A working one. Down here alive.' He
resumes rowing, visibly filing it. 'Four hundred years on this run.
First time the far end of a holding ever came down to check on the
OUT.'`,
          paid: `

'You're off the coast that paid the First,' the ferryman says. It
is not a question. 'Word came down the water. The queue talked of
nothing else for a month — a debt that ENDED.' He rows. 'Folk here
found the idea unsettling. Endings arriving; nothing going out. Do
the sums yourself.'`,
          lien: `

He clocks the office launch trailing your wake, and the writ, and
the folder. 'The Lady's paper.' He rows a while. 'She sends
instruments down every season. The Moorage refuses the lot. I carry
the returns back up myself — full boat every time, and I'll say
this for the Lady: she pays return postage. Nobody else bothers.'`,
          commons: `

'You'd be the Hearing's people,' the ferryman says, eyeing the
Session's writ. 'The jar made it up, then. Good. That cost the
moored a year of favors and the last of somebody's luck.' He leans
into the stroke. 'Tell your Session the sender's at the Wrack
Market rafts. They'll want to know their letter LANDED.'`,
          adrift: `

'You're off the loose country.' The ferryman's oar stops entirely.
'The one riding yonder with its anchors UP.' He looks at you the
way men look at weather that shouldn't be possible. 'Every fare
I've rowed in four hundred years believed the water only ran one
way. You lot are hard on a ferryman's conversation.'`,
          corded: `

The ferryman cocks his head, listening to something under the
current. 'There's a verse following you,' he says. 'Half a length
back, matching our speed.' He rows on, and after a while: 'Water
down here hasn't been SUNG TO in ten thousand years. Look at it
carrying on. Disgraceful.' The grey water, unmistakably, glitters.`,
          forgiven: `

'Mind that satchel,' the ferryman says, nodding at the discharges.
'Half this queue can smell what's in it. Paper that OPENS.' He
rows. 'The Moorage will refuse the lot, mind. Refused mine.' You
ask what he sent for. 'Didn't send. Carried. Four hundred years —
you get curious whether anyone's allowed to sign for anything.'`,
          woven: `

'You came down the WAKE,' the ferryman says, and for the first
time the oar misses a beat. 'Hand over hand, off the world's edge.
Hers.' He recovers the stroke. 'I rowed her in myself, you know.
The kneeling one. Biggest fare of my tenure and the politest.
Thanked me. TIPPED me.' A long silence. 'She's still at her berth.'`,
          harbor: `

The ferryman and the Merchant exchange the nod of two professionals
who have shared a waterfront for several worlds. 'Volume Two
already,' the ferryman says. 'And a new world's water finding the
Roads within its first year.' He rows. 'The harbor's FULL,
merchant. You know it and I know it. High time somebody arrived
who doesn't fit the filing.'`,
        };
        return `The Long Water narrows toward its end the way a working day narrows:
imperceptibly, and then all at once. The queue thickens. The grey
light settles. And out of the drift of finished things comes a flat
skiff, poled with enormous economy by a figure in Drowned Watch
oilskin — a broad, weathered man with barnacle-grey eyes and the
unhurried air of someone four centuries past his last emergency.

'Evening,' he says, shipping alongside. 'Or it's always evening
here; you'll adjust. Cobb. Watch oarsman, seconded to the long-water
run, four hundred years this Michaelmas if anyone still kept
Michaelmas.' He steadies the skiff for you to board. Stenciled on
her transom, in Watch paint, is her name: the EVENTUALLY.

'Rules of the boat. One: sit low. Two: if you're holding anything,
hold it plainly — the water dislikes ambivalence. Three: the fare's
a word. Whatever word you'd want said over you, if it came to that.
I keep them. Somebody has to.'

He takes your word, whatever it is, and stows it somewhere behind
his eyes with the others, and poles out into the main channel where
the riding lights of the Roads glow hull-down ahead.${tails[s.flag("ws")] || ""}`;
      },
      on_enter: { meet: "cobb", flags: { c3_met_cobb: true } },
      choices: [
        { text: "Ride the Eventually down to the riding lights.",
          fx: { xp: 15 }, goto: "c3_roads_gate" },
      ],
    },

    "c3_roads_gate": {
      text: (s) => {
        const base = `The Grey Roads open below the last bend of the Long Water like a
city built of patience.

Ships, first — ships beyond counting, riding at mooring in ranks
that recede past sight: hulks and coracles, barges and arks, one
vessel like a folded swan the size of a town, every one of them
carrying a riding light, every light burning the same steady grey-
gold, ten thousand years of arrivals and not one empty berth. This
is where the finished ride. Spent lucks rafted like logbooms. Worn
names in bottle-fleets. The retired keepers of retired things,
each at a numbered mooring, each waiting with the terrible
politeness of those who were promised the wait was temporary.

Beyond the fleet runs the Breakwater: one grey arm of stone,
enclosing everything, and past its single gap you can see it —

the OPEN. The last water. A horizon with no wakes on it at all,
lit like the hour before a lamp is needed. Nothing has ever sailed
out onto it. You can tell. Water remembers keels, and that water
has never once been asked to.

At the quay, a warden in oilcloth takes your name — does not ASK
it; takes it, off you, gently, like lifting a hat — and hands you
a tarred wooden tag. Your name on one side. A berth number on the
other.

'Welcome to the Roads,' she says, warm as tea. 'You're expected.
Everyone is, eventually. The Moorage thanks you. All berths are
kept.'`;
        const tails = {
          tide_you: `

Under your boot-soles, through stone ten thousand years patient,
you feel it the way only a holder can: every mooring in this
harbor is a HOLDING — live, tended, perfect. And not one of them
was ever, not once, asked to be.

# You hold a coast the new way: witnessed, sung to. This place is
the old way, scaled to an afterward. It is like visiting the
house your house was copied from, and finding all the doors lock
from outside.`,
          paid: `

Somewhere in this fleet is the surety whose debt you paid out of
what you are. The token in your hand has a berth number on it,
and you understand, with a chill, that so does she — that the
kneeling one traded four thousand years of holding for a NUMBERED
SLIP in a harbor that never opens.

# The Debtor's nerve reported true. Paid, discharged, and KEPT.
On this water, those are apparently three different words too.`,
          lien: `

Your auditor's eye does what it was sent to do: the quay is
flawless, the moorings are flawless, the ledger visible through
the Moorage window is flawless — and the whole establishment
fails the first test the Lady ever taught you to run.

# Look for the exit. Every honest instrument has a termination
clause. Every honest building has a door that opens OUTWARD.
Count the ones here. Take your time. You'll get to zero.`,
          commons: `

WE ARE HELD. NOBODY ASKED. The knot-letter rode a year against
this water to say it, and standing on the quay you could draft
the deposition yourself in ten minutes: berths beyond counting,
keeping without end, and nowhere — you look, the way the Session
taught everyone to look — nowhere at all, a place where the held
may read the terms of their holding, and object.

# The Commons extends. Session, you think, is going to be LONG.`,
          adrift: `

The warden's eyes keep drifting past you, out beyond the
Breakwater's gap, to where the coast — your coast — rides visible
and impossible at the margin of the current, anchors catted,
holding station by pure bloody-minded seamanship.

'It has to come in,' she says softly, almost to herself, like a
woman reciting a catechism at a thing that is disproving it.
'Everything finished comes in.'

# 'It isn't finished,' you say, and take your token, and her face
does something the Roads have no form for.`,
          corded: `

The verse arrives half a length behind you, as promised, and the
whole quay HEARS it. Wardens stop mid-stride. Riding lights sway
on ten thousand moored ships like heads turning. Somewhere deep
in the fleet, something that has not made a sound in an age hums
one answering note, off-true, like a bell remembering its shape.

# The warden's hand shakes, very slightly, as she gives you your
token. 'We don't have a form for singing,' she says. 'The Moorage
thanks you. Please don't do it again.'`,
          forgiven: `

The warden's gaze finds the satchel of discharges and slides off
it, trained and smooth. 'Deliveries route through the Moorage
office,' she recites. 'The Moorage thanks you.'

You look down the ranked moorings — ten thousand years of the
kept, any number of them names your office already freed on paper
— and you feel the satchel pull like a compass needle.

# The office regrets everything, out loud, on the record. You
begin, standing on this immaculate quay, to compose the longest
regret in its history.`,
          woven: `

Her wake runs past the quay, past the fleet, straight as a ruled
line through all that patient grey — and ends at a berth. You can
see it from the gate: far down the ranks, a white ship, riding
light burning like the others.

The weave holds everything, to the world's last row. But its whole
everything, you understand now, drains HERE — to a harbor with one
gap in one wall, and nothing beyond the gap but an untouched
horizon.

# Somebody built a wall where a door was promised. Now you know.
The knowing was the easy errand. The god is going to want the REST.`,
          harbor: `

The Merchant steps ashore behind you, unfolds his stall on the
quay with four practiced motions, and is at once, seamlessly, a
fixture — as if the Roads had grown around him, which, you
reflect, across the tenure of several worlds, they more or less
have.

'Mind the token,' he murmurs, arranging his wares. 'They will have
opened YOUR berth the moment your world's water touched the Long.
Standing policy. Nothing personal. Everything here is nothing
personal, colleague — that is the entire difficulty.'

# On his counter, first item out, face-up where the whole quay can
read it: the old sign. ALL DEBTS HONORED. On this quay it does not
look like a promise. It looks like a CHALLENGE.`,
        };
        return base + (tails[s.flag("ws")] || "");
      },
      on_enter: { flags: { c3_arrived: true }, "items+": ["c3_berth_token"] },
      choices: [
        { text: "Onto the quay of the Grey Roads.",
          fx: { xp: 10 }, goto: "c3_quay" },
      ],
    },
  };

  HC.registerScenes("ch3", SCENES);
})(globalThis.HC);
