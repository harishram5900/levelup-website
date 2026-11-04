-- LevelUp upgrade 006: Pro users can request a 1:1 call with the founder.
-- See requests in Supabase → Table Editor → call_requests.
create table if not exists public.call_requests (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 60),
  email text not null check (char_length(email) <= 200),
  topic text not null check (char_length(topic) between 5 and 600),
  times text check (char_length(times) <= 200),
  status text not null default 'new' check (status in ('new', 'scheduled', 'done', 'declined')),
  created_at timestamptz not null default now()
);
alter table public.call_requests enable row level security;
drop policy if exists "pro can request call" on public.call_requests;
create policy "pro can request call" on public.call_requests for insert to authenticated
  with check (user_id = (select auth.uid()) and exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.plan = 'pro'));
drop policy if exists "see own call requests" on public.call_requests;
create policy "see own call requests" on public.call_requests for select to authenticated using (user_id = (select auth.uid()));
