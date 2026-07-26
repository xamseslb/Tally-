# Dagsverk — Komplett brief

**Dato:** 25. juli 2026 · **Arbeidstittel:** Dagsverk _(anbefalt, ikke låst — se Del B)_

Dette er én selvstendig fil med alt: kundens opprinnelige melding, rammene for oppdraget, og full kravspesifikasjon med byggeplan. Den skal ligge i repoet som `docs/SPEC.md` og gis til Claude Desktop som kontekst i hver arbeidssamtale, sammen med `CLAUDE.md`.

**Innhold**

- Del A — Kundens opprinnelige melding, uendret
- Del B — Oppdragsrammer og forutsetninger
- Del C — Kravspesifikasjon og byggeplan

---

# Del A — Kundens opprinnelige melding

Gjengitt ordrett, slik den ble mottatt. Ligger her fordi det er den eneste primærkilden til hva kunden faktisk har bedt om, og fordi alt annet i dokumentet er tolkning på toppen av dette.

> - Daily reports
> - Team chat
> - Photo and video uploads
> - Offline mode (works without internet and syncs later)
> - User roles (Admin, Manager, Engineer, Supervisor, Worker, Client)
> - PDF and Excel report export
> - Electronic signature
>
> The points I listed are the kind of app I want. I listed them one by one, and we can start with the first two features, then add the remaining ones step by step as we develop the app. Alternatively, we can start with the two easiest features from the list and continue adding the others one at a time.

## A.1 Hva meldingen ikke sier

Dette er hullene, ikke kritikk — de må lukkes før Del C fase 3 starter. Full liste med spørsmål i §11.

- Ingen bransje, ingen brukerantall, ingen beskrivelse av en arbeidsdag
- Ingen plattform (mobil/web), ingen budsjett, ingen tidsramme
- Ingen avklaring av signaturnivå: dokumentasjon eller juridisk bindende
- Ingen rapportmal, ingen integrasjoner, ingen eierskapsavklaring
- Ingen begrunnelse for egenutvikling framfor eksisterende produkter (SmartDok, Dalux, Fieldwire, Next)

## A.2 Hvorfor rekkefølgen kunden foreslår ikke følges

Kunden foreslår «de to første» eller «de to enkleste» funksjonene først. Det gir teknisk gjeld, av tre grunner:

1. **Punktene er ikke like store.** «Offline mode» står som punkt fire, som om det er like stort som PDF-eksport. Det er den vanskeligste enkeltdelen i hele appen.
2. **Offline er en arkitekturbeslutning, ikke en funksjon.** Den avgjør datamodellen. Bygges den inn senere, må datalaget skrives om.
3. **Roller og datamodell må ligge først.** Alt annet håndhever rettigheter mot dem.

Byggeplanen i Del C følger derfor avhengigheter. Kunden får fortsatt inkrementell leveranse — én fase av gangen, hver fase demonstrerbar — men i en rekkefølge som ikke tvinger fram omskriving.

---

# Del B — Oppdragsrammer

Forutsetninger dette dokumentet er skrevet under:

- **Ubetalt.** Arbeidet gjøres uten vederlag. Det endrer ikke behovet for skriftlig avtale om eierskap, data og ansvar — se §11 punkt 6. Ubetalt arbeid uten avtale er den vanligste måten et hobbyprosjekt blir et personlig ansvar, særlig når appen behandler ansattes personopplysninger og bilder.
- **Bygges nå**, av én utvikler, med Claude Desktop som verktøy. Derfor er lesbarhet og testbarhet prioritert over eleganse overalt i Del C, og derfor finnes `CLAUDE.md`.
- **Skal i App Store.** Det tvinger fram beslutningen i §0 (multi-tenant) og sjekklisten i §10.
- **Profesjonelt nivå er definert, ikke antatt.** Se §9: tester i samme leveranse som koden, RLS-tester som beviser rollemodellen, TypeScript strict, ADR-er, CI som blokkerer merge. «Bra kode» uten målbare krav er en intensjon; §9 er kravene.
- **Navn:** Dagsverk brukes som arbeidstittel gjennom dokumentet. Navnet er kundens formelle valg siden appen publiseres under deres Apple-konto — søk og bytt ut hvis de vil noe annet.

---

# Del C — Kravspesifikasjon og byggeplan

**Versjon:** 1.0 · Eneste kilde til sannhet for krav, arkitektur og rekkefølge. Oppdateres når beslutninger endres — det skal aldri finnes krav som bare bor i en chat.

---

## 0. Beslutning som må tas først

Appen skal i App Store. Det gir to gjensidig utelukkende veier, og de gir to forskjellige apper:

