# CLAUDE CODE PROMPT 9: REPLACE THE PLACEHOLDER COMICS WITH THE CLIENT'S TEN

Repo: `Sitesmith-X-Humanisse`. Written 2026-10-12. Follows prompts 1–8. **Part 1 of 4** of the client-copy work:
9 comics, 10 the three audience pages, 11 About / Learning Ideology / Community and the landing page, 12 navigation.
Run them in that order.

## 0. Rules for client copy (these apply to prompts 9, 10, 11 and 12)

The client has now supplied real copy. The text blocks in this prompt are copied verbatim from his
"Website Copy Content" spreadsheet, so treat them as the source of truth:

- **Use the text exactly as written.** Do not reword, shorten, merge, re-punctuate, "tidy" or improve it. Do not
  add a full stop where there is none, or remove one that is there. The one exception: a **standalone heading**
  may drop its trailing full stop, to match the rest of the site's headings
- The brand is always spelled **Humanisse**. The spreadsheet sometimes says "Humanise"; that has already been
  corrected in the blocks below. If you ever see "Humanise" in the site, it is a bug
- **Do not invent copy.** Where the interface needs a label the client did not write (a button, a section label),
  use the shortest plain functional wording, and list every such label in your final report so it can be approved
- Remove placeholder markers only from content that is now real: "Preview" / "sample copy" notices and
  "PREVIEW ONLY" comments on titles, descriptions and the pages that now carry client copy. **Leave** the markers
  on things that are still placeholders: prices ("Sample price"), the legal documents, the FAQ, covers that say
  "Cover coming soon"
- Never touch `src/content/legal-copy.ts`, `src/content/preview-copy.ts`'s `faq`, or `src/content/audiences.ts`
  unless this prompt says to

---

## 1. What this prompt does

Replaces the ten placeholder comics with the ten the client actually wants, using his titles and copy. Four of
the old titles no longer exist and four new ones appear, so **slugs change** and everything that referenced an
old slug must move with them. This is the biggest of the four content prompts, do it carefully.

| Client's comic | New slug | Was |
| --- | --- | --- |
| Negotiation | `negotiation` | unchanged |
| Resilience | `resilience` | unchanged |
| Storytelling | `storytelling` | unchanged |
| Problem Solving | `problem-solving` | **new** |
| Ethics & Sustainability | `ethics-sustainability` | was `ethics` |
| Decision Sciences | `decision-sciences` | was `decision-making` |
| Active Listening | `active-listening` | **new** |
| Critical Reading | `critical-reading` | **new** |
| Difficult Conversations | `difficult-conversations` | **new** |
| Emotional Intelligence | `emotional-intelligence` | unchanged |

**Removed entirely:** `leadership`, `communication`, `persuasion`, `conflict-resolution`.

Read before starting: `src/types/comic.ts`, `src/content/comics.ts`, `src/components/comics/ComicPanel.tsx`,
`ComicCard.tsx`, `ComicCover.tsx`, `ComicsHero.tsx`, `Storefront.tsx`, `src/components/landing/Sections.tsx`.

Setup: if `node_modules` still lacks `@supabase/*` (it did on 2026-10-12), run `npm install` first. No new
dependencies.

---

## 2. The data model

**File:** `src/types/comic.ts`

Change the `Comic` type:

- **Remove** `shortDescription`
- **Add** `strapline: string` — the short punchy line under the title (for example "Fall. Learn. Adapt. Rise.")
- **Add** `description: string` — the body paragraph
- **Add** `closing?: string` — the last line of the client's blurb, shown as a pull-line (Negotiation has none)
- **Keep** `tagline` and `theme`. `tagline` now holds the client's headline for the comic ("The Art of Bouncing
  Back"), which is what catalogue cards already show. It stays at twelve words or fewer, and every one is
- **Keep** `category`, `tags`, `outcomes`, `coverImage`, `price`, `priceLabel`, `videoAvailable`, `mood`, `pages`

Update the doc comment on `tagline` so it no longer says "the only description most visitors read". Update every
reader of `shortDescription` (`ComicPanel.tsx`, `Storefront.tsx`'s search, and
`src/concepts/vintage-reading-room/NegotiationExperience.tsx`) to the new fields. Search should match
`title`, `tagline`, `strapline`, `description` and `tags`.

