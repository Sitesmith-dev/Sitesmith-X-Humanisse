# CLAUDE CODE PROMPT 16: A QUIET, SPARSE STAMP ON THE READER (READS LIKE THE PLAIN COMIC, STILL TRACEABLE IN A SCREENSHOT)

Repo: `Sitesmith-X-Humanisse`. Written 2026-10-15. Follows prompts 1–15 (the stamped reader from prompt 13 and the real pages from prompt 14 must be applied). This one prompt replaces what were drafts 16 and 17: if you were given either of those, ignore them and use this. Do not commit, push or branch. Send the `http://localhost:3000` link when done, per `CLAUDE.md`.

Files: `src/components/reader/PageWatermark.tsx`, `Reader.module.css`, `useStampGuard.ts`, and the stamp constants in `Reader.tsx`. Nothing else.

---

## 1. The problem

With real artwork on the pages, the stamp from prompt 13 is too loud and too frequent. On a Negotiation spread: the diagonal "Exclusively for the use of … - email" text repeats all over the page, has a pale halo around each letter, runs across speech bubbles and faces, and a large ghosted "Humanisse" sits over everything. The page looks crowded, it catches the eye while reading, and some bubbles are harder to read. The client's rule is the reverse:

- **Reading must not be affected at all.** A reader should be able to read a whole comic without the stamp catching their eye, and the page should look like the plain comic
- **A screenshot must still carry the name and email**, legible when someone looks for it, and impossible to crop away without losing the middle or an edge of the page

Two changes get there: make each mark **low contrast but not small** (it should shift the tone slightly rather than paint a coloured mark over the art), and use **few marks**, placed in the middle and near the edges, instead of covering the whole page.

## 2. What I tested

I overlaid five styles on real Negotiation and Ethics & Sustainability pages (light, busy art and dark art) and compared them:

| Style | Result |
|---|---|
| Ink fill 20% with a paper-coloured outline, bold display font, dense (the reader now) | Heavy. The outline makes a pale halo that is the most distracting part |
| **White text with `mix-blend-mode: difference`, 16% opacity, medium weight, no outline** | **Best.** It lightens dark areas and darkens light areas slightly, so it reads on the white whiteboards and the dark classroom art alike, with no halo. Bubbles stay readable |
| Same at 12% opacity, light weight | Quieter still, but thin strokes start to vanish over busy art. Fallback if 16% is still noticeable |
| Ink 9% with no outline | Calm on light pages, nearly gone on dark art. Unreliable |
| Mid-grey 14% with no outline | Good everywhere and needs no blend mode. **Use this if `mix-blend-mode` causes any problem** |

## 3. Changes

### 3.1 Five placed marks instead of a tiling (`PageWatermark.tsx`)

**Remove the repeating `<pattern>` tiling.** Draw exactly **five** marks per page as explicit text, not a pattern. Coordinates are percentages of the page (x across, y down), each mark **centred** on its point:

| Mark | x | y |
|---|---|---|
| Top left | 24% | 12% |
| Top right | 76% | 12% |
| **Middle** | 50% | 50% |
| Bottom left | 24% | 88% |
| Bottom right | 76% | 88% |

An X shape: four near the corners, one in the centre, all clear of the page's outer edge so none is clipped.

Each mark is the stamp built in prompt 13 as **two lines**, `Exclusively for the use of First Last` over the email, rotated **-30°** about its own centre, `text-anchor: middle`. The whole sentence must still exist as one string in the DOM for the guard (a `<title>` or one `<text>` per mark is fine). Styling:

- **Fill:** white `#fff`, **no stroke at all** (remove `stroke`, `stroke-width`, `paint-order`)
- **Blend:** `mix-blend-mode: difference` on the SVG, and `isolation: isolate` on `.leaf` so the blend only sees that page's artwork. Opacity **0.16**
- **Font:** the site's body font (`var(--font-text)`), **weight 500**, letter-spacing about `0.01em`. **Not** the heavy display font (`var(--font-head)`, weight 700) the mark uses today; its thick strokes are a big part of why it looks loud
- **Size:** about **1.8% of the page width (W)** for line 1 and the same for the email, with the second line about 1.25 × the font size below the first. There are far fewer marks than before, so each one is a little larger, to stay legible in a screenshot. Size buys legibility with much less visual noise than opacity does
- Marks must not run off the page: the longest allowed name and email (40 characters each, from prompt 13) must fit. If a line would be too wide, shrink that mark with `textLength`/`lengthAdjust`
- The SVG's user space stays page-relative so it scales with zoom, and its viewBox height comes from `comic.pageAspect` (prompt 14), so marks are not distorted by the page's shape
- One element holds the five marks, still carrying `data-stamp="tiles"` for the guard
- Keep `aria-hidden`, `focusable="false"`, `pointer-events: none`, `user-select: none`. Thumbnails use the same component, so they get the same five marks (tiny and unreadable at that size, which is fine)

