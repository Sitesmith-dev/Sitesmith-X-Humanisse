# CLAUDE CODE PROMPT 10: THE CLIENT'S COPY FOR CORPORATES, CAMPUS AND INDIVIDUALS

Repo: `Sitesmith-X-Humanisse`. Written 2026-10-12. Follows prompts 1–9. **Part 2 of 4** of the client-copy work.
Prompt 9 (the ten comics) should already be applied.

## 0. Rules for client copy (the same rules as prompt 9, repeated because you may not have prompt 9 in front of you)

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

**Note on this prompt's scope:** unlike prompt 9, this one is expected to replace `src/content/audiences.ts`.

---

## 1. What this prompt does

Replaces the placeholder copy on the three audience pages (`/for-corporates`, `/for-campus`, `/for-individuals`)
with the client's, and gives each page the extra material the client wrote: a short introduction, a fuller list
of interventions, a month-by-month programme (a "personal journey" for individuals) and a closing line.

The client's three pages are noticeably richer than the placeholders:

| | Interventions | Programme / journey |
| --- | --- | --- |
| Corporates | 9 (was 4) | 90-day programme: Communicate, Decide, Adapt & Influence |
| Campus | 7 (unchanged count, new wording) | Campus journey: Connect, Think, Grow |
| Individuals | 6 (was 5) | Personal journey: Explore, Reflect, Understand, Apply |

**Two things in the source needed fixing, already done in the data below:** the campus and individuals text
was split across two spreadsheet rows (it has been rejoined), and three campus items and one individuals item
open with a statement rather than a question, so their `question` field holds that statement (no question mark),
as the old data did.

Read before starting: `src/content/audiences.ts`, `src/components/landing/AudienceContent.tsx`,
`AudienceSection.tsx`, `Landing.module.css` (look at `.principles`, `.principleCard`, `.audNum`, `.audQuestion`,
`.audListTitle`, `.audTab`, `.audKicker`, `.audProp`), `src/app/for-corporates/page.tsx`, `for-campus/page.tsx`,
`for-individuals/page.tsx`, and `src/components/shared/Motion.tsx` (`Reveal`).

---

## 2. The content

**File:** `src/content/audiences.ts` — replace the whole file with this. Generated from the spreadsheet; do not
edit the strings.

