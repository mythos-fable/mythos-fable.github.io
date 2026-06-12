/* Act One: Briarwatch and the Howling Barrow.
   Ported from mythos/story/act1.py. */
(function (HC) {
  "use strict";

  const { all_of, bg, camp_departures, gold, hasnt, inp, item,
          no_item, not_met, notp } = HC.helpers;

  const SCENES = {
    // --------------------------------------------------------------- arrival
    "briarwatch_gate": {
      text: `Briarwatch is a stockade town on a hill, and the hill is wearing a
second town like a stain: refugee camps, hundreds of fires, lean-tos built
from cart-beds and prayer. The gates are shut at midafternoon. Above them a
sign in fresh paint reads NO ENTRY WITHOUT SURETY, and below the sign stands
a gate-guard whose job has clearly been awful for months.

'Town's full,' he recites, before you've said anything. 'Reeve's orders.
Surety of five gold for travelers, or you camp with that lot.' His eyes slide
away from the fires below, practiced at it.

# Somewhere down in the camps, a child is crying with the methodical exhaustion
of having been at it for days.`,
      choices: [
        { text: "Pay the five gold surety.", when: gold(5),
          fx: { gold: -5 }, goto: "briarwatch_square" },
        { text: "'I marched under Greyfield colors. You'll want to let history's " +
                "worst survivor camp inside the walls.' (Veteran)",
          when: bg("veteran"),
          fx: { xp: 15 },
          goto: "gate_veteran" },
        { text: "Talk your way through — this man is one bad shift away from " +
                "agreeing with anything.",
          check: { stat: "wits", dc: 12,
                   ok: "gate_talked", fail: "gate_refused" } },
        { text: "Climb the stockade after dark like a civilized person.",
          check: { stat: "might", dc: 11,
                   ok: "gate_climbed", fail: "gate_caught" } },
      ],
    },

    "gate_veteran": {
      text: `The word 'Greyfield' lands on the guard like cold water. People react
to it one of two ways, you've found, and his is the useful one: he looks at
your sword, then at your eyes, and arrives at a policy of not finding out.

'Surety waived for... veterans,' he decides, hauling the bar up. 'Welcome to
Briarwatch. Don't.' He doesn't finish the sentence. It's good advice anyway.`,
      choices: [{ text: "Enter the town.", goto: "briarwatch_square" }],
    },

    "gate_talked": {
      text: `You talk about inspection rosters and the reeve's surety ledger, and
about how irregular it would look if a traveler with business at the reeve's
hall were turned away the same week the grain-counts come due — and you watch
the guard decide that whatever this is, it's above his pay and beneath his
patience.

'Just go in,' he says, exhausted. 'You're the reeve's problem now. Everyone
is, technically.'`,
      on_enter: { xp: 20 },
      choices: [{ text: "Enter the town.", goto: "briarwatch_square" }],
    },

    "gate_refused": {
      text: `The guard has heard better, and from professionals. 'Five gold or the
camps,' he says, and puts his hand on the bar in a way that ends the
interview.

You drift down through the refugee fires to wait out the afternoon. A woman
feeding six children from one pot offers you a share without being asked,
which is the kind of thing that happens in the camps and never in the town.
Near dusk, a section of stockade behind the tannery catches your eye — old
posts, climbable, unwatched.`,
      choices: [
        { text: "Pay the five gold after all.", when: gold(5),
          fx: { gold: -5 }, goto: "briarwatch_square" },
        { text: "Climb the tannery stockade at dark.",
          check: { stat: "might", dc: 9,
                   ok: "gate_climbed", fail: "gate_caught" } },
        { text: "Share the woman's stew first, and leave her your spare coin.",
          when: gold(3),
          fx: { gold: -3, karma: 3,
                flags: { fed_camp_family: true } },
          goto: "gate_refused_2" },
      ],
    },

    "gate_refused_2": {
      text: `The stew is mostly nettles and the blessing that comes with it is
mostly sigh, but the children watch you eat with the solemn attention of
people memorizing proof that strangers can be kind. The woman tells you her
name is Edda, that they walked from Marrowdown, that Marrowdown isn't there
anymore. She says it the way you'd report weather.

= Night settles over the camps. The tannery stockade waits, climbable.`,
      choices: [
        { text: "Climb the tannery stockade.",
          check: { stat: "might", dc: 9,
                   ok: "gate_climbed", fail: "gate_caught" } },
        { text: "Pay the surety at the gate come morning.", when: gold(5),
          fx: { gold: -5 }, goto: "briarwatch_square" },
      ],
    },

    "gate_climbed": {
      text: `The tannery posts are slick and the drop on the far side is into a
yard that smells of every hide ever scraped, but you come down soft between
the curing racks, and Briarwatch acquires one more resident the traditional
way: unrecorded.`,
      on_enter: { xp: 15 },
      choices: [{ text: "Slip into the streets.", goto: "briarwatch_square" }],
    },

    "gate_caught": {
      text: `The post snaps. The yard receives you from nine feet, and a tanner's
boy receives the fright of his week, and two guards receive an easy arrest.
They are not gentle about the escort, and the fine is ten gold or a night in
the stocks — and seeing as the stocks are occupied, the fine it is. They turn
out your pockets themselves.`,
      on_enter: { hp: -4, gold: -10 },
      choices: [{ text: "Dust yourself off in the square.",
                  goto: "briarwatch_square" }],
    },

    // ------------------------------------------------------------------ hub
    "briarwatch_square": {
      text: (s) => `The square of Briarwatch is cobbled, crowded, and arguing with itself.

The town has food — you can smell the granary's bread-ovens from here — and
the camps outside have none, and everyone in the square is conducting the
long shouting match that fact deserves. On the gibbet-platform stand the
stocks, currently holding a sharp-faced prisoner who is heckling the crowd
with real artistry. The reeve's hall squats at the square's head, all new
iron on old oak. The Crooked Ewe tavern leaks fiddle music and woodsmoke.
And past the rooftops to the east, you can see it: a long whale-backed hill
against the grey sky, crowned with standing stones.

The Howling Barrow. Even from here, it's doing what it's named for — a thin
sound, riding under the wind, like something enormous keening through its
teeth.` + (!s.flag("barrow_known") ? `

Locals touch iron when they look at it. They've been doing that for a year,
since a falling star split its crest.` : ""),
      on_enter: { flags: { barrow_known: true } },
      choices: [
        { text: "Approach the prisoner in the stocks.",
          when: all_of(hasnt("vex_resolved"), not_met("vex")),
          goto: "vex_stocks" },
        { text: "Call at the reeve's hall about the granary and the starving " +
                "camps.",
          when: hasnt("grain_resolved"),
          goto: "reeve_hall" },
        { text: "Take a corner at the Crooked Ewe — rumors, supplies, and a " +
                "roof.", goto: "tavern" },
        { text: "Visit the ruined chapel of Vael on the town's east side.",
          when: hasnt("chapel_done"),
          goto: "chapel" },
        { text: "Set out for the Howling Barrow.",
          goto: "barrow_road" },
      ],
    },

    // ------------------------------------------------------------------ vex
    "vex_stocks": {
      text: `The prisoner in the stocks is somewhere past twenty and built like a
coat-rack, with quick black eyes and an old brand on one pinned wrist — a
rook, wings spread, burned in with professional neatness. They're keeping up
a running commentary on the crowd ('Madam, that hat was a crime before
stealing was') with the cheerful doggedness of someone who has decided that
dignity is the one thing the stocks can't take unless you hand it over.

# A greengrocer pelts them with a spoiled turnip. They catch it in their teeth.
The crowd, against its own civic principles, applauds.

'You're new,' the prisoner says, spitting turnip and clocking you instantly.
'New people sometimes ask what I did. Ask me what I did. I love this part.'`,
      choices: [
        { text: "Ask what they did.", goto: "vex_what" },
        { text: "Walk on. The stocks are usually earned.",
          goto: "briarwatch_square" },
      ],
    },

    "vex_what": {
      text: `'Burgled the granary,' the prisoner says, with the pride of a master
presenting a portfolio. 'Forty loaves, two wheels of cheese, a barrel of
salt pork. Single night. No witnesses, no broken locks — they only caught me
because I went back the second night, which, fine, hubris.'

A pause, perfectly weighted.

'Found every crumb of it in the refugee camps by morning, of course. That's
the part the reeve's actually angry about. Theft he could forgive — it's the
charity that's made it personal.' The black eyes glitter. 'Vex, by the way.
Three days I've been in this thing. Fine's twenty-five gold, the reeve's
round number for a lesson. So: you look like someone whose plans need a
person who can open things. I am extremely that person.'`,
      on_enter: { meet: "vex", xp: 10 },
      choices: [
        { text: "Pay the twenty-five gold fine.", when: gold(25),
          fx: { gold: -25, flags: { vex_resolved: true, vex_freed: true } },
          goto: "vex_freed_scene" },
        { text: "Come back at dusk and pick the stock's lock.",
          check: { stat: "wits", dc: 12,
                   ok: "vex_freed_sneak", fail: "vex_pick_caught" },
          fx: { flags: { vex_resolved: true } } },
        { text: "Tell the watch the prisoner is planning an escape — there may " +
                "be a consideration in it.",
          fx: { karma: -6, gold: 5,
                flags: { vex_resolved: true, vex_betrayed_early: true },
                approval: { vex: -60 } },
          goto: "vex_reported" },
        { text: "'Charity's not a skill I'm hiring for.' Leave them to the " +
                "turnips.",
          fx: { flags: { vex_resolved: true } },
          goto: "briarwatch_square" },
      ],
    },

    "vex_freed_scene": {
      text: `The watch-sergeant counts your coin twice, sniffs, and unpins the
stocks with the air of a man releasing a wasp indoors.

Vex unfolds, vertebra by vertebra, with a creaking monologue ('—and THAT'S
for the turnip lady—') and then stands rubbing their branded wrist and
studying you with sudden, total seriousness, the performance set down like
a tool between jobs.

'Twenty-five gold. For a stranger.' They flex their fingers. 'Right. Here's
what that buys, because I pay debts — it's the one thing I do that Mother
Rook would recognize as hers. You get my hands, my eyes, and every lock
between here and the wound in the world. Fair warning: there's a woman in
Cindral who considers me property, and the brand agrees with her. Travel
with me long enough and that becomes your problem too.'`,
      on_enter: { karma: 3 },
      choices: [
        { text: "'Locks open. Problems shared. Deal.'",
          fx: (s) => { s.changeApproval("vex", 15); return { recruit: "vex" }; },
          goto: "briarwatch_square" },
        { text: "'No deal. Consider it charity — apparently it's contagious.'",
          fx: (s) => { s.changeApproval("vex", 5);
                       return { flags: { vex_declined: true } }; },
          goto: "briarwatch_square" },
      ],
    },

    "vex_freed_sneak": {
      text: `Dusk, drizzle, one bored watchman, and a lock that was never consulted
about any of this. It surrenders in under a minute.

'Oh, you're competent,' Vex breathes, easing out of the stocks like smoke.
'I had a whole speech ready about my fine being an investment opportunity
and you've gone and made it a heist. So much better.' In the shadow of the
gibbet they rub the rook-brand on their wrist and give you the sudden,
serious look of a professional opening negotiations.

'Debts get paid. That's my whole religion. You get my hands and every lock
from here to the world's wound — fair warning, there's a woman in Cindral
who holds my brand and considers me inventory. Stick with me and she's your
problem eventually. Still want me?'`,
      on_enter: { karma: 2, xp: 30 },
      choices: [
        { text: "'Locks open. Problems shared. Welcome aboard.'",
          fx: (s) => { s.changeApproval("vex", 20); return { recruit: "vex" }; },
          goto: "briarwatch_square" },
        { text: "'We're square. Vanish well, Vex.'",
          fx: (s) => { s.changeApproval("vex", 5);
                       return { flags: { vex_declined: true } }; },
          goto: "briarwatch_square" },
      ],
    },

    "vex_pick_caught": {
      text: `The lock is old and bloody-minded, and the watchman is less bored than
advertised. A lantern finds your hands exactly where they shouldn't be.

'Run,' Vex hisses, delighted, 'I'll do the distraction—' and then bellows
I'M ESCAPING at the top of their lungs, which empties the watch-house in
your favor and theirs not at all. You go over a fence with whistles behind
you.

By morning the word is that the prisoner bit two guards during the uproar
and has been sold on to a road-gang heading north to dig fortifications.
Gone, in other words. The turnip lady seems genuinely bereaved.`,
      on_enter: { xp: 10, flags: { vex_lost: true } },
      choices: [{ text: "Nothing for it. Back to the square.",
                  goto: "briarwatch_square" }],
    },

    "vex_reported": {
      text: `The watch-sergeant pays five gold for the tip with the satisfaction of
a man whose suspicions have come due, and the watch doubles overnight.

You're in the square at dawn when they take Vex out of the stocks in proper
chains. The thief scans the crowd — finds you — and goes very still. Then,
horribly, smiles: a small, bright, professional smile, like a ledger closing.

'Sold twice in one life,' they call across the square, conversational. 'The
first one branded me. Wonder what you'll cost me.' The wagon takes them
south in irons. South is Cindral. Cindral is Mother Rook, who pays bounties
on her own escaped property, which a part of you already knew.`,
      choices: [{ text: "Pocket the five gold and move on.",
                  goto: "briarwatch_square" }],
    },

    // ---------------------------------------------------------------- reeve
    "reeve_hall": {
      text: `Reeve Aldric of Briarwatch is a well-fed man at a well-made desk, and
he has the new look of small men in large times: frightened, and armored in
procedure.

'The granary is at capacity and sealed,' he says, before you've finished
asking. 'Winter stores. The town's own. If I open it to that rabble on the
hill, Briarwatch starves by Candlemas, and I will not—' he taps the desk
'—be the reeve who fed strangers on his own children's bread.'

Through the window behind him you can see the granary in question: fat,
guarded, and large enough that his arithmetic smells confidently wrong. On
his desk, half-buried under petitions, sits the granary ledger with its
brass clasp.`,
      choices: [
        { text: "Appeal to the man under the procedure — the camps will die, " +
                "and he'll have minuted it.",
          check: { stat: "spirit", dc: 14,
                   ok: "reeve_persuaded", fail: "reeve_refused" } },
        { text: "Ask to verify his arithmetic against the ledger — loudly, in " +
                "front of his clerks.",
          check: { stat: "wits", dc: 13,
                   ok: "reeve_audit", fail: "reeve_refused" } },
        { text: "Come back tonight and rob the granary for the camps.",
          goto: "reeve_heist" },
        { text: "Offer to make the refugee problem 'move on' — for a price.",
          fx: { karma: -7 },
          goto: "reeve_dark" },
        { text: "Leave the reeve to his ledger.",
          goto: "briarwatch_square" },
      ],
    },

    "reeve_persuaded": {
      text: `You don't argue numbers. You ask him what the town's name will mean in
ten years — whether Briarwatch will be the town that watched, or the town
that didn't — and somewhere in there the procedure cracks and the small
frightened man looks out through it at the fires on the hill, and stays
looking.

'Half-rations from the surplus stores,' he says at last, hoarse, writing as
though the pen weighs a great deal. 'Bread carts at dawn and dusk. If my own
go hungry by spring, I'll send them to curse you by name.'

By evening the carts roll out the gates, and the sound that comes back off
the hill — you'll keep that. It's the sound several hundred people make when
the world surprises them in the other direction for once.`,
      on_enter: { karma: 7, xp: 50,
                  flags: { grain_resolved: true, fed_refugees: true },
                  approval: { serra: 12, vex: 8 } },
      choices: [{ text: "Back to the square.", goto: "briarwatch_square" }],
    },

    "reeve_audit": {
      text: `The ledger is a novel, and you read it aloud. Granary 'at capacity' —
yet here are sales, quiet ones, grain moving out the water-gate at night to
a broker in Cindral at four times the famine price. The clerks have gone
very interested in their shoes. The reeve has gone the color of suet.

'What,' he says carefully, 'do you want.'

That's the question, isn't it.`,
      on_enter: { xp: 40 },
      choices: [
        { text: "'Feed the camps. Carts at dawn and dusk, and I never learned " +
                "to read.'",
          fx: { karma: 6, flags: { grain_resolved: true,
                                   fed_refugees: true,
                                   squeezed_reeve: true },
                approval: { serra: 10, vex: 12 } },
          goto: "reeve_audit_feed" },
        { text: "'Forty gold, and I never learned to read.'",
          fx: { karma: -6, gold: 40,
                flags: { grain_resolved: true, took_reeve_bribe: true },
                approval: { serra: -12, vex: -4 } },
          goto: "reeve_audit_bribe" },
        { text: "'Feed the camps AND forty gold. You're in no position to " +
                "haggle.'",
          fx: { karma: 1, gold: 40,
                flags: { grain_resolved: true, fed_refugees: true,
                         squeezed_reeve: true, took_reeve_bribe: true },
                approval: { serra: 4, vex: 15 } },
          goto: "reeve_audit_feed" },
      ],
    },

    "reeve_audit_feed": {
      text: `The carts roll at dusk. You stand at the gate and watch several hundred
people on the hill discover that the world has surprised them in the other
direction, for once; the sound of it carries.

The reeve watches too, from his window, hating you with the special
intensity reserved for people who have seen the books. He'll keep the
bargain. Men like Aldric always keep the bargains they can't afford to have
read aloud.`,
      choices: [{ text: "Back to the square.", goto: "briarwatch_square" }],
    },

    "reeve_audit_bribe": {
      text: `The gold is in your hand almost before you finish the sentence —
counted, bagged, and ready, which tells you that you are not the first
literate person to pass through Briarwatch.

On the hill, the fires burn small to stretch the fuel. In the granary, the
grain settles in the dark, accruing. Everyone keeps their bargain. That's
the system working, technically.`,
      choices: [{ text: "Back to the square.", goto: "briarwatch_square" }],
    },

    "reeve_refused": {
      text: `The procedure holds. The reeve retreats into it like a crab into rock,
and produces, with finality, the phrase 'the matter is minuted' — after which
there is nothing left in the room to talk to.

Outside, the bread-ovens breathe their warm insult over the walls toward
the camps.`,
      choices: [
        { text: "Come back tonight and rob the granary for the camps.",
          goto: "reeve_heist" },
        { text: "Let it lie.", fx: { flags: { grain_resolved: true } },
          goto: "briarwatch_square" },
      ],
    },

    "reeve_heist": {
      text: (s) => `The granary at night is fat, smug, and guarded by two men who guard
it the way you guard a thing nobody has ever actually attacked.` + (s.inParty("vex") ? `

Vex walks the perimeter once and comes back wearing the expression of a
horse-trader at a foal auction. 'The water-gate,' they whisper. 'It's not
even locked, it's ASHAMED. Give me a quarter hour and a wheelbarrow.'` : ""),
      choices: [
        { text: "Run the heist: grain over the wall and down to the camps " +
                "before dawn.",
          check: { stat: "wits", dc: 13,
                   ok: "heist_done", fail: "heist_caught" },
          when: notp("vex") },
        { text: "Run the heist with Vex on the locks.",
          when: inp("vex"),
          fx: { approval: { vex: 15 } },
          goto: "heist_done" },
        { text: "Think better of it.", goto: "briarwatch_square" },
      ],
    },

    "heist_done": {
      text: `It goes like water running downhill. Sacks over the water-gate, carts
borrowed from the tannery, and a bucket-chain of refugees materializing out
of the dark the moment they understand — silent, fast, passing forty
hundredweight of bread-flour hand to hand to hand down the hill like a
secret.

By dawn the granary is honest for the first time in a year and every fire on
the hill has a pot over it. The reeve will howl, and count, and recount, and
prove nothing. The camps learned long ago how to have seen nobody.`,
      on_enter: { karma: 6, xp: 50,
                  flags: { grain_resolved: true, fed_refugees: true,
                           robbed_granary: true },
                  approval: { serra: 8 } },
      choices: [{ text: "Back to the square, whistling.",
                  goto: "briarwatch_square" }],
    },

    "heist_caught": {
      text: `The water-gate's hinge shrieks like a witness. Lanterns, whistles, and
a quarter hour of undignified athletics across the tannery roofs — you get
clear, but with empty hands, a wrenched shoulder, and the town watch now
camped on the granary in numbers.

On the hill, the fires burn small. That door has closed.`,
      on_enter: { hp: -5, flags: { grain_resolved: true } },
      choices: [{ text: "Back to the square.", goto: "briarwatch_square" }],
    },

    "reeve_dark": {
      text: `The reeve goes still, the way men do when someone says the quiet
arithmetic out loud.

'Move on,' he repeats. 'They have nowhere to—' He stops himself. Resumes,
quieter: 'What would that cost?'

You name thirty gold. He doesn't haggle, which tells you how long he's been
wanting to be offered this. What it looks like, in the end: you and a hired
handful of tannery toughs walking the camps at dusk, kicking out fires,
splitting open the lean-tos, putting the fear into people who owned nothing
but the hill itself. They don't fight. People who've walked from burned
villages know the drill better than the people running it. By midnight the
hill is moving south in the cold — toward Cindral, mostly, where the cult
waits with its ledgers.

# Edda's children watch you from the column. You're fairly sure it's Edda's.
You don't check.`,
      on_enter: { karma: -10, gold: 30, xp: 20,
                  flags: { grain_resolved: true, drove_off_refugees: true },
                  approval: { serra: -25, vex: -20 } },
      choices: [{ text: "Back to the square, paid.", goto: "briarwatch_square" }],
    },

    // --------------------------------------------------------------- tavern
    "tavern": {
      text: `The Crooked Ewe is low-beamed, packed, and exactly warm enough to make
the world outside deniable. Mab, the innkeep, pulls ale with one hand and
rules the room with the other. A fiddler in the corner plays the old counting
songs, the ones with a verse for every god — he skips Vael's verse, and
everyone pretends not to notice the held beat of silence where it used to go.

Near the fire, a refugee woman sits with a sleeping infant, methodically
turning a single copper coin over in her fingers like a question she can't
put down.`,
      choices: [
        { text: "Buy supplies from Mab. (poultice 6g, bread 2g)",
          goto: "tavern_shop" },
        { text: "Stand the room a round and trawl for rumors. (4 gold)",
          when: all_of(gold(4), hasnt("tavern_rumors")),
          fx: { gold: -4, flags: { tavern_rumors: true }, xp: 20 },
          goto: "tavern_rumors" },
        { text: "Quietly leave five gold beside the woman with the infant.",
          when: all_of(gold(5), hasnt("helped_mother")),
          fx: { gold: -5, karma: 3, flags: { helped_mother: true },
                approval: { serra: 5 } },
          goto: "tavern_mother" },
        { text: "That copper is the easiest mark in the room.",
          when: all_of(hasnt("helped_mother"), (s) => s.karma < 5),
          fx: { karma: -7, gold: 1, flags: { helped_mother: true,
                                             robbed_mother: true },
                approval: { serra: -15, vex: -15 } },
          goto: "tavern_robbed" },
        { text: "Back to the square.", goto: "briarwatch_square" },
      ],
    },

    "tavern_shop": {
      text: `= Mab's back-shelf stock is overpriced and she knows it and you know it
and the next town is a day's walk, so here everyone is.`,
      choices: [
        { text: "Herbal poultice. (6 gold)", when: gold(6),
          fx: { gold: -6, "items+": ["poultice"] }, goto: "tavern_shop" },
        { text: "Travel bread. (2 gold)", when: gold(2),
          fx: { gold: -2, "items+": ["bread"] }, goto: "tavern_shop" },
        { text: "A soldier's blade off the wall — Mab takes trade-ins from " +
                "those who don't come back. (20 gold)",
          when: all_of(gold(20), no_item("soldiers_blade")),
          fx: { gold: -20, "items+": ["soldiers_blade"] },
          goto: "tavern_shop" },
        { text: "Done shopping.", goto: "tavern" },
      ],
    },

    "tavern_rumors": {
      text: `Four gold buys a round and a round buys the room, and the room knows
things.

It knows the Howling Barrow split open the night the star fell, and that the
howl is new — the hill was quiet for three thousand years, the stones only
sang on midwinter, and now it grieves all year round. It knows two boys went
in after the star-metal and came out aged and wrong, saying the dead king
asked them a question they couldn't answer. It knows you go in at moonrise
or not at all, because the door is a door only when the moon says so.

It knows Cindral is worse than the road-talk says: the Queen Regent rules a
city half-mad with the Ember Cult, and the cult holds something that fell
from the sky in their Pyre Cathedral and calls it the Flame Undying.

And at the bottom of the fourth tankard, the fiddler tells you the thing the
room knows and doesn't say: that the howling from the barrow isn't grief.
'It's the same note the chapel bells made,' he says, 'all of them, every
bell in the grey country, the night the Crown came down. The hill isn't
mourning, friend. It's ringing.'`,
      choices: [{ text: "Sleep on it. (Free with the round — Mab's not a " +
                        "monster.)",
                  fx: { heal_full: true },
                  goto: "tavern" }],
    },

    "tavern_mother": {
      text: `You don't make a ceremony of it — coin on wood, a nod, done. She looks
at the five gold, then at you, and her face does something complicated: the
arithmetic of pride against the arithmetic of the sleeping weight on her arm.

'His name's Tam,' she says finally, which is not thank you, and is much
bigger than thank you. 'When he asks where the winter went, I'll tell him a
stranger bought it.'`,
      choices: [{ text: "Back to your corner.", goto: "tavern" }],
    },

    "tavern_robbed": {
      text: `It's nothing. A stumble in passing, an apology, two fingers. The copper
is yours before her head finishes turning, and she'll search the floorboards
for an hour tonight, because when you have one coin the floor is always the
first suspect and the world's never once been kind enough to make it true.

# One copper. You've stolen purses worth five hundred times this and felt
less. Funny how the small ones itch.`,
      choices: [{ text: "Back to your corner.", goto: "tavern" }],
    },

    // --------------------------------------------------------------- chapel
    "chapel": {
      text: (s) => `Briarwatch's chapel of Vael lost its congregation before it lost its
roof; the Withering took the vicar's mind in the spring and the town took
the lead off the roof by summer, and now the Shepherd's house stands open to
the weather, which feels less like sacrilege than honesty.

The mural behind the altar survives: Vael the Shepherd, tall as the wall,
crook in hand, gathering a river of small painted souls toward fields the
painter made golden. Three thousand years of artists painted this scene by
rote. This one did something odd, though — you have to stand close to see
it. The Shepherd's face, under the crown.

He painted him weary. Not serene. Weary.` + (s.inParty("serra") ? `

Serra stands before it a long time. 'I took my vows under one of these,'
she says finally. 'The painter at home did the same thing with the eyes.
I used to think it was a flaw.' She doesn't say what she thinks now.` : (
        (s.companions.serra.met
          && !s.companions.serra.in_party
          && !s.flag("robbed_refugees")
          && s.approval("serra") > -20) ? `

A woman in a grey cloak kneels at the altar rail — Serra Valebright, the
knight from the Mill Bridge, her scored-out shield laid flat before her like
an offering or an accusation.` : "")),
      on_enter: { flags: { chapel_done: true } },
      choices: [
        { text: "Kneel where a thousand others knelt, and listen to the quiet.",
          check: { stat: "spirit", dc: 12,
                   ok: "chapel_vision", fail: "chapel_nothing" } },
        { text: "Speak with Serra at the rail.",
          when: (s) => (s.companions.serra.met
                        && !s.companions.serra.in_party
                        && s.companions.serra.alive
                        && !s.flag("robbed_refugees")
                        && !s.flag("serra_rejoined_done")
                        && s.approval("serra") > -20),
          goto: "chapel_serra" },
        { text: "Pry the silver leaf from the altar screen. The god's not " +
                "using it.",
          when: hasnt("robbed_chapel"),
          fx: { gold: 15, karma: -4, flags: { robbed_chapel: true },
                approval: { serra: -15 } },
          goto: "chapel" },
        { text: "Leave the Shepherd to the weather.", goto: "briarwatch_square" },
      ],
    },

    "chapel_vision": {
      text: `The quiet under the broken roof has a grain to it, like wood; you kneel
long enough to feel which way it runs.

And for one breath — one — you are somewhere else: a hillside of golden
grass, and a shepherd sitting with his back to you, watching an enormous
flock graze toward a horizon that never gets closer. He doesn't turn. But
you see his hands, resting on the crook, and they are the hands of someone
at the end of a very long shift: rope-burned, patient, finished.

# Tired, you think, and the hillside thinks back, with a gratitude that nearly
stops your heart: 'Finally. Someone noticed.'

You surface with your pulse loud and the mural's weary painted eyes resting
on you like a hand on the shoulder.`,
      on_enter: { xp: 40, flags: { chapel_vision: true } },
      choices: [{ text: "Leave the chapel, carrying it.",
                  goto: "briarwatch_square" }],
    },

    "chapel_nothing": {
      text: `You kneel. Wind through the rafters; a pigeon's opinion; somewhere
outside, two townsmen arguing about a fence. If the god's silence has a
message in it, it's in a language patience hasn't taught you yet.

= Your knees inform you that the rail was built for more devout anatomy.`,
      choices: [{ text: "Up, then, and onward.", goto: "briarwatch_square" }],
    },

    "chapel_serra": {
      text: `She doesn't look up. 'I'm not praying,' she says. 'I'm filing a
complaint.'

You wait. She rises, shoulders the shield, and looks at the weary painted
face a moment longer. 'I escort columns and I file complaints with an empty
chair. It's not a life, it's a holding pattern.' She turns to you. 'You're
walking to the wound. I keep saying I will, and I keep finding reasons to be
needed somewhere smaller. Take me along and I'll stop filing complaints and
go ask the Shepherd directly.'`,
      on_enter: { flags: { serra_rejoined_done: true } },
      choices: [
        { text: "'Get your shield. We leave from the barrow.'",
          fx: { recruit: "serra" },
          goto: "briarwatch_square" },
        { text: "'The chair's empty everywhere, Serra. Stay with your columns.'",
          fx: (s) => { s.changeApproval("serra", -10); return {}; },
          goto: "briarwatch_square" },
      ],
    },

    // ------------------------------------------------------------ the barrow
    "barrow_road": {
      text: (s) => `The Howling Barrow grows as you climb toward it, and so does the howl —
not louder so much as deeper, a note you start to feel in the long bones.
The hill is a king's grave from before the kingdom: a whale-back of turf
three hundred paces long, crowned with standing stones, split at the crest
by something that came down burning. The Withering is thick here. The grass
is the grey of old men's hair, and it bends toward the hill, all of it,
like iron filings.

Halfway up, you find the welcoming committee.

Hollowed. Five of them, standing in the grey grass in the postures of the
people they were — a milkmaid with her yoke, an old man leaning on nothing
where a stick should be, a boy. They face the barrow the way sunflowers face
the sun. As you approach, they turn. Slowly. Together. Their eyes are the
grey of the grass, and empty, and somehow attentive — rooms where the lamp
is out but someone is home.` + (s.inParty("serra") ? `

'They gather where the shards fall,' Serra says quietly. 'Like cold hands
to a fire. Hold. They've done no harm yet.'` : ""),
      choices: [
        { text: "Cut them down. Whatever they were, they're between you and " +
                "the barrow now.",
          fx: { karma: -6, xp: 15, flags: { killed_hollowed: true },
                approval: { serra: -10, vex: -5 } },
          goto: "barrow_road_kill" },
        { text: "Speak to what's left in them, and lead them gently off the " +
                "hill.",
          check: { stat: "spirit", dc: 13,
                   ok: "barrow_road_led", fail: "barrow_road_failed" } },
        { text: "Raise the soul-lantern and see what the dead make of the " +
                "empty.",
          when: item("soul_lantern"),
          fx: { xp: 30, karma: 2, flags: { lantern_hollowed: true } },
          goto: "barrow_road_lantern" },
        { text: "Give them a wide berth and keep climbing.",
          goto: "barrow_door" },
      ],
    },

    "barrow_road_kill": {
      text: `They don't resist. That's the thing you'll carry: they watch the blade
come with the mild attention of people watching weather, and they fold like
laundry, one after another, and the hill drinks what's left without comment.

The boy is last. At the end, for half a heartbeat, his grey eyes find yours
and something in the empty room leans toward the window — and then it's
done, and you're standing in the bent grass breathing hard, and the howl of
the barrow has picked up a thin new harmonic that you choose not to think
about.

= The way to the crest is clear.`,
      choices: [{ text: "Climb to the barrow's crest.", goto: "barrow_door" }],
    },

    "barrow_road_led": {
      text: `You speak. Not orders — you've watched people try orders on the
Hollowed. You speak the way you'd speak through a door to someone who's
barricaded inside: news of the weather, names of villages, an old counting
song. And the empty rooms lean toward the window, one by one, and the five
of them fall in behind you like ducklings as you walk them down the far
slope, away from the hill's terrible magnetism, to a shepherd's hut with a
well.

The milkmaid sets down her yoke there. It's nothing — a motion — but it's a
choice, the first one anybody's seen a Hollowed make, and you find you have
to look at the horizon for a moment.

They'll wander again. But not toward the barrow tonight.`,
      on_enter: { karma: 5, xp: 45 },
      choices: [{ text: "Climb back up to the barrow's crest.",
                  goto: "barrow_door" }],
    },

    "barrow_road_failed": {
      text: `Whatever's left in them doesn't answer to your voice. They turn back to
the barrow, all five, in that terrible unison — and you notice the boy's
lips are moving, barely, in time with the hill's long howl, the way children
mouth along to songs they don't know they've learned.

= You leave them to their vigil and climb past, careful, cold along the spine.`,
      choices: [{ text: "On to the crest.", goto: "barrow_door" }],
    },

    "barrow_road_lantern": {
      text: `You unhood the lantern, and three hundred years of Ashfen's dead look
out at five empty rooms.

The Hollowed kneel.

All five, at once, in the grey grass — not collapsing: kneeling, the way you
kneel to a king or a sacrament, faces raised to the milk-pale light with an
expression you will spend years failing to name. The nearest thing to it is
homesickness. The dead in the glass press bright against the walls; the
empty press close around the light; and for a moment, on a withered hillside
at the end of the world, the two halves of a broken thing recognize each
other across the gap where a god used to be.

The lantern dims to embers, spent for the night. The Hollowed stay kneeling.
You walk to the crest through a congregation.`,
      choices: [{ text: "On to the barrow door.", goto: "barrow_door" }],
    },

    "barrow_door": {
      text: `The split in the barrow's crest goes down between two of the standing
stones, and at its bottom — where no digger ever found one — there is now a
door. Black stone, dressed and polished, older in style than anything above
it. The falling shard didn't break the hill open. It woke the hill up.

Around the door's frame runs a single line of script. The characters are
First Tongue — the god's own alphabet, the one only the burned archives
taught.

From beyond the stone, the howling resolves at last into what it always
was: a voice. Enormous, buried, patient, singing one note. The door has no
handle, no seam, no hinge. The script is the lock.`,
      choices: [
        { text: "Read the First Tongue aloud. You learned it in a burning " +
                "archive. (Scribe)",
          when: bg("scribe"),
          fx: { xp: 40, flags: { door_read: true } },
          goto: "barrow_door_read" },
        { text: "Puzzle the script out — old liturgical forms turn up on " +
                "coins, on wards, in counting songs.",
          when: (s) => s.player.background !== "scribe",
          check: { stat: "wits", dc: 14,
                   ok: "barrow_door_read", fail: "barrow_door_stuck" } },
        { text: "Doors are a suggestion. Put your shoulder into the cracked " +
                "side of the frame.",
          check: { stat: "might", dc: 13,
                   ok: "barrow_door_forced", fail: "barrow_door_hurt" } },
      ],
    },

    "barrow_door_read": {
      text: `The script says what every lock says, once you can read it: a name and
a condition.

# HERE LIES ALDOUS, FIRST AND LAST KING OF THE UNCROWNED, WHO WOULD NOT KNEEL.
LET NONE ENTER WHO COME TO MAKE HIM.

You speak the king's name aloud in the god's alphabet, and add — because the
condition demands an answer — that you come to make him do nothing at all.

The stone considers. Then the door swings inward on three thousand years of
held breath, and the howl pours up past you into the night like something
finally allowed to stand up straight.`,
      on_enter: { xp: 30 },
      choices: [{ text: "Descend.", goto: "barrow_hall" }],
    },

    "barrow_door_stuck": {
      text: `The forms are old past your reckoning — you can pick out a name,
ALDOUS, and a negation, and the rest keeps its counsel. The door doesn't
move. The voice below sings on, patient as geology.

The cracked side of the frame, though, where the falling shard split the
hill: that looks like it would answer to shoulders.`,
      choices: [
        { text: "Force the cracked frame.",
          check: { stat: "might", dc: 12,
                   ok: "barrow_door_forced", fail: "barrow_door_hurt" } },
        { text: "Speak the one word you could read — the name — and knock.",
          check: { stat: "spirit", dc: 12,
                   ok: "barrow_door_read", fail: "barrow_door_hurt" } },
      ],
    },

    "barrow_door_forced": {
      text: `The shard's impact did the real work a year ago; you just finish the
argument. The cracked slab grinds back under your shoulder, inch by inch,
swearing in stone-language, until the gap is a door's worth of dark.

The howl pours up past you, glad of the room. Below, steps spiral down into
air that tastes of bronze and long patience.`,
      on_enter: { xp: 20, flags: { door_forced: true } },
      choices: [{ text: "Descend.", goto: "barrow_hall" }],
    },

    "barrow_door_hurt": {
      text: `The stone wins the first round — wins it with a grinding shrug that
takes skin off your shoulder and pride off everything else. You sit in the
grass awhile, bleeding and reconsidering your relationship with geology.

The door waits. It's good at it. You'll have to try again, harder or
smarter.`,
      on_enter: { hp: -5 },
      choices: [
        { text: "Again, with fury.",
          check: { stat: "might", dc: 12,
                   ok: "barrow_door_forced", fail: "barrow_door_hurt" } },
        { text: "Again, with cunning — study the script properly this time.",
          check: { stat: "wits", dc: 12,
                   ok: "barrow_door_read", fail: "barrow_door_hurt" } },
      ],
    },

    "barrow_hall": {
      text: (s) => `The stair opens into a hall that should not fit inside the hill.

Bronze lamps light themselves as you pass, burning nothing. The walls are
painted, and the paint is wet-bright after three thousand years, and the
story it tells is not the one the chapels teach.

Here is Vael, descending in glory to the first tribes — and the tribes
kneeling, all save one figure, a man standing in a crowd of bent backs.
Here is the god offering that man a crown — a small copy of his own, the
gift the chapels call the First Blessing — and the man's hands open,
refusing. Here is the consequence the hymns skip: a war of one against
heaven, brief as a match-flame. And here at the last: the man on a throne
under a hill, buried alive with full honors by a god too fond of him to
kill him — sealed under stone with his unworn crown hung above his head,
just out of a seated man's reach.

The final panel shows the god walking away from the hill, crook over his
shoulder. The painter gave him the weary eyes too. And under the panel, a
line of First Tongue you don't need scholarship to feel the weight of:

# HE ASKED ME TO RULE BESIDE HIM. I ASKED HIM WHO WOULD RULE HIM. WE ARE BOTH
STILL WAITING ON AN ANSWER.` + (!s.hasItem("barrow_oath") ? `

In a niche beside the throne-room arch hangs a knot of bronze wire, tied in
a pattern your eyes keep losing — the Oath-Knot, grave-good of a king who
trusted no god to witness promises.` : "") + (!s.flag("robbed_barrow") ? `

Grave-goods line the processional way: bronze cups, arm-rings, a king's
ransom in the old sense, the literal one.` : ""),
      choices: [
        { text: "Take the Oath-Knot from its niche.",
          when: no_item("barrow_oath"),
          fx: { "items+": ["barrow_oath"], xp: 15 },
          goto: "barrow_hall" },
        { text: "Fill your pockets with the grave-gold.",
          when: hasnt("robbed_barrow"),
          fx: { gold: 35, karma: -5, flags: { robbed_barrow: true },
                approval: { serra: -10, vex: 5 } },
          goto: "barrow_hall" },
        { text: "Walk the processional way to the throne room.",
          goto: "barrow_throne" },
      ],
    },

    "barrow_throne": {
      text: (s) => `The throne room is a dome of black stone, and the howl lives here.

He sits as the murals promised: Aldous, First and Last King of the
Uncrowned, three thousand years dead and incompletely convinced of it.
Bronze and bone, verdigris and sinew, a beard gone to green wire, eyes like
drowned stars. Above his head, on chains, hangs the little crown he refused
— polished, patient, an arm's length out of reach. It has hung there long
enough to wear a groove in his attention.

And in his lap, cradled in both gauntlets, lies a piece of the night sky:
a shard of the Hollow Crown, a hand's length of something that is to gold
what lightning is to a lamp. The howl comes from the shard. The king is
not singing. The king is HOLDING the song, the way you hold a screaming
child.

The drowned-star eyes find you. The voice, when it comes, is dust learning
speech again, and it asks the question the tavern warned you of — the one
the two boys couldn't answer:

'DOES THE SHEPHERD STILL WEAR HIS CROWN?'` + (s.hasItem("soul_lantern") ? `

At your belt, the soul-lantern has begun to glow — softly, steadily,
warming toward the truth like a hearth. The dead of Ashfen are listening
for your answer.` : ""),
      choices: [
        { text: "Answer true: 'No. The Crown is broken and the god has fallen " +
                "silent. A piece of it is in your lap.'",
          goto: "aldous_parley" },
        { text: "Lie: 'He wears it still. He sent me for what fell.'",
          goto: (s) => (s.hasItem("soul_lantern") ? "aldous_lie_lantern"
                                                  : "aldous_lie") },
        { text: "Answer with steel. He's a corpse with treasure in his lap.",
          combat: { enemy: "barrow_wight", win: "aldous_slain" },
          fx: { flags: { attacked_king: true } } },
        { text: "Speak the unbinding written under the murals — the god's own " +
                "grammar of release. (Scribe)",
          when: bg("scribe"),
          goto: "aldous_freed" },
      ],
    },

    "aldous_lie": {
      text: `The drowned stars regard you for a long, geological moment.

'THREE THOUSAND YEARS,' the king says, 'AND STILL HE SENDS ME LIARS.' The
gauntlets close around the shard. 'I HELD HIS GIFT FOR AN AGE WITHOUT
TOUCHING IT. I CAN WEIGH A FALSEHOOD THROUGH STONE, LITTLE COURTIER. THE
SHEPHERD SENDS NO ONE, BECAUSE THE SHEPHERD IS SILENT, BECAUSE THE SONG IN
MY LAP IS HIS DEATHBED NOISE. I KNOW. I HOPED TO HEAR IT SAID.'

He rises. The throne room rises with him, somehow, the whole hill leaning
in.

'YOU COME TO A GRAVE AND CHOOSE THE LIE. BE BURIED WITH IT.'`,
      choices: [
        { text: "Fight the First King.",
          combat: { enemy: "barrow_wight", win: "aldous_slain" },
          fx: { flags: { attacked_king: true, lied_to_king: true } } },
        { text: "'Wait. The truth, then — the god is dead, and I came for the " +
                "shard, and I lied because I feared you.'",
          check: { stat: "spirit", dc: 14,
                   ok: "aldous_parley", fail: "aldous_lie_doom" },
          fx: { flags: { lied_to_king: true } } },
      ],
    },

    "aldous_lie_doom": {
      text: `'FEAR,' says the king, 'IS THE BEGINNING OF HONESTY, BUT YOU HAVE
ARRIVED AT IT LATE.'

The hill closes its hand.`,
      choices: [
        { text: "Fight for your life.",
          combat: { enemy: "barrow_wight", win: "aldous_slain" },
          fx: { flags: { attacked_king: true, lied_to_king: true } } },
      ],
    },

    "aldous_lie_lantern": {
      text: `The lie is still crossing your teeth when the soul-lantern detonates
with light.

Not the hearth-glow of truth — a glare, an alarm, three hundred years of
the honest dead slamming bright against the glass at once. Your shadow
leaps black across the dome. The king's drowned-star eyes go from you to
the lantern and back, and something in the bronze face moves that might,
three thousand years ago, have been the start of a smile.

# 'YOUR LUGGAGE DISAGREES,' says Aldous, First and Last King of the
Uncrowned.`,
      on_enter: { xp: 15, flags: { lied_to_king: true } },
      choices: [
        { text: "'...The dead are correct. The god is fallen, the Crown is " +
                "broken, and I came for the shard.'",
          goto: "aldous_parley" },
        { text: "Commit to the lie. Loudly.",
          goto: "aldous_lie_doom" },
      ],
    },

    "aldous_slain": {
      text: `The First King comes apart the way a mountain would, if a mountain
could be talked into it: slowly, in sections, fighting for every inch of
his own ending. The last of him to fail is the gauntlets, which set the
shard down — gently, deliberately, away from the fray — before the arms
themselves give up their long argument with time.

The howl stops. The silence afterward has edges.

The shard lies on the throne's seat, singing now only to itself. Above,
the little unworn crown turns on its chains. And the bronze sword that
fought you to a standstill lies across the steps, yours by the oldest law
there is.

You are alone under the hill with everything the last honest king owned.`,
      on_enter: { xp: 80, "items+": ["crown_shard_1", "barrow_sword"],
                  karma: -3, flags: { killed_king: true, has_shard1: true },
                  approval: { serra: -5 } },
      choices: [{ text: "Take what you came for and climb to the air.",
                  goto: "act1_camp" }],
    },

    "aldous_parley": {
      text: `The king is still for so long that you wonder if death has finally
collected. Then the gauntlets loosen around the shard, and the sound that
comes out of the bronze chest is three thousand years of held breath going
out at once. The hill settles. The lamps gutter.

'DEAD.' He tastes the word. 'I OUTLASTED HIM. I SAT UNDER THIS STONE WITH
HIS TRINKET OVER MY HEAD AND I OUTLASTED THE SKY.' Another breath, and the
triumph drains out of it as fast as it came. 'AND IT IS THE WORST NEWS I
HAVE EVER BEEN BROUGHT. WHO WILL HOLD THE LOOM, FOOL? WHO CARRIES THE
WEIGHT? HE ASKED ME TO RULE BESIDE HIM AND I ASKED WHO WOULD RULE HIM AND
THIS —' the gauntlets lift the shard a fraction '— THIS IS THE ANSWER WE
BOTH WAITED ON. NO ONE. NO ONE RULED HIM, AND NO ONE CAUGHT HIM, AND NOW
THE WORLD RAVELS.'

The drowned stars fix on you.

'YOU WANT THE SHARD. EVERYTHING THAT CLIMBS THIS HILL WANTS THE SHARD. TELL
ME WHAT YOU WILL DO WITH THE CROWN OF THE WORLD, CLIMBER, AND BY MY OWN
UNWORN CROWN — TELL ME TRUE, FOR I WEIGH FALSEHOOD THROUGH STONE.'`,
      choices: [
        { text: "'Mend it. The world is unraveling — I mean to put the Crown " +
                "back, whatever that takes.'",
          fx: { flags: { oath_restore: true } },
          goto: "aldous_oath" },
        { text: "'Destroy it. No more crowns, no more shepherds. Your answer, " +
                "king — no one should rule a god, so nothing should need to.'",
          fx: { flags: { oath_destroy: true } },
          goto: "aldous_oath" },
        { text: "'Wear it. Someone must hold the loom. Why not a hand I " +
                "trust?'",
          fx: { flags: { oath_claim: true } },
          goto: "aldous_oath" },
        { text: "'I don't know yet. I'll know at the wound, with the whole " +
                "truth in front of me — not before.'",
          fx: { flags: { oath_honest: true } },
          goto: "aldous_oath" },
      ],
    },

    "aldous_oath": {
      text: (s) => (`The stone weighs your words, and you feel it do so — a pressure on the
chest, like deep water deciding whether to let you float.

` + (s.flag("oath_honest")
        ? "'HONEST,' the king pronounces at last, and there is something like " +
          "respect in the dust of his voice. 'THE ONLY ANSWER I COULD NOT HAVE " +
          "GIVEN AT YOUR AGE. CERTAINTY WAS MY VICE. IT COST ME THE SKY.'"
        : s.flag("oath_restore")
        ? "'A MENDER,' the king says. 'HE WOULD HAVE LIKED YOU. THAT IS NOT A " +
          "COMPLIMENT, BUT IT IS A FACT.'"
        : s.flag("oath_destroy")
        ? "'A BREAKER.' The drowned stars kindle. 'GOOD. SOMEONE SHOULD FINALLY " +
          "LOSE THE ARGUMENT OUTRIGHT, AND IT CANNOT BE ME, AND IT SHOULD NOT BE " +
          "HIM. STRIKE TRUE, BREAKER. STRIKE FOR THE MAN UNDER THE HILL.'"
        : "'A CLIMBER INDEED.' The laugh is an avalanche heard from far away. " +
          "'I REFUSED THE LITTLE CROWN BECAUSE I SAW WHAT THE BIG ONE DID TO ITS " +
          "WEARER. YOU REACH FOR THE BIG ONE ITSELF. EITHER YOU ARE WHAT HE " +
          "WAITED FOR, OR YOU ARE WHAT I REFUSED TO BECOME. I AM THREE THOUSAND " +
          "YEARS PAST TELLING THE DIFFERENCE.'") + `

The gauntlets extend. The shard of the Hollow Crown passes into your hands
— and it is heavier than the world and lighter than a held breath, and the
howl sinks through your skin and goes quiet somewhere behind your sternum,
not gone: rehoming.

'SWEAR IT ON MY KNOT IF YOU CARRY IT,' the king says, settling back into
his long patience, 'AND KNOW THIS, CLIMBER: THE OATH YOU JUST SPOKE WAS
HEARD BY THE HILL. KEEP IT, OR THE HILL WILL KEEP YOU. NOW GO. AND IF YOU
SEE HIM AT THE END — AT THE WOUND, WHERE HE IS SURELY DYING —' the drowned
stars dim to coals '— TELL HIM HIS FRIEND ALDOUS SENDS NO FORGIVENESS, AND
ASKS NONE. TELL HIM WE ARE EVEN.'`),
      on_enter: { xp: 100, "items+": ["crown_shard_1"],
                  flags: { has_shard1: true, king_parley: true } },
      choices: [
        { text: "Bow to the First King, and climb to the air.",
          fx: { karma: 2, approval: { serra: 8 } },
          goto: "act1_camp" },
        { text: "Take the shard and go without ceremony. Kings get enough " +
                "bowing.",
          fx: { approval: { vex: 5 } },
          goto: "act1_camp" },
      ],
    },

    "aldous_freed": {
      text: `You read the murals the way the painter prayed someone someday would:
all the way to the end, where the god's grammar of binding runs under the
final panel — and where, in hand smaller and harder than the rest, the
unbinding runs beneath it. The god left the key in the lock. Three thousand
years ago, walking away with his crook on his shoulder, he left his friend
the means to leave, anytime the king's pride would consent to use a god's
gift.

It never did. Of course it never did.

You speak the unbinding aloud in the throne room, and Aldous, First and
Last King of the Uncrowned, listens to the whole of it with his drowned-star
eyes closed, like a man hearing a letter he'd stopped hoping for.

'HE LEFT IT WRITTEN,' the king says at last. 'THE SENTIMENTAL CATASTROPHE.'

The bronze gauntlets open. The shard is in your hands — and then the king
stands, and the bronze and bone of him is coming undone as he rises, not
falling apart but UNTYING, three thousand years of stubbornness released
knot by knot into the lamplight. His sword he leaves across the throne's
arms, deliberately, for you. The little crown on its chains he does not
look at, one last time, on principle.

'TELL THE SHEPHERD,' he says, going, 'THAT HIS FRIEND ALDOUS FORGAVE HIM
THREE THOUSAND YEARS AGO, AND WAS TOO PROUD TO SAY SO, AND IS STILL TOO
PROUD, AND HAS SENT A SCRIBE TO DO IT INSTEAD.'

And the hill, for the first time in a year, is quiet.`,
      on_enter: { xp: 120, karma: 5,
                  "items+": ["crown_shard_1", "barrow_sword"],
                  flags: { has_shard1: true, freed_king: true },
                  approval: { serra: 10 } },
      choices: [{ text: "Climb to the air, carrying a king's last message.",
                  goto: "act1_camp" }],
    },

    // ------------------------------------------------------- act transition
    "act1_camp": {
      text: (s) => camp_departures(s) + `You camp that night in the lee of the standing stones, and the shard
shows you what it is.

Not a dream. A memory, played through your bones: hands — vast, rope-burned,
patient — forging a crown in a fire made of the first morning. And the
hands HESITATE. You feel the hesitation like a skipped heartbeat three
thousand years long. Then they set the crown on their own brow, and the
world's whole weight comes down with it, every harvest and birth and small
mercy hung from one neck forever — and the memory ends with a thought that
is not yours, pressed flat in the metal like a flower in a book:

'A shepherd is just the sheep no one watches over.'

You wake with the grey dawn on the stones and the shard quiet against your
ribs. South, the road runs down from the hills toward the brass smudge of
Cindral on the horizon — the capital, the cult, the second falling star.` + (s.inParty("serra") ? `

Serra is already up, oiling her sword, the scored-out sun on her shield
catching first light. 'Cindral,' she says, not looking up. 'Crayce is in
Cindral.' It's the first time you've heard her sharpen the word like
that.` : "") + (s.inParty("vex") ? `

Vex sleeps with their branded wrist tucked under them, the way you'd
shield a wound. In the night you hear them say a name once, flatly:
'Rook.' Not asleep at all, then.` : ""),
      on_enter: { xp: 30, heal_full: true },
      choices: [
        { text: "Take the south road to Cindral.", goto: "cindral_gates" },
      ],
    },
  };

  HC.story = HC.story || {};
  HC.story.act1 = { SCENES };
})(globalThis.HC);
