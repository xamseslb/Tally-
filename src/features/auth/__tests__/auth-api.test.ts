import { deleteAccount, signInWithPassword, toLoginEmail } from '../api/auth-api';

describe('toLoginEmail', () => {
  it('mapper brukernavn til syntetisk e-post', () => {
    expect(toLoginEmail('Ahmed')).toBe('ahmed@users.tally.local');
  });
  it('lar en ekte e-post være uendret', () => {
    expect(toLoginEmail('boss@firma.no')).toBe('boss@firma.no');
  });
});

const mockSignInWithPassword = jest.fn();
const mockInvoke = jest.fn();

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: (...args: unknown[]) => mockSignInWithPassword(...args),
    },
    functions: {
      invoke: (...args: unknown[]) => mockInvoke(...args),
    },
  },
}));

describe('auth-api', () => {
  beforeEach(() => {
    mockSignInWithPassword.mockReset();
    mockInvoke.mockReset();
  });

  it('signInWithPassword returnerer ok ved suksess', async () => {
    mockSignInWithPassword.mockResolvedValue({ error: null });
    const result = await signInWithPassword({ email: 'ola@bygg.no', password: 'x' });
    expect(result.ok).toBe(true);
  });

  it('signInWithPassword mapper feil til norsk melding', async () => {
    mockSignInWithPassword.mockResolvedValue({ error: { message: 'Invalid login credentials' } });
    const result = await signInWithPassword({ email: 'ola@bygg.no', password: 'feil' });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain('Feil e-post eller passord');
  });

  it('deleteAccount returnerer ok når funksjonen svarer uten feil', async () => {
    mockInvoke.mockResolvedValue({ error: null });
    expect((await deleteAccount()).ok).toBe(true);
  });

  it('deleteAccount returnerer feil ved funksjonsfeil', async () => {
    mockInvoke.mockResolvedValue({ error: { message: 'boom' } });
    const result = await deleteAccount();
    expect(result.ok).toBe(false);
  });
});
