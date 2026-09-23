# CLAUDE CODE PROMPT 5: BUILD THE COMIC READER — TWO-PAGE BOOK SPREAD WITH A VIEWER TOOLBAR

Repo: `Sitesmith-X-Humanisse`. Written 2026-09-22. Follows prompts 1–4, all applied and on
`feature/comics-and-storefront-updates`.

**Scope note: this is the reader experience only.** No watermarking, no signed delivery, no
entitlement checks, no session control, no copy or right-click deterrents. Those come in a later
prompt. Do not add any of them here, and do not add placeholder hooks for them either.

---

## 1. What to build

A full-screen reader at a new route, opened from a comic, laid out like an open book: two pages
side by side, left and right. Above the pages, a viewer toolbar in the spirit of a desktop PDF
viewer — a sidebar toggle with a view-mode menu, page position, zoom controls, and a clear close
button.

The attached reference screenshot is a macOS Preview window. **Use it for the shape and grouping
of the toolbar only.** Do not copy its styling, its icons, its menu wording or its grey chrome.
The reader must look like Humanisse: paper, ink, gold, the thick outlines and hard offset shadows
already in `globals.css`.

---

## 2. Page data

**Files:** `src/types/comic.ts`, `src/content/comics.ts`

Add to the `Comic` type:

```ts
/** Reading pages in order. `src` is empty until the client supplies real artwork. */
pages: { id: string; src?: string }[];
```

Give **`negotiation` four entries** with ids but no `src` — these are the test pages. Give every
other comic an empty array.

A comic with an empty `pages` array must not offer a way into the reader, and hitting its reader
URL directly should show a short "not available yet" state with a link back to the comic, not a
crash and not a 404.

---

## 3. Placeholder pages

**New file:** `src/components/reader/ReaderPagePlaceholder.tsx`

No image files. Do not add anything to `public/`. Render each placeholder page as a styled
comic page in the same spirit as `ComicCover`'s existing placeholder: a paper background, a
panel grid of two or three panels with thick ink borders, one or two speech-bubble shapes using
the existing `.bubble` treatment, halftone dots, and the page number set large and faint in a
corner. Vary the panel arrangement by page index so the four pages are visibly different from
one another.

Each placeholder carries a small `Placeholder page` label so nobody in a walkthrough mistakes it
for artwork.

When `src` is present the reader renders the real image instead, via `next/image`, with the
placeholder as the fallback. Real artwork will land later; the component must already handle it.

---

## 4. The route

**New files:** `src/app/read/[slug]/page.tsx`, `src/app/read/[slug]/layout.tsx`,
`src/components/reader/Reader.tsx`, `src/components/reader/Reader.module.css`

Route: `/read/[slug]`.

The reader takes the whole viewport. The site header and footer must **not** appear — give the
route its own `layout.tsx` that renders only `{children}`, so it escapes the chrome from the root
layout.

The page resolves the comic from the slug, and passes it to a `Reader` client component.

---

## 5. The toolbar

One row across the top of the reader, on the site's paper background with an ink bottom border.
Left group, centre group, right group.

### Left — sidebar toggle and view menu
A single button with a panel icon and a chevron, matching the reference's leftmost control. It
opens a dropdown menu containing two groups separated by a divider:

**Group one — what the sidebar shows**
- `Hide sidebar`
- `Thumbnails` (checkable, default on)
- `Contact sheet` (checkable)

**Group two — how pages are laid out** (a single-choice group, exactly one ticked)
- `Single page`
- `Two pages` — **the default**
- `Continuous scroll`

Ticks must be real state, shown with a check glyph on the active item, and the group behaviour
must be correct: the layout group is single-choice, the sidebar group is not.

Implement the menu as a proper accessible menu — `aria-haspopup`, `aria-expanded`, roving focus
with arrow keys, `Escape` closes and returns focus to the trigger, click outside closes. Do not
use a native `<select>`.

### Centre — position and zoom
- The comic title, and beneath or beside it `Pages 4–5 of 24`, matching the reference's
  "Page 4 of 131" but pluralised correctly for spreads and singular in single-page mode
