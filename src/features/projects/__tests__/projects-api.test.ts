const mockOrder = jest.fn();
const mockRpc = jest.fn();

const chain = {
  select: () => chain,
  is: () => chain,
  order: (...args: unknown[]) => mockOrder(...args),
};

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: () => chain,
    rpc: (...args: unknown[]) => mockRpc(...args),
  },
}));

import { createProject, listProjects } from '../api/projects-api';

describe('projects-api', () => {
  beforeEach(() => {
    mockOrder.mockReset();
    mockRpc.mockReset();
  });

  it('listProjects parser rader', async () => {
    mockOrder.mockResolvedValue({
      data: [
        {
          id: 'p1',
          name: 'Bygg A',
          project_number: null,
          address: 'Oslo',
          client_name: null,
          status: 'active',
        },
      ],
      error: null,
    });
    const result = await listProjects();
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toHaveLength(1);
      expect(result.value[0]?.name).toBe('Bygg A');
    }
  });

  it('listProjects returnerer feil ved db-feil', async () => {
    mockOrder.mockResolvedValue({ data: null, error: { message: 'boom' } });
    expect((await listProjects()).ok).toBe(false);
  });

  it('createProject returnerer id ved suksess', async () => {
    mockRpc.mockResolvedValue({ data: 'proj-1', error: null });
    const result = await createProject({ name: 'Bygg A' });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toBe('proj-1');
  });
});
