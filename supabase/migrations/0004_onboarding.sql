-- 0004_onboarding.sql — Atomisk onboarding (spec §0: multi-tenant fra dag én).
-- Ny bruker oppretter organisasjon, egen profil og admin-medlemskap i ÉN
-- transaksjon. security definer så de tre innsettingene skjer uten delvis
-- tilstand, men funksjonen handler kun på vegne av auth.uid().

create or replace function onboard_organization(org_name text, full_name text default null)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_org_id uuid;
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'Ikke innlogget';
  end if;

  insert into organizations (name) values (org_name) returning id into new_org_id;

  insert into profiles (id, full_name)
  values (uid, coalesce(nullif(full_name, ''), 'Bruker'))
  on conflict (id) do update
    set full_name = coalesce(nullif(excluded.full_name, ''), profiles.full_name);

  insert into memberships (organization_id, user_id, role)
  values (new_org_id, uid, 'admin');

  return new_org_id;
end;
$$;

grant execute on function onboard_organization(text, text) to authenticated;
