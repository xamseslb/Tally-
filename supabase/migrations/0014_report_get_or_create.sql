-- 0014_report_get_or_create.sql — «Ny rapport» blir hent-eller-opprett.
-- Én rapport per prosjekt/forfatter/dag beholdes, men i stedet for feil returnerer
-- vi dagens eksisterende rapport, så brukeren havner rett inn i den.

create or replace function create_draft_report(
  p_project_id uuid,
  p_report_date date,
  p_work_performed text
)
returns uuid
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  new_id uuid;
  existing uuid;
  uid uuid := auth.uid();
  org uuid;
  the_date date := coalesce(p_report_date, current_date);
begin
  if uid is null then raise exception 'Not signed in'; end if;

  select organization_id into org from projects
  where id = p_project_id and deleted_at is null;
  if org is null then raise exception 'Unknown project'; end if;

  if not (is_project_member(p_project_id) or current_role_in(org) in ('admin', 'manager')) then
    raise exception 'No access to the project';
  end if;

  select id into existing from daily_reports
  where project_id = p_project_id and author_id = uid and report_date = the_date
    and supersedes_id is null and deleted_at is null
  limit 1;
  if existing is not null then return existing; end if;

  insert into daily_reports (id, organization_id, project_id, author_id, report_date, status, work_performed)
  values (gen_random_uuid(), org, p_project_id, uid, the_date, 'draft', nullif(p_work_performed, ''))
  returning id into new_id;
  return new_id;
exception
  when unique_violation then
    select id into existing from daily_reports
    where project_id = p_project_id and author_id = uid and report_date = the_date
      and supersedes_id is null
    limit 1;
    return existing;
end;
$$;
