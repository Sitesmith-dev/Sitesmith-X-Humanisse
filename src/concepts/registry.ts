import dynamic from "next/dynamic";
import type { ComponentType } from "react";

export type ConceptSlug = "living-library" | "vintage-reading-room";

export type ConceptDefinition = {
  slug: ConceptSlug;
  name: string;
  direction: "Direction A" | "Direction B";
  tagline: string;
  description: string;
  vibe: string[];
  accent: string;
  swatches: { label: string; value: string }[];
  card: { bg: string; fg: string };
};

export const concepts: ConceptDefinition[] = [
  {
    slug: "living-library",
    name: "The Living Comic Library",
    direction: "Direction A",
    tagline: "Bright, flat colour panels with a hand-lettered, comic-shop energy",
    description:
      "Every section reads like a page from the comic itself, bold ink outlines, halftone texture and a warm gold, coral and plum palette straight from the brand guide",
    vibe: ["Bold panels", "Halftone texture", "Playful motion", "Comic-shop energy"],
    accent: "#FBC44D",
    swatches: [
      { label: "Paper", value: "#FFF7E3" },
      { label: "Ink", value: "#151014" },
      { label: "Story Gold", value: "#FBC44D" },
      { label: "Story Coral", value: "#B64028" },
      { label: "Character Plum", value: "#5B245E" },
    ],
    card: { bg: "#FBC44D", fg: "#151014" },
  },
  {
    slug: "vintage-reading-room",
    name: "The Vintage Reading Room",
    direction: "Direction B",
    tagline: "Cream and bottle green, gilt lettering and a well-loved storybook feel",
    description:
      "A warm cream page, deep botanical green and a single gilt-gold line borrowed from antique bookbinding, quiet enough for a seventy year old and curious enough for a ten year old",
    vibe: ["Gilt lettering", "Botanical ornament", "Paper texture", "Unhurried pacing"],
    accent: "#B4863A",
    swatches: [
      { label: "Parchment", value: "#F3ECD9" },
      { label: "Bottle Green", value: "#16382B" },
      { label: "Gilt Gold", value: "#B4863A" },
    ],
    card: { bg: "#16382B", fg: "#F3ECD9" },
  },
];

export const getConcept = (slug: string) => concepts.find((c) => c.slug === slug);

// Each concept's experience components are dynamically imported so choosing one direction never
// pulls the other direction's fonts, images or motion code into the same bundle.
type Experiences = {
  Landing: ComponentType;
  Catalogue: ComponentType;
  Negotiation: ComponentType;
  Library: ComponentType<{ searchParams?: { state?: string } }>;
  Cart?: ComponentType;
  Login?: ComponentType;
};

const registry: Record<ConceptSlug, Experiences> = {
  "living-library": {
    Landing: dynamic(() => import("./living-library/LandingExperience").then((m) => m.LandingExperience)),
    Catalogue: dynamic(() => import("./living-library/CatalogueExperience").then((m) => m.CatalogueExperience)),
    Negotiation: dynamic(() => import("./living-library/NegotiationExperience").then((m) => m.NegotiationExperience)),
    Library: dynamic(() => import("./living-library/LibraryExperience").then((m) => m.LibraryExperience)),
  },
  "vintage-reading-room": {
    Landing: dynamic(() => import("./vintage-reading-room/LandingExperience").then((m) => m.LandingExperience)),
    Catalogue: dynamic(() => import("./vintage-reading-room/CatalogueExperience").then((m) => m.CatalogueExperience)),
    Negotiation: dynamic(() => import("./vintage-reading-room/NegotiationExperience").then((m) => m.NegotiationExperience)),
    Library: dynamic(() => import("./vintage-reading-room/LibraryExperience").then((m) => m.LibraryExperience)),
    Cart: dynamic(() => import("./vintage-reading-room/CartExperience").then((m) => m.CartExperience)),
    Login: dynamic(() => import("./vintage-reading-room/LoginExperience").then((m) => m.LoginExperience)),
  },
};

export const getExperiences = (slug: ConceptSlug) => registry[slug];
