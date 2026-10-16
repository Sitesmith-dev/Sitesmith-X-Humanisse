# CLAUDE CODE PROMPT 14: THE REAL COMICS, COVERS AND 3-PAGE PREVIEWS IN THE SECURE READER

Repo: `Sitesmith-X-Humanisse`. Written 2026-10-15. Follows prompts 1–13 (the stamped reader from prompt 13 and the client copy from prompts 9–12 must already be applied).

Before you start, read `AGENTS.md` and the relevant guides in `node_modules/next/dist/docs/` (Route Handlers, `next/image` with `unoptimized`, `outputFileTracingIncludes`).

---

## 1. What this prompt does

The client has supplied nine finished comics as PDFs, in the project folder under `Comics PDFS/`. Replace every placeholder (drawn placeholder pages, "Cover coming soon" covers, old poster covers) with the real artwork for those nine, and give each a **preview of the cover plus the next two pages**, shown in the secure reader from prompt 13 (the one with the "Exclusively for the use of …" stamp). Nothing else of the comics goes on the website at this stage: the remaining pages stay in the PDFs.

| PDF in `Comics PDFS/` | Pages | Slug | Name on the cover |
|---|---|---|---|
| `PDF File-Negotiation.pdf` | 31 | `negotiation` | Negotiation |
| `PDF FIle- Resillence.pdf` | 30 | `resilience` | Resilience |
| `PDF File- Storytelling.pdf` | 32 | `storytelling` | Storytelling |
| `PDF File- Problem Solving.pdf` | 32 | `problem-solving` | Problem Solving |
| `PDF file- Ethics & Sustainability.pdf` | 34 | `ethics-sustainability` | Ethics & Sustainability |
| `PDF File- Decision Sciences.pdf` | 32 | `decision-sciences` | Decision Sciences |
| `PDF File- Active Listening.pdf` | 31 | `active-listening` | Active Listening |
| `PDF File- Art of Difficult Conversation.pdf` | 32 | `difficult-conversations` | The Art of Difficult Conversations |
| `PDF File- Emotional Intelligence.pdf` | 52 | `emotional-intelligence` | Emotional Intelligence |

**There is no PDF for Critical Reading** (`critical-reading`). It stays exactly as it is: drawn "Cover coming soon" cover, no Preview button, and its reader URL shows the existing "not available to read yet" page. Do not invent a cover or pages for it. Report that it is missing.

In every PDF, **page 1 is the cover** and pages 2 onward are the story. The preview is PDF pages 1, 2 and 3 (so the reader opens on the cover, then shows one two-page spread).

---

## 2. Rules

- **Do not commit the PDFs and do not copy them into `public/`, `src/` or anywhere that gets deployed.** They total about 700 MB. Add `/Comics PDFS/` and `/.comic-build/` to `.gitignore`
- **Only the three preview pages per comic leave the PDFs.** Do not render, copy or reference any page beyond page 3
- **Preview pages are never in `public/`.** Anything in `public/` is a plain URL anyone can fetch without logging in, which would let a visitor take clean, unstamped pages. They go through an authenticated route (section 4). Only the **cover** is public, since it is marketing
- No new npm dependencies. `sharp` already ships with Next; check it resolves (`node -e "require('sharp')"`). If it does not, stop and say so rather than adding a package
- Do not touch the comic copy in `comics.ts` (taglines, descriptions, tags, prices), the audience pages, navigation, auth or Supabase code. Do not commit, push or create a branch. Send the `http://localhost:3000` link when done, per `CLAUDE.md`

---

## 3. Build the images (a one-off script)

Create `scripts/build-comic-assets.mjs` (plain Node, ESM) and run it. It is part of the repo so the same thing can be re-run when the client revises a comic or sends the rest of the pages later.

**Rendering needs `pdftoppm` (poppler).** Check `which pdftoppm`. If it is missing, run `brew install poppler` (tell me you did). If Homebrew is not available either, stop and report; do not hand-roll a PDF renderer.

For each row of the table above, the script:

