-- LevelUp upgrade 002: promo codes, friends & invites, leaderboard, teams.
-- Run once in Supabase → SQL Editor → New query → paste → Run. Safe to re-run.
-- Everything stays behind row-level security; shared data is only exposed through the functions below.

-- ---------- Helpers ----------
create or replace function public.gen_code() returns text
language sql volatile set search_path = '' as $$
  select upper(substr(md5(gen_random_uuid()::text || clock_timestamp()::text), 1, 8))
$$;

-- ---------- Profile columns ----------
alter table public.profiles
  add column if not exists pro_source text check (pro_source in ('stripe', 'promo', 'manual')),
  add column if not exists promo_code text,
  add column if not exists invite_code text unique default public.gen_code(),
  add column if not exists invited_by uuid references public.profiles (id) on delete set null,
  add column if not exists xp int not null default 0,
  add column if not exists bonus_xp int not null default 0,
  add column if not exists startup text,
  add column if not exists "character" text not null default 'pip',
  add column if not exists on_leaderboard boolean not null default true;
update public.profiles set invite_code = public.gen_code() where invite_code is null;

-- Users may only change their name and whether they appear on the global leaderboard.
revoke update on public.profiles from anon, authenticated;
grant update (display_name, on_leaderboard) on public.profiles to authenticated;

-- ---------- Friends ----------
create table if not exists public.friendships (
  user_id uuid not null references public.profiles (id) on delete cascade,
  friend_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, friend_id),
  check (user_id <> friend_id)
);
alter table public.friendships enable row level security;
drop policy if exists "own friendships" on public.friendships;
create policy "own friendships" on public.friendships for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "remove friendship" on public.friendships;
create policy "remove friendship" on public.friendships for delete to authenticated using ((select auth.uid()) in (user_id, friend_id));

-- New sign-ups: create the profile, and if they used an invite link, make them friends and reward the inviter.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
declare inviter uuid;
begin
  select id into inviter from public.profiles
  where invite_code = upper(nullif(trim(new.raw_user_meta_data ->> 'ref'), '')) limit 1;
  insert into public.profiles (id, display_name, age_confirmed, invited_by)
  values (new.id, left(coalesce(new.raw_user_meta_data ->> 'display_name', ''), 60),
          coalesce((new.raw_user_meta_data ->> 'age_confirmed')::boolean, false), inviter);
  if inviter is not null then
    insert into public.friendships (user_id, friend_id) values (new.id, inviter), (inviter, new.id) on conflict do nothing;
    update public.profiles set bonus_xp = least(bonus_xp + 50, 2500) where id = inviter;
  end if;
  return new;
end; $$;

-- Add an existing user as a friend with their invite code (no XP, so it can't be farmed).
create or replace function public.add_friend(code text) returns text
language plpgsql security definer set search_path = '' as $$
declare me uuid := auth.uid(); other uuid; nm text;
begin
  if me is null then raise exception 'Please sign in first'; end if;
  select id, coalesce(nullif(display_name, ''), 'Founder') into other, nm from public.profiles where invite_code = upper(trim(code));
  if other is null then raise exception 'No founder has that code'; end if;
  if other = me then raise exception 'That''s your own code'; end if;
  insert into public.friendships (user_id, friend_id) values (me, other), (other, me) on conflict do nothing;
  return nm;
end; $$;

-- ---------- XP sync: computed from the saved workspace on every save ----------
create or replace function public.sync_profile_stats() returns trigger
language plpgsql security definer set search_path = '' as $$
declare d jsonb := new.data; agents int := 0; goals int := 0; deck int := 0; days int := 0; ch text;
begin
  if jsonb_typeof(d -> 'results') = 'object' then select count(*) into agents from jsonb_object_keys(d -> 'results'); end if;
  if jsonb_typeof(d -> 'goals') = 'array' then select count(*) into goals from jsonb_array_elements(d -> 'goals') g where g ->> 'done' = 'true'; end if;
  if jsonb_typeof(d -> 'deck') = 'object' then deck := 1; end if;
  if jsonb_typeof(d -> 'days') = 'array' then select count(distinct v) into days from jsonb_array_elements_text(d -> 'days') v; end if;
  ch := d -> 'prefs' ->> 'character';
  update public.profiles set
    xp = least(agents, 12) * 100 + least(goals, 200) * 25 + deck * 150 + least(days, 365) * 10,
    startup = left(coalesce(d -> 'profile' ->> 'startup', ''), 60),
    "character" = case when ch in ('pip', 'blaze', 'sage', 'nova', 'rocco') then ch else 'pip' end
  where id = new.user_id;
  return new;
end; $$;
drop trigger if exists on_workspace_saved on public.workspaces;
create trigger on_workspace_saved after insert or update of data on public.workspaces for each row execute function public.sync_profile_stats();

-- ---------- Teams ----------
create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 60),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  invite_code text not null unique default public.gen_code(),
  created_at timestamptz not null default now()
);
create table if not exists public.team_members (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  team_id uuid not null references public.teams (id) on delete cascade,
  role text check (char_length(role) <= 40),
  joined_at timestamptz not null default now()
);
create table if not exists public.team_goals (
  id bigint generated always as identity primary key,
  team_id uuid not null references public.teams (id) on delete cascade,
  text text not null check (char_length(text) between 1 and 120),
  done boolean not null default false,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);
alter table public.teams enable row level security;
alter table public.team_members enable row level security;
alter table public.team_goals enable row level security;

create or replace function public.my_team_id() returns uuid
language sql stable security definer set search_path = '' as $$
  select team_id from public.team_members where user_id = auth.uid()
$$;

