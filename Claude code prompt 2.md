# CLAUDE CODE PROMPT 2: MOVE THE ABOUT US STAT CARDS INTO THE EMPTY RIGHT COLUMN

Repo: `Sitesmith-X-Humanisse`. Written 2026-09-21. Follows on from `Claude code prompt 1.md`,
which is already applied — the About Us section, the legal dialogs, the cart and the character
selector fix are all in place.

---

## 0. The problem

The About Us section currently stacks vertically: kicker, big statement, prose, then the three
stat cards in a full-width row underneath.

The statement and the prose are both width-capped (`.big` at `24ch`, `.aboutCopy` at `62ch`),
so on any screen above roughly 1100px the entire right-hand half of the section is empty paper.
The result reads like a magazine article rather than a landing page, and the stat cards are
pushed so far down they compete with the comic shelf below instead of supporting the copy.

**The fix:** put the prose and the stat cards side by side. Prose on the left, the three cards
stacked in a column on the right, filling the dead space.

Do not change the copy, the card figures, the labels, the hint text, the destinations or the
card colours. This is a layout change only.

---

## 1. Restructure the markup

**File:** `src/components/landing/AboutUs.tsx` (lines 22–43)

Keep the kicker (line 23) and the `WordReveal` statement (line 24) exactly as they are, full
width, at the top of the section.

Wrap the existing `<Reveal className={styles.aboutCopy}>` block (lines 25–30) and the existing
`<Reveal delay={0.08}>` stats block (lines 31–43) together inside a new two-column grid
container, e.g. `<div className={styles.aboutGrid}>`.

Structure after the change:

```
section#about
  div.wrap.about
    h2.kicker                     ← unchanged, full width
    WordReveal.big                ← unchanged, full width
    div.aboutGrid                 ← NEW
      Reveal.aboutCopy            ← existing prose, left column
      Reveal                      ← existing ul.stats, right column
    nav.legalRow                  ← unchanged, stays below the grid
```

The `<ul className={styles.stats}>` and its `<li>` / `.statCard` / `.statNum` / `.statLabel` /
`.statHint` internals stay exactly as they are. Only the container around them changes.

Leave the `legalRow` nav (lines 44–48) where it is, below the grid, still right-aligned with
its top border running the full width.

---

## 2. The grid

**File:** `src/components/landing/Landing.module.css` (ABOUT US block, lines 36–56)

Add `.aboutGrid` as a two-column grid:

- Columns roughly `1.15fr` for the prose and `0.85fr` for the cards — the prose should stay the
  wider of the two, but the cards need enough width that the hint line does not wrap
- Column gap around `56px`, aligned to `start`
- `.aboutCopy` keeps its `62ch` cap but its `margin-bottom: 44px` (line 40) must go, since the
  grid gap now handles the spacing

Change `.stats` (line 43) from a three-column grid to a **single column** so the cards stack
vertically in the right-hand column:

- `grid-template-columns: 1fr`
- `grid-auto-rows: auto` rather than `1fr`, so each card sizes to its own content
- gap around `16px`
- remove the `max-width: 820px`, which was sized for the old full-width row

Because the cards are now narrow and stacked, reflow `.statCard` from a plain vertical stack
into a compact arrangement that reads well at that width:

- The number (`.statNum`) and the label (`.statLabel`) sit on one baseline-aligned row, number
  first, label beside it — not the number above the label as now
- Drop `.statNum` a size, to about `clamp(2.2rem, 3.2vw, 2.8rem)`, so a stacked card is not
  disproportionately tall
- The hint line (`.statHint`) stays on its own row beneath, with its existing hover and focus
  treatment (opacity, gap widening, underline) untouched
- Tighten the padding slightly, around `18px 22px`

Keep every existing colour rule (lines 47–49) and the hover transform and shadow (line 46)
exactly as they are.

---

## 3. Give the column a bit of comic-page character

Still in `Landing.module.css`. The point is to stop the right column reading as a plain list of
boxes. Keep it subtle — this is a supporting element, not a feature.