```ts
// The client's copy for the three audience pages (Website Copy Content sheet, October 2026).
// The landing page's audience tabs read `label`, `kicker`, `proposition` and the first three `interventions`.
export type Intervention = { title: string; question: string; text: string };
export type JourneyStep = { label?: string; title: string; text?: string; topics?: string[] };

export type Audience = {
  slug: string;
  /** Short name used on the landing page tabs */
  label: string;
  /** The client's small heading above the proposition, for example "The Humanisse Corporate Proposition" */
  kicker: string;
  /** The page's main heading */
  proposition: string;
  /** Introductory paragraphs under the heading, in order */
  intro: string[];
  interventionsTitle: string;
  interventions: Intervention[];
  journey: { title: string; steps: JourneyStep[]; note?: string };
  /** The sign-off, one sentence per entry */
  closing: string[];
};

export const audiences: Audience[] = [
  {
    slug: "for-corporates",
    label: "Corporates",
    kicker: "The Humanisse Corporate Proposition",
    proposition: "Your organisation has invested in what people know. What about how they behave?",
    intro: [
      "Business performance is shaped not only by knowledge and expertise, but by how people communicate, handle disagreement, respond to setbacks, make decisions and work with others.",
      "Humanisse brings these human dimensions into professional development through comics, workplace scenarios, reflective exercises and facilitated conversations turning familiar workplace situations into structured learning experiences.",
    ],
    interventionsTitle: "Humanisse corporate interventions",
    interventions: [
      { title: "First-Time Managers", question: "A promotion changes your designation. Does it change the way you lead?", text: "Develop communication, emotional intelligence, feedback, delegation and difficult-conversation skills." },
      { title: "Team Collaboration", question: "Your teams are working together. But are they understanding each other?", text: "Explore listening, trust, empathy, negotiation and conflict resolution." },
      { title: "Difficult Conversations", question: "What is the cost of the conversation nobody wants to have?", text: "Practise handling disagreement, feedback and emotionally challenging situations." },
      { title: "Early-Career Talent", question: "They arrive with qualifications. Are they prepared for workplace realities?", text: "Build professional communication, resilience, problem-solving, listening and emotional intelligence." },
      { title: "Decision-Making", question: "When everyone has the same information, what makes the difference in a decision?", text: "Examine assumptions, alternatives, risk and judgment through decision-based scenarios." },
      { title: "Negotiation & Influence", question: "Are your people negotiating positions or understanding interests?", text: "Explore persuasion, empathy, bargaining, trust and stakeholder management." },
      { title: "Resilience & Adaptability", question: "When plans fail, what helps your people find their next move?", text: "Develop constructive responses to setbacks, uncertainty and change." },
      { title: "Storytelling & Communication", question: "Your employees have valuable ideas. Can they make others see their value?", text: "Strengthen narrative thinking, presentations and persuasive communication." },
      { title: "Ethics & Responsible Leadership", question: "When a decision is commercially attractive, who asks whether it is responsible?", text: "Explore ethical dilemmas, stakeholder interests and responsible choices." },
    ],
    journey: {
      title: "The Humanisse 90-day programme",
      steps: [
        { label: "Month 1", title: "Communicate", topics: ["Active Listening", "Difficult Conversations", "Emotional Intelligence"] },
        { label: "Month 2", title: "Decide", topics: ["Problem Solving", "Decision Sciences", "Negotiation"] },
        { label: "Month 3", title: "Adapt & Influence", topics: ["Resilience", "Storytelling", "Ethics & Sustainability"] },
      ],
      note: "The programme combines digital comics, Professor-led videos, facilitated discussions, reflection and workplace application.",
    },
    closing: ["Stories that start conversations.", "Conversations that shape capability."],
  },
  {
    slug: "for-campus",
    label: "Campus",
    kicker: "The Humanisse Campus Proposition",
    proposition: "Your students are learning for a degree. Are they also learning for the world beyond it?",
    intro: [
      "Universities and campuses are expected to develop more than academic knowledge. Students need to learn how to communicate, collaborate, make decisions, handle disagreements, adapt to setbacks and navigate professional relationships.",
      "Humanisse brings these capabilities into campus life through comics, stories, scenarios, Professor-led videos and interactive learning experiences.",
    ],
    interventionsTitle: "Humanisse campus interventions",
    interventions: [
      { title: "Student Development", question: "What happens when knowledge meets real-life situations?", text: "Build capabilities in negotiation, emotional intelligence, resilience, problem-solving, decision-making, listening and communication." },
      { title: "Classroom Engagement", question: "What if a class began with a situation instead of a definition?", text: "Use Humanisse comics as discussion starters for debates, case analysis, role plays and reflection." },
      { title: "First-Year & Induction Programmes", question: "Students enter with qualifications. Are they ready for campus and professional life?", text: "Introduce communication, collaboration, confidence, listening and interpersonal skills from the beginning." },
      { title: "Placement Readiness", question: "Can students handle the conversations behind the interview?", text: "Prepare students for negotiation, storytelling, professional communication, difficult conversations and workplace situations." },
      { title: "Leadership & Student Clubs", question: "Leadership begins long before the first job title.", text: "Use stories and scenarios to explore influence, teamwork, empathy, decision-making and responsible leadership." },
      { title: "Faculty Facilitation", question: "Give faculty another way to open a conversation.", text: "Provide comics and structured learning resources that can complement existing teaching and student-development activities." },
      { title: "Beyond the Classroom", question: "Learning shouldn't stop when the lecture ends.", text: "Use Humanisse for libraries, student clubs, workshops, mentoring, finishing-school programmes and campus campaigns." },
    ],
    journey: {
      title: "The Humanisse campus journey",
      steps: [
        { label: "Month 1", title: "Connect", topics: ["Active Listening", "Emotional Intelligence", "Difficult Conversations"] },
        { label: "Month 2", title: "Think", topics: ["Critical Reading", "Problem Solving", "Decision Sciences"] },
        { label: "Month 3", title: "Grow", topics: ["Negotiation", "Resilience", "Storytelling"] },
      ],
      note: "The programme can combine digital comics, Professor-led videos, classroom discussions, activities, reflection and student projects.",
    },
    closing: ["Stories students can enter.", "Questions they can explore.", "Capabilities they can carry into the world."],
  },
  {
    slug: "for-individuals",
    label: "Individuals",
    kicker: "The Humanisse Personal Proposition",
    proposition: "You invest in your career, your knowledge and your skills. But how often do you invest in the way you think, communicate and respond?",
    intro: [
      "Some of the most important skills in life are rarely taught through a textbook. How to handle a difficult conversation. How to negotiate. How to recover from setbacks. How to listen. How to make decisions when the answer isn't obvious.",
      "Humanisse brings these everyday challenges to life through comics, stories, Professor-led videos and reflective learning experiences.",
    ],
    interventionsTitle: "Humanisse for individuals",
    interventions: [
      { title: "Career Growth", question: "Technical expertise may get you noticed. What helps you grow?", text: "Explore negotiation, communication, storytelling, decision-making, leadership and influence." },
      { title: "Better Conversations", question: "Are you saying what you mean and understanding what others mean?", text: "Develop active listening, empathy, emotional intelligence and difficult-conversation skills." },
      { title: "Better Decisions", question: "What influences the choices you make?", text: "Explore cognitive biases, problem solving, critical thinking and decision-making through relatable situations." },
      { title: "Resilience & Personal Growth", question: "When things don't go according to plan, what do you do next?", text: "Understand setbacks, emotional responses, adaptability and ways of approaching challenges constructively." },
      { title: "Student & Early-Career Learning", question: "Your qualification is one part of your journey. What comes next?", text: "Build practical capabilities for interviews, workplaces, relationships and professional situations." },
      { title: "Lifelong Learning", question: "Learning doesn't have to stop when formal education ends.", text: "Explore one human capability at a time, at your own pace, through accessible and engaging stories." },
    ],
    journey: {
      title: "The Humanisse personal journey",
      steps: [
        { title: "Explore", text: "Discover a situation you recognise." },
        { title: "Reflect", text: "Ask yourself what you would do." },
        { title: "Understand", text: "Explore the ideas behind the situation." },
        { title: "Apply", text: "Take the learning into your work and everyday life." },
      ],
    },
    closing: ["A story to read.", "A question to consider.", "A skill to carry with you."],
  },
];

export const getAudience = (slug: string) => audiences.find((a) => a.slug === slug);
```

