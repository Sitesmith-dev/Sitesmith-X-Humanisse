# CLAUDE CODE PROMPT 6: WATERMARK THE READER PAGES AND ADD CLIENT-SIDE COPY DETERRENTS

Repo: `Sitesmith-X-Humanisse`. Written 2026-09-23. Follows prompts 1–5, all applied and merged.

---

## 0. Scope, and what this is honestly worth

This prompt covers the **client-side deterrence layer only**: a visible watermark on reader
pages, and the set of browser-level blocks that stop casual copying.

It is **not** the security layer. The real protection — private S3, CloudFront Origin Access
Control, signed short-lived cookies, Firebase entitlement checks, rate limiting, session control
— is a separate, later prompt. Nothing here should pretend otherwise: do not add fake
entitlement checks, do not obfuscate asset paths to look secure, do not add anything whose only
purpose is to look like protection.

What this layer genuinely achieves: it stops a child right-clicking a page, a parent dragging one
to the desktop, and anyone printing the comic to PDF. It stops nobody with devtools open, and it
cannot stop screenshots — no web page can. Build it accordingly and do not over-invest.

All of it is scoped to the reader. Nothing in this prompt may change behaviour anywhere else on
the site.

---

## 1. The watermark

**New file:** `src/components/reader/PageWatermark.tsx`, styles into
`src/components/reader/Reader.module.css`

A repeating diagonal tile of the word **Humanisse** across every reader page.

### Implementation

Render it as an inline `<svg>` with a `<pattern>` containing a rotated `<text>` element, rather
than a CSS background image or a grid of DOM nodes. The pattern approach keeps it to a single
element per page, scales cleanly at any zoom, and — importantly for later — lets the text be a
prop rather than a hardcoded string.

Give the component this shape, because the text becomes per-reader in the security prompt and
that change should be one line:

```tsx
<PageWatermark text="Humanisse" />
```

Default the prop to `"Humanisse"`. Do not build any per-user logic now.

### Placement

Inside `.leaf`, layered over the page art. `.leaf` already has `container-type: inline-size`, and
`.pageNumber` already sizes itself in `cqw` — follow that pattern so the watermark scales with
the page rather than the viewport, and looks identical in spread, single and scroll modes.

`.leaf::after` (the gutter shadow) sits at `z-index: 5` and `.pageNumber` at `4`. Put the
watermark at `3` — above the artwork, beneath the page number and the gutter shading.

It must be `pointer-events: none` and `aria-hidden="true"`. It must never intercept a click,
a swipe or a page turn.

### Appearance

Tune these against the four placeholder pages, and pull every one out as a named constant at the
top of the component so they can be re-tuned when real artwork arrives:

- Angle around −30°
- Tile sized so roughly four to six repetitions cross the page width
- Ink-coloured fill at about **7% opacity** — visible when looked for, invisible when reading
- A very subtle paper-coloured stroke beneath the fill, around 5%, so the mark survives on both
  light and mid-tone artwork
- Uses `--font-head`, letter-spaced, so it reads as brand rather than as an accident

**The bar to hit:** at normal reading distance the watermark should be noticeable if you look for
it and completely ignorable while reading a page. If it competes with the artwork it is too
strong; if a screenshot could be cropped to exclude it, the tile is too sparse.

The watermark also appears on **sidebar thumbnails and the contact sheet** — smaller, same
treatment. Those are page images too.

---

## 2. Right-click, drag and selection

Scope every one of these to the reader container only. Do not apply any of it site-wide.

Four separate things, and the last two are the ones usually missed:

- **`contextmenu`** → `preventDefault()` on the reader. Note that this is still required even
  though pages are rendered in CSS and SVG: Chrome offers "Save image as…" on canvas and image
  elements alike
- **`dragstart`** → `preventDefault()`. Images and SVG are draggable by default, so a page can be
  dragged straight to the desktop without any right-click. Also set `draggable={false}` on any
  `next/image` element and `-webkit-user-drag: none` in CSS
- **`user-select: none`** on the reading stage, the leaves and the thumbnails. Leave the toolbar
  labels selectable — there is no reason to block those and it makes the reader feel broken
- **`-webkit-touch-callout: none`** on the leaves and thumbnails. This is the iOS long-press menu,
  which is the mobile equivalent of right-click. Given most readers will be children on iPads,
  this is arguably the most important line in this section

---

## 3. Block printing

This is the easiest rip of all and the one people forget: `Cmd/Ctrl+P` → Save as PDF gives a
clean copy of the whole comic in one action.

Two parts, both needed:

- **A print stylesheet.** In `Reader.module.css`, under `@media print`, hide the reading stage,
  the spread, the sidebar and the thumbnails entirely, and show a short printed message in their
  place: `Humanisse comics are read online and cannot be printed`. This is the real backstop,
  because printing triggered from the browser's own menu cannot be intercepted in JavaScript
- **Intercept the keyboard shortcut** on the reader — `Cmd/Ctrl+P` — and swallow it. Cheap, and
  it catches the common case before the print dialog even opens

Do not intercept `Cmd/Ctrl+S`. It saves the HTML document, which contains no artwork, so blocking
it buys nothing and only annoys people.

---

## 4. Hide-on-blur, behind a flag

