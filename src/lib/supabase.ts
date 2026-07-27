import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import { env } from './env';

/**
 * Supabase-klient. På enhet lagres sesjonen i Keychain/Keystore via
 * expo-secure-store, aldri i AsyncStorage (CLAUDE.md regel #7). service_role-
 * nøkkel finnes ALDRI her — kun i Edge Functions.
 *
 * NB: SecureStore har en størrelsesgrense per nøkkel. Chunking av store
 * sesjoner håndteres når auth bygges (Fase 1).
 */
const secureStoreAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

/**
 * Web brukes kun til utvikling/forhåndsvisning (v1 har ingen web-portal, spec §1).
 * Der finnes ikke SecureStore, så vi faller tilbake til localStorage.
 */
const webStorageAdapter = {
  getItem: (key: string) =>
    typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null,
  setItem: (key: string, value: string) => {
    if (typeof localStorage !== 'undefined') localStorage.setItem(key, value);
  },
  removeItem: (key: string) => {
    if (typeof localStorage !== 'undefined') localStorage.removeItem(key);
  },
};

const storage = Platform.OS === 'web' ? webStorageAdapter : secureStoreAdapter;

export const supabase = createClient(
  env.supabaseUrl || 'http://localhost:54321',
  env.supabaseAnonKey || 'public-anon-key-placeholder',
  {
    auth: {
      storage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  },
);