- Zoom out, zoom to fit, zoom in — three buttons, as in the reference
- Zoom steps between about 50% and 300%; `Zoom to fit` returns to fitting the spread in the
  viewport

### Right — fullscreen and close
- A fullscreen toggle using the Fullscreen API
- **Close** — the clearest control on the bar. An `×` with the visible word `Close` beside it,
  not a bare glyph. It must be unmistakable and must not sit adjacent to any destructive or
  similar-looking control

---

## 6. The spread

**Two pages means a real book, not two arbitrary pages side by side.** Get the pairing right:

- Page 1 sits **alone on the right**, as a cover does when you open a book
- Then 2–3, 4–5, 6–7 and so on
- If the final page lands alone it sits **alone on the left**

Render the two pages as one spread with a visible gutter between them — a subtle inner shadow on
each facing edge sells the book far better than a plain gap. Give the whole spread the site's ink
border and a hard offset shadow, floating on a darker reading surface so the pages stand out.

The spread scales to fit the available height by default, and never overflows the viewport
horizontally at default zoom.

### The other two modes
- **Single page** — one page centred, same chrome, page counter reads `Page 4 of 24`
- **Continuous scroll** — pages stacked vertically with a gap, scrolling naturally, the counter
  tracking whichever page occupies most of the viewport

These two are secondary. Build them so the menu is honest, but the two-page spread is what gets
the polish.

---

## 7. Navigation

- Previous and next spread controls on the left and right edges of the reading area, large,
  appearing on hover and always present on touch
- Keyboard: `←` and `→` move a spread, `Home` and `End` jump to first and last, `f` toggles
  fullscreen, `Escape` exits fullscreen if in it, otherwise closes the reader
- Swipe left and right on touch
- Clicking the left or right third of the spread turns the page in that direction; clicking the
  middle third does nothing, so a reader can tap to zoom later without conflict
- Disable the previous control on the first spread and next on the last, do not wrap around

A page turn should animate briefly — a short slide and fade, around 200ms on the site's existing
easing. Do not build a page-curl effect.

---

## 8. The sidebar

Down the left, matching the reference's position. Toggled from the menu, open by default on wide
screens, closed below 1100px.

- **Thumbnails** — a vertical strip of page thumbnails, each numbered, the current spread's pages
  highlighted with the gold accent. Clicking one jumps to that spread. The strip scrolls the
  current page into view when the spread changes
- **Contact sheet** — the same thumbnails in a grid instead of a column, for scanning a whole
  comic at once

---

## 9. Closing

**Close returns the reader to the page the user came from.** Use `router.back()`.

If there is no history to go back to — the reader URL was opened directly or shared — fall back
to `/comics/[slug]`, so the user always lands somewhere sensible rather than on a dead end.

---

## 10. Entry point for testing

**File:** `src/components/comics/ComicPanel.tsx` (around line 31, beside `BuyPanel`)

Add a **`Preview` button** to the comic view, shown only when that comic has pages. It opens
`/read/[slug]`. Label it `Preview` with a book or eye icon, and place it clearly separated from
Buy now and Add to cart so it is never mis-clicked.

Since only `negotiation` has pages, it is the only comic that will show the button — that is
correct and is the test path.

The button must work from **both** the pop-up and the standalone comic page. Note that the
pop-up's `ComicModal` makes the background inert and traps focus; opening the reader is a real
navigation away from `/comics/[slug]`, so check that the pop-up releases the body scroll lock and
the `inert` attributes properly on the way out, and that returning with Close restores the page
the user came from.

---

## 11. Reduced motion and responsiveness

Under `prefers-reduced-motion: reduce`, page turns and the toolbar menu open instantly with no
slide or fade, and the reader stays fully usable.

- **Below 1100px** the sidebar starts closed
- **Below 820px** the reader drops to single-page layout regardless of the menu setting, because
  two pages on a narrow screen is unreadable. Keep the menu item visible but clearly disabled
  with a short note explaining why
- No horizontal page scroll at any width. Check 1440, 1280, 1024, 768 and 390

---

## 12. Do not touch

- **Anything to do with protection** — no watermark, no signed URLs, no entitlement check, no
  device session, no copy or right-click blocking. That is a later prompt
