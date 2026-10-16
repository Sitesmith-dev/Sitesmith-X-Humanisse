# CLAUDE CODE PROMPT 8: ACCOUNT SYSTEM FIXES — DUPLICATE EMAIL, CONFIRM PASSWORD, SHOW/HIDE EYE, "HI [NAME]" ACCOUNT MENU

Repo: `Sitesmith-X-Humanisse`. Written 2026-10-12. Follows prompts 1–7. Four related changes to login,
signup, password reset and the header. Read this whole prompt before touching anything.

**Read first:** `AGENTS.md` says this Next.js version differs from your training data. Before writing code, check
`node_modules/next/dist/docs/` for anything you rely on (Server Actions, `useActionState`, form reset behaviour).

**Setup first:** the local `node_modules` is missing `@supabase/supabase-js` and `@supabase/ssr`, so `tsc` currently
fails on unrelated imports. Run `npm install` before anything else. Do not edit `package.json` by hand and add no
new dependencies: `lucide-react` and `motion/react` cover everything here.

---

## 0. Files involved

Read all of these before changing any of them:

- `src/lib/auth/actions.ts` — `authenticate` (login / signup / forgot) and `updatePassword`
- `src/components/auth/LoginForm.tsx`, `ResetPasswordForm.tsx`, `Auth.module.css`
- `src/components/auth/useSession.ts`, `src/app/api/session/route.ts`
- `src/components/shared/SiteHeader.tsx`, `Shared.module.css`
- `src/app/login/page.tsx`, `src/app/login/reset/page.tsx`

---

## 1. Existing email: stop the false "we sent you a link"

### The problem

Someone with an account goes to **Create account**, enters their own email, and gets
"Almost there. We sent a link to …, open it to confirm your account". That is wrong: no activation email should go
to an address that already has an account, and the message should say so.

### Why it happens (read this, it decides the fix)

With "Confirm email" switched on, Supabase deliberately does **not** return an error from `signUp` when the email is
already registered, to avoid revealing which emails have accounts. It returns a success response containing an
obfuscated user whose **`identities` array is empty**. The current code treats any non-error as success. Detect it:

In the signup branch of `authenticate`, after `signUp` returns:

1. If `error` is set and (`error.code === "user_already_exists"` or the message contains "already registered"),
   treat it as a duplicate. This covers the case where "Confirm email" is switched off in Supabase.
2. Else if `data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0`, treat it as a
   duplicate. This is the normal case.
3. Otherwise carry on exactly as today.

For a duplicate, **return before the success message** and never call `resend`, `resetPasswordForEmail` or anything
else that sends mail. Do **not** add a service-role key or an admin "does this user exist" lookup: that needs a
secret this project does not have and must not expose.

Known Supabase behaviour to leave alone: if an account exists but was **never confirmed**, `signUp` re-sends the
confirmation email and `identities` is not empty. That is correct, the person genuinely has not activated yet, and
"We sent a link" is accurate for them. Do not try to special-case it.

### The new result state

Add a third state kind to `AuthState`: `"exists"` (alongside `"error"` and `"success"`), returned with
`mode: "signup"` and the email that was entered.

### The message and the way out

In `LoginForm.tsx`, an `"exists"` result renders in the existing `.notice` box, with `role="alert"`, as:

- Bold line: **You already have an account**
- Text: `An account with {email} already exists. Log in, or reset your password if you can't remember it`
- Two buttons side by side (stacked on narrow widths), both at least 44px tall:
  - **Log in** — `btn btn-primary`. Switches to the Log in tab with the email still filled in, and moves focus
    to the password field
  - **Reset password** — `btn`. Switches to the "Reset your password" mode with the email still filled in

The email must survive the switch. **Gotcha:** React 19 resets uncontrolled inputs in a `<form action>` after the
action completes, so today a failed or duplicate submit blanks the email. Make the name, email and password
inputs controlled (state in `LoginForm`, passed as `value` / `onChange`, keeping their `name` attributes so
`FormData` still works) and confirm the email, name and passwords all survive a failed submission and a mode
switch. Passwords may be cleared after a **successful** signup, but never after an error.

