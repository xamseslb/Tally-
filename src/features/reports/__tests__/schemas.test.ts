import { createReportSchema } from '../model/schemas';

describe('createReportSchema', () => {
  it('godtar gyldig rapport', () => {
    const r = createReportSchema.safeParse({
      projectId: 'p1',
      workPerformed: 'Forskaling av vegg',
    });
    expect(r.success).toBe(true);
  });

  it('krever prosjekt', () => {
    expect(createReportSchema.safeParse({ projectId: '', workPerformed: 'noe' }).success).toBe(
      false,
    );
  });

  it('krever utført arbeid', () => {
    expect(createReportSchema.safeParse({ projectId: 'p1', workPerformed: '' }).success).toBe(
      false,
    );
  });
});
