/* Chapter 2 endings: nine settlements of the First Debt, the chapter's own
   grave, and the dynamic epilogue. Every ending here is a future Chapter 3
   entry point; the c2_final_* flags are what the next chapter will read. */
(function (HC) {
  "use strict";

  const SCENES = {

    "death": {
      text: `The coast has a word for it that the inland tongues never needed: not
drowning, not lost. TAKEN UP. The water that closes over you is the
patient kind, the kind that has been taking up lines since before
the towns, and the last thing you feel is not the cold.

It is the pull — steady, unhurried, almost gentle — of something far
below taking in slack. And the last thing you hear, through fathoms
going dark, is the cracked bell of the Drowned Watch, ringing your
arrival down the long water, in the only language that has never
once told a lie on this shore:

a name, said slowly, and a place kept.`,
      on_enter: { flags: { final_death: true } },
      ending: "Taken by the Tide",
      choices: [],
    },

    "c2_end_tidemother": {
      text: `You kneel where she knelt — and then you do the one thing she never
did, because she came down alone in an age that held alone:

You hold out your hands, and you ask.

Oshka's song reaches you first, then the Watch's bell, then the
Loomless cords, the Eel-Mother's grieving bass, Marta's shortened
knot, Dagny's harbor-roar, the whole attending coast pouring its
attention down the terraces and into your held-out hands — and you
TIE. Not nine knots. One: the Nine drawn through a single living
pattern with yourself at the heart of it and every voice on the
shore for strands.

The Ninth Anchor comes alight from its heart outward, gold renewed,
and the holding settles over you like deep water: every line, every
luck, every name on the coast, riding at YOUR mooring now. It is
exactly as heavy as the salt mother's bowed shoulders promised. It
is exactly as unbearable as every holder ever pretended it wasn't.

You bear it anyway — but witnessed, attended, SUNG TO, the first
holder in the history of the shore who does not hold alone.

And the white figure at the lip of the deep — relieved at last, four
thousand years done — straightens, joint by cracking joint, and
rises, and before the salt sifts entirely away into the returning
tide, something at the heart of it turns to the new holder kneeling
in her place, and bows.

# The sea comes home at dawn. The coast rides at anchor. The anchor,
for the first time in the age of anyone, has a name the children
already know.`,
      on_enter: { flags: { c2_final_tidemother: true } },
      ending: "The New Tidemother",
      choices: [],
    },

    "c2_end_paid": {
      text: (s) => {
        const ws = s.flag("ws");
        const price =
          ws === "you_dawn" || ws === "you_ash" || ws === "you_grey"
            ? `You pay it with the one asset no audit on this shore can see: the
crown you set aside, the godhead waiting at the seam. You let it
go — all of it, the loom, the watch, the threads, signed over in
one breath to the witnesses who already keep it — and the worth
of a relinquished heaven flows down through the bottom of the
world and into the oldest open account there is.`
            : ws === "unmade"
              ? `You pay it with the catalogue: the million entries, the folded
coats and counting songs, the whole tended inventory of a finished
world — every witnessed thing you carry given over at once, and
worth more, the ledger discovers, than any heaven: a world's whole
ending, PAID FORWARD.`
              : `You pay it with what the road made of you: the years, the deeds,
the held bridges and the buried lanterns, the entire compounding
worth of everything you have done and been since the smoke of
Ashfen — withdrawn in one breath, and poured down into the oldest
open account there is.`;
        return `'What does it cost?' the Debtor asked the world, and the world
never answered, and tonight, on the open sand, you answer it.

'Nothing. But you'll never believe that. So believe this instead:
it's PAID. All of it. By me. Tonight.'

${price}

The amphitheater feels the principal land. The Ninth Anchor's
guttering mass goes still — then SOFT — then, loop by loop, it
UNTIES ITSELF, four thousand years of repayment schedule dissolving
into plain gold light, because a paid note holds nothing and needs
to hold nothing. The stone-shaped absence at the knot's heart fills,
slowly, with BEING — bought and owned and FREE — and what stands up
out of the sand at the bottom of the world is no longer a debtor.

It is a neighbor. The coast's tenth power: vast, shy, solvent, and
absolutely unpracticed at existing without owing, looking around the
terraces at the assembled parties like a man stepping out of a
debtor's cell into weather.

The salt mother rises, her guarantee discharged, and goes wherever
paid sureties go, and her going is a tide all its own.

# 'PAID IN FULL,' the Pale Merchant reads aloud from his formal
ledger, to the whole assembly, in the voice of a man closing the
oldest file in the building. He looks at you a long moment over the
counter. 'In my trade, wanderer, we call this a MIRACLE. There is no
margin in them whatsoever. Magnificent.'`;
      },
      on_enter: { flags: { c2_final_paid: true } },
      ending: "The Debt Paid",
      choices: [],
    },

    "c2_end_rook": {
      text: `'The office accepts the disposition,' says Mother Rook, and opens
the black book, and the bottom of the world becomes a counting-room.

It takes until the tide's return: every line on the coast conveyed,
every mooring assumed, the Ninth Anchor's dying pattern transcribed
into instrument after instrument in cord-script and common, the
First Debtor's account novated entire — the office of the shore
standing surety now, paper where the salt mother knelt. The Corvids
work through the night with the discipline of a profession attending
its founding hour, and the coast files past the vault-wagons to be
HELD, wrist by wrist, name by name, and nobody sings.

It is not the dark. You repeat that, watching: it is not the dark.

The Anchors gutter out one by one as their burdens transfer, and the
sea comes home at dawn over a shore that is, in every clause that
matters, SOLVENT: alive, fed, moored in black glaze and perfect
records, the best-kept account in creation scaled to a coastline.
The Lady keeps the coast. All of it. At last.

She finds you at the tide-line, after. The wool, the book, the four
thousand winters. 'You chose the outcome with the fewest funerals,'
she says. 'History will not thank you, because history is written by
romantics. The LEDGER will thank you. The ledger is the only thing
that ever remembers the ones who chose smallest-loss.' A pause, dry
as dust. 'I would know.'

# And the tide comes in over the drowned terraces, and somewhere far
below, the best-kept account in creation goes on accruing — held,
attended, and OWNED, which were always, on this coast, three
different words.`,
      on_enter: { flags: { c2_final_rook: true } },
      ending: "The Rook's Lien",
      choices: [],
    },

    "c2_end_hearing": {
      text: `'Then nothing is settled tonight,' you say, 'except in the open.'

And you convene, on the floor of the lowest tide of the age, the
FIRST HEARING — every party to the original note and every party it
was drafted over, called to the sand by name: the Debtor, the
office, the salt mother's cracking remains, the Eel-Mother and her
sister-holders rising from the channels, the Drowned Watch, the
Loomless, the living, the Merchant as clerk of record because some
appointments make themselves.

Page seventy-one is read aloud. ALL of it — the itemization too, at
ebb-tide, over open water, the way the blind scribe would not. The
Debtor's instruction. The clerk's drafting. The surety's grief-cord
signature. And then the question, asked in public for the first
time in four thousand years: WHAT DOES EXISTING COST?

The hearing lasts until the tide turns. The answers fill the
Merchant's formal ledger and start a second volume. And the
arrangement that rises out of it — argued, amended, signed at dawn
by more parties than any instrument in the history of holding — is
not a debt and not a gift, because the coast, being the coast,
splits the difference: a COMMONS. The Nine held by all who ride at
them; the Debtor a member, not a principal; the schedule replaced
by a SESSION, standing, public, loud — the bottom of the world
given, in perpetuity, what it never once had:

a place where the held can read the terms of their holding, and
object.

# They will argue it forever. That is the design. The first item of
every session, by your motion, carried unanimous in the only
unanimous vote the commons will ever hold: 'The cost of existing is
nothing. The price of believing it is each other. Session open.'`,
      on_enter: { flags: { c2_final_hearing: true } },
      ending: "The First Hearing",
      choices: [],
    },

    "c2_end_adrift": {
      text: `The Knot-Knife was made for one heresy, and tonight you commit it at
scale.

You cut the Nine.

Not the holdings — the SIGNATURES. The knife of whale-bone and
salt-iron parts the original note where it was tied into the world's
own fabric, anchor by anchor, and each cut sounds across the
amphitheater like a hawser parting under load, and with each one the
coast comes FREE: not falling, not failing — LOOSE, whole, riding
its own lines bent only to each other now, a web with no stake in
the ground of creation at all.

The last cut is the Ninth. You make it with the Debtor's consent —
ASKED and given, the first thing anyone ever asked it — and the
stone-shaped absence comes loose from the world's floor carrying its
borrowed being with it, debt and debtor and collateral all one
unmoored estate now, jointly held, going wherever unowned things go.

Which turns out to be: OUT.

The sea comes home at dawn and the coast is not there to meet it.
The Mourncoast — Saltmere, the marshes, the bell-reef, the Drowned
Market, every knot and line and stubborn salt soul of the Unwoven
Shore — rides off the edge of every chart in creation, a country
under sail, trailing its nine gold anchors like riding-lights, free
of loom and ledger and world alike. The Watch rings the departure.
The Eel-Mother swims escort. Wide Marta, they say, never once looks
back.

# The world keeps a coastline-shaped absence where it used to keep a
coast. Sailors of the next age will swear that on the lowest tides,
hull-down on the horizon, there is a light that is nine lights, and
a bell. The charts will mark it the only honest way: HERE WAS THE
SHORE THAT KEPT ITSELF.`,
      on_enter: { flags: { c2_final_adrift: true } },
      ending: "The Unmoored Shore",
      choices: [],
    },

    "c2_end_oshka": {
      text: `'The holding needs a holder,' you say. 'And a holder, on this shore,
was only ever attention that stays. Oshka — last singer — STAY.'

She does not argue the way Serra argued, a year ago, at the bottom
of a different world. She checks her hands once, the way she'd check
a knot before trusting weight to it. Then she walks to the heart of
the guttering Ninth, takes up the Psalter-cord, and ties herself in.

Not crowned. The coast does not crown. CORDED — the nine songs drawn
through one living voice, the singer become the singing, and as the
pattern takes her up the amphitheater hears what the Psalter was for
four thousand years of shorthand FOR: the whole music, entire, the
nine holdings and the tenth grief and the spaces between filled at
last by a voice that learned them at an oar-bench from her mother
and means every note.

The Anchors do not blaze. They TUNE — gold steadying to pitch, coast
to bell to marsh to deep, and the First Debtor's tired absence eases
into the held world's chord like the low string finally tuned to the
rest.

She is not gone. That is the thing the inland tellings will get
wrong. She is EVERYWHERE the song is: in the harbor-knots, in the
bell's relieved hours, in the new verse the eel-marsh sings, and on
quiet nights, fishermen swear, in the swell itself — a working
voice, unhurried, keeping time for the whole riding coast.

# In the knotworks of Saltmere they hang her boat-hook on two pegs
where another country would put an altar. Under it, in cord-script
and common both: SING LOUD. SHE'S A VERSE BEHIND YOU THE WHOLE WAY.`,
      on_enter: { flags: { c2_final_oshka: true, crowned_oshka: true } },
      ending: "The Brine-Crowned",
      choices: [],
    },

    "c2_end_vex": {
      text: `'The book goes to a debtor,' you say. 'Eleven years collateral.
Eleven years inside the instrument. The only qualification this
coast has never tried.'

Mother Rook looks at Vex for a long, four-thousand-winter moment —
and then she does the thing that tells you she was waiting for an
heir all along, whatever she called it: she takes the black book
from under her arm, and she BALANCES IT, one last entry in her own
hand, and holds it out.

'Terms of conveyance,' she says. 'The office, the records, the
standing, the SEAT. One condition, successor: no regrets. Clerks
who regret are no use to anyone.'

'Wrong,' says Vex, taking the book with unprofessionally steady
hands. 'First amendment: this office regrets EVERYTHING. Out loud.
On the record. That's the whole reform.'

The Forgiven Ledger, the coast calls what follows, because the
coast names things honestly: the office that holds the First Debt
and every small one — and FORGIVES, strategically, publicly,
ruinously by every actuarial standard, line by line where holding
has become owning: brands voided on attested hardship, names
returned on the third anniversary of every loan, the deep-book
schedule renegotiated with the Debtor itself across a table, as
parties, with the Merchant clerking and the whole coast reading
the minutes.

It should collapse in a season. Every model says so. It holds —
because the freed, it turns out, pay forward what the held could
only pay down, and the office's true asset was never the paper.

# Mother Rook is seen once more, years on, at a fish-stall in the
Drowned Market, in wool, unrecognized, eating breakfast like a
woman with nowhere to be. Witnesses report she looked DECADES
younger, and that when the tide-bell rang she did not count it.`,
      on_enter: { flags: { c2_final_vex: true } },
      ending: "The Forgiven Ledger",
      choices: [],
    },

    "c2_end_woven": {
      text: (s) => {
        const ws = s.flag("ws");
        const god = {
          vael: "the silent Shepherd, the mended loom entire",
          you_dawn: "the crown you set aside, the watch and all its witnesses",
          you_ash: "everything you own, which is everything",
          you_grey: "the uneasy loom, half-open hand and all",
          serra: "the knight at her whetstone, the unfinished sun",
          maeve: "the Library, lamps lit, margins ready",
          hollow: "the quiet hand beneath every falling thing",
        }[ws] || "the woven world entire";
        return `It cannot be forced. That was the seam's whole law, four thousand
years of it: no loom reaches in. But the law was a TERMS, and terms,
you have learned on this coast, can be renegotiated by the parties —
and tonight every party is assembled, and the coast has a voice, and
you stand on the sand and put the question to the terraces plainly:

The old holder is spent. The old note concludes. Beyond the Hem
waits ${god} — barred from this shore by a seam the Tidemother
herself tied, to keep the weave from swallowing what was never its
to hold. The seam can open ONE way only: from inside. By consent.
Asked.

The coast argues it the way the coast argues everything — loudly,
in cord-script and common, through the whole turning of the lowest
tide — and then Wide Marta stands up on the landward terrace with
her shortened knot in her fist and says the sentence that settles
it: 'I carried my mother out of the Shallows when the water came.
I'm not too proud to be carried. NOBODY DROWNS FOR PRIDE ON MY
COAST. Open it.'

You open it. The seam parts like a hem unpicked by its own
seamstress — and the weave comes in. Not as a flood; as a HAND,
offered: the coast's knots taken up into the world's weave KNOT BY
KNOT, pattern preserved, the Nine retired with honors into a
holding that does not fray, the First Debtor's account assumed
entire by the only holder large enough to carry it without terms.

# The Unwoven Shore goes into the weave singing, and the weave —
every thread of it, all the way up — learns the songs. The first
new verse in the woven world's liturgy, inland chapels and all, is
in cord-script. It translates: WE WERE HELD ALL ALONG. WE JUST
WANTED TO BE ASKED.`;
      },
      on_enter: { flags: { c2_final_woven: true } },
      ending: "The Woven Shore",
      choices: [],
    },

    "c2_end_last_harbor": {
      text: `In a creation gone still, one account still accrues — and you stand
on the sand at the bottom of the last living place and understand,
at last, what you were kept FOR.

'Everything ended,' you tell the Debtor. 'Everything but you. The
whole world paid off its being and unclenched — and you couldn't,
because you never owned your being to let it go. You OWE. You're
the only thing left still reaching. So REACH.'

And you give it the collateral it was always secured against, the
only stock left in creation: the shore. Not as forfeit — as SOIL.
The coast consents — Marta's word carries it, and the Watch rings
it, and Oshka sings it down — and the First Debtor's borrowed
substance takes root in the one place that never learned to let
go, and BEGINS.

What grows out of the bottom of the world is not the old world.
It is a harbor: the Last Harbor, the first port of a creation
starting over — built of borrowed being and salt stubbornness,
crewed by the only people in existence who know for certain that
holding is possible, because they are made of nothing else.

The Pale Merchant closes the formal ledger on the old world's
final entry, and opens — you watch him do it, with ceremony, at
his unfolded stall at the rim of the new — a fresh volume, blank
as a tide-washed morning. VOLUME TWO, he letters the spine.

'You witnessed an ending entire,' he says. 'A rarer thing now
begins, and the position of FIRST WITNESS is, as of this tide,
vacant.' The early smile, for once, arrives exactly on time.

# 'Walk with me, colleague. We have everything to catalogue, and
all the time there is about to be.'`,
      on_enter: { flags: { c2_final_last_harbor: true } },
      ending: "The Last Harbor",
      choices: [],
    },
  };

  // ------------------------------------------------------------- epilogue
  function epilogue(state) {
    const s = state;
    const parts = [];

    // the first anchor
    if (s.flag("c2_first_anchor") === "tied") {
      parts.push(
        "In Saltmere the First Anchor burns steady under the harbor, and the " +
        "story of the storm-night dive has already grown a second diver, a " +
        "sea-serpent, and three contradictory accounts of the weather. Dagny " +
        "tells it best and least accurately. The town lets her.");
    } else if (s.flag("c2_first_anchor") === "slipping") {
      parts.push(
        "Saltmere's First Anchor holds at half-strength, a lamp trimmed low. " +
        "The town has organized itself around the dimness with coastal " +
        "practicality: knot-watches posted, names written down in advance, " +
        "nothing left unsaid overnight. It is, the Reeve observes, the " +
        "politest Saltmere has been in living memory.");
    } else if (s.flag("c2_first_anchor") === "slipped") {
      parts.push(
        "The harbor quarter of Saltmere never came back to its mooring. The " +
        "unmoored learned to live as the unmoored do — by lists, by knots " +
        "tied for memory instead of holding, by neighbors who answer to the " +
        "names the water took. They do not speak of the night the Anchor " +
        "slipped. They speak, carefully, around it.");
    }

    // the shallows
    if (s.flag("c2_saved_shallows")) {
      parts.push(
        "Wide Marta's people built new on the cliff-top, every house tied to " +
        "every house, and her shortened knot hangs over her new hearth with " +
        "the carrying-hitch still in it. She reports, to anyone who sits " +
        "still long enough, that the voices through the floor came up the " +
        "hill with the rest of them, and sound warmer for the altitude.");
    } else if (s.flag("c2_refused_shallows")) {
      parts.push(
        "The Shallows went into the tide on the night of the storm. The " +
        "coast keeps the count the way the coast keeps everything: " +
        "forty-one knots on the seaward rail of the Saltmere quay, retied " +
        "fresh each spring, by hands that do not discuss whose arithmetic " +
        "they correct.");
    }

    // the marsh
    if (s.flag("c2_eel_pact")) {
      parts.push(
        "In the eel-marsh the Fourth Anchor burns double, green-gold and " +
        "green-coal, and the village above it sings a verse forty centuries " +
        "missing. The Eel-Mother is seen at the pool's edge on still nights, " +
        "coiled, attended, a creditor of record listening to her own name " +
        "in the singing — which is, the elders say, all she was ever owed.");
    } else if (s.flag("c2_eel_tied")) {
      parts.push(
        "The eel-marsh village fishes again under a re-tied Anchor, and " +
        "leaves a lamp lit at the pool's edge for the old holder in the " +
        "deep channels — half warding, half apology, wholly coastal.");
    } else if (s.flag("c2_eel_ceded")) {
      parts.push(
        "Maps still mark a village in the eel-marsh. Travelers report " +
        "lights below the water of the pool, many and small and bright, " +
        "swimming always in the wake of something vast and tender that " +
        "will never, ever let them go. The singers do not sing toward it. " +
        "The lights, say those who look too long, look HELD.");
    }

    // the bell
    if (s.flag("c2_bell_anchor") === "tied") {
      parts.push(
        "The bell on the reef rings only the hours now, like any honest " +
        "harbor bell, and the Drowned Watch stand their posts at parade " +
        "ease. Fishermen of the grounds have taken to dipping their colors " +
        "as they pass the frame — to the Watch, and to the warm-handed " +
        "diver who gave the dead their relief.");
    } else if (s.flag("c2_bell_anchor") === "partial") {
      parts.push(
        "The bell on the reef still rings its vigil, slower than before, " +
        "rested but not relieved. The Watch added a post the night after " +
        "your dive. The post stands empty, the sou'wester hung ready on " +
        "the frame: an open invitation, the coast understands, to warm " +
        "hands of good faith.");
    }

    // vex
    if (s.flag("c2_vex_freed")) {
      parts.push(
        s.flag("c2_self_pledged")
          ? "Vex wears no glove now, and the wrist beneath is only scarred, " +
            "not held. Of the thin ring on your own wrist, Vex does not " +
            "speak — but every town you pass through after, your room is " +
            "paid, your gear is mended, and your enemies have inexplicable " +
            "administrative difficulties. Eleven years of debtor's craft, " +
            "compounding in your favor."
          : "Vex wears no glove now. The name sits where it always belonged, " +
            "being nobody's asset, feeling — by official report, delivered " +
            "with the old crooked grin — exactly like a Tuesday.");
    }

    // quill
    if (s.flag("c2_page_read")) {
      parts.push(
        "Quill's transcription of page seventy-one circulates the coast in " +
        "hand-copies, cord-script and common in parallel columns, under the " +
        "title the scribes gave it: THE TERMS WE WERE HELD ON. It is read " +
        "aloud at tide-festivals. It is, Quill notes, with a complicated " +
        "expression, the most exemplary filing of their career.");
    }

    // the lady, if her road wasn't the ending's road
    if (!s.flag("c2_final_rook") && !s.flag("c2_final_vex")) {
      if (s.flag("c2_rook_amended")) {
        parts.push(
          "The Corvid offices honor the amendment to the letter: no paper " +
          "touches a line you took up. The clerks call such lines " +
          "'sovereign' in the registers, and the word is spreading up the " +
          "coast faster than the office can contain it, attaching itself " +
          "to people, to villages, to inconvenient ideas. Mother Rook is " +
          "reported unamused, which those who know her best translate as: " +
          "proud.");
      } else if (s.flag("c2_rook_pact")) {
        parts.push(
          "Your tally-coin sits where you left it, warm as a counted " +
          "pocket. The Lady's table, you understand, considers your chair " +
          "permanent — settlements end, but the office endures, and the " +
          "office has a long memory for those who sat down when asked.");
      }
    }

    // the merchant gets the last word; he always gets the last word
    parts.push(
      "And on a morning tide, before the gulls are properly about, a high " +
      "narrow stall of pale wood stands folded at the Drowned Market's deep " +
      "end, packed for the road. The Pale Merchant consults his ledger, " +
      "finds your account, and makes a small annotation in a hand too fine " +
      "to read. Whatever was settled at the bottom of the world — something " +
      "is always coming due somewhere, and business, he will tell anyone " +
      "who asks, has honestly never been better.");

    return parts.join("\n\n");
  }

  HC.registerScenes("ch2", SCENES);
  HC.story.c2_epilogue = epilogue;
})(globalThis.HC);
