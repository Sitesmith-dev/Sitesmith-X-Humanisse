# CLAUDE CODE PROMPT 11: ABOUT US, THE LEARNING IDEOLOGY AND THE COMMUNITY, PLUS THE LANDING PAGE

Repo: `Sitesmith-X-Humanisse`. Written 2026-10-12. Follows prompts 1–10. **Part 3 of 4** of the client-copy work.
Prompts 9 and 10 should already be applied.

## 0. Rules for client copy (the same rules as prompts 9 and 10, repeated because you may not have them in front of you)

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

**Note on this prompt's scope:** it adds new files and edits three landing sections. It is the only one of the
four allowed to change `src/components/landing/Vision.tsx`, `LearningIdeology.tsx` and `Community.tsx`.

---

## 1. What this prompt does

The client's sheet has seven tabs: About Us, Comics, The Learning Ideology, For Corporates, For Campus, For
Individuals, The Community. Comics and the three audience pages are done in prompts 9 and 10. This prompt builds
the other three as **real pages**, and re-sources the three landing sections that were written from placeholders
(`Vision`, `LearningIdeology`, `Community`) so the landing page tells the client's story and links through to
the full pages. Navigation to the new pages is prompt 12, so after this prompt they exist but are only reachable
by URL and from the landing page.

New routes: `/about`, `/learning-ideology`, `/community`.

Read before starting: `src/app/page.tsx`, `src/components/landing/Vision.tsx`, `LearningIdeology.tsx`,
`Community.tsx`, `AudienceContent.tsx` (the model for how a full page here is laid out), `Landing.module.css`
(`.visionGrid`, `.visionList`, `.journey`, `.journeyStep`, `.principleTabs`, `.principleTab`, `.principlePanel`,
`.commSteps`, `.commStep`, `.communityTag`), `src/components/shared/SectionHead.tsx`, `Motion.tsx` (`Reveal`) and
`globals.css` (the `.pagehead`, `.band-*`, `.capBox`, `.pill` and `.btn` classes).

---

## 2. The content

Create three content files. They are generated from the spreadsheet; do not edit the strings.

**`src/content/about.ts`**

```ts
// The client's copy for the About Us page and the landing page's vision section (Website Copy Content sheet, October 2026).
export const about = {
  vision: "To reimagine learning, where human skills are nurtured through stories, curiosity and creativity.",
  mission: "To make learning engaging, accessible and meaningful through comics and storytelling, inspiring curiosity, encouraging creativity and empowering learners to develop essential human skills they can apply in everyday life.",
  whatWeDo: {
    intro: "At Humanisse, we transform important human skills into engaging learning experiences for Individuals, Corporates and Campuses, through comics, stories, conversations and real-world situations. From negotiation and emotional intelligence to resilience, critical thinking, storytelling and difficult conversations, we take concepts that can feel complex and make them simple, visual, relatable and memorable.",
    approachLead: "Our approach is simple:",
    approach: ["Story", "Understand", "Reflect", "Apply"],
    bringLead: "We bring learning to life through:",
    pillars: [
      { title: "Comics", text: "Learn through characters, conversations and real-world situations." },
      { title: "Stories", text: "Discover ideas through narratives that make concepts easier to remember." },
      { title: "Professor's Lessons", text: "Short, thoughtful insights that introduce the questions behind each skill." },
      { title: "Practical Learning", text: "Move beyond knowing a concept to understanding how it works in everyday life." },
    ],
    closing: "Serious skills. Different way of learning.",
  },
  founder: {
    quote: "Education has always been about preparing us for the world we live in. But the way we learn has not always evolved with the world around us. I kept asking myself why can’t important human skills be taught in a way that is easier to understand, more enjoyable to experience, and easier to remember? Skills like negotiation, empathy, resilience, critical thinking, storytelling and difficult conversations are not learned simply by reading definitions. They are understood through situations, choices, conversations and experiences. That is where the idea of Humanisse began. We use comics and storytelling to turn serious learning into something visual, relatable and memorable. Because I believe learning should not just give us information. It should change the way we think, communicate and see the world. That is the journey we are building at Humanisse, one story, one skill and one learner at a time.",
    line: "Knowledge tells us what to know. Humanisse helps us understand how to use it.",
    attribution: "Founder, Humanisse",
  },
};
```

**`src/content/ideology.ts`**

