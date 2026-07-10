/* Chapter 3 endings: nine settlements of the Grey Roads, the chapter's own
   grave, and the dynamic epilogue. This is the last chapter of the tale;
   the c3_final_* flags are kept for the record — the save remembers how
   the story ended, and nothing further reads them. */
(function (HC) {
  "use strict";

  const SCENES = {

    "death": {
      text: `The Roads have a form for it. Of course they do; the Roads have a
form for everything, and every form is kind.

The water takes you the way this water takes everything — gently,
completely, with tea already steeping somewhere above — and the
last thing you feel is not the cold, and it is not the pull.

It is the SPLICE: six strands, one of them nothing you can look
at, closing around what you were with the tenderness of ten
thousand years of practice. Somewhere in a lamplit office a
pigeonhole receives a new coiled line. The tag is written in a
fine tarred hand. The light is trimmed within the watch, and will
be trimmed every watch, forever, and nothing that held shall be
lost — and no one, ever again, will ask you a single thing.

# Welcome to the Roads. You were expected. Everyone is,
eventually. The Moorage thanks you. All berths are kept.`,
      on_enter: { flags: { final_death: true } },
      ending: "A Berth of Your Own",
      choices: [],
    },

    "c3_end_outgoing": {
      text: `You sing the last verse into the gap, and the gap remembers what
it is.

The verse is very short. Most true things are. It does not command
the water and it does not unlock the water, because it was never a
key: it is PERMISSION, the water's own, and as it goes out across
the Open the horizon takes it the way ground takes rain after
drought. And you raise the torn stub over your head where the
whole afterward can see it, and you read the charter of the Roads
ENTIRE, both pages, ten thousand years late:

'NOTHING THAT HELD SHALL BE LOST — AND THEN LET GO.'

The Moorwife opens her harbor with her own hands. That is the part
the tellings will get wrong forever, and the part you will insist
on to your last breath: not defeated, not overruled — RELIEVED.
She walks to the gap and unbends the first splice herself, and
shows her wardens the working, and the keeping-lines of the Grey
Roads let go all down the fleet like a held breath released, rank
after rank after rank.

The Great Outgoing takes a full turning of the tide. The lullaby
goes out singing itself, three rafts abreast. The lintel-god
pauses in the gap to recite, verbatim, the promise — and finding
it honored at last, goes on. The Weir raft goes out ablaze with
every light, Nan waving from the Breakwater like a whole harvest
festival compressed into one woman. And the water underneath —
the careful, patient, ten-thousand-years-untrusted water — takes
every keel like a palm taking a coin, and carries them out under
no light at all, to the rest at the end of the music.

The white ship goes last but one. You sing the verse once, alone,
for the singer — four thousand years of holding, four hundred
days of waiting, one send-off, WITNESSED — and the salt figure at
the rail holds up one hand as the Open takes her: not farewell.
The other gesture. The one that means: ENOUGH. IT WAS ALWAYS
ENOUGH.

# And the last keel out is the first that ever came in — the
Oldest Tenant, surveying the water a second time with its chain
left coiled on the quay — and from far out on the Open, where
nothing has ever reported back, there comes back one long low
note. The Tenth Song, answered. The Roads keep the gate open
after, for the traffic. There is TRAFFIC. It sounds, the moored
say, like a harbor breathing.`,
      on_enter: { flags: { c3_final_outgoing: true } },
      ending: "The Great Outgoing",
      choices: [],
    },

    "c3_end_keeper": {
      text: `'The ruling was never wrong,' you tell the Moorwife, at the gap,
in front of everything. 'The ruling was HALF. Somebody has to
keep this harbor — and somebody has to keep it the way the
charter actually reads. Ten thousand years is enough of the
first half. Rest, keeper. I relieve you.'

And you take the post.

You splice yourself to the gap with her own six-strand splice —
she teaches you the sixth strand herself, weeping, which is how
you learn the sixth strand IS the weeping; it always was — and
you take up the keeping of the Grey Roads with the one amendment
that changes everything and costs nothing:

the gate stands OPEN.

Nothing is sent out. Nothing is kept in. Every berth is tended,
every light is trimmed, every arrival is received with tea — and
every soul at every mooring is asked, every tide, the question
the Roads never had a form for: STAY OR GO? Some go at once. Some
go in a season. Some, to the lasting joy of your ledger, stay —
the Roads keep a whole society of the contentedly moored — but
they stay the way the living stay anywhere: because the door is
open, and they know it, and staying MEANS something at last.

The Moorwife takes a berth of her own, the first rest of her
tenure, and is visited, and pours tea for HER visitors now.
The white ship goes out in the first season, sung to — you sing
the verse yourself, from the gap, the new keeper's first
send-off — and the Open answers with its one long low note, and
after that no soul on the Roads doubts the water again.

# In time the worlds above learn what stands at the far end of
the long water now: a keeper who holds the door, not the guests.
The tellings differ on your name. The moored correct them,
patiently, forever: THE DOOR-WIFE. THE OPEN-HANDED. THE ONE WHO
ASKS.`,
      on_enter: { flags: { c3_final_keeper: true } },
      ending: "The Open Door",
      choices: [],
    },

    "c3_end_tenant": {
      text: `'The first keel out,' you say, 'is the first keel that ever came
in. Walk your survey again, Tenant. Witnessed, this time.'

And the Oldest Tenant — the first thing that ever finished, the
eater of endings, the oldest coward in creation, by its own sworn
deposition — turns its bow, ten thousand years slow, toward the
gap it wept at in the first age.

You walk at the rail. That was the promise: not towed, not sent —
ACCOMPANIED, the way it never was the first time, with the whole
afterward assembled to watch and the Moorwife standing at the gap
holding the harbor's breath in both broad hands.

At the lip, it stops. The whole Open lies ahead, lit like the
hour before a lamp is needed, and the Tenant looks — the second
glance, ten millennia after the first — and the shudder that
runs its whole vast keel is the fear of every held thing that
ever chose the blanket over the door.

'Live one,' it says, very low. 'What if I was right?'

'Then you'll be right WITNESSED,' you say. 'Go and see.'

It goes. And the water underneath — careful, patient, asked at
last — takes the first and heaviest keel in the history of
finishing the way a palm takes a coin, and carries it out, and
the Tenant's last word comes back across the still water in a
voice you have never heard it use, the harbor-settling all gone
out of it, light as a boy's:

'THERE IS SOMETHING UNDERNEATH. OH. OH. THERE WAS ALWAYS—'

— and the horizon takes it, gently, mid-sentence, the way the
page was torn: except this sentence ENDS, somewhere out past all
reporting, and everyone on the Breakwater hears the end of it in
their own way, and no two accounts will ever agree, and every
account agrees it ended WELL.

The Outgoing follows all that tide — the queue unwinding through
the gap behind its ancient pathfinder, the white ship out among
the first and sung to as promised. The Moorwife keeps the gate
after: open, tested, VERIFIED.

# On the charter's mended page, below the old hand, a new line in
tarred ink, entered by the keeper herself: SURVEY AMENDED. THERE
IS SOMETHING UNDERNEATH. — FIRST WITNESS, THE OLDEST TENANT, who
went and saw.`,
      on_enter: { flags: { c3_final_tenant: true } },
      ending: "The First to Rest",
      choices: [],
    },

    "c3_end_ledger": {
      text: `'The trouble was never keeping,' you tell the assembly, over the
rising water. 'The trouble was keeping WITHOUT TERMS. There is an
office that has drafted terms for four thousand years, and its
first clause is the one this harbor forgot: everything concludes.
Clerk! Open the desk. The Roads are going onto PAPER.'

The clerk of the black desk rises to the founding hour of a
lifetime. The Moorwife, presented with the one thing her ruling
never had — a SCHEDULE — negotiates like the keeper she is, and
signs like the keeper she is, and the instrument that emerges by
the tide's turn, witnessed by everything that ever finished, is
read aloud from the Breakwater:

THE CONVEYANCE OF THE ROADS. Receipt, berth, and keeping as
before — nothing that held shall be lost — AND a release
schedule, executed to the letter: every mooring reviewed each
season, every soul's rest calendared at its OWN election, every
going-out drawn, signed, sung, and DELIVERED, punctually,
forever. The refused instruments of ten thousand years go
through in the first month — the office clears the backlog the
way the office does everything, with terrifying relish — and
the white ship's discharge is delivered FIRST, by your own
hand, at the front of everything.

It is not the singing harbor the rafts dreamed. It is better
than the wall it replaces, by exactly the measure a term is
better than a forever. The moored grumble at the forms. The
moored FILL OUT the forms. The gate opens on schedule, every
slack, and never once fails to.

# Far up the Long Water, a woman in wool receives the quarterly
returns of the newest branch office in existence, and pauses
over one line — REGION: THE AFTERWARD; STATUS: SOLVENT; ACCOUNTS
IN ARREARS: NONE — and those who know her best would translate
her expression precisely: the ledger is the only thing that ever
remembers the ones who chose smallest-loss. I would know. Well
done, auditor. WELL DONE.`,
      on_enter: { flags: { c3_final_ledger: true } },
      ending: "The Closed Accounts",
      choices: [],
    },

    "c3_end_port": {
      text: `'Nobody rules this,' you say. 'Not the keeper, not the office,
not me. Every mooring got held without being asked — so ASK
THEM. All of them. Every berth its own vote, every tide,
forever. STAY OR GO.'

The Roads take to self-government the way the coast that raised
you takes to everything: loudly, immediately, and with committees.

The First Muster of the Moored convenes on the Breakwater itself,
in the teeth of the Overtide, and votes its founding motion by
acclamation before the water can crest: THE GAP STANDS OPEN. ALL
GOINGS-OUT ARE FREE. ALL STAYINGS ARE FREE. THE KEEPING CONTINUES
FOR ALL WHO ASK IT — AND ONLY FOR THEM. The Moorwife, offered
exile by the angriest rafts, is instead elected HARBORMASTER by
the rest on a platform of nobody-splices-like-she-does, which
even the angriest rafts concede. Her wardens learn to ask. It
takes practice. The lintel-god volunteers as invigilator,
remembering, verbatim, being the entire job.

The Outgoing happens anyway — that is the thing about doors; most
of the queue was only ever waiting for one — but it happens by
CHOICE, raft by raft, tide by tide, each going-out sung by
whoever stays. The white ship goes in the first sitting, her
discharge moved and carried unanimously, the second unanimous
vote in the history of held things. You sing her out yourself.

And the Roads that remain become what no afterward has ever been:
a PORT. Ships in, ships out, a market, a muster, tea. Traffic
between the worlds and their rest, in both directions, with
schedules and arguments and a standing session where any berth
may read the terms of its keeping, and object.

# The first item of every muster, by your motion, carried
unanimous — the third unanimous vote, and the last, and the one
they open every tide with forever: 'Holding is attention. Rest
is the hand, opening. The port keeps BOTH. Muster open.'`,
      on_enter: { flags: { c3_final_port: true } },
      ending: "The Port of Call",
      choices: [],
    },

    "c3_end_cut": {
      text: `The Knot-Knife was made for cutting what should not hold, and you
have never in two worlds seen anything hold like this.

You cut.

Not the moorings — the KEEPING. The six-strand splices, the sixth
strand, the one you cannot look at: the blade of whale-bone and
salt-iron parts it wherever it runs, and it runs EVERYWHERE, one
strand through ten thousand years of berths, and the cut sounds
across the whole harbor like a bell made of scissors, once, and
then the Grey Roads are simply — loose.

All of it. At the crest of the Overtide.

What follows is not the Outgoing, and no telling will ever call
it that. It is a SPRING TIDE OF THE FINISHED: ten thousand years
of the kept, cut free in one stroke into the biggest water in
the history of anything, some streaming for the gap, some
clinging to their berths out of pure uncommanded love, some
simply going UP, riding the Overtide back toward the worlds like
salmon remembering a river. The lullaby is last seen heading for
a world that lost its lullabies. The lintel-god goes out the gap
reciting. The Weir raft rides the flood ALL THE WAY HOME, to
what remains of a fell in a drowned valley, where the water,
they will say for centuries after, suddenly one morning tasted
sweet.

The white ship goes out under her own way at last, unkept,
unsung — you shout the verse after her across the chaos and the
wind takes half of it, and you will wonder forever which half
she heard.

The Moorwife stands amid her unraveling harbor with the cut ends
in her hands, and does not rage. She watches everything she
never lost scatter into everything there is, and she says,
mostly to the water: 'Ten thousand years. Not one lost.' A
pause. 'And not one ever ASKED, and this is what asking looks
like when it finally comes due all at once. Note it in
somebody's book: the bill for unasked questions COMPOUNDS.'

# The Roads after are a crossroads with no keeper: gates open,
berths free, traffic wild in both directions, everything finished
and unfinished mingling on the one water. The tellings will
argue forever whether you freed the afterward or broke it. The
tellings argued the same about a coast, once. You notice you are
not worried. Loose things, you have found, hold each other.`,
      on_enter: { flags: { c3_final_cut: true } },
      ending: "The Slipped Fleet",
      choices: [],
    },

    "c3_end_debts": {
      text: `'Merchant,' you say, over the rising water, 'the certified copy.
Your counter. NOW.'

And the Pale Merchant, who has waited three worlds for a customer
to say exactly that, produces from beneath the stall a document
case of pale wood, unhurried as a man for whom tides queue, and
lays the charter's second page — certified, sealed, RUINOUSLY
acquired — face-up on the counter where the whole afterward can
read it. The release. The lock-hours. The going-out, drawn in
full, in the oldest hand there is.

'The price,' he says, to you alone, 'as quoted: something of
yours that is finished. Paid at the counter, at the moment, in
view of the whole Roads.'

And you understand, at last, at the end of the third coast, what
he has been annotating all along — and you give him the only
finished thing you have carried through every world since a
burned village at the start of everything:

the WANDERING. The road itself. The being always the one who
arrives at the ends of things owning nothing but the road in —
you set it on the counter, whole, concluded, and it has WEIGHT,
and the whole assembly watches him weigh it, and the early smile
arrives exactly on time.

'PAID IN FULL,' says the Pale Merchant, and closes your account
across two creations with one annotation, and turns the sign on
his counter around so it faces the Moorwife, the wardens, the
gate, and ten thousand years of the kept:

ALL DEBTS HONORED.

The page goes to the charter. The charter, mended, does the rest
— the Moorage honors its own instrument to the letter, because
honoring instruments is the entire institution — and the gate
opens on the authority of plain contract, and the Outgoing runs
all tide, sung and scheduled both, while the Merchant does the
briskest trade of his tenure in departures, arrivals, and
commemorative tokens.

# You watch from the counter's end — no longer the wanderer;
that's been paid — as the white ship goes out sung to and the
harbor learns to breathe. 'You will want employment,' the
Merchant observes, not looking up from the ledger. 'The
position of PARTNER is, as of this tide, vacant. It has been
vacant across the tenure of several worlds, colleague. I am
DELIGHTED to say it shows.'`,
      on_enter: { flags: { c3_final_debts: true } },
      ending: "All Debts Honored",
      choices: [],
    },

    "c3_end_well": {
      text: `'The keeping doesn't end,' you say. 'It changes HANDS. Keeper —
you've held ten thousand years and never once been relieved.
I've brought your relief. She has references: nine hundred
years, one well, and every bucket that shouldn't come up empty
DIDN'T.'

Nan Weir looks at you like you have finally, after all the
pulling, lost your grip entirely. Then she looks at the harbor —
the ranked lights, the straining lines, the gap, the water — and
you watch nine hundred years of unemployment end in one long
breath.

'A WELL,' she says, slowly, seeing it. 'Not a wall. A well. You
don't KEEP a well shut, you keep it SWEET — you tend it so that
everyone can draw and go, and coming back is what they do
because the water's good.' She rolls up her sleeves, both of
them, which on Nan Weir is a coronation. 'RIGHT. Wardens! New
rules. Everything gets asked. Everything gets TENDED. The gate
stands open, the tea stays hot, and the first raft that wants
out goes out SUNG, and anyone who'd rather stay gets their light
trimmed same as ever, and NOBODY — ' the bucket comes down on
the Breakwater stone like a judge's gavel — 'nobody gets FILED
again. Ever. On my well.'

The Moorwife surrenders her splice to the only person on any
water she can believe will actually maintain it. The two of them
disappear into the Moorage for a full turning of the tide and
emerge having re-spliced the entire keeping, six strands become
seven — the seventh being, as near as anyone can tell, ASKING.

The Outgoing runs for a season, sung out raft by raft, the white
ship among the first — Nan waves her out from the Breakwater
exactly as she promised, like a whole festival compressed into
one woman. And the Roads that remain become the Well at the end
of the water: the place the finished come to rest a while, drink
something hot, be asked what they want, and GO — out, or back,
or nowhere just yet, thanks, the water's good.

# Her first act as keeper is carved over the gate, in cord-script
and common, where the charter's fragment used to hang alone:
NOTHING THAT HELD SHALL BE LOST — AND THEN LET GO — AND THE
KETTLE'S ON, LOVES, WHICHEVER YOU CHOOSE.`,
      on_enter: { flags: { c3_final_well: true } },
      ending: "The Well at the End",
      choices: [],
    },

    "c3_end_return": {
      text: `'Look UP the water,' you tell the assembly, as the Overtide
crests. 'The worlds are losing their holders. Old sureties
failing, anchors slipping, wells gone luckless, whole marshes
holding themselves — I've walked two coasts of it. And look at
THIS harbor: ten thousand years of the finest holders that ever
held, rested to the point of MUTINY. You want to know the
difference between lost and let go, keeper? Watch what a rested
holder does when you open the door and there's WORK on the other
side.'

The Returning Tide, the tellings will call it, and for once the
tellings will be exactly right.

They go back UP. Not all — the truly done go out the gap, sung,
the white ship among the first — but raft after raft after raft
of the merely FINISHED, the rested, the bored, the never-asked,
riding the Overtide's ebb back toward the worlds like a harvest
going home: retired fords resuming their crossings, spent
hearth-lucks re-lighting in cold houses, the lullaby returning
to a world that had lost its lullabies, the lintel-god taking up
a lintel in a town that will never know its luck and never once
lose a door. The Weir raft goes home to its drowned valley, and
the water there, they will say for centuries, suddenly one
morning tasted sweet.

The Moorwife keeps the Roads that remain — but as a HIRING HALL
now, a harbor of holders between holdings: rest for the spent,
work for the rested, the gate open at both ends and the Long
Water carrying traffic BOTH WAYS for the first time since the
charter was young. Her ledger's first new column in ten thousand
years is headed, in her own tarred hand: REDEPLOYED.

# And up all the waters of all the worlds, in failing marshes
and slipping harbors and houses gone cold, the old holders come
quietly back to work, and the worlds — which had begun, without
knowing it, to come apart — hold. The bill for it is nothing.
The price, as ever, is each other, and it turns out the
afterward was FULL of each other, all along, waiting to be
asked.`,
      on_enter: { flags: { c3_final_return: true } },
      ending: "The Returning Tide",
      choices: [],
    },
  };

  // ------------------------------------------------------------- epilogue
  function epilogue(state) {
    const s = state;
    const parts = [];

    // the oldest tenant (skipped where its own ending told the tale)
    if (!s.flag("c3_final_tenant")) {
      if (s.flag("c3_tenant_eased")) {
        parts.push(
          "At the harbor's root, Berth One rides empty of its dread. The " +
          "Oldest Tenant keeps a new office, self-appointed: greeter of " +
          "nervous arrivals, teller of the one story that cures the gate — " +
          "'I looked once and was wrong for ten thousand years; go and " +
          "SEE.' The chain it tied itself stays coiled on the quay, kept " +
          "as the Roads keep everything now: as a lesson, not a fixture.");
      } else if (s.flag("c3_tenant_heard")) {
        parts.push(
          "The Oldest Tenant posts its accounts at Berth One where any " +
          "raft may audit them, ten thousand years of arithmetic with one " +
          "figure finally corrected in a new hand. Under NOTHING " +
          "UNDERNEATH, struck through, it reads: UNVERIFIED CLAIM, " +
          "WITHDRAWN. The moored say balancing it aloud each tide is the " +
          "closest thing to prayer the harbor ever invented.");
      } else if (s.flag("c3_tenant_fought")) {
        parts.push(
          "Berth One lies quiet. The Oldest Tenant, its dread beaten out " +
          "of it by a live one's hand, waits at its own chain for whatever " +
          "the new Roads decide about the oldest berth — patient, honest, " +
          "and unarmored for the first time in ten thousand years. " +
          "Visitors report it has taken up asking arrivals a single " +
          "question: 'What did YOU see, coming down?'");
      }
    }

    // nan weir
    if (!s.flag("c3_final_well") && s.companions.nan &&
        s.companions.nan.met) {
      if (s.flag("c3_nan_answered")) {
        parts.push(
          "Nan Weir keeps her word and her bucket both. Wherever the " +
          "settlement left the Weir raft — gone out sung, or home to the " +
          "sweet water — she saw them off standing on the Breakwater, " +
          "waving like a festival, and afterward she was heard to remark " +
          "that the bucket felt lighter. She has not put it down. Nobody " +
          "who knows her expects her to. It is, she explains, for " +
          "CARRYING things, not for holding them.");
      } else {
        parts.push(
          "Nan Weir is still working. Whatever became of the Roads, " +
          "somewhere on them a broad grey-wired woman is pulling on " +
          "something that was told it could not move, for the record, " +
          "witnessed, attempt number three hundred and something. The " +
          "wardens — whoever the wardens answer to now — have standing " +
          "orders to write it down.");
      }
    }

    // cobb
    if (s.flag("c3_cobb_answered")) {
      parts.push(
        "Cobb made his last run on the long water and reported back up " +
        "his own wake to the bell-reef, four hundred years late and " +
        "exactly on time. The Drowned Watch logged his return without " +
        "comment, the sou'wester came off its post, and the cracked bell " +
        "rang the change of watch twice that night — once for the hour, " +
        "and once, old-timers swear, for the OAR. The Eventually plies " +
        "the long water still, under new hands, with his fares' words " +
        "stowed safe behind a living set of eyes.");
    } else if (s.flag("c3_cobb_rested")) {
      parts.push(
        "Cobb decided at the gap, the way he said he would. Those who " +
        "were there tell it simply: he rowed his last fare out onto the " +
        "Open, shipped his oar, looked a long while at the water that " +
        "was finally allowed to carry him — and turned the Eventually " +
        "around, and rowed home grinning, because a man's allowed, and " +
        "KNOWING you're allowed, it turns out, was the whole rest he " +
        "needed. The skiff's name, he maintains, has never fit better.");
    }

    // the white ship (skipped where an ending already sang her out)
    if (!s.flag("c3_final_outgoing") && !s.flag("c3_final_keeper") &&
        !s.flag("c3_final_tenant")) {
      if (s.flag("c3_verse_given")) {
        parts.push(
          "And the white ship went out, when her turn came, sung to — " +
          "the last verse, plainly, as taught, from whatever shore of " +
          "the settlement you kept your promise on. The Open answered " +
          "with one long low note, tide over shingle, worn kind: the " +
          "Tenth Song, complete after four thousand years. Everyone who " +
          "heard it agrees on only one thing: it was very short. Most " +
          "true things are.");
      } else if (s.flag("c3_white_promise")) {
        parts.push(
          "The white ship waits no longer. Whatever the settlement made " +
          "of the Roads, her berth stands empty now, her line unbent by " +
          "the keeper's own hands — and somewhere out past all " +
          "reporting, a holder four thousand years owed is finally, " +
          "finally OFF HER FEET. The going of her, fishermen of the " +
          "Long Water say, was a tide all its own. They would know. " +
          "They have said it before.");
      }
    }

    // your own paper
    if (s.flag("c3_lien_voided")) {
      parts.push(
        "Word travels back up the waters, as word does, of the wanderer " +
        "who voided one of the Lady's own instruments on a definitions " +
        "clause. The office has issued no comment. The office HAS, " +
        "clerks report, quietly amended its standard form to define " +
        "'season' in eleven jurisdictions, including 'waters without " +
        "years' — which is, from the office, a twenty-one-gun salute.");
    } else if (s.flag("c3_name_moored")) {
      parts.push(
        "Somewhere on the Roads, at the smallest berth in the harbor, " +
        "your name rides out its season — light trimmed, line tended, " +
        "tag written in a fine tarred hand. You will get it back when " +
        "the term runs. The clerk has promised to forward anything it " +
        "learns while moored, and you have not yet decided whether that " +
        "was a joke. On this water, very little is.");
    }

    // the token
    if (s.flag("c3_sold_token")) {
      parts.push(
        "Your berth token sits in the Pale Merchant's collection between " +
        "a folded map of a drowned kingdom and a jar labeled WEATHER, " +
        "FORMER. A prepaid berth on the Grey Roads, surrendered by its " +
        "holder: 'the single most optimistic object in my inventory,' " +
        "he tells browsers, and declines every offer.");
    }

    // the rafts
    if (s.flag("c3_funded_rafts")) {
      parts.push(
        "The rafts you quietly re-lined and provisioned were the first " +
        "under way when the harbor's fate settled — whichever way it " +
        "settled. The stallholder never told them where the stores came " +
        "from, as instructed, so the wrack-row invented a benefactor " +
        "and, lacking facts, made it a story: the Live One's Lines, they " +
        "call good rope now, down at the bottom of everything.");
    }

    // the merchant gets the last word; he always gets the last word
    parts.push(
      s.flag("c3_final_debts")
        ? "And at the deep end of whatever market the Roads keep now, a " +
          "high narrow stall of pale wood stands OPEN for the first " +
          "morning of a new arrangement. The Pale Merchant consults his " +
          "ledger out of pure ceremony — your account is closed, " +
          "balanced, annotated in a hand too fine to read with the only " +
          "word the file was ever building toward — and turns instead " +
          "to a fresh page, at the top of which he has written, in his " +
          "finest hand: PARTNERSHIP, VOLUME ONE. Something is always " +
          "coming due somewhere, and business, he will tell anyone who " +
          "asks, has honestly never been better."
        : "And on a grey morning tide, before the harbor's lamps are " +
          "properly trimmed, a high narrow stall of pale wood stands " +
          "folded at the edge of the settled Roads, packed for the " +
          "road. The Pale Merchant consults his ledger a last time and " +
          "finds your account — a burned village, a drowned coast, the " +
          "bottom of the afterward, every arrival annotated in a hand " +
          "too fine to read — and he rules it off, both pages, and " +
          "enters under the rule the one word the file was building " +
          "toward across three worlds: CONCLUDED. Balanced. CLOSED. No " +
          "further entries. He inclines his head over the page, which " +
          "from him is a state funeral, and the early smile arrives " +
          "exactly on time, and for once it is not early at all. Then " +
          "the stall goes up the Long Water without you — something is " +
          "always coming due somewhere, and business, he will tell " +
          "anyone who asks, has honestly never been better — but not, " +
          "colleague, from you. Never again from you. Yours was, the " +
          "annotation does not say but the ruling-off does, a pleasure " +
          "to keep.");

    return parts.join("\n\n");
  }

  HC.registerScenes("ch3", SCENES);
  HC.story.c3_epilogue = epilogue;
})(globalThis.HC);
