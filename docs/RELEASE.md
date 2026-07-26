# RELEASE

Løpende logg over faser, beslutninger og gjenstående oppgaver.

## Fase 0 — Fundament (pågår)

**Gjort**

- Expo SDK 57 + TypeScript `strict` + expo-router, ryddet til spec §6-struktur
- Design-tokens (§7) + primitiver: `Button`, `Field`, `Text`, `StatusStripe`, `Screen`
- i18n (nb/en) fra dag én, `lib/env` (zod), `lib/logger`, `lib/supabase` (secure-store)
- Databaseskjema: `0001_init.sql` (alle tabeller) + `0002_rls.sql` (RLS deny-by-default, trigger)
- Kvalitetsvakter: ESLint flat + Prettier + Husky + lint-staged + commitlint
- CI: GitHub Actions (typecheck · lint · test)
- Docs: SPEC.md, CLAUDE.md, ADR 0001/0002, PR-mal

**Gjenstår i Fase 0 (krever eksterne kontoer / valg)**

- [ ] Last inn fontfiler (Archivo Condensed, Inter, IBM Plex Mono) — nå systemfont
- [ ] Sentry: legg til `@sentry/react-native` + config-plugin, guardet init via `EXPO_PUBLIC_SENTRY_DSN`
- [ ] Supabase-prosjekt i **EU-region**, kjør migrasjonene, generer typer (`database.ts`)
- [ ] `npx supabase init` for lokal `config.toml`
- [ ] Re-aktiver `typedRoutes` når appen først kjøres (genererer `.expo/types`)
- [ ] EAS development build på fysisk iPhone (krever Apple Developer — §11 pkt 4)
- [ ] Vurder Node 22 LTS

**Ferdig når:** CI grønn på tom app + EAS dev build kjører på fysisk iPhone.

## Åpne avklaringer med kunden (spec §11 — før Fase 3)

Bransje/arbeidsdag · brukerantall · signaturnivå (dok vs BankID) · hvem betaler
drift · rapportmal · eier av kode/data (skriftlig avtale) · Client-rollen eksternt.
