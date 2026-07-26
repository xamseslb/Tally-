-- 0002_rls.sql — Row Level Security (spec §4/§5).
-- Standard er DENY: vi slår på RLS på hver tabell. Uten policy = ingen tilgang.
-- Fullstendige policies per rolle + pgTAP-bevis bygges i Fase 1. Her legges
-- fundamentet: DENY-by-default, hjelpefunksjoner og uforanderlighetstriggeren.

-- === Slå på RLS på alle tabeller (deny-by-default) ===
alter table organizations enable row level security;
alter table profiles enable row level security;
alter table memberships enable row level security;
alter table projects enable row level security;
alter table project_members enable row level security;
alter table daily_reports enable row level security;
alter table report_manpower enable row level security;
alter table attachments enable row level security;
alter table signatures enable row level security;
alter table channels enable row level security;
alter table messages enable row level security;
alter table audit_log enable row level security;

-- === Hjelpefunksjoner ===
create or replace function current_role_in(org uuid) returns app_role
language sql stable security definer set search_path = public as $$
  select role from memberships
  where organization_id = org and user_id = auth.uid() and is_active
$$;

create or replace function is_project_member(p uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from project_members
    where project_id = p and user_id = auth.uid()
  )
$$;

-- === Eksempelpolicy: Client-rollen ser KUN signerte rapporter på egne prosjekter ===
-- (spec §2: Client er den farligste rollen. Full testsuite kommer i Fase 1.)
create policy reports_select on daily_reports for select using (
  is_project_member(project_id)
  and (
    current_role_in(organization_id) in ('admin', 'manager')
    or (current_role_in(organization_id) = 'client' and status = 'signed')
    or (current_role_in(organization_id) in ('engineer', 'supervisor'))
    or (
      current_role_in(organization_id) = 'worker'
      and (author_id = auth.uid() or status <> 'draft')
    )
  )
);

-- === Uforanderlighet håndheves i databasen, ikke i UI (spec §3 FR-3) ===
create or replace function guard_signed_reports() returns trigger
language plpgsql as $$
begin
  if old.status = 'signed' and new.status = 'signed'
     and (new.work_performed, new.report_date, new.project_id)
      is distinct from (old.work_performed, old.report_date, old.project_id)
  then
    raise exception 'Signert rapport kan ikke endres. Opprett revisjon.';
  end if;
  new.updated_at := now();
  return new;
end $$;

create trigger trg_guard_signed before update on daily_reports
for each row execute function guard_signed_reports();
