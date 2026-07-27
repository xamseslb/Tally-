import { createProjectSchema } from '../model/schemas';

describe('createProjectSchema', () => {
  it('godtar et gyldig prosjektnavn', () => {
    expect(createProjectSchema.safeParse({ name: 'Bygg A – Sørfley' }).success).toBe(true);
  });

  it('avviser for kort navn', () => {
    expect(createProjectSchema.safeParse({ name: 'B' }).success).toBe(false);
  });

  it('godtar valgfrie felt', () => {
    const r = createProjectSchema.safeParse({
      name: 'Bygg A',
      projectNumber: '2026-01',
      address: 'Oslo',
      clientName: 'Byggherre AS',
    });
    expect(r.success).toBe(true);
  });
});
