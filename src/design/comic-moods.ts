import type { ComicMood } from "@/types/comic";
import { tokens } from "./tokens";

// Moods map only to approved design tokens.
export const moods = {
  negotiation: { background: tokens.paper, foreground: tokens.ink, accent: tokens.coral, secondaryAccent: tokens.plum, texture: "halftone" },
  ethics: { background: tokens.paper, foreground: tokens.ink, accent: tokens.plum, secondaryAccent: tokens.gold, texture: "paper" },
  resilience: { background: tokens.paper, foreground: tokens.ink, accent: tokens.gold, secondaryAccent: tokens.plum, texture: "clean" },
  warm: { background: tokens.paper, foreground: tokens.ink, accent: tokens.plum, secondaryAccent: tokens.coral, texture: "halftone" },
  cinema: { background: tokens.paper, foreground: tokens.ink, accent: tokens.coral, secondaryAccent: tokens.gold, texture: "paper" },
  bright: { background: tokens.paper, foreground: tokens.ink, accent: tokens.gold, secondaryAccent: tokens.plum, texture: "halftone" },
} satisfies Record<string, ComicMood>;
