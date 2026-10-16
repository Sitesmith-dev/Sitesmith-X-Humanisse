# CLAUDE CODE PROMPT 15: FIX THE LAST NAME FIELD OVERFLOW, AND TIGHTEN THE PASSWORD GAP

Repo: `Sitesmith-X-Humanisse`. Written 2026-10-15. Follows prompts 1–14. Two small CSS fixes on the Create account tab. Do not commit, push or branch. Send the `http://localhost:3000/login` link when done, per `CLAUDE.md`.

Files: `src/components/auth/Auth.module.css` (and only if truly needed `LoginForm.tsx`, `PasswordPair.tsx`).

---

## 1. Last name field runs out of the card

**Symptom (desktop, Create account tab):** the First name and Last name fields sit side by side, but the Last name box is wider than its column and is cut off by the card's right edge. Its right border and rounded corner are missing, and the two boxes are different widths.

**Cause to confirm first:** `.nameRow` uses `grid-template-columns: 1fr 1fr` (from 480px up). A `1fr` track will not shrink below its content's minimum width, and each cell contains a text input, which has its own default width. So the columns grow past the card, and the `.collapse` wrapper (`overflow: hidden`) clips the overflow. Confirm this in dev tools before changing anything.

**Fix:**
- `.nameRow`: use `grid-template-columns: repeat(2, minmax(0, 1fr))` from 480px up (keep one column below 480px, and keep the 12px column gap)
- Give the grid cells and the field wrapper `min-width: 0`: `.nameRow > .field { min-width: 0; }`
- Check `.input` and `.input input` keep `min-width: 0` (the input already has it) so the input can shrink inside its flex box
- Make the two name boxes exactly the same width as each other, and the pair exactly as wide as the Email, Password and Confirm boxes below (left edge of First name = left edge of Email, right edge of Last name = right edge of Email)
- Make sure the **focus ring** (the 3px outline plus the 4px gold shadow in `.input:focus-within`) is not clipped on the outer edges of either name box by the `overflow: hidden` on `.collapse`. If it is, give the name row a few pixels of inner padding with an equal negative margin, or switch the clip to `overflow: clip` with `overflow-clip-margin`, so the ring shows in full and the boxes still line up with the fields below

Do not change the collapse animation, the labels or the field order.

## 2. Password and Confirm password gap

The gap between the Password box and the Confirm password label is larger than it needs to be (about 40px, from the field's 16px bottom margin, plus the 24px "Passwords match / do not match" row and its margins). Reduce it by roughly 8px, to about **32px**, keeping the match message fully visible with room to breathe:

- `.match`: `height: 20px; margin: -8px 0 4px;` (it is currently `height: 24px; margin: -8px 0 8px`). The text is `.95rem` with `line-height: 1.2`, so it fits in 20px; confirm it is not clipped, including the tick and X icons
- Do not remove the reserved space when nothing is shown: the row must keep its height even when empty so the form does not jump when the message appears

## Verification

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Then in `npm run dev`, on `/login` → Create account, at 1440, 1024, 820, 480, 390 and 360px wide:

- [ ] First and Last name boxes are the same width, fully inside the card with all four borders and rounded corners visible, and their outer edges line up with the Email box. Nothing is clipped at any width
- [ ] Below 480px they stack, each full width
- [ ] Typing a very long first and last name (40 characters each) does not widen the boxes or the card
- [ ] Focus ring shows in full on both name boxes
- [ ] Type a password, then a different confirmation: "Passwords do not match" with the X is fully visible; a matching one shows "Passwords match" with the tick. The layout does not jump when it appears or disappears, and the gap is visibly tighter than before
- [ ] Switching to Log in and Forgot password tabs: layout unchanged from before, no stray spacing
- [ ] The reset-password page (`/login/reset`) uses the same password pair, so check its gap too