1. Renders **only** pages 1 to 3 at 150 dpi with `pdftoppm -r 150 -f 1 -l 3 -png`, into `/.comic-build/<slug>/` (gitignored, temporary)
2. With `sharp`, writes:
   - `public/comics/<slug>/cover.webp`: page 1, **1000 px wide**, quality 82. This is the catalogue and comic-page cover
   - `comic-pages/<slug>/1.webp`, `2.webp`, `3.webp`: pages 1 to 3, **1600 px wide**, quality 80. The reader's pages. This folder is at the **project root**, not in `public/`
   - `comic-pages/<slug>/1-thumb.webp`, `2-thumb.webp`, `3-thumb.webp`: **240 px wide**, quality 70, for the reader's sidebar
   Keep the original aspect ratio (no cropping, no stretching, no sharpening). Strip metadata
3. Records each comic's `width` and `height` of page 1 and, for page 2, so the aspect ratio is known
4. At the end, writes **`src/content/comic-assets.ts`** (generated, with a header comment saying so and how to regenerate) shaped like:

```ts
export const comicAssets: Record<string, { cover: string; aspect: number; previewPages: number }> = {
  negotiation: { cover: "/comics/negotiation/cover.webp", aspect: 0.667, previewPages: 3 },
  // ...one per comic that has a PDF
};
```

`aspect` is width divided by height of **page 1**, to three decimals. Expect about 0.667 for most comics and about 0.707 for Active Listening (A4). Emotional Intelligence's cover is 0.667 but its inner pages are taller (about 0.56): that is the client's artwork, so keep it as it is and let the reader fit the page (see 5.3). Print every comic's final file sizes at the end. If any 1600 px page is over about 700 KB, lower its quality a little until it is not. Whole-folder budget: under 20 MB for `comic-pages/` and `public/comics/`.

Before moving on, **look at all nine covers and at one page 2 from each comic** (open the generated files) and confirm the cover shows the right title for its slug and that nothing is cut off or blank. Report anything that looks wrong.

---

## 4. The authenticated page route

