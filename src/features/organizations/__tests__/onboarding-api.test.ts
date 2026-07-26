const mockMaybeSingle = jest.fn();
const mockRpc = jest.fn();

const chain = {
  select: () => chain,
  eq: () => chain,
  limit: () => chain,
  maybeSingle: (...args: unknown[]) => mockMaybeSingle(...args),
};

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: () => chain,
    rpc: (...args: unknown[]) => mockRpc(...args),
  },
}));

import { createOrganization, fetchActiveMembership } from '../api/onboarding-api';

describe('onboarding-api', () => {
  beforeEach(() => {
    mockMaybeSingle.mockReset();
    mockRpc.mockReset();
  });

  it('fetchActiveMembership returnerer null når ingen rad', async () => {
    mockMaybeSingle.mockResolvedValue({ data: null, error: null });
    const result = await fetchActiveMembership('user-1');
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toBeNull();
  });

  it('fetchActiveMembership parser gyldig medlemskap', async () => {
    mockMaybeSingle.mockResolvedValue({
      data: { id: 'm1', organization_id: 'org-1', role: 'worker' },
      error: null,
    });
    const result = await fetchActiveMembership('user-1');
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value?.organization_id).toBe('org-1');
  });

  it('createOrganization returnerer org-id ved suksess', async () => {
    mockRpc.mockResolvedValue({ data: 'org-123', error: null });
    const result = await createOrganization('Bygg AS');
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toBe('org-123');
  });

  it('createOrganization returnerer feil ved RPC-feil', async () => {
    mockRpc.mockResolvedValue({ data: null, error: { message: 'nope' } });
    expect((await createOrganization('Bygg AS')).ok).toBe(false);
  });
});
