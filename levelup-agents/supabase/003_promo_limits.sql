-- LevelUp upgrade 003: promo codes with usage limits.
-- Codes live in a locked table (no public access); only the server can redeem them.
-- Add or edit codes in Supabase → Table Editor → promo_codes. Do NOT commit real codes to GitHub.

create table if not exists public.promo_codes (
  code text primary key check (code = upper(code) and char_length(code) between 4 and 64),
  max_uses int not null default 100 check (max_uses > 0),
  uses int not null default 0 check (uses >= 0),
  active boolean not null default true,
  expires_at timestamptz,
  note text,
  created_at timestamptz not null default now()
);
create table if not exists public.promo_redemptions (
  code text not null references public.promo_codes (code) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  redeemed_at timestamptz not null default now(),
  primary key (code, user_id)
);
-- RLS on with no policies = nobody can read or write these through the public API.
alter table public.promo_codes enable row level security;
alter table public.promo_redemptions enable row level security;

-- Atomic redeem: locks the code row so the limit can't be exceeded, even with many people at once.
create or replace function public.redeem_promo(p_code text, p_user uuid) returns text
language plpgsql security definer set search_path = '' as $$
declare c public.promo_codes;
begin
  select * into c from public.promo_codes where code = upper(trim(p_code)) for update;
  if c.code is null or not c.active or (c.expires_at is not null and c.expires_at < now()) then return 'invalid'; end if;
  if exists (select 1 from public.promo_redemptions where code = c.code and user_id = p_user) then return 'already'; end if;
  if c.uses >= c.max_uses then return 'used_up'; end if;
  update public.promo_codes set uses = uses + 1 where code = c.code;
  insert into public.promo_redemptions (code, user_id) values (c.code, p_user);
  update public.profiles set plan = 'pro', pro_source = 'promo', promo_code = c.code where id = p_user;
  return 'ok';
end; $$;
revoke execute on function public.redeem_promo(text, uuid) from public, anon, authenticated;
grant execute on function public.redeem_promo(text, uuid) to service_role;

-- Add your codes separately (don't commit them), e.g.:
-- insert into public.promo_codes (code, max_uses, note) values ('YOURCODE', 100, 'launch promo') on conflict (code) do nothing;
