-- 0012_report_line_items.sql — Liste-felt på rapporten: bemanning (finnes),
-- utstyr/maskiner og materialer. RLS speiler report_manpower: se hvis du ser
-- rapporten; endre kun på eget utkast eller som ledelse/utførende. Client kan
-- aldri endre (ingen write-policy slipper dem gjennom).

-- Klientvennlig id-default på bemanning (manglet fra 0001).
alter table report_manpower alter column id set default gen_random_uuid();

create table report_equipment (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references daily_reports on delete cascade,
  name text not null,
  hours numeric(6, 2),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table report_materials (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references daily_reports on delete cascade,
  name text not null,
  quantity numeric(10, 2),
  unit text,
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

alter table report_equipment enable row level security;
alter table report_materials enable row level security;

grant all on report_equipment to authenticated;
grant all on report_materials to authenticated;
grant select on report_equipment to anon;
grant select on report_materials to anon;

-- Hjelper: kan brukeren endre linjer på denne rapporten? (eget utkast eller ledelse/utførende)
create or replace function can_edit_report_lines(rid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from daily_reports r
    where r.id = rid and (
      (r.author_id = auth.uid() and r.status = 'draft')
      or current_role_in(r.organization_id) in ('admin', 'manager', 'engineer', 'supervisor')
    )
  );
$$;

create policy equipment_select on report_equipment for select
  using (report_id in (select id from daily_reports));
create policy equipment_write on report_equipment for all
  using (can_edit_report_lines(report_id))
  with check (can_edit_report_lines(report_id));

create policy materials_select on report_materials for select
  using (report_id in (select id from daily_reports));
create policy materials_write on report_materials for all
  using (can_edit_report_lines(report_id))
  with check (can_edit_report_lines(report_id));
