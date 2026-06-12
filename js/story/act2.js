/* Act Two: Cindral, the brass city — the cult, the crown, and everyone's debts.
   Ported from mythos/story/act2.py. */
(function (HC) {
  "use strict";

  const { all_of, any_of, bg, camp_departures, gold, has, hasnt, inp,
          item, no_item } = HC.helpers;

  const SCENES = {
    // -------------------------------------------------------------- arrival
    "cindral_gates": {
      text: (s) => `Cindral announces itself an hour before you reach it: a brown haze on
the sky, a smell of smelters and crowds, and then the city itself, pouring
up its hill in terraces of brass-roofed tenements to the Brass Keep at the
summit, where the Queen Regent rules whatever the cult hasn't claimed yet.

The Withering got here first. You see it in the queues at the wells, in the
grey-eyed beggars roped together near the gates 'for their own keeping,' in
the way every street shrine to Vael has been converted, crudely, to the
Ember Cult's blazing wheel. Pyre-smoke rises from somewhere past the middle
terraces. By the smell, it isn't wood.

The gate queue shuffles forward under a sign: THE REGENT'S PEACE HOLDS.
ALL ELSE BURNS.` + (s.player.background === "gutterborn" ? `

A small shape detaches from the gate-crowd and attaches to your sleeve:
a girl of maybe ten with a rook feather sewn to her cap. 'Knew you by the
walk,' says Pip, who ran the gutter two streets over from yours, once.
'They said you got out.' She looks you up and down with professional
respect. 'Nobody gets out. You want the word?' For old times, she gives it
free: 'Rook's paying double for door-work, the cult burns at dusk DAILY
now, and the Regent's selling knighthoods to anyone with shiny rocks.
Mind your pockets. I trained the current crop.'` : ""),
      on_enter: (s) => (s.player.background === "gutterborn"
        ? { flags: { pip_friend: true }, xp: 15 } : {}),
      choices: [
        { text: "Into the city, toward the smoke.", goto: "pyre_square_first" },
      ],
    },

    "pyre_square_first": {
      text: `Pyre Square used to be a market. The market has been rescheduled
indefinitely.

A crowd fills the square, facing a platform of blackened brick where the
Ember Cult has built something between an altar and a bonfire. Chained to
the stake at its center is a woman — forty-odd, bog-country face, russet
hair shaved off in clumps by way of humiliation, standing in the kindling
with the put-upon air of an expert watching amateurs work. Around her
throat, on a cord, hangs a small silver locket that the cultists have
visibly tried and failed to remove; one of them is sucking burned fingers.

A Pyre-Speaker reads the charges: heresy, witchcraft, 'corresponding with
the silence,' and — this lands on the crowd like sparks on thatch — THEFT
OF THE GOD'S PRIVATE PAPERS. The woman rolls her eyes at that one and says,
audibly, 'Reading is not theft, you ember-licking illiterates,' which costs
her a cudgel-blow and wins her perhaps a third of the crowd.

Torch-bearers are taking position. Whatever you're going to do, the kindling
is dry.`,
      choices: [
        { text: "Step out of the crowd and turn it — these people are one voice " +
                "away from being a mob in the other direction.",
          check: { stat: "spirit", dc: 14,
                   ok: "maeve_saved_crowd", fail: "pyre_riot" } },
        { text: "Work around the back of the platform and cut her loose in the " +
                "smoke and shuffle.",
          check: { stat: "wits", dc: 13,
                   ok: "maeve_saved_sneak", fail: "pyre_riot" } },
        { text: "Wade up the platform with steel out.",
          combat: { enemy: "pyre_guard", win: "maeve_saved_fight" } },
        { text: "Watch her burn. The cult's quarrels aren't yours.",
          fx: { karma: -5, flags: { maeve_burned: true } },
          goto: "maeve_burned_scene" },
        { text: "Hand a torch-bearer your own brand to add. The Flame remembers " +
                "its friends — and you want the cult's trust.",
          fx: { karma: -9, flags: { maeve_burned: true, fed_pyre: true } },
          goto: "maeve_burned_dark" },
      ],
    },

    "pyre_riot": {
      text: `It half-works, which in crowds is the dangerous amount. A third of the
square surges one way, a third the other, the cult's cudgel-line buckles,
somebody's torch goes flying — and suddenly you are the fixed point in a
riot, and the Pyre-Warden is shouldering through the crush toward you with
a censer trailing burning oil.

Behind him, through the smoke, you can see the woman at the stake working
one hand free and methodically starting on the other, unhurried, as though
the riot were a service you'd arranged for her.`,
      choices: [
        { text: "Hold the line against the Pyre-Warden.",
          combat: { enemy: "pyre_guard", win: "maeve_saved_fight" } },
      ],
    },

    "maeve_saved_crowd": {
      text: `You find the crowd's grain and split it with one wedge: 'Whose mother
burns NEXT?'

Because everyone in the square knows someone going grey-eyed, and the cult's
arithmetic has only ever pointed one direction, and a thousand people arrive
at the same thought in the same heartbeat. The square goes from congregation
to weather. The cudgel-line dissolves; the Pyre-Speaker makes a tactical
reassessment of dusk's schedule; and in the crush, you take the platform
steps three at a time and unwind the chains from a woman who watches you
work with bright, amused, assessing eyes.

'Nicely shouted,' she says, stepping out of her own pyre as though
disembarking a ferry. 'I had it handled, but the rhetoric was a treat.'`,
      on_enter: { karma: 7, xp: 60, flags: { maeve_saved: true,
                                             saved_by_crowd: true } },
      choices: [{ text: "Get her clear of the square.", goto: "maeve_meet" }],
    },

    "maeve_saved_sneak": {
      text: `Smoke is a curtain and ceremony is a schedule, and between the two of
them there's a corridor a careful person can walk. You come up through the
under-stage where the cult stores its kindling, put a blade through the
stake's bindings from behind, and have the woman down the back stair while
the Pyre-Speaker is still in the second stanza of the burning-hymn.

In the alley she shakes feeling back into her hands and studies you. 'They
built the platform over their own woodshed,' she says. 'I'd have gnawed
through by the third verse. Still.' The bright eyes tick over you, item by
item, like a scholar cataloguing. 'Competence. How novel, in this city.'`,
      on_enter: { karma: 5, xp: 60, flags: { maeve_saved: true } },
      choices: [{ text: "Talk, somewhere with fewer cultists.",
                  goto: "maeve_meet" }],
    },

    "maeve_saved_fight": {
      text: `The Pyre-Warden goes down in a clangor of scorched plate, the censer
rolling away to set fire, with perfect irony, to the cult's own banner — and
the square, which has watched the cult burn its neighbors for a year, finds
its nerve all at once and remembers it outnumbers everybody.

You take the woman off the stake in the chaos. She steps from the kindling,
retrieves her confiscated satchel from a fallen cultist with the deft spite
of someone reclaiming library books, and falls in beside you as the square
comes apart behind you.

'I'm to understand that was on my behalf,' she says, in the alley's quiet.
'How alarming. People who fight cults for strangers always want something
enormous.'`,
      on_enter: { karma: 5, xp: 60, flags: { maeve_saved: true,
                                             cult_enemy: true } },
      choices: [{ text: "Tell her what you want.", goto: "maeve_meet" }],
    },

    "maeve_meet": {
      text: `Her name is Maeve — 'of the Mire, formerly of the Shattered Temple's
reading room, more formerly of a bog you've never heard of' — and she was
sentenced to burn for the contents of her satchel, which she opens for you
with the pride of a poacher displaying a record fish.

A grimoire. Not spells — letters. Copied fragments, in the First Tongue, of
what she calls 'the god's correspondence with himself': three thousand
years of marginalia gathered from a dozen burned archives. 'He kept a
diary,' she says. 'The Shepherd. They painted him serene for thirty
centuries, and meanwhile he was writing things like this.' She reads aloud,
translating on sight: ''Took the weight off for one breath today, over the
sea where none would notice. The relief frightened me more than the
falling.'' She closes the book. 'The Crown wasn't his glory, my rescuer.
It was his sentence. I'm going to the wound to learn who sentenced him —
and the cult would rather burn the question than hear the answer.'

At her throat, the silver locket turns slowly on its cord, though the alley
air is still.`,
      on_enter: { meet: "maeve", xp: 20 },
      choices: [
        { text: "'I carry a piece of the Crown, and I'm bound for the wound. " +
                "Come read the world's worst diary with me.'",
          fx: (s) => { s.changeApproval("maeve", 15); return { recruit: "maeve" }; },
          goto: "cindral_hub" },
        { text: "'Good luck with your question.' Part ways.",
          fx: { flags: { maeve_declined: true } },
          goto: "cindral_hub" },
      ],
    },

    "maeve_burned_scene": {
      text: `You've seen fires. You make yourself see this one, on the principle
that a choice you can't watch is a choice you shouldn't have made — or
perhaps you don't watch, and discover the principle later, at night, when
it's cheaper.

She doesn't give the crowd a show. She talks through it — lecturing,
actually, voice climbing over the crackle, something about letters and a
crown and 'ask them what the Shepherd wrote, ask them why they burn the
PAPER' — until she can't anymore.

The crowd disperses with the strange, guilty efficiency of crowds. By
evening the cult has swept the platform. But word in the gutters says two
things survived the pyre, and the cult wants neither touched: a satchel of
heretical writings the flames refused, and a small silver locket, sitting
in the ashes, unmelted, slowly turning on its cord.`,
      choices: [
        { text: "Go to the platform at dark and take what wouldn't burn.",
          goto: "maeve_ashes" },
        { text: "Leave the ashes their privacy.", goto: "cindral_hub" },
      ],
    },

    "maeve_burned_dark": {
      text: `Your torch goes on the pile with the others, and the Pyre-Speaker
marks your face with a long, warm, terrible look of welcome.

The woman at the stake watches you do it. Of everyone in the square, she's
the only one who looks neither afraid nor angry — just disappointed on your
behalf, like a tutor watching a promising student show their working and
arrive at garbage. 'YOU,' she calls down through the smoke, conversational
to the last, 'are going to be somebody's cautionary tale.'

Afterward, a cultist with a ledger takes your name. 'The Flame remembers
its friends,' he says, inscribing you. Two things survive the pyre, which
the cult declines to touch: a satchel of writings the fire refused, and a
silver locket, unmelted in the ashes, turning slowly on its cord.`,
      on_enter: { flags: { cult_friend: true } },
      choices: [
        { text: "Claim the unburned things from the ashes.",
          goto: "maeve_ashes" },
        { text: "Leave them. Free things from pyres have terms attached.",
          goto: "cindral_hub" },
      ],
    },

    "maeve_ashes": {
      text: `The platform at night is a black altar under a brown sky, and the two
survivors of the fire sit in the ash exactly where the gutters said.

The grimoire's satchel is warm, not hot. Inside, the copied letters of a
god: three thousand years of marginalia in the First Tongue, the Shepherd's
correspondence with himself. Even untranslated, the hand is legible as
exhaustion.

The locket is colder than the night is. When your fingers close on the
cord, something inside it shifts its weight — unmistakably, the way a
sleeper shifts when a stranger enters the room. From very far away, or very
nearby, you hear two girls' voices, laughing at a skipping rhyme, one of
them slightly out of breath. Then nothing.`,
      on_enter: { xp: 25 },
      choices: [
        { text: "Take the grimoire.",
          fx: { "items+": ["grimoire"], flags: { have_grimoire: true } },
          goto: "maeve_ashes" },
        { text: "Take the locket.",
          fx: { "items+": ["sister_locket"], karma: -2,
                flags: { took_locket: true } },
          goto: "maeve_ashes" },
        { text: "Leave the platform.", goto: "cindral_hub" },
      ],
    },

    // ------------------------------------------------------------------ hub
    "cindral_hub": {
      text: (s) => `Cindral by day is a city pretending very hard: hawkers hawking, brass
roofs blazing, the Regent's peace patrolling in polished pairs. Cindral by
the smell is a city losing: pyre-smoke over the middle terraces, Withering-
grey faces in every queue, and on every corner the cult's wheel-shrines,
fed with little offerings by people hedging their bets.

= From the lower town you can see your roads:

The BRASS KEEP crowns the hill, where the Queen Regent grants audiences to
anyone with information about 'celestial salvage' — town criers say so
twice an hour.

The ROOKERY sprawls across the dock-terraces, Mother Rook's parish of
locks, debts, and quiet professionals.

The PYRE CATHEDRAL — the cult's converted granary-temple — holds what fell
from the sky a year ago. They show it at dusk services: the Flame Undying.

And the old SHIELD CHAPEL on the east terrace flies a new banner: the Gilt
Shields, a mercenary company. Their captain's name, on the recruiting
boards, is Bannor Crayce.` + (!s.flag("hollow_resolved") ? `

Word in the soup lines, said low: something lives under the chapel
districts, in the old undercroft. The grey-eyed go missing near it. Or
not missing — DOWN. The cult pays for directions. Nobody sells them.` : ""),
      choices: [
        { text: "Climb to the Brass Keep and the Queen Regent's audience.",
          when: hasnt("queen_done"), goto: "brass_keep" },
        { text: "Go down to the Rookery.",
          when: hasnt("rook_resolved"), goto: "rookery" },
        { text: "Visit the Shield Chapel and the Gilt Shields.",
          when: hasnt("crayce_resolved"), goto: "shield_chapel" },
        { text: "Find the way into the undercroft.",
          when: hasnt("hollow_resolved"), goto: "undercroft" },
        { text: "Attend the cult's dusk service at the Pyre Cathedral.",
          when: hasnt("shard2_done"), goto: "solenne_audience" },
        { text: "Return to camp in the caravan yards.",
          goto: "camp_cindral" },
        { text: "Leave Cindral by the south road, toward the wound.",
          when: has("shard2_done"), goto: "act2_camp" },
      ],
    },

    // ---------------------------------------------------------- brass keep
    "brass_keep": {
      text: `The Brass Keep's audience hall has been a war room for a year: maps
weighted with wine-cups, clerks moving pins, and at the center of it the
Queen Regent Calwen — younger than the title, older than her face, with
the specific stillness of someone who has not slept properly since the
sky broke.

'You're the one from the north road,' she says, skipping ceremony. 'My
gate-captains keep useful lists. You've been to the barrow.' It isn't a
question. Her eyes go, briefly and involuntarily, to your pack, and you
understand that the criers' talk of 'celestial salvage' is this woman
trawling the realm for shards.

'I'll be plain. The cult holds a piece of the god's Crown in their
cathedral and rings it like a dinner bell, and half my city worships at
it. The throne requires a counterweight. I am in a position to be
generous — gold, writs, a knighthood if those amuse you — for any shard
brought to the crown of Cindral instead.' A beat. 'The mortal crown. The
one still doing its job.'`,
      choices: [
        { text: "Sell her the barrow shard. (150 gold and a royal writ)",
          when: item("crown_shard_1"),
          fx: { gold: 150, "items-": ["crown_shard_1"],
                "items+": ["writ_regent"], karma: -3,
                flags: { sold_shard_queen: true, queen_done: true },
                approval: { serra: -10, maeve: -15 } },
          goto: "queen_sold" },
        { text: "Offer alliance instead: her writ and backing, the cult's " +
                "shard humbled publicly — but every shard goes to the wound, " +
                "not the throne.",
          check: { stat: "spirit", dc: 13,
                   ok: "queen_ally", fail: "queen_refused" } },
        { text: "Study her while she talks — something in this hall is being " +
                "hidden, and recently.",
          check: { stat: "wits", dc: 14,
                   ok: "queen_secret", fail: "queen_refused" },
          when: hasnt("knows_prince") },
        { text: "Decline her entirely. Thrones and shards mix badly.",
          fx: { flags: { queen_done: true } },
          goto: "cindral_hub" },
      ],
    },

    "queen_sold": {
      text: `The shard changes hands across a map of her failing realm, and the
Queen Regent holds it the way you'd hold a live coal you'd been praying
for. The gold is counted by a clerk who never once looks up. The writ is
signed in her own hand: THE BEARER ACTS WITH THE VOICE OF THE THRONE.

'History will record this as the day the throne stopped begging,' she
says. Behind her eyes, something that has not slept in a year begins,
quietly, to plan.

The shard's whisper leaves your pack like a weight lifting — or like a
child handed to a stranger. You'll decide later which it was. You suspect
the deciding will be done at the wound, at the worst possible moment.`,
      on_enter: { xp: 40 },
      choices: [{ text: "Back down into the city.", goto: "cindral_hub" }],
    },

    "queen_ally": {
      text: `She hears the whole offer out — listening, visibly, for what it costs
her, the way rulers do — and signs the writ before her clerks can compose
their objections.

'A counterweight that walks away is still a counterweight while it's
here,' she says. 'Humble them in public, take their bauble to the wound,
and the throne keeps the only prize it ever wanted: a city that watched
the cult lose.' She hands the writ across the map. THE BEARER ACTS WITH
THE VOICE OF THE THRONE. 'Spend it before dusk service. The Hierarch's
star rises by the day, and my voice buys less of this city every week.'`,
      on_enter: { xp: 50, "items+": ["writ_regent"],
                  flags: { queen_done: true, queen_pact: true } },
      choices: [{ text: "Back down into the city, armed with paper.",
                  goto: "cindral_hub" }],
    },

    "queen_refused": {
      text: `Whatever you reach for, the still tired eyes get there first and close
over. 'The audience appreciates your candor,' the Queen Regent says, which
in court grammar means it doesn't. The clerks resume their pins.

At the door, almost too low to catch, she says — to the maps, not to you:
'Everyone who comes back from that barrow talks like the world can still be
saved without anyone's hands getting dirty. The throne envies you all.'`,
      on_enter: { flags: { queen_done: true } },
      choices: [{ text: "Back down into the city.", goto: "cindral_hub" }],
    },

    "queen_secret": {
      text: `You let her talk and you read the hall: the carpet's wear-path running
to a door no clerk uses; the food tray, child-sized portions, carried by
the only servant who doesn't glance at the Regent for permission; the
lullaby-rattle, cheap tin, sitting on a war-table's corner like contraband.

'You keep someone behind that door,' you say, when the clerks are out of
earshot. The stillness that takes her is total.

'My son,' she says at last. 'The heir. Greyer by the month.' Each word
placed like a stone over a well. 'The cult burns the Hollowed, and the
court would crown his uncle by midwinter if it knew, and so the King of
Cindral-to-be eats porridge behind a false wall and forgets his own
rattle.' Her eyes come up, and for one bare moment the Regent is gone and
what's left is the most frightened mother in the realm. 'You've been north.
You've seen them — the grey-eyed. Tell me something true, and I'll know if
you don't: is anything left inside?'`,
      choices: [
        { text: "'Yes. I've seen a Hollowed choose, and kneel, and mourn. " +
                "Whatever they are, they're not gone.'",
          fx: { karma: 4, xp: 40,
                flags: { knows_prince: true, told_queen_hope: true } },
          goto: "queen_hope" },
        { text: "'Nothing is left. Mourn him now and secure your succession.'",
          fx: { karma: -5, xp: 20,
                flags: { knows_prince: true, told_queen_despair: true } },
          goto: "queen_despair" },
        { text: "'That information sounds valuable. What's it worth to the " +
                "throne for the cult not to hear it?'",
          fx: { karma: -8, gold: 100,
                flags: { knows_prince: true, blackmailed_queen: true },
                approval: { serra: -15, vex: -10 } },
          goto: "queen_blackmail" },
      ],
    },

    "queen_hope": {
      text: `She doesn't thank you. Rulers don't, for the big ones. But the breath
she takes is the first deep one the room has seen in months, and when she
speaks again the Regent's voice has something new under it, load-bearing.

'Then the throne's position on the Withered,' she says slowly, testing the
words' weight, 'is open to revision.' She turns back to her maps. 'Bring
the world its Crown back, northerner. There's a boy behind that wall I'd
like to introduce you to, after.'

Her offer stands, the clerks' pins resume, and the audience is over — but
the lullaby-rattle, you notice, has been moved to the map's center, holding
down Cindral.`,
      choices: [
        { text: "Take your leave — and the rest of her offer, if you want it, " +
                "another day.",
          fx: { flags: { queen_done: true } },
          goto: "cindral_hub" },
        { text: "Stay: offer her the alliance — writ for a public humbling of " +
                "the cult.",
          fx: { xp: 30, "items+": ["writ_regent"],
                flags: { queen_done: true, queen_pact: true } },
          goto: "cindral_hub" },
      ],
    },

    "queen_despair": {
      text: `She takes it the way rulers take artillery: standing, with the cost
deferred. 'Thank you for your candor,' she says, voice level, eyes
finished. The audience is over before her hands stop being still.

What you've left her with, you'll learn from the criers or never: a mother
with no hope and a realm that needs an heir, behind a false wall, with a
porridge tray and a tin rattle and the cult's pyres burning nightly below.

# The clerks' pins resume. None of them know what you've moved.`,
      on_enter: { flags: { queen_done: true } },
      choices: [{ text: "Back down into the city.", goto: "cindral_hub" }],
    },

    "queen_blackmail": {
      text: `The word for what crosses her face isn't anger — anger needs surplus
strength, and she's spent. It's recognition: of the species of thing in her
audience hall, and of the price of having hoped aloud in front of it.

The hundred gold is counted out by her own hands, so that no clerk learns
why. 'The throne's compliments,' she says, with each stack. 'The throne
suggests. You spend it. Far from Cindral.'

You're escorted out by guards who haven't been told anything and know it.
Behind you, somewhere in the Keep, a false wall gets a second lock.`,
      on_enter: { flags: { queen_done: true } },
      choices: [{ text: "Down into the city, heavier by a hundred gold.",
                  goto: "cindral_hub" }],
    },

    // -------------------------------------------------------------- rookery
    "rookery": {
      text: (s) => (`The Rookery doesn't have an address; it has a gravity. You follow the
dock-terraces down until the watch patrols thin out and the architecture
starts cooperating — bridges between upper floors, doors in conversation
with each other, the whole district built like a deck of marked cards.

Mother Rook receives in a counting-house warmed by a fireplace of
confiscated heirlooms. She is small, silver-haired, and grandmotherly in
the way that anvils are sturdy: a fact you'd only test once. Around her,
quiet professionals do quiet arithmetic.` + (s.inParty("vex") ? `

Her eyes find Vex behind you, and the temperature drops by exactly one
degree of courtesy.

'My wandering investment,' she says fondly. 'And it's brought me a new
debtor, how thoughtful. Come in, both of you. Mind the ledgers.'

Vex has gone the color of an old receipt. Their branded wrist, you notice,
they hold slightly behind them, like a child hiding a report card.`
        : (s.flag("vex_betrayed_early") ? `

'The one who got my Vex sent south in irons,' she says, before you've
spoken. News, in the Rookery, travels by pneumatics. 'It's in the cellar,
re-learning gratitude. You'll forgive the chill in my welcome — or you
won't. I price both the same.' Behind her, briefly, between two
professionals' shoulders: a figure scrubbing the floor, rook-brand glowing
faintly, movements too even, eyes too quiet. You sold that.` : `

'A new face,' she says pleasantly. 'With northern dust and barrow-luck on
it. Sit. Everything in Cindral passes through this room eventually,
including everyone.'`))),
      choices: [
        { text: "Buy out Vex's debt-brand, in gold, in public, properly. " +
                "(80 gold)",
          when: all_of(inp("vex"), gold(80), hasnt("rook_resolved")),
          fx: { gold: -80, karma: 4,
                flags: { rook_resolved: true, vex_debt_paid: true },
                approval: { vex: 20 } },
          goto: "vex_debt_paid" },
        { text: "Come back at night and steal the ledger that holds Vex's " +
                "brand-debt.",
          when: all_of(inp("vex"), hasnt("rook_resolved")),
          check: { stat: "wits", dc: 14,
                   ok: "rook_heist_ok", fail: "rook_heist_fail" } },
        { text: "End Mother Rook. Debts die with the creditor.",
          when: all_of(inp("vex"), hasnt("rook_resolved")),
          combat: { enemy: "rook_killers", win: "rook_kill_choice" } },
        { text: "Sell Vex back to her. She's literally at the counting table; " +
                "the bounty is a hundred gold.",
          when: all_of(inp("vex"), hasnt("rook_resolved")),
          fx: { gold: 100, karma: -10,
                flags: { rook_resolved: true, vex_sold: true },
                approval: { serra: -20, maeve: -10 } },
          goto: "vex_sold_scene" },
        { text: "Buy Rookery mail off her quartermaster. (60 gold)",
          when: all_of(gold(60), no_item("rook_mail")),
          fx: { gold: -60, "items+": ["rook_mail"] },
          goto: "rookery" },
        { text: "Leave the Rookery to its arithmetic.",
          fx: (s) => (s.inParty("vex") ? {}
                      : { flags: { rook_resolved: true } }),
          goto: "cindral_hub" },
      ],
    },

    "vex_debt_paid": {
      text: `Eighty gold, weighed twice on Rook's own scales, witnessed by four
professionals and entered in the master ledger in red. Mother Rook works
through the formalities with genuine, terrible courtesy, and at the end of
them she takes Vex's wrist in her small dry hands — Vex flinching, then
forcing stillness — and lays her thumb on the rook-brand.

'Paid,' she says, and the brand goes out like a coal in water. Just a scar
now. Just skin.

In the street outside, Vex walks twenty paces, stops, and stares at their
wrist for the better part of a minute, in the rain that's started, while
you pretend to study the architecture.

'Nobody buys anything in that room but futures,' they say finally,
unsteady. 'You bought me a PAST. Do you understand that she'd have honored
the brand from my grave? Paid is the only word she respects. You bought
the WORD.' They blink rapidly, blame the rain, and fall in beside you,
and their stride has changed — you'd need to have walked behind a
debt-branded thief for weeks to spot it, but it's lighter by exactly one
owner.`,
      on_enter: { xp: 60 },
      choices: [{ text: "Back into the city.", goto: "cindral_hub" }],
    },

    "rook_heist_ok": {
      text: `Stealing from Mother Rook is the most famous bad idea in Cindral, which
is precisely why the counting-house's night defenses guard against
professionals and not against you doing everything wrong on purpose: in
through the chimney of the heirloom fireplace at the hour the flue cools,
through her own parlor in stockinged feet, out with the master ledger while
the night-shift professionals guard the approaches that sane thieves use.

On the roof, by shuttered lantern, Vex finds their page. Name, sum, brand-
oath — and Rook's true signature, the one that anchors the binding. They
read it twice. Then they eat it.

'Chewier than expected,' they report, eyes very bright. The brand on their
wrist greys out as the signature dissolves — a coal in water, then just a
scar. The rest of the ledger you leave on the Cathedral's poor-box at
Vex's suggestion, because half the debts in it are people, and Rook
re-papering three hundred holds is a year of chaos the gutter could use.

Somewhere below, a counting-house wakes up to the worst morning of its
career.`,
      on_enter: { xp: 80, karma: 3,
                  flags: { rook_resolved: true, vex_debt_stolen: true,
                           rook_robbed: true },
                  approval: { vex: 25 } },
      choices: [{ text: "Be elsewhere by sunrise.", goto: "cindral_hub" }],
    },

    "rook_heist_fail": {
      text: `The flue was cooler than the welcome. You come down the chimney into a
parlor with the lamps already lit, Mother Rook in her chair with tea for
one, and two professionals materializing at your elbows like punctuation.

'The chimney,' she says, to Vex, who has frozen on the sill. 'I'm almost
proud. Sit. Nobody dies over paper — paper is what stops the dying, that's
its job.' The terms she names are not negotiable and are almost worse than
violence: the attempt goes in the ledger too. Vex's debt, plus tonight,
plus interest. 'You'll want to resolve this account soon,' she advises you,
pouring. 'It compounds.'

Her professionals see you to the street with ceremonial gentleness.`,
      on_enter: { hp: -4, flags: { rook_angry: true } },
      choices: [{ text: "Regroup. The account stands open.", goto: "rookery" }],
    },

    "rook_kill_choice": {
      text: `Her professionals are the best in the city, and now they're furniture,
and the counting-house is silent except for the heirloom fire eating
someone's wedding chest.

Mother Rook hasn't moved from her chair. She finishes her column of figures
and sets down the pen. 'Forty years,' she says, 'and it arrives looking
like this.' She studies Vex — who is breathing hard, knife out, absolutely
still. 'I fed you, little rook. Branded you so the street couldn't eat you.
You'd have died in a gutter by ten.'

'I know,' Vex says. 'Both things are true. That was always your favorite
trick.'

The old woman folds her hands and looks at you, and waits, with the
professional patience of someone who has sat on the other side of this
table many times and knows exactly what the chair is worth.`,
      choices: [
        { text: "Finish it. The Rookery's ledgers die with her.",
          fx: { karma: -7, xp: 60,
                flags: { rook_resolved: true, rook_dead: true,
                         vex_debt_blood: true },
                approval: { vex: 10, serra: -10 } },
          goto: "rook_dead_scene" },
        { text: "Take the ledger from her desk, burn Vex's page in her own " +
                "fireplace, and leave her alive in the wreckage of her " +
                "reputation.",
          fx: { karma: 2, xp: 70,
                flags: { rook_resolved: true, rook_humbled: true,
                         vex_debt_stolen: true },
                approval: { vex: 20 } },
          goto: "rook_humbled_scene" },
      ],
    },

    "rook_dead_scene": {
      text: `Vex does it themselves. You didn't decide that; you only didn't stop it.

Afterward they stand a long time by the chair, holding their branded wrist
out over her like evidence at a trial that has just adjourned forever. The
brand doesn't fade — the binding dies with the signature renewed nowhere,
ash in the heirloom fire — but it goes quiet, they say. For the first time
since the age of ten, quiet.

'She was the closest thing I had,' Vex says, on the roof, in the rain.
'Write that down somewhere as the worst sentence anyone's ever said.' By
morning the Rookery is eating itself — three successors, two wars, every
debt in the master ledger suddenly a theory. The gutter will be ungoverned
for a year and unsafe for five. Vex doesn't look back once, which is how
you know how much it costs them.`,
      choices: [{ text: "Be gone by the time the succession starts.",
                  goto: "cindral_hub" }],
    },

    "rook_humbled_scene": {
      text: `Vex's page curls in the heirloom fire while Mother Rook watches, and in
the Rookery's grammar this is worse than killing her: every professional in
the city will know by dawn that someone walked into the counting-house,
beat her guard, and edited her ledger, and walked out, and she allowed it,
because the alternative was the fire taking more pages.

'You understand what you've spent,' she says to Vex, quietly, at the end.
'Forty years I priced everything in this city, and tonight you've made me
the proof that prices can be argued with. They'll be arguing for a decade.'

'Good,' says Vex, and means it, and shakes — later, outside, in the rain,
where the professionals can't see.`,
      choices: [{ text: "Into the wet streets, lighter.", goto: "cindral_hub" }],
    },

    "vex_sold_scene": {
      text: `It takes Vex a moment to understand. That's the part you'll keep: the
moment — the glance at you to share the joke, the joke not being there, the
arithmetic completing.

They don't run. The room is Mother Rook's; running in it has never once
worked. They stand quite still while the professionals close in, and they
look at you the whole time, with an expression you've seen exactly once
before — in a square in Briarwatch, by a turnip-stained stranger in stocks:
the bright, professional smile of a ledger closing.

'Twice in one life,' Vex says. 'I'm a classic.'

Mother Rook counts your hundred gold herself. 'A pleasure,' she says, and
means the gold, and the lesson her whole parish just watched. The last you
see of Vex is the counting-house door, and the brand on their wrist
beginning, faintly, to glow.`,
      on_enter: { xp: 20 },
      choices: [{ text: "Take the money and go.",
                  fx: { approval: { vex: -100 }, leave: "vex" },
                  goto: "cindral_hub" }],
    },

    // -------------------------------------------------------- shield chapel
    "shield_chapel": {
      text: (s) => `The Shield Chapel was the Dawnward Order's chapterhouse in Cindral,
back when the order existed; the Gilt Shields took the lease and kept the
iconography, regilded. Where the sun-and-shield once meant something, it
now means rates: the recruiting board lists prices for escort work,
'persuasion,' and — newly chalked — 'celestial salvage recovery.'

Captain Bannor Crayce drills his company in the cloister: silver-haired,
straight-backed, with the voice that a generation of Dawnward recruits
learned to obey before they learned to think. The voice that gave the
order at Greyfield, and then gave the testimony that hung the order's
honor on a subordinate.` + (s.inParty("serra") ? `

Beside you, Serra has stopped walking. The sound she makes isn't a word.
On her back, the scored-out sun seems suddenly very loud.

# 'A year,' she says. 'A year I've imagined this, and he's TAKING
CONTRACTS.'` : (s.player.background === "veteran" ? `

You knew him at once. The voice does it — you heard it across a burning
village, keeping perfect parade cadence while Greyfield died. Some part
of you has been waiting to hear it again, the way a scar waits for
weather.` : "")),
      choices: [
        { text: "Confront Crayce in his cloister.",
          when: any_of(inp("serra"), bg("veteran")),
          goto: "crayce_confront" },
        { text: "His strongbox first, his face after — his old order kept " +
                "records, and so does a careful traitor: find the Greyfield " +
                "letters.",
          check: { stat: "wits", dc: 13,
                   ok: "crayce_letters_got", fail: "crayce_caught" } },
        { text: "Nothing for you here. Mercenaries gonna mercenary.",
          fx: { flags: { crayce_resolved: true } },
          goto: "cindral_hub" },
      ],
    },

    "crayce_confront": {
      text: (s) => `Crayce sees you coming across the cloister and dismisses the drill
with a flick — a courtesy, or a clearing of the field of witnesses.

` + (s.inParty("serra") ? `'Valebright.' He says the name like an inventory item. 'You're looking
poor. The Shields could use a blade with your record — well. Half your
record.' He lets that sit, gauging her exactly as a man does who has
already destroyed someone once and remembers which seams gave.

'You wrote the order,' Serra says. Her voice is drill-ground flat. 'I
carried your blame for the Shield's sake, and you let the Shield die
anyway, and you SOLD THE NAME.'

'I survived,' Crayce says simply. 'The order was dying of its own vows.
Greyfield was a symptom, you were a cost, and I have a company now that
takes contracts instead of communion. The realm prefers us. Look at its
custom.' He turns to you, urbane: 'Is she yours? Keep her pointed
somewhere useful. The strong ones only break the once, but they break
BADLY.'` : `'Greyfield colors on your kit,' he says, reading your gear in one pass.
'I never forget a levy. You carried water and a sword and you watched.
Whatever you've come for, soldier — absolution, employment, or a
quarrel — the first I never stocked, the second pays four a week.' Of the
third he says nothing, but his weight has shifted to the balls of his
feet, parade-subtle, and the cloister is suddenly very empty around the
two of you.`),
      choices: [
        { text: "Demand the truth in writing — break into his strongbox tonight " +
                "for the Greyfield orders.",
          check: { stat: "wits", dc: 13,
                   ok: "crayce_letters_got", fail: "crayce_caught" } },
        { text: "Shake his aide loose instead — the man who carries the " +
                "captain's keys has the captain's secrets, and the captain's " +
                "grudges.",
          check: { stat: "might", dc: 13,
                   ok: "crayce_letters_got", fail: "crayce_caught" } },
        { text: "'I was AT Greyfield, Crayce. Say the order was yours, here, in " +
                "front of your company.' (Veteran)",
          when: bg("veteran"),
          check: { stat: "spirit", dc: 14,
                   ok: "crayce_admits", fail: "crayce_caught" } },
      ],
    },

    "crayce_letters_got": {
      text: `A careful traitor keeps the orders that exonerate him from the people
he sold; Crayce's strongbox holds the Greyfield file complete — the
original order in his hand, the casualty ledger in his clerk's, and the
draft of his testimony with the blame worked over in revision after
revision like a man fitting a coat to someone else's shoulders. Serra
Valebright's name doesn't even appear until draft three.

You have it all. The question is the spending of it.`,
      on_enter: { xp: 60, "items+": ["crayce_letters"],
                  flags: { have_letters: true } },
      choices: [
        { text: "Lay the file before the Lord Marshal's court and the criers " +
                "both — let the realm read draft three.",
          fx: { karma: 6, xp: 40,
                flags: { crayce_resolved: true, crayce_exposed: true },
                approval: { serra: 25 } },
          goto: "crayce_exposed_scene" },
        { text: "Bring it to Serra and let her decide what his life is worth.",
          when: inp("serra"),
          goto: "crayce_serra_decides" },
        { text: "Bring it to Crayce, priced. A captain's reputation against " +
                "eighty gold of silence.",
          fx: { karma: -7, gold: 80,
                flags: { crayce_resolved: true, crayce_blackmailed: true },
                approval: { serra: -35 } },
          goto: "crayce_blackmail_scene" },
      ],
    },

    "crayce_caught": {
      text: `It goes wrong in the way things go wrong around men like Crayce:
quietly, with procedure. Gilt Shields appear at the right doors at the
right moment, and you're escorted to the street with exactly calibrated
force and a warning delivered in the parade voice, pleasantly, as to a
crowd: 'The company thanks you for your interest.'

Two of his men follow you for a day. He knows what you wanted. The
strongbox will move now — but a man that careful is careful on a schedule,
and schedules can be learned.`,
      on_enter: { hp: -4 },
      choices: [
        { text: "Try the strongbox again before it moves.",
          check: { stat: "wits", dc: 15,
                   ok: "crayce_letters_got", fail: "crayce_failed" } },
        { text: "Let it go.", fx: { flags: { crayce_resolved: true },
                                    approval: { serra: -10 } },
          goto: "cindral_hub" },
      ],
    },

    "crayce_failed": {
      text: `The strongbox is gone — moved by wagon at dawn with a full escort,
destination a Gilt Shields holding outside the walls. The proof of
Greyfield rides away under guard, and the schedule that took it is the
last one you'll get to learn; the company knows your face now at every
door.

If there is justice for Greyfield, it will have to come some other way,
or some other year.`,
      on_enter: { flags: { crayce_resolved: true, crayce_escaped: true },
                  approval: { serra: -15 } },
      choices: [{ text: "Carry it badly.", goto: "cindral_hub" }],
    },

    "crayce_admits": {
      text: `Something about it — Greyfield colors, the cloister's silence, his own
company watching — catches Crayce in the one place he's still soft: the
parade voice needs an audience that believes it, and you've put a witness
inside its range.

'The order was mine,' he says. Loudly. Parade-cadence, because it's the
only register he has. 'Greyfield was mine. The testimony was mine. Soldiers
carry orders and captains carry outcomes, and I declined the weight, and
Valebright was load-bearing.' A silence. His company has stopped drilling.
'Write it down, someone. The captain is confessing. It seems to be the
fashion this year — even the god got tired of his own story.'

It's in front of forty sworn mercenaries and two of the Regent's
clerks-of-market. By dusk it's in front of the city.`,
      on_enter: { xp: 80, karma: 5,
                  flags: { crayce_resolved: true, crayce_exposed: true,
                           crayce_confessed: true },
                  approval: { serra: 25 } },
      choices: [{ text: "Let the city do the rest.", goto: "cindral_hub" }],
    },

    "crayce_exposed_scene": {
      text: (s) => `The Lord Marshal's court moves slowly; the criers don't. By evening,
draft three is being read aloud on the terraces to crowds who lost sons at
Greyfield or to the order's collapse after it, and the Gilt Shields'
recruiting board has acquired graffiti that their captain drills past,
straight-backed, while his contracts evaporate like rain off brass.

The Marshal's summons comes within the week, with irons in it.` + (s.inParty("serra") ? `

Serra reads the original order twice, all the way through, and then folds
it with the care you'd give a wound dressing. 'I carried this for a year
without ever seeing it,' she says. 'It's SMALLER than me. It was always
smaller than me.' She looks up, and her eyes are wet and absolutely level.
'The Shield's gone and I don't want it back. But my NAME — you've handed
me back my name. I find I'd forgotten the weight of it. It's a good
weight.'` : ""),
      choices: [{ text: "Onward.", goto: "cindral_hub" }],
    },

    "crayce_serra_decides": {
      text: `You put the file in Serra's hands in the chapel's shadow and you watch
her read her own framing, draft by draft, her face doing the work of a
year in minutes.

When she's done she's quiet for a long time. Then: 'I know where he sleeps.
Soldiers always know where the captain sleeps; it's the last thing the
drills teach you.' Her hand is on her sword and her voice is asking — really
asking, the way she's never once asked you for anything:

'Tell me which one I am. The knight takes this to the Marshal and lets the
court have him, and the court is slow, and rich men swim in it. The woman
goes tonight and it's DONE and Greyfield's dead get steel instead of paper.
I've been both people all year and I'm asking you to pick, because the one
thing I can't survive again is choosing wrong alone.'`,
      choices: [
        { text: "'Be the knight. The court, the criers, the long way. His name " +
                "dies in daylight, and yours comes back the same way.'",
          fx: { karma: 6, xp: 50,
                flags: { crayce_resolved: true, crayce_exposed: true,
                         serra_knight: true },
                approval: { serra: 30 } },
          goto: "crayce_exposed_scene" },
        { text: "'Go tonight. Greyfield's dead have waited long enough for " +
                "paper.'",
          fx: { karma: -5, xp: 40,
                flags: { crayce_resolved: true, crayce_killed: true,
                         serra_avenger: true },
                approval: { serra: -5 } },
          goto: "crayce_killed_scene" },
      ],
    },

    "crayce_killed_scene": {
      text: `She's back by the morning watch, sword cleaned, face not.

'He woke,' is all she reports, in the drill-flat voice. 'He knew me. He
said —' she stops, restarts. 'It doesn't matter what he said. It was the
parade voice. It was the parade voice all the way to the end.'

The city calls it a contracts dispute; the Gilt Shields dissolve into
their own succession war within the week, which buries the question. Serra
oils her sword that night with the methodical attention of someone reading
a letter they can't put down. The scored-out sun stays on her shield. You
notice she's stopped polishing the sigil underneath it.`,
      choices: [{ text: "Onward, quieter.", goto: "cindral_hub" }],
    },

    "crayce_blackmail_scene": {
      text: (s) => `Crayce reads your price with the relief of a man back on home ground —
everything in his world is purchasable, and here you are, confirming the
cosmology. The eighty gold arrives by his aide within the hour, in a
Gilt Shields contract-satchel, with a receipt. He would.

The Greyfield file goes back into the dark. The dead of Greyfield stay
exactly as dead, and the realm's record stays exactly as false, and
somewhere in the Marshal's court a year from now, men will still be
toasting Captain Crayce's health.` + (s.inParty("serra") ? `

Serra doesn't speak to you for a day. When she does, it's one sentence,
drill-flat: 'You found the truth, weighed it, and sold it back to the
liar.' After that she watches you the way she watched the bridge at
Millrun: someone memorizing a flaw in stone.` : ""),
      choices: [{ text: "Spend it well.", goto: "cindral_hub" }],
    },

    // ------------------------------------------------------------ undercroft
    "undercroft": {
      text: `The way down isn't hidden so much as unadvertised: a cellar stair
behind the chapel districts where the Withering-grey moss grows in a line,
like a path worn by feet that weigh nothing.

The undercroft was a crypt before Cindral grew over it. Now it's lit with
fish-oil lamps, and inhabited. Hollowed — thirty, forty of them, sitting in
the lamplight in quiet rows. And moving down the rows with a pail and a
ladle, feeding them broth one by one with the patience of a man watering a
garden, is a Hollowed man who looks up at your step and says:

'Welcome. Mind the third stair; it turns.'

He SPEAKS. Grey-skinned, grey-eyed, unmistakably Withered — and present,
someone home behind the windows and the lamp lit. 'Brother Hollow, they
call me, those who call me. I had another name. A child in the camps kept
calling it after I greyed, every day, over and over — I think she anchored
it, like a rope thrown after a man going under water. I am still under the
water. But I kept the rope.' He fills another bowl. 'They eat if you feed
them, you know. Everyone's forgotten that. They're not gone. They're
FALLING — falling very slowly, toward where the god used to catch us. I
sit with them because falling is lonely.'`,
      on_enter: { meet: "hollow", xp: 30 },
      choices: [
        { text: "'I'm going to the wound — to where the catching is decided. " +
                "Come with me. The world should meet what you are.'",
          check: { stat: "spirit", dc: 12,
                   ok: "hollow_joins", fail: "hollow_stays" } },
        { text: "Raise the soul-lantern. Let the dead of Ashfen speak for you.",
          when: item("soul_lantern"),
          goto: "hollow_joins_lantern" },
        { text: "Tell the cult where the grey-eyed go. They pay for directions, " +
                "and they'll pay best for this.",
          fx: { karma: -10, gold: 40,
                flags: { hollow_resolved: true, hollow_betrayed: true,
                         cult_friend: true },
                approval: { serra: -20, maeve: -15, vex: -10 } },
          goto: "hollow_betrayed_scene" },
        { text: "Leave them to their slow falling.",
          fx: { flags: { hollow_resolved: true } },
          goto: "cindral_hub" },
      ],
    },

    "hollow_joins": {
      text: `He considers it the way he does everything: slowly, from underwater.

'The wound,' he says. 'Yes. I feel it, you know. We all do — the falling
have a falling-toward.' He sets down the pail, says something low to the
rows of quiet grey faces — a schedule, you realize, he's leaving them
INSTRUCTIONS, who will refill the lamps, which stair turns — and takes up
a walking stick worn to his grip.

'I will come. Not as your sword — I held one once and have put it down for
good, I think the putting-down is most of what's left of me. But the world
is deciding what the Hollowed are this year. Burning us on that theory.
Someone who can still say "we" should be standing where the deciding
happens.'`,
      on_enter: { karma: 4, xp: 50,
                  flags: { hollow_resolved: true },
                  approval: { maeve: 8, serra: 5 },
                  recruit: "hollow" },
      choices: [{ text: "Up the turning stair together.", goto: "cindral_hub" }],
    },

    "hollow_joins_lantern": {
      text: `You unhood the lantern, and the undercroft changes pitch.

Every grey face in the rows turns toward the light at once, like a field
turning after the sun, and Brother Hollow goes still in the way of a man
hearing his name called across thirty years. 'Oh,' he says. 'Oh, you've
got DEAD in there. Properly kept dead. Caught ones.' He comes close, and
the lamplight and the lantern-light hold each other, and the rows of the
falling watch the caught with that expression you saw on a hillside in
the north: homesickness.

'They were caught and kept and we are falling uncaught,' Brother Hollow
says softly. 'And you're carrying them to the wound. To the catcher's own
deathbed.' He picks up his walking stick; the decision seems to involve
no decision at all. 'Then I come too. Whoever inherits the catching — the
falling should have a witness at the reading of the will.'`,
      on_enter: { karma: 4, xp: 60,
                  flags: { hollow_resolved: true, hollow_lantern: true },
                  recruit: "hollow" },
      choices: [{ text: "Up the turning stair together.", goto: "cindral_hub" }],
    },

    "hollow_stays": {
      text: `He listens all the way through, and at the end he shakes his head,
gently, like weather declining a request.

'There are forty of the falling in this room and one ladle,' he says,
'and the arithmetic of that is my whole remaining self. Go to the wound.
Decide well. If the catching is ever mended —' he gestures at the rows
with the bowl, an entire theology in one tired motion '— they'll know
before you do. We're closest to the news.'

He goes back to his garden. You mind the third stair on the way up.`,
      on_enter: { flags: { hollow_resolved: true, hollow_declined: true } },
      choices: [{ text: "Back to the streets.", goto: "cindral_hub" }],
    },

    "hollow_betrayed_scene": {
      text: `# The cult's ledger-keeper pays forty gold without haggling, which should
have told you the price was low.

They go down at dawn with censers and cudgels and come up by noon with
forty-one entries for the evening pyre. You don't watch this one. You hear
it, though — the whole middle city hears it, because at the end, over the
roar, one voice speaks: level, clear, unhurried, a man saying something
to the crowd about falling, and catching, and how the lonely thing was
never the water — it was the people on the shore, deciding the drowning
had stopped being people.

The voice stops mid-sentence. The cult logs the evening as routine. The
soup lines that whispered about the undercroft go silent around you,
permanently, in the way of streets that have decided what you are.`,
      on_enter: (s) => (s.companions.hollow.met
        ? { kill_companion: "hollow" } : {}),
      choices: [{ text: "Forty gold is forty gold.", goto: "cindral_hub" }],
    },

    // ----------------------------------------------------------------- camp
    "camp_cindral": {
      text: (s) => `Camp is a corner of the caravan yards: cook-fire, bedrolls, the city's
brown sky overhead, and the strange domestic peace of people sharpening
knives in company.` + ((s.inParty("maeve") && !s.flag("ghost_resolved")) ? `

Maeve has been quiet all evening, which in Maeve is a fire-bell. She sits
apart, and in her hands the silver locket is turning, turning — and you
realize the cord isn't moving. The locket is turning ITSELF, like
something rolling over in its sleep, faster than it did yesterday.` : ""),
      choices: [
        { text: "Ask Maeve about the locket.",
          when: all_of(inp("maeve"), hasnt("ghost_resolved")),
          goto: "maeve_locket" },
        { text: "Sit with Serra on watch.",
          when: all_of(inp("serra"), hasnt("serra_talk2")),
          fx: { flags: { serra_talk2: true } },
          goto: "serra_camp_talk" },
        { text: "Lose badly to Vex at knucklebones.",
          when: all_of(inp("vex"), hasnt("vex_talk2")),
          fx: { flags: { vex_talk2: true } },
          goto: "vex_camp_talk" },
        { text: "Share the fire's edge with Brother Hollow.",
          when: all_of(inp("hollow"), hasnt("hollow_talk2")),
          fx: { flags: { hollow_talk2: true } },
          goto: "hollow_camp_talk" },
        { text: "Sleep. The city will still be terrible tomorrow.",
          fx: { heal_full: true },
          goto: "cindral_hub" },
      ],
    },

    "maeve_locket": {
      text: `'My sister,' Maeve says, without preamble, when you sit. 'Orla. The
locket is Orla. Has been for twenty years.'

She doesn't perform it; she reports it, scholar to the end. 'The bog took
her when we were girls — under the ice, in the spring thaw, and I was
eleven and already reading things I shouldn't, and I did NOT accept the
arithmetic.' The locket turns in her palm. 'I caught her as she fell. The
way the god catches — the same grammar, I found it in a margin and I was
eleven and I USED it. And it works, it's worked for twenty years, she's
HERE, she's — asleep, mostly, she likes rain and being read to.'

The locket shivers. Maeve's hand closes over it.

'The shards are waking her. Every mile toward the wound she's less asleep
and more — hungry isn't the word. UNFINISHED. The catching was meant to be
brief, a hand under a falling thing, and I've held the fall half-finished
for twenty years because I am a coward of a very particular scholarly
kind.' She looks up at last. 'At the wound, everything caught gets decided.
I'll have to finish it — let her fall the rest of the way, wherever falling
goes now. Or hold on. Tell me honestly what you'd do, because I've read
every book there is and they're all useless and you're what's here.'`,
      on_enter: { xp: 30 },
      choices: [
        { text: "'Let her go, Maeve. At the wound, with both of us beside you. " +
                "Twenty years of rain and reading is a life — give it an " +
                "ending instead of a leash.'",
          fx: { karma: 4, xp: 40,
                flags: { ghost_resolved: true, ghost_release_planned: true },
                approval: { maeve: 25 } },
          goto: "maeve_locket_release" },
        { text: "'Hold on. The world's losing everything this year — it can " +
                "spare you one sister. Let the wound decide around her.'",
          fx: { flags: { ghost_resolved: true, ghost_kept: true },
                approval: { maeve: 5 }, karma: -1 },
          goto: "maeve_locket_keep" },
        { text: "'An unfinished soul is power, and we're walking into a god's " +
                "deathbed short-handed. USE her. She'd want to help.'",
          fx: { karma: -6, flags: { ghost_resolved: true,
                                    ghost_used: true },
                approval: { maeve: -20 } },
          goto: "maeve_locket_use" },
      ],
    },

    "maeve_locket_release": {
      text: `Maeve is quiet for the space of four breaths — you count them, because
she's counting them, an old bog-trick against weeping.

'Both of you beside me,' she repeats. 'Yes. All right.' And then, in a
rush, the scholar cracking right across: 'She never got to finish ANYTHING,
that's what I couldn't — she was nine, she had a loose tooth she was proud
of, she'd learned half a song. You don't let go of a half-sung song.' The
locket turns gently in her hands, and for once she lets it. 'But you're
right, and I've known you're right since the second shard started singing
to her. At the wound, then. She always wanted to see where the falling
goes.'

She reads aloud by the fire that night — to the locket, openly, for the
first time in twenty years of hiding it. Something about the rain in the
old country. The locket lies still as a listening child.`,
      choices: [{ text: "Keep the fire fed and the watch long.",
                  goto: "camp_cindral" }],
    },

    "maeve_locket_keep": {
      text: `Something in Maeve's shoulders lets down — relief, naked and immediate,
and shame at the relief arriving exactly one second later, as it always
does with her.

'Yes,' she says. 'Yes. One sister. The world can spare —' and the locket
shivers in her palm, harder than before, and her hand closes around it
with twenty years of practice, and neither of you says what you both
heard, which is that holding on is also a decision, and that the wound
will weigh it whether she carries it there or not.

She doesn't read aloud that night. She holds the locket to her ear instead,
the way you'd listen to a shell, or a door.`,
      choices: [{ text: "Let the camp settle.", goto: "camp_cindral" }],
    },

    "maeve_locket_use": {
      text: `Maeve looks at you for a long, scholarly moment — cataloguing, you
realize. Filing you, finally and completely, on the correct shelf.

'She was nine,' Maeve says. 'She is NINE. Twenty years in the silver and
she's still nine, and your counsel is that I sharpen her.' She stands,
locket vanishing into her collar. 'I've read about people like you. I
always thought the books exaggerated for effect.'

She keeps the watch alone that night, on the far side of the fire. But
you notice — because you were always going to notice — that she doesn't
say no. The idea sits in the camp now, fed and quartered. Ideas like that
keep.`,
      choices: [{ text: "Let it keep.", goto: "camp_cindral" }],
    },

    "serra_camp_talk": {
      text: (s) => `Serra takes first watch the way other people take communion. You sit
with her above the caravan yards, the city's pyre-glow on the underside
of the clouds.

'I'll tell you my question,' she says, eventually. 'The one for the
Shepherd. I've drilled it down to four words, you'll be proud.' She
doesn't look at you. 'WAS ANY OF IT—' a breath '—no. Still four words,
different ones: DID YOU SEE GREYFIELD?'

'Because there are two answers and I can survive either, but not the not
knowing. If he saw and did nothing, then the vows were a lie and I'm
free, and the freedom will be terrible. If he didn't see — if he was
already too tired, too far under his own crown to watch one village burn
in his name — then nobody was ever holding the other end of my oath, and
I held the line all those years for an empty chair. And the thing is —'
and here she does look at you, with the ghost of the Mill Bridge in her
face '— I've started hoping it's the second one. The empty chair. Because
an empty chair can't have WANTED Greyfield. You see the state of me, that
that's the comfort.'` + (s.approval("serra") >= 25 ? `

She turns her shield over in the firelight, and under the scored-out sun
you see she has begun, very faintly, re-tracing the sigil with an awl.
She catches you seeing. Doesn't stop.` : ""),
      on_enter: { xp: 25, approval: { serra: 5 } },
      choices: [{ text: "Keep the watch with her.", goto: "camp_cindral" }],
    },

    "vex_camp_talk": {
      text: `Vex deals knucklebones like a sermon and robs you blind for an hour
before they get to it.

'The brand's not a mark, you know,' they say, watching the bones fall.
'Everyone thinks it's a mark. It's a HAND. Rook's hand, on my wrist, all
day, every day, since I was ten and starving and it looked like rescue.'
They flex the wrist. 'She says a word — there's a word — and my hands do
what they're told. Doors I never meant to open. One time a window, fourth
floor, a magistrate's. I watched my own fingers do the lock and I
remember thinking: well. At least somebody knows what I'm for.'

The bones fall. Vex collects your last coppers without appearing to
notice them. 'I don't want her dead, particularly, whatever I say in the
daylight. I want the WORD dead. I want to be the only one inside these
hands. That's the whole heist, the only one that's ever mattered.' A
shrug, performed. 'Anyway. Your roll. You're terrible at this, it's
soothing.'`,
      on_enter: { xp: 25, approval: { vex: 5 }, gold: -2 },
      choices: [{ text: "Lose a few more rounds on purpose.",
                  goto: "camp_cindral" }],
    },

    "hollow_camp_talk": {
      text: `Brother Hollow doesn't eat much, or sleep at all, that you've seen. He
sits at the fire's edge at night like a man sitting up with a sick friend,
and the sick friend is everything.

'Ask it,' he says, mildly, catching you watching. 'Everyone needs to ask
it.' So you ask it: what is it like?

'Quiet,' he says, after real thought. 'You lose the names first — not the
things, the names. I'd look at my wife and know everything she was to me
and not be able to find the word WIFE, and then not the word HER, and the
whole time — this is what no one believes — the whole time, the loving
itself sat there untouched. Bigger, if anything. The Withering takes the
LABELS off the world, friend. It turns out almost everything survives
that. We just can't TELL anyone it survived. We're an unlabeled jar on the
world's shelf, and the cult reads the missing label as empty.'

He feeds the fire one stick, precisely. 'When you reach the wound, and
the deciding — remember the jar's not empty. That's all. That's my whole
embassy.'`,
      on_enter: { xp: 30, approval: { hollow: 5 }, karma: 1 },
      choices: [{ text: "Sit with him a while longer.", goto: "camp_cindral" }],
    },

    // ----------------------------------------------------- the pyre cathedral
    "solenne_audience": {
      text: `The Pyre Cathedral at dusk service is a furnace pretending to be a
church, or possibly the reverse. The old granary-temple's vault swallows a
thousand worshippers; the air swims; and on the high altar, in a brazier
the size of a millpond, burns the thing they all came for.

The Flame Undying. A fire that has needed no fuel for a year — because at
its heart, suspended, blazing without being consumed, hangs a shard of the
Hollow Crown. You feel your own shard answer it through your pack, a long
harmonic ache, two halves of a broken bell.

Hierarch Solenne preaches beneath it: a spare, burn-scarred woman with a
voice like a banked fire, and her sermon is the most dangerous kind — the
kind that's half right. 'The god is not silent — the god is REFINED! What
withers was always going to wither; the Flame keeps only what is TRUE!
Bring your grief to the fire, Cindral, and watch what your grief weighs!'

After the service, her wardens watch the crowd disperse — and watch you,
specifically, with the alert courtesy of guards who have been told to
expect someone like you.`,
      choices: [
        { text: "Present the Queen Regent's writ and demand the shard in the " +
                "throne's voice.",
          when: item("writ_regent"),
          check: { stat: "spirit", dc: 11,
                   ok: "cathedral_writ", fail: "cathedral_writ_fail" } },
        { text: "Submit to the cult's own law: claim the Trial of Flame. Walk " +
                "the coals; what the fire keeps is true.",
          goto: "cathedral_trial_intro" },
        { text: "Case the cathedral and come back for the shard at night.",
          check: { stat: "wits", dc: 14,
                   ok: "cathedral_heist", fail: "cathedral_heist_fail" } },
        { text: "Take the altar by force, in front of the faithful.",
          combat: { enemy: "pyre_guard", win: "cathedral_fight_won" } },
        { text: "Approach Solenne as a friend of the Flame — your record " +
                "speaks for you.",
          when: any_of(has("chanted_with_cult"), has("fed_pyre"),
                       has("cult_friend"), (s) => s.karma <= -12),
          goto: "cathedral_champion" },
      ],
    },

    "cathedral_writ": {
      text: `You read the writ from the altar steps in the voice the throne lent
you, and the cathedral's politics do the rest. Because half of Solenne's
congregation are the Regent's subjects first and converts second; because
the wardens' captain was a city guard four years ago and his pension still
says so; because Solenne, whatever her fire believes, can count.

'The throne demands the god's property,' she says at last, into the
silence, making it a sermon even now. 'Let it be recorded that the Flame
DOES NOT CONTEST — that the fire keeps what is true, and what is taken by
paper was never the fire's to keep.' Her eyes, finding yours, are banked
and patient. 'Carry it where you're carrying it, paper-bearer. The Flame
has seen its own future. We will warm ourselves on the spare.'

The wardens bring the shard out of the Undying Flame in tongs of temple
silver. The fire above the altar gutters as it leaves — and does not go
out, which you elect not to mention to anyone.`,
      on_enter: { xp: 70, "items+": ["crown_shard_2"],
                  flags: { shard2_done: true, has_shard2: true,
                           shard2_writ: true },
                  approval: { maeve: 5 } },
      choices: [{ text: "Out, before the politics reconsider.",
                  goto: "cindral_hub" }],
    },

    "cathedral_writ_fail": {
      text: `The writ is real; your delivery wobbles; and Solenne is a professional
of the spoken word in her own house. 'PAPER,' she announces, to a thousand
of the faithful, holding your writ up to the Flame's light, 'asks the FIRE
for collateral,' — and the cathedral laughs, one beast with a thousand
throats, and the moment is hers and was always going to be.

The wardens return the writ to you with ceremonial care, which is somehow
worse than confiscation. The throne's voice has been spent here, at a loss.
Other doors remain.`,
      on_enter: { "items-": ["writ_regent"], flags: { writ_burned: true } },
      choices: [{ text: "Withdraw and reconsider.", goto: "solenne_audience" }],
    },

    "cathedral_trial_intro": {
      text: (s) => `The Trial of Flame is the cult's oldest law and its best theater, and
Solenne grants it instantly — refusing trials is bad doctrine and worse
showmanship.

A path of coals, raked fresh from the Undying Flame itself, forty feet from
the cathedral doors to the altar. 'What the fire keeps is true,' Solenne
tells the packed vault, 'and what is true may carry the truth away. Walk,
claimant. The Flame is listening.'` + (s.hasItem("soul_lantern") ? `

At your hip, the soul-lantern has begun to glow — not the alarm-glare of a
lie. The hearth-warmth of truth, gathering. Three hundred years of Ashfen's
dead, who were burned by this cult's own doctrine, pressing toward the
glass like neighbors coming to a door.` : ""),
      choices: [
        { text: "Unhood the lantern and walk the coals with Ashfen's dead held " +
                "high.",
          when: item("soul_lantern"),
          goto: "cathedral_trial_lantern" },
        { text: "Walk the coals on faith and feet.",
          check: { stat: "spirit", dc: 14,
                   ok: "cathedral_trial_won", fail: "cathedral_trial_lost" } },
        { text: "Think better of the whole arrangement.",
          goto: "solenne_audience" },
      ],
    },

    "cathedral_trial_lantern": {
      text: `You walk the coals carrying the lantern before you like a lamp at a
window, and the cathedral watches the cult's own theology turn in its hand.

Because the dead of Ashfen were burned by this doctrine — burned as chaff,
logged in a ledger — and here they come back up the aisle glowing like a
wedding, three hundred years of them, the kept and cherished dead of the
grey country, blazing TRUE in the fire's own grammar. The coals under your
feet are a rumor. The lantern outshines the Undying Flame itself, and every
face in the vault can see it do it, and somewhere in the third rank of
wardens a man who helped stack a grain-hall's kindling goes to his knees.

You lift the shard out of the Flame with your bare hand. It comes like a
key from a lock.

Solenne watches all of it without moving. At the end she says, quietly,
in the voice without the sermon in it: 'Whose dead are those?' — and you
tell her, and she closes her eyes briefly, and the Flame at her back
gutters in a draft that isn't there. 'Carry them out,' she says. 'Carry
them all the way. If the fire lied to me about THAT, it has lied to me
about more.' The schism this plants in the Ember Cult will not flower for
a season. It will flower.`,
      on_enter: { xp: 100, karma: 5,
                  "items+": ["crown_shard_2"],
                  flags: { shard2_done: true, has_shard2: true,
                           shard2_trial: true, solenne_doubt: true },
                  approval: { maeve: 10, serra: 8, hollow: 8 } },
      choices: [{ text: "Carry them out.", goto: "cindral_hub" }],
    },

    "cathedral_trial_won": {
      text: `You walk. That's the whole secret, in the end — the coals are real and
the burns will be real, but forty feet is forty feet whether you believe
in it or not, and you have walked through worse this year and the walking
shows.

The vault is silent the whole way. When you lift the shard from the Flame
— bare-handed, because the trial's grammar demands it, and the pain is a
white country you visit briefly and leave — a thousand of the faithful
exhale at once, and Solenne's voice cracks across the vault like a closing
book: 'THE FLAME KEEPS WHAT IS TRUE. It has weighed the claimant. THE
CLAIM IS TRUE.' She says it because the doctrine leaves her nothing else
to say, and the look she gives you over the guttering altar says she knows
exactly what the doctrine has cost her tonight.`,
      on_enter: { xp: 90, karma: 3, hp: -6,
                  "items+": ["crown_shard_2"],
                  flags: { shard2_done: true, has_shard2: true,
                           shard2_trial: true },
                  approval: { maeve: 8, serra: 8 } },
      choices: [{ text: "Walk out on scorched feet, slowly, like a victor.",
                  goto: "cindral_hub" }],
    },

    "cathedral_trial_lost": {
      text: `Twenty feet in, the fire wins the argument.

It's not the pain that breaks the walk — it's the gasp you make at the
pain, and the half-step sideways, and the doctrine is precise about
half-steps. Wardens haul you off the coals with hooked poles, efficient
and almost kind; failing the Trial is routine theater to them, the house
nearly always wins.

'The Flame keeps what is true,' Solenne tells the vault, gently, over
your smoking boots. 'It has weighed the claim and found it — unfinished.'
A pause, and then, dry as tinder: 'The claimant may compost their
ambitions and return when more of them is true.'

You are escorted out with your burns and the laughter of a thousand
believers, which hurts longer.`,
      on_enter: { hp: -10, flags: { trial_failed: true } },
      choices: [{ text: "Recover, and find another way.",
                  goto: "solenne_audience" }],
    },

    "cathedral_heist": {
      text: (s) => `The cathedral at night keeps a skeleton watch — faith is cheap labor
but it sleeps like anyone — and the Undying Flame, being undying, needs no
tending. You go in through the granary's old chaff-vents, above the vault,
down a bell-rope` + (s.inParty("vex") ? " with Vex flowing ahead of you like a rumor" : "") + `, into heat like a wall.

The shard hangs in the Flame's heart, and here is the thing the cult's
theater conceals: there are TONGS. Temple silver, racked behind the altar
like fireplace furniture, because however undying the Flame, somebody
mortal has to adjust the exhibit. Doctrine is doctrine, but maintenance is
maintenance.

The shard comes out of the fire singing. The Flame gutters, recovers,
diminished — the congregation will be told it's a sign, and will be told
of what, once the Hierarchy decides. You are over the vent-sill with a
piece of the god's crown in your pack before the watch changes.`,
      on_enter: (s) => ({ xp: 80, "items+": ["crown_shard_2"],
                          flags: { shard2_done: true, has_shard2: true,
                                   shard2_heist: true },
                          approval: Object.assign({ maeve: 8 },
                            s.inParty("vex") ? { vex: 10 } : {}) }),
      choices: [{ text: "Gone by lauds.", goto: "cindral_hub" }],
    },

    "cathedral_heist_fail": {
      text: `The chaff-vent's grate has been replaced since the granary days —
recently, in good steel, by someone who thinks about chaff-vents, and the
noise of discovering this brings the watch at a run. You make the rooftops
ahead of the alarm, but the cathedral knows it was visited, and by dawn
the Flame has acquired a triple guard and the vents have acquired bars.

The night-door has closed. The remaining doors are all daylight.`,
      on_enter: { hp: -3, flags: { cathedral_alert: true } },
      choices: [{ text: "Fall back and rethink.", goto: "solenne_audience" }],
    },

    "cathedral_fight_won": {
      text: `The Pyre-Warden falls on the altar steps with a sound like a dropped
forge, and the vault — packed for dusk service — does not riot. That's the
eerie part. A thousand of the faithful watch you stand over their champion
in the light of their relic, and wait, with the silence of people whose
doctrine has just been asked a direct question.

Hierarch Solenne descends the altar alone. No wardens. She looks at the
Warden's scorched plate, at you, at the Flame.

'The fire keeps what is true,' she says, perfectly steady, 'and the fire
just watched. I won't pretend the doctrine has no opinion about strength.'
She gestures at the racked silver tongs. 'Take the splinter, if your claim
is your arm. But know what you're teaching this room: a thousand of my
faithful are learning, right now, that the sacred yields to the strongest
hand in the building. Some of them will remember that lesson on nights
when YOU are not the strongest hand. Cindral's nights are long.'`,
      choices: [
        { text: "Take the shard with the tongs and walk out through their " +
                "silence.",
          fx: { xp: 70, karma: -4, "items+": ["crown_shard_2"],
                flags: { shard2_done: true, has_shard2: true,
                         shard2_force: true } },
          goto: "cindral_hub" },
        { text: "Kill Solenne too. Schisms need martyrs; better she not be " +
                "alive to lead one.",
          fx: { xp: 60, karma: -9, "items+": ["crown_shard_2"],
                flags: { shard2_done: true, has_shard2: true,
                         shard2_force: true, solenne_dead: true },
                approval: { serra: -15, maeve: -10, hollow: -10 } },
          goto: "solenne_dead_scene" },
      ],
    },

    "solenne_dead_scene": {
      text: `She doesn't resist. That will be the famous part, the part the cult's
chroniclers set down before her body cools: the Hierarch opened her arms
to the blade in front of the Undying Flame and a thousand witnesses, and
said — they'll engrave it on the cathedral lintel within the month —
'The fire keeps what is true. Keep me, then.'

You've killed one woman and minted ten thousand zealots. The Ember Cult
has been a fire looking for a shape all year. You have just given it a
saint, and saints are load-bearing.

The shard sings in your pack all the way out through the silent vault,
past faces already hardening into the congregation of the Martyred Flame.`,
      choices: [{ text: "What's done is done. Out.", goto: "cindral_hub" }],
    },

    "cathedral_champion": {
      text: `Solenne receives you in the calefactory behind the altar, where the
Flame's heat comes through the wall and the cult's ledgers line the
shelves — and your name is in those ledgers, with annotations, which is
the point of this audience being granted at all.

'The Flame remembers its friends,' she says, finding the entries. The
torch at a village pyre. The names sold. The kindling fed. She reads your
record the way a banker reads collateral, and at the end she looks up
with the banked fire steady in her eyes.

'Here is what the Hierarchy believes, friend of the Flame. The wound in
the world is a pyre half-lit. The god is on it. Something keeps the fire
from finishing — grief, His or the world's, walking the wound's edge and
hoarding the ashes. The Flame wants what any honest fire wants: to
COMPLETE. Carry our splinter south. Let it reach the wound. Let the pyre
finish, and the world be done withering by being done entire — clean,
true, and at rest.' She holds the shard out in her scarred bare hands,
and it does not burn her, and her certainty is the most frightening
furniture in the room. 'The Flame's blessing travels with its champion.
Spend it as you spend everything else we've watched you spend.'`,
      on_enter: { xp: 60, karma: -5,
                  "items+": ["crown_shard_2"],
                  flags: { shard2_done: true, has_shard2: true,
                           cult_champion: true } },
      choices: [{ text: "Take the shard and the title, and keep your own " +
                        "counsel about the spending.",
                  goto: "cindral_hub" }],
    },

    // ------------------------------------------------------- act transition
    "act2_camp": {
      text: (s) => camp_departures(s) + `You leave Cindral by the south gate at dawn, and that night, with two
shards of the Hollow Crown singing harmonics in your pack, the metal shows
you the rest of the memory.

The hands again — vast, rope-burned, patient — but older now, the
rope-burns worn to grooves. You feel what the hands feel: every thread of
the world's life running through the Crown and the Crown resting on one
brow, forever, with no relief and no shift-change and no one to watch the
watcher. You feel the petition the god made — to WHOM, the memory flinches
from showing — and you feel the answer: no one came. No one was coming.
There was never anyone to come.

And so you feel the god do the only thing left in the world to do, the
thing the chapels will never paint: he reaches up with both hands, and
takes hold of his own crown, and BREAKS it — and the breaking tears him
in half. The half that hoped falls south, toward the monastery, dying.
The half that screamed walks away across the ash, gathering grief to it
like a cloak, looking for a way to make the pain be OVER for everything,
everywhere, forever.

# The Shepherd of Ash.

You wake with the name in your mouth and the dawn
the color of old iron. South, the road runs out of the living lands
entirely. Everything from here is grey.`,
      on_enter: { xp: 50, heal_full: true,
                  flags: { knows_truth: true } },
      choices: [
        { text: "Walk into the grey.", goto: "road_wound" },
      ],
    },
  };

  HC.story = HC.story || {};
  HC.story.act2 = { SCENES };
})(globalThis.HC);
