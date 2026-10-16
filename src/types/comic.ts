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
  /** The client's headline for the comic, twelve words at most, shown on catalogue cards and under the title */
  tagline: string;
  /** The short punchy line under the title */
  strapline: string;
  /** The body paragraph */
  description: string;
  /** The last line of the client's blurb, shown as a pull-line. Not every comic has one */
  closing?: string;
  theme: string;
  category: Category;
  tags: string[];
  outcomes: string[];
  coverImage: string;
  price: number;
  priceLabel: string;
  videoAvailable: boolean;
  mood: ComicMood;
  /** Reading pages in order, served to signed-in readers by /api/comic-pages. Empty for a comic with no artwork yet */
  pages: { id: string; src?: string }[];
  /** A page's width divided by its height, which the reader shapes its pages to */
  pageAspect: number;
  /** True while the reader holds only a preview (the cover and the next two pages), so it can say so */
  preview: boolean;
};

export const categoryLabels: Record<Category, string> = {
  work: "Work and leadership",
  life: "Everyday life",
  communication: "Communication",
};
