-- LevelUp upgrade 007: report and block on the public leaderboard (App Store guideline 1.2: user-generated content).
-- Run this in Supabase → SQL Editor once. Safe to run again.

create table if not exists public.reports (
  id bigint generated always as identity primary key,
  reporter_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  target_id uuid not null references public.profiles (id) on delete cascade,
  reason text not null check (char_length(reason) between 1 and 300),
  created_at timestamptz not null default now(),
  unique (reporter_id, target_id)
);
alter table public.reports enable row level security;
drop policy if exists "report others" on public.reports;
create policy "report others" on public.reports for insert to authenticated with check (reporter_id = auth.uid() and target_id <> auth.uid());

create table if not exists public.blocks (
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  blocked_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, blocked_id)
);
alter table public.blocks enable row level security;
drop policy if exists "own blocks" on public.blocks;
create policy "own blocks" on public.blocks for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid() and blocked_id <> auth.uid());

-- Leaderboard now returns an opaque id (for report/block), hides people you blocked,
-- and hides anyone reported by 3+ different users from the Everyone board until you review them.
drop function if exists public.leaderboard(text);
create function public.leaderboard(scope text default 'global')
returns table (id uuid, name text, startup text, "character" text, total_xp int, is_me boolean)
language sql stable security definer set search_path = '' as $$
  select p.id, coalesce(nullif(p.display_name, ''), 'Founder'), nullif(p.startup, ''), p.character, p.xp + p.bonus_xp, p.id = auth.uid()
  from public.profiles p
  where (case scope
    when 'friends' then p.id = auth.uid() or exists (select 1 from public.friendships f where f.user_id = auth.uid() and f.friend_id = p.id)
    when 'team' then p.id in (select m.user_id from public.team_members m where m.team_id = public.my_team_id())
    else p.id = auth.uid() or (p.on_leaderboard and (select count(*) from public.reports r where r.target_id = p.id) < 3)
  end)
  and not exists (select 1 from public.blocks b where b.user_id = auth.uid() and b.blocked_id = p.id)
  order by 5 desc
  limit 50
$$;
revoke execute on function public.leaderboard(text) from public, anon;
grant execute on function public.leaderboard(text) to authenticated;

-- To review reports: select r.*, p.display_name, p.startup from public.reports r join public.profiles p on p.id = r.target_id order by r.created_at desc;
-- To remove someone from the board: update public.profiles set on_leaderboard = false where id = '...';
