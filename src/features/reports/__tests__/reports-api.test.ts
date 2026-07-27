const mockOrder = jest.fn();
const mockMaybeSingle = jest.fn();
const mockRpc = jest.fn();

const chain = {
  select: () => chain,
  is: () => chain,
  eq: () => chain,
  order: (...args: unknown[]) => mockOrder(...args),
  maybeSingle: (...args: unknown[]) => mockMaybeSingle(...args),
};

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: () => chain,
    rpc: (...args: unknown[]) => mockRpc(...args),
  },
}));

import {
  createDraftReport,
  getReport,
  listReports,
  rejectReport,
  signReport,
  submitReport,
} from '../api/reports-api';

describe('reports-api', () => {
  beforeEach(() => {
    mockOrder.mockReset();
    mockMaybeSingle.mockReset();
    mockRpc.mockReset();
    mockRpc.mockResolvedValue({ data: null, error: null });
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

  it('getReport parser detalj med signaturer', async () => {
    mockMaybeSingle.mockResolvedValue({
      data: {
        id: 'r1',
        report_date: '2026-07-23',
        status: 'signed',
        work_performed: 'Forskaling',
        content_hash: 'abc123',
        review_note: null,
        author_id: 'u1',
        projects: { name: 'Bygg A' },
        signatures: [
          {
            signer_role: 'performer',
            signed_at: '2026-07-23T14:32:00Z',
            signed_content_hash: 'abc123',
          },
        ],
      },
      error: null,
    });
    const result = await getReport('r1');
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value?.signatures[0]?.signer_role).toBe('performer');
  });

  it('submitReport kaller RPC og returnerer ok', async () => {
    expect((await submitReport('r1')).ok).toBe(true);
  });

  it('signReport propagerer serverfeil', async () => {
    mockRpc.mockResolvedValue({
      data: null,
      error: { message: 'Report must be submitted before signing' },
    });
    const result = await signReport('r1', 'performer', 'ola@bygg.no');
    expect(result.ok).toBe(false);
  });

  it('rejectReport kaller RPC', async () => {
    expect((await rejectReport('r1', 'mangler bilder')).ok).toBe(true);
  });
});
