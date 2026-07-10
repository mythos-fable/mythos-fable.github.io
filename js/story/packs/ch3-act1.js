/* Chapter 3, Act 1: the Quay of the Grey Roads.
   The nine openings converge at the arrivals quay. Act 1 introduces the
   Moorage and its Moorwife, finds the Tidemother's white ship at mooring,
   recruits Nan Weir, brings the office's paper back due at the Corvid desk,
   and ends with the rafts' breakout attempt being gently, terribly towed
   home — after which Cobb ships his oar and joins the cause. */
(function (HC) {
  "use strict";

  const SCENES = {

    // ---------------------------------------------------------------- hub
    "c3_quay": {
      text: [
        { if: { has: "c3_breakout_done" },
          text: `The quay after the towing-back is a subdued place. Blankets are
being folded with terrible neatness. Tea is being drunk because
refusing it seems rude and rudeness is all anyone has left. The
riding lights burn on, rank after rank, and the Open beyond the
Breakwater's gap sits untouched as ever, lit like the hour before
a lamp is needed.

Whatever happens next for the Grey Roads, it will not happen on
this quay. It will happen deeper in — down among the rafts and
the old berths, where the Wrack Market keeps the only commerce
an afterward has.` },
        { text: `The quay of the Grey Roads runs further than a quay has any right
to: grey stone, iron bollards worn silk-smooth, and moorings —
moorings past counting, each with its riding light, each with its
tarred line spliced and re-spliced by ten thousand years of
maintenance that nobody ever asked for and nothing ever escapes.

The Moorage office stands at the quay's head under a sign of a
coiled line: lamplit, orderly, always open. Down the quay a black
desk does business under a single feather — the office of the
shore keeps a branch even here, which should not surprise you and
somehow still does. Further along, someone small and furious is
attacking the quaystone itself with a chisel, to the patient
disapproval of two wardens. And out along the deep berths, far
down the ranks, rides a ship that is white the way the salt
mother was white.

The Eventually rocks gently at the steps behind you. 'I'll bide,'
Cobb says, filling a pipe he has no need of. 'Somebody has to.'` },
      ],
      choices: [
        { text: "The Moorage office. If this harbor has a keeper, start there.",
          when: { hasnt: "c3_moorage_done" },
          goto: "c3_moorage" },
        { text: "The white ship, down the deep berths. You know that white.",
          when: { hasnt: "c3_white_done" },
          goto: "c3_white_ship" },
        { text: "The chisel and the fury. Investigate the small one-woman war " +
                "on the quaystone.",
          when: { hasnt: "c3_nan_done" },
          goto: "c3_nan_wall" },
        { text: "The black desk under the feather. The office endures, " +
                "apparently EVERYWHERE.",
          when: { hasnt: "c3_desk_done" },
          goto: "c3_rook_desk" },
        { text: "Walk the wrack-row and listen. Quays talk, even this one.",
          when: { hasnt: "c3_row_done" },
          goto: "c3_wrack_row" },
        { text: "A flat bell is ringing, somewhere out among the rafts. Slack " +
                "water. Something is moving that shouldn't be.",
          when: { all: [{ has: "c3_moorage_done" },
                        { hasnt: "c3_breakout_done" }] },
          fx: { xp: 10 }, goto: "c3_slack_bell" },
        { text: "Down the long stair to the Wrack Market.",
          when: { has: "c3_breakout_done" },
          goto: "c3_wrack_market" },
      ],
    },

    // ------------------------------------------------------- the moorage
    "c3_moorage": {
      on_enter: { flags: { c3_moorage_done: true }, xp: 15 },
      text: `The Moorage office smells of tar, lamp-oil, and tea. The walls are
pigeonholes, floor to ceiling, wall after wall, receding into a
lamplit distance the building's outside does not allow — and every
pigeonhole holds a coiled line, tagged in a fine tarred hand. You
understand what you are looking at before anyone explains it, which
is the worst way to understand anything. The lines are the moorings.
This room HOLDS the Roads.

The Moorwife is at the counter, splicing.

She is grey-haired and broad-handed and could be any harbor-wife on
any coast you have ever walked, except that her splice takes six
strands where rope takes three, and the sixth strand is nothing you
can look at directly. She works it in without glancing down.

'The arrival,' she says, warmly, and puts the work aside and pours
tea for two as if you were expected — you were; everyone is,
eventually. 'Welcome to the Roads. You'll have questions. The live
ones always do, the little while they visit.' She slides the cup
across. 'Ask. Keeping is the work; answering comes with it.'

# Behind her, in the nearest pigeonhole, a tagged line shifts —
settles — the way a sleeper shifts when someone speaks near them.
The tag, in fine tarred letters, is a name you know: TIDEMOTHER.`,
      choices: [
        { text: "'Her. The kneeling one. She held a coast four thousand years " +
                "and came here for her REST. Why is she still waiting?'",
          fx: { xp: 10 }, goto: "c3_moorage_mother" },
        { text: "'The Open. The water past your Breakwater. Why has nothing " +
                "ever sailed out onto it?'",
          fx: { xp: 10 }, goto: "c3_moorage_open" },
      ],
    },

    "c3_moorage_mother": {
      text: `'The surety of the First Debt,' the Moorwife says, and her voice
does something you did not expect: it gentles further. 'Berth nine
thousand and one. I spliced her line myself, the night she came in —
finest arrival of my tenure. Four thousand years at the bottom of a
sea, holding a whole coast on her shoulders, and she stepped onto my
quay and thanked the FERRYMAN.'

She turns the teacup in her broad hands.

'And now she is KEPT. Safe. Tended. Her line is checked each watch;
her light is trimmed; nothing in this harbor will ever, ever be
asked to hold anything again. That is what the Roads ARE, wanderer.
Every soul at every berth out there spent themselves holding — wells
and fords and worlds and coasts — and every one of them is done now,
and I will not lose ONE.'

You ask — carefully, because the tea is good and the room is warm
and every instinct you own is ringing like the Watch's bell — what
happens when one of them wishes to leave. To go OUT. To rest.

She looks at you with ten thousand years of perfect, patient
kindness.

'Out there?' She nods through the window, at the Open, untouched
past the Breakwater's gap. 'Nothing comes back from out there. No
line reaches it. No light rides on it. Whatever goes onto that
water is GONE, and gone is just lost with its paperwork done.' She
picks up her splice again, six strands, certain. 'My charter is one
sentence, wanderer, and I have kept it since the first arrival:
NOTHING THAT HELD SHALL BE LOST.'

# 'They are not waiting,' she says, working the strand in. 'They
are KEPT. There is a difference, and the difference is me.'`,
      choices: [
        { text: "'And nobody asked them which they wanted.' Set the cup down. " +
                "You have heard what you came to hear.",
          fx: { xp: 15, flags: { c3_heard_charter: true } },
          goto: "c3_quay" },
        { text: "'Show me the charter someday. One sentence usually has a " +
                "second half.' Thank her for the tea and go.",
          fx: { xp: 15, flags: { c3_heard_charter: true } },
          goto: "c3_quay" },
      ],
    },

    "c3_moorage_open": {
      text: `'The Open,' the Moorwife says, and for a moment the splice in her
hands goes still.

'When the Roads were chartered — before my tenure, before most
tenures — that water is where the finished went. So the oldest
entries say: the spent came down the Long Water, rested a tide or
two at the moorings, and then went OUT, onto the last water, under
no light at all. And nothing ever came back to say what it was
like.' She resumes the splice. 'Think on that, wanderer. Not one
report. Not one wake returning. The old keepers called it rest
because calling it LOSS would have emptied the harbor of its
courage.'

'And then the first Tenant came in — the oldest arrival, Berth One,
down at the harbor's root — and the first Tenant would NOT go out.
Wept, the old entries say. A thing that had held since before
holding had a word, brought to the lip of the Open, and it wept
and would not go, and asked to be moored FOREVER.'

She meets your eyes, and there is no apology anywhere in her.

'So it was moored forever. And the Moorage learned its trade. We
have not lost a single soul to that water since, and the Roads are
the proof of the keeping: ten thousand years, every light burning,
every line sound.'

# You look out the window at the Open — the horizon with no wakes
on it, lit like the hour before a lamp is needed — and you think:
or every light BURNING is ten thousand years of nobody allowed to
find out. The room is warm. The tea is good. The window does not
open.`,
      choices: [
        { text: "'Berth One.' File the name where you file loaded things, and " +
                "take your leave.",
          fx: { xp: 15, flags: { c3_heard_tenant: true } },
          goto: "c3_quay" },
      ],
    },

    // ----------------------------------------------------- the white ship
    "c3_white_ship": {
      on_enter: { flags: { c3_white_done: true }, xp: 15 },
      text: (s) => {
        const charm = s.hasItem("c2_knot_charm")
          ? `

The First-Knot charm is humming in your pocket before you are
halfway down the ranks — the cord her own hands tied, the Loomless
say, and it pulls toward her berth like a compass finding its
north at last.`
          : ``;
        return `You walk the deep berths a long time. The moored watch you pass —
lucks and lullabies, keepers and small gods, riding lights beyond
counting, and every one of them tracks the walking LIVE thing down
the quay with the hunger of the becalmed watching weather.${charm}

The white ship rides at berth nine thousand and one.

She is at the rail. Salt and pearl, woman-shaped patience, the
figure that knelt four thousand years in the deep dark holding a
coast on her bowed shoulders — upright now, discharged, RISEN, and
riding at a numbered mooring in a harbor that has never once let
anything finish arriving.

She knows you. However the settlement went at the bottom of the
world, you were there, at the Great Ebb, at the end of her long
holding — and the salt figure at the rail inclines its head to you
exactly as it did then: the bow of one holder to another across a
counting-room the size of an age.

'You,' she says. Her voice is tide over shingle, worn kind. 'The
one from the Ebb. You are a long way past your water, walker.'

# She does not say WHY ARE YOU HERE. She has been on this quay four
hundred days and in service four thousand years, and you understand
that she has simply, finally, stopped expecting anything to come
for her. That is the thing about this harbor you will not forgive.`;
      },
      choices: [
        { text: "'I came to find where the tides go. They go somewhere WRONG. " +
                "Tell me about the waiting.'",
          fx: { xp: 10 }, goto: "c3_white_words" },
      ],
    },

    "c3_white_words": {
      text: `She tells you about the waiting the way she does everything: without
complaint, which is worse than any complaint ever composed.

'I came down the Long Water on the tide of my own going. The
ferryman rowed me in — a courteous man; I must learn his name
properly. The keeper spliced my line herself and said: REST NOW.
And I thought: yes. Soon. There is a gate, and past the gate the
last water, and when they open the gate I will go out the way the
old holders went, and set it all down — every year of it — and
rest.'

The riding light above her burns its steady grey-gold.

'They trim my light each watch. They check my line. They are so
KIND, walker. And the gate has not opened in ten thousand years,
and I knelt four thousand under a sea and know what waiting is, and
so I will tell you the thing the kind keeper cannot hear:

'this is not rest. Rest is the other side of holding — the hand,
OPENING. This' — the whole white ship, the tended line, the trimmed
light, in two words — 'is being HELD. I did not mind holding. I
mind, very much, being made to be held forever by someone who will
not say the word FOREVER out loud.'

She looks out, past the Breakwater's gap, at the Open, and the salt
of her face catches the grey-gold light.

'The Tenth Song has a last verse, walker. My verse. The rest at the
end of the music. I have been ready to sing it for four hundred
days.'

# 'Come again, before whatever you are here to do. There is
something I have kept four thousand years, and I think — ' the
first hesitation, the first, in all of it — 'I think I would like
it CARRIED, in case the gate ever opens.'`,
      choices: [
        { text: "'The gate is going to open. Hold that instead.' Leave her " +
                "with the promise, and take the promise with you.",
          fx: { xp: 20, karma: 3, flags: { c3_white_promise: true } },
          goto: "c3_quay" },
      ],
    },

    // ---------------------------------------------------------- nan weir
    "c3_nan_wall": {
      on_enter: { flags: { c3_nan_done: true }, xp: 15 },
      text: `The small fury at the quaystone resolves, on approach, into a broad
grey-wired woman of no particular height and tremendous specific
gravity, wearing three coats, carrying a bucket, and chiseling at
the base of an iron mooring-ring set into the living stone. Her
line runs from the ring to her ankle. It is tied in a splice you
recognize from the Moorage walls: six strands, one of them
unlookable.

Two wardens observe from a polite distance, in the manner of
weather-watchers timing a squall they have timed before.

'Attempt three hundred and fifteen,' says the nearer one, not
unkindly, making a note.

'Three hundred and SIXTEEN,' the woman snarls at the stone, 'you
missed the one with the soup,' and then to you, without turning,
without pausing the chisel: 'You. Live one. You smell like
weather. Hold this.' She hands you, of all things, the bucket.
'Nan Weir. Well-Wife of Weir-under-Fell, nine hundred years
standing surety for the sweetest well in three valleys, DECEASED —
the village, not me, though they filed us together, which is the
whole of my complaint, if you're writing it down. SOMEBODY should
be writing it down.'

# The chisel rings on the ring. The ring, you would swear, rings
back — patiently, like the Moorwife's kindness given a shape.`,
      choices: [
        { text: "[Might] Set down the bucket, take hold of the ring, and pull " +
                "while she works. Give the squall some weather to work with.",
          check: { stat: "might", dc: 11,
                   ok: "c3_nan_meet", fail: "c3_nan_meet",
                   ok_fx: { xp: 15, approval: { nan: 5 },
                            flags: { c3_nan_impressed: true } },
                   fail_fx: { xp: 10, hp: -3 } } },
        { text: "[Wits] Stroll over to the wardens and engage them on Moorage " +
                "procedure. At length. With follow-up questions.",
          check: { stat: "wits", dc: 11,
                   ok: "c3_nan_meet", fail: "c3_nan_meet",
                   ok_fx: { xp: 15, approval: { nan: 5 },
                            flags: { c3_nan_impressed: true } },
                   fail_fx: { xp: 10 } } },
        { text: "Hold the bucket and watch. You are new to this harbor and " +
                "this woman has three hundred and fifteen attempts of local " +
                "knowledge.",
          fx: { xp: 10 }, goto: "c3_nan_meet" },
      ],
    },

    "c3_nan_meet": {
      text: (s) => {
        const opener = s.flag("c3_nan_impressed")
          ? `The attempt ends the way, you gather, all three hundred and fifteen
before it ended: the six-strand splice pays out exactly as far as
hope and not one fathom further, and the wardens re-tie it with
gentle, practiced hands and offer everyone tea. But something is
different this time, and the difference is you. Nan Weir looks you
over — the whole of you, twice — like a woman pricing a rope.

'Huh,' she says. 'You PULLED. Nobody pulls. They watch, they tut,
they write it down.'`
          : `The attempt ends the way, you gather, all three hundred and fifteen
before it ended: the six-strand splice pays out exactly as far as
hope and not one fathom further, and the wardens re-tie it with
gentle, practiced hands and offer everyone tea. Nan Weir drinks
hers in one draught, hands back the cup like a challenge, and turns
the whole of her attention on you.`;
        return `${opener}

'Here's my situation, live one, since you're the first new thing on
this quay in a hundred years. I held the well at Weir-under-Fell.
Nine hundred years — every bucket that shouldn't come up empty,
DIDN'T; that was me, that was my whole work, and it was GOOD work.
Then the fell slipped, and the village drowned, and some clerk of
an afterward filed the well's luck as CONCLUDED and shipped me
down the Long Water with the rest of the estate.'

She jabs the chisel back into her belt.

'Concluded. ME. I've got nine hundred years of holding in these
hands and an afterward telling me my work is done, and here's what
I know that the woman in that office with her tea and her splices
will not hear: I'm not DONE, I'm UNEMPLOYED. There's a difference,
and the difference is the whole of me.'

She retrieves her bucket from you and peers into it, out of nine
centuries of habit, checking the level.

# 'You're here to do something about this place,' she says. 'Don't
argue, you reek of it. Errands and weather. Well. I've three
hundred and fifteen attempts' worth of local knowledge, both fists,
and NOTHING BUT TIME. Take me on.'`;
      },
      choices: [
        { text: "'Pick up your bucket, Well-Wife. You're hired.' (Nan Weir " +
                "joins you.)",
          fx: { xp: 15, recruit: "nan", approval: { nan: 10 } },
          goto: "c3_nan_join" },
        { text: "'I work alone. But I'll be pulling on this harbor, Nan — " +
                "watch for it.' Decline, as kindly as she allows.",
          fx: { xp: 10 }, goto: "c3_nan_decline" },
      ],
    },

    "c3_nan_join": {
      text: `The wardens watch, with visible institutional unease, as Nan Weir
unties her own ankle-line — which comes loose at once, at a touch.

You stare. Three hundred and fifteen attempts with a CHISEL, and it
unties at a touch.

'Oh, it always unties,' Nan says, coiling it neatly and hanging it
on the ring like a woman hanging up an argument for later. 'It's a
KEEPING line, not a holding one. It'll let you step anywhere in the
harbor — to the office, to the tea, to your own berth and back.
What it won't let you do is LEAVE, and it counts anything as
leaving that you do with your face pointed at the Open.' She hoists
the bucket. 'The chisel's not for the line, live one. The chisel is
for the RECORD. Attempt three hundred and sixteen, WITNESSED,
wardens, write it down.'

The nearer warden, to his credit, writes it down.

# 'Right,' says Nan Weir, falling in at your shoulder like nine
hundred years of not letting go. 'Where do we pull first?'`,
      choices: [
        { text: "Back along the quay.",
          fx: { xp: 10 }, goto: "c3_quay" },
      ],
    },

    "c3_nan_decline": {
      text: `Nan Weir takes the refusal the way she plainly takes everything: as
scheduling.

'Alone. Certainly. Everyone's alone here, it's an afterward, it's
the fashion.' She reclaims her bucket and inspects the level.
'I'll be on this quay, live one. Berth P-eleven, pier side, ask
anyone, they'll sigh and point. When your alone wears through —
and on these Roads it wears QUICK — you come find the Well-Wife.'

She turns back to the mooring-ring, then pauses, and says over her
shoulder, with the first softness she has shown:

'You went straight down the deep berths when you landed. I watch
all the arrivals; you're the first in a hundred years that went to
HER before the office. Whatever you're here for, that's the right
order.'

# 'Attempt three hundred and sixteen,' she announces to the
wardens, raising the chisel. 'For the RECORD.'`,
      choices: [
        { text: "Back along the quay.",
          fx: { xp: 10 }, goto: "c3_quay" },
      ],
    },

    // ------------------------------------------------------ the black desk
    "c3_rook_desk": {
      on_enter: { flags: { c3_desk_done: true }, xp: 15 },
      text: (s) => {
        const clerk = s.flag("c2_quill_gone")
          ? `The clerk at the desk is a Corvid you don't know — young, precise,
new feathers on the coat — but the satchel hanging on the desk's
corner you know very well. Quill's satchel. Patched strap, ink
stains, steadiest hands on the coast. 'It came down with the
office stores,' the clerk says, following your eyes, quiet.
'Effects of a clerk of the coastal office, unclaimed. I use it to
carry the refused instruments. It seemed — respectful.' You stand
with that a moment, on a quay where everything is kept and nothing
is finished, and you find you have nothing to file it under.`
          : `The clerk at the desk, bent over a ledger in the lamplight, worrying
a pen the way other people breathe, is — of course it is. Of COURSE
it is.

'Don't,' says Quill, without looking up, 'say it.'

You say it anyway. Quill — the Unbranded Clerk, one page of the
master book and the steadiest hands on the coast — POSTED HERE, at
the office's furthest desk, at the far end of everything.

'I volunteered.' The pen stops. 'The transcription went everywhere,
you know. THE TERMS WE WERE HELD ON, read at tide-festivals. And I
kept thinking: somebody read the terms to the LIVING. Nobody has
ever read anything to the far end of the filing. So.' The pen
resumes. 'Somebody has to. I hear that's the entire liturgy.'`;
        return `The black desk under the feather sign does business at the quay's
end, and its business, you gather at one glance, is FAILING — the
first failing office of the shore you have ever seen. The out-tray
is empty. The in-tray is a tower of returned instruments, every one
stamped in tar: REFUSED. HOLDER RETAINS.

${clerk}

# On the desk's corner, weighted under a stone, sits the office's
standing correspondence with the Moorage: a form letter, grey
paper, in full: THE MOORAGE THANKS YOU. ALL BERTHS ARE KEPT.`;
      },
      choices: [
        { text: "There is a paper on the desk with YOUR name on it. The " +
                "season-lien you signed at the bottom of the world has been " +
                "CALLED.",
          when: { has: "c2_self_pledged" },
          fx: { xp: 10 }, goto: "c3_lien_called" },
        { text: "Your tally-coin has gone warm in your pocket, here at the " +
                "office's far desk. Set it on the ledger and see what it says.",
          when: { all: [{ hasnt: "c2_self_pledged" },
                        { item: "c2_tally_coin" }] },
          fx: { xp: 15, flags: { c3_coin_message: true } },
          goto: "c3_desk_words" },
        { text: "Ask what the office knows about the Moorage that the Moorage " +
                "doesn't put in form letters.",
          fx: { xp: 10 }, goto: "c3_desk_words" },
      ],
    },

    "c3_lien_called": {
      text: `The instrument is drawn in the hand you remember — fine, tarred,
four thousand winters steady — and it is, as the Lady's paper always
is, flawless.

LIEN OF NAME (ONE SEASON), the header reads. GRANTOR: YOURSELF.
CONSIDERATION: RECEIVED IN FULL AT THE BOTTOM OF THE WORLD. The
body notes, in the driest clause you have ever read, that the
office has elected to call the season NOW, HERE, at its Roads desk
— where a moored name, the schedule observes, can be WAREHOUSED at
unprecedented convenience. For one season your name would ride at
a Moorage berth: tagged, tended, its light trimmed, while you walk
the harbor anonymous as weather.

The clerk watches you read it, wincing in professional sympathy.

# 'It's enforceable,' the clerk says. 'I checked. I checked TWICE.
I'm sorry. She always collects — but there's language at the
bottom, look. Even here. Especially here. There's always language
at the bottom.'`,
      choices: [
        { text: "Honor it. Let the office moor your name for its season, and " +
                "walk the Roads nameless. Feel what the kept feel.",
          fx: { xp: 25, karma: 5, flags: { c3_name_moored: true } },
          goto: "c3_lien_paid" },
        { text: "Buy the season out. The paper prices early redemption at 35 " +
                "gold, plus a lecture on liquidity. (-35 gold)",
          when: { gold: 35 },
          fx: { gold: -35, xp: 15, flags: { c3_lien_bought: true } },
          goto: "c3_lien_paid" },
        { text: "[Wits] The language at the bottom. Read it the way Maeve " +
                "taught the whole coast: CHECK THE WORKING. ALWAYS.",
          check: { stat: "wits", dc: 12,
                   ok: "c3_lien_void", fail: "c3_lien_paid",
                   ok_fx: { xp: 30, flags: { c3_lien_voided: true } },
                   fail_fx: { xp: 10, gold: -10,
                              flags: { c3_name_moored: true } } } },
      ],
    },

    "c3_lien_void": {
      text: `You find it in the definitions, where the office hides everything
worth finding.

'SEASON,' the instrument provides, 'shall mean one quarter-turning
OF THE YEAR.' And the Grey Roads — you look up, out the window, at
the grey-gold light that has not changed since you arrived, at the
evening it is always going to be — the Grey Roads have no year. No
seasons turn here. Nothing turns here. That is the entire
establishment. The lien is drawn on a calendar this jurisdiction
has never possessed: unexecutable, VOID where timeless.

The clerk checks your working. The clerk checks it twice. Then the
clerk stamps the instrument — with what you would swear is
professional delight — VOID FOR WANT OF A SEASON, and files the
office's first successfully closed matter in four hundred days.

'She'll be furious,' the clerk says, glowing. 'She'll be
IMPRESSED. With the Lady those arrive together or not at all.'

# Somewhere very far up the Long Water, you are quite sure, a
tally-coin has just gone cold, and a woman in wool has paused over
a black book, and — those who know her best would translate —
smiled.`,
      choices: [
        { text: "Back along the quay, name intact, working checked.",
          fx: { xp: 10 }, goto: "c3_quay" },
      ],
    },

    "c3_lien_paid": {
      text: [
        { if: { has: "c3_lien_bought" },
          text: `You count out the gold, and the clerk counts it again — the office
counts everything twice; it's load-bearing — and stamps the lien
REDEEMED.

'For what it's worth,' the clerk says, sliding your receipt across,
'almost nobody redeems. They let it ride, they tell themselves a
season's nothing.' A glance down the quay, at the ranked riding
lights, ten thousand years of a-season's-nothing. 'You've seen
what this place does with time. Cheap at the price.'

# The receipt is stamped ALL DEBTS HONORED. On this quay, the old
motto reads completely differently, and you suspect the Lady knows
it.` },
        { text: `The clerk moors your name at a pier berth with full ceremony: a
tag, a line, a trimmed light — the smallest mooring on the Roads,
and the only one with a term.

Walking away from it is the strangest thing you have done on two
worlds' coasts. The wardens' eyes slide off you. The moored don't
track you down the quay anymore. Even the Moorwife's window seems
to look THROUGH the place you're standing. For one season you are
what nothing on the Roads has ever been: unkept, unfiled, un-held
— and it is cold, and it is quiet, and it is FREE, and you begin
to understand, walking nameless past ten thousand tended lights,
exactly how much this harbor's kindness costs, because for the
first time since you arrived, nothing here is holding you at all.

# Your name rides at its little berth, light trimmed each watch.
You catch yourself visiting it. The clerk pretends not to log the
visits, and logs them, and you find you don't mind: SOMEBODY
should be writing it down.` },
      ],
      choices: [
        { text: "Back along the quay.",
          fx: { xp: 10 }, goto: "c3_quay" },
      ],
    },

    "c3_desk_words": {
      text: (s) => {
        const coin = s.flag("c3_coin_message")
          ? `You set the tally-coin on the ledger, and the clerk goes very still,
because the coin stands itself on edge — and spins, once, slowly,
and lies down heads-up, and the warmth goes out of it like a held
breath released.

'That's a message,' the clerk whispers. 'That's the Lady's OWN
hand. I've only read about it.' A long professional pause. 'Heads
laid down means: PROCEED. YOUR JUDGMENT. It means she's watching
this quay through her marker and she is EXTENDING THE ACCOUNT.
Wanderer, in four thousand years of records I don't think that
coin has ever been laid down for anyone.'

`
          : ``;
        return `${coin}The desk's file on the Moorage is thin, old, and furious, and the
clerk walks you through it in the flat voice clerks reserve for
scandals beyond their pay.

'The office holds. The Moorage KEEPS. They look like the same trade
and they are not. Every instrument the office ever executed has a
termination clause — the Lady drafts them herself; a debt without
an ending isn't a debt, it's a WEATHER. The Moorage's charter has
no termination anything. One sentence, no ending, and they
administer it like scripture.'

The clerk leans in, and drops to the register of true heresy:

'But here's what the file says, wanderer. The office's oldest
correspondence — before the towns — refers to the Moorage charter
as having TWO pages. Two. And every copy anyone has sighted since
runs one page, ending mid-sentence at the bottom, and the Moorage
office keeps the original chained in a vault at the Bitts, down
past the Wrack Market, and has never once produced it for
inspection.'

# 'Somebody,' the clerk says, 'ATE the second page. That's the
office's professional assessment, for the record: somebody ate
the ending, and the keeping's been running on the leftovers for
ten thousand years.'`;
      },
      choices: [
        { text: "'Then somebody had better go and read the original.' Note " +
                "the Bitts on your chart, and back along the quay.",
          fx: { xp: 15, flags: { c3_heard_vault: true } },
          goto: "c3_quay" },
      ],
    },

    // ------------------------------------------------------- the wrack-row
    "c3_wrack_row": {
      on_enter: { flags: { c3_row_done: true }, xp: 15 },
      text: `You walk the wrack-row — the long stretch of quay where the smaller
moored raft up in their hundreds, pier berths and bottle-fleets and
log-boomed lucks — and you do what you have done on every coast of
two worlds: you LISTEN.

A spent harvest-luck, to a retired ford: '...heard the impound
cutter came back empty. EMPTY. There's a whole coast up there riding
loose, anchors up, thumbing its nose—'

A worn-out lullaby, rocking a bottle-fleet of old names: '...hush
now. The live one walked the deep berths this very watch. Went to
HER. Hush. Things are moving, loves, things are finally—'

A small done god of a door-lintel, flat and firm: '...I'm not
saying the keeper's wrong, I'm saying nine of my ten millennia here
I have spent IN A QUEUE FOR A GATE THAT DOES NOT OPEN, and I was
promised a rest, and I remember the promise VERBATIM, I was a
LINTEL, remembering verbatim is the entire job—'

And under all of it, wherever two moored things murmur, one word
keeps surfacing, the way driftwood surfaces, the way hope does:
the SLACK. The slack, the slack. At slack water, when the keeping
lines go soft for the turning of the tide... the rafts are going
to TRY.

# Ten thousand years of patience, and the harbor has finally run
out of it in the one year since the settlements shook the water.
You arrived, you begin to suspect, on the LAST evening of the old
Grey Roads.`,
      choices: [
        { text: "Back along the quay, carrying what you heard.",
          fx: { xp: 10, flags: { c3_heard_slack: true } },
          goto: "c3_quay" },
      ],
    },

    // ------------------------------------------------------- the breakout
    "c3_slack_bell": {
      text: `The bell is the rafts' own — cracked, flat, scavenged off some
spent harbor-luck — and it rings SLACK, SLACK, SLACK, and the
wrack-row answers it like a held breath breaking.

They go at the turning of the tide, exactly as the murmurs
promised: a raft-flotilla of the smallest moored — pier-berth
lucks, bottle-fleets of names, the lintel-god poling like a
champion, a worn lullaby spread across three rafts singing itself
for courage — dozens, then hundreds, casting off keeping-lines
gone soft at the slack, and making, in a silence more terrible
than any war-cry, for the Breakwater's gap and the Open beyond.

From the Moorage, unhurried, the wardens put out: oilcloth and
soft rope, gentle as fog closing.

Cobb has the Eventually alongside the steps before you ask.
'Slack lasts half a bell,' he says, pipe clamped, oar ready.
'Whatever you mean to be in this harbor, live one — quickest to
decide it now.'`,
      choices: [
        { text: "[Might] Board the lead raft and HAUL. Put a living back into " +
                "their line and pull for the gap.",
          fx: { flags: { c3_breakout_helped: true } },
          check: { stat: "might", dc: 12,
                   ok: "c3_breakout_surge", fail: "c3_breakout_after",
                   ok_fx: { xp: 25 },
                   fail_fx: { xp: 15, hp: -4 } } },
        { text: "[Spirit] Stand between rafts and wardens, and say the word " +
                "the whole harbor has forgotten: ASK. Ask them. ASK THEM.",
          fx: { flags: { c3_breakout_helped: true } },
          check: { stat: "spirit", dc: 12,
                   ok: "c3_breakout_surge", fail: "c3_breakout_after",
                   ok_fx: { xp: 25, karma: 3 },
                   fail_fx: { xp: 15 } } },
        { text: "Put yourself in the wardens' path, gaff to soft rope. Buy " +
                "the rafts their half a bell.",
          fx: { flags: { c3_breakout_helped: true } },
          combat: { enemy: "c3_moor_wardens",
                    win: "c3_breakout_surge", flee: "c3_breakout_after",
                    win_fx: { xp: 30 } } },
        { text: "Stand on the quay and WITNESS. You are one live soul in a " +
                "harbor of ten thousand years; before you spend yourself, " +
                "see what the Roads do.",
          fx: { xp: 15, flags: { c3_breakout_watched: true } },
          goto: "c3_breakout_after" },
      ],
    },

    "c3_breakout_surge": {
      text: `They make the gap. That is the wonder of it, the thing the Roads
will murmur about for whatever time the Roads have left: with your
weight in the line — your pull, your word, your half a bell bought
and paid — the lead rafts pass the wardens, pass the last rank of
moorings, and reach open water inside the Breakwater's arms, and
the lintel-god lets out ten millennia of held breath in one shout,
and the lullaby sings its rafts straight at the gap, at the Open,
at the horizon with no wakes —

and the Breakwater WAKES.

No wave. No violence. The grey arm of the harbor simply — attends.
The water inside the gap rises, unhurried, into a shape with
shoulders, and the shape leans down over the rafts the way a
mother leans over a basket, and TAKES THEM UP — gently, all of
them, gently and completely — and turns, and carries them back,
past you, through a harbor gone silent as snow, and sets each one
at its numbered berth and stands over them while the wardens
splice each keeping-line home, six strands, one unlookable.

Then it looks at you. The live one. The weight in the line.

It does not strike you. It does something worse: it makes you a
small, correct, ten-thousand-year-old bow — one keeper
acknowledging another's EFFORT — and pours itself back into the
gap it has guarded since the charter lost its ending.

# 'STANDING ORDERS,' Cobb says quietly, at your shoulder. 'It's not
cruel, see. That's the horror entire. There is not one cruel thing
in this whole harbor, and it holds ten thousand years of prisoners.'`,
      on_enter: { flags: { c3_saw_breakwater: true } },
      choices: [
        { text: "Go where the towed are being taken.",
          fx: { xp: 15 }, goto: "c3_breakout_after" },
      ],
    },

    "c3_breakout_after": {
      text: [
        { if: { has: "c3_saw_breakwater" },
          text: `Afterward, there is tea.

That is the Moorage's whole answer to the largest escape in the
history of the Roads: blankets, and grey strong tea, issued to
every towed-back raft by wardens whose gentleness never once
cracked, while the Moorwife herself walks the wrack-row, checking
splices with her broad hands, saying — to a shivering luck, to
the lullaby, to the lintel-god who will not look at her — 'There.
There now. Safe. SAFE. Nothing lost. Not one of you lost. Not
ever, not while I keep.'

She stops before you, last. She looks at you a long, warm,
ten-thousand-year moment — the live one who pulled, out loud, in
public, and made her Breakwater stand up in front of everyone.

'You'll be at the Wrack Market next,' she says. Not a threat. A
FILING. 'The live ones always go deeper. Mind the third stair on
the market steps, wanderer. It turns.'

# Behind her, down the wrack-row, the lintel-god catches your eye,
and mouths — verbatim, because remembering verbatim is the entire
job — WE ARE HELD. NOBODY ASKED.` },
        { text: `It is over in half a bell, and it was over before it began, and
everyone in the harbor knew except the ones who had to try anyway.

The wardens tow the rafts home with soft rope and softer voices.
Nothing is punished. Nothing is even SCOLDED. There is tea —
blankets and grey strong tea for every towed-back raft — and the
Moorwife herself walks the wrack-row checking splices, saying
'safe, safe, nothing lost, not one of you,' in a voice that has
meant it for ten thousand years, while the lullaby cries itself
quiet across its three rafts and the lintel-god stares at the
Breakwater's gap and recites something, verbatim, that nobody
wrote down.

The Moorwife stops before you on her way back to the office.

'You watched,' she says. Not approval — CATALOGUING. 'The live
ones who watch are the ones who go deepest. You'll be at the
Wrack Market next.' She gathers her coat. 'Mind the third stair
on the market steps, wanderer. It turns.'

# Down the wrack-row, the lintel-god catches your eye and mouths —
verbatim, because remembering verbatim is the entire job — WE ARE
HELD. NOBODY ASKED.` },
      ],
      on_enter: { flags: { c3_breakout_done: true }, xp: 20 },
      choices: [
        { text: "Find Cobb at the steps. If you're going deeper, you'll want " +
                "the ferryman.",
          goto: "c3_deep_row" },
      ],
    },

    "c3_deep_row": {
      text: `Cobb is at the steps, pipe lit, watching the last of the tea being
distributed with the expression of a man auditing a disaster for
form.

'Four hundred years on the long-water run,' he says, as you come
down. 'Rowed every one of them in. The lullaby. The lintel. The
kneeling one herself, biggest fare of my tenure.' He taps the pipe
out against the Eventually's transom, deliberate as a verdict.
'Every fare, I told them the same at the gate: it's a rest, they
say, at the far end. THEY SAY. Four hundred years of they-say, and
tonight I watched the harbor stand up out of its own water to stop
a LULLABY.'

He looks at you, barnacle-grey and steady.

'First rule of the Watch: you don't hand a fare halfway. I've been
handing every fare of my afterlife halfway and calling it the run.
So.' He steps out of the skiff, onto the quay, and takes up his
oar like a pikeman. 'Wherever this goes, live one, I'm rowing. The
deep berths, the Bitts, the Breakwater itself if it wants a second
opinion.'

# 'Somebody has to,' he says. 'And I have HAD IT with it being
nobody.'`,
      choices: [
        { text: "'Ship with me, ferryman.' (Cobb joins you.)",
          fx: { xp: 15, recruit: "cobb", approval: { cobb: 10 } },
          goto: "c3_market_steps" },
        { text: "'Keep the Eventually ready at the steps instead. When this " +
                "harbor breaks open, everyone will need a ferryman.' ",
          fx: { xp: 15, approval: { cobb: 5 } },
          goto: "c3_market_steps" },
      ],
    },

    "c3_market_steps": {
      text: `The way down to the Wrack Market is a stair cut through the quay's
own stone, lit by riding lights repurposed as lamps — retired
lights, Cobb explains, lights whose ships went to the bone-yard
berths long ago, glowing on out of habit and hospitality.

The third stair turns. You mind it.

Below, the market noise rises to meet you: the only commerce an
afterward has, the trade of finished things among the finished —
and, folded high and narrow and pale at the deep end, past the
stalls of spent luck and secondhand rests, exactly where he is
always folded, the stall you'd know on any water of any world.

# Something is always coming due somewhere. Even here. ESPECIALLY
here.`,
      choices: [
        { text: "Down into the Wrack Market.",
          fx: { xp: 15 }, goto: "c3_wrack_market" },
      ],
    },
  };

  HC.registerScenes("ch3", SCENES);
})(globalThis.HC);
