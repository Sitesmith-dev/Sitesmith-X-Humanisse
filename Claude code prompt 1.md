# CLAUDE CODE PROMPT 1: ABOUT US SECTION, LEGAL DIALOGS, CART, AND CHARACTER SELECTOR FIX

Repo: `Sitesmith-X-Humanisse` — Next.js 16 design preview for the Humanisse comic storefront.
Written 2026-09-21. This is the first numbered prompt for this repo.

---

## 0. Read before you write

Read these files in full before making any change. Match their conventions exactly; do not
introduce your own patterns.

- `src/app/globals.css` — the global utility classes and CSS custom properties
- `src/app/layout.tsx` — root layout and font wiring
- `src/components/landing/Sections.tsx` — `Statement`, `Trio`, `FinalCTA`
- `src/components/landing/Landing.module.css` — landing section styles
- `src/components/shared/SiteHeader.tsx` and `Shared.module.css`
- `src/components/comics/Storefront.tsx`, `ComicCard.tsx`, `BuyPanel.tsx`
- `src/components/characters/CharacterHero.tsx`
- `src/content/comics.ts` and `src/types/comic.ts`

### House conventions (non-negotiable)

**React Compiler is enabled** (`reactCompiler: true` in `next.config.ts`). The lint rule
`react-hooks/set-state-in-effect` will fail the build if you call `setState` synchronously
inside a `useEffect`. Use `useSyncExternalStore` or a lazy initializer instead.

**Styling.** CSS Modules per component plus global utilities. Reuse, do not recreate:
`.wrap .section .lead .btn .btn-primary .btn-lg .tag .pill .demo .notice .capBox
.capBox-paper .secRow .secHead .pagehead .halftone` and the section bands
`.band .band-paper .band-gold .band-coral .band-plum .band-ink`.

**Colours and type.** Only the existing custom properties, never raw hex:
`--paper --paper-2 --ink --muted --gold --coral --plum --white --line --radius --pop --lift
--wrap --font-head --font-text --font-cardtext`.

**Libraries.** `motion/react` for component motion, `gsap` + ScrollTrigger for scroll effects
(see `src/components/shared/Scroll.tsx`), `lucide-react` for icons. **Do not add any
dependency.**

**Motion.** Every effect gated on `prefers-reduced-motion`, exactly as the existing code does.

**Accessibility.** This codebase has a high bar already — keep it. `aria-pressed` on toggles,
`aria-live` on anything that changes, `aria-labelledby` on sections, real labels on inputs,
44px minimum touch targets, visible focus. Never nest interactive elements.

**Copy.** Plain sentences, commas rather than em-dashes, no trailing full stop on short UI
labels. Anything not real yet carries `<span className="demo">Preview</span>` or the word
Placeholder.

**Content location.** Mock content in `src/content/`, types in `src/types/`.

---

## 1. Replace `Statement` with an About Us section

**Files:** `src/components/landing/Sections.tsx` (lines 12–24), `src/app/page.tsx` (lines 7,
15), new file `src/components/landing/AboutUs.tsx`,
`src/components/landing/Landing.module.css` (lines 36–45),
`src/components/shared/SiteFooter.tsx` (line 6).

Delete `export function Statement()` from `Sections.tsx` and create `AboutUs` in its own file.
Swap it into `src/app/page.tsx` where `<Statement />` sits on line 15 — same position, directly
under `<Hero />` and `<Marquee />`. Remove the now-unused `WordReveal` import from
`Sections.tsx`.

The section contains, in this order:

1. A small "About us" kicker heading (`id="about-h"`), styled as a pill: ink background,
   paper text, uppercase, letter-spaced.
2. The existing sentence, **unchanged**, still rendered through `WordReveal` with the
   `styles.big` class:
   `"Ideas are easier to keep when they happen to someone, so we put every idea inside a story"`
3. Two or three short paragraphs of **placeholder** About Us copy: Humanisse is a learning
   company that teaches life and professional skills through original comics, cinema and
   literature, built around three recurring characters, written for readers from about ten
   years old through to teams in training rooms. Close with a `.notice` line reading
   `<span className="demo">Placeholder</span> This copy is sample text, final wording comes
   from Humanisse`.
