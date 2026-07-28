-- 0010_admin_create_user.sql — Admin oppretter innloggbare brukere.
-- Modell: sjefen (admin/manager) lager brukere med brukernavn + passord.
-- Arbeidere logger inn med brukernavn (mappes til en syntetisk e-post internt).

alter table profiles add column if not exists username text unique;

create or replace function admin_create_user(
  p_full_name text,
  p_username text,
  p_password text,
  p_role app_role
)
returns uuid
language plpgsql
security definer
set search_path = public, extensions, auth
as $$
declare
  new_id uuid := gen_random_uuid();
  caller_org uuid;
  uname text := lower(trim(p_username));
  synth_email text := lower(trim(p_username)) || '@users.tally.local';
begin
  if auth.uid() is null then raise exception 'Not signed in'; end if;
  if length(coalesce(p_password, '')) < 6 then raise exception 'Password must be at least 6 characters'; end if;
  if uname = '' then raise exception 'Username is required'; end if;

  select organization_id into caller_org from memberships
  where user_id = auth.uid() and is_active and role in ('admin', 'manager')
  limit 1;
  if caller_org is null then raise exception 'No permission to create users'; end if;
  if p_role = 'admin' and not exists (
    select 1 from memberships where user_id = auth.uid()
    and organization_id = caller_org and role = 'admin' and is_active
  ) then
    raise exception 'Only admins can create admins';
  end if;

  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, created_at, updated_at,
    confirmation_token, recovery_token, email_change_token_new, email_change,
    raw_app_meta_data, raw_user_meta_data
  ) values (
    new_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
    synth_email, extensions.crypt(p_password, extensions.gen_salt('bf')),
    now(), now(), now(),
    '', '', '', '',
    '{"provider":"email","providers":["email"]}',
    jsonb_build_object('full_name', p_full_name, 'username', uname)
  );

  insert into profiles (id, full_name, username)
  values (new_id, p_full_name, uname)
  on conflict (id) do update set full_name = excluded.full_name, username = excluded.username;

  insert into memberships (organization_id, user_id, role) values (caller_org, new_id, p_role);

  return new_id;
exception
  when unique_violation then
    raise exception 'Username already taken';
end;
$$;

revoke execute on function admin_create_user(text, text, text, app_role) from public;
grant execute on function admin_create_user(text, text, text, app_role) to authenticated;
