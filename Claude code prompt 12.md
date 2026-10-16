# CLAUDE CODE PROMPT 12: NAVIGATION FOR THE CLIENT'S SEVEN TABS

Repo: `Sitesmith-X-Humanisse`. Written 2026-10-12. Follows prompts 1–11. **Part 4 of 4** of the client-copy work.
Prompts 9 to 11 should already be applied.

## 0. Rules for client copy (the same rules as prompts 9 to 11, repeated because you may not have them in front of you)

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

**Note on this prompt's scope:** navigation only. It is the only one of the four allowed to change
`src/content/navigation.ts`, `SiteHeader.tsx`, `SiteFooter.tsx` and their styles.

---

## 1. What this prompt does

The client's sheet defines seven tabs: **About Us, Comics, The Learning Ideology, For Corporates, For Campus,
For Individuals, The Community**. Prompts 9 to 11 built or updated every one of those pages. This prompt makes
them reachable. Seven top-level links will not fit beside My Library, Cart and the account menu, so the three
audience pages go under one dropdown.

Read before starting: `src/content/navigation.ts`, `src/components/shared/SiteHeader.tsx` (and its CSS module),
`SiteFooter.tsx`, `Chrome.tsx`, `src/app/api/session` and the account menu added in prompt 8 (if prompt 8 has
been applied, reuse its dropdown pattern and its outside-click and Escape handling rather than writing a second
one; if it has not, stop and say so).

---

## 2. One source of truth: `src/content/navigation.ts`

`navLinks` there is unused and has stale hrefs (`/#how-it-works`, `/#about`). Replace the file's exports with:

```ts
export type NavItem = { label: string; href: string };
export type NavGroup = { label: string; items: NavItem[] };
export type PrimaryNav = (NavItem | NavGroup)[];

export const primaryNav: PrimaryNav = [
  { label: "About Us", href: "/about" },
  { label: "Comics", href: "/comics" },
  { label: "Learning Ideology", href: "/learning-ideology" },
  {
    label: "Who It's For",
    items: [
      { label: "For Corporates", href: "/for-corporates" },
      { label: "For Campus", href: "/for-campus" },
      { label: "For Individuals", href: "/for-individuals" },
    ],
  },
  { label: "Community", href: "/community" },
];
```

Check `grep -rn "navLinks"` and update any importer. Header and footer both read `primaryNav`, nothing else
hard-codes these links. Keep My Library, Cart and Log in/out out of this array: they are account actions and
stay where they are.

The two label choices that are mine, not the client's: **"Learning Ideology"** (his tab is "The Learning
Ideology", shortened for the header) and **"Who It's For"** (a heading for the dropdown; the sheet has none).
The pages themselves keep the client's full titles.

---

## 3. Desktop header (1024px and up)

Left: the logo, as now. Then the five items from `primaryNav` in order. Right: My Library, Cart (with its count)
and the account control from prompt 8 (Log in when signed out). Check the arrangement at 1024 and 1100px: if it
wraps or crowds, reduce horizontal gap and link padding first, then font size slightly, and do not drop to two
rows.

**Plain link:** existing header link style. The link for the current page gets `aria-current="page"` and an
active style (gold underline or the existing hover treatment held on). Match by `usePathname()`: exact match, or
`startsWith(href + "/")` so `/comics/negotiation` keeps Comics active. A group is active when any child is.

**"Who It's For" dropdown:** a `<button>` with a small chevron, `aria-haspopup="menu"`, `aria-expanded`,
`aria-controls`. The panel is a list of three links styled as the site's cards (ink outline, `var(--pop)`
shadow, cream background). Behaviour:
- Opens on click or tap, and also on Enter and Space. Not hover-only
- Closes on Escape (focus returns to the button), on a click outside, on route change, when focus leaves the
  whole menu, and when the header hides itself on scroll (if it does that)
- Arrow Down on the button opens it and focuses the first link. Arrow Up and Down move between links. Tab
  closes it and continues normally
- Only one menu (this or the account menu) is open at a time
- The chevron rotates when open. Respect `prefers-reduced-motion`
- Child links carry `aria-current="page"` when active

