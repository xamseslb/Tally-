-- 0001_init.sql — Kjernedatamodell for Dagsverk (spec §5).
-- Migrasjoner er UFORANDERLIGE etter merge (CLAUDE.md regel #9). Rett feil med ny migrasjon.
-- Alle tabeller bærer organization_id fra dag én (spec §0: multi-tenant).

-- === Enums ===
create type app_role as enum ('admin', 'manager', 'engineer', 'supervisor', 'worker', 'client');
create type report_status as enum ('draft', 'submitted', 'signed', 'rejected');
create type project_status as enum ('active', 'paused', 'completed', 'archived');

-- === Organisasjoner ===
create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  org_number text,
  logo_path text,
  created_at timestamptz not null default now()
);

create table profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text not null,
  phone text,
  avatar_path text,
  locale text not null default 'nb',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table memberships (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations on delete cascade,
  user_id uuid not null references profiles on delete cascade,
  role app_role not null,
  is_active boolean not null default true,
  unique (organization_id, user_id)
);

-- === Prosjekter (byggeplasser) ===
create table projects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations on delete cascade,
  name text not null,
  project_number text,
  address text,
  lat double precision,
  lng double precision,
  client_name text,
  status project_status not null default 'active',
  starts_on date,
  ends_on date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table project_members (
  project_id uuid not null references projects on delete cascade,
  user_id uuid not null references profiles on delete cascade,
  primary key (project_id, user_id)
);

-- === Daglige rapporter (kjernen) ===
create table daily_reports (
  id uuid primary key, -- generert på KLIENTEN (uuid v4) for offline-opprettelse
  organization_id uuid not null references organizations on delete cascade,
  project_id uuid not null references projects on delete cascade,
  author_id uuid not null references profiles,
  report_date date not null,
  status report_status not null default 'draft',
  weather_code text,
  temperature_c numeric(4, 1),
  work_performed text,
  delays text,
  delay_reason text,
  hse_notes text,
  hse_severity smallint,
  lat double precision,
  lng double precision,
  content_hash text, -- SHA-256, settes ved submit
  supersedes_id uuid references daily_reports, -- revisjon av tidligere rapport
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- Én rapport per prosjekt/forfatter/dato. Revisjoner (med supersedes_id) er egne
-- rader; coalesce gjør at originalen (null) og hver revisjon får hver sin unike
-- verdi. NB: uttrykk kan ikke stå i en table-constraint (spec §5 hadde dette som
-- `unique (...)`, som gir syntaksfeil) — det må være et unique index.
create unique index daily_reports_one_per_day on daily_reports (
  project_id,
  author_id,
  report_date,
  coalesce(supersedes_id, '00000000-0000-0000-0000-000000000000'::uuid)
);

create table report_manpower (
  id uuid primary key,
  report_id uuid not null references daily_reports on delete cascade,
  trade text not null,
  headcount int not null check (headcount > 0),
  hours numeric(5, 2) not null check (hours >= 0),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table attachments (
  id uuid primary key, -- klientgenerert
  organization_id uuid not null references organizations on delete cascade,
  report_id uuid references daily_reports on delete cascade,
  storage_path text, -- null til opplasting er ferdig
  kind text not null check (kind in ('image', 'video')),
  bytes bigint,
  width int,
  height int,
  duration_s numeric(6, 2),
  caption text,
  captured_at timestamptz,
  uploaded_by uuid not null references profiles,
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table signatures (
  id uuid primary key,
  report_id uuid not null references daily_reports on delete cascade,
  signer_id uuid not null references profiles,
  signer_role text not null check (signer_role in ('performer', 'approver')),
  signature_path text not null, -- PNG i storage
  signed_content_hash text not null, -- hva som faktisk ble signert
  signed_at timestamptz not null default now(), -- SERVER-tid, aldri enhetstid
  device_info jsonb,
  ip inet,
  unique (report_id, signer_role)
);

-- === Chat ===
create table channels (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations on delete cascade,
  project_id uuid references projects on delete cascade,
  name text
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null unique, -- idempotensnøkkel fra utboks (ingen dobbeltposting)
  channel_id uuid not null references channels on delete cascade,
  sender_id uuid not null references profiles,
  body text,
  attachment_id uuid references attachments,
  created_at timestamptz not null default now()
);

-- === Revisjonslogg ===
create table audit_log (
  id bigserial primary key,
  organization_id uuid not null,
  actor_id uuid,
  action text not null, -- 'report.signed', 'export.created', ...
  entity text not null,
  entity_id uuid,
  metadata jsonb,
  created_at timestamptz not null default now()
);
