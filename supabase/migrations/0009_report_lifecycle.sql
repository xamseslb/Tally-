-- 0009_report_lifecycle.sql — Tilstandsmaskin for rapporter (spec §3 FR-3, FR-8).
-- utkast -> levert -> signert -> LÅST. Server-tid er autoritativ (CLAUDE.md #8).
-- Innholdshash (SHA-256) settes ved levering og bindes til signaturen.

alter table daily_reports add column if not exists review_note text;

-- Levér: kun forfatter, kun utkast. Setter content_hash + submitted_at (server-tid).
create or replace function submit_report(p_report_id uuid)
returns void
language plpgsql security definer set search_path = public, extensions
as $$
declare
  rpt daily_reports;
begin
  if auth.uid() is null then raise exception 'Not signed in'; end if;
  select * into rpt from daily_reports where id = p_report_id;
  if rpt.id is null then raise exception 'Unknown report'; end if;
  if rpt.author_id <> auth.uid() then raise exception 'Only the author can submit'; end if;
  if rpt.status <> 'draft' then raise exception 'Only drafts can be submitted'; end if;

  update daily_reports set
    status = 'submitted',
    submitted_at = now(),
    review_note = null,
    content_hash = encode(
      digest(coalesce(work_performed, '') || '|' || report_date::text || '|' || project_id::text, 'sha256'),
      'hex'
    )
  where id = p_report_id;
end;
$$;

-- Signér: prosjektmedlem eller ledelse. Binder signatur til innholdshash + server-tid.
create or replace function sign_report(p_report_id uuid, p_signer_role text, p_signature text)
returns void
language plpgsql security definer set search_path = public
as $$
declare
  rpt daily_reports;
begin
  if auth.uid() is null then raise exception 'Not signed in'; end if;
  select * into rpt from daily_reports where id = p_report_id;
  if rpt.id is null then raise exception 'Unknown report'; end if;
  if rpt.status <> 'submitted' then raise exception 'Report must be submitted before signing'; end if;
  if p_signer_role not in ('performer', 'approver') then raise exception 'Invalid signer role'; end if;
  if not (is_project_member(rpt.project_id) or current_role_in(rpt.organization_id) in ('admin', 'manager')) then
    raise exception 'No access to this report';
  end if;

  insert into signatures (id, report_id, signer_id, signer_role, signature_path, signed_content_hash, signed_at)
  values (gen_random_uuid(), p_report_id, auth.uid(), p_signer_role, coalesce(nullif(p_signature, ''), 'signed'), coalesce(rpt.content_hash, ''), now())
  on conflict (report_id, signer_role) do update set
    signer_id = excluded.signer_id,
    signature_path = excluded.signature_path,
    signed_content_hash = excluded.signed_content_hash,
    signed_at = excluded.signed_at;

  update daily_reports set status = 'signed' where id = p_report_id;
end;
$$;

-- Avvis: ledelse/utførende. Tilbake til utkast med kommentar.
create or replace function reject_report(p_report_id uuid, p_note text)
returns void
language plpgsql security definer set search_path = public
as $$
declare
  rpt daily_reports;
begin
  if auth.uid() is null then raise exception 'Not signed in'; end if;
  select * into rpt from daily_reports where id = p_report_id;
  if rpt.id is null then raise exception 'Unknown report'; end if;
  if rpt.status <> 'submitted' then raise exception 'Only submitted reports can be rejected'; end if;
  if current_role_in(rpt.organization_id) not in ('admin', 'manager', 'engineer', 'supervisor') then
    raise exception 'No permission to reject';
  end if;

  update daily_reports set status = 'draft', review_note = nullif(p_note, '') where id = p_report_id;
end;
$$;

revoke execute on function submit_report(uuid) from public;
revoke execute on function sign_report(uuid, text, text) from public;
revoke execute on function reject_report(uuid, text) from public;
grant execute on function submit_report(uuid) to authenticated;
grant execute on function sign_report(uuid, text, text) to authenticated;
grant execute on function reject_report(uuid, text) to authenticated;