|              | A: Multi-tenant SaaS _(anbefalt)_              | B: Intern app for én bedrift                                                               |
| ------------ | ---------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Distribusjon | Offentlig App Store                            | Apple Business Manager, Custom App                                                         |
| Registrering | Egenregistrering, flere organisasjoner         | Kunden inviterer ansatte                                                                   |
| Apple-risiko | Godkjennes normalt                             | Offentlig App Store avvises ofte etter retningslinje 4.2 (for smal nytte for allmennheten) |
| Datamodell   | `organization_id` på **alle** rader fra dag én | Kan sløyfes — og blir dyr å legge inn senere                                               |

**Valg: A.** Alt under er skrevet for A. Selv om kunden bare har én bedrift nå, koster `organization_id` nesten ingenting å ta med fra start og er nesten umulig å ettermontere. Bygg det som et produkt, ikke som et internverktøy.

---

## 1. Produktdefinisjon

**Hva:** Mobilapp for daglig dokumentasjon av arbeid på anleggs- og byggeplasser. Kjernejobben er at en person med hansker, i regn, uten dekning, får loggført dagens arbeid med bilder på under to minutter — og at ledelsen får en signert PDF ut av det.

**Primærbruker:** utøvende på plass (Worker, Supervisor). Appen er designet for dem. Ledelse og kunde er lesere.

**Kjerneverdi:** rapporten forlater aldri enheten uten å bli levert, og den kan ikke endres i etterkant uten spor.

**Ikke-mål (v1) — skriv dette ned og hold på det:**

- Ingen timeregistrering/lønn (eget domene, egne regler, eget prosjekt)
- Ingen tegning-/BIM-visning
- Ingen fakturering
- Ingen offline-chat (chat krever nett i v1)
- Ingen web-portal i v1 — men API-et skal ikke gjøre det umulig senere

---

## 2. Roller og rettigheter

Kundens seks roller beholdes som _navn_, men rettighetene reduseres til fire nivåer + prosjektmedlemskap. Seks parallelle regelsett er kompleksitet uten verdi.

| Rolle                 | Nivå | Rettigheter                                                                                                                        |
| --------------------- | ---- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Admin                 | 4    | Alt i organisasjonen. Brukeradmin, sletting, eksport, innstillinger                                                                |
| Manager               | 3    | Alle prosjekter. Godkjenne og signere rapporter, eksportere, invitere                                                              |
| Engineer / Supervisor | 2    | Egne prosjekter. Opprette og levere rapporter, signere som utførende, kommentere                                                   |
| Worker                | 1    | Egne prosjekter. Opprette utkast, laste opp media, skrive i chat                                                                   |
| Client                | 0    | Kun **leveranse-visning**: signerte rapporter på prosjekter de er tilknyttet. Ser ikke chat, ikke utkast, ikke interne kommentarer |

Regler:

- Rettigheter er alltid **rolle ∩ prosjektmedlemskap**. En Engineer på prosjekt A har ingenting å gjøre på prosjekt B.
- Client-rollen er den farligste i hele appen. Skriv en dedikert testsuite kun for "kan Client se noe den ikke skal se".
- Rettigheter håndheves i databasen (RLS), aldri bare i UI. UI skjuler, databasen nekter.

---

## 3. Funksjonelle krav

Hvert krav har ID (`FR-x`) og akseptansekriterier. Ingen funksjon er ferdig før kriteriene er automatisk testet.

### FR-1 Autentisering og organisasjon

- E-post + passord, magic link som fallback. **Sign in with Apple er påkrevd** hvis du legger til Google/Facebook-login (Apple-retningslinje 4.8).
- Invitasjon via e-post med rolle forhåndsvalgt.
- **Sletting av konto i appen** — obligatorisk krav fra Apple (5.1.1(v)). Ikke en lenke til support, en faktisk knapp.
- Sesjon overlever offline i minst 30 dager. En bruker som ikke har hatt dekning i tre uker skal ikke bli logget ut på plassen.

_Akseptanse:_ bruker med utløpt access token, uten nett, kommer inn i appen og kan skrive rapport.

### FR-2 Prosjekter (byggeplasser)

- Felter: navn, prosjektnummer, adresse, koordinater, byggherre, startdato, status (aktiv/pauset/avsluttet/arkivert).
- Medlemsliste med roller.
- Avsluttet prosjekt: lesbart, ikke skrivbart. Ingen sletting av prosjekt med rapporter — arkivering.

### FR-3 Daglige rapporter _(kjernen)_

Strukturerte felter — ikke ett fritekstfelt. Fritekst kan ikke eksporteres, filtreres eller signeres meningsfullt.