Changes from the old shape, in case you need to update a consumer: `summary` is gone (now `intro[]`),
`journeyTitle` and the unused `journey: string[]` are gone (now `interventionsTitle` and `journey: {…}`),
`closing` and `interventionsTitle` are new. The only other consumer is `AudienceSection.tsx`, which reads
`label`, `kicker`, `proposition`, `slug` and `interventions`, and keeps working as is.

---

## 3. The audience page

**Files:** `src/components/landing/AudienceContent.tsx` (shared by all three pages), `Landing.module.css`.
Extend the existing patterns, do not introduce a new visual language.

### 3a. Page header (the gold `pagehead`)

- Kicker: `audience.kicker`, in the existing `.demo` pill
- `h1`: `audience.proposition`
- First intro paragraph as the existing `lead`, the second as a normal paragraph directly under it
  (`.pagehead .lead` is already ink on gold, so check the second paragraph's colour matches)
- **Delete** the "Preview — This is sample copy for review" notice. This is real copy now

### 3b. Interventions (the existing paper band)

Same as today: `h2` from `interventionsTitle`, then the numbered `.principleCard` grid (number, title, question
in bold, text). There are now 9, 7 and 6 cards in a two-column grid, so check the last row looks intentional at
every width and does not strand one card awkwardly. The "See the comics behind this" button **moves** to the
closing band (3d).

### 3c. The programme or journey (new band)

A new band after the interventions, `band band-ink` (the paper band above it needs a dark contrast, and ink
already appears on the landing page's audience section). Heading from
`journey.title`, styled like `.audListTitle` but light on the dark band.

Then the steps as cards in a row (three across for the Corporate and Campus months, four across for the Individuals journey,
stacking to two and then one column as the width shrinks), each using the existing card language (ink outline, hard
shadow, `Reveal` entrance):

- If the step has a `label` ("Month 1"): a small label chip above the title
- The `title` large, in the head font ("Communicate", "Connect")
- If it has `topics`: render each as a `.pill` in a wrapping row (Active Listening, Difficult Conversations,
  Emotional Intelligence). Do not join them with plus signs, the client's "+" was shorthand for a list
- If it has `text` (the Individuals steps): the sentence under the title
- Number the Individuals steps 01 to 04, like the interventions

If `journey.note` exists, show it as a paragraph beneath the cards, on the dark band, in `lead` style.

### 3d. Closing band

A final band, `band band-gold` (the same family as `FinalCTA` in `Sections.tsx`), centred or left-aligned to
match it:

- A small `Humanisse` label, then `closing` printed **one sentence per line**, large, in the head font
  ("Stories that start conversations." on one line, "Conversations that shape capability." on the next)
- Under it the existing **See the comics behind this** button, linking to `/comics`

---

## 4. Names and metadata

- The audience labels are now **Corporates**, **Campus**, **Individuals** (the client's tab names are "For
  Corporates", "For Campus", "For Individuals"). The Campus label used to read "Institutions". That flows to the
  landing page tabs automatically, and "Explore campus" on the button is correct
- Page titles: `for-corporates` becomes "For Corporates", `for-campus` becomes "For Campus" (it said "For
  Institutions"), `for-individuals` becomes "For Individuals". Check each page's `metadata` export
- Check the landing page's audience section still looks right with the longer propositions (two sentences now)
  and the longer kickers. Adjust only `AudienceSection`'s styles if something overflows, not its content

---

## 5. Do not touch

- The other landing sections, the comics and the cart, auth and reader code
- `legal-copy.ts`, the FAQ copy, `public/`, `package.json`, `next.config.ts`, `globals.css`
- The comic data from prompt 9
- Do not commit. Do not push. Do not create a branch. When done, send the `http://localhost:3000` link per `CLAUDE.md`

---

## Verification (required)

```bash
npm run lint
npx tsc --noEmit
npm run build
```

All three clean. Then in `npm run dev`, for **each** of `/for-corporates`, `/for-campus`, `/for-individuals`:

- [ ] The kicker, heading and both intro paragraphs match the client's text exactly
- [ ] There is no "Preview" or "sample copy" notice
- [ ] The interventions count is 9 / 7 / 6, each with number, title, bold question and text
- [ ] The programme band shows 3 months (Corporates, Campus) or 4 steps (Individuals), with topics as pills and
      no plus signs
- [ ] The Corporate and Campus notes ("The programme combines…" / "The programme can combine…") appear
      under the cards, and the Individuals page has no note
- [ ] The closing band prints one sentence per line, and the "See the comics behind this" button works
- [ ] No horizontal scroll and no stranded or clipped card at 1440, 1280, 1024, 768 and 390
- [ ] Reduced motion: everything is visible and nothing is stuck mid-animation

**Landing page**
- [ ] The audience tabs read Corporates, Campus, Individuals, each panel shows the new proposition, kicker and
      three interventions, and "Explore …" goes to the right page
- [ ] Nothing in that section overflows on mobile

**Text fidelity**
- [ ] Spot-check three interventions per page against the blocks in section 2: no word changed
- [ ] "Humanise" (single s) appears nowhere on these pages

---

## Note for the human

**Check what the client means by "Institutions".** In the sheet's "Our Products" list he writes "For
Institutions" and then "For Campuses" as separate entries, but his tab list only has Corporates, Campus and
Individuals. The Campus page used to be labelled "Institutions" on the old site. I have treated the tab list as
correct and used "Campus". Worth one line to George to confirm there is no fourth audience.

**These pages are now much longer.** Nine interventions and a programme is a lot of scrolling on a phone. That is
the client's content and it is all there, but if the walkthrough feels heavy, the first thing to cut is how
many interventions show before a "show more", and I can write that up.

**Placeholder markers.** The "sample copy" notice is gone because the copy is real. If George has not formally
approved this wording, you may prefer to keep it until he has.
