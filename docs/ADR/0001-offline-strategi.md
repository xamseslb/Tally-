# ADR 0001 — Offline-strategi: WatermelonDB + uforanderlige rapporter

**Status:** Vedtatt · **Dato:** 2026-07-25

## Kontekst

Kjernejobben skjer uten nett (spec §1). Offline er en arkitekturbeslutning som
avgjør datamodellen, ikke en funksjon som kan legges til senere (spec A.2).

## Beslutning

- Lokal database: **SQLite via WatermelonDB**, som har en ferdig, gjennomtestet
  synkprotokoll (`sync_pull` / `sync_push`). Vi skriver ikke vår egen.
- **Klienten eier utkast, serveren eier alt annet.** Rapporter er redigerbare
  kun som utkast, og utkast har én forfatter — dermed forsvinner nesten hele
  konfliktproblemet.
- **Signerte rapporter er uforanderlige.** Rettelser skjer ved revisjon
  (`supersedes_id`). Uforanderligheten er nettopp det som gjør synk løsbar.
- Media er ikke del av record-synken — egen lokal `upload_queue`, filer via
  `expo-file-system`, opplasting i bakgrunnen.

## Alternativer forkastet

- **Egen synkmotor:** for dyrt å eie og teste alene.
- **PowerSync foran Postgres:** koster penger. Revurderes etter Fase 6 hvis
  WatermelonDB-synk blir for tung (spec §5).
- **Mutérbare rapporter med CRDT-fletting:** unødvendig kompleksitet når
  utkast har én forfatter og signert er låst.

## Konsekvenser

Datalaget bygges rundt klientgenererte UUID-er og `deleted_at`-tombstones fra
første migrasjon. Server-tid er alltid autoritativ.
