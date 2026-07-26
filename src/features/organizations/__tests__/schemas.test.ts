import { createOrgSchema } from '../model/schemas';

describe('createOrgSchema', () => {
  it('godtar et gyldig navn', () => {
    expect(createOrgSchema.safeParse({ name: 'Bygg AS' }).success).toBe(true);
  });

  it('avviser for kort navn', () => {
    expect(createOrgSchema.safeParse({ name: 'B' }).success).toBe(false);
  });
});
