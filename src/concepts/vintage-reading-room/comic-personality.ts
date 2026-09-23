// A small in-character aside per comic, in the voice of whichever cast member suits the theme best,
// giving each catalogue entry its own personality beyond a shared tagline and price
export const personality: Record<string, { voice: "The Professor" | "The Bot" | "The Cat"; line: string }> = {
  negotiation: { voice: "The Cat", line: "The treaty is signed once I get my treat" },
  ethics: { voice: "The Professor", line: "Every shortcut has a toll booth somewhere" },
  resilience: { voice: "The Bot", line: "Data point one, you are still standing" },
  "emotional-intelligence": { voice: "The Cat", line: "Feelings first, opinions later" },
  leadership: { voice: "The Professor", line: "Trust is a slow and steady chapter" },
  communication: { voice: "The Bot", line: "Message sent is not message understood" },
  persuasion: { voice: "The Cat", line: "Convince me, I dare you" },
  "decision-making": { voice: "The Bot", line: "Weighing every option, please hold" },
  storytelling: { voice: "The Professor", line: "Every idea deserves a proper character" },
  "conflict-resolution": { voice: "The Cat", line: "Put the claws away and talk" },
};

// Five cloth tones shared with the comic cover placeholders, so a card's spine always matches its binding
export const CLOTH = ["#16382B", "#5C2A28", "#1F3350", "#3B2440", "#4A3222"];
export const clothFor = (slug: string) => {
  let hash = 5381;
  for (const c of slug) hash = ((hash * 33) ^ c.charCodeAt(0)) >>> 0;
  return CLOTH[hash % CLOTH.length];
};