---

## 2. Confirm password, a hard match rule, and the live tick / cross

Applies to **Create account** and to **Choose a new password** (`ResetPasswordForm`). Not to Log in.

### Create account: new field

Add a **Confirm password** field directly under Password. Same styling as Password (lock icon, same
`.input` treatment), label `Confirm password`, placeholder `Type it again`, `autoComplete="new-password"`,
`name="confirm"`, `required`.

### Shared logic

Build one small hook and one small component so signup and reset behave identically, rather than duplicating:

- `src/components/auth/usePasswordPair.ts` — holds `password` and `confirm` state and returns
  `{ password, confirm, setPassword, setConfirm, touched, matches, ready }`, where `matches` is
  `password === confirm` (exact, case-sensitive, no trimming), `touched` is true once the confirm field has any
  text, and `ready` is `password.length > 0 && matches`
- `src/components/auth/PasswordPair.tsx` — renders both fields (using the show/hide input from section 3) and the
  status line below

### The status line

Directly **above the Confirm password input** (between the Password field and the Confirm field, which is where
the user asked for it), shown only once `touched` is true, never on an empty confirm field:

- Match: a check icon plus **Passwords match**, in a green. Use a single local custom property in
  `Auth.module.css` (for example `--ok: #1F7A3D`, which clears contrast on white). Do not add it to `globals.css`
- Mismatch: an **X** icon plus **Passwords do not match**, in `var(--coral)`

Use lucide `Check` and `X`, 16px, `aria-hidden`. The text carries the meaning so colour is never the only signal.
Wrap the line in `aria-live="polite"` so screen readers hear the change once, and reserve its height so the form
does not jump as it appears. It updates live as the user types in **either** field, so changing the first
password after confirming it flips the line to the cross immediately.

### The hard rule

- **Create account** and **Save password** are `disabled` (the real attribute, not just styling) until `ready`.
  Wire `aria-describedby` to the status line. The existing disabled button style in `globals.css` is fine
- Enforce it on the **server too**. In `authenticate`, signup mode must read `confirm` and, if it differs from
  `password`, return `fail("The two passwords don't match")` **before** calling `signUp`. `updatePassword`
  already does this check, keep it. A disabled button is not a security boundary
- This rule applies only to creating an account and resetting a password. Log in has no confirm field and its
  button is never blocked by it

### Name is now required on signup

The header now depends on the name (section 4), so make it required: add `required` to the input, and in
`authenticate` signup mode `fail("Please enter your name")` if the trimmed value is empty. Trim it, collapse
repeated spaces, and cap it at 60 characters before sending it to Supabase as `full_name`.

---

## 3. Show / hide password eye on every password field

**New file:** `src/components/auth/PasswordInput.tsx`

A reusable password field wrapper that renders the existing `.input` shell (lock icon on the left, input, eye
button on the right) and is used for **every** password input in the app: Log in, Create account (both fields),
and Reset password (both fields). No password field may be left without it.

Behave like the eye on any mainstream site:

- A `type="button"` control inside the input shell, on the right. It never submits the form
- Starts **hidden** (`type="password"`). One tap switches the input to `type="text"` and the user sees what they
  typed. Another tap hides it again. Each field toggles independently of the others
- Icon: lucide `Eye` while the text is hidden (tap to show), `EyeOff` while it is visible (tap to hide)
- Accessible: `aria-label` is `Show password` / `Hide password` to match the action, `aria-pressed` reflects the
  state, and at least a 44x44 touch target. Keyboard focusable with a visible focus ring, toggled with
  Enter or Space
- Toggling must **not** lose the typed text, the focus or the caret position. Use `onMouseDown={e =>
  e.preventDefault()}` on the button so focus stays in the input, and keep the input mounted (change only its
  `type`)
