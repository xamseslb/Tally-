import { createReportSchema, editReportSchema } from '../model/schemas';

describe('createReportSchema', () => {
  it('godtar et valgt prosjekt', () => {
    expect(createReportSchema.safeParse({ projectId: 'p1' }).success).toBe(true);
  });

  it('krever prosjekt', () => {
    expect(createReportSchema.safeParse({ projectId: '' }).success).toBe(false);
  });
});

describe('editReportSchema', () => {
  it('godtar tomme/valgfrie felt', () => {
    expect(editReportSchema.safeParse({}).success).toBe(true);
  });

  it('godtar utfylte felt', () => {
    const r = editReportSchema.safeParse({ workPerformed: 'Støp', delays: 'Regn', notes: 'ok' });
    expect(r.success).toBe(true);
  });
});
