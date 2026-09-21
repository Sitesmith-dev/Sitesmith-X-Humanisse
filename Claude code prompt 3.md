# CLAUDE CODE PROMPT 3: REPLACE THE COMICS PAGE HEADER WITH A DISPLAY HERO

Repo: `Sitesmith-X-Humanisse`. Written 2026-09-21. Follows `Claude code prompt 1.md` and
`Claude code prompt 2.md`, both already applied.

---

## 0. The problem

`/comics` currently opens with the generic `.pagehead` band: a flat gold rectangle, the word
"Comics", a lead sentence and a preview pill. It is the same header component every secondary
page uses. It carries no product, no artwork and no reason to keep scrolling, and it makes the
catalogue — the page that actually sells — look like an admin screen.

Replace it with a **display hero**: a framed title plaque on the left, and on the right a fan of
comic covers standing on a lit stage, with sunburst rays behind them.

The reference is a retail collection banner — a bulb-lit marquee plaque beside a group of
product boxes arranged on a lit podium, with radiating rays and small decorative flourishes.
**Do not copy that banner's artwork, colours, wording or branding.** Take only the *structure*:
framed title left, product group on a lit stage right, rays behind, a few flourishes. Everything
visible must be built from Humanisse's own design language — the comic-panel vocabulary already
in this codebase.

Everything below `/comics`'s header stays as it is, except the one deletion in section 5.

---

## 1. Build the hero from existing house vocabulary

**New files:** `src/components/comics/ComicsHero.tsx`, `src/components/comics/ComicsHero.module.css`

**No new dependencies.** Every effect below is achievable with what the repo already has.
Existing pieces to lift rather than reinvent:

| Effect | Where it already exists |
| --- | --- |
| Sunburst rays | `repeating-conic-gradient` in `Comic.module.css` line 36 (`.burst`) |
| Halftone dots | `.halftone` and the `.band::before` radial-gradient in `globals.css` |
| Hard offset shadow | `--pop` |
| Thick ink outline | `--line` |
| Tilted caption box | `.capBox` in `globals.css` |
| Speech bubble with tail | `.bubble` / `.b1` / `.b2` in `Landing.module.css` lines 21–25 |
| Star burst shape | `.finalBurst` clip-path polygon, `Landing.module.css` line 147 |
| Staggered entrance | `fadeUp` keyframe + `--d` delay, `Landing.module.css` lines 15–18 |
| Scroll drift | `Parallax` in `src/components/shared/Scroll.tsx` |

Keep the gold background and the ink bottom border, so the page still reads as part of the site.

---

## 2. Layout

Two columns at desktop, `1fr 1.1fr`, vertically centred, with generous block padding — this is a
display banner, give it roughly `72px` top and `88px` bottom.

### Left column — the title plaque

A cream (`--paper`) panel with a thick ink border, a hard offset shadow, and a slight rotation of
about `-1.2deg`, sitting on the gold band.

Give it a **bulb ring**: an absolutely positioned pseudo-element inset about `10px` with
`border: 6px dotted var(--gold)` and a matching radius. A thick dotted border renders as a ring
of evenly spaced round lights, which reads as a marquee frame and stays inside the Ben-Day dot
language already used across the site. Do not import an image for this.

Inside the plaque, one `<h1>` composed of stacked spans:

- small line above, letter-spaced and uppercase: `The complete`
- the main line, very large, tight leading, `--font-head`: `Comic Collection`
- a short rule or a small sub-line beneath: `Ten stories, ten ideas worth keeping`

The `<h1>`'s accessible text should read naturally as "The complete Comic Collection".

Below the plaque, still in the left column, keep the two pieces of content the old header had,
worded exactly as they are today in `src/app/comics/page.tsx` lines 12–13:

- the lead paragraph, in `.lead`
- the `<p className="notice"><span className="demo">Preview</span> …</p>` pill

Then a pair of calls to action:
- primary: `Browse all ten` — anchors to the catalogue grid (`#all-h`)
- secondary: `The complete set` — anchors to the set band lower on the page

