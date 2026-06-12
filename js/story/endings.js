/* Endings: terminal scenes, and the epilogue composer that reads the whole game
   back to the player — every road remembers.
   Ported from mythos/story/endings.py. */
(function (HC) {
  "use strict";

  // --------------------------------------------------------- epilogue parts

  function serraEpilogue(s) {
    const c = s.companions["serra"];
    if (!c.met) return null;
    if (s.flag("robbed_refugees")) {
      return "Somewhere on the north roads there is a knight with a scored-out " +
        "sun on her shield who still remembers your face. She told you she " +
        "would. Serra Valebright guards the refugee columns still, and when " +
        "new travelers ask her what people are worth, she answers with a " +
        "ledger entry: 'I met the whole range once, on one bridge.'";
    }
    if (!c.in_party && c.approval <= -40) {
      return "Serra Valebright walked out of your story and back into the small " +
        "wars — bridges, columns, other people's odds. They say she never " +
        "speaks of the wound, or of you, which those who know her recognize " +
        "as the loudest thing she does.";
    }
    if (s.flag("crayce_exposed")) {
      let base = "In Cindral they tell of the trial that broke the Gilt Shields, and " +
        "of the knight who stood in court while draft three was read aloud " +
        "and never once looked away. Serra Valebright's name came back to " +
        "her in daylight, as you promised. She founded a new order on the " +
        "ruin of the old — the Dawnward Vigil, sworn not to a god but to " +
        "the watching itself. Their shields bear a sun, deliberately " +
        "unfinished. She re-traces hers a little more each year.";
      if (c.approval >= 60) {
        base += " Above the Vigil's first hearth hangs a strip of linen from a " +
          "bridge on the Millrun, and recruits who ask about it are told: " +
          "'That is the standard. Wade into other people's odds.'";
      }
      return base;
    }
    if (s.flag("crayce_killed")) {
      return "Serra carries Greyfield's ending where she used to carry its " +
        "blame; ask those who travel with her and they'll tell you she is " +
        "kinder than her silence and quicker than her sleep. She never " +
        "re-traced the sun on her shield. She guards the worst roads in " +
        "the grey country, and the deserters of three realms have learned " +
        "her shield on sight, and what she said over Crayce she has never " +
        "told a living soul.";
    }
    if (s.flag("crayce_blackmailed")) {
      return "Serra left your company's memory the way she left Cindral: " +
        "upright, silent, and permanently. Word has her in the far south, " +
        "hunting proof of Greyfield that no one can sell — gathering " +
        "testimony grave by grave, name by name, building the trial that " +
        "you priced at eighty gold.";
    }
    return "Serra Valebright went back to the columns and the bridges, her " +
      "question for the god asked and answered as well as it ever would be. " +
      "The scored-out sun stays on her shield — but travelers say that in " +
      "a certain light you can see where someone has begun, very faintly, " +
      "to trace the old sigil underneath.";
  }

  function vexEpilogue(s) {
    const c = s.companions["vex"];
    if (!c.met) return null;
    if (s.flag("vex_dead")) {
      return "Off the south road, where the grey dust lies deepest, there is a " +
        "cairn that no map marks. You built it yourself. In the Rookery's " +
        "master ledger, a line is ruled through a name with bookkeeping " +
        "neatness, and nowhere in any record, ever, will it say that the " +
        "account died free for the length of one last joke.";
    }
    if (s.flag("vex_freed_late")) {
      return "Vex walked north out of your story with an empty wrist and no " +
        "forwarding address. The stories start about a year later: locks " +
        "opening in debtors' prisons across three realms, brand-ledgers " +
        "burning in their strongboxes, and at each scene the same calling " +
        "card — a rook's feather, snapped clean in half.";
    }
    if (s.flag("vex_sold")) {
      return "Vex belongs to Mother Rook again, which is to say Vex belongs to " +
        "the dark arithmetic of the Rookery, which is to say that somewhere " +
        "in Cindral tonight a brand is glowing and a pair of the best hands " +
        "in the realm are doing what they're told. You sold that. The gold " +
        "spent fine.";
    }
    if (s.flag("vex_betrayed_early")) {
      return "They say Mother Rook's counting-house has a new floor-scrubber " +
        "with a rook-brand that never cools and eyes that never argue. " +
        "They say it used to be the best lockworker in the gutter. They " +
        "say five gold changed hands, once, in a town up north, and the " +
        "Rookery rounds that story DOWN.";
    }
    if (s.flag("vex_lost")) {
      return "The road-gang that bought a sharp-faced prisoner out of " +
        "Briarwatch reported them escaped within the month. Since then, " +
        "the jails of three counties have logged the same impossible " +
        "complaint: locks opened from the inside, in cells holding only " +
        "debtors, who walk out and are not pursued, because pursuing them " +
        "would require explaining the locks.";
    }
    if (c.in_party && c.approval >= 60) {
      return "Vex stayed exactly as long as it stopped being a debt and started " +
        "being a choice, which is to say: longer than anyone has ever " +
        "stayed anywhere. They run a school now, in the gutter where they " +
        "were branded — officially a locksmith's. The curriculum is locks, " +
        "ledgers, and the one lesson over the door, painted in red: " +
        "'NOBODY'S INVENTORY.'";
    }
    if (c.in_party) {
      return "Vex drifted off your story's page the way professionals leave a " +
        "job well done: paid, square, and mid-joke. The gutters of Cindral " +
        "keep their legends close, but this much escapes — debts there " +
        "have lately been dying of unnatural causes.";
    }
    return "You hear of Vex now and then, the way you hear of weather in another " +
      "country: a heist here, a brand-ledger burned there, the Rookery's " +
      "prices argued with. Some debts pay themselves out in stories.";
  }

  function maeveEpilogue(s) {
    const c = s.companions["maeve"];
    if (s.flag("maeve_burned")) {
      let text = "Maeve of the Mire burned in Pyre Square lecturing the crowd, and " +
        "the lecture outlived the fire: 'Ask them why they burn the " +
        "PAPER.' They ask it now, in Cindral's soup lines and " +
        "lecture-halls both. The cult never did produce a good answer.";
      if (s.hasItem("sister_locket")) {
        text += " The silver locket is still in your pack. It still turns, " +
          "slowly, on its cord. Some nights, very faintly, you hear " +
          "half a song — a child's counting song, half-learned, " +
          "waiting all these years for somebody to finish it.";
      }
      return text;
    }
    if (!c.met) return null;
    if (!c.in_party && c.approval <= -40) {
      return "Maeve walked back into the bog-country with her grimoire and her " +
        "locket and her catalogue of you, complete. Her history of the " +
        "Tired God circulates in three realms now, hand-copied, heretical, " +
        "true. You appear in the margins. The annotation is brief.";
    }
    if (s.flag("ghost_release_planned") || s.flag("ghost_released")) {
      return "At the wound, with her people beside her, Maeve opened the silver " +
        "locket, and Orla of the Mire — nine years old for thirty years — " +
        "finished her fall at last where the falling finally goes " +
        "somewhere. Witnesses say the child finished her song first; the " +
        "half she'd learned, and then, impossibly, the rest. Maeve wrote " +
        "it down. It's the last page of every copy of her great history, " +
        "and the only page with no annotations at all.";
    }
    if (s.flag("ghost_used")) {
      return "Maeve keeps the locket where she always kept it, but something " +
        "in the keeping has changed key. Scholars who meet her now speak " +
        "of a brilliance with a cold draft through it, and of a small " +
        "silver pendulum that swings, sometimes, against the wind. Your " +
        "counsel sits in her files, fed and quartered. Ideas like that " +
        "keep.";
    }
    if (s.flag("ghost_kept")) {
      return "Maeve holds on. She reads aloud most nights now — rain, and the " +
        "old country, and the locket lies still as a listening child, and " +
        "the price of the holding comes due a little at a time, the way " +
        "she always preferred her debts. 'One sister,' she writes in her " +
        "history's preface. 'The world could spare one.' The scholars " +
        "argue about whether it's gratitude or confession. It's both. " +
        "It was always both.";
    }
    return "Maeve of the Mire finished her history of the Tired God — the diary " +
      "fragments, the marginalia, the whole long correspondence of an " +
      "exhausted heaven. The cult burns it on sight, which she calls 'a " +
      "five-star review from the relevant authorities.'";
  }

  function hollowEpilogue(s) {
    const c = s.companions["hollow"];
    if (!c.met) return null;
    if (!c.alive) {
      return "In the soup lines of Cindral they still go quiet about the " +
        "undercroft — forty-one entries in a pyre ledger, and a voice that " +
        "stopped mid-sentence over the roar. But the sentence got out. " +
        "It always does. 'The drowning never stopped being people' is " +
        "scratched now into pyre-platforms across the grey country, in " +
        "dozens of hands, and the cult has learned there is no doctrine " +
        "for burning graffiti.";
    }
    if (s.flag("hollow_declined")) {
      return "Brother Hollow keeps his undercroft, his ladle, and his " +
        "arithmetic of forty. Whatever the wound decided, he learned it " +
        "before the news could travel — the falling are closest to the " +
        "news. Travelers who find the cellar stair say the lamps are " +
        "always lit, and the third stair still turns, and the rows of " +
        "the quiet are fed, every one.";
    }
    return "Brother Hollow walked back north at the head of his grey " +
      "congregation, the army that would not fight, and the realm — which " +
      "had a year of practice burning the Hollowed — discovered it could " +
      "not hold the theory together in the face of a man with a ladle who " +
      "says 'we.' The unlabeled jars stand on the world's shelf still. " +
      "But the world has begun, township by township, to take the labels' " +
      "absence as a question instead of an answer.";
  }

  function worldEpilogue(s) {
    const parts = [];

    // refugees of briarwatch
    if (s.flag("fed_refugees")) {
      parts.push("In Briarwatch they still argue about who opened the granary " +
        "that winter, and the argument is the point: a town that has " +
        "to ask 'who fed them?' has admitted they could be fed. The " +
        "camps on the hill became streets, in time. One of them is " +
        "called Stranger's Row.");
    } else if (s.flag("drove_off_refugees")) {
      parts.push("The refugee column you drove off the Briarwatch hill walked " +
        "south into the cult's ledgers, mostly. Edda's children made " +
        "it to Cindral. Two of them. The town paid you thirty gold " +
        "and kept its grain, and got to keep, also, the knowledge of " +
        "what it had paid for, which compounds.");
    }

    // the queen and the prince
    if (s.flag("queen_returned")) {
      parts.push("The Queen Regent rode home from the wound without a crown " +
        "and with both hands free, which turned out to be the correct " +
        "equipment for her actual war. The false wall in the Brass " +
        "Keep came down within the year — the Regent's own " +
        "proclamation, read on every terrace: the heir is grey-eyed, " +
        "and the heir is OURS. Cindral, given the choice between its " +
        "prince and its pyres, surprised the cult badly.");
    } else if (s.flag("queen_kept_shard")) {
      parts.push("The Queen Regent kept her purchased shard, and the mending " +
        "of the world was done crooked around it — a brass note in " +
        "the weave, a kingdom-shaped flaw. Cindral prospers " +
        "strangely: its harvests come early, its dead rest badly, " +
        "and its Regent does not sleep at all now, and rules " +
        "magnificently, and is not entirely the one ruling.");
    } else if (s.flag("told_queen_despair")) {
      parts.push("Of the Brass Keep, travelers report a realm administered " +
        "impeccably and a Regent who has not been seen to hope since " +
        "a northern stranger audited her last reserves of it. The " +
        "false wall stands. Behind it, a tin rattle, unclaimed.");
    } else if (s.flag("blackmailed_queen")) {
      parts.push("Your hundred gold of silence about the Brass Keep spent " +
        "like any other gold. The second lock on the false wall " +
        "became a third, then a guard, then a story the court tells " +
        "anyway — secrets priced that high always find buyers. The " +
        "Regent paid every installment, and history will record " +
        "only that the heir of Cindral was never seen again.");
    } else if (s.flag("told_queen_hope")) {
      parts.push("In the Brass Keep, a boy comes out from behind a false " +
        "wall on quiet evenings, and a Regent who rules a hard realm " +
        "by day sits with him and a tin rattle, retraining her hope " +
        "like a broken hand. You did that with one true sentence. " +
        "Statecraft is occasionally this simple.");
    }

    // the cult
    if (s.flag("solenne_dead")) {
      parts.push("The Ember Cult has its martyr, and the Congregation of the " +
        "Martyred Flame grows by the season — patient now, " +
        "organized, wearing Solenne's last words on its lintels. " +
        "Fires bank before they spread. The grey country watches " +
        "the smoke-line and reads its future in it.");
    } else if (s.flag("solenne_doubt")) {
      parts.push("The schism you lit in the Pyre Cathedral flowered the " +
        "following spring: Hierarch Solenne herself stood beneath " +
        "the Undying Flame and preached the sermon now called the " +
        "Recantation of Embers — 'the fire keeps what is true, and " +
        "we burned true things; the doctrine has lied to us about " +
        "more.' Half the cult followed her out of the cathedral. " +
        "The half that stayed has never been forgiven the relief " +
        "on its faces.");
    } else if (s.flag("cult_champion") && !s.flag("joined_shepherd")) {
      parts.push("The Ember Cult waits, with ledgers and patience, for its " +
        "champion's pyre to complete. Whatever you did at the wound " +
        "instead, Hierarch Solenne has entered it in the records " +
        "under 'combustion, deferred.' The Flame remembers its " +
        "friends. It remembers its debtors differently.");
    }

    // ashfen and the lantern
    if (s.flag("lantern_delivered")) {
      parts.push("Ashfen's dead were delivered — three hundred years of last " +
        "breaths, carried the whole grey length of a dying world " +
        "and let out at the one door that mattered. Keeper Lysa's " +
        "parish came home. Whatever else is written of you, that " +
        "line is in the ledger too.");
    } else if (s.flag("sold_lantern")) {
      parts.push("Somewhere in a high narrow wagon of pale wood, on a string " +
        "among keys and teeth and wedding rings, hangs a lantern of " +
        "grey glass with three hundred years of Ashfen inside, " +
        "turning in a windless wind, waiting out eternity in a " +
        "collection. It glowed when he bought it. One of you was " +
        "lying. You've had time, since, to work out which.");
    } else if (s.hasItem("soul_lantern")) {
      if (s.flag("lantern_sworn")) {
        parts.push("And at the very end, before the road home, you kept a " +
          "promise made in a burned chapel: you opened the " +
          "soul-lantern at the wound's edge and let Ashfen out — " +
          "three hundred years of last breaths, released where the " +
          "catching is decided. Keeper Lysa asked you to swear it, " +
          "and you swore it, and the glass is clear now, and light.");
      } else {
        parts.push("The soul-lantern of Ashfen rides in your pack still, " +
          "three hundred years of the dead waiting behind grey " +
          "glass. You never did decide what you were carrying it " +
          "FOR. It glows, very faintly, every time you tell " +
          "yourself you'll deal with it tomorrow.");
      }
    } else if (s.flag("lantern_refused")) {
      parts.push("In a burned chapel in Ashfen, a lantern of grey glass sits " +
        "where a Keeper died holding it, dimming by the year. What " +
        "waits, fades. Travelers on the north road report the light " +
        "is very low now, and that the chapel, on still nights, " +
        "sounds like a held breath.");
    }

    // the oath under the hill
    const oathKept = ((s.flag("oath_restore") && s.flag("final_reforged"))
      || (s.flag("oath_destroy") && s.flag("final_destroyed"))
      || (s.flag("oath_claim") && s.flag("final_claimed"))
      || s.flag("oath_honest"));
    if (s.flag("oath_restore") || s.flag("oath_destroy") || s.flag("oath_claim")) {
      if (oathKept) {
        parts.push("Under the Howling Barrow — quiet now, just a hill — the " +
          "First King's oath-stone weighed your word one last time " +
          "and found the account square. Travelers who camp there " +
          "sleep strangely well.");
      } else {
        parts.push("You swore an oath under the Howling Barrow, weighed and " +
          "witnessed, and at the wound you spent your word " +
          "elsewhere. The hill noticed. The hill keeps what is " +
          "owed: travelers say your name, spoken near the barrow, " +
          "comes back off the stones in a voice of bronze, " +
          "correcting the record.");
      }
    }

    // the merchant's purchases
    if (s.flag("sold_name")) {
      parts.push("And your name — the wearing of it — hangs on a string in a " +
        "pale wagon, worn now and then by its purchaser, just to " +
        "keep it supple. People still call you what they call you. " +
        "It lands a half-inch to your left, forever, addressed to " +
        "someone you can almost see.");
    }
    if (s.flag("sold_memory")) {
      parts.push("There remains a place in you shaped like a warm kitchen, " +
        "with the facts intact and the truth extracted. You have " +
        "stopped trying to warm your hands on the facts. The " +
        "merchant, wherever he is, keeps the warmth in excellent " +
        "condition.");
    }

    return parts;
  }

  function epilogue(state) {
    if (state.flag("final_death")) {
      return "The road south of everything is lined with cairns nobody " +
        "signed. Yours is one more. The shards you carried were " +
        "gathered up by the next pair of hands the road sent — the " +
        "road always sends another pair of hands — and the world's " +
        "story went on and was decided by someone else, about whom " +
        "the chronicles say: they walked a while, once, behind a " +
        "stranger who almost mattered.\n\n" +
        "= (Your last camp is remembered — the tale can be taken up again.)";
    }

    const parts = [];
    for (const fn of [serraEpilogue, vexEpilogue, maeveEpilogue, hollowEpilogue]) {
      const p = fn(state);
      if (p) parts.push(p);
    }
    parts.push(...worldEpilogue(state));

    // the merchant always gets the last word
    parts.push("And on a road that no longer goes anywhere in particular, a " +
      "high narrow wagon of pale wood rolls unhurried through the " +
      "weather, its strings of keys and teeth and rings turning in " +
      "a wind that isn't there. The Pale Merchant consults his " +
      "ledger, finds your account, and smiles his early-arriving " +
      "smile. However it ended — it ENDED, and endings are his " +
      "business, and business, he will tell anyone who asks, has " +
      "honestly never been better.");

    return parts.join("\n\n");
  }

  // ---------------------------------------------------------- ending scenes

  const SCENES = {
    "death": {
      text: `The grey takes the edges of things first — the road, the sky, the
reasons. Your hands lose the story before your eyes do.

The last thing is not pain. It's the road itself, patient under you,
carrying its thousand other footsteps on toward the wound without you —
and somewhere very far off, a sound that might be a wagon's chimes,
arriving punctually, as he always does, for the gathering-up.`,
      on_enter: { flags: { final_death: true } },
      ending: "An Unmarked Grave",
      choices: [],
    },

    "end_chained_god": {
      text: `You say it out loud, because endings have perfect hearing: 'The world
needs its loom more than one god needs his rest.'

The god watches you lift the shard from his own brow — consenting,
unresisting, his eyes doing the only screaming there is. The three
pieces of the Hollow Crown remember each other in your hands; the
mending is nothing, a thought, a closing of a circle that was only ever
held open by grief. And then the hardest work anyone has ever done in
the history of the world: you set it back on the brow of a being who
begged three thousand years for one unwatched night, and you feel the
loom take him up again, thread by thread by thread.

The Withering stops that night, everywhere, all at once. Rivers
remember their directions. The grey grass dreams green. Across the
realm the Hollowed pause — and turn — and begin, slowly, to fall UP,
caught again, named again, home.

The god does not speak to you. He will never speak to anyone again;
all of him is loom now. But as the Wound closes over the drowned
chapel, sealing the Shepherd back into the sky's machinery, the last
breath of him that is still a PERSON looks out through the closing
light at you — the one who decided — and what is in that look will
wait for you behind every prayer you ever overhear, for the rest of
your life.

# The world is saved. The word for what you are is older than 'hero'
and the chapels will never, ever print it.`,
      on_enter: { flags: { final_reforged: true } },
      ending: "The Chained God",
      choices: [],
    },

    "end_new_shepherd": {
      text: `You say it out loud: 'The loom needs a weaver. Let it be one of the
woven.'

The god's eyes close — relief, the whole tide of it — and the three
shards mend in your hands like a circle agreeing to be round. The
last thing you do with mortal fingers is lift the Hollow Crown; the
first thing you feel with whatever replaces them is EVERYTHING: every
harvest, every birth, every small mercy, every snapping thread, the
entire weight that broke a god, settling onto a brow that walked here
carrying lanterns and strangers and other people's odds.

It is exactly as unbearable as he promised. You bear it anyway — but
not as he did, alone, three thousand years proud in the sky. You were
woven before you were weaver, and you remember: the bridge at
Millrun, the kneeling Hollowed, the folded coat. You institute the
thing heaven never had. You take WITNESSES. The dead sit up with you.
The Hollowed — caught, rising, named again — keep the watch in
shifts. The fields above turn out not to be empty after all, merely
unfurnished, and you furnish them.

Below, the world greens. They paint you in the chapels within the
decade, and because the world is the world, they paint you serene.
But here and there an honest painter gets the eyes right: tired,
yes, already tired — and looking OUT of the mural, always, at the
congregation, checking on them. A shepherd, the grey country says,
the way you'd say a neighbor's name.

# The first crown in the history of crowns that visits.`,
      on_enter: { flags: { final_claimed: true } },
      ending: "The Shepherd Who Visits",
      choices: [],
    },

    "end_tyrant": {
      text: `You say it out loud, and the saying is a taking: 'Mine.'

The god's eyes close — even this is relief to him, even YOU — and the
Crown mends in your hands and comes down on your brow like the lid of
the world. And the world pours in: every thread, every life, every
small mercy, all of it yours to hold.

All of it yours.

You were honest your whole walk here — more honest than the heroes —
and you are honest now: you did not climb out of the gutter of the
world to hold its threads NEUTRALLY. The loom learns your grip within
the year. Harvests come first to the loyal. The grey rolls back from
the obedient townships and pools, instructively, around the rest.
The Hollowed rise renamed — your names for them; they answer to what
you say they are, and so, soon enough, does everything else.

They paint you in the chapels because you require it. The painters
get the eyes right on the first try — they daren't not — and the eyes
follow the congregation home.

It is not cruelty, mostly. It is OWNERSHIP, total and patient, and it
will be a very long time before anyone can do anything about it,
because the only being who ever carried this crown ahead of you spent
his last strength making sure it could be given — and you have already
made sure, with the thoroughness that got you here, that no one will
ever be positioned to receive it.

# The world is saved. The world is kept. The difference is the whole of
history now, and you are the only one left who remembers there was
one.`,
      on_enter: { flags: { final_claimed: true } },
      ending: "The Crown of Ash",
      choices: [],
    },

    "end_uneasy_god": {
      text: `You say it out loud — 'someone has to' — which is the truest and
smallest reason anyone has ever taken a throne.

The Crown mends. The weight comes down. And the world gets the god it
actually produced: not a monster, not a saint — a person, scaled up.
You hold the threads the way you held everything on the long road
here: some days like the bridge at Millrun, some days like the prices
you took when taking was easy. The harvests are good in the years
your heart is. The grey country learns to read the weather of you,
the way the woven have always read their weavers.

In the chapels they paint you with your hand half-open, half-closed,
and the theologians of the next age will build whole schools on which
way the hand was moving. The honest answer, which you alone hold at
the loom's center: both. Always both. The world is woven now by
someone who remembers being a thread — remembers it imperfectly, and
more faintly every century.

The last prayer you allow yourself to overhear, a generation in, is
from an old woman in a town you once did something to — saved or
spent, you genuinely no longer remember, and the not-remembering is
the thing the prayer is about. 'Watch the watcher,' she prays, to
no one, to you. You institute it as a holy day. It's a start. It
will have to be.`,
      on_enter: { flags: { final_claimed: true } },
      ending: "The Uneasy God",
      choices: [],
    },

    "end_mortal_age": {
      text: `You say it out loud, for the acoustics, for the records, for the
king under the hill: 'No more looms. No more shepherds. The world
learns to catch itself.'

The god's eyes are open for this one. You lay the two shards on his
breast, lift the third from his brow — and break all three, together,
on the drowned chapel's stone, with the barrow-king's argument for a
hammer: NO ONE SHOULD RULE A GOD, SO NOTHING SHOULD NEED TO.

The sound is not loud. It's THOROUGH. It travels through the floor of
the world.

The Withering stops — not reversed: CONCLUDED, a tide that goes out
and is done being a tide. The grey lands stay grey; scars keep. But
the unraveling halts at every edge, because there is no longer a
loom to unravel FROM; the world's weave is in the world's own hands
now, the only place it can't be dropped from.

Vael dies with the breaking. You see it happen, and it is the thing
the Shepherd of Ash never got: an ATTENDED death, witnessed, the long
shift ended, the rope-burned hands going loose at last around a crook
that is no longer there. What is left on the chapel floor afterward
is the size of a man and lighter than ash and gone by morning.

Magic thins by the generation, after. The Hollowed do not rise — but
they stop falling, and the world, which can no longer pray the
problem upward, builds undercrofts. Ladles. Schedules. The arithmetic
of forty, township by township. Historians will call the age that
follows lesser: shorter lives, smaller wonders, an empty sky. The
people living in it call it something else.

# They call it THEIRS.`,
      on_enter: { flags: { final_destroyed: true } },
      ending: "The Mortal Age",
      choices: [],
    },

    "end_serra": {
      text: `You put the three shards in the hands of the most stubborn person
you have ever met, and you say it out loud: 'Let the world's oath be
held by someone who knows what breaking one costs.'

Serra Valebright argues. Of course she argues — one sentence: 'I came
here to ASK him a question, not to take his chair' — and then she
looks down at the dying god, the empty chair's last occupant, and the
question and the chair turn out to be the same thing, and she has
never once in her life left a post unmanned.

The Crown mends on her brow. The weight comes down. And the realm
gets the one god in all its history who has READ HER OWN FILE — who
knows exactly what institutions do, what orders rot into, what the
parade voice costs — and stands the watch anyway, with the whole of
her old drill-ground patience.

She is not a gentle god. She is a FAIR one, which is rarer and harder:
the harvests of the cruel fail with great precision; the Greyfields of
the new age get JUSTICE, not candles. In the repainted chapels she
bears a sun that is deliberately unfinished, and beneath it, her one
commandment, the condition she set at a bridge on the Millrun before
she'd follow anyone anywhere:

THE WEAK ARE NOT CURRENCY. WE DO NOT SPEND THEM.

And on quiet nights, the grey country swears, you can hear the sky
keeping watch: a faint ring of metal on whetstone, unhurried,
eternal — a knight on the wall of the world, sharpening.`,
      on_enter: { flags: { final_companion: true, crowned_serra: true } },
      ending: "The Risen Shield",
      choices: [],
    },

    "end_maeve": {
      text: `You put the three shards in ink-stained hands, and you say it out
loud: 'Let the loom belong to the one person who read the weaver's
diary and wept for him.'

Maeve of the Mire goes very still — and then, being Maeve, she
NEGOTIATES: with a dying god, at the bottom of the world, terms. No
serenity. No silence. The correspondence stays OPEN. The first
literate god.

The Crown mends on her brow, and the world's new weaver does what
no power has ever done: she PUBLISHES. The loom's ledgers, the sky's
marginalia, the actual price of every harvest — posted, plainly, in
every chapel, which she renames libraries. Prayer is answered in
writing, sometimes with corrections. The age that follows is loud,
argumentative, blasphemous by every old standard, and the grey
country thrives in it like a bog in the rain, because for the first
time in the history of worship the congregation can check the
weaver's working.

She holds the watch well. Tired-eyed within the century — the diary
taught her exactly what she was signing — but never alone: she
took the post on the condition that it be a READING ROOM, and the
dead and the living and the Hollowed risen all sit up with her in
shifts, and the lamps of heaven are always lit.

# The last page of her great history, the one with no annotations,
hangs framed above the loom: half a song, finished.`,
      on_enter: { flags: { final_companion: true, crowned_maeve: true } },
      ending: "The Open Library",
      choices: [],
    },

    "end_hollow_god": {
      text: `You put the three shards in grey hands, and you say it out loud:
'Let the catching belong to someone who knows the falling from
inside.'

Brother Hollow looks at the Crown for a long time, from underwater,
and then does the thing he does with everything: he accepts it the
way you'd accept a ladle. A tool for a chore that needs doing.

The Crown mends on a Hollowed brow — and the world changes key. No
trumpet. A SETTLING, like a house at dusk. Because the new god of
everything was an unlabeled jar for years, and his first decree is
no decree at all: it is simply that the falling, everywhere, all at
once, feel a hand under them. Not pulling them back. Not letting
them drop. SITTING WITH. The Withering does not reverse so much as
lose its loneliness, which turns out to have been most of its
weight.

The Hollowed rise slowly, over years, each one caught at their own
pace, called back by their own kept names. The cult disbands quietly
— there is no doctrine that survives the sky itself saying 'we.'
And the chapels of the new age have no murals at all: just rows of
plain lamps, always lit, and a third stair that turns, and at the
front, where an altar would go, a ladle on two pegs.

He still doesn't call himself a god. Asked — and he answers every
asking, that's the whole liturgy — he says: 'I'm the one who sits
up. Somebody has to. Mind the third stair; it turns.'`,
      on_enter: { flags: { final_companion: true, crowned_hollow: true } },
      ending: "The Quiet Shepherd",
      choices: [],
    },

    "end_last_witness": {
      text: `You say it out loud, and it is the easiest thing you have ever
said, which should frighten you, and doesn't, which is the proof
of how far you've come: 'Let it all stop hurting.'

The Shepherd of Ash does not rejoice. Grief doesn't. He simply makes
room at the rim of the deciding, beside him, and the two of you keep
the world's last vigil together while the great anesthesia finishes
its rounds.

It takes years, and they are — this is the thing you could never
explain to anyone, if anyone remained to explain to — GENTLE years.
The Withering completes the way evening completes: the grey takes
the labels off the world, then the words under the labels, then the
need beneath the words. The last cities go quiet without ever once
screaming. The last child forgets she was hungry before she forgets
the game she was playing, and the game lasts longer than the hunger.
On the final morning — there is a final morning; you attend it — the
world does not end. It UNCLENCHES. Every fist, every knot, every
held breath since the first morning, let go at once. The Shepherd
of Ash goes with it, his work complete, his shape sifting down at
last across the still fields like snow with nothing left to land on.

You remain. That was the price, or the gift — at the end of
everything they are the same word. One witness, walking the
unlabeled world, remembering it: the folding of coats, the counting
songs, the bridge at Millrun, all of it filed and kept and tended.

Somewhere on a road that goes nowhere, a wagon's chimes. He pulls
up alongside you, the only other professional left, and looks out
over the stillness with frank admiration.

'Magnificent inventory,' says the Pale Merchant. 'Walk with me.
We have so much to catalogue, and all the time there is.'`,
      on_enter: { flags: { final_witness: true } },
      ending: "The Last Witness",
      choices: [],
    },
  };

  HC.story = HC.story || {};
  HC.story.endings = { SCENES };
  HC.story.epilogue = epilogue;
})(globalThis.HC);
