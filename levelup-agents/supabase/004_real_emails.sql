-- LevelUp upgrade 004: block throwaway email domains at the database level.
-- After running, enable it: Supabase → Authentication → Hooks → "Before User Created" → Postgres function → public.hook_block_disposable_email
create or replace function public.hook_block_disposable_email(event jsonb) returns jsonb
language plpgsql stable set search_path = '' as $$
declare email text := lower(coalesce(event -> 'user' ->> 'email', ''));
        domain text := split_part(lower(coalesce(event -> 'user' ->> 'email', '')), '@', 2);
begin
  if domain = any (array[
    'mailinator.com','10minutemail.com','10minutemail.net','guerrillamail.com','guerrillamail.net','sharklasers.com','grr.la',
    'tempmail.com','temp-mail.org','temp-mail.io','tempmail.net','tempmailo.com','tempr.email','throwawaymail.com','trashmail.com',
    'yopmail.com','yopmail.net','getnada.com','nada.email','dispostable.com','maildrop.cc','mailnesia.com','mintemail.com',
    'fakeinbox.com','spamgourmet.com','mohmal.com','emailondeck.com','burnermail.io','mailcatch.com','moakt.com','mytemp.email',
    'inboxkitten.com','tempinbox.com','discard.email','33mail.com','spambox.us','trashmail.de','wegwerfmail.de','mail.tm','mailpoof.com'
  ]) then
    return jsonb_build_object('error', jsonb_build_object('http_code', 400, 'message', 'Please use your real email. Temporary inboxes aren''t allowed.'));
  end if;
  return '{}'::jsonb;
end; $$;
grant execute on function public.hook_block_disposable_email(jsonb) to supabase_auth_admin;
revoke execute on function public.hook_block_disposable_email(jsonb) from public, anon, authenticated;