```ts
// The client's copy for the Learning Ideology page and the landing page's philosophy section (Website Copy Content sheet, October 2026).
export const ideology = {
  opening: "Learning should be experienced, not just explained.",
  intro: [
      "At Humanisse, we believe that the most meaningful learning happens when ideas become stories, situations, conversations and experiences.",
      "Traditional learning often asks learners to remember information. We want learners to understand it, question it, connect with it and apply it.",
  ],
  philosophyTitle: "Our learning philosophy",
  philosophy: ["Story", "Understand", "Reflect", "Apply", "Grow"],
  principles: [
      { title: "Make It Simple", text: "Complex ideas should not require complicated explanations. We break important concepts into clear, visual and relatable learning experiences." },
      { title: "Make It Memorable", text: "Stories stay with us. Through comics, characters and situations, we turn concepts into experiences that learners can remember." },
      { title: "Make It Human", text: "Human skills are shaped by emotions, relationships, choices and experiences. Our learning begins with real human situations." },
      { title: "Encourage Curiosity", text: "We don't want learners to simply accept answers. We want them to ask better questions, challenge assumptions and explore different perspectives." },
      { title: "Connect Learning to Life", text: "Learning becomes meaningful when it can be applied. Our stories connect concepts to situations learners encounter in college, careers and everyday life." },
      { title: "Encourage Reflection", text: "Understanding grows when we pause and think. Our learning experiences encourage learners to reflect on their choices, behaviour and perspectives." },
      { title: "Move from Knowledge to Capability", text: "Knowing what negotiation, empathy or resilience means is only the beginning. Humanisse focuses on helping learners understand how these skills work in real situations." },
  ],
  modelTitle: "The Humanisse learning model",
  model: [
      { title: "See it", text: "See the concept through a story." },
      { title: "Understand it", text: "Understand the idea through conversation." },
      { title: "Think about it", text: "Think through different perspectives." },
      { title: "Use it", text: "Use the learning in real life." },
  ],
  beliefTitle: "Our belief",
  belief: "We don't just want learners to know more. We want them to think differently, understand deeply and engage with the world more meaningfully.",
  closing: "Learning human skills, one story at a time.",
};
```

**`src/content/community.ts`**

```ts
// The client's copy for the Community page and the landing page's community section (Website Copy Content sheet, October 2026).
// It is written in the future tense because the community does not exist yet: nothing here should be presented as a live feature.
export const community = {
  title: "Learning becomes more powerful when it becomes a conversation.",
  intro: [
      "Humanisse is not intended to be just a collection of comics. We want to build a community of curious learners, students, professionals, educators and organisations who believe that learning should continue beyond classrooms, degrees and training programmes.",
  ],
  introLead: "Our community will be built around a simple idea:",
  idea: "Read something. Think about it. Talk about it. Try it. Share what you discovered.",
  journeyTitle: "The Humanisse community journey",
  journey: [
      { title: "Read", text: "Members explore Humanisse comics and stories around real human situations: negotiation, resilience, empathy, decision-making, difficult conversations and more." },
      { title: "Question", text: "Every story should leave the reader with something to think about. We encourage members to challenge assumptions, ask questions and look at situations from different perspectives." },
      { title: "Discuss", text: "Humanisse becomes a space for conversation. Members can share their interpretations, experiences and alternative approaches to the situations presented in our stories." },
      { title: "Apply", text: "The real value begins when an idea moves from the page into life. Members are encouraged to experiment with what they learn—in classrooms, workplaces, teams and everyday conversations." },
      { title: "Share", text: "Members can share experiences, insights, stories and lessons from applying Humanisse concepts. Their experiences can become part of the learning journey for others." },
  ],
  whoTitle: "Who will be part of the community?",
  who: [
      { title: "Students", text: "Exploring skills that complement their academic education." },
      { title: "Young Professionals", text: "Learning to navigate the realities of work and relationships." },
      { title: "Educators", text: "Using stories and conversations to create richer learning experiences." },
      { title: "Corporate Professionals", text: "Reflecting on communication, leadership, collaboration and decision-making." },
      { title: "Leaders", text: "Sharing perspectives and experiences that can help others grow." },
      { title: "Lifelong Learners", text: "People who simply remain curious." },
  ],
  audienceTitle: "From audience to community",
  audience: "We don't want people to simply follow Humanisse. We want them to participate in Humanisse. Through discussion circles, live sessions, campus communities, workplace conversations, challenges, reflections, creator contributions and member stories, the community can gradually become a place where people learn with and from one another.",
  closingLines: ["One story can start a thought,", "One thought can start a conversation,", "One conversation can change the way we see something."],
  closingTags: ["Read.", "Question.", "Discuss.", "Apply.", "Share."],
};
```

Four small fixes were made to the client's text and are already in the blocks above, so do not "restore" them:
`experiences For Individuals` had a stray capital (now `for`), the founder quote was missing a dash before "one
story, one skill…" (now a comma), the first community step ran "human situations negotiation, resilience…"
together (now a colon after "situations"), and "Humanise" was corrected to "Humanisse" in three places.

