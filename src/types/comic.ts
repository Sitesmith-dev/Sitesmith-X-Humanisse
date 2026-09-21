export type ComicMood = {
  background: string;
  foreground: string;
  accent: string;
  secondaryAccent: string;
  texture: "paper" | "halftone" | "clean";
};

export type Category = "work" | "life" | "communication";

export type Comic = {
  slug: string;
  title: string;
  /** One sentence, twelve words at most, the only description most visitors read on the catalogue */
  tagline: string;
  shortDescription: string;
  theme: string;
  category: Category;
  tags: string[];
  outcomes: string[];
  coverImage: string;
  price: number;
  priceLabel: string;
  videoAvailable: boolean;
  mood: ComicMood;
};

export const categoryLabels: Record<Category, string> = {
  work: "Work and leadership",
  life: "Everyday life",
  communication: "Communication",
};