---

## 3. The content

**File:** `src/content/comics.ts` — replace the whole file with this. It is generated from the spreadsheet; do
not edit the strings.

```ts
import type { Comic } from "@/types/comic";
import { moods } from "@/design/comic-moods";

// Titles, taglines, straplines, descriptions, tags and outcomes are the client's copy (Website Copy Content
// sheet, October 2026). Prices and the `videoAvailable` flags are still placeholders.
export const comics: Comic[] = [
  {
    slug: "negotiation",
    title: "Negotiation",
    theme: "Negotiation",
    category: "work",
    tagline: "Balancing Logic, Empathy & Outcomes",
    strapline: "Negotiation is more than getting what you want.",
    description: "It is the art of understanding interests, managing emotions, building trust, and creating mutually beneficial outcomes. Through engaging comic storytelling, Professor, Bot, and Cat take learners on a journey into the world of negotiation. From understanding BATNA and bargaining strategies to mastering empathy, persuasion, and conflict resolution, this comic brings real-world negotiation skills to life. Learn to negotiate smarter, think strategically, and build relationships that last.",
    tags: ["BATNA", "Bargaining", "Persuasion"],
    outcomes: ["Negotiate smarter", "Think strategically", "Build relationships that last"],
    price: 199, priceLabel: "₹199", videoAvailable: true,
    coverImage: "/characters/references/negotiation-cover.png",
    mood: moods.negotiation,
    pages: [{ id: "negotiation-1" }, { id: "negotiation-2" }, { id: "negotiation-3" }, { id: "negotiation-4" }],
  },
  {
    slug: "resilience",
    title: "Resilience",
    theme: "Resilience",
    category: "life",
    tagline: "The Art of Bouncing Back",
    strapline: "Fall. Learn. Adapt. Rise.",
    description: "Success isn't about never failing. It's about finding the strength to recover, adapt, and move forward. Through engaging classroom conversations, relatable situations, and practical exercises, this Humanisse comic explores how to navigate setbacks, manage emotions, develop a growth mindset, and build mental strength. Discover how resilience helps you overcome challenges, embrace uncertainty, and turn adversity into opportunities for growth.",
    closing: "In a world of constant change, resilience is the human strength that turns setbacks into comebacks.",
    tags: ["Setbacks", "Growth mindset", "Mental strength"],
    outcomes: ["Overcome challenges", "Embrace uncertainty", "Turn adversity into opportunities for growth"],
    price: 199, priceLabel: "₹199", videoAvailable: true,
    coverImage: "",
    mood: moods.resilience,
    pages: [],
  },
  {
    slug: "storytelling",
    title: "Storytelling",
    theme: "Storytelling",
    category: "communication",
    tagline: "The Art of Making Ideas Matter",
    strapline: "Facts inform. Stories inspire.",
    description: "Why do some ideas stay with us while others are forgotten? Storytelling is the art of transforming information into meaningful connections. Through engaging classroom conversations, practical exercises, and real-world business scenarios, this Humanisse comic explores the power of storytelling in communication, leadership, marketing, and personal branding. Learn how to structure compelling narratives, connect emotionally with audiences, turn data into stories, and inspire action.",
    closing: "In a world overflowing with AI-generated content, the ability to tell authentic, meaningful stories is a powerful human skill.",
    tags: ["Communication", "Leadership", "Personal branding"],
    outcomes: ["Structure compelling narratives", "Connect emotionally with audiences", "Turn data into stories", "Inspire action"],
    price: 199, priceLabel: "₹199", videoAvailable: true,
    coverImage: "/client-assets/comic-posters/storytelling-cover.jpg",
    mood: moods.bright,
    pages: [],
  },
  {
    slug: "problem-solving",
    title: "Problem Solving",
    theme: "Problem Solving",
    category: "work",
    tagline: "The Art of Thinking Beyond the Obvious",
    strapline: "Every problem is an opportunity to think differently.",
    description: "Great problem solvers don't rush to find answers. They ask better questions, challenge assumptions, and uncover the real problem before searching for solutions. Through engaging classroom conversations, real-world business challenges, and practical exercises, this comic explores critical thinking, root cause analysis, creativity, and structured problem-solving techniques. Learn how to approach complex challenges, evaluate alternatives, and turn ideas into effective solutions.",
    closing: "In a world where AI can generate answers, the real human advantage lies in asking the right questions and solving the problems that matter.",
    tags: ["Critical thinking", "Root cause analysis", "Creativity"],
    outcomes: ["Approach complex challenges", "Evaluate alternatives", "Turn ideas into effective solutions"],
    price: 199, priceLabel: "₹199", videoAvailable: true,
    coverImage: "",
    mood: moods.cinema,
    pages: [],
  },
  {
    slug: "ethics-sustainability",
    title: "Ethics & Sustainability",
    theme: "Ethics & Sustainability",
    category: "work",
    tagline: "The Art of Doing What's Right",
    strapline: "Good decisions create profits. Responsible decisions create a better future.",
    description: "In a world where business success is measured by more than financial performance, ethics and sustainability are essential leadership skills. Through engaging classroom conversations, real-world business dilemmas, and practical exercises, this comic explores ethical decision-making, corporate responsibility, environmental sustainability, and the balance between people, planet, and profit. Learn how to navigate ethical challenges, build trust, and make responsible decisions that create lasting value.",
    closing: "In an AI-driven world, the true measure of leadership is not just what we can achieve, but how responsibly we achieve it.",
    tags: ["Ethical decision-making", "Corporate responsibility", "Sustainability"],
    outcomes: ["Navigate ethical challenges", "Build trust", "Make responsible decisions that create lasting value"],
    price: 199, priceLabel: "₹199", videoAvailable: true,
    coverImage: "/client-assets/comic-posters/ethics-sustainability-cover.jpg",
    mood: moods.ethics,
    pages: [],
  },
  {
    slug: "decision-sciences",
    title: "Decision Sciences",
    theme: "Decision Sciences",
    category: "work",
    tagline: "The Art of Choosing Wisely",
    strapline: "Better decisions begin with better thinking.",
    description: "Every decision shapes our future, but how do we make the right choices in a world filled with uncertainty? Through engaging classroom conversations, real-world business scenarios, and practical exercises, this comic explores decision-making frameworks, cognitive biases, risk assessment, and the balance between logic and intuition. Learn how to evaluate alternatives, challenge assumptions, and make informed decisions with confidence.",
    closing: "In a world where AI can analyze endless possibilities, human judgment remains essential to making choices that matter.",
    tags: ["Frameworks", "Cognitive biases", "Risk assessment"],
    outcomes: ["Evaluate alternatives", "Challenge assumptions", "Make informed decisions with confidence"],
    price: 199, priceLabel: "₹199", videoAvailable: true,
    coverImage: "",
    mood: moods.cinema,
    pages: [],
  },
  {
    slug: "active-listening",
    title: "Active Listening",
    theme: "Active Listening",
    category: "communication",
    tagline: "The Art of Understanding Beyond Words",
    strapline: "Listening is more than hearing. It's the beginning of understanding.",
    description: "In a world where everyone wants to be heard, the ability to truly listen has become an essential human skill. Through engaging classroom conversations, relatable situations, and practical exercises, this comic explores attentive listening, empathy, non-verbal communication, and the art of asking meaningful questions. Learn how to overcome listening barriers, understand different perspectives, build trust, and strengthen personal and professional relationships.",
    closing: "In an age of constant digital noise, the ability to listen with attention, empathy, and understanding is a powerful human advantage.",
    tags: ["Empathy", "Non-verbal communication", "Meaningful questions"],
    outcomes: ["Overcome listening barriers", "Understand different perspectives", "Build trust", "Strengthen personal and professional relationships"],
    price: 199, priceLabel: "₹199", videoAvailable: true,
    coverImage: "/client-assets/comic-posters/active-listening-v1.jpg",
    mood: moods.warm,
    pages: [],
  },
  {
    slug: "critical-reading",
    title: "Critical Reading",
    theme: "Critical Reading",
    category: "life",
    tagline: "The Art of Thinking Beyond the Written Word",
    strapline: "Don’t just read information. Question it, evaluate it, and understand it.",
    description: "In a world overflowing with information, opinions, and AI-generated content, the ability to read critically is more important than ever. Through engaging classroom conversations, thought-provoking examples, and practical exercises, this comic explores how to identify arguments, distinguish facts from opinions, recognize hidden assumptions, detect bias, and evaluate the credibility of information. Learn to question what you read, interpret different perspectives, and develop independent, evidence-based judgments.",
    closing: "In a world where information is unlimited, the ability to question, interpret, and think independently is a defining human skill.",
    tags: ["Hidden assumptions", "Bias", "Credibility"],
    outcomes: ["Question what you read", "Interpret different perspectives", "Develop independent, evidence-based judgments"],
    price: 199, priceLabel: "₹199", videoAvailable: true,
    coverImage: "",
    mood: moods.warm,
    pages: [],
  },
  {
    slug: "difficult-conversations",
    title: "Difficult Conversations",
    theme: "Difficult Conversations",
    category: "communication",
    tagline: "Speak with Courage. Listen with Empathy. Build Trust.",
    strapline: "The conversations we avoid are often the ones that matter most.",
    description: "Whether it's giving feedback, resolving conflict, managing emotions or speaking up when something feels wrong, knowing how to handle difficult conversations is an essential life and leadership skill. Through an engaging 30-page comic featuring the Professor, Bot and Cat, Humanisse brings the art of difficult conversations to life. Explore the psychology behind conflict, master active listening, develop emotional intelligence and learn practical techniques for navigating challenging situations in college, the workplace and everyday life.",
    closing: "Because great communication isn't about winning arguments. It's about building understanding.",
    tags: ["Feedback", "Conflict", "Speaking up"],
    outcomes: ["Explore the psychology behind conflict", "Master active listening", "Develop emotional intelligence", "Learn practical techniques for navigating challenging situations in college, the workplace and everyday life"],
    price: 199, priceLabel: "₹199", videoAvailable: true,
    coverImage: "",
    mood: moods.ethics,
    pages: [],
  },
  {
    slug: "emotional-intelligence",
    title: "Emotional Intelligence",
    theme: "Emotional Intelligence",
    category: "life",
    tagline: "The Art of Understanding Yourself and Others",
    strapline: "Understand your emotions. Connect with people. Lead with empathy.",
    description: "In a world driven by technology and constant change, the ability to understand and manage emotions is an essential human skill. Through engaging classroom conversations, relatable situations, and practical exercises, this comic explores self-awareness, emotional regulation, empathy, motivation, and relationship management. Learn how to navigate challenging situations, build meaningful connections, manage conflict, and develop the emotional intelligence needed for personal and professional success.",
    closing: "In an AI-driven world, emotional intelligence is the human advantage that transforms understanding into connection and empathy into leadership.",
    tags: ["Self-awareness", "Emotional regulation", "Empathy"],
    outcomes: ["Navigate challenging situations", "Build meaningful connections", "Manage conflict", "Develop the emotional intelligence needed for personal and professional success"],
    price: 199, priceLabel: "₹199", videoAvailable: true,
    coverImage: "",
    mood: moods.bright,
    pages: [],
  },
];

export const getComic = (slug: string) => comics.find((c) => c.slug === slug);
```