- Reset to hidden whenever the field unmounts or the form mode changes (the existing `AnimatePresence` already
  unmounts it, so this should come free, verify it)
- Hide the browser's own reveal control so there are not two eyes: in `Auth.module.css` add
  `.input input::-ms-reveal, .input input::-ms-clear { display: none; }`
- Add `autoCapitalize="off"`, `autoCorrect="off"` and `spellCheck={false}` to the input
- Pass through `name`, `value`, `onChange`, `autoComplete`, `placeholder`, `required`, `minLength`, `id` so it
  drops into the existing forms. Login uses `autoComplete="current-password"`, everything else
  `"new-password"`

---

## 4. Header: "Hi [Name]" and a profile menu with Log out

**Files:** `src/components/shared/SiteHeader.tsx`, new `src/components/shared/AccountMenu.tsx`,
`Shared.module.css`

Today a signed-in reader sees a plain **Log out** button at the top right. Replace it with an account control.
Signed-out readers still see **Log in**, unchanged.

### The control

One button (so the whole thing is a single large target), made of:

- The text **Hi {name}**, no comma, where `{name}` is `session.name` from `useSession` (it already comes from
  `/api/session`, which reads the `full_name` the person gave at signup, so no new data plumbing is needed)
- Beside it a small circular **profile icon** (lucide `UserRound` or `CircleUser`, check which is exported by the
  installed `lucide-react` version) with the site's ink border and paper background
- Styled to match the current header buttons (`btn`, ink outline, hard offset shadow), not a new look

Edge cases:

- Empty or missing name: show **Hi there**
- Long names: `max-width` around 14ch with `text-overflow: ellipsis`, never wrapping and never pushing the nav
- Below the existing small breakpoint (the one that already hides the "Cart" label via `.hideSm`), hide the
  "Hi {name}" text and keep only the icon. The button's `aria-label` is always
  `Account menu, signed in as {name}` (or `Account menu` with no name)
- Render the name as plain text through React, never as HTML
- **No flash:** `useSession` is `null` until the first answer, and today that shows "Log in" to a signed-in reader
  for a moment. While `session === null`, render an invisible placeholder the same size as the button instead of
  either state, so the header neither flashes nor shifts

### The menu

Tapping the control opens a small dropdown **directly under it**, right-aligned to the button, containing one item:

- **Log out** — keep it as the existing `<form method="post" action="/auth/signout">` with a submit button
  (`role="menuitem"`), with the `LogOut` icon. Do **not** convert it to a Server Action or a client-side
  `fetch`: the comment in `src/app/auth/signout/route.ts` explains why it is a full-page POST, and that must stay

