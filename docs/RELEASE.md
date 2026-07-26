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

**Infrastruktur**

- Supabase-prosjekt opprettet, region **West EU (Ireland), eu-west-1** (GDPR §4 dekket).
  Prosjekt-ref: `vfpajecjqjwotuvyrbmm`. Klient-tilkobling verifisert 2026-07-26.
- Bruker Supabases **nye nøkkelsystem**: publishable key (`sb_publishable_…`) i klient,
  secret keys kun i Edge Functions. Legacy anon/service_role brukes ikke.

**Gjenstår i Fase 0 (krever eksterne kontoer / valg)**

- [ ] Kjør migrasjonene mot prosjektet (`0001_init` + `0002_rls`), generer typer (`database.ts`)
- [ ] Last inn fontfiler (Archivo Condensed, Inter, IBM Plex Mono) — nå systemfont
- [ ] Sentry: legg til `@sentry/react-native` + config-plugin, guardet init via `EXPO_PUBLIC_SENTRY_DSN`
- [ ] Re-aktiver `typedRoutes` når appen først kjøres (genererer `.expo/types`)
- [ ] EAS development build på fysisk iPhone (krever Apple Developer — §11 pkt 4)
- [ ] Vurder Node 22 LTS

**Ferdig når:** CI grønn på tom app + EAS dev build kjører på fysisk iPhone.

## Fase 1 — Auth, organisasjon, roller (pågår)

**Gjort**

- Auth-infrastruktur: session-store (Zustand) + secure-store, auth-gate i ruting
- Innlogging: e-post/passord + magic link mot Supabase Auth, zod-validert, norske feil
- RLS-policies på **alle** tabeller per rolle (`0003_rls_policies.sql`) + pgTAP-suite
  (`0002_rls_roles.test.sql`) som beviser Client-rollens begrensninger
- CI-jobb `rls` kjører pgTAP i Docker (verifiseres når repoet får GitHub-remote)

**Kjørt mot prosjektet (2026-07-26):** `0003_rls_policies`, `0004_onboarding`.
Funksjonell røyktest bestått: anon nektes lesing (tomt) og skriving (42501),
`onboard_organization`-RPC deployet og avviser uinnloggede.

**⚠️ Gjenstår / uverifisert**

- [ ] **Full RLS-verifisering (pgTAP)** mangler fortsatt — den funksjonelle røyktesten
      dekker anon, men ikke hele rollematrisen (Client kun signerte osv.). Kjør via
      **Docker** (`npm run test:rls`) eller **GitHub CI** (jobben `rls`).
- [ ] Kjør `0005_harden_onboarding.sql` (fjerner PUBLIC execute på RPC-en — valgfritt, herding)
- [ ] Deploy `delete-account` edge function (`supabase functions deploy`)
- [ ] Invitasjonsflyt (invitere medlemmer med rolle)

## Åpne avklaringer med kunden (spec §11 — før Fase 3)

Bransje/arbeidsdag · brukerantall · signaturnivå (dok vs BankID) · hvem betaler
drift · rapportmal · eier av kode/data (skriftlig avtale) · Client-rollen eksternt.