Create `src/app/api/comic-pages/[slug]/[file]/route.ts` (a Route Handler; check the docs for this Next version's signature for `params`).

- `GET` only. `file` must match `/^[1-9]\d{0,2}(-thumb)?\.webp$/`. `slug` must be a comic that exists, and the page number must be within that comic's `pages.length`. Anything else is a 404. **Never build the file path from raw input beyond those checks**, and resolve it with `path.join(process.cwd(), "comic-pages", slug, file)` after validation
- Require a signed-in reader: `supabase.auth.getClaims()` as in `/api/session`. No session, respond `401` with no body
- Refuse a direct visit to the image in a tab: if the request header `Sec-Fetch-Dest` is `document`, respond 404. (It is only a speed bump, since the Network tab can still see it. Say so in a comment, and do not claim more for it than that)
- Response headers: `Content-Type: image/webp`, `Cache-Control: private, no-store`, `X-Content-Type-Options: nosniff`, `Content-Disposition: inline`, `Cross-Origin-Resource-Policy: same-origin`
- Read the file with `fs.readFile`. Put a comment at the top that this route is the seam for later: when the full comics arrive and live in S3/CloudFront, only the "read the bytes" line changes
- Because it reads files at runtime, deployment tracing must include them. Add `outputFileTracingIncludes: { "/api/comic-pages/[slug]/[file]": ["./comic-pages/**/*"] }` to `next.config.ts` (check the docs for the exact key and glob form in this version). This is the **only** change allowed in `next.config.ts`; do not touch the CSP, which already allows same-origin images

---

## 5. Wire the comics up

### 5.1 `src/content/comics.ts` and `src/types/comic.ts`

- Add to the `Comic` type: `pageAspect: number` (page width divided by height) and `preview: boolean` (true while the reader holds only a preview, so it can say so)
- For the nine comics with a PDF: `coverImage` = `comicAssets[slug].cover`; `pageAspect` = `comicAssets[slug].aspect`; `preview: true`; `pages` = three entries `{ id: "<slug>-1", src: "/api/comic-pages/<slug>/1.webp" }`, `-2`, `-3`. Write the three entries out literally or generate them from `previewPages`, whichever is clearer, but there must be nothing left of the old `{ id: "negotiation-1" }`-style placeholder pages
- For `critical-reading`: `coverImage: ""`, `pages: []`, `pageAspect: 0.667`, `preview: false`
- **Rename the comic whose slug is `difficult-conversations` to "The Art of Difficult Conversations"** (the title printed on its cover, which is the client's own wording). The slug, route and `theme` stay the same. Check every place the title appears is driven by `comic.title` (catalogue card, comic page, cart, library, metadata, reader title, the audience pages' comic links) and fix anything hard-coded. Make sure the long title does not break a catalogue card, the cart row or the library row at 390px
- Do not change anything else in the copy. The old covers from `public/client-assets/comic-posters/` and `public/characters/references/negotiation-cover.png` are no longer used by `coverImage`. **Delete a file only if `grep -rn` shows nothing else references it** (the concept pages and the landing hero use some of these). List what you removed and what you kept

### 5.2 Covers

`ComicCover.tsx` already fills its box with `objectFit: cover` (prompt 9). Check the nine real covers look right on: the catalogue cards, the comic page, the landing "featured comics" shelf, the comics hero fan (it uses resilience, ethics-sustainability, negotiation, storytelling and one more), the cart and the library rows. Cover aspect is about 0.667 to 0.707 against a 432 by 624 box (0.692): confirm nothing important (the title) is clipped on Active Listening, which is the squarest. Remove any remaining "Cover coming soon" for the nine. It stays for Critical Reading only. If the shelf ordering was based on which comics had covers (prompt 9), re-check it still reads sensibly now that nine of ten do

### 5.3 The reader (`src/components/reader/*`)

All of prompt 13's behaviour stays: sign-in required, the three-layer "Exclusively for the use of" stamp on every page, the tamper guard, no print, no save, no context menu. Make the following changes.

1. **Real pages.** `ReaderPage` already renders `src` with `next/image` and falls back to the drawn placeholder if the file fails. Keep that fallback. For sources that start with `/api/comic-pages/`, pass `unoptimized` (the image optimizer would fetch the route without the reader's cookie, and re-encoding a protected page is pointless). Keep `draggable={false}`, the alt text, and `priority` on the first two pages
2. **Real thumbnails.** The sidebar currently draws `ReaderPagePlaceholder` for each thumbnail. Replace it with the page's own thumbnail (`.../<n>-thumb.webp`), same box, same current-page highlight, with the stamp tiling kept. A thumbnail that fails to load falls back to the placeholder
3. **Page shape follows the comic.** The reader hard-codes a 3:4 page (`--ar` 0.75 and 1.5 in `Reader.tsx`, `aspect-ratio: 3 / 4` in `.scrollPage` and `.thumbArt` in `Reader.module.css`). Drive all of them from `comic.pageAspect` instead: one page is `pageAspect`, a two-page spread is twice that. Pages are shown with `objectFit: contain`, so the Emotional Intelligence inner pages, which are taller than its cover, fit inside the page area with a little paper-coloured margin at the sides. That is fine. Do not crop or stretch any artwork
4. **Say it is a preview.** When `comic.preview` is true: the toolbar counter reads `Page 2 of 3 · Preview` (and the pair form likewise); and when the reader is on the last page or spread, show a quiet, non-blocking note at the bottom of the stage, "End of the preview" followed by a **Back to [Title]** link to `/comics/<slug>`. This is wording I wrote, so list it in your report. It must not cover the artwork, must be keyboard reachable, and must not appear on the cover
5. **Layouts.** Check single page, two pages and continuous scroll all work with three pages (the cover alone, then one spread). Keyboard, swipe and edge buttons as before. Zoom works at every level with the real images, and a zoomed page is still stamped
6. **Stamp density against real artwork.** Prompt 13 tuned the tiling against the drawn placeholder pages and said real artwork would need re-tuning. Now it is real. View each comic's pages and check the stamp is legible but does not make a page unreadable, on both the dark (Ethics & Sustainability, Resilience) and the light, busy pages (Negotiation, Storytelling). Adjust the opacity and outline constants in `PageWatermark.tsx` if needed, keeping the density rule from prompt 13 (a 40% by 40% crop of any page must still contain a complete name and email). Report the final values
7. The tamper guard must not false-trigger on image loading, a slow image, or the thumbnail swap. Re-test with network throttling set to "Slow 4G"

### 5.4 Comic page and Preview button

`ComicPanel.tsx` shows the Preview button only when `pages.length > 0`, which is now true for nine comics and false for Critical Reading: that is the behaviour wanted. The button goes to `/read/<slug>`, which sends signed-out visitors to log in and back (prompt 13). Reword the note under the button to `Read the cover and first two pages in the full screen reader`. Confirm Preview works from the comic page for every one of the nine, and that the Library's Read button (purchased comics) also opens the reader (it will show the same three-page preview until the full comics arrive; that is expected, and I will deal with the rest later)

---

## Verification (required)

```bash
npm run lint
npx tsc --noEmit
npm run build
```

All three clean, and the build output must show `/api/comic-pages/[slug]/[file]` as dynamic. Then, in `npm run dev`, signed in:

**Assets**
- [ ] `public/comics/<slug>/cover.webp` exists for exactly nine slugs, and `comic-pages/<slug>/` holds exactly six files each (three pages, three thumbnails). Nothing of any comic beyond page 3 exists anywhere in the repo
- [ ] `git status` does not list `Comics PDFS/` or `.comic-build/`; `.gitignore` covers both
- [ ] Total new asset size is reported and is under the budget

**Covers and names**
- [ ] On `/comics`, nine real covers and one "Cover coming soon" (Critical Reading). Each cover's printed title matches the card's title. The Difficult Conversations card reads "The Art of Difficult Conversations" and fits
- [ ] The same covers on each comic page, the landing featured shelf, the hero fan, the cart and the library, at 1440 and 390px. No clipped titles

**Reader (do this for all nine)**
- [ ] Preview opens `/read/<slug>`: cover first, then pages 2 and 3 as a spread, nothing else. The counter says Preview. The end-of-preview note appears on the last page and links back
- [ ] The "Exclusively for the use of …" strip, the tiling and the line under the page are all present on every page, over the real artwork
- [ ] Sidebar thumbnails and the contact sheet show the real pages
- [ ] Single, two-page and scroll layouts; zoom to 300% and back; fullscreen; arrow keys; swipe on a phone-width window: all work
- [ ] Emotional Intelligence's inner pages fit without cropping or stretching
- [ ] Active Listening (A4) has no odd gaps beside the pages

**Security**
- [ ] Signed out, `/read/negotiation` goes to log in and comes back. Signed out, `curl -I http://localhost:3000/api/comic-pages/negotiation/2.webp` returns 401. Signed in, opening that URL directly in a tab returns 404
- [ ] `/api/comic-pages/negotiation/4.webp`, `/api/comic-pages/negotiation/..%2f..%2fpackage.json` and `/api/comic-pages/nope/1.webp` all return 404
- [ ] `grep -rn "comic-pages" public` finds nothing, and no page image is reachable at a `public/` URL
- [ ] Critical Reading: no Preview button, its reader URL shows "not available to read yet"
- [ ] Tamper guard still works and does not trigger during normal reading on throttled Slow 4G

---

## Note for the human

**Critical Reading has no PDF.** It is the tenth comic on the site, and the only one still on a placeholder. Please ask George for it.

**The reader's pages are served from a login-protected route, not from `public/`.** This is a change from how the placeholder pages worked, and it is deliberate: files in `public/` can be fetched by anyone, with no login, as clean copies without the "Exclusively for the use of" stamp. A logged-in person can still see the image requests in their browser's Network tab, so this raises the bar but is not a lock. The real fix is to stamp each reader's name into the image on the server before sending it. That is possible, but the fonts needed to draw text on the server are not available on Vercel by default, so it needs a proper plan. Raise it with the Sitesmith team before the full comics go on.

**The full comics are not on the site yet.** Only the cover and two pages of each are. When the client is ready, the same script and route take the full set: it is a matter of rendering all pages and storing them in S3/CloudFront, as the build plan describes.

**Name change.** The comic was "Difficult Conversations" on the site; its cover reads "The Art of Difficult Conversations", so the site now matches the cover. Tell George if he prefers the shorter name.

**New wording I wrote:** the "Preview" tag in the reader's counter, "End of the preview", "Back to [Title]", and the Preview button's note. Easy to change.