| Felt                  | Type                                           | Påkrevd    |
| --------------------- | ---------------------------------------------- | ---------- |
| Dato                  | dato (én per prosjekt per person per dag)      | ja         |
| Vær                   | valg + temperatur, autoutfylt fra API når nett | nei        |
| Bemanning             | liste: fag, antall, timer                      | ja         |
| Utført arbeid         | fritekst + valgbare aktivitetskoder            | ja         |
| Forsinkelser/avvik    | fritekst + årsakskategori                      | nei        |
| HMS-observasjoner     | fritekst + alvorlighetsgrad                    | nei        |
| Materialer/leveranser | liste                                          | nei        |
| Vedlegg               | bilder/video                                   | nei        |
| Posisjon              | GPS ved opprettelse                            | automatisk |

**Tilstandsmaskin — dette er den viktigste designbeslutningen i appen:**

```
utkast (draft) ──levér──> levert (submitted) ──signér──> signert (signed) ──> LÅST
     │                          │
     │                          └──avvis──> utkast (med kommentar)
     └──slett (kun eier, kun utkast)
```

- **Utkast:** privat for forfatter, redigerbart, bor lokalt, synkes som backup.
- **Levert:** synlig for Supervisor/Manager. Ikke redigerbart av forfatter.
- **Signert:** uforanderlig. Rettelser skjer ved **revisjon** — en ny rapport som peker på den gamle (`supersedes_id`). Ingen endring av signert dokument, noensinne.

Denne uforanderligheten er ikke byråkrati — den er det som gjør offline-synkronisering løsbar. Se §5.

_Akseptanse:_ forsøk på å oppdatere en `signed` rapport avvises av databasetrigger, ikke bare av UI.

### FR-4 Media (bilder og video)

- Kamera i appen + valg fra galleri. Bilder komprimeres til maks 1920px lang side, JPEG q80, på enheten før køing.
- Video: maks 60 sekunder, 720p, transkodes på enheten. **Hard grense.** Ubegrenset video på 4G er en lagringsregning kunden ikke har budsjettert.
- Hvert vedlegg: tidsstempel, opplaster, valgfri kommentar, valgfri annotering (piler/sirkler — fase 6).
- **GPS i EXIF strippes som standard.** Posisjon lagres i egen kolonne med eksplisitt samtykke i onboarding. Ikke skjul lokasjonsdata i bildefiler.
- Køen er synlig for brukeren: "3 bilder venter på nett". Aldri en usynlig kø.

_Akseptanse:_ 20 bilder tatt i flymodus lastes opp i riktig rekkefølge, uten duplikater, når nettet kommer tilbake — også hvis appen ble drept underveis.

### FR-5 Offline-modus

Se §5 for arkitektur. Krav:

- All lesing og skriving av rapporter, utkast og vedlegg fungerer uten nett.
- Synkstatus er alltid synlig (se signaturelementet i §7).
- Ingen "tapt arbeid" er akseptabelt. Data skrives til lokal SQLite før UI bekrefter noe.
- Konflikter løses uten at brukeren må forstå ordet "konflikt".

### FR-6 Chat

- Kanal per prosjekt + direktemeldinger. Client-rollen har ingen tilgang.
- Krever nett i v1. Meldinger skrevet offline legges i utboks og sendes ved tilkobling, med `client_id` for idempotens (ingen dobbeltposting).
- Push-varsler, uleste-teller, @-nevning.
- Filvedlegg: kun bilder i v1.

### FR-7 Eksport (PDF og Excel)

- **PDF:** genereres på serveren, ikke på klienten. Klientgenerert PDF gir ulikt resultat per enhet og kan ikke reproduseres i en revisjon. Mal med kundens logo, prosjekthode, alle felter, signaturbilder, vedleggsgalleri, sidenummer, dokument-ID og hash i bunntekst.
- **Excel:** flate rader for perioder, én rad per rapport + separat ark for bemanning og avvik. Til analyse, ikke til lesing.
- Utvalg: prosjekt + datointervall + status.
- Genereres asynkront, brukeren får varsel med nedlastingslenke som utløper.
- Hver eksport logges i `audit_log` med hvem, hva og når.

### FR-8 Elektronisk signatur

Vær ærlig i UI om hva dette er.

- **v1: enkel elektronisk signatur** (eIDAS «simple»). Bruker tegner på skjerm → PNG. Lagres med navn, rolle, tidsstempel (server-tid, ikke enhetstid), enhets-ID, IP og SHA-256-hash av rapportens innhold på signeringstidspunktet.
- Signaturen binder seg til **hash av innholdet**. Endres innholdet, er signaturen ugyldig og kan bevises ugyldig.
- To signaturroller: utførende og godkjennende. Rapport er `signed` når påkrevde signaturer finnes.
- Ikke kall det «juridisk bindende» i UI eller markedsføring. Skal det være det, trengs BankID via leverandør (Signicat, Posten Signering, Scrive) — planlagt som fase 9, med kostnad kunden må godta.