How `tags` and `outcomes` were made, so you can describe them honestly if asked: the spreadsheet has no tag or
outcome fields, so both are lifted word-for-word from each blurb's own "explores …" and "Learn how to …"
sentences. Nothing in them is new wording. `category` is a filing decision (it drives the catalogue filter
chips), and `mood` only picks an existing colour treatment.

Prices stay at the placeholder ₹199, and `SET_PRICE` in `src/components/cart/pricing.ts` stays at 1499. The client
has not supplied prices.

---

## 4. Every place that used an old slug

Search the whole of `src` for each removed or renamed slug (`ethics`, `leadership`, `communication`,
`persuasion`, `decision-making`, `conflict-resolution`) and fix every hit. Known ones:

- `src/components/comics/ComicsHero.tsx` — the `fan` array calls `getComic(slug)!`, which will return
  `undefined` and crash for a missing slug. Use, left to right: `active-listening`, `ethics-sustainability`,
  `negotiation` (centre, still `priority`), `storytelling`, `resilience`. Four of those five have real covers
  (section 5)
- `src/components/landing/Sections.tsx` — `FeaturedComics` takes `comics.slice(0, 6)`. Change it to an explicit
  list of slugs in this order: `negotiation`, `storytelling`, `ethics-sustainability`, `active-listening`,
  `resilience`, `decision-sciences`, so the featured shelf leads with the comics that have covers
