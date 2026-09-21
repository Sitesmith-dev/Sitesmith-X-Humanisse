# CLAUDE CODE PROMPT 4: DECLUTTER THE STOREFRONT CARDS, AND OPEN COMICS AS AN EXPANDABLE POP-UP

Repo: `Sitesmith-X-Humanisse`. Written 2026-09-21. Follows prompts 1, 2 and 3, all applied.

This is the largest change so far. Read section 2 before writing any code — the architecture
decision there is what makes the rest simple, and getting it wrong means fighting the framework.

---

## 1. Declutter the storefront cards

**Goal:** one complete comic card — cover through to both buttons — visible in a single screen
with no scrolling.

### 1a. Add a short tagline to the data model

**Files:** `src/types/comic.ts`, `src/content/comics.ts`

Do not truncate the existing description with CSS. Add a proper field.

Add `tagline: string` to the `Comic` type. Write one for each of the ten comics in
`comics.ts`: **the single most relevant sentence, maximum twelve words**, capturing what the
reader gets. No trailing full stop, matching house copy style.

For reference, the existing `shortDescription` for `negotiation` is a 45-word sentence. Its
tagline should be something on the order of `Turn a stalemate into a deal both sides accept` —
short, concrete, benefit-first. Write each one fresh from that comic's own
`shortDescription` and `outcomes`; do not just clip the first clause.

`shortDescription` stays exactly as it is and is **not** edited. It is now used only on the
comic detail view, where it renders in full as a paragraph.

### 1b. Use it on the card

**Files:** `src/components/comics/ComicCard.tsx` line 36,
`src/components/comics/Comic.module.css` line 15

- Render `comic.tagline` instead of `comic.shortDescription`
- Remove the `-webkit-line-clamp: 4` clamp from `.desc` entirely — there is nothing left to
  clamp, and the clamp is what currently produces the mid-word "…" truncation visible today

### 1c. Tighten the card so it fits one screen

**File:** `Comic.module.css`

- Change `.cover` (line 5) from `aspect-ratio: 432 / 624` to `3 / 4`. The taller ratio is what
  pushes the buttons off screen
- Reduce `.body` padding (line 10) and its `gap` slightly
- Put the two actions on **one row**: `.actions` (line 19) should not wrap at normal card width.
  Let "View comic" take the available space and "Add to cart" size to its content, or shorten
  the second label to `Add` with the full description kept in its `aria-label`
- Raise the grid's minimum column width (line 1) from `235px` to about `260px` so cards are a
  little wider and the single-row actions fit comfortably

**Acceptance:** at a 1440×900 browser window, scrolled so a card's top edge is at the top of the
content area, the entire card including both buttons is visible without scrolling. Verify this
by measuring, not by eye.

---

## 2. Architecture for the pop-up — read this before coding

The comic view must behave as three things at once:

1. a **pop-up** floating over the storefront, opened by clicking a card
2. a **full standalone page**, when expanded or when the URL is opened directly or shared
3. a real URL in both cases, so refresh, share and browser back all behave

The correct tool is **Next.js parallel routes plus intercepting routes**. Do not build this as a
client-side state machine with a portal — that breaks the URL, breaks refresh and breaks back.

Create:

```
src/app/
  layout.tsx                        ← accepts a `modal` slot alongside `children`
  @modal/
    default.tsx                     ← returns null
    (.)comics/
      [slug]/
        page.tsx                    ← the pop-up
  comics/
    [slug]/
      page.tsx                      ← the full page (already exists)
```

`@modal/default.tsx` must exist and return `null`, or every non-intercepted route will 404 on
the slot. Update `layout.tsx` to render `{modal}` after `{children}` and before `<SiteFooter />`,
and type the props to include the new slot — Next 16's generated `LayoutProps<"/">` will pick
the slot up once the folder exists, so re-run the type check after creating it.

**What this gives you for free:** every existing `<Link href={/comics/${slug}}>` — the three in
`ComicCard.tsx` (lines 28, 32, 42), the ones in `ComicShelf`, `ComicCarousel` and `LibraryView` —
becomes a pop-up on soft navigation, with no change to any of them. A hard load of the same URL
renders the full page. That is exactly the required behaviour, and it is why this pattern is
worth the setup.

Note that a click from `/library` will also open the pop-up, over the library. That is correct
and consistent; leave it.

### 2a. Extract the shared content first

