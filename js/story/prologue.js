/* Prologue: who you were, the burning of Ashfen, and the road to Briarwatch.
   Ported from mythos/story/prologue.py.
   Beat markers: a paragraph starting with "# " is forced punchline styling,
   "= " forces plain styling; both are stripped before display. */
(function (HC) {
  "use strict";

  const { gold, hasnt, item, no_item } = HC.helpers;

  function pickBackground(which) {
    return function (s) {
      s.player.background = which;
      if (which === "veteran") {
        s.player.stats.might += 2;
        return { "items+": ["rusted_sword", "leather_jerkin"] };
      }
      if (which === "scribe") {
        s.player.stats.wits += 2;
        return { "items+": ["quill_knife", "bread", "bread"] };
      }
      if (which === "gutterborn") {
        s.player.stats.wits += 1;
        s.player.stats.might += 1;
        return { "items+": ["gutter_shiv"], gold: 15 };
      }
    };
  }

  const SCENES = {
    // ------------------------------------------------------------- opening
    "intro": {
      text: (s) => `One year ago, the god went silent.

His name was Vael, the Shepherd, and for three thousand years his Hollow Crown
hung in the sky above the Sunken Monastery like a second, kinder moon. Priests
say he wove the world's life through it the way a weaver runs thread through a
loom: every harvest, every birth, every small mercy, drawn from the Crown's
turning.

Then, on a night no one marked as special, the Crown cracked apart and fell.
Three shards, three falling stars. And where the light of the Crown no longer
reaches, the Withering creeps in: grass going grey as old hair, rivers
forgetting which way to run, and people — people going Hollow, walking
emptied, their names draining out of them like warmth from a corpse.

The priests call it a test. The Ember Cult calls it a filth to be burned. The
wise call it what it is: the world, unraveling.

You, ${s.player.name}, are three days' walk from anywhere that matters,
following the smell of smoke toward the village of Ashfen. You don't yet know
that the road you're on ends at the wound in the world — or that the world
will remember every single thing you do along the way.

But before the smoke. Before the road. Who were you, when the world was still
whole?`,
      choices: [
        { text: "A veteran of the Greyfield Massacre — you held a sword for the " +
                "Dawnward Shield, and you were there the day the order disgraced " +
                "itself. (+2 Might; a soldier's gear and a soldier's ghosts)",
          fx: pickBackground("veteran"), goto: "intro_veteran" },
        { text: "A scribe of the Shattered Temple — you copied the god's words " +
                "until the night the archive burned, and you can read the First " +
                "Tongue no one is meant to read. (+2 Wits; ink-stained hands, " +
                "forbidden letters)",
          fx: pickBackground("scribe"), goto: "intro_scribe" },
        { text: "Gutterborn of Cindral — the capital raised you on scraps and " +
                "lessons with knives, and you know exactly what people do when no " +
                "god is watching. (+1 Might, +1 Wits, +15 gold; a shiv and no " +
                "illusions)",
          fx: pickBackground("gutterborn"), goto: "intro_gutterborn" },
      ],
    },

    "intro_veteran": {
      text: `Greyfield. Even now the name lands in your chest like a dropped stone.

A village of weavers, accused of harboring heretics. Commander Bannor Crayce
gave the order at dawn and called it the god's justice; by noon there was no
one left in Greyfield to dispute the record. You carried water that day, and
a sword, and you have spent every day since deciding which of those facts
defines you.

The Order of the Dawnward Shield broke apart in the scandal that followed. A
knight named Serra Valebright took the blame — they say she's a hedge-blade
now, guarding refugee columns for bread. They say Crayce, who wrote the
order, sells his sword in Cindral and dines with magistrates.

# The god went silent eleven months after Greyfield. Some nights you wonder if
he saw it. Some nights you wonder if that's what did it.`,
      choices: [
        { text: "Shoulder your pack and follow the smoke.", goto: "ashfen",
          fx: { xp: 10 } },
      ],
    },

    "intro_scribe": {
      text: `You still dream in ink.

The Shattered Temple kept the oldest scriptorium in the realm — shelves of
the First Tongue, the language Vael spoke before he taught the world a
simpler one. You were the youngest copyist ever trusted with the sealed
stacks, and you read things there you were made to swear you hadn't:
marginalia in the god's own hand, corrections, crossings-out. A god who
revised himself. A god who, in one terrifying annotation beside a hymn of
praise, had written a single word: 'tired.'

Then the Ember Cult came with torches, calling the archive a nest of heresy,
and three thousand years of the god's correspondence went up in a single
night. You saved what your arms could carry. It wasn't enough. It is never
enough.

# The god went silent the same season. You may be one of a dozen people alive
who suspects he meant to.`,
      choices: [
        { text: "Shoulder your satchel and follow the smoke.", goto: "ashfen",
          fx: { xp: 10 } },
      ],
    },

    "intro_gutterborn": {
      text: `Cindral, the brass city, raised you the way a river raises a stone: by
knocking off every soft edge.

You ran messages for Mother Rook before you could read, picked locks before
you could write, and learned the city's one true catechism early — everyone
prays, and the gutter floods anyway. You watched temple processions roll past
starving children scattering like pigeons, and you drew the obvious
conclusion about how much shepherding this Shepherd actually did.

When word came that the god had gone silent, the priests wept in the streets.
In the gutter, people laughed — quietly, the way you laugh at a landlord's
funeral. Then the Withering reached the slums first, the way everything bad
does, and nobody was laughing anymore.

You left the city owing Mother Rook nothing, which is the only kind of
leaving she permits. You're one of the few who ever managed it. Mostly.`,
      choices: [
        { text: "Palm your shiv and follow the smoke.", goto: "ashfen",
          fx: { xp: 10 } },
      ],
    },

    // ------------------------------------------------------------- ashfen
    "ashfen": {
      text: `Ashfen is burning, and not by accident.

The village sits in a fold of grey hills — and it is grey, all of it, the
Withering thick here: hedgerows the color of cobwebs, an orchard of trees
like drowned hands. Half the houses are already alight. Figures in cinder-red
robes move between them with torches, methodical as harvesters. The Ember
Cult. You can hear them chanting over the fire's roar: 'What withers, burns.
What burns, is clean.'

And from the great grain-hall at the village center — the only building still
whole — you hear something else. Voices. People. The doors are barred from
the outside, and the cultists are stacking kindling against them.

# Not everyone in there will be Hollowed. The cult has never much cared about
the difference.`,
      choices: [
        { text: "Rush the grain-hall and break the doors before the kindling " +
                "catches.",
          check: { stat: "might", dc: 12,
                   ok: "ashfen_saved", fail: "ashfen_burned" } },
        { text: "Confront the cultists themselves — someone is giving these " +
                "orders.", goto: "ashfen_cult" },
        { text: "The village is dying either way. Slip through the burning " +
                "houses and take what the dead no longer need.",
          fx: { karma: -5, gold: 20, flags: { looted_ashfen: true } },
          goto: "ashfen_loot" },
        { text: "Keep to the shadows and watch. You survive by knowing when a " +
                "fight isn't yours.", goto: "ashfen_watch" },
      ],
    },

    "ashfen_saved": {
      text: `The bar is oak and iron, hot enough to sear your palms, and it does not
matter. You tear it loose and the doors burst outward in a flood of smoke and
people — a swineherd carrying his mother, two children glued to a weeping
man's legs, a dozen more. Some shamble rather than run, grey-eyed and silent.
Hollowed. They burn the same as anyone.

A cultist rounds on you, torch raised, and stops. Whatever is in your face,
he decides his faith does not cover it. The cinder-robes withdraw to the far
end of the village to finish their hymn, leaving the living to you.

The swineherd grips your arm hard enough to bruise. 'The Keeper,' he says.
'Keeper Lysa — she went back for the lantern. The old chapel. Please.'`,
      on_enter: { karma: 6, xp: 40, flags: { saved_ashfen: true } },
      choices: [
        { text: "Go to the chapel and find Keeper Lysa.", goto: "ashfen_keeper" },
        { text: "You've done enough. Take the road before the cult reconsiders.",
          fx: { karma: -1 }, goto: "road_merchant" },
      ],
    },

    "ashfen_burned": {
      text: `The bar defeats you. It defeats you for the length of three breaths —
and a burning roof-beam does not wait. It comes down across the doors in a
gout of sparks, and the screaming inside climbs one terrible note, and you do
the only thing left: you go through the side wall's shuttered window with
your shoulder, into an oven of smoke, and you come out dragging one child by
the collar while the grain-hall folds in on itself behind you.

One. Out of how many?

The child won't stop staring at the fire. You won't either, for years.

A swineherd with burned hands finds you in the ash-fall. 'The Keeper,' he
rasps. 'Keeper Lysa, at the old chapel. She went back for the lantern.
Whatever you are — be there.'`,
      on_enter: { karma: 3, xp: 25, hp: -6,
                  flags: { ashfen_partial: true } },
      choices: [
        { text: "Go to the chapel and find Keeper Lysa.", goto: "ashfen_keeper" },
        { text: "You can't look at this place anymore. Take the road.",
          goto: "road_merchant" },
      ],
    },

    "ashfen_cult": {
      text: `Their leader is easy to find: a tall woman with a brazier on a chain,
her hood thrown back, her scalp tattooed with flames. A Pyre-Speaker. She
watches you come with the serenity of someone who has already decided what
everything means.

'The village was Hollowing,' she says, conversationally, as a house collapses
behind her. 'A third of them grey-eyed already. The emptiness spreads, friend.
It crawls from the husk to the whole. We do not burn out of hate.' She gestures
at the grain-hall, at the kindling. 'We burn the way you cauterize.'

Inside the hall, someone is begging. The Pyre-Speaker does not appear to hear
it. 'Stand with us, or stand aside. The Flame quarrels with no one who lets
it work.'`,
      choices: [
        { text: "'Half those people aren't even Hollowed. Call your harvesters " +
                "off, or the Flame learns to quarrel.'",
          check: { stat: "spirit", dc: 13,
                   ok: "ashfen_cult_yield", fail: "ashfen_cult_beaten" } },
        { text: "Say nothing. Pick up a torch from the stack, and join the hymn.",
          fx: { karma: -8, flags: { chanted_with_cult: true }, xp: 20 },
          goto: "ashfen_dark" },
        { text: "Walk away from her, straight to the grain-hall doors.",
          check: { stat: "might", dc: 12,
                   ok: "ashfen_saved", fail: "ashfen_burned" } },
      ],
    },

    "ashfen_cult_yield": {
      text: `Something in your voice lands. Perhaps it's the way you say it without
reaching for a weapon — people who don't reach for weapons frighten zealots
more, because conviction recognizes conviction.

The Pyre-Speaker studies you for a long moment. 'The Flame quarrels with no
one,' she repeats, softer, and makes a small sign. The cultists pull the
kindling back from the doors. 'Sort your wheat from your chaff yourself,
then. We will be in Cindral when you understand what mercy costs.' She walks
into the smoke with her brazier swinging, unhurried, and her harvesters
follow.

You unbar the hall. The living spill out into the ash. Some walk strangely,
grey-eyed; the rest weep. A swineherd grips your arm: 'The Keeper went back
for the lantern. The old chapel. Hurry.'`,
      on_enter: { karma: 6, xp: 50, flags: { saved_ashfen: true,
                                             faced_speaker: true } },
      choices: [
        { text: "Find Keeper Lysa at the chapel.", goto: "ashfen_keeper" },
        { text: "Leave Ashfen to bury itself. Take the road.",
          fx: { karma: -1 }, goto: "road_merchant" },
      ],
    },

    "ashfen_cult_beaten": {
      text: `'Conviction,' the Pyre-Speaker says, with something like approval, 'but
unlettered.' She flicks two fingers and a cudgel takes you behind the knee,
another across the shoulders, and the ground introduces itself thoroughly.
They don't kill you. That's the worst of it — they step over you like furniture
and go back to work, and you lie in the mud listening to the hymn and the
grain-hall both reaching their crescendo.

By the time your legs obey you, the doors are a wall of flame. You break the
side shutters and drag one child out of the oven inside. One.

The cult moves on before dawn. A swineherd with ruined hands tells you the
village Keeper went back for something — a lantern, at the old chapel.`,
      on_enter: { karma: 2, xp: 20, hp: -8,
                  flags: { ashfen_partial: true, faced_speaker: true } },
      choices: [
        { text: "Find Keeper Lysa at the chapel.", goto: "ashfen_keeper" },
        { text: "Limp to the road and don't look back.", goto: "road_merchant" },
      ],
    },

    "ashfen_dark": {
      text: `The hymn has a shape your mouth learns with disturbing ease. 'What
withers, burns. What burns, is clean.' You carry fire down the lane of a
dying village, and somewhere behind you the grain-hall stops screaming, and
you discover that a person can simply decide not to hear a thing, the way
you decide not to pick something up.

The Pyre-Speaker finds you afterward, watching the embers. 'You burn like
someone settling a debt,' she observes. 'The Flame remembers its friends.
In Cindral, say that the Speaker of the western road vouches your ash.'
She presses something warm into your hand: a sword taken off some dead
militiaman, its blade kissed by her brazier. It has not cooled since.

# The cult files out singing. You stand alone in what used to be a village,
owning a piece of what happened to it.`,
      on_enter: { "items+": ["ember_brand"], xp: 20 },
      choices: [
        { text: "There was talk of a Keeper and a lantern, at the chapel. See " +
                "what the fire left.", goto: "ashfen_keeper" },
        { text: "Take the road. The smell of this place is already a memory you " +
                "don't want.", goto: "road_merchant" },
      ],
    },

    "ashfen_loot": {
      text: `The dead are not using their savings. You move through smoke-filled
kitchens and bedrooms with a practiced economy — a jar of coins behind a
loose hearthstone, a silver chain on a hook, a soldier's ring on a windowsill
where somebody's son left it the day he marched off.

Behind you, intermittently, the grain-hall. You keep your accounting precise
and your ears closed. It's a skill.

The last house before the chapel belongs to someone important — herb-bundles,
chalked sigils, a Keeper's house. Inside, an old woman lies where the smoke
took her legs out from under her, still crawling toward the door, still
alive. Her eyes find you. Past you, at her table, sits a lantern of grey
glass, lit from within by a light like cold milk — and the light is moving,
gently, like a dozen small things breathing.

'Thief,' the old woman says. Not an accusation. An identification. 'Well.
Even a thief has hands. Listen to me, thief.'`,
      choices: [
        { text: "Kneel and hear her out.", goto: "ashfen_keeper" },
        { text: "Take the lantern from the table and step over her.",
          fx: { karma: -6, "items+": ["soul_lantern"],
                flags: { lantern_stolen: true, left_lysa: true }, xp: 15 },
          goto: "road_merchant" },
      ],
    },

    "ashfen_watch": {
      text: `You find a cold chimney to stand against and you watch a village die.
It takes about two hours. You learn things — you always do, that's the point
of watching. You learn that the cult burns the Hollowed and the whole alike
and logs both in a ledger, like an inventory. You learn that their
Pyre-Speaker pockets a fistful of grave-silver when her flock isn't looking,
which tells you everything about every faith you've ever met.

# And you learn that when a Hollowed man walks out of a burning house, hair
alight, he doesn't scream. He just keeps walking, until he doesn't.

When the cult moves on, the survivors creep back from the tree line. A
swineherd sees you in your doorway shadow and flinches — then decides you're
nothing, which stings precisely because it's accurate. 'The Keeper,' he tells
the others. 'She went back for the lantern. The chapel.'`,
      on_enter: { xp: 15, flags: { watched_ashfen: true } },
      choices: [
        { text: "Follow them to the chapel. Curiosity is also a reason.",
          goto: "ashfen_keeper" },
        { text: "You've seen what there was to see. Take the road.",
          goto: "road_merchant" },
      ],
    },

    "ashfen_keeper": {
      text: (s) => (`The chapel of Vael is the oldest thing in Ashfen and the fire wanted
it badly; the roof is gone and the Shepherd's mural weeps soot. Keeper Lysa
lies beneath it` + (
        s.flag("looted_ashfen")
          ? " where you left her, having dragged herself the whole way"
          : ", smoke-burned and past saving"
      ) + `, with a lantern of grey glass cradled against her chest. The light inside
it moves like breath.

'Closer,' she says, and you come closer, because some voices still work even
when the body is finished. 'Do you know what a Keeper keeps? Not the chapel.
Not the god — gods keep themselves, or they don't, as we have all lately
learned.' A wet laugh. 'Breaths. The last breath of every soul in my parish,
caught and kept, so that when they reached the Shepherd's fields he would
know each one by name. Three hundred years of Ashfen is in this glass.
Everyone who died today is in this glass.'

Her grip on your wrist is astonishing. 'The Crown is broken and the dead
have nowhere to go. Take them. There is a wound in the world, south past
Cindral, where the god used to be — take my parish to the wound, and let
them out where he might still catch them falling. And mind it well, child:
the lantern brightens near a lie. The dead were lied to enough alive.'

Her eyes are already greying. 'Swear it. Or don't, and be honest. But
decide quickly.'`),
      choices: [
        { text: "Swear it, and mean it. Take the lantern as a charge.",
          fx: { karma: 5, "items+": ["soul_lantern"], xp: 30,
                flags: { lantern_sworn: true } },
          goto: "lysa_dies" },
        { text: "Take the lantern, swear nothing. You don't make promises to " +
                "the dying.",
          fx: { "items+": ["soul_lantern"], xp: 20,
                flags: { lantern_taken: true } },
          goto: "lysa_dies" },
        { text: "Refuse. You are nobody's pallbearer, and three hundred years " +
                "of ghosts is not your luggage.",
          fx: { karma: -2, flags: { lantern_refused: true } },
          goto: "lysa_dies" },
        { text: "Take it because it's clearly valuable, and a dying woman's " +
                "wishes are not enforceable.",
          when: (s) => s.karma < 0,
          fx: { karma: -4, "items+": ["soul_lantern"], xp: 15,
                flags: { lantern_taken: true, lantern_greed: true } },
          goto: "lysa_dies" },
      ],
    },

    "lysa_dies": {
      text: (s) => (`Keeper Lysa watches your decision settle, and whatever she sees, she
keeps her opinion of it — which is, you suspect, the last discipline of a
long life spent listening to deathbeds.

` + (s.flag("lantern_sworn")
        ? "'Good,' she says simply, and the lantern flares once, warm, as if three " +
          "hundred years of Ashfen agreed."
        : s.flag("lantern_taken") && !s.flag("lantern_greed")
        ? "'Honest, at least,' she says. 'The dead can work with honest.'"
        : s.flag("lantern_greed")
        ? "'A thief to the end of the world, then,' she says. 'Carry them anyway. " +
          "Even a thief walks somewhere.'"
        : "'Then they will wait here in the glass,' she says, 'and what waits, " +
          "fades. May you never learn what that costs.' The reproach in the " +
          "lantern's dimming is hard to look at.") + `

'One more thing,' she says, fainter now. 'The barrow east of Briarwatch. The
old king under the hill. A piece of the Crown fell there — I felt it land,
we all did, every Keeper in the grey country. The wight will be awake by
now, and he was furious about the god three thousand years before it was
fashionable.' The ghost of a smile. 'Mind your manners under the hill.'

# Then she is gone, and the chapel is just a burned room, and the road south
is waiting.`),
      choices: [
        { text: "Build her a cairn from the chapel stones before you go.",
          fx: { karma: 2, xp: 10, flags: { buried_lysa: true } },
          goto: "road_merchant" },
        { text: "Leave her beneath her god's scorched mural. It's where she'd " +
                "want to be.", goto: "road_merchant" },
      ],
    },

    // ----------------------------------------------------- the pale merchant
    "road_merchant": {
      text: `The road south runs along the spine of the grey hills, and you have
been walking it for half a day when you notice the wagon — which is wrong,
because there is nowhere it could have come from. No side-track. No dust. It
is simply there at the next bend, parked under a withered elm: a high
narrow wagon of pale wood, hung with hundreds of small objects on strings.
Keys. Baby teeth. Wedding rings. A sundial. They turn in a wind you can't
feel.

The man on the driver's bench is long and white as a peeled stick, dressed
in mourning grey, with a smile that arrives slightly before the rest of his
face. 'Traveler!' he says, delighted, as though resuming a conversation.
'And bound for the wound in the world, no less — oh, don't look surprised,
everyone on this road is, eventually, it's the only place the road goes
anymore.'

He spreads long fingers over his wares. 'I am a buyer, chiefly. Of things
that cannot be sold. But for you — browse. The end of the world does
wonders for my prices.'`,
      on_enter: { flags: { met_merchant: true } },
      choices: [
        { text: "Buy a Pale Elixir. (15 gold — heals 15)",
          when: gold(15),
          fx: { gold: -15, "items+": ["elixir"] },
          goto: "road_merchant" },
        { text: "Buy an Herbal Poultice. (6 gold — heals 8)",
          when: gold(6),
          fx: { gold: -6, "items+": ["poultice"] },
          goto: "road_merchant" },
        { text: "Buy the Wyrmglass Dagger. (40 gold — weapon +3)",
          when: (s) => gold(40)(s) && no_item("wyrmglass_dagger")(s),
          fx: { gold: -40, "items+": ["wyrmglass_dagger"] },
          goto: "road_merchant" },
        { text: "Trade for the Wyrmglass Dagger with what he really wants: 'a " +
                "memory of warmth.' (lose 1 Spirit)",
          when: (s) => no_item("wyrmglass_dagger")(s)
                       && s.player.stats.spirit >= 1,
          fx: { "stat-": "spirit", "items+": ["wyrmglass_dagger"], karma: -2,
                flags: { sold_memory: true } },
          goto: "merchant_memory" },
        { text: "Sell him the soul-lantern. He's offering 60 gold and he's " +
                "trying not to look eager.",
          when: item("soul_lantern"),
          fx: { gold: 60, "items-": ["soul_lantern"], karma: -8,
                flags: { sold_lantern: true } },
          goto: "merchant_lantern" },
        { text: "Ask him what he is.", when: hasnt("asked_merchant"),
          fx: { flags: { asked_merchant: true }, xp: 15 },
          goto: "merchant_lore" },
        { text: "Walk on. South, toward Briarwatch.", goto: "road_mill" },
      ],
    },

    "merchant_memory": {
      text: `You expect a ritual. There isn't one. He simply reaches across the
space between you, the way you'd take a coat someone was handing you, and
then —

— you are trying to remember a kitchen. You know there was a kitchen. You
know it was warm, and that someone there was glad you existed, and that this
knowledge once lived in your chest where you could warm your hands on it.
Now there is a place shaped like it. You have the facts. The facts have
stopped being true to you.

'Lovely,' the Pale Merchant murmurs, tucking nothing into his breast pocket.
He hangs the black dagger's sheath on your belt himself, solicitous as a
tailor. 'Wyrmglass. Cooled from the blood of the last thing the world was
afraid of, before it learned to be afraid of itself. Do come again.'`,
      choices: [
        { text: "Walk on, colder.", goto: "road_merchant" },
      ],
    },

    "merchant_lantern": {
      text: `His hands close around the lantern with a tenderness that is somehow
the most frightening thing you have seen today, and today included a burning
village.

'Three hundred years of last breaths,' he whispers. 'A whole parish of the
faithful dead, and the shepherd not home to count them in.' The light inside
the glass surges against the walls of its little world — brightening,
because, you realize, somewhere in this transaction is an enormous lie, and
the lantern was built to know. Whether the lie is his or yours, it doesn't
say.

He counts sixty gold into your palm. The coins are old, and none of the
faces on them belong to any king you've heard of.

'A pleasure doing business,' says the Pale Merchant, 'with someone so
unsentimental about the dead. We will absolutely meet again.'`,
      choices: [
        { text: "Take your gold and go.", goto: "road_merchant" },
      ],
    },

    "merchant_lore": {
      text: `'What am I?' He seems genuinely pleased by the question, the way
collectors are pleased when you ask about the collection.

'I am an auctioneer of endings,' he says. 'When a thing concludes — a love, a
language, a world — there is a moment when everything it contained comes
loose, like coins from a torn pocket. I attend. I gather. I keep.' He
gestures at the strings of keys and teeth and rings, turning in their
windless wind. 'Every one of these outlived its world already. Yours is
shedding such treasures at a remarkable rate, if you'd care to look down.'

He leans in, confiding: 'The god is dying, little traveler. Not dead —
dying, which is a verb, which takes time, which can be interrupted. I have
no stake in whether anyone interrupts it. But the wares either way!' His
smile widens by one tooth too many. 'I do hope you're involved. You have the
look of someone who'll be holding the pocket when it tears.'`,
      choices: [
        { text: "Step back from him and browse, warily.", goto: "road_merchant" },
      ],
    },

    // ----------------------------------------------------- mill bridge: serra
    "road_mill": {
      text: `An hour shy of Briarwatch, the road crosses the Millrun on a humped
stone bridge, and the bridge is the only way over, and there is a fight on it.

A refugee column is backed against the rail — carts, bundles, perhaps thirty
people with the particular stunned patience of those who have already lost
the argument with history. Blocking the bridge are five men in stripped
military colors. You know the look: deserters, the kind that keep the sword
and shed the oath. They are working through the carts with knives, taking
'toll.'

One woman stands between them and the column. Grey travel-cloak, shield on
her back marked with a sun that someone has deliberately scored through, a
sword she hasn't drawn yet held low in both hands like a tool she knows to
the ounce. 'Last chance to be fed somewhere tonight,' she's saying to five
armed men, with no apparent awareness that this is a strange thing for one
person to say to five.

A deserter laughs. The sword comes up. It's going to be now.`,
      choices: [
        { text: "Wade in beside her.",
          combat: { enemy: "deserters", win: "mill_after_fight" },
          fx: { flags: { helped_serra: true } } },
        { text: "Shout that Crayce's payroll wagon broke an axle two miles back, " +
                "unguarded — and watch greed do your fighting.",
          check: { stat: "wits", dc: 13,
                   ok: "mill_tricked", fail: "mill_trick_failed" } },
        { text: "Five against one is an opportunity. Side with the deserters, " +
                "and take a share of the toll.",
          fx: { karma: -9, flags: { robbed_refugees: true } },
          goto: "mill_dark" },
        { text: "Ford the river downstream and leave the bridge to its own " +
                "arithmetic.",
          fx: { karma: -2, flags: { passed_mill: true } },
          goto: "briarwatch_gate" },
      ],
    },

    "mill_trick_failed": {
      text: `'Crayce pays by promissory note, friend,' the lead deserter says,
without turning his head. 'That's why we quit.' His men are already fanning
out, and the woman in grey has clearly decided that your bad lie makes you an
ally — which is generous of her, given that it makes you a target first.

'On your left,' she says, and draws.`,
      choices: [
        { text: "Fight.",
          combat: { enemy: "deserters", win: "mill_after_fight" },
          fx: { flags: { helped_serra: true } } },
      ],
    },

    "mill_tricked": {
      text: `Greed is a lever that moves men far heavier than these. 'Unguarded,'
the lead deserter repeats, already gone in the eyes, already counting. They
quit the bridge at a trot, knives forgotten, and the Millrun swallows the
sound of them.

The woman in grey watches them go, then turns to study you with frank
amazement. 'I was about to do that with a sword,' she says. 'Yours was
better. Cheaper, anyway.' Up close she's all old campaign habits — the way
she stands off the bridge's centerline, the way her eyes inventory your
hands. The scored-out sun on her shield is the sigil of the Dawnward Shield,
defaced with what must have been three furious minutes and a knife.

The refugees are already moving, pressing dried apples and blessings on you
both as they pass.`,
      on_enter: { karma: 4, xp: 40 },
      choices: [
        { text: "Talk with the woman in grey.", goto: "serra_meet" },
      ],
    },

    "mill_after_fight": {
      text: `The last deserter folds over her sword's pommel and slides off the
bridge rail into the Millrun, which carries him away with the indifference
of all rivers everywhere.

The woman in grey checks the refugees first — all of them, by name, the ones
she can't have known a day — and only then turns to you, pressing a strip of
linen against the cut on her arm. 'You wade into other people's odds,' she
says. 'That's a rare defect.' Her shield knocks against her back as she
offers you her hand: the sun sigil of the Dawnward Shield, scored through
with deliberate knife-work, worn anyway.

The refugees are pressing dried apples and blessings on you both. An old man
tries to give her a copper; she closes his fingers back around it with a
patience that looks much-practiced.`,
      on_enter: { karma: 5, xp: 50 },
      choices: [
        { text: "Talk with the woman in grey.", goto: "serra_meet" },
      ],
    },

    "mill_dark": {
      text: `You announce your position in the oldest dialect there is: you stand
next to the men with the knives.

It isn't even a fight, after that. The woman in grey is good — better than
all five, maybe, in a fair lane — but six is not five, and the refugees
behind her are exactly the hostages the deserters need. You watch her do the
arithmetic. You watch it cost her. She sheathes the sword she never got to
draw and stands aside with her eyes on you — not the deserters, you — like a
mason memorizing a flaw in stone.

The toll comes to twenty-five gold in your pocket: rings, coppers, a bride's
chain, somebody's funeral savings. The deserters cuff your shoulder like a
brother's and ford away north.

'I'll remember your face,' the woman in grey says quietly, as you pass her
on the bridge. It isn't a threat. Threats have heat in them. This is a
ledger entry.`,
      on_enter: { gold: 25, xp: 15, meet: "serra" },
      choices: [
        { text: "Cross the bridge to Briarwatch, richer.",
          fx: (s) => { s.changeApproval("serra", -60); return {}; },
          goto: "briarwatch_gate" },
      ],
    },

    "serra_meet": {
      text: `'Serra Valebright,' she says. If the name is supposed to mean something,
she offers it like someone laying down a weapon — hilt first, braced.

It does mean something, of course. Everyone has heard of the Butcher's
Shield, the knight cashiered for Greyfield. Looking at her now — the
defaced sigil worn where everyone can see it, the refugee column she's
guarding for what is evidently bread — you note that almost nothing about
the story fits the woman.

'I escort them where the roads are worst,' she says, nodding after the
column. 'Briarwatch tonight, then they're the reeve's problem, gods pity
them. After that —' she glances south, toward the grey horizon where the
world is quietly ending, '— after that I keep meaning to walk to the wound
and ask the Shepherd a question, and I keep finding people who need walking
somewhere first.'

She looks you over once more, decision visibly forming.`,
      on_enter: { meet: "serra" },
      choices: [
        { text: "'Walk with me, then. I'm bound for the wound myself, and the " +
                "roads between are bad company.'",
          fx: (s) => {
            s.changeApproval("serra", s.flag("helped_serra") ? 15 : 10);
            return { recruit: "serra" };
          },
          goto: "serra_joins" },
        { text: "'Good luck with your question.' Part ways at the bridge.",
          fx: { flags: { serra_declined: true } },
          goto: "briarwatch_gate" },
        { text: "'The Butcher's Shield, guarding refugees. Is this penance, or " +
                "advertising?'",
          fx: (s) => { s.changeApproval("serra", -5); return {}; },
          goto: "serra_needled" },
      ],
    },

    "serra_needled": {
      text: `The linen on her arm creaks; she's made a fist without noticing.

'Penance is for the guilty,' she says, level. 'I keep the company of people
who've lost everything because somebody has to, and because the order that
should be doing it is busy selling its honor by the pound in Cindral.' A
breath. 'I didn't give the order at Greyfield. I carried the blame for the
man who did, because I believed the Shield mattered more than I did. I've
since revised one of those beliefs.'

She shoulders her shield. The scored sun catches the light.`,
      choices: [
        { text: "'Then come revise it at the wound. I could use a blade that " +
                "knows what orders cost.'",
          fx: { recruit: "serra" },
          goto: "serra_joins" },
        { text: "Let her go her own way.",
          fx: { flags: { serra_declined: true } },
          goto: "briarwatch_gate" },
      ],
    },

    "serra_joins": {
      text: `She doesn't deliberate long. People who've lost everything travel light,
decisions included.

'Conditions,' she says, falling into step. 'One: refugees, children, and the
Hollowed are not currency. We don't spend them. Two: if I say a fight is
wrong, I'll say it once, out loud, and what you do after that is on your
soul, not mine. Three —' and here, unexpectedly, the ghost of a smile, '—
when we reach the wound, I get my question. I've been composing it for a
year. It has several sub-clauses.'

She offers her hand again, and this time it's a pact.

The road bends south. Briarwatch shows on the hill ahead, a stockade town
with too many campfires outside its walls — refugees, hundreds, turned out
in the cold. Serra's jaw sets at the sight of them.`,
      choices: [
        { text: "On to Briarwatch.", goto: "briarwatch_gate" },
      ],
    },
  };

  HC.story = HC.story || {};
  HC.story.prologue = { SCENES };
})(globalThis.HC);
