const mockRemove = jest.fn();
const mockCreateSignedUrl = jest.fn();
const mockDeleteEq = jest.fn();

jest.mock('@/lib/supabase', () => ({
  supabase: {
    storage: {
      from: () => ({
        remove: (...args: unknown[]) => mockRemove(...args),
        createSignedUrl: (...args: unknown[]) => mockCreateSignedUrl(...args),
      }),
    },
    from: () => ({ delete: () => ({ eq: (...args: unknown[]) => mockDeleteEq(...args) }) }),
  },
}));

import { getSignedUrl, removeAttachment } from '../api/attachments-api';

describe('attachments-api', () => {
  beforeEach(() => {
    mockRemove.mockReset();
    mockCreateSignedUrl.mockReset();
    mockDeleteEq.mockReset();
  });

  it('getSignedUrl returnerer signert URL', async () => {
    mockCreateSignedUrl.mockResolvedValue({ data: { signedUrl: 'https://x/y.jpg' }, error: null });
    expect(await getSignedUrl('r1/f.jpg')).toBe('https://x/y.jpg');
  });

  it('getSignedUrl returnerer null uten data', async () => {
    mockCreateSignedUrl.mockResolvedValue({ data: null, error: { message: 'no' } });
    expect(await getSignedUrl('r1/f.jpg')).toBeNull();
  });

  it('removeAttachment fjerner fil + rad', async () => {
    mockRemove.mockResolvedValue({ error: null });
    mockDeleteEq.mockResolvedValue({ error: null });
    const result = await removeAttachment('a1', 'r1/f.jpg');
    expect(result.ok).toBe(true);
    expect(mockRemove).toHaveBeenCalledWith(['r1/f.jpg']);
  });
});