**New file:** `src/components/comics/ComicPanel.tsx`

Both the pop-up and the full page show the same thing. Pull the body of
`src/app/comics/[slug]/page.tsx` (lines 28 onward) into a `ComicPanel` component that takes the
comic and renders: cover, breadcrumb, title, the **full `shortDescription` as a paragraph**,
tags, `BuyPanel`, the video preview, "What you will learn", and the related shelf.

Both routes then render `<ComicPanel comic={comic} />`. There must be exactly one copy of this
markup. Keep `generateStaticParams` and `generateMetadata` on the full page route.

---

## 3. Pop-up behaviour

**New files:** `src/components/comics/ComicModal.tsx`, `ComicModal.module.css`

The pop-up is a client component wrapping `ComicPanel`.

### Geometry
- Fixed, centred, **70% of the viewport** in both axes, leaving equal space on all four sides
  and corners
- Ink border, site radius, paper background, a strong shadow so it reads as lifted
- Its content scrolls **inside** the panel; the page behind must not scroll

### Backdrop
- Fixed, covering the entire viewport **including the sticky header** — the header is
  `z-index: 50`, so the backdrop needs to sit above it and the panel above that
- Dim plus `backdrop-filter: blur(6px)`, so the storefront stays visible but clearly out of focus
- Clicking it closes the pop-up

### The two controls, at the top of the panel
- **Close** — an `×` glyph only. On hover and on focus it reveals the word "Close". Its
  `aria-label` is always "Close". Top right
- **Expand** — the word "Expand" in text, with an icon. Placed near Close but **clearly separated
  by space** so the two are never mis-clicked; put Expand at the top left of the panel, or with a
  minimum 24px gap if both sit right

### Interaction rules
- `Escape` closes
- Clicking anywhere on the backdrop closes
- **Any click on background content — the sticky header links, the cart button, a card behind the
  pop-up — must only close the pop-up and must not activate that control.** The full-viewport
  backdrop gives this for free: the click lands on the backdrop, not the element beneath. Confirm
  this rather than assuming, especially over the header
- Set `inert` on the header and `#main` while the pop-up is open, so keyboard users cannot tab
  into the background behind it
- Trap focus inside the panel; move focus in on open; return focus to the trigger on close
- Lock body scroll while open, restore on close
- Closing uses `router.back()`, which returns to `/comics` (or `/library`) and unmounts the slot

### Entrance
The panel scales and fades up from slightly small, the backdrop fades in. Keep it quick, around
220ms, on the site's existing easing curve.

---

## 4. Expand

Clicking **Expand** turns the pop-up into the full page.

**Do not navigate.** The URL is already `/comics/[slug]` — the interception set it. So expanding
is a **visual state change only**, and this is what makes it seamless:

- Hold an `expanded` boolean in `ComicModal`
- When it flips true, the panel animates from the 70% box to filling the viewport: `inset` to
  zero, border-radius to zero, border removed
- The backdrop's blur and dim animate to nothing
- The panel's chrome swaps: Close and Expand are replaced by a clear **Back** button at the top
  left, reading "Back to comics" with a left-arrow icon
- Release the `inert` attributes and the body scroll lock, since the background is no longer
  interactive-behind-a-layer — it is simply covered
- Because the URL was already correct, refreshing at this point renders the real standalone page
  with no special handling

### Making it genuinely smooth

Animating `inset`, `width` or `height` directly causes layout on every frame and will feel laggy
on a mid-range machine. Use `motion/react`'s `layout` animation so the change is performed with
transforms:

- Put `layout` on the panel container, with a spring around `stiffness: 300, damping: 34`
- Motion corrects border-radius distortion during a layout animation — set the radius through
  style, not through a class swap mid-animation
- Use `layout="position"` on the panel's inner content wrapper so text scales its position rather
  than stretching
- Add `will-change: transform` to the panel only while the transition is running, and remove it
  after
- Do not animate `backdrop-filter` blur radius numerically — it is expensive. Animate the
  backdrop's `opacity` instead and let the blur go with it

**Back**, from the expanded state, must return to the plain storefront — not to the pop-up.
`router.back()` does this, because opening the pop-up pushed one history entry.

When the page is reached directly rather than through the pop-up, `src/app/comics/[slug]/page.tsx`
must render its own Back control in the top left, a `<Link href="/comics">` with the same label
and appearance, so the two states look identical.

---

