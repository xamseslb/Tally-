-- 0003_rls_policies.sql — Fulle RLS-policies per rolle (spec §2).
-- Rettigheter = rolle ∩ prosjektmedlemskap. UI skjuler, databasen NEKTER.
--
-- ⚠️ UVERIFISERT LOKALT: krever pgTAP-kjøring (Docker / CI) før den kan stoles på.
-- Se supabase/tests/0002_rls_roles.test.sql og CI-jobben `rls`. En RLS-bug er
-- et datalekkasjeavvik, ikke en vanlig feil (spec §9).

-- === Ekstra hjelpefunksjoner ===
create or replace function is_org_member(org uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from memberships
    where organization_id = org and user_id = auth.uid() and is_active
  );
$$;

create or replace function project_org(p uuid) returns uuid
language sql stable security definer set search_path = public as $$
  select organization_id from projects where id = p;
$$;

-- === organizations ===
create policy organizations_select on organizations for select
  using (is_org_member(id));
create policy organizations_insert on organizations for insert
  with check (auth.uid() is not null); -- onboarding: oppretter blir admin i neste steg
create policy organizations_update on organizations for update
  using (current_role_in(id) = 'admin');

-- === profiles ===
create policy profiles_select on profiles for select
  using (
    id = auth.uid()
    or exists (
      select 1 from memberships m1
      join memberships m2 on m1.organization_id = m2.organization_id
      where m1.user_id = auth.uid() and m1.is_active
        and m2.user_id = profiles.id and m2.is_active
    )
  );
create policy profiles_insert on profiles for insert with check (id = auth.uid());
create policy profiles_update on profiles for update using (id = auth.uid());

-- === memberships ===
create policy memberships_select on memberships for select
  using (is_org_member(organization_id));
create policy memberships_insert on memberships for insert
  with check (
    user_id = auth.uid() -- onboarding: legg til deg selv
    or current_role_in(organization_id) in ('admin', 'manager') -- eller inviter
  );
create policy memberships_update on memberships for update
  using (current_role_in(organization_id) = 'admin');
create policy memberships_delete on memberships for delete
  using (current_role_in(organization_id) = 'admin');

-- === projects ===
create policy projects_select on projects for select
  using (current_role_in(organization_id) in ('admin', 'manager') or is_project_member(id));
create policy projects_insert on projects for insert
  with check (current_role_in(organization_id) in ('admin', 'manager'));
create policy projects_update on projects for update
  using (current_role_in(organization_id) in ('admin', 'manager'));

-- === project_members ===
create policy project_members_select on project_members for select
  using (
    is_project_member(project_id)
    or current_role_in(project_org(project_id)) in ('admin', 'manager')
  );
create policy project_members_write on project_members for all
  using (current_role_in(project_org(project_id)) in ('admin', 'manager'))
  with check (current_role_in(project_org(project_id)) in ('admin', 'manager'));

-- === daily_reports (select-policy ligger i 0002) ===
create policy reports_insert on daily_reports for insert
  with check (
    is_project_member(project_id)
    and author_id = auth.uid()
    and current_role_in(organization_id) in ('worker', 'engineer', 'supervisor', 'manager', 'admin')
  );
-- Forfatter redigerer eget utkast; ledelse/utførende kan endre status (levere/avvise).
-- Trigger trg_guard_signed hindrer endring av signert innhold.
create policy reports_update on daily_reports for update
  using (
    (author_id = auth.uid() and status = 'draft')
    or current_role_in(organization_id) in ('admin', 'manager', 'engineer', 'supervisor')
  );
create policy reports_delete on daily_reports for delete
  using (author_id = auth.uid() and status = 'draft'); -- kun eier, kun utkast

-- === report_manpower (arver rapportens synlighet) ===
create policy manpower_select on report_manpower for select
  using (report_id in (select id from daily_reports));
create policy manpower_write on report_manpower for all
  using (
    report_id in (
      select id from daily_reports
      where (author_id = auth.uid() and status = 'draft')
        or current_role_in(organization_id) in ('admin', 'manager', 'engineer', 'supervisor')
    )
  )
  with check (
    report_id in (
      select id from daily_reports
      where (author_id = auth.uid() and status = 'draft')
        or current_role_in(organization_id) in ('admin', 'manager', 'engineer', 'supervisor')
    )
  );

-- === attachments ===
create policy attachments_select on attachments for select
  using (report_id in (select id from daily_reports));
create policy attachments_insert on attachments for insert
  with check (
    uploaded_by = auth.uid()
    and (
      report_id is null
      or report_id in (
        select id from daily_reports
        where author_id = auth.uid()
          or current_role_in(organization_id) in ('admin', 'manager', 'engineer', 'supervisor')
      )
    )
  );
create policy attachments_update on attachments for update using (uploaded_by = auth.uid());
create policy attachments_delete on attachments for delete using (uploaded_by = auth.uid());

-- === signatures (uforanderlige: kun select + insert) ===
create policy signatures_select on signatures for select
  using (report_id in (select id from daily_reports));
create policy signatures_insert on signatures for insert
  with check (
    signer_id = auth.uid()
    and report_id in (
      select id from daily_reports
      where current_role_in(organization_id) in ('admin', 'manager', 'engineer', 'supervisor')
    )
  );

-- === channels (Client har INGEN chat-tilgang — spec §2/FR-6) ===
create policy channels_select on channels for select
  using (
    is_org_member(organization_id)
    and current_role_in(organization_id) <> 'client'
    and (
      project_id is null
      or is_project_member(project_id)
      or current_role_in(organization_id) in ('admin', 'manager')
    )
  );
create policy channels_insert on channels for insert
  with check (current_role_in(organization_id) in ('admin', 'manager'));

-- === messages (arver kanalens synlighet; Client utestengt via channels) ===
create policy messages_select on messages for select
  using (channel_id in (select id from channels));
create policy messages_insert on messages for insert
  with check (sender_id = auth.uid() and channel_id in (select id from channels));

-- === audit_log (kun lesing for ledelse; skriving skjer server-side via service_role) ===
create policy audit_select on audit_log for select
  using (current_role_in(organization_id) in ('admin', 'manager'));
