-- 0008_create_report.sql — Opprett rapport-utkast (tilstandsmaskin start).
-- Utleder org fra prosjektet, setter forfatter = auth.uid(), status = 'draft'.
-- Server-dato brukes hvis dato ikke oppgis. Én rapport per prosjekt/forfatter/dag.

create or replace function create_draft_report(
  p_project_id uuid,
  p_report_date date,
  p_work_performed text
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

  select organization_id into org from projects
  where id = p_project_id and deleted_at is null;
  if org is null then
    raise exception 'Ukjent prosjekt';
  end if;

  if not (is_project_member(p_project_id) or current_role_in(org) in ('admin', 'manager')) then
    raise exception 'Ingen tilgang til prosjektet';
  end if;

  insert into daily_reports (id, organization_id, project_id, author_id, report_date, status, work_performed)
  values (gen_random_uuid(), org, p_project_id, uid, coalesce(p_report_date, current_date), 'draft', nullif(p_work_performed, ''))
  returning id into new_id;

  return new_id;
exception
  when unique_violation then
    raise exception 'Du har allerede en rapport for denne datoen på dette prosjektet';
end;
$$;

revoke execute on function create_draft_report(uuid, date, text) from public;
grant execute on function create_draft_report(uuid, date, text) to authenticated;
