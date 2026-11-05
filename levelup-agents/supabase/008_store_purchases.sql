-- LevelUp upgrade 008: Pro bought in the iOS/Android app (App Store / Google Play via RevenueCat).
-- Run once in Supabase → SQL Editor. Safe to run again.
alter table public.profiles drop constraint if exists profiles_pro_source_check;
alter table public.profiles add constraint profiles_pro_source_check check (pro_source in ('stripe', 'promo', 'manual', 'store'));