---

## 4. Ikke-funksjonelle krav

**Ytelse**

- Kaldstart til brukbar liste: < 2 s på iPhone 11.
- Åpne rapportskjema: < 300 ms.
- Liste med 2 000 lokale rapporter: 60 fps ved scrolling (virtualisert liste, ingen `map` over hele settet).
- Appstørrelse: < 60 MB nedlastet.

**Robusthet**

- Appen skal aldri vise en hvit skjerm. Error boundary på rutenivå med "prøv igjen".
- Alle nettverkskall: timeout 15 s, retry med eksponentiell backoff og jitter, maks 5 forsøk.
- Alle skjemaer: autolagring til lokal database ved hver endring med debounce på 500 ms.

**Sikkerhet**

- RLS på hver eneste tabell. Standard er DENY.
- Tokens i Keychain/Keystore (`expo-secure-store`), aldri i AsyncStorage.
- Signerte, tidsbegrensede URL-er for media (maks 1 time). Ingen offentlige buckets.
- Ingen hemmeligheter i klienten. `service_role`-nøkkel finnes kun i Edge Functions.
- Ratebegrensning på alle skrive-endepunkter.
- Bruker-input valideres med zod på klient **og** i database-constraints. Klientvalidering er UX, ikke sikkerhet.

**Personvern (GDPR)**

- Data lagres i EU-region. Skriv det ned hvilken.
- Databehandleravtale med kunden — også når du ikke tar betalt. Uten den er du personlig eksponert for behandling av ansattes data.
- Personvernerklæring på offentlig URL — Apple krever den før innsending.
- Bilder av personer: onboarding-tekst om at ansatte skal informeres. Byggeplassbilder inneholder identifiserbare folk.
- Sletting: rapporter er dokumentasjon og kan ha oppbevaringsplikt. Slett bruker → anonymiser forfatter (`"Slettet bruker"`), behold rapporten. Dokumenter dette valget.
- Datauttrekk for én bruker på forespørsel.

**Tilgjengelighet og feltforhold** — dette skiller en profesjonell feltapp fra en demo:

- Minste treffområde 48×48 pt. Hansker.
- Brødtekst minimum 17 pt, støtte for Dynamic Type opp til 200 %.
- Kontrast minst 4.5:1, primærhandlinger 7:1. Solskinn på skjerm.
- VoiceOver-labels på alle interaktive elementer.
- Respekter `prefers-reduced-motion`.
- Alt viktig fungerer med én hånd, nedre halvdel av skjermen.
- Norsk bokmål som standard, engelsk som andre språk. i18n fra dag én — etterinnføring av oversettelse er dyrt.

**Observabilitet**

- Sentry for crash og feil, med release-tagging og source maps.
- Strukturert logging av synkhendelser lokalt, med "send diagnostikk"-knapp i innstillinger.
- Nøkkeltall: synkfeilrate, kølengde, tid fra levert til signert.

---

## 5. Arkitektur

### Stack

| Lag            | Valg                                                             | Grunn                                                                                       |
| -------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| App            | React Native via Expo (nyeste stabile SDK), TypeScript `strict`  | EAS Build/Submit gjør App Store-løpet håndterbart alene. Verifiser SDK-versjon ved oppstart |
| Navigasjon     | expo-router (filbasert)                                          | Typede ruter, deep links gratis                                                             |
| Lokal database | SQLite via WatermelonDB                                          | Har en ferdig, gjennomtestet synkprotokoll. Ikke skriv din egen                             |
| Server-state   | TanStack Query for det som ikke er synket (eksport, brukeradmin) |                                                                                             |
| UI-state       | Zustand. Ingen Redux                                             |                                                                                             |
| Skjema         | react-hook-form + zod                                            | Du bruker dette allerede                                                                    |
| Backend        | Supabase: Postgres, Auth, Storage, Realtime, Edge Functions      | Du har erfaring fra AlphaFrame. RLS er riktig sted for rollemodellen                        |
| PDF/Excel      | Edge Function (Deno): `pdf-lib` / `SheetJS`                      | Serverside = reproduserbart                                                                 |
| Feil           | Sentry                                                           |                                                                                             |
| CI/CD          | GitHub Actions + EAS                                             |                                                                                             |

Alternativ hvis synk blir for tung å eie selv: **PowerSync** foran Postgres. Koster penger, sparer uker. Ta beslutningen etter fase 6, ikke før.

