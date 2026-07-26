# supabase/functions — Edge Functions (Deno)

Tomme i Fase 0. Bygges der de hører hjemme i byggeplanen (spec §8):

- **`sync/`** — `sync_pull` / `sync_push` (WatermelonDB-protokoll). Fase 2.
- **`export-pdf/`** — serverside PDF med `pdf-lib`, reproduserbar, hash i bunntekst. Fase 5.
- **`export-xlsx/`** — flate rader med `SheetJS`. Fase 7.

`service_role`-nøkkel hører KUN hjemme her (CLAUDE.md regel #7), aldri i klienten.