4. The three stat cards (see section 2).

Give the `<section>` `id="about"` and `aria-labelledby="about-h"`.

`SiteFooter.tsx` line 6 currently carries `id="about"`. **Remove it from the footer** so the
anchor is not duplicated.

---

## 2. Make the three stat cards clickable

**Files:** `AboutUs.tsx`, `Landing.module.css`, `src/components/landing/VideoPreview.tsx`
(line 13), `src/components/landing/Sections.tsx` (line 43), `src/app/globals.css` (line 55).

Convert the `<dl>` of stats into a semantic `<ul>` where each card is a `next/link`. **Keep the
existing colours exactly**: card 1 `--gold` with `--ink` text, card 2 `--coral` with `--white`
text, card 3 `--plum` with `--white` text. Same figures and labels.

| Card | Destination |
| --- | --- |
| `10` launch comics | `/comics` |
| `10` video introductions | the VideoPreview section on the landing page |
| `3` recurring characters | the Trio section on the landing page |

Add a hint line inside each card (e.g. "Browse every comic" with an `ArrowUpRight` icon) that
strengthens on hover and focus. Use the translate-plus-hard-shadow hover treatment already used
by `.artCard` and `.statCard` siblings in this codebase.

The target sections currently have ids only on their **headings**, not their `<section>`
elements:
- `VideoPreview.tsx` line 13 — add `id="video-intro"` to the `<section>`
- `Sections.tsx` line 43 (`Trio`) — add `id="characters"` to the `<section>`
- `Faq.tsx` line 15 already has `id="faq"` — leave it

`html` has `scroll-behavior: smooth` and the header is sticky, so anchored sections will land
underneath it. Add `scroll-margin-top: 80px` to `.band` in `globals.css` line 55.

---

## 3. T&C, Legal and FAQ at the foot of About Us

**Files:** `AboutUs.tsx`, new `src/components/shared/DocDialog.tsx`, new
`src/content/legal-copy.ts`, `src/components/shared/Shared.module.css`.

Add a row of three items at the bottom of the About Us section, **right-aligned** on desktop
and left-aligned below 900px.

**T&C** and **Legal** must open their document **over the page itself — no navigation, no route
change.** Build one reusable `DocDialog` component used by both. It must have:

- `role="dialog"`, `aria-modal="true"`, an accessible name from the document title
- focus moved into the panel on open, returned to the trigger on close
- `Escape` closes; backdrop click closes
- focus trapped on `Tab` and `Shift+Tab` while open
- `document.body` scroll locked while open, restored on close
- enter and exit animated with `AnimatePresence` from `motion/react`
- the panel itself scrollable, capped around `78vh`, with the site's paper background, ink
  border and hard offset shadow

Put the placeholder document text in `src/content/legal-copy.ts` as a typed record keyed
`terms` and `legal`, each with `title`, an `updated` string and a `body: string[]`. Write six or
seven realistic placeholder paragraphs each — terms covering accounts, purchases, the library,
fair use and changes; legal covering what is collected, how it is used, reading progress,
cookies, user choices and copyright. The dialog must visibly label the content as placeholder
awaiting client approval.

**FAQ** is a plain `next/link` to `/#faq` — it scrolls, it does not open a dialog.

---

## 4. Add a cart

### 4a. Shared cart state

**New file:** `src/components/cart/CartContext.tsx`

Because React Compiler is on, implement this as a **module-level external store consumed via
`useSyncExternalStore`** — not a context provider that hydrates inside an effect, which will
fail lint.

Requirements:
- Persist to `localStorage` under a preview-scoped key; wrap **every** read and write in
  `try/catch` so private mode cannot break the page
- Return a **stable** empty snapshot from `getServerSnapshot` so hydration matches
- Hydrate from storage on first subscribe, not in an effect
- Sync across tabs via the `storage` event
- Filter out slugs that are no longer real comics when loading, so stale storage cannot crash a
  render

