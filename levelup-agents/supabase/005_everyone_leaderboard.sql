-- LevelUp upgrade 005: everyone is on the "Everyone" leaderboard by default (they can hide themselves).
alter table public.profiles alter column on_leaderboard set default true;
update public.profiles set on_leaderboard = true where on_leaderboard = false;