If `mix-blend-mode: difference` misbehaves in any browser (a visible box, a missing stamp, a flash during page turns), switch to the fallback: mid-grey `#808080`, normal blend, opacity **0.14**, same font, size and positions. Say which you shipped.

### 3.2 Remove the repeating "Humanisse" mark

The ghosted "Humanisse" tiling goes entirely: the page is sparse on purpose, and the name and email stamp is the protection. Do not replace it with anything. Say that you removed it.

### 3.3 The line along the foot of each page

The strip inside each page (layer 2 from prompt 13) must **never cover comic content**. The comics have caption boxes close to the bottom edge. Check every page of every comic: the strip must sit in the page's bottom margin, or be thin enough (about 2.5% of the page height at most, text about 1.3% of W) to clear the artwork. If a page's artwork reaches the bottom edge, drop the dark bar and use the same white difference-blend text as the marks. The line under the page (layer 3) is outside the artwork and stays as it is.

### 3.4 Keep the tamper guard working

`useStampGuard.ts` currently checks the old tiling. Update it so that, for each visible page, the `data-stamp="tiles"` element contains **five** text marks, each with the exact stamp text, real size, not hidden (`display`, `visibility`, opacity compared against the new constants, bounding box). Deleting or hiding any one of the five, or the foot strip, must trigger the paused message from prompt 13. Update the opacity constants so the guard accepts the quieter stamp but still catches an element made nearly invisible. A blend mode and the `isolation` change must not cause a false trigger. Normal reading, page turns, zoom, fullscreen and layout changes must not trigger it either.

---

## 4. The new protection rule

With only five marks, a very tight crop of one panel can miss all of them. That is accepted. The rule from prompt 13 ("a 40% by 40% crop contains a full name and email") is **replaced** by: **any crop covering about half a page (the whole top half, bottom half, one full column, or a 70% by 70% area) must contain at least one complete, legible name and email**, and the middle mark must be inside every crop that keeps the middle of the page.

## 5. Tuning, then verifying

Do this with real pages, at the default layout on a 1440 px and a 1280 px wide window, and again at 150% and 50% zoom:

1. **Read** the first spread of **Negotiation, Ethics & Sustainability, Resilience, Storytelling and Decision Sciences** (light and dark pages). Read every speech bubble and caption. The stamp must not make you stop, squint or lose your place, and the page should look like the plain comic. If you notice it while reading, lower opacity a little (never below 0.10 for the difference blend) or reduce the font size slightly, and look again
2. **Screenshot** a spread (retina-scale if you can) and look at it at 100%. The full name and email must be **legible** at each mark. If not, raise the font size before raising opacity
3. **Crop** the top half, bottom half, left half, right half and a 70% by 70% centred area, for a left and a right page. Each crop must contain at least one complete name + email
4. On a spread, no mark may be clipped by the page edge or dimmed by the spine's shadow. If the spine dims the inner marks, move the inner x values to 28% and 72%
5. Look at every page of Negotiation, Ethics & Sustainability, Resilience and Active Listening. A mark may cross art, but if one lands on a caption or speech bubble and makes it hard to read, nudge that mark within about 4% of its position, **the same for every page and every comic**, not per page
6. The stamp must be findable on both dark pages (Ethics & Sustainability, Resilience) and light pages (Negotiation, Active Listening)

Also confirm, still working: page turns with no flicker of the stamp, zoom to 300% and back, single / two-page / scroll layouts, fullscreen, the sidebar thumbnails, reduced motion, the tamper guard (delete one mark, then hide another: both pause the reader; ordinary reading never does), and `npm run lint`, `npx tsc --noEmit` and `npm run build` all clean.

Report the final values you shipped (font size, opacity, blend or fallback, the five coordinates) and attach before and after screenshots of the same spread.

---

## Note for the human

This cannot be made fully invisible while reading and still be useful, so the aim is: you do not notice it unless you look for it, and it is unmissable in a screenshot you share. Judge it yourself on a real page. If it still bothers you, the next step down (12% opacity, light weight) is already described above. If it feels busy, drop the four corner marks to two (top left and bottom right) and keep the middle one. If it feels too sparse, add two side-edge marks at (8%, 50%) and (92%, 50%).

Five marks is a deliberate trade: calmer pages, and a slightly easier job for someone determined to crop. A very small crop of one panel can avoid all five, but anything about half a page or larger carries a name, and the middle of every page is stamped.

The repeating brand "Humanisse" mark is gone. If George wants it back it can return as a single very faint mark.

The same limit as before applies: this deters and identifies, it does not make a screenshot impossible. Stamping the name into each page image on the server is still the stronger fix, for later.