**Left out on purpose:** the sheet's heading says "Vision / Mission / Value", but no Values were written. Do not
invent any, and do not add a Values section.

The `attribution` ("Founder, Humanisse") is the only string here that is not the client's. His name and a photo
have not been supplied for this page.

---

## 3. The new components and pages

Put the components in a new folder, `src/components/pages/`: `AboutContent.tsx`, `IdeologyContent.tsx`,
`CommunityContent.tsx` and `Pages.module.css`. Each route (`src/app/about/page.tsx`,
`src/app/learning-ideology/page.tsx`, `src/app/community/page.tsx`) is a thin server page with a `metadata`
title and renders its component, exactly like `src/app/for-campus/page.tsx` does. Titles: "About Us", "The
Learning Ideology", "Community". Follow `AudienceContent.tsx`: gold `pagehead`, then alternating `band-*`
sections, `Reveal` on cards, the existing `.pill`, `.btn`, `.capBox` and card styles (ink outline, `var(--pop)`
shadow). No new fonts, no new colours. Every band needs a heading hierarchy that makes sense to a screen reader
(one `h1`, then `h2`s).

### 3a. `/about`

1. **Page header** (`pagehead`): `h1` "About Us". The lead is `ideology.closing`, "Learning human skills, one
   story at a time." (import it from the ideology file)
2. **Vision and Mission** (`band-paper`): two large cards side by side (stacked on mobile), each with a small
   label ("Vision", "Mission") and the text large in the head font. These are the heart of the page, so make
   them feel like statements, not body copy
3. **What we do** (`band-plum`): `h2` "What we do". The intro paragraph as `lead`. Then `approachLead`
   followed by the four `approach` words as the existing `.journey` / `.journeyStep` pill row with arrows
   (the same treatment as on the landing page). Then `bringLead` and the four `pillars` as numbered cards
   in a 2x2 grid (title + text). Close with `whatWeDo.closing`, large, in a `capBox`
4. **Founder speaks** (`band-gold`): `h2` "Founder speaks". `founder.quote` as a large pull-quote
   (`<blockquote>`, with real opening and closing quote marks, which the text itself does not contain), the
   `attribution` beneath it. Then `founder.line` on its own as a second, shorter statement, visually distinct
   (a `capBox` is fine). The quote is long, so give it a comfortable measure (about 62ch) and generous line
   height. No photo, no placeholder portrait
5. **Our products** (`band-ink`): `h2` "Our products". Four cards, each a link: **Comics** (`/comics`, text:
   `about.whatWeDo.pillars[0].text`), **For Corporates** (`/for-corporates`), **For Campus** (`/for-campus`) and
   **For Individuals** (`/for-individuals`), the three audience cards using that audience's `proposition` from
   `getAudience(...)` as their text. Whole card clickable, visible focus, an arrow icon

### 3b. `/learning-ideology`

1. **Page header**: `h1` "The Learning Ideology", lead = `ideology.opening`
2. **Intro** (`band-paper`): the two `intro` paragraphs, set generously (this is the opening argument of the
   page)
3. **Philosophy** (`band-coral`): `h2` from `philosophyTitle`, then `philosophy` as the large chain of five
   step pills with arrows (reuse `.journey`), Story, Understand, Reflect, Apply, Grow
4. **The seven principles** (`band-paper`): the `principles` as numbered cards (01 to 07) in the same
   two-column card grid as the audience interventions, title in the head font, text under it. Seven is odd, so
   let the last card span both columns or sit centred, and make it look deliberate. The client's principles
   have no section heading of their own, so use the functional heading "How we think about learning" (list it
   in your report as a label you added)
5. **The learning model** (`band-plum`): `h2` from `modelTitle`, then the four `model` steps in a row, each a
   large head-font phrase ("See it", "Understand it", "Think about it", "Use it") over its sentence, joined by
   arrows, stacking on mobile
6. **Our belief** (`band-gold`): `h2` from `beliefTitle`, `belief` as one large statement
7. **Closing** (`band-ink`): `closing` large and centred with a small `Humanisse` label above, then a
   **Browse Comics** button to `/comics`

### 3c. `/community`

1. **Page header**: `h1` "Building the Humanisse Community", lead = `community.title`
2. **Introduction** (`band-paper`): `intro[0]` as a paragraph, then `introLead` and under it `idea` set big as
   a speech-bubble-style pull-line (the site already has a `.bubble` look, reuse it)
3. **The journey** (`band-plum`): `h2` from `journeyTitle`, the five steps as numbered cards. Five across at 1100px
   and up, three-plus-two below that, then two and one column, none stranded
4. **Who will be part of it** (`band-paper`): `h2` from `whoTitle`, the six groups as cards in a three-by-two grid
   (two across, then one on mobile)
