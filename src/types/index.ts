/**
 * Delte domenetyper. Genererte Supabase-typer (`supabase gen types`) legges
 * i `database.ts` når backend er koblet til. Enums holdes i synk med
 * migrasjonen i supabase/migrations/0001_init.sql.
 */

export type AppRole = 'admin' | 'manager' | 'engineer' | 'supervisor' | 'worker' | 'client';

export type ReportStatus = 'draft' | 'submitted' | 'signed' | 'rejected';

export type ProjectStatus = 'active' | 'paused' | 'completed' | 'archived';
