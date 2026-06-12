/* Act Three: the grey country, the Wound, and the end of every road.
   Ported from mythos/story/act3.py. */
(function (HC) {
  "use strict";

  const { all_of, any_of, appr, bg, has, hasnt, inp, item } = HC.helpers;

  const SCENES = {
    // ------------------------------------------------------------- the road
    "road_wound": {
      text: (s) => `The grey country is not a metaphor. South of Cindral the Withering
stops being a stain and becomes the landscape: hills like piles of ash,
rivers running slow and colorless as melted candle-wax, a sky the texture
of wet wool. Nothing here remembers what it's for. Trees grow in spirals.
A stretch of road runs, for half a mile, gently uphill in both directions.

Sound dies young here. So it says something that you hear the wagon's
chimes a full minute before you see it: the high narrow wagon of pale
wood, parked at a crossroads that wasn't there when you crested the rise,
its hundreds of small hanging things turning in their windless wind.

'Traveler!' The Pale Merchant looks exactly as he did, which is its own
small horror, this far into the grey. 'And on schedule. I do love a
punctual apocalypse.' His smile arrives before his face turns. 'Last stop
before the wound, friend. Final stock. Closing prices.'`,
      choices: [
        { text: "Buy a Pale Elixir. (15 gold)",
          when: HC.helpers.gold(15),
          fx: { gold: -15, "items+": ["elixir"] },
          goto: "road_wound" },
        { text: "Buy two — the end of the world is no place to economize. " +
                "(30 gold)",
          when: HC.helpers.gold(30),
          fx: { gold: -30, "items+": ["elixir", "elixir"] },
          goto: "road_wound" },
        { text: "Ask what he's really doing here, at the end of everything.",
          when: hasnt("merchant_final_lore"),
          fx: { flags: { merchant_final_lore: true }, xp: 25 },
          goto: "merchant_final" },
        { text: "He's offering a hundred gold for 'your name — just the wearing " +
                "of it.' Sell it.",
          when: hasnt("sold_name"),
          fx: { gold: 100, karma: -5,
                flags: { sold_name: true } },
          goto: "merchant_name" },
        { text: "Walk on. The wound is close — you can feel both shards " +
                "leaning toward it.",
          goto: (s) => ((s.flag("vex_sold")
                         && s.companions["vex"].alive
                         && !s.flag("vex_ambush_done"))
                        ? "vex_ambush"
                        : "monastery_gate") },
      ],
    },

    "merchant_final": {
      text: `'Doing?' He gestures around at the grey, delighted to be asked. 'I'm
ATTENDING. I told you in the north: when a thing concludes, what it
contained comes loose. I have attended the deaths of nine worlds, little
traveler — oh, don't look like that, it's a perfectly respectable
profession, someone must keep the keepsakes — and I have learned the one
great secret of endings, which I will give you free, as my closing gift.'

He leans down from the bench, and for a moment the smile is gone
entirely, and what's underneath it is old, and almost gentle.

# 'The secret is: they can all hear you.'

'The dying god. The dying world.
Every dying thing in it. Endings have perfect hearing — it's the one
sense that sharpens at the last. So whatever you've come all this way to
do at that wound —' he straightens up, smile reinstalling itself '— do
say it OUT LOUD, won't you? For the acoustics. And for my records.'`,
      choices: [{ text: "Back to his wares, unsettled.", goto: "road_wound" }],
    },

    "merchant_name": {
      text: `It's like the memory of warmth was, only worse, because a name turns
out to be load-bearing.

He doesn't take the word — people still call you what they call you, and
you still answer. He takes the WEARING of it: the way it fit. Your name
in a friend's mouth now lands a half-inch to your left, addressed to
someone you can almost see. The gold is heavy and old. He counts it out
with enormous satisfaction, and threads something invisible onto a string
among the keys and teeth and wedding rings, where it turns gently in the
windless wind, getting used to the company.

'A pleasure,' says the Pale Merchant, 'doing business with—' and he says
your name, and wears it better than you ever did, just for a syllable,
just to show it's his.`,
      choices: [{ text: "Walk away from the sound of it.", goto: "road_wound" }],
    },

    // ---------------------------------------------------------- vex returns
    "vex_ambush": {
      text: `The ambush is flawless. Of course it is. You taught the Rookery's best
exactly how you travel, for weeks, from inside your own camp.

Vex steps out of the colorless light at the road's pinch-point, knives
already out. They look well. That's the terrible part — fed, rested,
outfitted in blackened mail, every inch Mother Rook's best asset, and
their eyes as level and empty as bookkeeping. On their wrist, the
rook-brand glows a steady ember-orange. Live. Active. SPOKEN.

'The Rookery sends its regards,' Vex says, in a voice with all the jokes
removed, 'and calls in your account.' And then, for just a flicker —
through the brand's grip, from somewhere down under the water — the old
bright voice, fast and flat: 'She said the word. Hands aren't mine. Make
it quick or make it CLEVER.'`,
      on_enter: { flags: { vex_ambush_done: true } },
      choices: [
        { text: "Make it clever: fight to disarm, and cut the brand from " +
                "their wrist.",
          combat: { enemy: "vex_hostile", win: "vex_brand_cut" } },
        { text: "Make it quick.",
          combat: { enemy: "vex_hostile", win: "vex_killed_scene" },
          fx: { flags: { vex_meant_to_kill: true } } },
      ],
    },

    "vex_brand_cut": {
      text: `Disarming a person who wants to be disarmed is still the hardest fight
of your life, because their hands don't know it, and Mother Rook paid for
very good hands.

But it ends with Vex face-down in the grey dust, wrist pinned, and your
knife doing the one piece of surgery that matters: the brand comes off —
skin and ember and binding all together, a coin of fire that shrieks in a
voice that is not Vex's and dies on the colorless ground.

Vex lies still for a long moment. Then they roll over, look at the
bleeding ruin of their wrist, and laugh — a horrible, joyous, unpracticed
sound, like a door opening on rusted hinges.

# 'Empty,' they say, wondering, holding the wrist up. 'It's EMPTY. Nobody's in here but me.'

They sit up, and the look they give you carries the
whole ledger: the stocks, the selling, this. 'We're not square. We're
never square. But you gave me back the hands, so I'm going to use them
to walk away, and that's the closest thing to mercy I've got in stock.'

They limp north, against the grain of the grey, and the dust takes them.
You'll know how the story ends for Vex only if the world gets to have
more story.`,
      on_enter: { xp: 70, karma: 3,
                  flags: { vex_freed_late: true } },
      choices: [{ text: "South. The wound is close.", goto: "monastery_gate" }],
    },

    "vex_killed_scene": {
      text: `Quick, then. You owed them that much, or you tell yourself the
arithmetic works out that way.

At the end, the brand on their wrist gutters out — the asset lost,
the account closed, somewhere in a counting-house ledger far to the
north a line ruled neatly through a name. Vex's face, emptied of the
brand's grip, has time for one last expression, and it's the one from
the stocks at Briarwatch: bright, professional, a ledger closing.

'Classic,' they manage. And that's all.

You build the cairn yourself, off the road, where the grey dust is
deepest. None of your company helps. That's its own entry in its own
ledger.`,
      on_enter: { xp: 30, karma: -6,
                  flags: { vex_dead: true },
                  kill_companion: "vex",
                  approval: { serra: -10, maeve: -8, hollow: -8 } },
      choices: [{ text: "South, alone in the crowd of yourself.",
                  goto: "monastery_gate" }],
    },

    // ------------------------------------------------------------ the wound
    "monastery_gate": {
      text: (s) => `The Sunken Monastery earns its name twice over: built in a caldera
where the first priests said the god's voice pooled like water, and now
sunk again, half-swallowed by the Wound itself — a slow, soundless
whirlpool of unmade world, a mile across, turning around a point of
darkness where the monastery's heart-chapel used to stand. Looking at
the center is like looking at the place a tooth used to be. The world
flinches around it.

Pilgrims line the caldera's rim. Hundreds. Some pray. Some simply watch.
And some — you see it happen, twice, in your first minute — walk over
the edge, into the grey turning, calmly, the way you'd step onto a
ferry. The Wound takes them without a ripple. Ash pilgrims. The
Shepherd of Ash's flock, going to him the only way there is.` + (s.inParty("hollow") ? `

The Hollowed are here too — scores of them, standing along the rim in
their still rows, faces turned to the center like a field of grey
sunflowers. As Brother Hollow approaches, they TURN — all of them, at
once — and the sound that moves down their lines is not speech and is
unmistakably a greeting. He stops, leaning on his stick, ambushed by
it. 'Oh,' he says quietly. 'They know. They've been waiting for
someone who could still say "we."' They fall in behind him like a
congregation, and Brother Hollow, the man who put the sword down,
walks to the wound at the head of an army that will not fight.` : "") + (!s.flag("pilgrim_saved") ? `

A pilgrim near you — a young man, boots already off, folding his coat
with terrible neatness at the rim's edge — catches you watching.` : ""),
      on_enter: (s) => (s.inParty("hollow")
        ? { flags: { hollow_flock: true }, xp: 25 } : {}),
      choices: [
        { text: "Speak to the young pilgrim before he steps off.",
          when: hasnt("pilgrim_saved"),
          check: { stat: "spirit", dc: 13,
                   ok: "pilgrim_talked", fail: "pilgrim_lost" } },
        { text: "Descend the processional stair, into the Wound.",
          goto: "wound_descent" },
      ],
    },

    "pilgrim_talked": {
      text: `You don't argue with his grief; grief this far gone treats argument as
weather. You ask, instead, what his coat is for — why fold it, if folding
is over. And he looks at the coat in his hands, neatly squared, kept nice
for someone, and the question goes in under the grief and finds the part
of him that folded it.

'My sister,' he says, eventually. 'It's hers. Was. I was going to —' He
doesn't finish. He sits down at the rim instead, holding the coat, and
the sitting is everything: pilgrims stand or step, but the sitting ones
stay.

'I'll watch,' he says, not looking at you. 'What you do down there.
Somebody up here should be holding something warm while it happens.'`,
      on_enter: { karma: 4, xp: 40, flags: { pilgrim_saved: true },
                  approval: { serra: 5, maeve: 5, hollow: 5 } },
      choices: [{ text: "Down the processional stair.", goto: "wound_descent" }],
    },

    "pilgrim_lost": {
      text: `He listens politely. That's the worst of it — the politeness, the
small apologetic smile of someone declining a kindness at a door.

'It doesn't hurt,' he says, as though reassuring YOU. 'That's the whole
of it, friend. Down there, nothing has to hurt ever again. He promises.
You can hear him promise, if you stand at the rim long enough.'

He leaves the coat folded on the stone. The Wound takes him without a
ripple, and the grey turning goes on turning, and after a moment you
realize you can't remember the color of his eyes, and that the
forgetting started before he stepped.`,
      on_enter: { flags: { pilgrim_saved: true, pilgrim_fell: true } },
      choices: [{ text: "Down the processional stair, colder.",
                  goto: "wound_descent" }],
    },

    "wound_descent": {
      text: (s) => `The processional stair winds down the inside of the caldera, through
the monastery's drowned architecture — cloisters at strange angles,
a refectory standing on its end, bells fused mid-peal. The deeper you
go, the less the world insists on itself. Your footsteps arrive slightly
before your feet. Your shadow consults you about corners.

And the Wound begins to read you. Not cruelly — the way the dying read:
hungrily, for company. The grey turning parts ahead of you and builds,
out of unmade world, the room it finds at the bottom of your particular
soul:` + (s.player.background === "veteran" ? `

Greyfield. The lane along the weaver's row, dawn-lit, the kindling
smell already rising. You at twenty, water-bucket in one hand, sword in
the other, in the precise spot where you stood and did not decide —
where not-deciding decided. The vision holds, patient. It will hold as
long as you need. The Wound is offering you the morning back, to spend
differently — not in the world, the world is spent — but in YOU.`
        : s.player.background === "scribe" ? `

The scriptorium of the Shattered Temple, unburned, every shelf whole,
candles lit. On the nearest desk, open, in the god's own hand: the last
letter, the one written the night before the Crown broke — the letter
no archive ever held because it was never sent. The Wound is offering
you the reading. It costs only the staying. The chair is pulled out.
The candle is patient.`
        : `

A kitchen. THE kitchen — the one from before the gutter, the one you
have spent a lifetime not believing in: small, warm, bread-smelling,
and a voice in it saying your name. Not calling you for anything.
Just saying it, the way names were meant to be worn, by someone glad
you exist. The Wound is offering you the room. You could simply go in.
The door is open. It was always open. That's the lie, and it's a
perfect one, and knowing it's a lie helps less than you'd think.`),
      choices: [
        { text: "Stand in the morning and forgive the twenty-year-old with the " +
                "bucket. Then put the morning down. (Veteran)",
          when: bg("veteran"),
          fx: { karma: 3, xp: 50, "stat+": "spirit",
                flags: { forgave_self: true } },
          goto: "god_heart" },
        { text: "Keep the morning like a stone in your fist. It made you. " +
                "Owe it nothing. (Veteran)",
          when: bg("veteran"),
          fx: { xp: 40, "stat+": "might",
                flags: { hardened_self: true } },
          goto: "god_heart" },
        { text: "Read the last letter standing up, and do not sit down, and " +
                "carry it out word for word. (Scribe)",
          when: bg("scribe"),
          fx: { xp: 60, "stat+": "wits",
                flags: { read_last_letter: true } },
          goto: "god_heart" },
        { text: "Close the book unread. Some letters are private, even from " +
                "scribes. Especially from scribes. (Scribe)",
          when: bg("scribe"),
          fx: { karma: 4, xp: 50, "stat+": "spirit",
                flags: { closed_book: true } },
          goto: "god_heart" },
        { text: "Stand at the kitchen door, say 'I know' to the voice, and " +
                "walk on without going in. (Gutterborn)",
          when: bg("gutterborn"),
          fx: { karma: 3, xp: 50, "stat+": "spirit",
                flags: { refused_kitchen: true } },
          goto: "god_heart" },
        { text: "Steal the kitchen. Memorize every plank and smell of it on " +
                "the way past. It's yours now. The gutter takes. (Gutterborn)",
          when: bg("gutterborn"),
          fx: { xp: 50, "stat+": "wits",
                flags: { stole_kitchen: true } },
          goto: "god_heart" },
      ],
    },

    "god_heart": {
      text: (s) => `The stair ends. The turning stops. At the bottom of the Wound there
is a stillness like the inside of a bell after the note, and in the
stillness, on the drowned chapel's floor, lies the god.

Vael. The Shepherd. He is the size of a man, which is somehow the
unbearable part — three thousand years of murals built him tall as
weather, and what is actually here is a grey figure on grey stone,
rope-burned hands folded on his chest, breathing four times a minute,
each breath visibly an administrative burden. Where a crown would sit,
his brow is torn — a wound within the Wound — and seated in the torn
place, fused to the bone, the third and final shard burns its quiet
black-and-silver, like the night sky apologizing.

His eyes are open. They find you with the slow precision of the very
old, and they go — one by one, unhurried — to your pack, where two
shards of his crown are singing. The expression that crosses the
ruined face is not hope and not fear. It is the look of a patient
hearing the surgeon's footsteps: every outcome still possible, all of
them finally, mercifully, NEAR.` + ((s.flag("king_parley") || s.flag("freed_king")) ? `

You have a message to deliver. A king under a hill charged you with
it.` : ""),
      choices: [
        { text: "Deliver the First King's message.",
          when: any_of(has("king_parley"), has("freed_king")),
          fx: { karma: 3, xp: 50, flags: { delivered_message: true },
                approval: { serra: 5, maeve: 5 } },
          goto: "god_message" },
        { text: "Approach the god.", goto: "shepherd_arrives" },
      ],
    },

    "god_message": {
      text: (s) => (`You kneel by the grey figure, and you say it the way it was given to
you, word for word, because some messages are load-bearing.

# ` + ((s.flag("king_parley") && !s.flag("freed_king"))
        ? "'Aldous sends no forgiveness, and asks none. He says you are even.'"
        : "'Aldous forgave you three thousand years ago, and was too proud to " +
          "say so, and is still too proud, and sent a scribe to do it instead.'")
        + `

The god's breathing stops. For four seconds — one entire breath's worth
of his remaining budget — the Wound's stillness goes ABSOLUTELY still,
and you have time to fear you've killed him with it. Then the breath
comes back, and with it a sound you will never describe adequately to
anyone: a god, at the bottom of his own grave, laughing. Two syllables
of it. The dust of the chapel floor rearranges itself slightly, as if
the world's oldest argument had finally, somewhere, been scored.

When the ruined face settles, something in it has unclenched that you
had taken for bone structure.`),
      choices: [{ text: "Rise, and face what comes.", goto: "shepherd_arrives" }],
    },

    "shepherd_arrives": {
      text: `The temperature does not drop so much as resign. Across the drowned
chapel, the grey light gathers, knits, and walks — and the Shepherd of
Ash is there, as he has perhaps always been there, the way the smell of
burning is always somewhere in a house where something once burned.

He wears the same face as the figure on the floor. Of course he does.
But where the dying god is worn down to grey wood, the Shepherd of Ash
is built up out of cinders — a man-shape of settled ash and old grief,
holding its form the way a held breath holds, and his eyes are the
black of the Wound's own center.

'You carried them well,' he says, and his voice is the god's voice with
all the warmth banked out of it. He nods at your pack. 'The two
splinters. The hill's piece and the fire's piece. And here is the
third—' a gesture at the torn brow of the figure on the floor, gentle
as a nurse '—where I left it. Where it pins what's left of HOPING to
the stone, so it cannot crawl off and re-shackle itself out of habit.'

He circles slowly. The ash of him sifts and re-settles with each step.

'I know why everyone comes. They come to decide. So before you do, you
will hear what the deciding is FOR. I am owed that. I am the half that
carried the pain, little courier. I am owed at least the telling.'`,
      choices: [
        { text: "Hear him out.", goto: "shepherd_tells" },
        { text: "'You're owed nothing. You're a wound that learned to walk.' " +
                "End him.",
          combat: { enemy: "shepherd", win: "shepherd_slain" } },
      ],
    },

    "shepherd_tells": {
      text: `'Three thousand years,' the Shepherd of Ash says. 'Every harvest.
Every birth. Every small mercy, drawn through the Crown, drawn through
US. Do you know what it is to be the loom? Every thread that snaps —
every child the fever takes, every Greyfield, every Ashfen — snaps
INSIDE the weaver. We felt each one. We feel them still. I am made of
the felt ones.'

The ash of him swirls, and for a moment there are faces in it — not
metaphor: faces, hundreds, surfacing and sinking, every one of them
mid-grief.

'We begged, you know. The thing the chapels never guessed: gods can
pray. We prayed for relief, for a successor, for a single shared
WATCH of the night — and learned what every shepherd learns: there
is no one above. The fields go up forever and they are all empty. So
we did the only kind thing left in the cupboard. We broke the loom.'

He stops, ash settling, and looks at you with the Wound's whole
darkness.

'It is not destruction I shepherd. It is ANESTHESIA. The Withering is
the world's pain ending — sensation by sensation, name by name. The
Hollowed do not suffer; ask your grey friend, honestly, and he will
tell you the quiet is KIND. I am finishing the only mercy a god was
ever positioned to perform. And you stand at my surgery's edge with
two-thirds of the old shackle in a bag, deciding whether to chain my
brother back to the table.' The black eyes do not blink. 'So. Decide.
But decide knowing that every other road than mine runs through
someone's unanaesthetized pain — and that I will not stop you, because
stopping people was always HIS half of the work.'`,
      on_enter: { xp: 60, flags: { heard_shepherd: true } },
      choices: [
        { text: "'Then keep your mercy. I'm with you. Let it all stop " +
                "hurting.' Join him.",
          fx: { karma: -8, flags: { joined_shepherd: true } },
          goto: "end_last_witness" },
        { text: "Answer him — not with doctrine. With everything you've " +
                "carried here.",
          check: { stat: "spirit", dc: 15,
                   ok: "shepherd_yields", fail: "shepherd_unmoved" } },
        { text: "Let Brother Hollow answer him.",
          when: inp("hollow"),
          goto: "shepherd_hollow_answer" },
        { text: "Open the soul-lantern between you and let the dead answer " +
                "him.",
          when: item("soul_lantern"),
          goto: "shepherd_lantern_answer" },
        { text: "There's no arguing with a wound. Fight him.",
          combat: { enemy: "shepherd", win: "shepherd_slain" } },
      ],
    },

    "shepherd_unmoved": {
      text: `You give him everything — the bridge at Millrun, the kneeling
Hollowed, the folded coat at the rim — and the ash of him receives it
the way ash receives rain: absorbing, darkening, unmoved.

'Sweet,' he says, and means it, which is worse. 'Every one of those
moments passed through me when the loom still ran. I have ten thousand
of each. I am MADE of them. You cannot show the anesthetist the
patient's smile and expect him to cancel the surgery — the smile is ON
THE CONSENT FORM, little courier. Pain and the smiles anyway. That was
always the package. I am declining the package.'

The black eyes turn away, toward the figure on the floor, and the
audience is over. What remains is older than argument.`,
      choices: [
        { text: "Fight the Shepherd of Ash.",
          combat: { enemy: "shepherd", win: "shepherd_slain" } },
        { text: "'Then keep your mercy. I'm with you.' Join him.",
          fx: { karma: -8, flags: { joined_shepherd: true } },
          goto: "end_last_witness" },
      ],
    },

    "shepherd_hollow_answer": {
      text: `Brother Hollow walks past you, leaning on his stick, and stands
before the Shepherd of Ash — grey meeting grey, the falling meeting the
fallen.

'You say the quiet is kind,' Brother Hollow says. 'It is. You say we
do not suffer. We don't.' The Shepherd's ash goes very still, the way
a winning argument goes still. 'But you have mistaken the labels for
the jars, weaver. I lost the word WIFE and the loving sat there
untouched. I lost my NAME and a child threw it back to me across the
water like a rope. The Withering takes the telling, not the thing
told.' He steps closer. 'You are the world's pain, cast out and
walking, and no one has ever once sat up with YOU. That is what you
actually are.

# Not a surgeon. The patient no one visited.'

And Brother Hollow, the man who put the sword down, does the thing he
crossed a dying world to do: he sits down next to the Shepherd of Ash,
on the drowned chapel floor, and keeps the vigil.

The ash-shape stands over him for a long time. Then it sits too. And
the cinders begin, very slowly, to go out — not defeated: ATTENDED,
grief doing the one thing grief was ever designed to do, which is to
be witnessed all the way to the end. The faces in the ash surface one
last time, and they are not mid-grief anymore. The Shepherd of Ash
settles, sighs, and comes apart into the stillness like a held breath
finally let go — and the third shard, on the dying god's brow, blazes
up silver, unpinned.`,
      on_enter: { xp: 100, karma: 5,
                  flags: { shepherd_witnessed: true, shepherd_gone: true },
                  approval: { hollow: 25, serra: 8, maeve: 10 } },
      choices: [{ text: "Approach the dying god, past your friend keeping " +
                        "vigil over an empty cloak of ash.",
                  goto: "final_approach" }],
    },

    "shepherd_lantern_answer": {
      text: `You set the soul-lantern on the drowned chapel floor between the
Shepherd of Ash and the god he was cut from, and you open it all the
way, which Keeper Lysa never said you couldn't.

Three hundred years of Ashfen comes out.

Not as light. As ARRIVAL — a parish: farmwives and swineherds and
keepers and children, three centuries of small lives caught at their
last breath and kept, and every one of them still wearing the shape
of what they loved. They fill the chapel the way a congregation fills
a church: insufficiently, humanly, completely. And they look at the
Shepherd of Ash — at the world's pain, cast out and walking — and
they do what the dead of a shepherding god's parish would always have
done for any neighbor standing alone at a graveside.

They stand with him.

He tries to hold the argument. You watch him try — the anesthesia,
the mercy, the empty fields above. But the dead of Ashfen have heard
every sermon ever preached about them, and they press in close
instead, three hundred years of them, until the ash of him is
attended on every side. The faces in the cinders surface, and find
other faces looking back, and the Shepherd of Ash — witnessed,
finally, by the very threads whose snapping made him — lets the held
breath go. The cinders settle like snow deciding to be water. On the
dying god's brow, the third shard blazes up silver, unpinned.

The lantern lies open and empty. The dead of Ashfen do not go back
in. They have somewhere to be now; you can feel them finding it.`,
      on_enter: { xp: 100, karma: 6,
                  "items-": ["soul_lantern"],
                  flags: { shepherd_witnessed: true, shepherd_gone: true,
                           lantern_delivered: true },
                  approval: { serra: 8, maeve: 10, hollow: 10 } },
      choices: [{ text: "Approach the dying god through the settling " +
                        "stillness.",
                  goto: "final_approach" }],
    },

    "shepherd_yields": {
      text: `You don't argue the doctrine. You tell him about the folding of the
coat.

The young man at the rim, boots off, the world over — folding his
sister's coat with terrible neatness, KEEPING IT NICE, four seconds
from the edge. Pain hadn't stopped him caring; pain was the SHAPE of
the caring with the her removed. You say: anesthesia doesn't end the
pain, weaver. It ends the folding.

# And the folding is the part that was worth the loom.

The ash goes still. The faces in it surface — and stay surfaced,
listening, hundreds of them, the felt ones, the snapped threads, and
you understand suddenly that you are not arguing with a doctrine. You
are speaking at a graveside, to mourners, about whether what they
loved was worth what it cost. The oldest question. The only one.

'The folding,' the Shepherd of Ash says at last, in the god's voice
with one degree of warmth crept back into it. 'He would have said
something like that. Before me.' The black eyes close. 'I am so
tired, courier. Carrying the cast-off half is also a crown.'

And the cinders begin to settle — not defeated, RELIEVED, a held
breath let go at last — and the Shepherd of Ash comes apart into the
stillness, attended at the end by his own dead, while on the dying
god's brow the third shard blazes up silver, unpinned.`,
      on_enter: { xp: 110, karma: 5,
                  flags: { shepherd_talked_down: true, shepherd_gone: true },
                  approval: { serra: 8, maeve: 10, vex: 5, hollow: 8 } },
      choices: [{ text: "Approach the dying god.", goto: "final_approach" }],
    },

    "shepherd_slain": {
      text: `You cannot kill ash, but you can scatter it past regathering, and
that is what the fight is — not a duel: a dispersal, your blade and
your company against a grief that reassembles around every wound you
deal it, until at last the binding wears thin and the man-shape
cannot find itself again.

The cinders come down over the drowned chapel like black snow. They
do not settle gently. As the last of the shape lets go, the faces in
the ash surface one final time — hundreds, the felt ones, the snapped
threads — and they look at you, all together, with an expression you
will spend the rest of your life deciding the name of. It might be
reproach. It might, far worse, be envy.

= Where he stood, nothing. On the dying god's brow, the third shard
blazes up silver — unpinned, unguarded, ungrieved.

The figure on the floor watches the ash of his own pain blow across
the stones. His breathing does not change. But the rope-burned hands,
folded on his chest, tighten slightly on each other — the gesture of
a man at a funeral where he is the only mourner left standing.`,
      on_enter: { xp: 90, karma: -2,
                  flags: { shepherd_slain: true, shepherd_gone: true } },
      choices: [{ text: "Approach the dying god through the black snow.",
                  goto: "final_approach" }],
    },

    // --------------------------------------------------------- final choice
    "final_approach": {
      text: (s) => `You kneel at the god's side, and Vael, the Shepherd, the loom of the
world, looks up at you with three breaths a minute and no instructions
at all.

That's the revelation at the bottom of the Wound, the one no chapel
would survive: he isn't going to TELL you. He broke the Crown to be
done with deciding for the world; he will not spend his deathbed taking
the deciding back. The torn brow with its blazing shard is within your
reach. The two shards in your pack have gone silent, attentive.

# The choice has been walking beside you since Ashfen, and it takes off its hood now, and it has your face.

The rope-burned hand lifts — an effort like a tide turning — and rests,
briefly, on yours. Not guidance. COMPANY. Then it falls back, and the
god of three thousand years waits to see what you are.` + ((s.flag("sold_shard_queen")
                                                             && !s.flag("queen_resolved")) ? `

Far above, at the caldera's rim, brass horns. The Queen Regent's
column has reached the Wound — and she has brought the shard you sold
her, set blazing in a crown of brass on her own brow. She is coming
down the processional stair with her Blades around her, and the
throne's voice arrives ahead of her, ringing off the drowned stones:
'CINDRAL KEEPS WHAT IT PAID FOR.'` : ""),
      choices: [
        { text: "Face the Queen Regent.",
          when: all_of(has("sold_shard_queen"), hasnt("queen_resolved")),
          goto: "queen_arrives" },
        { text: "Make the choice.",
          when: any_of(hasnt("sold_shard_queen"), has("queen_resolved")),
          goto: "final_choice" },
      ],
    },

    "queen_arrives": {
      text: (s) => `She has worn armor over mourning-cloth, and the brass crown with the
shard burning in it sits on her brow like a borrowed fever. Up close
you can see what the shard has been doing to her on the long ride
south: the not-sleeping has stopped being metaphor. The Blades fan out
around her, lacquered and absolute.

'I bought it,' she says, without preamble, over the body of the god.
'With the throne's gold, from your own hand. My city burns its
children behind me and my son forgets his rattle behind a false wall,
and this —' her hand rises to the crown, almost touching it '— this
SINGS to me that it can fix all of it, if the mending happens on MY
brow. So tell me, shard-bearer, here at the bottom of everything:
why should the crown of the world not be Cindral's?'` + (s.flag("told_queen_hope") ? `

Her eyes are too bright. The shard's harmonic runs under her words
like a current under ice. But somewhere beneath the fever, the most
frightened mother in the realm is still in there, listening — the one
you told the truth to, once, about what's left inside the grey.` : ""),
      choices: [
        { text: "'Because your son needs a mother, not a god. Come see what's " +
                "left inside the grey — and give the world back its crown.'",
          check: { stat: "spirit", dc: 14,
                   ok: "queen_yields", fail: "queen_fights" } },
        { text: "Take the shard from her by force.",
          combat: { enemy: "queens_blades", win: "queen_beaten" } },
        { text: "Let her keep it. Mend the Crown crooked, two shards and a " +
                "brass surrogate — and owe the consequences.",
          fx: { karma: -3, flags: { queen_resolved: true,
                                    queen_kept_shard: true } },
          goto: "final_choice" },
      ],
    },

    "queen_yields": {
      text: (s) => (`You speak to the mother, not the fever — ` + (
        s.flag("told_queen_hope")
          ? "and you have standing to do it, because you told her the truth " +
            "once in her own war-room when a lie was cheaper. "
          : "") + `you talk about the rattle on
the war-table, about the porridge tray behind the false wall, about the
grey-eyed who kneel and mourn and fold, and what a boy needs from the
woman in front of him versus what a realm thinks it needs from a crown.

The brass crown comes off slowly, two-handed, the way you'd lift a
sleeping cat off your chest. Without it her face reorganizes around
the exhaustion, and the Regent and the mother stand in the same body
for the first time in a year.

'The throne never wanted the sky,' she says, hoarse. 'The throne
wanted the WITHERING STOPPED, and the sky was the only stall still
selling.' She holds the shard out over the god's body. 'Stop it, then.
Whatever you're about to be — stop it. And when it's stopped, there's
a boy in Cindral I would like to introduce to the person who decided
his mother shouldn't be a god.'

The Blades stand down. The third of three transactions closes, and
for once the ledger reads:

# Returned, in full.`),
      on_enter: { xp: 80, karma: 5,
                  "items+": ["crown_shard_1"],
                  flags: { queen_resolved: true, queen_returned: true },
                  approval: { serra: 8, maeve: 5 } },
      choices: [{ text: "Turn back to the god, all three shards in reach.",
                  goto: "final_choice" }],
    },

    "queen_fights": {
      text: `The fever answers before the mother can. 'The throne,' she says, in
a voice with brass harmonics under it that no human throat installed,
'KEEPS WHAT IT PAID FOR,' — and the Blades close like a gate.`,
      choices: [
        { text: "Fight the Regent's Blades.",
          combat: { enemy: "queens_blades", win: "queen_beaten" } },
      ],
    },

    "queen_beaten": {
      text: `The Blades are the best drill in the realm, and drill was built for
fields, not for the bottom of a wound in the world where footing and
faith both run thin. When the last of them yields, the Queen Regent
stands alone, sword drawn, crown blazing — and then the fever and the
woman finish their year-long argument in front of you, and the woman
wins by one breath.

She kneels. Not to you — past you, to the figure on the floor, the
employer of every crown there ever was. The brass circlet comes off
two-handed and she sets it on the stones.

'Cindral yields the salvage,' she says, formally, to the god. And
then, not formally, eyes ruined: 'Mend it. Whoever wears it. There's
a boy behind a false wall who stopped knowing his rattle, and I have
spent everything else.'`,
      on_enter: { xp: 70,
                  "items+": ["crown_shard_1"],
                  flags: { queen_resolved: true, queen_beaten: true } },
      choices: [{ text: "Take up the shard, and turn back to the god.",
                  goto: "final_choice" }],
    },

    "final_choice": {
      text: (s) => `Three shards of the Hollow Crown` + (
        !s.flag("queen_kept_shard")
          ? " — two in your hands and one blazing on the dying god's brow — "
          : " — one in your hands, one on a Regent's brow above you, one " +
            "blazing on the dying god's — ") + `sing to each other across the
stillness, and the song is a question, and the question is addressed
to you.

This is the wound in the world. Everything you have done has walked
here with you, and stands now at your shoulder, breathing. The god
watches. The dead listen — endings have perfect hearing.

# Say it out loud.`,
      choices: [
        { text: "REFORGE THE CROWN AND BIND VAEL BACK INTO IT. The world " +
                "needs its loom more than one god needs his rest.",
          goto: "end_chained_god" },
        { text: "TAKE THE CROWN YOURSELF. The loom needs a weaver; let it " +
                "be one who walked here as one of the woven.",
          goto: (s) => (s.karma >= 10 ? "end_new_shepherd"
                        : s.karma <= -10 ? "end_tyrant"
                        : "end_uneasy_god") },
        { text: "DESTROY THE CROWN — all three shards, here, forever. No " +
                "more looms. No more shepherds. The world learns to fall " +
                "and catch itself.",
          goto: "end_mortal_age" },
        { text: "Crown SERRA. Let the oathbroken knight hold the world's " +
                "oath.",
          when: all_of(inp("serra"), appr("serra", 60)),
          goto: "end_serra" },
        { text: "Crown MAEVE. Let the scholar who read the god's grief hold " +
                "the loom that wrote it.",
          when: all_of(inp("maeve"), appr("maeve", 60)),
          goto: "end_maeve" },
        { text: "Crown BROTHER HOLLOW. Let the catching belong to one who " +
                "knows the falling from inside.",
          when: inp("hollow"),
          goto: "end_hollow_god" },
        { text: "Offer the crown to VEX.",
          when: all_of(inp("vex"), appr("vex", 25), hasnt("vex_refused")),
          fx: { flags: { vex_refused: true } },
          goto: "vex_refuses" },
      ],
    },

    "vex_refuses": {
      text: `Vex looks at the shards. Looks at you. Looks back at the shards,
with the longest silence you have ever heard them hold — and then
laughs, the real one, the unpracticed door-hinge laugh, until they
have to sit down on a drowned pew.

'You're offering the biggest lock in the world,' they say, wiping
their eyes, 'to the person who BREAKS INTO THINGS. Gods, I almost
want to say yes just for the headlines.' They stand, and sober, and
for a moment the professional looks out from behind the patter,
absolutely level. 'Listen. I spent my whole life as something
somebody owned. The crown's just the brand with better metal —
everyone wearing it gets worn back, you've SEEN that, it's lying
right there.' A nod at the god. 'I steal things. I don't become
them. Pick somebody who never learned what a leash is, or better —'
the grin returns, crooked and fond '— break the thing. Locks that
can't be picked offend me professionally.'

They step back into your shadow, where the comfortable places are,
leaving the deciding where it was always going to live.`,
      on_enter: { xp: 30, approval: { vex: 10 } },
      choices: [{ text: "Decide.", goto: "final_choice" }],
    },
  };

  HC.story = HC.story || {};
  HC.story.act3 = { SCENES };
})(globalThis.HC);
