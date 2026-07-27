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

import { createDraftReport, listReports } from '../api/reports-api';

describe('reports-api', () => {
  beforeEach(() => {
    mockOrder.mockReset();
    mockRpc.mockReset();
  });

  it('listReports parser rader med prosjektnavn', async () => {
    mockOrder.mockResolvedValue({
      data: [
        {
          id: 'r1',
          report_date: '2026-07-23',
          status: 'draft',
          work_performed: 'Forskaling',
          projects: { name: 'Bygg A' },
        },
      ],
      error: null,
    });
    const result = await listReports();
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value[0]?.projects?.name).toBe('Bygg A');
  });

  it('createDraftReport returnerer id', async () => {
    mockRpc.mockResolvedValue({ data: 'rep-1', error: null });
    const result = await createDraftReport({ projectId: 'p1', workPerformed: 'noe' });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toBe('rep-1');
  });

  it('createDraftReport gir feilmelding fra serveren (f.eks. duplikat)', async () => {
    mockRpc.mockResolvedValue({
      data: null,
      error: { message: 'Du har allerede en rapport for denne datoen på dette prosjektet' },
    });
    const result = await createDraftReport({ projectId: 'p1', workPerformed: 'noe' });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain('allerede en rapport');
  });
});
