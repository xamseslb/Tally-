import type { Session } from '@supabase/supabase-js';

import { useAuthStore } from '../model/auth-store';

// `mock`-prefiks kreves for at jest.mock-fabrikken får referere disse (hoisting).
const mockGetSession = jest.fn();
const mockOnAuthStateChange = jest.fn();

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: (...args: unknown[]) => mockGetSession(...args),
      onAuthStateChange: (...args: unknown[]) => mockOnAuthStateChange(...args),
    },
  },
}));

const fakeSession = { user: { id: 'user-1' } } as unknown as Session;
const flush = () => new Promise<void>((resolve) => setImmediate(() => resolve()));

describe('auth-store', () => {
  beforeEach(() => {
    mockGetSession.mockReset();
    mockOnAuthStateChange.mockReset();
    mockOnAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: jest.fn() } } });
    useAuthStore.setState({ status: 'loading', session: null });
  });

  it('setSession(null) gir signedOut', () => {
    useAuthStore.getState().setSession(null);
    expect(useAuthStore.getState().status).toBe('signedOut');
  });

  it('setSession(session) gir signedIn med bruker', () => {
    useAuthStore.getState().setSession(fakeSession);
    const state = useAuthStore.getState();
    expect(state.status).toBe('signedIn');
    expect(state.session?.user.id).toBe('user-1');
  });

  it('initialize leser lagret sesjon og setter signedIn', async () => {
    mockGetSession.mockResolvedValue({ data: { session: fakeSession }, error: null });
    const unsubscribe = useAuthStore.getState().initialize();
    await flush();
    expect(useAuthStore.getState().status).toBe('signedIn');
    unsubscribe();
  });

  it('initialize uten sesjon setter signedOut', async () => {
    mockGetSession.mockResolvedValue({ data: { session: null }, error: null });
    const unsubscribe = useAuthStore.getState().initialize();
    await flush();
    expect(useAuthStore.getState().status).toBe('signedOut');
    unsubscribe();
  });
});