Give the set band in `Storefront.tsx` an `id` so that second anchor has a target, and add
`scroll-margin-top` to it so it clears the sticky header.

### Right column — the stage

A group of **five** comic covers fanned out, centre one forward:

| Position | Scale | Rotation | Vertical offset | z-index |
| --- | --- | --- | --- | --- |
| far left | 0.76 | −15deg | +22px | 1 |
| left | 0.87 | −7deg | +10px | 2 |
| **centre** | 1 | 0 | 0 | 3 |
| right | 0.87 | +7deg | +10px | 2 |
| far right | 0.76 | +15deg | +22px | 1 |

Overlap them so each partially sits behind its neighbour — negative horizontal margins on a flex
row is the simplest approach. Each cover gets the ink border, the site radius and a hard offset
shadow.

Render them with the existing `ComicCover` component from `src/components/comics/ComicCover.tsx`,
passing comics from `src/content/comics.ts`. Put `negotiation` in the centre, since it is the one
comic with real cover art; the other four will render `ComicCover`'s styled placeholder, which is
correct and honest for a preview. Pass `priority` to the centre cover only.

Beneath the fan, a **podium**: a wide flattened ellipse in `--plum`, roughly `48px` tall, with
`border-top: 6px dotted var(--gold)` for the lit rim and a soft shadow beneath. The covers should
read as standing on it.

Behind the whole group, the **sunburst**: an absolutely positioned, `aria-hidden` element far
larger than the stage, using a `repeating-conic-gradient` of thin ink-tinted wedges at low
opacity, masked with `radial-gradient(circle, #000 0%, transparent 70%)` so the rays fade out
before the edges. `pointer-events: none`.

### Flourishes

Keep these few and small. Two speech bubbles positioned over the stage, following the existing
`.bubble` pattern with its tail — one white, one coral — carrying short phrases such as
`Ten ideas` and `One story each`. One coral star burst using the `.finalBurst` clip-path polygon,
top right of the fan, containing a two-word label. All `aria-hidden` where decorative.

---

## 3. Motion

- The five covers enter with a staggered rise, centre first then outward, using the existing
  `fadeUp` keyframe with a `--d` delay per cover, or `motion/react` with a stagger — either is
  fine, match whichever the neighbouring components use
- Wrap the sunburst in the existing `Parallax` component so it drifts slowly against the scroll
- On hover of the stage, the fan spreads very slightly wider and the centre cover lifts
- Every one of these must be inside a `prefers-reduced-motion: no-preference` guard, matching how
  `Scroll.tsx` and `Landing.module.css` already do it. With reduced motion set, the hero must
  render complete and static — no element may be left mid-animation or at reduced opacity

---

## 4. Responsive

- **Below 1000px:** single column. Plaque, lead and notice on top; stage below, centred. Reduce
  the fan to **three** covers, drop the outer pair entirely
- **Below 700px:** shrink the fan further and reduce rotations to about ±5deg so nothing clips the
  viewport edge; keep the podium proportional to the covers
- **Below 560px:** show the centre cover alone, upright, on the podium. Hide the speech bubbles
  and the star burst
- No horizontal page scroll at any width. Check 1440, 1280, 1024, 768 and 390

---

## 5. Delete the duplicate feature block

**File:** `src/components/comics/Storefront.tsx` lines 35–46, and
`src/components/comics/Storefront.module.css` lines 1–2 and the `.feature` / `.featureCover`
parts of the 720px rule on line 26.

The "Start here: Negotiation" panel currently sits immediately under the header and shows the
Negotiation cover at large size. The new hero puts that same cover centre stage a few hundred
pixels above it, so the page would show it twice in one screen. Remove the feature block.

- Delete the `<section>` containing `styles.feature`
- Delete the now-unused `const featured = comics[0];`
- **Keep `.featurePrice`** — it is still used by the complete-set band further down the file
- Remove any import left unused by the deletion; `npm run lint` will name them