---

## 4. Mobile and tablet header (below 1024px)

Replace the inline links with a **menu button** (hamburger that turns into a close icon, with `aria-label` "Open
menu" / "Close menu", `aria-expanded`, `aria-controls`). Keep the logo on the left and the Cart icon and the
account control visible beside the button, so a shopper never has to open the menu to reach their basket.

The menu is a panel dropping from under the header, full width, same cream and ink styling:
1. About Us, Comics, Learning Ideology
2. "Who It's For" as a small non-interactive sub-heading, then its three links indented beneath it (no nested
   accordion on mobile, three short links do not need one)
3. Community
4. A divider, then My Library (and Log in when signed out)

Rules: opens and closes with a button; Escape closes it; selecting a link closes it; route change closes it;
body scroll is locked while it is open and released on close (and on unmount); focus moves to the first link on
open and returns to the button on close; the active page is marked as above. Tap targets at least 44px high. The
panel must scroll internally if the viewport is short (landscape phones) and never run under the bottom
browser bar.

Where the header already hides or changes on scroll, make sure it cannot hide while the menu is open.

---

## 5. Footer

`SiteFooter.tsx`: render every page link from `primaryNav` (flatten the group; show the three audience pages
under their group heading or as a plain list, whichever fits the existing columns), plus the existing legal
links. Show **Log in** only when signed out, do not show it to signed-in users. If the footer reads session
state client-side, reuse the same `/api/session` hook as the header. Do not create a second fetch pattern.
Keep the footer's copy and copyright as they are.

---

## 6. Do not touch

- The pages themselves, comics data, audience data, the cart, auth, reader and Supabase code
- `legal-copy.ts`, `public/`, `package.json`, `next.config.ts`, `globals.css` colours and tokens
- The `Chrome` rule that hides header and footer on `/read/`, `/concepts` and the vintage concept. Keep it
- Do not commit. Do not push. Do not create a branch. When done, send the `http://localhost:3000` link per
  `CLAUDE.md`

---

## Verification (required)

```bash
npm run lint
npx tsc --noEmit
npm run build
```

All three clean. Then in `npm run dev`, at 1440, 1280, 1100, 1024, 820 and 390px wide:

**Desktop (1024 and up)**
- [ ] Five nav items in the client's order, no wrapping, no overlap with My Library, Cart or the account menu
- [ ] "Who It's For" opens by click, shows the three audience links, closes on Escape, outside click and route
      change
- [ ] Keyboard only: Tab reaches every item, Arrow keys move inside the dropdown, focus is always visible
- [ ] Open the account menu while the dropdown is open: only one stays open
- [ ] On `/comics/negotiation` Comics is active; on `/for-campus` the group is active and Campus is marked

**Below 1024**
- [ ] Hamburger shows, links do not; Cart and the account control stay visible
- [ ] Menu opens, lists everything in the order in section 4, closes on link tap, Escape and route change
- [ ] Page behind does not scroll while it is open, and scrolls again after
- [ ] Landscape phone (844x390): the panel scrolls and nothing is cut off

**Everywhere**
- [ ] Every link goes to a page that exists: click each one, no 404
- [ ] Header and footer are still hidden on `/read/...` and `/concepts`
- [ ] Footer lists every page and shows Log in only when signed out
- [ ] `grep -rn "how-it-works\|/#about" src` returns nothing
- [ ] Reduced motion: no animation on the menu or chevron
- [ ] No console errors or hydration warnings in the header

---

## Note for the human

**Two labels are mine.** "Who It's For" is the dropdown heading and "Learning Ideology" is the shortened header
form of the client's tab. Both are one-line edits in `navigation.ts`. Tell George if he wants his exact words.

**Why a dropdown.** Seven top-level tabs, plus My Library, Cart and the account menu, do not fit on a laptop
header without shrinking text to the point it is hard to read. Grouping the three audience pages is the least
lossy way to keep all seven of his tabs one click away.

**Prompts 9 to 12 are meant to be run in order**, each one after the previous has been checked on localhost.