drop policy if exists "my team" on public.teams;
create policy "my team" on public.teams for select to authenticated using (id = public.my_team_id());
drop policy if exists "my team members" on public.team_members;
create policy "my team members" on public.team_members for select to authenticated using (team_id = public.my_team_id());
drop policy if exists "team goals read" on public.team_goals;
create policy "team goals read" on public.team_goals for select to authenticated using (team_id = public.my_team_id());
drop policy if exists "team goals add" on public.team_goals;
create policy "team goals add" on public.team_goals for insert to authenticated with check (team_id = public.my_team_id() and created_by = (select auth.uid()));
drop policy if exists "team goals tick" on public.team_goals;
create policy "team goals tick" on public.team_goals for update to authenticated using (team_id = public.my_team_id()) with check (team_id = public.my_team_id());
drop policy if exists "team goals remove" on public.team_goals;
create policy "team goals remove" on public.team_goals for delete to authenticated using (team_id = public.my_team_id());

create or replace function public.create_team(team_name text, my_role text default 'Founder') returns text
language plpgsql security definer set search_path = '' as $$
declare me uuid := auth.uid(); tid uuid; code text;
begin
  if me is null then raise exception 'Please sign in first'; end if;
  if exists (select 1 from public.team_members where user_id = me) then raise exception 'You''re already on a team. Leave it first.'; end if;
  if char_length(trim(coalesce(team_name, ''))) = 0 then raise exception 'Give your team a name'; end if;
  insert into public.teams (name, owner_id) values (left(trim(team_name), 60), me) returning id, invite_code into tid, code;
  insert into public.team_members (user_id, team_id, role) values (me, tid, left(coalesce(nullif(trim(my_role), ''), 'Founder'), 40));
  return code;
end; $$;

create or replace function public.join_team(code text, my_role text default 'Teammate') returns text
language plpgsql security definer set search_path = '' as $$
declare me uuid := auth.uid(); t public.teams;
begin
  if me is null then raise exception 'Please sign in first'; end if;
  if exists (select 1 from public.team_members where user_id = me) then raise exception 'You''re already on a team. Leave it first.'; end if;
  select * into t from public.teams where invite_code = upper(trim(code));
  if t.id is null then raise exception 'No team has that code'; end if;
  if (select count(*) from public.team_members where team_id = t.id) >= 8 then raise exception 'That team is full (8 max)'; end if;
  insert into public.friendships (user_id, friend_id)
    select me, m.user_id from public.team_members m where m.team_id = t.id
    union all select m.user_id, me from public.team_members m where m.team_id = t.id
  on conflict do nothing;
  insert into public.team_members (user_id, team_id, role) values (me, t.id, left(coalesce(nullif(trim(my_role), ''), 'Teammate'), 40));
  return t.name;
end; $$;

create or replace function public.leave_team() returns void
language plpgsql security definer set search_path = '' as $$
declare me uuid := auth.uid(); tid uuid := public.my_team_id(); next_owner uuid;
begin
  if tid is null then return; end if;
  delete from public.team_members where user_id = me;
  if (select owner_id from public.teams where id = tid) = me then
    select user_id into next_owner from public.team_members where team_id = tid order by joined_at limit 1;
    if next_owner is null then delete from public.teams where id = tid;
    else update public.teams set owner_id = next_owner where id = tid; end if;
  end if;
end; $$;

create or replace function public.team_overview() returns jsonb
language plpgsql stable security definer set search_path = '' as $$
declare t public.teams; res jsonb;
begin
  select * into t from public.teams where id = public.my_team_id();
  if t.id is null then return null; end if;
  select jsonb_build_object(
    'name', t.name, 'invite_code', t.invite_code, 'is_owner', t.owner_id = auth.uid(),
    'members', coalesce((
      select jsonb_agg(jsonb_build_object('name', coalesce(nullif(p.display_name, ''), 'Founder'), 'role', m.role, 'character', p.character,
        'xp', p.xp + p.bonus_xp, 'is_me', p.id = auth.uid(), 'is_owner', p.id = t.owner_id) order by p.xp + p.bonus_xp desc)
      from public.team_members m join public.profiles p on p.id = m.user_id where m.team_id = t.id), '[]'::jsonb),
    'startup', (select jsonb_build_object('profile', w.data -> 'profile', 'results', w.data -> 'results') from public.workspaces w where w.user_id = t.owner_id)
  ) into res;
  return res;
end; $$;

-- ---------- Leaderboard ----------
-- Global: only people who opted in. Friends: you + your friends. Team: your team.
create or replace function public.leaderboard(scope text default 'global')
returns table (name text, startup text, "character" text, total_xp int, is_me boolean)
language sql stable security definer set search_path = '' as $$
  select coalesce(nullif(p.display_name, ''), 'Founder'), nullif(p.startup, ''), p.character, p.xp + p.bonus_xp, p.id = auth.uid()
  from public.profiles p
  where case scope
    when 'friends' then p.id = auth.uid() or exists (select 1 from public.friendships f where f.user_id = auth.uid() and f.friend_id = p.id)
    when 'team' then p.id in (select m.user_id from public.team_members m where m.team_id = public.my_team_id())
    else p.on_leaderboard or p.id = auth.uid()
  end
  order by 4 desc
  limit 50
$$;

-- Only signed-in users can call these.
do $$
declare f text;
begin
  foreach f in array array['add_friend(text)', 'create_team(text,text)', 'join_team(text,text)', 'leave_team()', 'team_overview()', 'leaderboard(text)', 'my_team_id()'] loop
    execute format('revoke execute on function public.%s from public, anon', f);
    execute format('grant execute on function public.%s to authenticated', f);
  end loop;
end $$;