Exported API: `items, add, remove, toggle, has, clear, addAll, count, subtotal, total,
isFullSet, saving`, plus the `SET_PRICE` constant and a `rupee(n)` formatter.

### 4b. Header cart button

**Files:** new `src/components/cart/CartButton.tsx`, `src/components/shared/SiteHeader.tsx`
(between lines 47 and 48), `Shared.module.css` (lines 2, 4, 5).

Insert the cart **between "My Library" (line 47) and "Log in" (line 48)**. Cart icon, "Cart"
label, and a count badge in `--coral` that springs in only when the cart has items.

Make room by tightening `.bar` and `.nav` gaps and `.link` horizontal padding, and right-align
the nav. Below 640px the visible label may collapse to the icon alone, but the accessible name
must still include the count (e.g. "Cart, 3 comics" / "Cart, empty").

### 4c. Buy now and Add to cart

**Files:** `src/components/comics/BuyPanel.tsx` (whole file),
`src/app/comics/[slug]/page.tsx` (line 40).

Replace the current "Buy Comic" / "Add to bundle" pair with Amazon-style actions:

- **Buy now** — adds the comic to the cart and navigates to `/cart` via `useRouter`
- **Add to cart** — adds it and stays on the page; once in the cart the button becomes a link
  reading "In cart, view it"

Announce the addition politely for screen readers with a visually hidden `aria-live` region.
Keep a preview notice making clear no payment is taken and nothing has been purchased.

`BuyPanel` needs the comic's `slug`, so update the call site at `page.tsx` line 40 to pass it.

### 4d. Cart page

**New files:** `src/app/cart/page.tsx`, `src/components/cart/CartView.tsx`,
`src/components/cart/Cart.module.css`.

- A `.pagehead` matching the one on `/comics`, with a preview notice
- Line items: cover thumbnail, title linking to the comic, two tags, price, remove button
- Items animate in and out with `AnimatePresence` and `layout`
- A **sticky** order summary: subtotal, the set-price saving when it applies, total
- A **Checkout button that does not work** — it reveals a notice saying payments arrive in the
  production build
- A proper empty-cart state with an icon, a line of copy, and a link back to `/comics`
- Responsive: summary drops below the list under 900px; line items reflow under 560px

### 4e. Fix two existing defects while you are in here

**Defect 1 — two disconnected bundle systems.** `Storefront.tsx` line 21 holds its own
`bundle: string[]` state, and `BuyPanel.tsx` line 9 holds a separate unrelated `bundle: boolean`.
Adding from one never shows in the other. Point **both** at the single cart store so they are
one thing. Relabel the card action in `ComicCard.tsx` from "In bundle" / bundle wording to cart
wording, including its `aria-label`.

**Defect 2 — hardcoded prices in three places.**
- `Storefront.tsx` line 33: `const total = allIn ? SET_PRICE : bundle.length * 199;`
- `Storefront.tsx` line 14: `const SET_PRICE = 1499;`
- `HowItWorks.tsx` line 43: a literal `₹199` in the copy

Sum the real `price` field from each comic in `src/content/comics.ts` instead. Apply the set
price only when **every** comic is in the cart, and surface the saving. Keep the set price as a
single named constant exported from the cart module, imported wherever it is needed.

---

## 5. Fix the character selector sticking on the last character

**File:** `src/components/characters/CharacterHero.tsx` (lines 41, 61, 76–82).

**The bug.** Line 79 sets `active` on `onMouseEnter` and `onFocus`, but nothing ever clears it.
Hovering across Professor → Bot → Cat and then moving the cursor away leaves the scene stuck on
the Cat, and the "Select a character to meet them" line on line 84 never returns.

**The fix.** Separate the two intents:

- A **click pins** a character (`picked`). Clicking the pinned one again unpins it.
- **Hover or focus only previews** one (`hovered`).
- The displayed character is `hovered ?? picked` — preview wins while it exists, otherwise the
  pinned one, otherwise none.

