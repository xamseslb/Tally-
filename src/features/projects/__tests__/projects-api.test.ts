const mockOrder = jest.fn();
const mockMaybeSingle = jest.fn();
const mockUpdateEq = jest.fn();
const mockRpc = jest.fn();

const chain = {
  select: () => chain,
  is: () => chain,
  eq: () => chain,
  order: (...args: unknown[]) => mockOrder(...args),
  maybeSingle: (...args: unknown[]) => mockMaybeSingle(...args),
  update: () => ({ eq: (...args: unknown[]) => mockUpdateEq(...args) }),
};

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: () => chain,
    rpc: (...args: unknown[]) => mockRpc(...args),
  },
}));

import {
  createProject,
  getProject,
  listProjects,
  setProjectStatus,
  updateProject,
} from '../api/projects-api';

const row = {
  id: 'p1',
  name: 'Bygg A',
  project_number: null,
  address: 'Oslo',
  client_name: null,
  status: 'active',
};

describe('projects-api', () => {
  beforeEach(() => {
    mockOrder.mockReset();
    mockMaybeSingle.mockReset();
    mockUpdateEq.mockReset();
    mockRpc.mockReset();
    mockUpdateEq.mockResolvedValue({ error: null });
  });

  it('listProjects parser rader', async () => {
    mockOrder.mockResolvedValue({ data: [row], error: null });
    const result = await listProjects();
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value[0]?.name).toBe('Bygg A');
  });

  it('createProject returnerer id ved suksess', async () => {
    mockRpc.mockResolvedValue({ data: 'proj-1', error: null });
    const result = await createProject({ name: 'Bygg A' });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toBe('proj-1');
  });

  it('getProject parser ett prosjekt', async () => {
    mockMaybeSingle.mockResolvedValue({ data: row, error: null });
    const result = await getProject('p1');
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value?.status).toBe('active');
  });

  it('updateProject returnerer ok', async () => {
    expect((await updateProject('p1', { name: 'Bygg B' })).ok).toBe(true);
  });

  it('setProjectStatus (gjenåpne) returnerer ok', async () => {
    expect((await setProjectStatus('p1', 'active')).ok).toBe(true);
  });

  it('setProjectStatus propagerer feil', async () => {
    mockUpdateEq.mockResolvedValue({ error: { message: 'denied' } });
    expect((await setProjectStatus('p1', 'archived')).ok).toBe(false);
  });
});
