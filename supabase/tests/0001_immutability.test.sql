-- pgTAP: beviser at uforanderlighets-vakten er på plass (spec §3 FR-3, §9).
-- Kjøres med `npm run test:rls` (supabase test db).
begin;
select plan(2);

-- Bruk entydige signaturer: has_function(schema, navn) og has_trigger(tabell, navn).
select has_function('public'::name, 'guard_signed_reports'::name);
select has_trigger('daily_reports'::name, 'trg_guard_signed'::name);

select * from finish();
rollback;
