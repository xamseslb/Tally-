import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

import { env } from './env';

/**
 * Supabase-klient. Sesjonen lagres i Keychain/Keystore via expo-secure-store,
 * aldri i AsyncStorage (CLAUDE.md regel #7). service_role-nøkkel finnes ALDRI
 * her — kun i Edge Functions.
 *
 * NB: SecureStore har en størrelsesgrense per nøkkel. Chunking av store
 * sesjoner håndteres når auth bygges (Fase 1).
 */
const secureStoreAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

export const supabase = createClient(
  env.supabaseUrl || 'http://localhost:54321',
  env.supabaseAnonKey || 'public-anon-key-placeholder',
  {
    auth: {
      storage: secureStoreAdapter,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  },
);