### Datamodell

```sql
-- Alle tabeller: organization_id, created_at, updated_at, deleted_at (soft delete for synk)

create type app_role as enum ('admin','manager','engineer','supervisor','worker','client');
create type report_status as enum ('draft','submitted','signed','rejected');
create type project_status as enum ('active','paused','completed','archived');

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

create table projects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations on delete cascade,
  name text not null,
  project_number text,
  address text,
  lat double precision, lng double precision,
  client_name text,
  status project_status not null default 'active',
  starts_on date, ends_on date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table project_members (
  project_id uuid not null references projects on delete cascade,
  user_id uuid not null references profiles on delete cascade,
  primary key (project_id, user_id)
);

create table daily_reports (
  id uuid primary key,                       -- generert på KLIENTEN (uuid v4)
  organization_id uuid not null references organizations on delete cascade,
  project_id uuid not null references projects on delete cascade,
  author_id uuid not null references profiles,
  report_date date not null,
  status report_status not null default 'draft',
  weather_code text, temperature_c numeric(4,1),
  work_performed text,
  delays text, delay_reason text,
  hse_notes text, hse_severity smallint,
  lat double precision, lng double precision,
  content_hash text,                         -- SHA-256, settes ved submit
  supersedes_id uuid references daily_reports, -- revisjon av tidligere rapport
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (project_id, author_id, report_date, coalesce(supersedes_id, '00000000-0000-0000-0000-000000000000'::uuid))
);

create table report_manpower (
  id uuid primary key,
  report_id uuid not null references daily_reports on delete cascade,
  trade text not null, headcount int not null check (headcount > 0),
  hours numeric(5,2) not null check (hours >= 0),
  updated_at timestamptz not null default now(), deleted_at timestamptz
);

create table attachments (
  id uuid primary key,                       -- klientgenerert
  organization_id uuid not null references organizations on delete cascade,
  report_id uuid references daily_reports on delete cascade,
  storage_path text,                         -- null til opplasting er ferdig
  kind text not null check (kind in ('image','video')),
  bytes bigint, width int, height int, duration_s numeric(6,2),
  caption text,
  captured_at timestamptz,
  uploaded_by uuid not null references profiles,
  updated_at timestamptz not null default now(), deleted_at timestamptz
);

create table signatures (
  id uuid primary key,
  report_id uuid not null references daily_reports on delete cascade,
  signer_id uuid not null references profiles,
  signer_role text not null check (signer_role in ('performer','approver')),
  signature_path text not null,              -- PNG i storage
  signed_content_hash text not null,         -- hva som faktisk ble signert
  signed_at timestamptz not null default now(),  -- SERVER-tid
  device_info jsonb, ip inet,
  unique (report_id, signer_role)
);

create table channels (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations on delete cascade,
  project_id uuid references projects on delete cascade,
  name text
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null unique,            -- idempotensnøkkel fra utboks
  channel_id uuid not null references channels on delete cascade,
  sender_id uuid not null references profiles,
  body text,
  attachment_id uuid references attachments,
  created_at timestamptz not null default now()
);

create table audit_log (
  id bigserial primary key,
  organization_id uuid not null,
  actor_id uuid,
  action text not null,                      -- 'report.signed', 'export.created', ...
  entity text not null, entity_id uuid,
  metadata jsonb,
  created_at timestamptz not null default now()
);
```

**RLS-mønster** — hjelpefunksjoner, deretter policy per tabell:

```sql
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

alter table daily_reports enable row level security;

-- Client-rollen ser KUN signerte rapporter på egne prosjekter
create policy reports_select on daily_reports for select using (
  is_project_member(project_id)
  and (
    current_role_in(organization_id) in ('admin','manager')
    or (current_role_in(organization_id) = 'client' and status = 'signed')
    or (current_role_in(organization_id) in ('engineer','supervisor'))
    or (current_role_in(organization_id) = 'worker'
        and (author_id = auth.uid() or status <> 'draft'))
  )
);

-- Uforanderlighet håndheves i databasen, ikke i UI
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
```

### Synkronisering

Prinsipp: **klienten eier utkast, serveren eier alt annet.**

Fordi en rapport er redigerbar kun som utkast, og utkast har én forfatter, forsvinner nesten hele konfliktproblemet. Det som gjenstår løses slik:

