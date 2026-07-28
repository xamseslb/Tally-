-- 0013_media_storage.sql — Lagring for bilder/video (FR-4).
-- Privat bucket 'attachments'. Filer legges under <report_id>/<uuid.ext>.
-- attachments-tabellen (0001) får lat/lng for GPS. Rad-policyer finnes i 0003;
-- her legges storage.objects-policyer + GPS-kolonner.

alter table attachments add column if not exists lat double precision;
alter table attachments add column if not exists lng double precision;
alter table attachments alter column id set default gen_random_uuid();

insert into storage.buckets (id, name, public)
values ('attachments', 'attachments', false)
on conflict (id) do nothing;

-- Sti-mønster: '<report_id>/<fil>'. Første mappe er report_id. Se hvis du ser
-- rapporten; last opp/slett kun der du kan endre linjer (eget utkast/ledelse).
create policy attachments_obj_select on storage.objects for select to authenticated
  using (
    bucket_id = 'attachments'
    and (split_part(name, '/', 1))::uuid in (select id from daily_reports)
  );

create policy attachments_obj_insert on storage.objects for insert to authenticated
  with check (
    bucket_id = 'attachments'
    and can_edit_report_lines((split_part(name, '/', 1))::uuid)
  );

create policy attachments_obj_delete on storage.objects for delete to authenticated
  using (
    bucket_id = 'attachments'
    and can_edit_report_lines((split_part(name, '/', 1))::uuid)
  );