Clear `hovered` when:
- the pointer leaves the button group (`onMouseLeave` on the group wrapper)
- focus leaves the group (`onBlur` on the wrapper, guarded with
  `e.currentTarget.contains(e.relatedTarget)`)
- the hero scrolls out of view — extend the existing `IntersectionObserver` on line 61

`aria-pressed` must reflect **`picked`**, not the hovered character.

---

## 6. Do not touch

- `src/app/layout.tsx` — it has an uncommitted `suppressHydrationWarning` change; leave it
- `src/components/characters/models.tsx`, `CharacterScene.tsx`, `CharacterFallback.tsx` — the
  3D work is out of scope
- `src/content/comics.ts` — read the data, do not edit titles, prices or descriptions
- `public/` — do not add, replace or rename any asset
- `.github/workflows/ci.yml`, `next.config.ts`, `package.json` — **no new dependencies**
- `src/app/login/`, `src/app/library/`, `src/components/auth/`, `src/components/library/` —
  unrelated to this prompt
- Do not commit. Do not push. Do not create a branch.

---

## Verification (required)

Run these and report the output. Both must be completely clean.

```bash
npm run lint
npx tsc --noEmit
```

Then confirm each of the following by hand in `npm run dev`:

- [ ] The About Us section sits directly under the hero and marquee, with the original sentence
      intact and word-by-word reveal still working
- [ ] The three cards keep gold / coral / plum in that order
- [ ] "10 launch comics" navigates to `/comics`
- [ ] "10 video introductions" scrolls to the video section, clear of the sticky header
- [ ] "3 recurring characters" scrolls to the character trio, clear of the sticky header
- [ ] T&C opens a dialog over the page with no URL change; Escape, backdrop click and the close
      button all dismiss it; focus returns to the T&C trigger
- [ ] Tab is trapped inside the open dialog and the page behind does not scroll
- [ ] Legal opens the same way with different content
- [ ] FAQ scrolls to the FAQ section
- [ ] The header reads Comics · How It Works · My Library · **Cart** · Log in without wrapping
      at 1280px, 1024px and 768px
- [ ] The cart badge appears only when the cart has items and shows the right count
- [ ] On a comic page, "Add to cart" keeps you on the page and the button changes state
- [ ] On a comic page, "Buy now" adds the comic and lands you on `/cart`
- [ ] Adding from the catalogue shows on the comic page and in the header, and vice versa
- [ ] Adding all ten comics charges the set price and shows the saving
- [ ] Removing a comic recalculates the total from real comic prices, not a flat 199
- [ ] Checkout shows a preview notice and does nothing else
- [ ] The cart survives a page refresh
- [ ] Hovering Professor → Bot → Cat then moving the cursor away returns the label to
      "Select a character to meet them"
- [ ] Clicking a character pins it; hovering another previews it; moving away returns to the
      pinned one
- [ ] Scrolling the hero out of view does not leave a character stuck as selected
- [ ] Everything above still behaves with `prefers-reduced-motion: reduce` set in devtools

---

## Note for the human

Three things deliberately left out of this prompt:

1. **The card-to-page transition animation.** The comic detail page is still a standard
   `next/link` navigation. The custom open animation needs a decision first — View Transitions
   API versus Motion shared layout — and Firefox does not yet support cross-document view
   transitions, which matters because the signed proposal commits to Firefox in QA. That is
   its own prompt once the approach is chosen.

2. **The 3D character bundle.** `three`, `@react-three/fiber` and `@react-three/drei` are a
   large payload on the landing page for characters the code itself marks as provisional. Worth
   putting to the client before deciding whether to keep or replace with GLBs.

3. **`src/design/tokens.ts`** is imported by nothing and duplicates the `:root` colours in
   `globals.css`. Harmless but dead. Left alone here to keep this prompt's diff focused.

Also worth knowing: `next build` cannot run on an ARM Mac in this repo without network access
to fetch the SWC binary, so `npm run lint` and `npx tsc --noEmit` are the local gates. Vercel's
build is the real check.
