/* Chapter 2 openings: nine roads to the Unwoven Shore, one per Chapter 1
   ending. Each is a playable sequence that establishes the world your choice
   made, then walks you to the gates of Saltmere, where the chapter proper
   begins. Each opening carries the pack entry markers (entry_from / ws /
   preset); the ws flag (set by the bridge when the chapter starts) is
   already in place when these scenes run. */
(function (HC) {
  "use strict";

  const { has, hasnt } = HC.helpers;

  const SCENES = {

    // ================================================== THE CHAINED GOD (vael)
    "c2_open_chained": {
      entry_from: "end_chained_god",
      ws: "vael",
      preset: { karma: 25, flags: { final_reforged: true } },
      text: (s) => `One year since the Wound closed. One year since you put the Crown back
on the brow of a being who had begged three thousand years to set it
down, and the world — the whole, green, rescued world — called it a
miracle and never once asked the price.

The rivers remember their directions. The Hollowed came home to their
names. In Ashfen they are rebuilding the chapel with its own old
stones, and the harvests come in so heavy the carts complain, and
everywhere you walk, ${s.player.name}, you hear the sound you made
possible and cannot stand to listen to:

# Prayer. Answered prayer. The creak of the loom, working.

You alone know what looks out from behind it. You alone saw the last
breath of him that was still a PERSON go under the closing light,
watching you — the one who decided. The chapels will never print the
word for what you are. You have stopped trying to find it yourself.`,
      choices: [
        { text: "Go to the dusk service anyway. You always go. That is the " +
                "penance you invented for yourself.",
          fx: { xp: 10 }, goto: "c2_chained_chapel" },
        { text: "Walk past the chapel, out to the night road, where you can " +
                "hear yourself think.",
          fx: { xp: 10, karma: -2 }, goto: "c2_chained_thread" },
      ],
    },

    "c2_chained_chapel": {
      text: `You stand at the back, where the lamplight gives out. The congregation
sings the Shepherd home — the new verse, the one about the mending —
and an old man beside you weeps with gratitude into his hat, and you
hold the hymnal and do not sing, because you know who is listening
and you know that he cannot answer and you know that he cannot stop
listening, either. All of him is loom now. Every prayer in the world
lands on him like weather on a man staked out under the sky.

The priest raises his arms for the blessing. And the lamps —

The lamps lean.

Every flame in the chapel bends, gently, all together, toward the
west door. The way candles lean toward a draft. Except there is no
draft, and they hold there, burning sideways, patient, while the
congregation murmurs miracle and the priest invents an explanation
with admirable speed.

# You are the only one who reads it for what it is. He has no voice
left. He has weather. And he is POINTING.`,
      choices: [
        { text: "Follow where the flames lean. Tonight. Before you can talk " +
                "yourself out of owing him.",
          fx: { xp: 15, flags: { c2_god_called: true } },
          goto: "c2_chained_thread" },
        { text: "Ask the priesthood first — quietly. If the god gestures, the " +
                "chapels keep records of it.",
          fx: { xp: 10 }, goto: "c2_chained_priests" },
      ],
    },

    "c2_chained_priests": {
      text: `The Provost of the rebuilt temple receives you at midnight, because
your name — whatever the chapels do or don't print — opens doors at
any hour. You ask about the west. About flames that lean.

He goes grey around the mouth and brings out a map.

'Every chapel from here to the coast,' he says. 'Same hour, same
night, for a month. Lamps pointing west like compass needles. We sent
two missions to see what the Shepherd wants seen.' His finger stops
at the western hem of the map, where the cartographer's green ink
simply ends — not at sea, at NOTHING, at a margin the mapmakers of
three thousand years never filled in. 'The first mission reports the
land out there isn't mended. Never was broken, they say. Never was
WOVEN. The Crown's light stops like a tide-line, and past it there's
a coast that belongs to — we don't know what it belongs to. That's
the trouble.' He looks up. 'The second mission didn't report.'

# At the bottom of the map, in old ink, the margin has a name:
THE UNWOVEN SHORE.`,
      choices: [
        { text: "'The god doesn't point for nothing. I'll go.' Take the road " +
                "west as his answer-bearer.",
          fx: { xp: 15, flags: { c2_provost_blessing: true } },
          goto: "c2_chained_hem" },
      ],
    },

    "c2_chained_thread": {
      text: `Out past the last fence, where the night is honest, you stop and let
yourself feel it: the faint, constant attention of the sky. It used
to terrify you. Now it is almost company.

'All right,' you say out loud, to the dark, to him. 'Show me.'

And the grey road under your feet — the road he weaves, like he
weaves everything — gathers its dust into a line. A single thread of
paleness, thin as a hair, running west along the ground as far as
your eye holds. Not commanding. He would never command you, of all
people. OFFERING. The way he offered you his company at the bottom
of the world, when company was all he had left to give.

You walk it for nine days. The thread runs through harvest country,
through towns that ring their bells at dusk, through everything you
saved — and then, on the morning of the tenth day, it stops.

Not the road. The WORLD. The green ends at a line drawn straight as
a ruled margin: on this side, wheat; on that side, salt-grass going
silver under a sky the Crown's light visibly does not enter. The
thread frays at the line into nothing, like a sentence the writer
couldn't finish.

# Whatever is out there, the loom cannot follow you in.`,
      choices: [
        { text: "Step across the line.",
          fx: { xp: 15 }, goto: "c2_chained_hem" },
      ],
    },

    "c2_chained_hem": {
      text: `Crossing the line is like stepping out of a warm room. Nothing
dramatic — the wind keeps blowing, the gulls keep complaining — but a
pressure you have carried for a year, the gentle constant weight of
being WATCHED OVER, lifts so suddenly you stumble.

He cannot see you here. Nothing can. For the first time since the
Wound closed you are nobody's thread, and the relief of it is so
enormous, so shameful, that you stand on the salt-grass with your
eyes shut, breathing, until a voice says:

'First time across the Hem. Takes everyone that way. The woven ones,
anyhow.'

She is lean and weathered, sixty if a day, sitting on a boundary
stone with a boat-hook across her knees as if coasts came with
doorkeepers. Her eyes are the color of low tide. 'I'm called Bray.
I watch the line. You'll be the one the lamps have been pointing at.'
She looks you over without hurry. 'Your big quiet friend in the sky's
been knocking on our shore for a month. Couldn't come in. Couldn't
say why. So the knots sent me to wait for whatever he'd send instead,
and here you are — woven to the teeth and reeking of miracle.'

She stands, joints cracking. 'Walk with me to Saltmere, miracle.
Something old is coming loose under our water, and your god knows it,
and he can't reach it, and I'd say that's why you exist.'

# 'Welcome to the shore the loom forgot.'`,
      on_enter: { flags: { c2_met_bray: true } },
      choices: [
        { text: "Walk with her. The road to Saltmere, and the chapter the god " +
                "cannot read.",
          fx: { xp: 20 }, goto: "c2_saltmere_gate" },
      ],
    },

    // ============================================ THE SHEPHERD WHO VISITS (you_dawn)
    "c2_open_dawn": {
      entry_from: "end_new_shepherd",
      ws: "you_dawn",
      preset: {
        karma: 45,
        stats: { might: 3, wits: 3, spirit: 3 },
        flags: { final_claimed: true },
      },
      text: (s) => `Holding the world is like holding water: it is not heavy, it is
EVERYWHERE. A year into the watch and you have stopped translating
the sensations into mortal terms — the harvests are a warmth along
what used to be your arms, the births arrive like sparks against what
used to be your skin, and the dying, the endless gentle dying, you
catch and carry the way you once carried lanterns and strangers and
other people's odds: one at a time, all the time, witnessed.

They paint you serene in the chapels. The honest painters get the
eyes right. The dead sit up with you in shifts, as agreed; the
Hollowed, risen and named, keep the watch beside you and call you
${s.player.name} still, which you treasure beyond any psalm.

And then, on an ordinary evening of the world, you reach for a thread
and find a HOLE.

West, at the world's hem: a coastline your loom does not enter. Not
torn — torn you could mend. UNWOVEN. Blank since before the loom was
strung, and you never noticed, because the Crown itself was taught
not to look there. But something under that blank water is waking,
and as it turns over in its sleep the silence is SPREADING — threads
at the edge going slack, one by one, like a hem unpicking.

# You are the god of everything. And there is a place in your world
where you are nothing at all.`,
      choices: [
        { text: "Call the witnesses. You instituted them for exactly this: " +
                "decisions too large for one set of hands.",
          fx: { xp: 15 }, goto: "c2_dawn_witnesses" },
      ],
    },

    "c2_dawn_witnesses": {
      text: `They gather at the loom's rim: the dead in their patient rows, the
risen Hollowed, the handful of saints you never asked to be saints.
You show them the hole. The silence spreads through them the way cold
spreads through a house.

It is one of the dead who says it — a small woman who fell at
Greyfield, who sits the third watch and misses bread: 'You can't
weave what was never woven. And you can't reach it from the chair.
Someone has to go DOWN, shepherd. On foot. The old way.'

'It has to be you,' says one of the risen, apologetic. 'It was always
going to be you. You're the only god there's ever been who knows how
to walk.'

The procedure does not exist; you invent it, the way you've invented
everything this year. The Crown stays. The witnesses hold the watch
in council — the dead do not tire, and the risen know the falling
from inside. You will spin yourself a body out of your own oldest
thread: the one that walked from Ashfen, the one the Crown was set
on. Mortal-shaped. Mortal-WEIGHTED. Killable, on a coast where
nothing of yours can catch you.

# 'Come back,' says the small dead woman, severely. 'We've gotten
used to the management.'`,
      choices: [
        { text: "Descend keeping every memory of heaven — the whole year of " +
                "holding, carried in a human skull. It will hurt. You want it.",
          fx: { xp: 15, flags: { c2_god_memory: true } },
          goto: "c2_dawn_descend" },
        { text: "Descend with the year folded away, to ache like a missing " +
                "tooth — mercy on the small skull, a debt of remembering for later.",
          fx: { xp: 15, flags: { c2_god_folded: true } },
          goto: "c2_dawn_descend" },
      ],
    },

    "c2_dawn_descend": {
      text: `Falling out of heaven is administrative. There should be fire, you
feel; there is mostly LOSS, itemized. The harvests go first — the
warmth along your arms just ends. Then the births. Then the great
chorus of the dying drops away mid-note, and you almost claw your way
back up at that, because who is CATCHING them —

— the witnesses are catching them. As agreed. Let go.

You land on your knees in salt-grass, in the rain, in a body. One
heart. Two hands. The wind goes through you instead of being held by
you. Somewhere above, infinitely far, you can feel the watch being
kept the way a sleeper feels a lit window in another house.

You stand up, and the world — this hem of it, this unwoven margin —
does not know you. The rain treats you like anyone. It is horrible.
It is unbelievable. It is, and you would never confess this to the
witnesses, the first rest you have had in a year.

# A god is walking to Saltmere in the rain, getting blisters,
grinning like an idiot.`,
      choices: [
        { text: "Walk the shore road to Saltmere's gate.",
          fx: { xp: 20 }, goto: "c2_dawn_shore" },
      ],
    },

    "c2_dawn_shore": {
      text: `On the shore road an old fisherman falls in step with you, because on
the Mourncoast company is assumed unless declined. He talks about the
weather. He talks about the catch. He talks — without lowering his
voice, without checking the sky — about how the moorings are slipping
all down the coast, how his cousin's skiff came back wrong, how
'something under the Ninth' has the knot-singers scared for the first
time in living memory.

He does not know you. He could not. You spent a year as the fact at
the center of every life on earth and this man is COMPLAINING TO YOU
ABOUT FISH, and no prayer in twelve months has moved you like it.

'You're for Saltmere?' he says at the fork. 'Mind yourself. Rook's
crows are buying up the brands, the Anchor under the harbor's
fraying, and the reeve's posted for hands that can hold a blade or a
rope.' He squints at you, friendly. 'You've got the look of someone
who can hold something.'

# You have no idea, you do not say.`,
      choices: [
        { text: "On to the gates of Saltmere.",
          fx: { xp: 10 }, goto: "c2_saltmere_gate" },
      ],
    },

    // ================================================== THE CROWN OF ASH (you_ash)
    "c2_open_ash": {
      entry_from: "end_tyrant",
      ws: "you_ash",
      preset: {
        karma: -55,
        stats: { might: 4, wits: 3, spirit: 1 },
        gold: 120,
        inventory: ["wyrmglass_dagger", "rook_mail", "elixir", "poultice"],
        companions: {
          serra:  { met: true, in_party: false, approval: -50, alive: true },
          vex:    { met: true, in_party: false, approval: -10, alive: true },
          maeve:  { met: true, in_party: false, approval: -35, alive: true },
          hollow: { met: true, in_party: false, approval: -45, alive: true },
        },
        flags: { final_claimed: true },
      },
      text: (s) => `The world is yours. This stopped being a metaphor a year ago.

The harvests come first to the loyal, as designed. The grey pools
instructively where it is permitted to pool. The Hollowed answer to
the names you issued them, and so does everything else: you hold the
threads of every life there is, ${s.player.name}, and you have
audited every one of them.

Except one line of the ledger. One margin, at the western hem, where
your accounting simply — stops. A coastline. Population: unrecorded.
Harvests: untaxed. Prayers: NONE, and not the sullen none of the
disobedient townships, which is itself a kind of attention. This is
the none of a room you are not in.

You did not climb out of the gutter of the world and up over the rim
of heaven to discover, twelve months into ownership, a province that
has never heard of you.

# Everything is yours. Therefore that is yours. It merely doesn't
know it yet.`,
      choices: [
        { text: "Send collectors. The coast can learn the way everywhere else " +
                "learned.",
          fx: { xp: 10 }, goto: "c2_ash_messenger" },
      ],
    },

    "c2_ash_messenger": {
      text: `You send a tithe-procession with banners. It returns in nine days —
which is wrong, the coast is twenty days' round trip — and the
collectors cannot say where they have been. Their wagons are full of
salt. Their ledgers are blank. One of them has forgotten his name,
which is impossible, because you HOLD his name, you can feel it right
there on its thread, and yet the man it belongs to looks through it
like a window.

You send saints next — the armored kind. The loom carries them west,
thread by thread, until the threads end, and then they are simply
GONE from your hands: still alive (you'd feel the snap), still
walking (presumably), but unheld, unwatched, off the books. Two
come back. They have been paid — actual coin, salt-stamped — to
deliver a message, and the message is this:

'The Lady of the Shore presents her compliments to the new
management. The coast's accounts are PRIOR. Collection may be
discussed in person, at her table, by appointment.'

# You own everything. And something with a table and appointments
considers your everything to be a late entry in HER books.`,
      choices: [
        { text: "Rage. Then go cold. Then go PERSONALLY — nothing else has " +
                "hands worth sending.",
          fx: { xp: 15, karma: -3 }, goto: "c2_ash_regency" },
        { text: "Go personally — but curious rather than cold. It has been a " +
                "year since anything surprised you.",
          fx: { xp: 15, flags: { c2_ash_curious: true } },
          goto: "c2_ash_regency" },
      ],
    },

    "c2_ash_regency": {
      text: `A descent requires a regency, and you trust no one, which is the
whole architecture of your reign. You spend a month building the
cage: the loom locked to your patterns, the harvests scheduled, the
bishops empowered to administer and incapable of deciding, every
thread pinned. The world will run on rails while you are down. You
have made very sure no one will ever be POSITIONED to receive what
you carry — and now you set it on its stand, unworn, for a span,
and the silence where the world's weight was nearly buckles you.

You spin the body from your oldest thread — the gutter thread, the
one that learned knives before letters. It fits like an old coat
found in a chest: tighter than memory, smelling of who you were.

Crossing the Hem is the first time in a year anything has happened
to you without permission. The coast's air walks straight through
your authority. The salt-grass does not kneel. Far down the shore a
fishing crew looks up at you — at the eyes that follow congregations
home, at the brow that wore the lid of the world —

— and one of them waves, neighborly, and goes back to the nets.

# You could be anyone. You have never in your life been anyone.`,
      choices: [
        { text: "Walk to Saltmere. The Lady of the Shore keeps a table; you " +
                "have an appointment to impose.",
          fx: { xp: 20 }, goto: "c2_saltmere_gate" },
      ],
    },

    // ================================================== THE UNEASY GOD (you_grey)
    "c2_open_grey": {
      entry_from: "end_uneasy_god",
      ws: "you_grey",
      preset: { karma: 0, flags: { final_claimed: true } },
      text: (s) => `'Watch the watcher,' the old woman prayed, to no one, to you, and you
made it a holy day because it was the only honest prayer you'd heard
from the chair. A year on, Watcher's Eve is kept in every township:
one night when the congregations face away from the chapels and ask
the dark to keep an eye on YOU, ${s.player.name}. The theologians
hate it. You fund the theologians too. Balance in all things; it's
on your coins.

It is on Watcher's Eve that you hear the prayer that ends your year.

A child's voice, from the western hem, where voices shouldn't carry
from at all: 'Watch the watcher,' it says, in the manner of a thing
repeated without comprehension, and then — off-script, small,
factual — 'the watcher can't see our shore. Grandmother says nobody
ever could. Grandmother says that's where the OLD watcher lives.'

You go very still at the center of the loom.

You hold every thread there is. You pull yourself west along them
now, attention racing the curve of the world — township, township,
harvest, coast — and there it is: the hem itself. A margin of
blankness you have never once looked at directly, because something
in the Crown's own weave GUIDES THE EYE PAST IT, smooth as a pick-
pocket's patter.

# Your inheritance has a blind spot. Built in. On purpose. And
something is alive in it.`,
      choices: [
        { text: "Probe it from the chair first. You did not take this crown to " +
                "go places personally.",
          fx: { xp: 10 }, goto: "c2_grey_blindspot" },
        { text: "You already know how this ends. Begin spinning the walking " +
                "body now.",
          fx: { xp: 10, flags: { c2_grey_decisive: true } },
          goto: "c2_grey_blindspot" },
      ],
    },

    "c2_grey_blindspot": {
      text: `You spend a season being clever from the chair, and the blind spot
defeats you with the politeness of a locked door.

Prayers from the coast: none arrive. Threads into the coast: they end
at the Hem like cut hair. You try to look at the margin sideways, in
the loom's own reflection, and you get one half-second glimpse — a
grey shore, nine points of old light drowned along it, something
ENORMOUS beneath the ninth turning over in its sleep — before the
weave slides your eye away so smoothly you lose a whole day believing
you'd never looked.

That frightens you properly. Not the something. The SMOOTHNESS. Vael
built this crown, or inherited it, and either way the blindness is
craftsmanship: your predecessor, or his predecessor, went to real
trouble to make sure the god of everything could not see THAT.

The honest answer, which you alone hold at the loom's center: you
could leave it alone. Gods before you clearly did. The world would
run; the hem would fray; it would be, like so much else, the next
age's problem.

# The old woman's prayer turns over in you. 'Watch the watcher.'
Someone built a place the watcher can't watch. Go and see WHY.`,
      choices: [
        { text: "Descend. Body, blisters, blind spot, and all.",
          fx: { xp: 15 }, goto: "c2_grey_descend" },
      ],
    },

    "c2_grey_descend": {
      text: `You leave the loom held the way you hold it — half-open, half-closed,
the schools of the next age can argue which — with the watch split
among the risen and the dead so that no single hand can close around
it while yours is gone. You trust no one entirely, including
yourself; ESPECIALLY yourself; the architecture of your reign is
checks.

The body you spin is the one that walked here: road-worn, scale-
handed, the body that took prices when taking was easy and held the
bridge when holding was hard. It remembers both. So do you.

You cross the Hem at dawn, and the blindness swallows you whole — and
INVERTS. From outside, it is the rest of the world that goes vague:
your loom, your bishops, your balances, all of it suddenly a story
told in another room. Here, everything is sharp-edged and unheld and
nobody's. Salt. Wind. A coast where the OLD watcher lives, where your
crown was built not to look, where you stand in a mortal body in the
one province of creation that has never owed you a prayer.

A signpost leans at the fork of the shore road. SALTMERE, it says,
and under that, in older, deeper-cut letters, in a tongue the scribe
in you needs a moment to place:

# ALL DEBTS HONORED.`,
      choices: [
        { text: "Walk in. Watch the watcher's blind spot from the inside.",
          fx: { xp: 20 }, goto: "c2_saltmere_gate" },
      ],
    },

    // ================================================== THE MORTAL AGE (mortal)
    "c2_open_mortal": {
      entry_from: "end_mortal_age",
      ws: "mortal",
      preset: {
        karma: 20,
        inventory: ["soldiers_blade", "leather_jerkin", "poultice", "poultice",
                    "bread", "bread"],
        flags: { final_destroyed: true },
      },
      text: (s) => `The age has no god and the sky has no lamps and the world, which can
no longer pray its problems upward, has invented the committee.

You sit on three. You, ${s.player.name}, who broke the Hollow Crown
on the floor of the world — they made you sit on COMMITTEES, and the
joke never stops being funny, and you never stop attending, because
this is what you bought with the breaking: a world that catches
itself, ladle by ladle, schedule by schedule, the arithmetic of forty
worked out township by township in chalk.

It holds. That's the miracle nobody sings: IT HOLDS. Shorter lives,
smaller wonders, an empty sky — and underneath it all a floor, built
by hands, that does not depend on anyone's mercy.

Except at the western hem, where the arithmetic stops working.

The reports come in all autumn. A coast where the unraveling never
CONCLUDED — where the grey didn't scar over when the loom died,
because that shore was never on the loom at all. Moorings of some
older make, failing one by one. Villages sliding into a tide that
doesn't bring them back. And the undercroft committees of three
townships, working independently, arriving at the same minuted
conclusion:

# 'Whatever held the far shore is letting go. Refer to the one who
breaks things that hold worlds. It is, with respect, their field.'`,
      choices: [
        { text: "Attend the charter session. If the world wants to send you, " +
                "it can send you PROPERLY, with paperwork.",
          fx: { xp: 10 }, goto: "c2_mortal_committee" },
        { text: "Skip the session. Pack tonight, leave a note. You were going " +
                "the moment you read the reports.",
          fx: { xp: 15, flags: { c2_no_charter: true } },
          goto: "c2_mortal_road" },
      ],
    },

    "c2_mortal_committee": {
      text: `The charter session lasts four hours, which by the standards of the
age is indecent haste. They read the reports aloud. They argue the
budget. An old woman from the Millrun delegation — there is always
someone from the Millrun, the bridge made it a holy word and the age
kept the habit — stands up at the end and says what committees exist
to avoid saying:

'We are sending one person at the world's edge because one person at
the world's edge is how it worked the last time. All in favor.'

All in favor.

They give you a charter with nine signatures and a seal pressed in
plain wax — no sigil, the age doesn't do sigils, just the imprint of
a thumb, which the drafters agreed meant 'a person vouches for this.'
They give you a purse, audited. They give you the latest arithmetic
on the coast: moorings failing at an accelerating rate, a black-
ledger operation called the Corvids buying up the failures, and a
name that surfaces in every report like a body that won't sink —
Mother Rook.

# 'Bring back numbers,' says the Millrun woman, shaking your hand
with both of hers. 'Numbers, we can build on. Legends we have.'`,
      on_enter: { flags: { c2_charter: true } },
      choices: [
        { text: "Take the west road, charter in your pack.",
          fx: { xp: 15 }, goto: "c2_mortal_road" },
      ],
    },

    "c2_mortal_road": {
      text: `The west road is the education the chapels used to promise.

You walk through the scar country, where the grey concluded and
stayed: fields the color of old hair, farmed anyway, in strips, by
people who plant the green right up against the grey like a dare. You
sleep in undercrofts — every township digs one now, ladles on pegs by
the door, the arithmetic of forty chalked on the beam, your own
handwriting copied at fifth hand and attributed to 'the Breaker,'
which you have given up correcting.

In one of them a veteran recognizes you. Not your face — your
SENTENCES, when you correct the chalk where someone's carried a
figure wrong. He goes still, then finishes his soup, then says,
without looking up: 'My sister went Hollow in the last year of the
god. She stopped falling when you broke it. Didn't rise — they don't,
I know, I KNOW — but she stopped falling, and we learned to set her
place at the table ourselves. Nobody caught us.' He looks up. 'We
caught us.'

He walks you to the door in the morning and points west, where the
sky over the hem has a color the rest of the sky has forgotten.

# 'Whatever's letting go out there,' he says, 'teach it what we do
now. Teach it hands.'`,
      choices: [
        { text: "On, to where the green gives out.",
          fx: { xp: 15 }, goto: "c2_mortal_hem" },
      ],
    },

    "c2_mortal_hem": {
      text: `The Hem, in the mortal age, is the strangest border in the world: on
the near side, the grey that CONCLUDED — dead but stable, scar
country, land that learned to be held by hands. On the far side, grey
that is still MOVING. Salt-marsh sliding, hummock by hummock, into a
sea that takes and does not give back. The unraveling your breaking
ended everywhere else, still running here on some older spool.

A customs post straddles the line, because the age is incapable of
encountering a border without erecting a shed on it. The officer
stamps your charter — or, if you carry none, looks at your face,
recognizes the sentences there too, and waves you through with the
deference the age pretends it has abolished.

'Saltmere's a day down the shore,' she says. 'Fair warning: it's not
committee country. The coast never had a god, so it never lost one,
so all our new ideas about catching ourselves' — she taps the ladle
on its peg, the forty on the beam — 'they've had ideas like that for
three thousand years. Older ones. Stranger ones. Knots.' She leans
out of the shed window and lowers her voice to coastal volume:

# 'And the knots are coming undone, and the woman buying up the loose
ends has a table, and the table has your chair already at it. Word
travels. Mind yourself, Breaker.'`,
      choices: [
        { text: "Down the shore to Saltmere.",
          fx: { xp: 15 }, goto: "c2_saltmere_gate" },
      ],
    },

    // ================================================== THE RISEN SHIELD (serra)
    "c2_open_serra": {
      entry_from: "end_serra",
      ws: "serra",
      preset: {
        karma: 30,
        companions: {
          serra:  { met: true, in_party: false, approval: 70, alive: true },
          vex:    { met: true, in_party: false, approval: 15, alive: true },
          maeve:  { met: true, in_party: false, approval: 25, alive: true },
          hollow: { met: true, in_party: false, approval: 30, alive: true },
        },
        flags: { final_companion: true, crowned_serra: true },
      },
      text: (s) => `You crowned her on the floor of the world, and the world has been
FAIR ever since, which is rarer and harder and stranger to live under
than kindness.

The harvests of the cruel fail with great precision. The Greyfields
of the new age get justice, not candles. In the repainted chapels the
sun is deliberately unfinished, and under it, the commandment she set
at a bridge before she'd follow anyone anywhere: THE WEAK ARE NOT
CURRENCY. WE DO NOT SPEND THEM. On quiet nights the whole grey
country can hear the sky keeping watch — whetstone on metal,
unhurried, eternal.

You, ${s.player.name}, the one who put the shards in her stubborn
hands, live as her veterans live: quietly, attended by rumor. You
were her shield-mate. You are the only mortal alive she still argues
with.

Which is why you alone are not surprised when the dream finds you.

It is the old drill-yard at dawn, as it always is when she needs to
talk — her parade ground of the mind, chalk lines, racked practice
blades. But this time she is standing at the yard's western wall,
and in the dream the wall has a GAP in it, and she is staring into
the gap with an expression you have not seen on her since the
Millrun: a soldier looking at a post that cannot be held.

# 'There's a wall I can't stand on,' says the god of justice. 'I need
you to stand on it for me.'`,
      choices: [
        { text: "'Report, then.' Old habits. She talks straighter to soldiers.",
          fx: { xp: 10 }, goto: "c2_serra_charge" },
      ],
    },

    "c2_serra_charge": {
      text: `She gives it to you like a briefing, because love, in Serra, was
always shaped like drill.

'Western hem. A coast the Crown never wove — I inherited a blind
spot, deliberately made, older than Vael's tenure. I can't see into
it. I can't reach into it. And it is FAILING. The old moorings that
hold it are letting go one by one, and what they moor is sliding into
the sea, and the people there — ' the chalk lines of the dream-yard
flare ' — the people there are WEAK, and something with a ledger is
BUYING them, and I am the commandment I set and I cannot enforce it
across my own border.'

She turns from the gap in the wall. The unfinished sun moves with
her.

'I asked the dead who keep watch with me. The oldest of them
remember the coast being LEFT OUT of the weave — a treaty, they
think, or a debt. Terms older than my chair. I won't break terms I
can't read; that's how Greyfields happen.' Her jaw sets. 'But
nothing in any terms anywhere stops one mortal walking in with their
own two feet and their own free say-so. It has to be you. It was
always going to be you.'

# 'The weak are not currency,' says the sky, quietly, 'and someone
on that shore is SPENDING them.'`,
      choices: [
        { text: "'I'll stand the wall.' Accept the charge as her knight, plain " +
                "and simple.",
          fx: { xp: 15, flags: { c2_serra_knight: true }, approval: { serra: 5 } },
          goto: "c2_serra_gift" },
        { text: "'I'll go — but as myself, not as your soldier. The coast " +
                "doesn't need a second commandment; it needs a neighbor.'",
          fx: { xp: 15, flags: { c2_serra_neighbor: true }, approval: { serra: 8 } },
          goto: "c2_serra_gift" },
      ],
    },

    "c2_serra_gift": {
      text: `'Then take something,' she says. 'A god at the edge of her reach can
still hand a thing across.'

She walks the dream-yard's rack — past the practice blades, past the
oaths — and what she lays before you, on the chalk line where her
border runs, are the two things she actually owns:

A whetstone. Hers. THE whetstone, the one the grey country hears on
quiet nights — or the dream of it, which from a god amounts to the
same thing. 'For the blade. It keeps an edge honest. Mine and
yours.'

And beside it, smaller: a button. Grey horn, army-issue, from the
coat she wore at the Millrun bridge, the day she set the condition
the world now runs on. 'For the rest of you. I held a bridge with
this coat once over the cost of spending people. When you can't
remember why you're standing somewhere unpleasant, hold it. It
remembers.'

# 'Pick one to carry where I can see it,' says Serra Valebright, 'and
know that I am the only god in history who is ARMING someone against
her own helplessness.'`,
      choices: [
        { text: "Take the whetstone. (+1 Might — the edge stays honest)",
          fx: { xp: 15, "stat+": "might", flags: { c2_serra_whetstone: true } },
          goto: "c2_serra_hem" },
        { text: "Take the button. (+1 Spirit — the bridge remembers)",
          fx: { xp: 15, "stat+": "spirit", flags: { c2_serra_button: true } },
          goto: "c2_serra_hem" },
      ],
    },

    "c2_serra_hem": {
      text: `You wake with your hand closed around her gift — solid, real,
smelling faintly of the drill-yard — and you are on the road west by
noon, because when Serra Valebright says a wall needs standing on,
her people are already walking.

Nine days through the fair country. You watch her reign go by: the
honest weights in the markets, the cruel landlord's blighted acre
sitting like a signature in a field of plenty, the unfinished suns
over the chapel doors. At night, the whetstone-sound from the sky —
until the ninth night, when it stops.

You've reached the Hem. The fairness ends at a ruled line: beyond it,
salt-grass, sliding marsh, a sky she cannot enter. Her watch falls
off you like a cloak taken by the wind, and the silence where her
attention was is the loneliest sound you have never heard.

On the boundary stone, someone has chalked a sun. Unfinished, like
the chapels'. Under it, in a child's letters: SHE CAN'T COME PAST
HERE. WE CHECKED. PLEASE TELL HER WE LIKED THE IDEA.

# You pocket the chalk-dust like a dispatch, square your shoulders
the way she would, and step off her map.`,
      choices: [
        { text: "March to Saltmere.",
          fx: { xp: 20 }, goto: "c2_saltmere_gate" },
      ],
    },

    // ================================================== THE OPEN LIBRARY (maeve)
    "c2_open_maeve": {
      entry_from: "end_maeve",
      ws: "maeve",
      preset: {
        karma: 25,
        stats: { might: 2, wits: 4, spirit: 2 },
        companions: {
          serra:  { met: true, in_party: false, approval: 30, alive: true },
          vex:    { met: true, in_party: false, approval: 20, alive: true },
          maeve:  { met: true, in_party: false, approval: 70, alive: true },
          hollow: { met: true, in_party: false, approval: 30, alive: true },
        },
        flags: { final_companion: true, crowned_maeve: true },
      },
      text: (s) => `The age of the first literate god is loud, argumentative, blasphemous
by every old standard, and the grey country thrives in it like a bog
in the rain.

The chapels are libraries now. The loom's ledgers are POSTED —
actual price of every harvest, plainly, in the porch of every
reading-room in the realm — and prayer is answered in writing,
sometimes with corrections, always in that hand you'd know anywhere:
cramped, fast, impatient with its own tenderness. Maeve of the Mire
holds the watch with the lamps of heaven always lit, and the world
gets to CHECK HER WORKING, and it has made the world strange and
honest and exhausting, and you would not trade it back.

You, ${s.player.name}, the one who put the shards in her ink-stained
hands, receive marginalia. Everyone prays; YOU get margin notes —
they arrive in whatever you're reading, between one page-turn and
the next, in topics ranging from 'the undercroft census, which is
GOOD WORK, tell them' to 'I miss arguing at a fire. The dead are
agreeable. It's awful.'

This morning's note is different. This morning's note is four words
long, and the hand is pressed so hard it has torn the page:

# 'SOMETHING ATE MY INDEX.'`,
      choices: [
        { text: "Go to the reading-room. When a librarian-god tears paper, you " +
                "attend in person.",
          fx: { xp: 10 }, goto: "c2_maeve_archive" },
      ],
    },

    "c2_maeve_archive": {
      text: `She manifests in the town reading-room the way she always does: not
appearing, exactly — the lamplight simply starts taking her side. The
shelves leaning in like familiars. The locket — the real one went to
the loom with her — glinting at the edge of seeing.

'I publish EVERYTHING,' she says, without greeting, which from Maeve
is greeting. 'That was the condition. The whole ledger, the sky's
marginalia, the actual price of everything. And I have found a
section of my own accounts that I cannot READ.' A map assembles
itself out of lamplight on the table: the realm, the threads, the
western hem. A margin of darkness. 'The coast. Never woven — fine,
I knew that, it predates the loom, there are THREE footnotes. But
the footnotes cite an appendix, and the appendix cites a TREATY,
and the treaty page is GONE. Not torn out. EATEN. The ledger heals
itself around the gap like skin over a splinter. Someone — before
Vael, I think LONG before — made an arrangement out there and then
made the arrangement unreadable, even to us. ESPECIALLY to us.'

The lamplight map zooms: nine drowned points of light along the dark
coast. The ninth is guttering.

# 'I am the god of the open book,' says Maeve of the Mire, 'and I
have found the page the universe doesn't want anyone to check.'`,
      choices: [
        { text: "'Then I'll go read it in person.' Study her assembled notes " +
                "first — every fragment she has on the coast. (lore for the road)",
          fx: { xp: 15, flags: { c2_maeve_lore: true } },
          goto: "c2_maeve_letter" },
        { text: "'Pages that eat themselves don't wait. I'll learn on the " +
                "road.' Pack tonight.",
          fx: { xp: 15 }, goto: "c2_maeve_letter" },
      ],
    },

    "c2_maeve_letter": {
      text: `She writes you a letter of introduction, because she is Maeve and
believes in paperwork the way Serra believes in walls.

It is addressed TO WHOM IT MAY CONCERN, WHICH IS EVERYONE, and it
states, in the hand the whole realm reads its harvest-prices in,
that the bearer travels with the full confidence of the Library,
that the bearer's questions are her questions, and that any door
closed to the bearer will be considered — the word is triple-
underlined — a CITATION.

'It won't work on the coast,' she says, watching you fold it. 'That's
rather the point. I want to know EXACTLY where my writ stops working.
You'll feel it — the line where my lamplight ends. Note the
mile-marker.' The shelves lean closer; her voice drops out of the
god-register into the fire-register, the old one, the arguing-at-camp
one. 'Listen. The dead who sit up with me, the oldest ones, the
pre-loom ones — they won't talk about the coast. They don't refuse.
They get POLITE. You remember what it means when the knowledgeable
get polite.'

'It means the price is real,' you say.

'It means the price is real. So here is my actual letter of
introduction, the one that matters.' She touches your forehead, one
ink-cold fingertip, the entire affection of a god compressed into a
proofreader's tap.

# 'Come back with the page,' says the Open Library, 'or DON'T come
back with the page, but COME BACK. I miss arguing at a fire.'`,
      choices: [
        { text: "West, to where her lamplight ends.",
          fx: { xp: 15, flags: { c2_maeve_letter: true } },
          goto: "c2_maeve_road" },
      ],
    },

    "c2_maeve_road": {
      text: `You note the mile-marker, as instructed. Her lamplight — the faint
amber certainty that has sat in the corner of every eye in the realm
for a year, the sense of a reading-room around the world — ends
fourteen paces past the boundary stone of the western Hem. Between
one step and the next. Like walking out of a library at closing
time, into weather.

The coast does not read. The coast SINGS — you hear it before you see
a single roof: a low working song coming up the shore road with a
crowd of marsh-folk hauling a beached hull, and the song has no words
you know, and the rhythm of it is doing something to the weight of
the hull that wits and arithmetic decline to explain.

The haulers nod to you as you pass — friendly, unimpressed, entirely
unaware of being off the books. One of them, a lean old woman with
tide-colored eyes, looks at you a beat longer than the rest. Looks at
your forehead, where an ink-cold fingertip rested.

'Huh,' she says. 'The librarian's compliments, is it.' She shifts the
rope on her shoulder. 'Tell her the answer's still no. Tell her the
shore keeps its own shelf.' And then, relenting, because you look so
lost: 'Saltmere's that way, ink-blessed. Mind the moorings.'

# Her lamplight can't reach here. Word of her, apparently, gets
everywhere.`,
      choices: [
        { text: "That way, then. Saltmere.",
          fx: { xp: 20 }, goto: "c2_saltmere_gate" },
      ],
    },

    // ================================================== THE QUIET SHEPHERD (hollow)
    "c2_open_hollow": {
      entry_from: "end_hollow_god",
      ws: "hollow",
      preset: {
        karma: 35,
        companions: {
          serra:  { met: true, in_party: false, approval: 30, alive: true },
          vex:    { met: true, in_party: false, approval: 20, alive: true },
          maeve:  { met: true, in_party: false, approval: 25, alive: true },
          hollow: { met: true, in_party: false, approval: 75, alive: true },
        },
        flags: { final_companion: true, crowned_hollow: true },
      },
      text: (s) => `The chapels of the new age have no murals. Rows of plain lamps,
always lit; a third stair that turns; a ladle on two pegs where the
altar would go. He still answers every asking — that's the whole
liturgy — and the falling, everywhere, feel a hand under them. Not
pulling back. Not letting drop. Sitting with. The Hollowed rise at
their own pace, called by their own kept names, and the world has
changed key without one trumpet.

You, ${s.player.name}, who put the shards in grey hands, keep an
unlabeled jar on your shelf, and some evenings it is warm, which is
how he visits.

Tonight the jar is cold.

Tonight, for the first time in a year, you light your own lamp and go
to the chapel and ASK — you, who never ask, because you of all people
try not to add to the pile. The lamps bend toward you the way they
bend toward anyone asking. And the voice that answers, soft as a
house settling, takes longer than it has ever taken, and what it says
is:

'I am sitting with everyone who falls. That is the work. But there is
a shore at the world's hem where the falling feel no hand — where I
reach and there is nothing to reach WITH. The "we" I promised has a
hole in it, friend.

# 'Somebody is falling out there with no one underneath. I cannot go.
You can. That is the entire asking.'`,
      choices: [
        { text: "'Then I'll go.' You don't need more than the asking. You " +
                "never have.",
          fx: { xp: 15, approval: { hollow: 5 } }, goto: "c2_hollow_ask" },
        { text: "'Why can't you reach it? You're the sky now.' Even with him, " +
                "you want to understand what you're walking into.",
          fx: { xp: 10 }, goto: "c2_hollow_why" },
      ],
    },

    "c2_hollow_why": {
      text: `The lamps dim, gently — him, thinking. He answers every asking; he
never promised the answers would be quick.

'When they set the Crown on me,' he says, 'I felt the whole shape of
the catching. Every thread. And at the western edge I felt the
SEAM — a place where the weave was hemmed short, deliberately, by
whoever strung the first loom. Not an oversight. A TERMS. The shore
out there was held by something older, and the loom was built around
its holding the way you build a house around a tree too old to cut.

'I sat with that. You know I don't force doors. But this year the old
holding started to LET GO — I can feel the slack arriving in my side
of the weave, thread by thread, like a neighbor's roof sliding into
the lane. Whatever moors that coast is failing. And the terms in the
seam are plain as stitching: I cannot cross it. None of us who wear
this can. It was the price of the first loom, I think. The tree said:
build around me, and never touch what I hold.

'The tree is dying, friend. And what it holds is every soul on that
shore — and below them, in the deep mooring, something that has been
PAYING to exist since before there were prayers, and is almost out
of payments.'

# The lamps steady. 'I don't understand it either,' he admits, which
from a god is a kind of courage. 'Go and sit with it. Understanding
usually shows up once somebody's sitting there.'`,
      choices: [
        { text: "'Then I'll go and sit with a dying coast.'",
          fx: { xp: 15, approval: { hollow: 5 } }, goto: "c2_hollow_ask" },
      ],
    },

    "c2_hollow_ask": {
      text: `'Take something from the chapel,' he says. 'Not power. I don't keep
any in here. Just — something to put your hand on, when the shore
gets loud.'

The chapel offers what it has. A lamp from the plain rows, lit a year
ago and never out. Or the ladle itself, the one from the two pegs —
the original, the Briarwatch ladle, the one he fed forty with while
the world was ending. The congregation would notice the gap. He
would, you suspect, be quietly glad of the gap; he never wanted
relics, only chores.

'The lamp says: someone is up, somewhere, in the dark,' he says.
'The ladle says: the work is the holy part. They're both true.
Everything in this room is true. That's all I ever changed.'

You reach out. The jar in your memory is warm again.

# 'Mind the third stair on your way down,' says the sky, the whole
liturgy of him in one settling breath. 'It turns.'`,
      choices: [
        { text: "Take the lamp. (a light that has not gone out in a year)",
          fx: { xp: 15, flags: { c2_hollow_lamp: true } },
          goto: "c2_hollow_hem" },
        { text: "Take the ladle. (+1 Spirit — the work is the holy part)",
          fx: { xp: 15, "stat+": "spirit", flags: { c2_hollow_ladle: true } },
          goto: "c2_hollow_hem" },
      ],
    },

    "c2_hollow_hem": {
      text: `The walk west is a walk through his reign, which is to say: nothing
to see. No blighted acres of the cruel, no posted ledgers, no
unfinished suns. Just townships where the lamps stay lit, and people
who have gotten into the habit — without doctrine, the doctrine
dissolved, there is no doctrine that survives the sky saying 'we' —
of checking on each other. You sleep in four different houses
uninvited and unquestioned. The age of the Quiet Shepherd does not
have hospitality. It has stopped having anything else.

At the Hem, his presence sets like the sun. You actually feel the
hand withdraw — not letting you drop; reaching its limit. The last
thing it does, at the very edge of the seam, is the thing it has done
for every faller for a year:

It stays until the last possible moment.

Then salt-grass. Then wind that belongs to nobody. Then, faint down
the shore, your first sound of the Mourncoast: a bell, cracked,
ringing somewhere out on the water — slow, patient, with long gaps,
like something keeping a vigil it has kept too long alone.

# Somebody is falling out here with no one underneath. You walk
toward the bell.`,
      choices: [
        { text: "Follow the shore road to Saltmere.",
          fx: { xp: 20 }, goto: "c2_saltmere_gate" },
      ],
    },

    // ================================================== THE LAST WITNESS (unmade)
    "c2_open_witness": {
      entry_from: "end_last_witness",
      ws: "unmade",
      preset: {
        karma: -10,
        stats: { might: 2, wits: 3, spirit: 4 },
        gold: 0,
        inventory: ["wyrmglass_dagger", "shield_cloak", "elixir"],
        flags: { final_witness: true, met_merchant: true },
      },
      text: (s) => `The world has been still for — you've stopped counting in years. The
Merchant counts in ENTRIES, and the catalogue is one million and some
hundreds of thousands of entries long now: the folding of coats, the
counting songs, the bridge at Millrun, every kept and tended thing,
all of it filed in the wagon of pale wood that is so much larger
inside than any wood could be.

You walk. He drives. The chimes mark the hours of a world that no
longer has any. It is not a bad existence, ${s.player.name}, the
last witness and the last merchant, cataloguing the great
unclenching; on the good days it is even gentle, the way the ending
was gentle. The grass does not grow, but it does not grieve either.
Nothing does. That was the point. You attended the final morning;
you saw every fist let go at once.

Which is why it stops you mid-stride, on an afternoon of the
unlabeled world, to see the Merchant's wagon pulled up at a
crossroads with the ledger OPEN and his early-arriving smile
nowhere on him at all.

'A discrepancy,' he says, and his voice has weather in it for the
first time in your long acquaintance. He turns the ledger to face
you. One million entries, each ruled off, closed, PAID. And one —
one account, at the bottom of the last page, in ink older than the
page itself:

# Still open. Still ACCRUING.`,
      choices: [
        { text: "'Everything ended. We watched it end. What can still be " +
                "running?' ",
          fx: { xp: 10 }, goto: "c2_witness_ledger" },
      ],
    },

    "c2_witness_ledger": {
      text: `'Endings are my business,' says the Pale Merchant, 'and business
requires me to be precise: everything that was WOVEN ended. The loom
let go; the woven world unclenched; I have receipts.' His long finger
taps the open line. 'This account predates the loom. It was old when
the first thread was strung. It is a DEBT, the original debt, and its
collateral was never on the loom at all, and so when the world let
go —'

He turns the wagon west without finishing the sentence, which in the
Merchant is the loudest thing he does.

You ride. Days, weeks — the units have unclenched too. And then one
afternoon there is a smell you have not smelled since the final
morning, and you are standing up in the wagon-bed with your heart
going like a hammer, because the smell is RAIN ON GRASS, and the
horizon ahead has WEATHER in it, real clouds, moving, and under the
clouds, impossibly, a line of green-grey coast that is not still,
not filed, not finished —

'The Unwoven Shore,' says the Merchant. 'The one account I have
never been able to close. It did not unclench, witness, because it
was never clenched to the loom in the first place. It has its own
arrangement. Its own holding. Its own — ' the chimes ring once,
without wind — 'creditors.

# 'There are still people in it. Living ones. And their mooring is
coming due.'`,
      choices: [
        { text: "'Drive.' The word comes out of a part of you that has been " +
                "in storage for years.",
          fx: { xp: 15 }, goto: "c2_witness_ride" },
      ],
    },

    "c2_witness_ride": {
      text: `The wagon rolls down out of the stillness, and crossing the Hem is
crossing from a photograph into the sitting-room: sound bursts over
you — surf, gulls, WIND, the working groan of a living marsh — and
the grey grass of the dead world gives way between one wheel-turn and
the next to grass that is merely grey-GREEN, coastal, alive, rude
with sap.

You weep. There's no sense pretending otherwise. The last witness of
the old world hangs over the rail of the Pale Merchant's wagon and
weeps at the smell of mud, and the Merchant — professional courtesy
— consults his ledger at length and notices nothing.

'Terms,' he says eventually, gently, as the first roofs of a port
town rise ahead. 'On this shore I am a stallholder, nothing grander;
the coast's arrangement is senior to mine and I respect seniority. I
will set up in the Drowned Market, below the cliffs. You — ' and
here he looks at you, and for once the early smile arrives at the
correct time, which is worse, somehow, than all his punctuality —
'you are something this coast has never seen and will not know how
to price. The last entry of a finished world, walking into the one
chapter that refused to end.

'They are alive in there, witness. Alive, and afraid, and coming
loose. You remember what those words mean better than anyone left.'

# 'Go and be IN it,' says the Pale Merchant. 'I'll mind the
catalogue. You've witnessed enough; the position of participant has
opened up.'`,
      choices: [
        { text: "Climb down. Walk the last mile to Saltmere on living ground.",
          fx: { xp: 25, flags: { c2_merchant_brought: true } },
          goto: "c2_saltmere_gate" },
      ],
    },
  };

  HC.registerScenes("ch2", SCENES);
})(globalThis.HC);