5. **From audience to community** (`band-coral`): `h2` from `audienceTitle`, the paragraph as `lead`
6. **Closing** (`band-ink`): `closingLines` one per line, large, then `closingTags` as the Read. Question.
   Discuss. Apply. Share. row of five `.pill` or `.journeyStep` chips

**No sign-up form, no "Join" button, no counters, no member list.** The community does not exist yet and the
client's copy says so ("will be built"). The page describes it, it does not offer it.

---

## 4. The landing page

Re-source three sections from the content files. Keep their structure and look, change what they say and where
they link.

**`Vision.tsx`** ("Why Humanisse exists"): keep the `h2` and the Professor image. The lead paragraph becomes
`about.vision`. The `pillars` list becomes the four `about.whatWeDo.pillars` (title + text). Add a **More about
us** button (`btn`) under the list linking to `/about`. Check the four-item list still balances against the
image.

**`LearningIdeology.tsx`**: the `h2` becomes "Our learning philosophy" (`ideology.philosophyTitle`), the lead
becomes `ideology.belief`. The `journey` array becomes `ideology.philosophy` (five steps). The tabbed
`principles` become the seven from `ideology.principles` (title and text). Seven tabs must wrap
cleanly (the strip already wraps) and the panel must hold the longest text without jumping height badly, check
at 390px. Add a **Read the full learning ideology** button under the panel linking to `/learning-ideology`.

**`Community.tsx`**: the `h2` stays (it already matches the client's title, minus its full stop). The lead
becomes `community.intro[0]`. The `communityTag` line becomes `community.idea`. The `steps` array becomes the
five `community.journey` entries. `.commSteps` is `repeat(4, …)` today, so extend it to five across at wide
widths and make it wrap sensibly below that. Add an **Explore the community** button linking to `/community`.

The other landing sections (hero, the three characters, video, featured comics, audiences, FAQ, final call to
action) are not touched. The hero already uses the client's opening line.

---

## 5. Do not touch

- Comics data, the audience data, navigation, the header and footer (prompt 12 does those)
- The cart, auth, reader and Supabase code
- `legal-copy.ts`, the FAQ, `public/`, `package.json`, `next.config.ts`, `globals.css`
- Do not commit. Do not push. Do not create a branch. When done, send the `http://localhost:3000` link per `CLAUDE.md`

---

## Verification (required)

```bash
npm run lint
npx tsc --noEmit
npm run build
```

All three clean. Then in `npm run dev`:

**`/about`**
- [ ] Vision and Mission match the client's text, and no Values section exists
- [ ] "What we do" shows the intro, the four-word approach chain, the four pillars and the closing line
- [ ] The founder quote shows real quotation marks, reads comfortably, has the "Founder, Humanisse" attribution
      and no photo
- [ ] Four product cards link to `/comics`, `/for-corporates`, `/for-campus`, `/for-individuals`

**`/learning-ideology`**
- [ ] Opening line, intro, five-step chain, seven numbered principles, four-step model, belief and closing are
      all present and in that order
- [ ] The seventh card looks deliberate, not orphaned

**`/community`**
- [ ] Five journey steps, six groups, the audience paragraph and the closing lines, with no form or join button
- [ ] The five-step grid never strands a card at any width

**Landing page**
- [ ] The vision section shows the vision statement and four pillars, and its button reaches `/about`
- [ ] The philosophy section has five steps, seven tabs that wrap cleanly at 390px, and a working link
- [ ] The community section has five steps and a working link
- [ ] Nothing else on the landing page changed

**All pages**
- [ ] No horizontal scroll at 1440, 1280, 1024, 768 and 390
- [ ] Each page has one `h1`, a sensible heading order and visible keyboard focus
- [ ] Reduced motion leaves everything visible
- [ ] Spot-check five strings per page against the blocks in section 2: no word changed
- [ ] "Humanise" (single s) appears nowhere

---

## Note for the human

**The sheet is missing things.** "Vision / Mission / Value" has no Values, and there is no founder name or
photo. I have left both out rather than invent them. His name is in the proposal (Kollath George), but whether he
wants to be named on this page, and as "Founder" or "Proprietor", is his call.

**"Our Products" in the sheet lists "For Institutions" and "For Campuses" separately.** I read the first as the
Corporate page and used the three tab names (For Corporates, For Campus, For Individuals). Please confirm with
George that there is no fourth audience.

**The seven principles have no heading in the sheet.** I added "How we think about learning" so the section is
not nameless. Swap it if he has a preferred line.

**Community.** The copy describes something that is yet to be built, and the page deliberately does not offer a
way to join. If George wants an interest or waiting-list form, that is a separate piece of work and an email
tool, not something to improvise here.
