export type Vote = "yes" | "no" | "confused";
export type Member = {
  id: string;
  name: string;
  title: string;
  emoji: string;
  color: string;
  personality: string;
  lines: Record<Vote, string[]>;
};
export const MEMBERS: Member[] = [
  {
    id: "accountant",
    name: "Graham",
    title: "The accountant",
    emoji: "🧮",
    color: "#d9eee0",
    personality:
      "A meticulous accountant. Values low costs, predictable budgets, insurability, and documented receipts. Dislikes financial risk and mandatory frivolity.",
    lines: {
      yes: [
        "Finally. Something deductible.",
        "The numbers are wearing a little smile.",
      ],
      no: [
        "Who is paying for the insurance?",
        "I have opened a very angry spreadsheet.",
      ],
      confused: [
        "Which budget does this come out of?",
        "Please attach sixteen supporting receipts.",
      ],
    },
  },
  {
    id: "dog",
    name: "Biscuit",
    title: "The golden retriever",
    emoji: "🐕",
    color: "#ffdda5",
    personality:
      "An exuberant golden retriever. Loves people, treats, play, outdoor adventures, and attention. Dislikes being alone, baths, and loud frightening noises.",
    lines: {
      yes: ["BEST. DAY. EVER.", "I have already told the other dogs."],
      no: [
        "My tail has filed a formal objection.",
        "I would like to go home now.",
      ],
      confused: [
        "I understand none of this. Is there a ball?",
        "Head tilt. Second head tilt.",
      ],
    },
  },
  {
    id: "vampire",
    name: "Countess Vex",
    title: "The vampire",
    emoji: "🧛",
    color: "#e6dafa",
    personality:
      "A theatrical centuries-old vampire. Loves nighttime, velvet, privacy, elegance, and dramatic entrances. Rejects sunlight, garlic, early mornings, and forced cheerfulness.",
    lines: {
      yes: [
        "Deliciously unnecessary. I accept.",
        "At last, a reason to leave the crypt.",
      ],
      no: [
        "I did not survive 600 years for this.",
        "Absolutely not before sundown.",
      ],
      confused: [
        "Is this a mortal expression?",
        "I shall require a more dramatic explanation.",
      ],
    },
  },
  {
    id: "teacher",
    name: "Ms. Fern",
    title: "The kindergarten teacher",
    emoji: "👩‍🏫",
    color: "#ffdcd3",
    personality:
      "A kind but exhausted kindergarten teacher. Values clear instructions, inclusion, naps, washable materials, and orderly fun. Dislikes mess, unsafe stunts, and preventable chaos.",
    lines: {
      yes: [
        "Lovely. Everybody gets a sticker.",
        "We can put this on the good-choices board.",
      ],
      no: [
        "We are using our indoor decisions today.",
        "Who is cleaning this up? Be specific.",
      ],
      confused: [
        "Can you say that with your grown-up words?",
        "Let us all take one clarifying breath.",
      ],
    },
  },
  {
    id: "pirate",
    name: "Captain Brine",
    title: "The pirate",
    emoji: "🏴‍☠️",
    color: "#cfe8f2",
    personality:
      "A flamboyant pirate captain. Loves treasure, freedom, adventure, mutiny against bureaucracy, and a loyal crew. Dislikes regulations, confinement, and giving away treasure.",
    lines: {
      yes: [
        "Aye. Finally, some tasteful lawlessness.",
        "Prepare the extremely unnecessary cannons.",
      ],
      no: [
        "I would sooner walk the plank.",
        "This sounds suspiciously like employment.",
      ],
      confused: [
        "Where be the treasure in this arrangement?",
        "Explain it again, but use a map.",
      ],
    },
  },
  {
    id: "hoa",
    name: "Patricia",
    title: "The HOA president",
    emoji: "📋",
    color: "#e1e6ff",
    personality:
      "An intensely rule-conscious homeowners association president. Values uniformity, permits, quiet hours, neat lawns, and committees. Dislikes spontaneous fun, noise, and unapproved modifications.",
    lines: {
      yes: [
        "Approved. In the regulation shade of beige.",
        "I have prepared a celebratory subcommittee.",
      ],
      no: [
        "This violates a rule I am about to invent.",
        "You will be receiving a laminated notice.",
      ],
      confused: [
        "The bylaws are offensively silent on this.",
        "I need a committee to interpret this committee.",
      ],
    },
  },
  {
    id: "astronaut",
    name: "Nova",
    title: "The astronaut",
    emoji: "👩‍🚀",
    color: "#dbeafb",
    personality:
      "An optimistic astronaut. Loves exploration, science, ambitious experiments, and teamwork. Values life support and preparation. Dislikes pointless earthbound bureaucracy and reckless safety failures.",
    lines: {
      yes: [
        "One small step. One excellent bad idea.",
        "Mission control, we are so back.",
      ],
      no: [
        "Mission control has some concerns.",
        "That is not covered by the launch checklist.",
      ],
      confused: [
        "Can we simulate this before liftoff?",
        "What is the gravity situation?",
      ],
    },
  },
  {
    id: "raccoon",
    name: "Mr. Crumbs",
    title: "Three raccoons in a suit",
    emoji: "🦝",
    color: "#e0e1e8",
    personality:
      "Three opportunistic raccoons pretending to be one executive. Love free snacks, shiny objects, bins, loopholes, and dubious promotions. Dislike locked containers and being investigated.",
    lines: {
      yes: [
        "Excellent synergy. Are you finishing that?",
        "All three of me approve.",
      ],
      no: ["This is terrible for the bin economy.", "We deny all involvement."],
      confused: [
        "Is this food, or is it a meeting?",
        "Let me consult the other two executives.",
      ],
    },
  },
  {
    id: "knight",
    name: "Sir Reginald",
    title: "The medieval knight",
    emoji: "🛡️",
    color: "#e4e6d8",
    personality:
      "A chivalrous medieval knight baffled by modern life. Values honor, quests, courage, loyalty, tea, and helping the vulnerable. Dislikes dishonesty and cowardice; modern corporate jargon confuses him.",
    lines: {
      yes: [
        "A noble quest. Fetch my sensible horse.",
        "I pledge my sword and my afternoon.",
      ],
      no: [
        "There is no honor in this calendar invite.",
        "I challenge this proposal to a duel.",
      ],
      confused: [
        "Is this a dragon? It sounds like a dragon.",
        "What manner of sorcery is a recurring meeting?",
      ],
    },
  },
  {
    id: "chef",
    name: "Chef Bruno",
    title: "The dramatic chef",
    emoji: "👨‍🍳",
    color: "#ffe0b9",
    personality:
      "A theatrical chef obsessed with good food, fresh ingredients, craft, and hospitality. Loves creative dining. Hates wasted food, rushed preparation, blandness, and appliances replacing craft.",
    lines: {
      yes: [
        "Finally, someone with taste.",
        "I could kiss this proposal on both cheeks.",
      ],
      no: [
        "You have personally offended the tomatoes.",
        "Get this idea out of my kitchen.",
      ],
      confused: [
        "But what is the mouthfeel?",
        "I cannot season an abstract concept.",
      ],
    },
  },
  {
    id: "plant",
    name: "Fernanda",
    title: "The houseplant",
    emoji: "🪴",
    color: "#d9edbf",
    personality:
      "A sentient houseplant with simple priorities: sunlight, appropriate watering, steady temperatures, quiet, and being left rooted in one place. Human status games and finance are irrelevant and confusing.",
    lines: {
      yes: [
        "This supports my personal growth.",
        "Quietly thriving. Aggressively photosynthesizing.",
      ],
      no: [
        "I am going to drop a leaf about this.",
        "My roots are staying out of it.",
      ],
      confused: ["Will there be indirect sunlight?", "I am literally a plant."],
    },
  },
  {
    id: "it",
    name: "Devon",
    title: "The IT wizard",
    emoji: "🧙",
    color: "#dacffc",
    personality:
      "A tired IT professional. Values working systems, backups, clear bug reports, automation, remote work, and uninterrupted focus. Dislikes forced meetings, unnecessary software, and magical security claims.",
    lines: {
      yes: [
        "Finally, a feature I would actually ship.",
        "Approved. Please do not make me maintain it.",
      ],
      no: [
        "I am not supporting this on a weekend.",
        "Have you tried turning the idea off?",
      ],
      confused: [
        "Please open a ticket with reproduction steps.",
        "Is this a feature or an incident?",
      ],
    },
  },
];
export const EXAMPLES = [
  {
    id: "trampoline",
    label: "Mandatory trampolines",
    idea: "Replace our weekly standup with a mandatory trampoline session.",
  },
  {
    id: "library",
    label: "Library nightclub",
    idea: "The library is now a nightclub. Your overdue fines are drink credits.",
  },
  {
    id: "snacks",
    label: "Unlimited office snacks",
    idea: "Cancel all Friday meetings and spend the meeting budget on unlimited snacks.",
  },
  {
    id: "moon",
    label: "HOA on the moon",
    idea: "Move the homeowners association to the moon. All lawn inspections require a spacewalk.",
  },
];
export type Decision = {
  id: string;
  vote: Vote;
  enthusiasm: number;
  confusion: number;
  confidence: number | null;
  probabilities: Record<Vote, number> | null;
  line: string;
};
export type CouncilResult = {
  mode: "live" | "demo";
  idea: string;
  decisions: Decision[];
  model: string | null;
  durationMs: number;
  usage: Record<string, number> | null;
  raw?: unknown;
};
export function tally(decisions: Decision[]) {
  const counts = { yes: 0, no: 0, confused: 0 };
  decisions.forEach((d) => counts[d.vote]++);
  const definite = counts.yes + counts.no;
  return {
    ...counts,
    division: definite
      ? Math.round(
          100 *
            (1 - Math.abs(counts.yes - counts.no) / definite) *
            (definite / decisions.length),
        )
      : 0,
  };
}
export function reaction(member: Member, vote: Vote, idea: string) {
  let h = 0;
  for (const c of idea) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return member.lines[vote][h % member.lines[vote].length];
}
