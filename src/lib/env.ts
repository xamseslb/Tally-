import { z } from 'zod';

/**
 * Miljøvariabler valideres med zod ved oppstart (spec §4 / CLAUDE.md).
 * Kun EXPO_PUBLIC_* er tilgjengelig i klienten — ingen hemmeligheter her.
 * Verdiene kan være tomme før Supabase/Sentry er koblet til; da er appen
 * i «ikke konfigurert»-modus, ikke krasj.
 */
const EnvSchema = z.object({
  supabaseUrl: z.string(),
  supabaseAnonKey: z.string(),
  sentryDsn: z.string(),
});

export type Env = z.infer<typeof EnvSchema>;

export const env: Env = EnvSchema.parse({
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
  sentryDsn: process.env.EXPO_PUBLIC_SENTRY_DSN ?? '',
});

export const isSupabaseConfigured = env.supabaseUrl.length > 0 && env.supabaseAnonKey.length > 0;

export const isSentryConfigured = env.sentryDsn.length > 0;