## 5. Reduced motion

Under `prefers-reduced-motion: reduce`:
- The pop-up appears and disappears with no scale or slide; a fade of 100ms at most is acceptable
- Expand switches between the two sizes instantly, with no layout animation
- Everything remains fully usable and nothing is left mid-transform

---

## 6. Do not touch

- `shortDescription` values in `src/content/comics.ts` — add `tagline`, edit nothing else
- Prices, titles, slugs, tags, outcomes, covers
- `public/` — no new assets
- `ComicsHero`, `AboutUs`, `DocDialog`, `legal-copy.ts`, `CharacterHero.tsx`
- The cart store, the cart page, `BuyPanel` — `BuyPanel` must keep working unchanged inside
  `ComicPanel` in both the pop-up and the full page
- `next.config.ts`, `package.json` — **no new dependencies**. `motion/react` is already installed
  and is all this needs
- Do not commit. Do not push. Do not create a branch.

---

## Verification (required)

```bash
npm run lint
npx tsc --noEmit
```

Both must produce zero output. Then, in `npm run dev`:

**Cards**
- [ ] Every card shows a one-sentence tagline of twelve words or fewer, with no "…" truncation
- [ ] At 1440×900, a complete card including both buttons fits on screen without scrolling
- [ ] "View comic" and the cart button sit on one row and do not wrap at default card width

**Pop-up**
- [ ] Clicking a cover, a card title, or "View comic" opens the pop-up over the storefront
- [ ] The URL changes to `/comics/<slug>`
- [ ] The panel is 70% of the viewport with visibly equal space on all four sides
- [ ] The storefront behind is visible and blurred, including behind the header
- [ ] The panel scrolls internally; the page behind does not scroll
- [ ] Clicking the backdrop closes it
- [ ] Clicking directly on a header link — Comics, My Library, Cart, Log in — closes the pop-up
      and does **not** navigate
- [ ] Clicking a card behind the pop-up closes it and does not open that comic
- [ ] `Escape` closes it
- [ ] The `×` reveals "Close" on hover and on keyboard focus
- [ ] Tab cannot reach anything behind the pop-up; focus returns to the trigger on close
- [ ] Browser back closes the pop-up and returns to the storefront

**Expand**
- [ ] Expand is clearly separated from Close and cannot be hit by accident
- [ ] Expanding fills the screen in one continuous motion with no jump, flash or reflow
- [ ] The transition holds a steady frame rate — check the Performance panel with CPU throttled
      to 4× and confirm no long frames during the transition
- [ ] Once expanded, the view is identical to the standalone page
- [ ] A Back button appears top left and returns to the plain storefront, not the pop-up
- [ ] Refreshing while expanded renders the standalone page, still correct

**Standalone**
- [ ] Opening `/comics/negotiation` in a new tab renders the full page, no pop-up, no backdrop
- [ ] That page has its own top-left Back link to `/comics`, matching the expanded state
- [ ] Buy now and Add to cart work in the pop-up, in the expanded state and on the standalone page
- [ ] All ten comics behave identically

**Motion**
- [ ] With `prefers-reduced-motion: reduce`, open, close and expand all work with no animation and
      nothing stuck mid-transform

---

## Note for the human

**One risk worth knowing about before you run this.** Intercepting routes are the right tool and
this is the exact use case Next.js built them for, but they are fiddly: a missing
`@modal/default.tsx` makes unrelated routes 404, and the interception only fires on client-side
navigation, which means it will look broken if you test by typing URLs into the address bar
rather than clicking. That is correct behaviour, not a bug — a typed URL is a hard load and
should give the standalone page.

**On expand.** I have specified it as a visual state change rather than a second navigation,
because the URL is already correct by the time the pop-up is open. That is what lets the
transition be one continuous motion instead of a route change, and it is why refresh-while-
expanded just works. If the agent proposes navigating instead, that is the wrong path — it will
either be intercepted again, or require a hard reload that kills the animation.

**Twelve words is tight.** Ten taglines at that length is real copywriting, and the agent's first
pass will probably be serviceable rather than good. Worth reading them yourself before the
walkthrough — the tagline is the only description most visitors will ever read on the catalogue,
so it is doing more selling than the long copy underneath.

Still outstanding: the 3D character bundle weight is worth putting to the client, and
`src/design/tokens.ts` remains dead code duplicating the `:root` colours in `globals.css`.
