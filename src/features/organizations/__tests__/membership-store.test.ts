const mockFetch = jest.fn();

jest.mock('../api/onboarding-api', () => ({
  fetchActiveMembership: (...args: unknown[]) => mockFetch(...args),
}));

import { useMembershipStore } from '../model/membership-store';

describe('membership-store', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    useMembershipStore.getState().reset();
  });

  it('status «none» når brukeren ikke har medlemskap', async () => {
    mockFetch.mockResolvedValue({ ok: true, value: null });
    await useMembershipStore.getState().refresh('user-1');
    expect(useMembershipStore.getState().status).toBe('none');
  });

  it('status «member» når medlemskap finnes', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      value: { id: 'm1', organization_id: 'org-1', role: 'admin' },
    });
    await useMembershipStore.getState().refresh('user-1');
    const state = useMembershipStore.getState();
    expect(state.status).toBe('member');
    expect(state.membership?.role).toBe('admin');
  });

  it('faller til «none» ved feil (fail-safe: ingen tilgang)', async () => {
    mockFetch.mockResolvedValue({ ok: false, error: 'boom' });
    await useMembershipStore.getState().refresh('user-1');
    expect(useMembershipStore.getState().status).toBe('none');
  });
});
