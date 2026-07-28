const mockOrder = jest.fn();
const mockRpc = jest.fn();

const chain = {
  select: () => chain,
  order: (...args: unknown[]) => mockOrder(...args),
};

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: () => chain,
    rpc: (...args: unknown[]) => mockRpc(...args),
  },
}));

import { createUser, listMembers } from '../api/team-api';

describe('team-api', () => {
  beforeEach(() => {
    mockOrder.mockReset();
    mockRpc.mockReset();
  });

  it('listMembers parses members with profile', async () => {
    mockOrder.mockResolvedValue({
      data: [
        {
          user_id: 'u1',
          role: 'worker',
          is_active: true,
          profiles: { full_name: 'Ahmed', username: 'ahmed' },
        },
      ],
      error: null,
    });
    const result = await listMembers();
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value[0]?.profiles?.username).toBe('ahmed');
  });

  it('createUser returns the new id', async () => {
    mockRpc.mockResolvedValue({ data: 'user-1', error: null });
    const result = await createUser({
      fullName: 'Ahmed Ali',
      username: 'ahmed',
      password: 'pass123',
      role: 'worker',
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toBe('user-1');
  });

  it('createUser surfaces a taken username', async () => {
    mockRpc.mockResolvedValue({ data: null, error: { message: 'Username already taken' } });
    const result = await createUser({
      fullName: 'A B',
      username: 'ahmed',
      password: 'pass123',
      role: 'worker',
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain('taken');
  });
});
