-- LevelUp database schema. Run this once in Supabase: Dashboard → SQL Editor → New query → paste → Run.
-- Every table has row-level security (RLS) ON, so the public anon key can never read other people's data.

-- 1) One profile per signed-up user (this is your sign-up tracker).
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text check (char_length(display_name) <= 60),
  age_confirmed boolean not null default false,
  created_at timestamptz not null default now()
);

-- 2) Each user's saved workspace (startup, agent results, deck, XP, preferences).
create table if not exists public.workspaces (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint workspace_size check (pg_column_size(data) < 6000000)
);

-- 3) Landing-page waitlist emails.
create table if not exists public.waitlist (
  id bigint generated always as identity primary key,
  email text not null unique check (char_length(email) <= 200 and email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]{2,}$'),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.waitlist enable row level security;

-- Plan: "free" or "pro". Users can never change this themselves (see column grants below).
-- To give someone Pro (e.g. yourself, a tester or a paying user): Table Editor → profiles → set plan to pro.
alter table public.profiles add column if not exists plan text not null default 'free' check (plan in ('free', 'pro'));

-- Profiles: you can read and update only your own. Rows are created by the trigger below.
drop policy if exists "own profile read" on public.profiles;
create policy "own profile read" on public.profiles for select to authenticated using ((select auth.uid()) = id);
drop policy if exists "own profile update" on public.profiles;
create policy "own profile update" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

-- Users may only edit their display name, never their plan or age flag.
revoke update on public.profiles from anon, authenticated;
grant update (display_name) on public.profiles to authenticated;

-- Workspaces: full access to your own row only.
drop policy if exists "own workspace" on public.workspaces;
create policy "own workspace" on public.workspaces for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

-- Waitlist: anyone may add an email; nobody can read the list through the API.
drop policy if exists "join waitlist" on public.waitlist;
create policy "join waitlist" on public.waitlist for insert to anon, authenticated with check (true);

-- Create a profile automatically whenever someone signs up.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, display_name, age_confirmed)
  values (
    new.id,
    left(coalesce(new.raw_user_meta_data ->> 'display_name', ''), 60),
    coalesce((new.raw_user_meta_data ->> 'age_confirmed')::boolean, false)
  );
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- Handy admin views (only visible in the Supabase dashboard / SQL editor, not through the public API).
create or replace view public.signup_stats with (security_invoker = true) as
  select date_trunc('day', created_at)::date as day, count(*) as signups from public.profiles group by 1 order by 1 desc;
revoke all on public.signup_stats from anon, authenticated;