- `public/` — no new image assets, the placeholder pages are drawn in code
- The cart store, `BuyPanel`'s existing buttons, `ComicsHero`, `AboutUs`, `DocDialog`
- `ComicModal.tsx`'s pop-up and expand behaviour, beyond verifying the exit path in section 10
- Titles, prices, taglines, descriptions in `src/content/comics.ts` — add `pages`, edit nothing
  else
- `next.config.ts`, `package.json` — **no new dependencies**. `motion/react` and `lucide-react`
  cover everything here
- Do not commit. Do not push. Do not create a branch.

---

## Verification (required)

```bash
npm run lint
npx tsc --noEmit
```

Both must produce zero output. Then, in `npm run dev`:

**Getting in and out**
- [ ] The Negotiation comic shows a Preview button; the other nine do not
- [ ] Preview opens `/read/negotiation` full screen with no site header or footer
- [ ] Close returns to the exact page the reader was opened from, pop-up or standalone
- [ ] Opening `/read/negotiation` directly in a new tab works, and Close falls back to the comic
- [ ] `/read/ethics` shows the not-available state, not a crash or a 404

**The spread**
- [ ] Default view is two pages side by side, looking like an open book with a visible gutter
- [ ] Page 1 sits alone on the right; pages then pair 2–3, 4–5
- [ ] The spread fits the viewport height with no horizontal scroll at default zoom
- [ ] The four placeholder pages are visibly different from each other and labelled as placeholders

**Toolbar**
- [ ] The view menu opens, shows ticks against `Thumbnails` and `Two pages`, and the layout group
      is single-choice
- [ ] Switching to Single page and Continuous scroll both work and the page counter follows
- [ ] Zoom in, out and fit all work; fit restores the spread to the viewport
- [ ] The page counter reads `Pages 2–3 of 4` in spread mode and `Page 2 of 4` in single mode
- [ ] Fullscreen toggles, and Escape leaves fullscreen rather than closing the reader
- [ ] Close shows the word Close, not just an ×

**Navigation**
- [ ] Arrow keys, edge controls, swipe and left/right click zones all turn pages
- [ ] Clicking the middle of the spread does nothing
- [ ] Previous is disabled on the first spread, next on the last, no wrap-around
- [ ] `Home` and `End` jump to the first and last spread

**Sidebar**
- [ ] Thumbnails highlight the current spread's pages and clicking one jumps there
- [ ] Contact sheet shows the same pages as a grid
- [ ] Hide sidebar works and the reading area reflows to use the space

**Responsive and motion**
- [ ] Below 1100px the sidebar starts closed
- [ ] Below 820px the layout forces single page and the Two pages menu item is disabled with a note
- [ ] No horizontal scroll at 1440, 1280, 1024, 768 or 390
- [ ] With `prefers-reduced-motion: reduce`, page turns are instant and nothing is stuck mid-transform

---

## Note for the human

**Two pages is provisional and you should treat it that way.** You asked for it to test, and it
is the right thing to build first because it is the hardest layout and it proves the toolbar. But
whether it is the right *default* for Humanisse depends entirely on artwork nobody has seen yet.
If the pages turn out to be drawn as single portrait pages rather than spreads, a two-up view
halves the size of each one for no benefit — and most of the actual readers are children on
phones, where two pages will never be shown at all. The 820px rule in section 11 means the phone
experience is already single-page regardless.

**The placeholder pages will flatter the reader.** Four clean CSS panels with plenty of white
space will scale and pair beautifully. Real comic pages are denser, have their own margins, and
may not share a consistent aspect ratio — which is exactly what breaks spread layouts. Ask George
for one complete comic, not a sample page, before you commit to this being finished.

**Worth deciding before the next prompt:** where the teaching video sits. The natural slot is a
screen after the final page — finish the comic, the Professor explains what you read — which also
gives you a clean completion event for the library's progress rings. Nothing in this prompt builds
it, but if that is the plan, the reader should know the video exists so the last spread can lead
into it rather than just stopping.

Still outstanding: protection entirely, the 3D character bundle weight, and `src/design/tokens.ts`
remains dead code duplicating the `:root` colours in `globals.css`.