---

## 6. Wire it in

**File:** `src/app/comics/page.tsx` lines 9–15.

Replace the entire `<section className="pagehead">` block with `<ComicsHero />`. Leave
`metadata` on line 4 as `{ title: "Comics" }` and leave `<Storefront />` untouched.

Do not change `.pagehead` in `globals.css` — `/cart` still uses it.

---

## 7. Do not touch

- `src/content/comics.ts` — read it, do not edit titles, descriptions or prices
- `public/` — do not add, replace, rename or generate any image asset; the hero is CSS and
  existing components only
- `.pagehead` in `globals.css`, and the `/cart` page that uses it
- `AboutUs.tsx`, `DocDialog.tsx`, `legal-copy.ts`, anything under `src/components/cart/` or
  `src/app/cart/`, and `CharacterHero.tsx`
- The catalogue grid, filters, search, sort, chips and the complete-set band, apart from adding
  the one `id` in section 2
- `next.config.ts`, `package.json` — **no new dependencies**
- Do not commit. Do not push. Do not create a branch.

---

## Verification (required)

```bash
npm run lint
npx tsc --noEmit
```

Both must produce zero output. Then check by hand in `npm run dev`:

- [ ] Clicking "Comics" in the sticky header opens `/comics` and the new hero is the first thing
      below the header
- [ ] The plaque reads as a framed sign: cream panel, ink border, gold bulb ring, slight tilt
- [ ] There is exactly one `<h1>` on the page and it reads "The complete Comic Collection"
- [ ] Five covers are fanned with the Negotiation art centre and forward, overlapping correctly,
      each with an ink border and hard shadow
- [ ] The covers sit on the lit podium rather than floating above or sinking into it
- [ ] Sunburst rays sit behind the stage and fade out before the band edges
- [ ] The lead sentence and the Preview pill are still present, wording unchanged
- [ ] "Browse all ten" scrolls to the catalogue grid, clear of the sticky header
- [ ] "The complete set" scrolls to the set band, clear of the sticky header
- [ ] "Start here: Negotiation" is gone and the Negotiation cover appears only once above the fold
- [ ] The catalogue grid, search, sort, topic chips and cart bar all still work
- [ ] `/cart` still shows its `.pagehead` correctly and is visually unchanged
- [ ] At 1000px the layout stacks and the fan drops to three covers
- [ ] At 560px only the centre cover shows, bubbles and star burst are hidden
- [ ] No horizontal scrollbar at 1440, 1280, 1024, 768 or 390
- [ ] With `prefers-reduced-motion: reduce`, the hero renders fully and statically, nothing stuck
      faded or mid-transform
- [ ] Keyboard tab order is the two CTAs, then straight into the catalogue toolbar; no decorative
      element takes focus

---

## Note for the human

**Only one real cover exists.** `public/characters/references/negotiation-cover.png` is the only
piece of finished art in the repo, so four of the five covers in the fan will render the styled
placeholder. The composition is built to carry that — the placeholders are deliberate and
labelled — but this hero is the single element on the site that will improve most the moment
George sends the other nine covers. Worth showing him this page specifically when asking for
them, because the gap will be obvious and persuasive.

**Two judgement calls made for you**, both cheap to reverse once it is on screen:

1. Five covers rather than three. Three reads cleaner but leaves the band feeling wide and empty
   at 1440px. If five looks busy with placeholder art, dropping the outer pair is a one-line
   change to the array.
2. Deleting "Start here: Negotiation" rather than keeping it. The hero takes over its job. If you
   want a featured comic further down the page instead, it is better placed *below* the grid as a
   closing push than above it as a second header.

Still outstanding from prompt 1, unchanged: the card-to-page transition animation needs its
approach decided (View Transitions API versus Motion shared layout, with a Firefox fallback), the
3D character bundle weight is worth putting to the client, and `src/design/tokens.ts` remains dead
code duplicating the `:root` colours in `globals.css`.