| Situasjon                                              | Regel                                                                                                   |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| Utkast endret på to enheter                            | Last-write-wins på `updated_at` fra klient. Taperversjonen lagres som revisjon-utkast, brukeren varsles |
| Rapport levert på enhet A, redigert offline på enhet B | Serveren vinner. Endringen fra B blir et nytt utkast med `supersedes_id`                                |
| Signert rapport endret offline                         | Avvises. Brukeren får forklart at det må lages revisjon                                                 |
| Duplikat opprettelse                                   | Klientgenererte UUID-er + unique-constraint. Push er idempotent                                         |
| Slettet på server, endret på klient                    | Sletting vinner. Tombstone via `deleted_at`                                                             |

To RPC-er, WatermelonDBs protokoll:

```
sync_pull(last_pulled_at timestamptz)
  -> { changes: { table: { created[], updated[], deleted[] } }, timestamp }

sync_push(changes jsonb, last_pulled_at timestamptz)
  -> { rejected: [{ id, reason }] }
```

Regler for implementasjonen:

- Server-tid er alltid autoritativ. Klientklokker er feil.
- Push kjøres i **én transaksjon**. Delvis anvendt push er verre enn ingen push.
- Media er **ikke** del av record-synken. Egen `upload_queue`-tabell lokalt, filer i `expo-file-system`, opplasting med `expo-task-manager` i bakgrunnen, resumable der det er mulig.
- Køen tømmes FIFO per rapport, så en rapport aldri vises halvt opplastet.
- `rejected` fra serveren er ikke en krasj — det er en UI-tilstand som må designes.

---

## 6. Prosjektstruktur

```
dagsverk/
├─ CLAUDE.md                   # regler for AI-assistert utvikling (egen fil)
├─ docs/
│  ├─ SPEC.md                  # dette dokumentet
│  ├─ ADR/0001-offline-strategi.md   # én ADR per arkitekturvalg
│  └─ RELEASE.md
├─ app/                        # expo-router
│  ├─ (auth)/
│  ├─ (tabs)/
│  │  ├─ projects/
│  │  ├─ reports/
│  │  └─ chat/
│  └─ report/[id]/
├─ src/
│  ├─ features/                # vertikale skiver, ikke tekniske lag
│  │  ├─ reports/  { api, model, ui, hooks, __tests__ }
│  │  ├─ media/
│  │  ├─ sync/
│  │  └─ signatures/
│  ├─ db/          # WatermelonDB schema + migrations
│  ├─ ui/          # design system: Button, Field, StatusStripe ...
│  ├─ lib/         # zod-skjemaer, formattering, i18n
│  └─ types/
├─ supabase/
│  ├─ migrations/              # nummererte, aldri redigert etter merge
│  ├─ functions/  { sync, export-pdf, export-xlsx }
│  └─ tests/                   # pgTAP: RLS-tester
├─ e2e/                        # Maestro flows
└─ .github/workflows/ci.yml
```

Regler:

- Organiser etter **feature**, ikke etter filtype. `components/`, `utils/`, `helpers/` som toppnivåmapper blir søppelbøtter.
- Ingen fil over 300 linjer. Ingen funksjon over 50.
- `src/features/x` importerer aldri fra `src/features/y`. Delt kode flyttes til `src/lib` eller `src/ui`.
- Enveis avhengighet: `app/` → `features/` → `ui/`,`lib/` → `db/`.

---

## 7. Design

Ikke bygg dette med standardkomponenter og blå knapper. Byggeplass er et visuelt språk som allerede finnes — skiltmateriell, varselfarger, sjablongtekst — og appen skal se ut som den hører til der, ikke som en generisk SaaS-dashboard.

**Farger** (definer som tokens, aldri hardkodet hex i komponenter):

```
--ink       #0F1417   tekst, mørk flate
--slate     #38444B   sekundærtekst, kantlinjer
--concrete  #E8EAE9   flater, kort
--paper     #F7F8F7   bakgrunn
--signal    #FFB627   primærhandling, "krever handling"
--hivis     #B4E000   synket / OK — brukes sparsomt
--alert     #C8321E   feil, HMS-avvik
```

**Typografi**

- Display/overskrifter: en smal industriell sans (Archivo Condensed eller Roboto Condensed) — skiltspråk, og gir plass til lange norske ord på smal skjerm.
- Brødtekst: Inter, minimum 17 pt.
- Data og tidsstempler: IBM Plex Mono. Rapport-ID, klokkeslett og synkstatus i monospace leses raskere og signaliserer «dette er en logg».

**Signaturelement: synkstripen.** En 4 pt stripe i toppen av skjermen, alltid synlig.

- Synket: sammenhengende `--hivis`.
- Venter/offline: diagonale gule/svarte striper som sperrebånd, med antall ventende elementer.
- Feil: `--alert`, trykkbar til synklogg.

Den løser det reelle problemet i en offline-app — «kom dataene mine frem?» — uten et modalvindu, og den er umiskjennelig fra denne bransjen. All annen bevegelse i appen holdes rolig; stripen er det ene stedet med personlighet.