Apply a small alternating horizontal offset and rotation to the three cards, in the spirit of
the `.capBox` rotation already used in `globals.css`:

- Card 1: no offset, rotate about `-0.8deg`
- Card 2: inline-start offset of roughly `24px`, rotate about `0.6deg`
- Card 3: no offset, rotate about `-0.5deg`

On hover and focus the card should straighten to `rotate: 0deg` as it lifts, using the existing
transition on line 45.

**Guards:**
- The rotation must be removed entirely inside `@media (prefers-reduced-motion: reduce)`, added
  to the existing block at line 161
- The offsets must be removed at the 900px breakpoint, where the grid collapses

---

## 4. Responsive behaviour

**File:** `Landing.module.css`, the `@media (max-width: 900px)` block at lines 150–159.

At 900px and below:

- `.aboutGrid` collapses to a single column with a gap around `36px`, so the prose sits above
  the cards exactly as it does today
- `.stats` returns to a **three-column row** — `repeat(3, minmax(0, 1fr))` with `grid-auto-rows:
  1fr` and the existing `gap: 12px` on line 156 — since a full-width row is the better shape
  once the cards are no longer in a side column
- `.statCard` returns to its current vertical arrangement: number above label
- Card offsets and rotations are cleared

At 560px and below, add a rule so `.stats` becomes a single column again — three cards side by
side on a phone squeezes the labels too hard. Keep the compact horizontal card arrangement from
section 2 at this size, since each card is full width there.

---

## 5. Do not touch

- The About Us copy, the kicker text, or the `WordReveal` statement string
- The stat figures, labels, hint text or `href` destinations in `AboutUs.tsx` lines 12–16
- The three card background colours and text colours (lines 47–49)
- `DocDialog.tsx`, `legal-copy.ts`, or the `legalRow` nav
- Anything under `src/components/cart/`, `src/app/cart/`, or `CharacterHero.tsx`
- `src/content/comics.ts`, `public/`, `next.config.ts`, `package.json` — **no new dependencies**
- Do not commit. Do not push. Do not create a branch.

---

## Verification (required)

```bash
npm run lint
npx tsc --noEmit
```

Both must produce zero output. Then check by hand in `npm run dev`:

- [ ] At 1440px, the prose sits left and the three cards sit in a column on the right, with no
      large empty area of paper to the right of the text
- [ ] The big statement and the kicker still run full width above the grid
- [ ] The cards keep gold, coral, plum in that order, top to bottom
- [ ] Each card's number and label read comfortably on one row, and the hint line does not wrap
- [ ] Hover and focus on a card still lifts it, straightens the rotation, and strengthens the
      hint with its underline and widened gap
- [ ] All three destinations still work: `/comics`, `/#video-intro`, `/#characters`
- [ ] Keyboard tab order is prose, then card 1, 2, 3, then T&C, Legal, FAQ
- [ ] At 1100px nothing overlaps and the hint lines still fit on one line
- [ ] At 900px the grid collapses, prose above, cards in a three-across row, no rotation or
      offsets
- [ ] At 560px the cards stack to one column and stay legible
- [ ] The `legalRow` still sits below everything, right-aligned, with its full-width top border
- [ ] With `prefers-reduced-motion: reduce` set in devtools, the cards have no rotation at all
      and the section still reads correctly

---

## Note for the human

The arrangement I have specified is prose-left, cards-stacked-right. The alternative worth a
look if it feels too heavy is putting the cards in the right column but letting the prose run
full width beneath them, so the cards sit beside the *statement* rather than beside the
paragraphs. That fills the same dead space higher up the section and gives the copy more room,
but it separates each card from the text that explains it. Easy to try once this version is on
screen — it is a change to which children go inside the grid, nothing more.

Still outstanding from prompt 1, unchanged: the card-to-page transition animation needs its
approach decided (View Transitions API versus Motion shared layout, with a Firefox fallback),
the 3D character bundle weight is worth putting to the client, and `src/design/tokens.ts` is
still dead code duplicating the `:root` colours in `globals.css`.
