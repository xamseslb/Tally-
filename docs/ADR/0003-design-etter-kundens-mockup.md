# ADR 0003 — Design følger kundens mockup (overstyrer spec §7)

**Status:** Vedtatt · **Dato:** 2026-07-27

## Kontekst

Spec §7 definerte et bevisst gult/industrielt uttrykk (signal-gul primærfarge,
Archivo Condensed, alltid-synlig synkstripe). Kunden leverte en egen mockup med
et annet uttrykk: grønn primærfarge, hvite kort med myk skygge, statusmerker
(Signert/Levert/Utkast), ikon-fanelinje (Oversikt/Prosjekter/Chat/Profil), og
en ren header uten permanent stripe.

## Beslutning

**Vi følger kundens mockup.** Designet er kundens valg (appen publiseres under
deres navn). Tokens (`src/ui/tokens.ts`) og primitivene er oppdatert deretter.

Endringer:

- Primærfarge: gul `#FFB627` → grønn `#1B7A4B`.
- Nye primitiver: `Card`, `Badge`, `Header`. `Screen` viser ikke lenger en
  permanent synkstripe (den blir en offline-banner i Fase 6).
- Informasjonsarkitektur: faner er nå Oversikt / Prosjekter / Chat / Profil,
  med ikoner (`@expo/vector-icons`).

## Konsekvenser

- Spec §7 er utdatert på farge/typografi. `docs/SPEC.md` bør oppdateres, eller
  denne ADR-en gjelder som overstyring.
- Synkstripen som «signaturelement» er nedskalert; offline-status kommuniseres
  i stedet med en banner (mockup skjerm 10) når offline bygges.
- Ny avhengighet: `@expo/vector-icons` (ikoner).