**Tekst i grensesnittet**

- Knapper sier hva som skjer: «Levér rapport», ikke «Send inn». Handlingen heter det samme hele veien: knappen «Signér» gir bekreftelsen «Signert».
- Feilmeldinger unnskylder seg ikke og er aldri vage. «Bildet ble ikke lastet opp. Prøv igjen når du har dekning.» — ikke «Noe gikk galt».
- Tomme skjermer er en invitasjon: «Ingen rapport for i dag. Start dagens rapport.»

---

## 8. Byggeplan

Rekkefølgen følger avhengigheter, ikke enkelhet. Én fase av gangen, hver fase i egen branch, merget bare når «ferdig» er oppfylt.

**Fase 0 — Fundament** _(1–2 dager)_
Expo + TS strict + expo-router. ESLint, Prettier, Husky, lint-staged, commitlint. Sentry. GitHub Actions: typecheck + lint + test. Supabase-prosjekt i EU-region, migrasjoner som filer fra første commit. Design tokens og fire UI-primitiver. `CLAUDE.md` i repoet.
_Ferdig når:_ CI grønn på tom app, EAS development build kjører på fysisk iPhone.

**Fase 1 — Auth, organisasjon, roller** _(3–4 dager)_
Innlogging, invitasjon, medlemskap, rollemodell, RLS-policies på alle tabeller, kontosletting.
_Ferdig når:_ pgTAP-suite beviser at hver rolle ser presis det den skal — særlig at Client ser ingenting annet enn signerte rapporter.

**Fase 2 — Prosjekter + lokal database** _(3–4 dager)_
WatermelonDB-schema, sync_pull/sync_push, prosjektliste og -detalj. Kun tekst, ingen media.
_Ferdig når:_ prosjekter opprettet offline på to enheter konvergerer korrekt. Skriv testen som beviser det.

**Fase 3 — Daglige rapporter** _(5–7 dager)_
Skjema med autolagring, tilstandsmaskin, revisjonslogikk, databasetrigger for uforanderlighet, listevisning med filtre.
_Ferdig når:_ full syklus utkast → levert → signert → låst fungerer offline, og forsøk på å endre signert rapport avvises av databasen.

**Fase 4 — Media** _(4–6 dager)_
Kamera, komprimering, EXIF-stripping, opplastingskø med bakgrunnsoppgave, retry, galleri, signerte URL-er.
_Ferdig når:_ 20 bilder i flymodus + app drept + omstart = alle 20 lastet opp én gang hver.

**Fase 5 — PDF-eksport og signatur** _(4–6 dager)_
Signaturlerret, hashing, audit trail, Edge Function for PDF med kundens mal.
_Ferdig når:_ identisk PDF genereres to ganger fra samme rapport, med verifiserbar hash.

**Fase 6 — Offline-herding** _(3–5 dager — ikke hopp over denne)_
Konfliktscenarier, avvist-push-UI, synklogg, synkstripen, feltprøve på reell plass med dårlig dekning.
_Ferdig når:_ du har kjørt konfliktmatrisen i §5 manuelt, punkt for punkt, og hver linje har en automatisk test.

**Fase 7 — Excel-eksport** _(2 dager)_

**Fase 8 — Chat** _(4–6 dager)_
Realtime, utboks med `client_id`, push, uleste. Sist fordi den ikke er kjernen og lett kan kuttes hvis tiden går.

**Fase 9 — App Store** _(3–5 dager, planlegg for avvisning i første runde)_
Se §10.

**Fase 10 — Senere:** BankID-signatur, annotering av bilder, web-portal for Client, tegningsvisning.

---

## 9. Kvalitetskrav til utviklingen

Dette er delen som avgjør om resultatet er profesjonelt eller bare ser sånn ut.

**Testing** — testene skrives i samme PR som koden, ikke etterpå.

- Enhetstester (Jest): all forretningslogikk — tilstandsmaskin, hashing, konfliktløsning, formattering.
- Komponenttester (React Native Testing Library): skjemavalidering, tilstander, tilgjengelighetslabels.
- Databasetester (pgTAP): RLS per rolle. Dette er din viktigste testsuite. En RLS-bug er et datalekkasjeavvik, ikke en feil.
- Synktester: simuler to klienter mot samme server programmatisk. Ikke test synk manuelt.
- E2E (Maestro): tre flyter — logg inn, skriv og levér rapport, signér.
- Manuell matrise før hver release: flymodus, 2G, tapt nett midt i opplasting, app drept, batterisparing, klokke feilstilt.
- Dekningskrav: 80 % på `src/features/*/model` og `sync`. Ikke jag prosent i UI-kode.

