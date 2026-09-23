# CLAUDE CODE PROMPT 7: BLOCK SAVE-PAGE, AND TELL THE READER WHY

Repo: `Sitesmith-X-Humanisse`. Written 2026-09-23. Small patch prompt. Follows prompts 1–6.

---

## 0. Why this exists

Prompt 6 deliberately left `Cmd/Ctrl+S` unblocked, on the stated reasoning that saving the page
only captures HTML and the artwork lives elsewhere. **That reasoning was wrong for this reader.**

The placeholder pages are drawn in inline CSS and SVG — they *are* the document. "Save Page As →
Webpage, Complete" therefore hands over a fully working copy of the comic. It stays a live vector
once real artwork lands too, because "Webpage, Complete" pulls referenced images down into a
`_files` folder beside the HTML.

This prompt closes the keyboard path and makes both blocked shortcuts explain themselves.

---

## 1. Intercept Cmd/Ctrl+S

**File:** `src/components/reader/Reader.tsx`, the `onKey` handler, beside the existing
`Cmd/Ctrl+P` interception on line 146.

Add the same treatment for `s` / `S`. Keep it in the same position in the handler — after the
`defaultPrevented` and `INPUT`/`TEXTAREA` guards, before the navigation keys — so it never fires
while the view menu has focus or a field is being typed into.

Update the comment above the pair to say what it now covers, and to be accurate about the limit:
the keyboard path is caught, but **File → Save Page As from the browser menu fires no key event
and cannot be intercepted**, exactly as with printing.

---

## 2. Tell the reader what happened

A shortcut that silently does nothing reads as a broken page, not a deliberate block. Both
intercepted shortcuts should say so briefly.

Show a small transient notice in the reader when either is swallowed:

- `Cmd/Ctrl+S` → `Humanisse comics are read online and cannot be saved`
- `Cmd/Ctrl+P` → `Humanisse comics are read online and cannot be printed`

Reuse the existing `.awayNote` visual treatment in `Reader.module.css` line 146 — paper
background, ink border, hard offset shadow — rather than inventing a second notice style. Place
it so it does not cover the spread: bottom centre of the reading area is fine.

It should fade in, hold for about two and a half seconds, then fade out, and it must respect
`prefers-reduced-motion` by appearing and disappearing instantly. Pressing the shortcut again
while it is showing restarts the timer rather than stacking a second notice.

Give it `role="status"` and `aria-live="polite"` so it is announced once, and `pointer-events:
none` so it can never intercept a click or a page turn.

Make sure it is hidden in the `@media print` block alongside `.awayNote` on line 153 — a notice
about printing should not itself appear in a print job.

---

## 3. Do not touch

- Everything else in the `onKey` handler — arrows, `Home`, `End`, `f`, `Escape`, the fullscreen
  and close behaviour
- The `@media print` backstop, the watermark, the context-menu and drag handlers, `BLUR_ON_BLUR`
- The reader's layout, spread pairing, zoom, view menu or sidebar
- Anything outside `src/components/reader/`
- **Do not attempt any deeper fix here.** No canvas rendering, no blob handling, no asset
  obfuscation. The real answer to Save Page As is rendering real artwork to `<canvas>`, and that
  belongs with the server-side security work, not in a patch
- `next.config.ts`, `package.json` — no new dependencies
- Do not commit. Do not push. Do not create a branch.

---

## Verification (required)

```bash
npm run lint
npx tsc --noEmit
```

Both clean. Then at `/read/negotiation`:

- [ ] `Cmd/Ctrl+S` does not open the save dialog, and the "cannot be saved" notice appears
- [ ] `Cmd/Ctrl+P` still does not open the print dialog, and the "cannot be printed" notice appears
- [ ] Each notice fades out on its own after roughly two and a half seconds
- [ ] Pressing the same shortcut repeatedly restarts the timer and never stacks notices
- [ ] The notice never covers the spread and never blocks a click, swipe or page turn
- [ ] Arrow keys, `Home`, `End`, `f` and `Escape` all still behave exactly as before
- [ ] Neither shortcut is swallowed while typing in a field or while the view menu has focus
- [ ] Printing from the browser menu still yields only the "cannot be printed" page, with no
      notice text in the print output
- [ ] `Cmd/Ctrl+S` still works normally everywhere else on the site
- [ ] With `prefers-reduced-motion: reduce`, the notice appears and disappears instantly
- [ ] A screen reader announces each notice once

---

## Note for the human

**This closes the shortcut, not the hole.** File → Save Page As from the browser's own menu still
works, and no web page can prevent that — same limitation as printing, which is why the print
stylesheet exists as a backstop. There is no equivalent backstop for saving.

The real fix is architectural and lands with the security prompt: real pages render to
`<canvas>`, fetched as blobs with the object URL revoked immediately, so a saved copy gets an
empty canvas and nothing re-draws without a live authenticated session.

Worth knowing so you do not chase it: **the CSS placeholder pages will remain savable whatever we
do**, because they are markup rather than images. Rasterising them would be work spent protecting
assets that are not the product. What matters is that the canvas path is in place before real
artwork ever loads.
