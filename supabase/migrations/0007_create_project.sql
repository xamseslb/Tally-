-- 0007_create_project.sql — Atomisk prosjektopprettelse.
-- Oppretter prosjekt i brukerens organisasjon og legger oppretteren til som
-- prosjektmedlem (så is_project_member() gjelder for rapporter). Kun admin/manager.

create or replace function create_project(
  project_name text,
  project_number text default null,
  address text default null,
  client_name text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_id uuid;
  uid uuid := auth.uid();
  org uuid;
begin
  if uid is null then
    raise exception 'Ikke innlogget';
  end if;

  select organization_id into org
  from memberships
  where user_id = uid and is_active and role in ('admin', 'manager')
  limit 1;

  if org is null then
    raise exception 'Ingen organisasjon med rettigheter til å opprette prosjekt';
  end if;

  insert into projects (organization_id, name, project_number, address, client_name)
  values (org, project_name, nullif(project_number, ''), nullif(address, ''), nullif(client_name, ''))
  returning id into new_id;

  insert into project_members (project_id, user_id) values (new_id, uid);

  return new_id;
end;
$$;

revoke execute on function create_project(text, text, text, text) from public;
grant execute on function create_project(text, text, text, text) to authenticated;
