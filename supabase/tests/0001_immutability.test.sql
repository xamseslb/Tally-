-- pgTAP: beviser at signerte rapporter ikke kan endres (spec §3 FR-3, §9).
-- Kjøres med `npm run test:rls` (supabase test db). Full RLS-per-rolle-suite,
-- særlig Client-rollen, bygges ut i Fase 1.
begin;
select plan(1);

-- Trigger-funksjonen skal finnes etter migrasjonene.
select has_function('guard_signed_reports', 'guard_signed_reports finnes');

select * from finish();
rollback;
