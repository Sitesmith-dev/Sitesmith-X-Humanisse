-- Humanisse accounts: paste this whole file into Supabase > SQL Editor and click Run.
-- Safe to run more than once.

-- ─── Purchases: which comics each reader owns ────────────────────────────────
-- One row per (reader, comic). Rows are added by the payment flow (later) or by hand from the Table Editor.
create table if not exists public.purchases (
  user_id      uuid        not null references auth.users (id) on delete cascade,
  comic_slug   text        not null,
  progress     smallint    not null default 0 check (progress between 0 and 100),
  purchased_at timestamptz not null default now(),
  primary key (user_id, comic_slug)
);

alter table public.purchases enable row level security;

-- Readers can see only their own purchases. There is deliberately no insert/delete policy: a reader cannot grant
-- themselves a comic, only the payment flow (using the secret key, which bypasses these rules) can.
drop policy if exists "Readers see their own purchases" on public.purchases;
create policy "Readers see their own purchases" on public.purchases
  for select to authenticated using ((select auth.uid()) = user_id);

-- Readers may update their own reading progress, and nothing else on the row.
revoke update on public.purchases from authenticated, anon;
grant update (progress) on public.purchases to authenticated;
drop policy if exists "Readers update their own progress" on public.purchases;
create policy "Readers update their own progress" on public.purchases
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

-- ─── Active sessions: one signed-in device per account ───────────────────────
-- Holds the single login that is allowed to stay signed in. Signing in on a new device overwrites it, and every
-- other device is signed out the next time it loads a page.
create table if not exists public.active_sessions (
  user_id    uuid        primary key references auth.users (id) on delete cascade,
  session_id uuid        not null,
  claimed_at timestamptz not null default now()
);

alter table public.active_sessions enable row level security;

drop policy if exists "Readers see their own active session" on public.active_sessions;
create policy "Readers see their own active session" on public.active_sessions
  for select to authenticated using ((select auth.uid()) = user_id);

-- The only way to write this table. It records the caller's *current* login (taken from their verified token),
-- so nobody can write a made-up session id or touch another reader's row.
create or replace function public.claim_session()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  sid uuid := nullif(auth.jwt() ->> 'session_id', '')::uuid;
begin
  if auth.uid() is null or sid is null then
    raise exception 'not signed in';
  end if;
  insert into public.active_sessions (user_id, session_id, claimed_at)
  values (auth.uid(), sid, now())
  on conflict (user_id) do update set session_id = excluded.session_id, claimed_at = excluded.claimed_at;
end;
$$;

revoke all on function public.claim_session() from public, anon;
grant execute on function public.claim_session() to authenticated;

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