**Kodekvalitet**

- TypeScript `strict: true`. `any` er forbudt — bruk `unknown` og valider.
- Zod på hver grense: API-respons, dyplenke-parametre, skjema, lagret JSON.
- Ingen `console.log` i main. Bruk logger med nivåer.
- Ingen magiske tall eller strenger. Enums og konstanter.
- Alle asynkrone kall har eksplisitt feilhåndtering. Ingen naken `await`.

**Git og prosess**

- Conventional Commits (`feat:`, `fix:`, `chore:`) — gir automatisk changelog.
- Korte branches, PR selv når du er alene. PR-en er der du leser din egen kode med fremmede øyne.
- Sjekkliste i PR-mal: tester lagt til, spec oppdatert, ingen hemmeligheter, tilgjengelighet sjekket, offline testet.
- Én ADR per arkitekturvalg i `docs/ADR/`. Fremtidige deg vil ikke huske hvorfor du valgte WatermelonDB.
- Migrasjoner er uforanderlige etter merge. Feil rettes med ny migrasjon.

**Når du bruker Claude Desktop til å bygge**

- Én fase per samtale. Gi den `CLAUDE.md` og `docs/SPEC.md` som kontekst hver gang.
- Be om plan før kode, og godkjenn planen. Ikke la den skrive 800 linjer på første forsøk.
- Krev tester i samme leveranse som koden.
- Les hver diff. Kode du ikke har lest, kan du ikke vedlikeholde — og du skal vedlikeholde dette alene.
- Etter hver fase: bruk en fersk samtale til å _kritisere_ koden mot spec-en. Gjennomgang i ny kontekst finner det bygging i samme kontekst overser.

---

## 10. App Store — sjekkliste

Ting som oftest velter en førstegangsinnsending:

- [ ] **Demokonto** i Review-notatene med utfylt testdata. Login-vegg uten demokonto = automatisk avvisning.
- [ ] **Kontosletting inne i appen.** Retningslinje 5.1.1(v).
- [ ] `PrivacyInfo.xcprivacy` med begrunnelse for hvert API som krever det.
- [ ] Nutrition labels i App Store Connect stemmer **eksakt** med hva appen faktisk samler (lokasjon, bilder, kontaktinfo, brukerinnhold, diagnostikk).
- [ ] Personvernerklæring på offentlig URL.
- [ ] Presise `Info.plist`-tekster: kamera, bilder, lokasjon, varsler. Skriv hvorfor, ikke hva. «Brukes til å dokumentere arbeid på byggeplass med bilder.»
- [ ] Sign in with Apple hvis annen tredjeparts-login finnes.
- [ ] Retningslinje 4.2: appen må ha nytte utover én bedrift. Derfor multi-tenant og egenregistrering (§0).
- [ ] Ikon uten alfakanal, splash, skjermbilder for alle påkrevde størrelser. Skjermbilder skal vise reelt innhold, ikke mockups med lorem ipsum.
- [ ] Aldersgrense, eksportcompliance (bruker standard kryptering: ja).
- [ ] TestFlight-runde med minst tre reelle brukere på reell plass før innsending.
- [ ] Ingen «beta», «demo» eller placeholder-tekst noe sted i appen.
- [ ] Fungerende offline-oppførsel ved første oppstart — reviewere tester ofte med dårlig nett.
- [ ] Apple Developer Program: **kundens** organisasjonskonto med D-U-N-S hvis appen er kundens produkt. Ikke publiser kundens app under ditt personlige navn — det gir deg ansvar for et produkt du ikke eier.

---

## 11. Det som må avklares med kunden før fase 3

Du trenger ikke penger for å trenge svar. Send disse skriftlig:

1. Bransje og typisk arbeidsdag — påvirker feltene i rapporten direkte.
2. Antall brukere og prosjekter i år 1.
3. Signatur: dokumentasjon eller juridisk bindende (BankID, med kostnad)?
4. Hvem betaler drift: server, lagring, Apple Developer (99 USD/år), push, ev. signaturleverandør?
5. Rapportmal — har de en eksisterende PDF de vil ha etterlignet?
6. Eier av kode og data. **Skriv en enkel avtale selv om arbeidet er gratis:** hvem eier koden, hvem eier dataene, hva skjer hvis du slutter, og at du ikke garanterer for driftsavbrudd. Gratisarbeid uten avtale er den vanligste måten et hobbyprosjekt blir et ansvar.
7. Skal Client-rollen faktisk brukes eksternt? Hvis ja, er den din største sikkerhetsrisiko og trenger egen gjennomgang.
