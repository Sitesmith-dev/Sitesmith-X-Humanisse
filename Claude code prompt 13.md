# CLAUDE CODE PROMPT 13: PER-READER ATTRIBUTION ON THE SECURE READER, AND FIRST + LAST NAME AT SIGNUP

Repo: `Sitesmith-X-Humanisse`. Written 2026-10-14. Follows prompts 1–12 (prompt 8's signup and password work must already be applied).

Before you start, read `AGENTS.md` and the relevant guides in `node_modules/next/dist/docs/` (this is Next.js 16: check how `cookies()`/dynamic rendering interacts with `generateStaticParams`, and how `proxy.ts` works).

---

## 1. What this prompt does

Screenshots cannot be blocked, so the reader has to make a leaked screenshot **traceable**. Like HBR's case studies ("Exclusively for the use of …"), every page the reader shows will carry the signed-in reader's real name and email, in a way that cannot be cropped out. Three parts:

1. **Signup collects first name and last name as two required fields**, and stores them in a place the reader cannot edit afterwards
2. **The reader stamps every page** with `Exclusively for the use of [First] [Last] - [email]`, both as a visible line on the page and as a dense diagonal tiling over the artwork, and notices if someone tampers with it
3. **The reader is only reachable when signed in**, so every view is attributable. This includes the Preview button on a comic page

Exact stamp text, character for character (a plain hyphen with a space either side, as the client specified):

```
Exclusively for the use of Jane Doe - jane.doe@example.com
```

---

## 2. Files to read first

`src/lib/auth/actions.ts`, `src/components/auth/LoginForm.tsx`, `src/components/auth/Auth.module.css`, `src/app/api/session/route.ts`, `src/lib/supabase/proxy.ts`, `src/lib/supabase/server.ts`, `supabase/schema.sql`, `src/app/read/[slug]/page.tsx`, and in `src/components/reader/`: `Reader.tsx`, `PageWatermark.tsx`, `ReaderPagePlaceholder.tsx`, `Reader.module.css`. Also `grep -rn "authenticate\|full_name" src` to find every user of the signup action or the name.

---

## 3. Signup: first name and last name

In `LoginForm.tsx`, replace the single "Name" field (signup tab only) with two fields, **First name** and **Last name**, both `required`, side by side from about 480px up and stacked below that. Use the existing field, icon and input styles. `autoComplete="given-name"` and `"family-name"`. Keep the same collapse animation the Name field has. Keep them **controlled** (React 19 resets uncontrolled inputs after a Server Action; the existing `name` state shows the pattern).

In `authenticate` (signup branch):

- Read `firstName` and `lastName`. Trim each and collapse inner whitespace
- Both are required. Error messages: "Please enter your first name" / "Please enter your last name"
- Each must contain at least one letter (`/\p{L}/u`) and be at most 40 characters. Message: "Please enter your real first name" / "…last name" for the letter rule
- Reject control characters and invisible or direction-changing characters (`/[\p{C}​-‏‪-‮⁦-⁩]/u`). Someone could otherwise use them to scramble how the stamp reads. Same message as the letter rule
- Remove the old single `name` handling and the old "Please enter your name" message
- Pass to Supabase: `options.data = { first_name, last_name, full_name: `${first_name} ${last_name}` }`. Keep `full_name`, the header's "Hi [Name]" and `/api/session` depend on it. Do not change what the header shows, except: make `/api/session` return `first_name` when present, falling back to the first word of `full_name`, so the header says "Hi Jane" rather than "Hi Jane Doe". If that change is not trivial, leave the header alone and say so

Everything else about signup (duplicate-email handling, confirm password, eye toggles) stays exactly as prompt 8 left it. Check `src/concepts/**` for any signup form posting to `authenticate`; if one exists, give it the same two fields so it does not break.

---

## 4. Where the name is stored, and why

`user_metadata` is **writable by the user** (any signed-in browser can call `supabase.auth.updateUser({ data: { first_name: "Someone Else" } })`), so a stamp read from it could be faked. The email is safe (it is verified, and it comes from the signed token). The name must come from a table the user cannot write to.

Add to `supabase/schema.sql` (idempotent, same style as the rest of the file):

```sql
-- ─── Profiles: the name printed on the reader ────────────────────────────────
-- Copied once from the signup form by a trigger. Readers can read their own row but there is no insert, update
-- or delete policy, so the name on their pages cannot be edited from the browser afterwards.
create table if not exists public.profiles (
  id         uuid        primary key references auth.users (id) on delete cascade,
  first_name text        not null default '',
  last_name  text        not null default '',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Readers see their own profile" on public.profiles;
create policy "Readers see their own profile" on public.profiles
  for select to authenticated using ((select auth.uid()) = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  fn text := btrim(coalesce(meta ->> 'first_name', ''));
  ln text := btrim(coalesce(meta ->> 'last_name', ''));
  full_name text := btrim(coalesce(meta ->> 'full_name', ''));
begin
  -- Accounts made before first/last were collected only have a single name, so split it at the first space
  if fn = '' and full_name <> '' then
    fn := split_part(full_name, ' ', 1);
    ln := btrim(substr(full_name, length(fn) + 1));
  end if;
  insert into public.profiles (id, first_name, last_name) values (new.id, left(fn, 40), left(ln, 40))
  on conflict (id) do nothing;
  return new;
end;
$$;

revoke all on function public.handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- One-off backfill for accounts that already exist
insert into public.profiles (id, first_name, last_name)
select u.id,
       left(split_part(btrim(coalesce(u.raw_user_meta_data ->> 'full_name', '')), ' ', 1), 40),
       left(btrim(substr(btrim(coalesce(u.raw_user_meta_data ->> 'full_name', '')), length(split_part(btrim(coalesce(u.raw_user_meta_data ->> 'full_name', '')), ' ', 1)) + 1)), 40)
from auth.users u
on conflict (id) do nothing;
```

You cannot run SQL against Supabase from here. Do **not** try. Add it to `schema.sql` and say clearly in your report that the owner must paste this block into the Supabase SQL editor before the reader will show names. The reader must still work without it (see 5.2: it falls back).

---

## 5. The reader

### 5.1 Make it require sign-in (fail closed)

- In `src/lib/supabase/proxy.ts`, add `"/read"` to `PROTECTED` so signed-out visitors go to `/login?next=/read/<slug>`. Check that `next` survives the login round trip (`safeNext` in `redirect.ts`) and lands back on the reader
- Do not rely on that alone: `src/app/read/[slug]/page.tsx` must also look the user up itself and `redirect()` to the login page if there is no verified session. **The reader must never render pages without an identity to stamp on them**
- Preview and full reading are the same component and the same route, so both are covered. When real full-length comics arrive there is nothing more to wire: the same stamp applies

### 5.2 Get the identity on the server

In `src/app/read/[slug]/page.tsx` (server component):

```ts
const supabase = await createClient();
const { data } = await supabase.auth.getClaims();
const claims = data?.claims;
if (!claims) redirect(`/login?next=${encodeURIComponent(`/read/${slug}`)}`);
const email = String(claims.email ?? "");
const { data: profile } = await supabase.from("profiles").select("first_name,last_name").eq("id", claims.sub).maybeSingle();
```

Build the display name: `profile` first + last name if present; otherwise (the SQL has not been run yet, or an odd account) fall back to `claims.user_metadata.full_name`; if there is no name at all, the stamp reads `Exclusively for the use of jane.doe@example.com`. Never leave the email out and never show a blank. Collapse whitespace and strip the invisible characters from section 3 again here, so the stamp is safe whatever is in the database.

Pass a single prop, `holder: { name: string; email: string }`, into `<Reader>`. Do not fetch identity in the client component.

This page is now per-user, so it must not be statically generated or cached and shared. Reading cookies makes it dynamic automatically; check the Next docs on whether `generateStaticParams` still belongs here (`comics.map(...)` is only useful for the not-available branch), remove it if it conflicts, and make sure the response is not cached publicly (`Cache-Control: private, no-store`, via the route segment config the docs describe for this version). Verify with a second account that you never see the first account's name.

### 5.3 The stamp, in three layers

Build a single source of truth: `const stamp = `Exclusively for the use of ${holder.name} - ${holder.email}`` (or the email-only form), memoised in `Reader`.

**Layer 1: diagonal tiling over every page (the crop-proof one).** Rework `PageWatermark.tsx` so the pattern text is the stamp, in addition to (not instead of) the existing "Humanisse" mark. Requirements:

- Two-line tiles: line 1 `Exclusively for the use of Jane Doe`, line 2 `jane.doe@example.com` (the hyphen joins them when read as one string; a long name or email must shrink via `textLength`/font size rather than overflow its tile, and the whole stamp string must still be present in the DOM as one `<text>` or `<title>` so the guard in 5.4 can check it)
- Rotated like the existing mark, staggered rows so tiles do not line up in columns
- **Density target:** any rectangle covering about 40% of a page's width and 40% of its height, anywhere on the page, must contain at least one complete, legible name + email. This is the whole point: cropping a panel out of the page still carries the name. Pick tile size and font size to meet it, and verify by screenshot
- Legible when a screenshot is zoomed to 100%, but not in the way of reading the comic: ink fill with a paper-coloured outline (`paint-order: stroke`, already used for the brand mark), fill opacity around **0.16 to 0.22** (the brand mark is 0.07 and too faint for this), outline around 0.12. Tune against the placeholder pages, and note that real artwork will need re-tuning, as `PageWatermark.tsx`'s comment already says
- Vector, `pointer-events: none`, `user-select: none`, and scales with the page at any zoom, exactly like today. Used on the main pages and on the sidebar thumbnails (thumbnails are small; it just needs to be present)
- The existing `aria-hidden`/`focusable="false"` stay

**Layer 2: a plain statement along the foot of every page.** Inside each `.leaf` (inside, so any crop of the page contains it), add a slim strip along the bottom edge: the full one-line stamp, centred, page-relative size (use container units, like the placeholder art does, so it scales with zoom), paper text on a mostly opaque ink background (about 0.82), `z-index` above the artwork and the tiling, `pointer-events: none`. This is the visible "Exclusively for the use of …" line, the HBR-style notice. It should be readable and calm, not shouting. Keep it out of the thumbnails (too small to be useful) and out of the printed page (the print stylesheet already removes the pages).

**Layer 3: outside the pages.** Show the same one-line stamp, small and muted, at the bottom of the stage area (below the page, inside the dark reading area, on the reader's `root` so it is also captured in fullscreen). It is the backstop for a full-window screenshot, and means the name is visible even on pages that have little room.

All three read the same `stamp` string. Nothing else in the repo should build that sentence.

### 5.4 Tamper guard

A reader can open dev tools and delete or hide the stamp elements (`display: none`, delete the node, set opacity to 0, collapse the SVG). Add a small hook, `useStampGuard`, in `src/components/reader/useStampGuard.ts`, used by `Reader`:

- Mark the layer 1 and layer 2 elements with `data-stamp="tiles"` / `data-stamp="line"`, and the layer 3 line with `data-stamp="foot"`
- Every ~1.5 seconds (and immediately from a `MutationObserver` on the reader root watching `childList`, `subtree` and `attributes` for `style`, `class`, `hidden`), check **only the main-stage elements that are currently supposed to be visible** (not thumbnails in a closed sidebar). For each page leaf on screen, confirm: both stamp elements exist; `getBoundingClientRect()` has real width and height; computed `display` is not `none`, `visibility` is visible, `opacity` is at least ~0.5 of what the CSS sets (compare against a constant, not magic numbers scattered about); the strip's text content equals the current `stamp` exactly; the tile text content contains the current `stamp`. Skip the check while `document.hidden`
- On failure, set a `tampered` state: replace the stage with a calm full-area message ("Something changed on this page, so reading has been paused. Reload to continue.") with a **Reload** button, and increment a `key` on the stage so React rebuilds a clean tree when the reader reloads. Do not log the user out and do not accuse; the message is neutral
- Avoid false positives: the page turn animation (motion `opacity` on the spread wrapper), zoom, fullscreen, switching layouts, and the sidebar opening and closing must **never** trigger it. Test all of those. If a check is flaky, loosen it rather than ship a guard that interrupts honest readers
- Clean up the observer and interval on unmount. Respect that React Compiler is on: keep the hook plain, no mutation of values during render

Be realistic about what this is. A determined person with dev tools can still remove it before screenshotting. The guard raises the cost and catches casual tampering; it does not make removal impossible. Say that plainly in a code comment at the top of the hook. Do not add anything that fights the browser (no devtools-detection tricks, no `debugger` loops, no disabling of text selection beyond what exists).

### 5.5 Keep what exists

All earlier reader behaviour stays: right-click and drag blocking, Ctrl/Cmd+P and S notices, print stylesheet, optional blur-on-blur flag, spreads and scroll mode, zoom, thumbnails, fullscreen. The brand "Humanisse" mark stays too. Put nothing in the toolbar; it is already full.

---

## 6. Do not touch

- Comics data, prices, audience pages, navigation (prompts 9 to 12)
- Cart, purchases, the Supabase `purchases` and `active_sessions` code
- `next.config.ts` (its CSP is strict; nothing here needs a change, and if something seems to, stop and tell me)
- `package.json` (no new dependencies)
- Do not commit. Do not push. Do not create a branch. When done, send the `http://localhost:3000` link per `CLAUDE.md`

---

## Verification (required)

```bash
npm run lint
npx tsc --noEmit
npm run build
```

All three clean. Then, with `npm run dev` and a real test account (create two, so you can compare):

**Signup**
- [ ] Create-account tab shows First name and Last name, both required; leaving either empty shows the matching message and nothing is sent
- [ ] "J" + "123" is rejected for the last name; a name containing a zero-width or direction character is rejected
- [ ] The typed names survive a failed submit and a tab switch
- [ ] A new account ends up with `first_name`, `last_name` and `full_name` in its metadata, and (once the SQL is run) a row in `profiles`
- [ ] Header still says "Hi" plus the name; duplicate-email handling, confirm-password and eye toggles still work

**Access**
- [ ] Signed out, opening `/read/negotiation` (or Preview from a comic page) goes to the login page and returns to the reader after logging in
- [ ] The Preview button on a comic page works when signed in

**Stamp**
- [ ] Every page in single, two-page and scroll layouts shows the foot strip reading exactly `Exclusively for the use of First Last - email`
- [ ] Take a screenshot of the reader at 100%, 50% and 200% zoom and crop a single panel (about 40% x 40% of a page) at several places: a complete name + email is legible in every crop
- [ ] Thumbnails and contact sheet still render; the comic remains readable at the tiling's opacity (judge it honestly on the placeholder pages)
- [ ] Layer 3 appears under the stage and in fullscreen
- [ ] An account with no `profiles` row (or before the SQL is run) shows the full-name fallback, and an account with no name at all shows the email-only stamp. Nothing is blank
- [ ] Log in as a second account in a private window: its own name and email appear, never the first account's (check this on a hard refresh too, to rule out caching)
- [ ] From the browser console, `supabase.auth.updateUser({ data: { first_name: "Fake" } })` (or editing metadata another way) does **not** change the stamp once the `profiles` row exists

**Guard**
- [ ] In dev tools, delete the strip, then set `display:none` on the tiles, then set opacity 0: each shows the paused message and Reload recovers to a clean reader
- [ ] Page turns, zoom, fullscreen, layout changes, the sidebar toggling and switching tabs and back never trigger it (leave it open for two minutes while using everything)
- [ ] No console errors, no hydration warnings, no horizontal scroll at 1440, 1024, 820 and 390
- [ ] Reduced motion still works

---

## Note for the human

**Run the new SQL block** from `supabase/schema.sql` in the Supabase SQL editor (Project, SQL Editor, paste, Run). Until then the reader falls back to the old single `full_name` (existing accounts) so nothing breaks, but names will not be tamper-proof. After it runs, existing accounts are backfilled by splitting their one name at the first space. Aarav, this affects only accounts made before prompt 13: if a surname has a space in it, or a user typed only one name, check the `profiles` table and fix any odd rows by hand.

**Preview now needs an account.** The reader was open to anyone before. With the stamp, an anonymous visitor would have nobody to name, so the reader (including Preview) now sends signed-out visitors to log in first. That is the price of attribution, but it does add a step for someone just browsing, so tell George. If he would rather keep anonymous previews, the alternative is a short, signed-out preview stamped "Preview copy - Humanisse - not for sharing" with no name; that would be a separate decision.

**What this can and cannot do.** Nothing in a browser can stop a screenshot. This makes a leaked screenshot name the person who took it, in a way that cuts through any crop, and it notices casual tampering. Someone willing to edit the page's code can still remove it. The stronger fix belongs to the real-artwork phase: when the comic pages are real images served from S3/CloudFront, stamp the name and email into each image on the server for each reader (so there is no clean image to leave a browser at all), and consider a faint invisible per-reader mark. Worth raising with Sitesmith's build plan before that phase starts.

**The email is the anchor.** It comes from the verified login and cannot be changed by the reader. The name is only as honest as what was typed at signup, which is why both appear.