- `src/content/preview-copy.ts` — `themes` (used by the Vintage concept's landing page). Replace the four entries
  with these, using the client's straplines as the text and removing every invented line:
  `negotiation` / "Negotiation is more than getting what you want.", `resilience` / "Fall. Learn. Adapt. Rise.",
  `storytelling` / "Facts inform. Stories inspire.", `ethics-sustainability` / "Good decisions create profits.
  Responsible decisions create a better future." Leave `steps`, `audiences` and `faq` alone
- `src/concepts/living-library/LibraryExperience.tsx` and `src/concepts/vintage-reading-room/LibraryExperience.tsx`
  — demo library rows. They call `getComic(slug)!`. Use `negotiation`, `ethics-sustainability`, `resilience`,
  `storytelling` with the progress values they already have
- `src/concepts/vintage-reading-room/comic-personality.ts` — remove the entries for the four deleted slugs,
  rename `ethics` to `ethics-sustainability` and `decision-making` to `decision-sciences`, keep the other lines
  as they are. Do **not** write new lines for the three new comics: every consumer already guards with
  `personality[slug] &&` (check `CatalogueExperience.tsx` line 108 and `Bookshelf.tsx` line 25 really do cope
  with `undefined`, and fix them if not)
- `src/components/cart/CartContext.tsx` needs no change: its `known` set comes from `comics`, so an old slug left
  in someone's `localStorage` cart is silently dropped. Verify that by hand (see Verification)

When you are done, a search for the six old slugs across `src` must return nothing except the deliberate
`ethics-sustainability` / `decision-sciences` names.

---

## 5. Covers

**Files:** `src/components/comics/ComicCover.tsx`, plus the `coverImage` values already set in section 3.

The repo already holds the client's real art in `public/client-assets/comic-posters/`, unused. Four of the
comics have a **portrait** cover and are wired in section 3: Negotiation (the existing file), Active Listening
(`active-listening-v1.jpg`), Ethics & Sustainability and Storytelling. The other six keep the "Cover coming soon"
placeholder. Do **not** use the square images (`difficult-conversations-cover.png`, the four `decision-sciences-*`
posters) or `ai-can-generate-answers.jpg` (a photo of a screen): square art cropped into a 2:3 slot loses the
title.

Two fixes in `ComicCover.tsx`:

- The `<Image>` has `style={{ width: "100%", height: "100%" }}` with no `objectFit`, so a cover that is not
  exactly 432x624 gets stretched. Add `objectFit: "cover"`
- The alt text says `Placeholder cover for {title}`, which is now false for four of them. Change it to
  `Cover of {title}`

Do not add, move, rename or recompress any file in `public/`.

---

## 6. The comic page

**File:** `src/components/comics/ComicPanel.tsx` (the one copy shared by the pop-up and the standalone page),
and `ComicPanel.module.css`.

Right-hand column of the gold top section, in this order: breadcrumb (unchanged), the `h1` title, the **tagline**
as a subtitle (head font, about 1.35rem, weight 700, above the lead), the **strapline** as the existing `lead`,
the tags, the buy panel and the Preview button (unchanged).

Below the gold section and above `VideoPreview`, add a new section, `section wrap`, with
`aria-labelledby`:

- An `h2` reading **About this comic**
- The **description** as a normal paragraph (the global `p` rule already caps it at 62ch)
- If `closing` exists, a pull-line under it: head font, weight 800, about 1.3rem, a 4px `var(--gold)` left
  border with padding, so it reads as the comic's last word. Style it in `ComicPanel.module.css`

"What you will learn", "You might also like" and everything else stay as they are. This must look right in both
the pop-up and the standalone page, including the expanded pop-up. Check the Negotiation page (the one with a
Preview button) and one long-description comic.

---

## 7. Small copy fixes

- `ComicsHero.tsx`: the notice says "Titles, descriptions, covers and prices are samples". Titles and
  descriptions are real now. Change it to: `Prices are samples, final prices come from Humanisse`. Leave the rest
  of that hero's text alone
- Delete the old `// PREVIEW ONLY: placeholder titles, copy and prices.` comment (replaced by the one in
  section 3)

---

## 8. Do not touch

- Prices, `SET_PRICE`, the cart logic, the reader (`/read/*`) and its placeholder pages, the auth and login code
- `src/content/audiences.ts`, `legal-copy.ts`, and the landing sections other than the shelf in `Sections.tsx`
- `public/` — no file added, moved, renamed or recompressed
- `supabase/schema.sql`, `next.config.ts`, `package.json` — no new dependencies
- The pop-up behaviour in `ComicModal.tsx`
- Do not commit. Do not push. Do not create a branch. When done, send the `http://localhost:3000` link per `CLAUDE.md`

---

## Verification (required)

```bash
npm run lint
npx tsc --noEmit
npm run build
```

All three must be clean (the build exercises `generateStaticParams` for the new slugs). Then in `npm run dev`:

**Catalogue**
- [ ] `/comics` shows exactly ten comics, with the client's titles, in the order of the table in section 1
- [ ] Each card shows its headline (for example "The Art of Bouncing Back") and the first two tags
- [ ] Four cards show real covers, none stretched or squashed, six show "Cover coming soon"
- [ ] The three filter chips (Work and leadership, Everyday life, Communication) each show a sensible, non-empty set
- [ ] Searching `BATNA`, `bias` and `sustainability` each finds the right comic (they live in tags and descriptions)
- [ ] The comics hero fan shows five covers with no blank slot and no console error

**Comic pages**
- [ ] `/comics/resilience`, `/comics/difficult-conversations` and `/comics/negotiation` each show title,
      subtitle, strapline, tags, an "About this comic" section with the full description and the closing line
      (Negotiation has no closing line and must not show an empty one)
- [ ] The same content appears in the pop-up opened from the catalogue, and in its expanded state
- [ ] "What you will learn" lists the new outcomes
- [ ] Only Negotiation still shows the Preview button and `/read/negotiation` still works
- [ ] `/read/active-listening` shows the "not available yet" state, not a crash or a 404
- [ ] `/comics/ethics` and `/comics/leadership` now 404 (the old slugs are gone)

**Everything else**
- [ ] The landing page featured shelf shows Negotiation, Storytelling, Ethics & Sustainability, Active Listening,
      Resilience, Decision Sciences
- [ ] Put an old slug (`"leadership"`) into `localStorage["humanisse-preview-cart"]` by hand and reload: no
      error, and it does not appear in the cart
- [ ] `/concepts/living-library/library` and `/concepts/vintage-reading-room/library` still render
- [ ] A search of `src` for the six old slugs finds nothing
- [ ] The word "Humanise" (single s) appears nowhere in the rendered comics pages

---

## Note for the human

**Prices.** The sheet has none. Every comic still says ₹199 with a "Sample price" badge and the set is still
₹1,499. Get real prices from George before the walkthrough on the 14th.

**Existing test purchases will vanish from My Library.** The library filters out any row whose slug is no longer
in the catalogue. If you have test rows in the Supabase `purchases` table using `ethics` or `decision-making`,
change them to `ethics-sustainability` and `decision-sciences` in the Table Editor. The other four old slugs have
no equivalent and can be deleted.

**Three decisions I made that you can reverse.** The client's "Difficult Conversations" title is a typo-ridden
"Art of DIfficult Conversation", and his own cover reads "The Art of Difficult Conversations". I used the short
"Difficult Conversations" so it matches the other nine titles. The tags and "What you will learn" lines are cut
from his own sentences, as described above. And the featured shelf order puts the comics with real covers first
instead of using the order in the sheet.

**Covers.** Six comics have no portrait cover in the repo. Difficult Conversations and the Decision Sciences
posters are square, so they cannot be used as covers without cropping the title off.
