-- 0006_grants.sql — Eksplisitte tabell-grants til anon/authenticated.
--
-- RLS er den egentlige gaten (row-nivå), men roller trenger også tabell-nivå
-- privilegier. Hosted Supabase gir disse automatisk via default-privilegier;
-- lokalt/CI gjør de ikke det, så `authenticated` fikk "permission denied" og
-- pgTAP-testen feilet. Vi setter dem eksplisitt så lokal = CI = prod.
--
-- Merk: dette svekker ikke sikkerheten — uten en RLS-policy som slipper raden
-- gjennom, ser rollen fortsatt ingenting. anon får kun select (og nektes av RLS).

grant usage on schema public to anon, authenticated;

grant all on all tables in schema public to authenticated;
grant select on all tables in schema public to anon;
grant usage, select on all sequences in schema public to authenticated;

-- Framtidige tabeller (opprettet av postgres i migrasjoner) arver samme grants.
alter default privileges in schema public grant all on tables to authenticated;
alter default privileges in schema public grant select on tables to anon;
alter default privileges in schema public grant usage, select on sequences to authenticated;
