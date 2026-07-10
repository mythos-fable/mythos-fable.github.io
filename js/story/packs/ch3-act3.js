/* Chapter 3, Act 3: the Breakwater at the Overtide.
   The walk out the harbor's arm against standing orders, the Oldest
   Tenant surfacing to watch its ten-thousand-year arithmetic be tested,
   the Moorwife's last stand of perfect love, and the choice at the gap
   that settles what the Grey Roads become. */
(function (HC) {
  "use strict";

  const SCENES = {

    // ------------------------------------------------------ the walk out
    "c3_break_road": {
      text: `The Breakwater is a road now — the only road left. The whole
harbor pours along the quays toward it: wardens and stallholders,
bottle-fleets poled by lintels, the Weir raft under way with every
light blazing, the Moorwife striding at the head of her people
with a coil of line over her shoulder like a marshal's sash. Above
and behind everything, up the Long Water, the Overtide stands in
the grey distance like a moving wall with ten thousand years of
riding lights in it.

At the foot of the Breakwater stair, the way is barred.

The Warden of the arm has drawn itself up out of the stonework —
the harbor's outer limb, the shape with shoulders that carried
the rafts home like a mother's hand — and across the stair it
holds a chain, and its stance says what its standing orders have
said for ten thousand years: NOBODY WALKS THE ARM.

The Moorwife herself commands it aside. It does not move. Its
orders are page one, and page one has no clause for this, and it
looks down at its own keeper with something terribly like apology.

# 'It won't know how to stand down,' the Moorwife says quietly.
'Nothing here does. That is rather the whole matter before the
assembly.' She looks at you. 'Well, live one? You pull on things.'`,
      choices: [
        { text: "Present the warden's writ: bearer acts for the Moorage in " +
                "all matters of keeping. And this, warden, is the LAST " +
                "matter of keeping.",
          when: { item: "c3_moor_writ" },
          fx: { xp: 25 }, goto: "c3_wake_terrace" },
        { text: "Set something FINISHED on the chain — the toll every deep " +
                "gate on two coasts has taught you. Let the warden feel a " +
                "concluded thing pass its keeping.",
          when: { any: [{ item: "c2_ledger_page" },
                        { item: "c2_tally_coin" },
                        { item: "c3_berth_token" }] },
          fx: (s) => {
            const order = ["c3_berth_token", "c2_ledger_page",
                           "c2_tally_coin"];
            for (const iid of order) {
              if (s.hasItem(iid)) {
                return { "items-": [iid], xp: 25,
                         flags: { c3_paid_warden: true } };
              }
            }
            return { xp: 25 };
          },
          goto: "c3_wake_terrace" },
        { text: "[Might] Take the chain in both hands and BEAR it down, and " +
                "hold it down while the whole harbor files past over your " +
                "shoulders.",
          check: { stat: "might", dc: 14,
                   ok: "c3_wake_terrace", fail: "c3_wake_terrace",
                   ok_fx: { xp: 35, flags: { c3_bore_chain: true } },
                   fail_fx: { xp: 15, hp: -8 } } },
        { text: "Give the arm the second opinion Cobb promised it. Steel " +
                "against standing orders, on the stair, in front of " +
                "everything.",
          combat: { enemy: "c3_breakwater",
                    win: "c3_wake_terrace",
                    win_fx: { xp: 40, flags: { c3_fought_warden: true } } } },
      ],
    },

    // ------------------------------------------------------- the terrace
    "c3_wake_terrace": {
      text: (s) => {
        const warden = s.flag("c3_fought_warden")
          ? `Behind you the Warden of the arm re-gathers itself slowly into the
stonework, beaten and — you would swear — RELIEVED, the way the
Tenant's dread was relieved: a standing order finally,
honorably, overrun.`
          : `Behind you the Warden of the arm stands down by inches, joint by
stony joint, ten thousand years of orders letting go one finger
at a time — and falls in at the REAR of the column, escorting
its whole harbor out along its own length, because if everyone
is going to the gap, then the gap is where the keeping is.`;
        return `The Breakwater runs out into the grey like the world's last
sentence, and the harbor walks it together.

${warden}

From the arm's spine you can see everything at once, the way you
could see everything from the Great Ebb's floor a world ago: the
Roads behind, ranked lights past counting, straining at ten
thousand years of splices as the water rises under them. The
Overtide up the Long Water, arriving, a wall of finished things
as high as weather. The white ship, close in now, riding light
burning — the Moorage wardens towing her, at their keeper's own
order, to the front of everything; whatever is decided, the
kneeling one will not learn it by rumor. The Merchant's stall,
unfolded at the landward end of the gap with four practiced
motions, ALL DEBTS HONORED face-out to the assembly. A black
desk beside it — the office endures — its clerk arriving at a
dead run with a satchel of ten thousand years of refused
instruments, because if there was ever going to be a delivery
window, it is NOW.

And ahead, at the arm's end: the gap. The gate that is not a
gate — just the space between the Breakwater's hands — and past
it the OPEN, the last water, the horizon with no wakes on it,
lit like the hour before a lamp is needed, waiting the way it
has waited since the first age.

# The water under the arm goes strange as you walk — thick with
attention, rising past the stones — and you realize the whole
harbor's grief has come out with the column too, pooled and
patient, ten thousand years of it, riding alongside like a
second assembly that was never issued berths.`;
      },
      choices: [
        { text: "Walk the arm to its end, through everything the harbor " +
                "feels, to the gap.",
          fx: { xp: 20 }, goto: "c3_tenant_surface" },
      ],
    },

    // -------------------------------------------------- the tenant surfaces
    "c3_tenant_surface": {
      text: (s) => {
        const stance = s.flag("c3_tenant_eased")
          ? `It comes to rest alongside the arm, vast and quiet, and the whole
assembly draws back — all but you. You stood at its keel and
heard its confession; you know what this is. The Oldest Tenant
has not come to stop anything.

It has come to LOOK AGAIN.

'Live one,' it says, and the arm hums with it. 'I told you what
I saw, one glance, one age ago: nothing underneath. And I told
you I no longer believe my own eyes.' The self-tied chain,
dragged the whole way up from Berth One, lies along the stones
like a shed skin. 'So here is the oldest coward in creation,
come up to the lip a second time. Whatever the assembly decides
— someone hold the lamp while I LOOK.'`
          : s.flag("c3_tenant_heard")
          ? `It comes to rest alongside the arm, vast and quiet, and the whole
assembly draws back — all but you. You audited it at its own
keel; you know what this is. The Oldest Tenant has not come to
stop anything.

It has come to VERIFY.

'Live one,' it says, and the arm hums with it. 'Ten thousand
years my books balanced on one unverified figure. Tonight the
figure gets tested, one way or the other, in front of the whole
ledger.' The self-tied chain, dragged the whole way up from
Berth One, lies along the stones like a surrendered instrument.
'I am here to watch the audit close. It is the first honest
thing I have done since the first age. Do not let me flinch.'`
          : s.flag("c3_tenant_fought")
          ? `It comes to rest alongside the arm, vast and quiet — the hull you
beat the fear out of at the bottom of the harbor, risen the whole
way up its own dark to see the arithmetic tested.

'Live one,' it says, and the arm hums with it. 'You took my dread
from me by force. What is left when the dread is taken is only
the QUESTION — and I have carried the question up ten thousand
years of water to have it answered where I asked it first.' The
self-tied chain lies along the stones behind it, dragged the
whole way, links the size of doorways. 'One glance, one age ago.
Nothing underneath. Tonight we all find out what I saw.'`
          : `And then the water inside the harbor bulges, all down the root-
channel, and the assembly's murmur dies as something no living
soul and few moored ones have ever seen comes up the harbor's
own dark to the surface:

a hull. Not a ship — the shape ships have been copies of ever
since. The Oldest Tenant, Berth One, the first arrival, moored
at its own request since keeping began, risen the whole way up
with its self-tied chain dragging behind it like a shed skin.

'ASSEMBLY,' it says, in a voice like a harbor settling, and ten
thousand riding lights shiver. 'I am the reason. Ten thousand
years ago I looked at that water — one glance — and saw NOTHING
UNDERNEATH, and I ate the going-out so none of you would ever be
sent onto it. Every kept year since is my arithmetic. I have
come up to see it tested. I am owed that. I am OWED that.'`;
        return `Before the column reaches the gap, the sea inside the harbor
stands up.

${stance}

The Moorwife has gone very still, at the front of her people,
looking at the Tenant — at the first arrival, the first line she
ever spliced, the frightened thing whose one bad night became
her whole scripture — and you watch ten thousand years of
certainty develop, hairline by hairline, its first crack.

# 'You told me,' she says to it, quietly, terribly, in front of
everything, 'that the water was NOTHING. I built the keeping on
your survey, Tenant. I have been holding ten thousand years of
souls out of that water on the word of the only witness — and
the witness has come up to LOOK AGAIN?'`;
      },
      choices: [
        { text: "Stand between the keeper and the kept, at the gap, where " +
                "this was always going to end.",
          fx: { xp: 20 }, goto: "c3_moorwife_stand" },
      ],
    },

    // ---------------------------------------------------- the keeper's case
    "c3_moorwife_stand": {
      text: (s) => {
        const stub = s.flag("c3_knows_clause")
          ? `You take out the stub — the torn margin, the four surviving words
— and you read them to her, to the Tenant, to the whole
assembled afterward, over the rising water:

'...AND THEN LET GO.'

'Your charter, keeper. The whole sentence. NOTHING THAT HELD
SHALL BE LOST — AND THEN LET GO. It was never a wall. It was a
KEEPING, and keepings END; that's what makes them keepings and
not possessions. You have been executing half a document with
your whole heart for ten thousand years.'

The Moorwife looks at the stub in your hand for a long, long
time. Everyone who has ever mattered on this water is watching
her do it.`
          : `'Your charter runs one page,' you say, over the rising water,
'and it ends mid-sentence, and you know it — you have always
known it. NOTHING THAT HELD SHALL BE LOST is not a scripture,
keeper. It is a FRAGMENT. Nobody charters a harbor with no
out-gate. Somebody ate your ending, and you have been executing
the leftovers with your whole heart for ten thousand years.'

The Moorwife looks at you for a long, long time. Everyone who
has ever mattered on this water is watching her do it.`;
        return `The gap is close now — the space between the Breakwater's hands,
and past it the Open, and the Overtide's shadow falling over the
whole Roads like a tide-table coming true — and in the last
stretch of the arm, the Moorwife turns and makes her stand.

Not against you. Against ALL of it: the tide, the assembly, the
ending of the only sentence she has. She sets her feet on her
harbor's arm and takes the coil of line off her shoulder, and
you understand that she is fully prepared to splice the Overtide
itself to a bollard if that is what keeping requires tonight.

'TEN THOUSAND YEARS,' she says, to everyone, 'and NOTHING LOST.
I will hear the case for the gate — from the live one who pulls,
since the water has appointed no one else. But hear MINE first,
because it has never once been answered, only pitied:

'the first night, the first arrival — THAT one, the great one,
weeping at the lip of this gap — I was new to the office, and I
had one sentence of charter and a frightened holder the size of
an age, and I made my ruling: I spliced it a line, and I said
NOTHING THAT HELD SHALL BE LOST, and it stopped weeping. Do you
understand? IT STOPPED WEEPING. Show me the regulation, in any
world, written by any power, that says that ruling was wrong.
Every soul I have kept since is that same ruling, kept faith
with. You call it a wall. It is a BLANKET, and I have held the
corner of it for ten thousand years without once letting go,
BECAUSE LETTING GO IS HOW THINGS ARE LOST.'

${stub}

'Then answer the only question, wanderer,' she says at last, and
her voice, for the first time in ten millennia, is asking, not
keeping. 'Not for me. For the ruling. Show this office THE
DIFFERENCE BETWEEN LOST AND LET GO —

# '— and I will open my harbor with my own hands.'`;
      },
      choices: [
        { text: "One breath first, with whoever came out on this arm beside " +
                "you.",
          fx: { xp: 15 }, goto: "c3_companion_moment" },
      ],
    },

    // ------------------------------------------------- the companion moment
    "c3_companion_moment": {
      text: (s) => {
        const nan = s.inParty("nan");
        const cobb = s.inParty("cobb");
        if (nan && cobb) {
          return `They flank you at the gap the way they have flanked you down the
whole of this grey water: nine hundred years of not letting go on
your left, four hundred years of steady oar on your right.

'For the record,' says Nan, bucket in hand, eyes on the Weir raft
where it rides at the front of the fleet, 'whatever you choose,
I've seen this harbor's whole argument from inside a mooring
ring, and here's the sum of it: keeping's easy. ASKING's the
work. Choose the one where somebody finally asks.'

'And mind HER,' Cobb says, nodding once at the white ship,
riding light burning at the front of everything. 'I've kept the
fares' words four hundred years. Hers is the one I'd not want
kept a day longer.'

# The verse — if you carry it — lies coiled in your pocket like
permission. The Open waits past the gap, lit like the hour
before a lamp is needed. The whole afterward is watching. Pull.`;
        }
        if (nan) {
          return `Nan plants herself beside you at the gap, bucket in hand, eyes
on the Weir raft where it rides at the front of the fleet with
every light blazing.

'Three hundred and sixteen attempts,' she says, 'and it comes
down to the live one and a torn page. GOOD. That's better odds
than I've had in a century.' She checks the level in the bucket,
nine hundred years of habit, and looks up at you, wire-grey and
absolutely level. 'Whatever you choose — choose the one where
somebody finally ASKS them. All of them. Even the keeper.
ESPECIALLY the keeper. Nobody's asked that woman a thing in ten
thousand years except to stop.'

# The Open waits past the gap, lit like the hour before a lamp
is needed. The whole afterward is watching. Pull.`;
        }
        if (cobb) {
          return `Cobb stands his post beside you at the gap, oar grounded like a
pike, pipe dead and forgotten in his teeth.

'Four hundred years I've rowed them down,' he says, 'and told
every fare the same at the gate: it's a rest, they say, at the
far end. Tonight the they-say gets settled, one way or the
other, and I find I'd row another four hundred years to be
standing here for it.' He nods once at the white ship, riding
light burning at the front of everything. 'Mind her. Whatever
else. I've kept the fares' words four hundred years, and hers
is the one I'd not want kept a day longer.'

# The Open waits past the gap, lit like the hour before a lamp
is needed. The whole afterward is watching. Pull.`;
        }
        return `You stand at the gap alone — the way you stood at the bottom of
a world a year ago, and at the bottom of a different world the
year before that. It is becoming, you reflect, a trade.

Behind you: the whole afterward, holding its breath. The
Moorwife with her coil of line. The Tenant at the lip of its
ten-thousand-year question. The white ship, towed to the front
of everything, her light burning steady, her patience — you can
feel it from here — finally, FINALLY leaning forward.

# The Open waits past the gap, lit like the hour before a lamp
is needed. Nobody is coming to pull this line for you. Somebody
has to. That's the entire liturgy.`;
      },
      choices: [
        { text: "Turn to the gap, and the assembly, and settle the Grey " +
                "Roads.",
          fx: { xp: 15 }, goto: "c3_final_choice" },
      ],
    },

    // -------------------------------------------------------- final choice
    "c3_final_choice": {
      text: `The Overtide's first swells are under the arm now; the fleet's
lights heave; the Open lies past the gap, still as held breath.
Every party to ten thousand years of keeping is assembled at the
end of the Breakwater, and the water itself is waiting on your
word.

The difference between lost and let go. Show it.`,
      choices: [
        { text: "[Spirit] Sing the last verse into the gap, and read the " +
                "torn clause back into the charter — open the harbor by its " +
                "own oldest law. AND THEN LET GO.",
          when: { all: [{ has: "c3_knows_clause" },
                        { item: "c3_verse_cord" }] },
          check: { stat: "spirit", dc: 14,
                   ok: "c3_end_outgoing", fail: "c3_slip_fail",
                   ok_fx: { xp: 50, karma: 5 },
                   fail_fx: { xp: 15 } } },
        { text: "Take the post. Relieve the Moorwife, splice yourself to the " +
                "gap, and hold the door the one way it has never been held: " +
                "OPEN.",
          when: { item: "c3_verse_cord" },
          fx: { xp: 45 }, goto: "c3_end_keeper" },
        { text: "'The first keel out is the OLDEST. Walk your survey again, " +
                "Tenant — witnessed this time.' Send the first coward first, " +
                "and walk at its rail.",
          when: { any: [{ has: "c3_tenant_eased" },
                        { has: "c3_tenant_heard" }] },
          fx: { xp: 50, karma: 3 }, goto: "c3_end_tenant" },
        { text: "Give the Roads to the office: receipt, keeping, and RELEASE, " +
                "administered on schedule, every account closed at last. The " +
                "Lady's trade, honestly practiced, is exactly this.",
          when: { any: [{ item: "c3_moor_writ" },
                        { item: "c2_tally_coin" }] },
          fx: { xp: 40 }, goto: "c3_end_ledger" },
        { text: "Put it to the berths. Every mooring its own vote, every " +
                "tide, forever: the Roads a PORT, not a terminus.",
          fx: { xp: 40 }, goto: "c3_end_port" },
        { text: "The Knot-Knife has one heresy left in it. Cut the " +
                "keeping-lines — ALL of them — and let the Overtide sort " +
                "the harbor out.",
          when: { item: "c2_knot_knife" },
          fx: { xp: 40, karma: -3 }, goto: "c3_end_cut" },
        { text: "'Merchant. The certified copy. Name your price at the " +
                "counter, in view of the whole Roads — ALL DEBTS HONORED.'",
          when: { has: "c3_asked_pale" },
          fx: { xp: 45 }, goto: "c3_end_debts" },
        { text: "'The keeping doesn't end. It changes HANDS.' Give the Roads " +
                "to Nan Weir — a well, not a wall.",
          when: { all: [{ inp: "nan" }, { appr: ["nan", 40] },
                        { has: "c3_nan_answered" }] },
          fx: { xp: 45 }, goto: "c3_end_well" },
        { text: "'The worlds above are LOSING their holders — and here sits " +
                "a harbor full of them, rested enough to be bored. Send them " +
                "BACK.' Reverse the tide.",
          when: { has: "c3_breakout_helped" },
          fx: { xp: 45 }, goto: "c3_end_return" },
      ],
    },

    // -------------------------------------------------------- fail-forward
    "c3_slip_fail": {
      text: `The verse is true and the clause is true and your voice, on the
fourteenth word of the oldest music there is, is HUMAN — and the
gap answers before you are ready.

The gate does not open. The gate BEGINS to open — the water
between the Breakwater's hands turning, turning OUT, for the
first time in ten thousand years — and the half-turned current
takes the arm's end like a hand closing, and takes YOU, and you
are off the stones and into the water between the harbor and
the Open with the verse half-sung and the whole afterward
shouting one word too slowly.

Your hand finds the Warden's chain, trailing from the stair.
The out-turning water takes hold of everything you are, and
pulls, patient as a debt accruing.

You have one grip and one breath, and the oldest choice on any
water there is:`,
      choices: [
        { text: "[Might] HOLD ON. Haul yourself back up the chain against " +
                "the whole out-going sea, and finish what you started.",
          check: { stat: "might", dc: 15,
                   ok: "c3_final_choice", fail: "death",
                   ok_fx: { xp: 30, hp: -6 },
                   fail_fx: {} } },
        { text: "LET GO. Trust the thing you came down here to prove.",
          fx: { xp: 30 }, goto: "c3_slip_carried" },
      ],
    },

    "c3_slip_carried": {
      text: `You open your hand.

And the water — the half-turned, out-going, ten-thousand-year
water, the water the Tenant surveyed as NOTHING UNDERNEATH —

holds you.

Not like a mooring. Like a PALM. It takes your whole weight with
the unpracticed care of a thing that has never once been asked
to, and it carries you — not out, you are not finished, it can
tell, everything on this water has always been able to tell — it
carries you back, and up, and sets you on the Breakwater's
stones as gently as a word laid down, and withdraws, leaving you
soaked and breathing and in possession of the only survey of the
last water ever conducted from INSIDE it:

there is something underneath. It is careful, and it is patient,
and it has been waiting ten thousand years to be trusted with
weight.

But the moment has passed. The verse is half-sung, the current
half-turned; the Overtide is ON the harbor now, and the assembly
does what assemblies do when the perfect settles out of reach —
it reaches for the POSSIBLE, all its voices at once, keeper and
kept and clerk and Tenant roaring out a compromise over the
rising water while you cough the Open out of your lungs.

# You showed them the difference between lost and let go with
your own opened hand. They saw. It is enough — it will have to
be enough — and the Grey Roads settle for the port the only way
anything was ever going to be settled on this water: TOGETHER,
loudly, at the last possible tide.`,
      choices: [
        { text: "Stand up, soaked and witnessed, while the afterward votes " +
                "itself into a port around you.",
          fx: { xp: 20 }, goto: "c3_end_port" },
      ],
    },
  };

  HC.registerScenes("ch3", SCENES);
})(globalThis.HC);
