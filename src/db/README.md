# src/db — Lokal database (WatermelonDB)

Tom i Fase 0. Bygges i **Fase 2 (Prosjekter + lokal database)**:

- WatermelonDB-schema som speiler Supabase-tabellene som synkes.
- Migrasjoner for det lokale skjemaet.
- `sync_pull` / `sync_push`-adaptere mot Edge Functions (spec §5).

All skriving går til lokal SQLite **før** UI bekrefter noe (CLAUDE.md regel #6).