Blurring the pages when the tab loses focus is a real deterrent against screen-capture tooling,
and it is also the most user-hostile thing in this list — someone alt-tabs to take a note and
their comic vanishes.

Build it, but put it behind a single named constant at the top of `Reader.tsx`, **defaulted off**:

```ts
// Blur the pages when the tab loses focus. Off by default: it deters capture tooling
// but interrupts readers who switch away briefly. Flip to true if the client asks for it.
const BLUR_ON_BLUR = false;
```

When on: listen for `visibilitychange` and `window.blur`, apply a CSS blur plus a short overlay
line to the reading stage, clear it on return. Nothing else changes; the reader keeps its page
position and zoom.

Do not wire it to any UI. It is a decision for the client, not a reader preference.

---

## 5. What not to build

Explicitly out of scope. Do not add any of these, and do not leave stubs for them:

- Any attempt to detect or block screenshots. There is no web API for it, every technique that
  claims to is unreliable, and a phone camera defeats all of them
- Devtools detection, debugger traps, or console warnings
- Source obfuscation, minification tricks, or renamed asset paths dressed up as security
- Disabling keyboard shortcuts beyond the single print interception above
- Any watermark that encodes user identity — that arrives with the security prompt, and the
  component's `text` prop is the seam it will use

---

## 6. Do not touch

- The reader's layout, spread pairing, zoom, navigation, view menu or sidebar behaviour — this
  prompt adds layers and handlers, it does not restructure `Reader.tsx`
- `ReaderPagePlaceholder.tsx`'s four page variants
- Anything outside `src/components/reader/` and `src/app/read/`, with no exceptions — no
  site-wide CSS, no changes to `globals.css`
- The cart, the pop-up, `ComicsHero`, `AboutUs`, `DocDialog`
- `src/content/comics.ts` — no data changes at all in this prompt
- `next.config.ts`, `package.json` — **no new dependencies**
- Do not commit. Do not push. Do not create a branch.

---

## Verification (required)

```bash
npm run lint
npx tsc --noEmit
```

Both must produce zero output. Then, in `npm run dev` at `/read/negotiation`:

**Watermark**
- [ ] "Humanisse" tiles diagonally across both pages of the spread
- [ ] It is visible when you look for it and does not distract while reading a page
- [ ] It scales with the page in spread, single page and continuous scroll, and looks the same
      proportionally in all three
- [ ] It scales correctly at 50%, 100% and 300% zoom — no re-tiling, no pixellation, no drift
- [ ] It appears on sidebar thumbnails and on the contact sheet
- [ ] It never blocks a click, a swipe, an edge control or a page turn
- [ ] Screen readers do not announce it
- [ ] Changing the `text` prop in one place changes every instance

**Deterrents**
- [ ] Right-click anywhere on a page does nothing; right-click still works elsewhere on the site
- [ ] A page cannot be dragged onto the desktop or into another tab
- [ ] Long-press on iOS Safari does not open the save/copy menu — test on a real device or an
      iOS simulator, not just Chrome's device emulation, because the callout behaviour differs
- [ ] Page content cannot be selected; toolbar labels still can
- [ ] `Cmd/Ctrl+P` is swallowed on the reader
- [ ] Printing from the browser menu produces the "cannot be printed" message, not the comic
- [ ] Print preview shows no page artwork at all

**Flag and regressions**
- [ ] With `BLUR_ON_BLUR` flipped to `true`, switching tabs blurs the pages and returning restores
      them with page position and zoom intact
- [ ] With it `false` — the default — switching tabs changes nothing
- [ ] Keyboard navigation, arrow keys, `Home`/`End`, fullscreen and Close all still work
- [ ] The view menu, zoom controls and sidebar are unaffected
- [ ] Nothing on the storefront, the comic pop-up, the cart or the landing page has changed
      behaviour — especially right-click and text selection, which must still work normally
- [ ] With `prefers-reduced-motion: reduce`, everything still behaves

---

## Note for the human

**Be careful how this is described to George.** What ships here makes copying inconvenient and
makes the brand visible on anything that does leak. It is not protection, and the words used in
the walkthrough matter — "we've made casual copying difficult and every page carries the
Humanisse mark" is accurate; "the comics are protected" is not, until the server-side layer
lands. Your proposal already sets this expectation honestly, which is worth leaning on rather
than quietly improving upon.

**The watermark will need re-tuning.** Seven percent opacity is judged against four clean CSS
placeholder pages with generous white space. Real comic pages are denser and darker in places;
the mark may disappear into artwork or fight with it. That is why every value is a named
constant — expect to spend twenty minutes re-tuning the moment George sends a real comic, and
do not treat the current numbers as settled.

**One open decision this raises.** Right now the watermark says "Humanisse" for everyone, which
is branding. The security prompt will change it to carry a reader reference, which is
attribution — and that is the version that actually deters sharing. Worth deciding ahead of that
prompt what it should say: a name, a short account reference, or an order number. I would avoid
the full email address — it is a children's product and an email on a screenshot that ends up in
a group chat is a privacy problem you do not want to have created.

Still outstanding: the entire server-side security layer, the 3D character bundle weight, and
`src/design/tokens.ts` remains dead code duplicating the `:root` colours in `globals.css`.