Style it as a panel in the site's language: paper background, `var(--line)` border, `var(--radius)`, hard offset
shadow `var(--pop)`, a gap of about 8px below the button, and a `z-index` above page content but below the
comic pop-up. Animate it in over about 150ms with `motion/react` (fade and 6px rise), and make it instant under
`prefers-reduced-motion` (the app's `MotionConfig reducedMotion="user"` already handles this for `motion`).

Behave as a proper accessible menu:

- Trigger has `aria-haspopup="menu"` and `aria-expanded`
- Opening moves focus to the first item, `Escape` closes and returns focus to the trigger
- A click or tap outside closes it, and so does moving focus out with Tab
- Closes on any route change (watch `usePathname`) and when the header hides itself on scroll-down (the
  `setHidden(true)` path), so it is never left floating detached from its button
- Check `Shared.module.css` before positioning: the header uses `backdrop-filter`, which creates a containing
  block, and it is translated off-screen when hidden. Verify the dropdown is not clipped by either

The menu only holds Log out for now. Do not add My Library, Settings or anything else to it.

---

## 5. Do not touch

- `supabase/schema.sql`, the email templates, `src/proxy.ts`, `src/lib/supabase/*` and the one-device-per-account
  logic in `src/lib/auth/session.ts` and `claimThisDevice`
- `/auth/confirm` and `/auth/signout` route handlers
- The cart, the comic pop-up, the reader, the concepts system, the landing page and `ComicsHero`
- `globals.css` (all new styles go in `Auth.module.css` and `Shared.module.css`)
- `next.config.ts`, `package.json` — no new dependencies
- The Supabase dashboard settings. This prompt changes code only
- Do not commit. Do not push. Do not create a branch. When done, send the `http://localhost:3000` link per
  `CLAUDE.md`

---

## Verification (required)

```bash
npm run lint
npx tsc --noEmit
```

Both must produce zero output. Then run `npm run dev`. If there is no `.env.local` with the Supabase URL and key,
the live auth checks cannot run: say so plainly in your report, list which checks above were therefore not
exercised, and do everything that does not need Supabase (all UI behaviour below).

**Duplicate email** (needs a live Supabase project and an existing confirmed account)
- [ ] Create account with an existing email shows "You already have an account" and **no** activation email
      arrives in that inbox
- [ ] **Log in** switches to the Log in tab with the email still filled in and focus in the password field
- [ ] **Reset password** switches to the reset mode with the email still filled in
- [ ] A genuinely new email still gets the "We sent a link" message and the activation email
- [ ] The email, name and passwords survive a failed submission

**Confirm password**
- [ ] Create account has a Confirm password field under Password
- [ ] Nothing shows until the confirm field has text. Matching shows a green tick and "Passwords match",
      differing shows an X and "Passwords do not match", above the confirm input
- [ ] Editing the first password after confirming flips the line immediately
- [ ] Create account is disabled until both match, and enabled the moment they do
- [ ] Forcing the button enabled in devtools and submitting mismatched passwords is still rejected by the server
- [ ] The same field, status line and disabled rule are on Choose a new password
- [ ] Log in is unaffected, and its button is never disabled by this rule
- [ ] Signup with an empty name is rejected

**Eye toggle**
- [ ] Every password field in the app (login, both signup fields, both reset fields) has an eye
- [ ] One tap shows the text, another hides it, each field independently
- [ ] Toggling keeps the typed text, focus and caret position, and never submits the form
- [ ] Works by keyboard (Tab, Enter, Space) and the label announces Show / Hide password
- [ ] Only one eye appears in Edge, no duplicate browser reveal icon
- [ ] Switching tabs or modes leaves the field hidden again

**Header**
- [ ] Signed in: the header shows "Hi {the name given at signup}" and a profile icon, not a Log out button
- [ ] Signed out: still shows Log in, with no flash of the wrong state on load
- [ ] Tapping it opens a dropdown under the button with Log out, and Log out signs the reader out and lands on `/`
- [ ] Escape, outside click and Tab-away close it, and Escape returns focus to the button
- [ ] The menu closes on navigation and when the header hides on scroll
- [ ] A very long name is truncated with an ellipsis, a missing name reads "Hi there"
- [ ] On a phone width only the icon shows, and the menu still opens and is not clipped
- [ ] With `prefers-reduced-motion: reduce` the menu opens instantly
- [ ] Nothing else in the header moved: logo, Comics, My Library and Cart look and behave as before

---

## Note for the human

**The "already registered" message tells strangers which emails have accounts.** That is the trade you asked for,
and Supabase hides it by default for exactly this reason. For a children's product it is an acceptable, common
choice, but be aware of it. Supabase's own rate limits on sign-up already blunt automated probing, and it is worth
keeping them switched on.

**It depends on "Confirm email" being on** in the Supabase dashboard (Authentication, Providers, Email). The code
handles both settings, but the empty-`identities` behaviour is what you will see in production, and you should
test it once with a real address before the client walkthrough on the 14th. It cannot be proved without a live
project.

**One case still says "We sent a link" for someone who has an account:** an account that was created but never
activated. Supabase re-sends the activation email for those, and that is the right outcome for them.

**Noticed, not changed here:** the footer's nav still shows "Log in" to signed-in readers. Say the word and I will
write that up as a small follow-up prompt.
