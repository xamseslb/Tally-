import { isSentryConfigured, isSupabaseConfigured } from '../env';

describe('env', () => {
  it('rapporterer Supabase som ikke konfigurert når nøkler mangler', () => {
    // I testmiljø er EXPO_PUBLIC_*-variablene tomme.
    expect(isSupabaseConfigured).toBe(false);
  });

  it('rapporterer Sentry som ikke konfigurert når DSN mangler', () => {
    expect(isSentryConfigured).toBe(false);
  });
});
