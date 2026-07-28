const mockOrder = jest.fn();
const mockMaybeSingle = jest.fn();
const mockUpdateEq = jest.fn();
const mockInsert = jest.fn();
const mockDeleteEq = jest.fn();
const mockRpc = jest.fn();

const chain = {
  select: () => chain,
  is: () => chain,
  eq: () => chain,
  order: (...args: unknown[]) => mockOrder(...args),
  maybeSingle: (...args: unknown[]) => mockMaybeSingle(...args),
  update: () => ({ eq: (...args: unknown[]) => mockUpdateEq(...args) }),
  insert: (...args: unknown[]) => mockInsert(...args),
  delete: () => ({ eq: (...args: unknown[]) => mockDeleteEq(...args) }),
};

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: () => chain,
    rpc: (...args: unknown[]) => mockRpc(...args),
  },
}));

import {
  addManpower,
  createDraftReport,
  getReport,
  listProjectReports,
  listReports,
  rejectReport,
  removeLineItem,
  signReport,
  submitReport,
  updateReport,
} from '../api/reports-api';

describe('reports-api', () => {
  beforeEach(() => {
    mockOrder.mockReset();
    mockMaybeSingle.mockReset();
    mockUpdateEq.mockReset();
    mockInsert.mockReset();
    mockDeleteEq.mockReset();
    mockRpc.mockReset();
    mockRpc.mockResolvedValue({ data: null, error: null });
    mockUpdateEq.mockResolvedValue({ error: null });
    mockInsert.mockResolvedValue({ error: null });
    mockDeleteEq.mockResolvedValue({ error: null });
  });

  it('updateReport lagrer feltene', async () => {
    expect((await updateReport('r1', { workPerformed: 'Støp', delays: 'Regn' })).ok).toBe(true);
  });

  it('listProjectReports henter prosjektets rapporter', async () => {
    mockOrder.mockResolvedValue({
      data: [
        {
          id: 'r1',
          report_date: '2026-07-23',
          status: 'draft',
          work_performed: 'x',
          projects: { name: 'Bygg A' },
        },
      ],
      error: null,
    });
    const result = await listProjectReports('p1');
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toHaveLength(1);
  });

  it('addManpower legger til en bemanningslinje', async () => {
    expect((await addManpower('r1', { trade: 'Betong', headcount: 3, hours: 8 })).ok).toBe(true);
  });

  it('removeLineItem fjerner en linje', async () => {
    expect((await removeLineItem('equipment', 'e1')).ok).toBe(true);
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
    const result = await createDraftReport({ projectId: 'p1' });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toBe('rep-1');
  });

  it('createDraftReport gir feilmelding fra serveren (f.eks. duplikat)', async () => {
    mockRpc.mockResolvedValue({
      data: null,
      error: { message: 'Du har allerede en rapport for denne datoen på dette prosjektet' },
    });
    const result = await createDraftReport({ projectId: 'p1' });
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
        delays: null,
        hse_notes: null,
        quality_notes: null,
        supervisor_comment: null,
        notes: null,
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
        manpower: [{ id: 'm1', trade: 'Betong', headcount: 3, hours: 8 }],
        equipment: [],
        materials: [],
        attachments: [],
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
