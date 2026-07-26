# Dagsverk

Offline-first mobilapp (React Native / Expo) for daglig dokumentasjon på
anleggs- og byggeplasser. En person med hansker, i regn, uten dekning, får
loggført dagens arbeid med bilder på under to minutter — og ledelsen får en
signert PDF ut av det.

> **Kilde til sannhet:** [`docs/SPEC.md`](docs/SPEC.md) (krav, arkitektur,
> byggeplan) og [`CLAUDE.md`](CLAUDE.md) (regler for utviklingen). Spec-en vinner
> over antakelser.

## Status

**Fase 0 — Fundament.** Prosjektskjelett, design-system, kvalitetsvakter, CI og
databaseskjema er på plass. Se `docs/SPEC.md` §8 for byggeplanen.

## Krav

- Node 22 LTS anbefalt (fungerer på 24, utenfor Expos støttede matrise)
- iOS: fysisk iPhone + Expo Go / EAS development build
- Supabase CLI (`npx supabase`) for lokal database

## Kom i gang

```bash
npm install --legacy-peer-deps
cp .env.example .env   # fyll inn når Supabase/Sentry er koblet til
npm start              # åpner Expo — trykk 'i' for iOS, 'a' for Android
```

## Skript

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # eslint + prettier --check
npm run lint:fix    # eslint --fix + prettier --write
npm test            # jest
npm run test:rls    # pgTAP mot lokal supabase
npm run e2e         # maestro
npm run db:reset    # kjør alle migrasjoner på nytt lokalt
```

Kjør `typecheck`, `lint` og `test` før du sier at noe er ferdig.

## Struktur (spec §6)

```
app/          expo-router (ruter). (auth), (tabs), report/[id]
src/
  features/   vertikale skiver: reports, media, sync, signatures
  ui/         design-system: tokens + Button, Field, Text, StatusStripe, Screen
  lib/        env, logger, i18n, supabase-klient
  db/         WatermelonDB (Fase 2)
  types/      delte domenetyper
supabase/     migrasjoner, Edge Functions, pgTAP-tester
e2e/          Maestro-flows
docs/         SPEC.md, ADR/, RELEASE.md
```

## Neste steg

**Fase 1 — Auth, organisasjon, roller.** Se `docs/SPEC.md` §8 og
`docs/RELEASE.md`. Krever tilkobling av Supabase (EU-region) og Apple Developer.
