-- pgTAP: beviser rollemodellen (spec §2/§9). Kjøres med `npm run test:rls`
-- (supabase test db) — krever Docker/lokal supabase eller CI-jobben `rls`.
--
-- Fokus: Client-rollen er den farligste. Den skal KUN se signerte rapporter på
-- egne prosjekter, og ingen chat.
begin;
select plan(4);

-- === Seed (som postgres — superuser omgår RLS) ===
insert into auth.users (id, email) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'admin@a.no'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'client@a.no'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'worker@a.no');

insert into profiles (id, full_name) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Admin'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Client'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Worker');

insert into organizations (id, name) values
  ('11111111-1111-1111-1111-111111111111', 'Org A');

insert into memberships (organization_id, user_id, role) values
  ('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'admin'),
  ('11111111-1111-1111-1111-111111111111', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'client'),
  ('11111111-1111-1111-1111-111111111111', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'worker');

insert into projects (id, organization_id, name) values
  ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Proj');

insert into project_members (project_id, user_id) values
  ('22222222-2222-2222-2222-222222222222', 'cccccccc-cccc-cccc-cccc-cccccccccccc'),
  ('22222222-2222-2222-2222-222222222222', 'dddddddd-dddd-dddd-dddd-dddddddddddd');

insert into daily_reports (id, organization_id, project_id, author_id, report_date, status) values
  ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111',
   '22222222-2222-2222-2222-222222222222', 'dddddddd-dddd-dddd-dddd-dddddddddddd', '2026-01-01', 'signed'),
  ('44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111',
   '22222222-2222-2222-2222-222222222222', 'dddddddd-dddd-dddd-dddd-dddddddddddd', '2026-01-02', 'draft');

insert into channels (id, organization_id, project_id, name) values
  ('55555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111',
   '22222222-2222-2222-2222-222222222222', 'Prosjektchat');

-- === Act som CLIENT ===
set local role authenticated;
select set_config(
  'request.jwt.claims',
  json_build_object('sub', 'cccccccc-cccc-cccc-cccc-cccccccccccc')::text,
  true
);

select is(
  (select count(*)::int from daily_reports),
  1,
  'Client ser kun 1 rapport (den signerte)'
);
select is(
  (select count(*)::int from daily_reports where status = 'draft'),
  0,
  'Client ser INGEN utkast'
);
select is(
  (select count(*)::int from channels),
  0,
  'Client ser ingen chat-kanaler'
);

-- === Act som WORKER (medlem, forfatter) ===
select set_config(
  'request.jwt.claims',
  json_build_object('sub', 'dddddddd-dddd-dddd-dddd-dddddddddddd')::text,
  true
);
select is(
  (select count(*)::int from daily_reports),
  2,
  'Worker ser begge sine rapporter (utkast + signert)'
);

select * from finish();
rollback;
