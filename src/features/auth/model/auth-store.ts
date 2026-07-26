import type { Session } from '@supabase/supabase-js';
import { create } from 'zustand';

import { logger } from '@/lib/logger';
import { supabase } from '@/lib/supabase';

export type AuthStatus = 'loading' | 'signedIn' | 'signedOut';

interface AuthState {
  status: AuthStatus;
  session: Session | null;
  /** Leser lagret sesjon og abonnerer på endringer. Returnerer avmeldingsfunksjon. */
  initialize: () => () => void;
  setSession: (session: Session | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  status: 'loading',
  session: null,

  setSession: (session) => set({ session, status: session ? 'signedIn' : 'signedOut' }),

  initialize: () => {
    // Sesjonen overlever offline i secure-store (spec §3 FR-1): en bruker uten
    // dekning skal ikke bli logget ut på plassen.
    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (error) logger.error('getSession feilet', { message: error.message });
        set({ session: data.session, status: data.session ? 'signedIn' : 'signedOut' });
      })
      .catch((e: unknown) => {
        logger.error('getSession kastet', { error: String(e) });
        set({ status: 'signedOut' });
      });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, status: session ? 'signedIn' : 'signedOut' });
    });
    return () => data.subscription.unsubscribe();
  },
}));
