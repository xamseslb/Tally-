import { magicLinkSchema, signInSchema, signUpSchema } from '../model/schemas';

describe('auth-skjemaer', () => {
  it('godtar gyldig innlogging', () => {
    expect(signInSchema.safeParse({ email: 'ola@bygg.no', password: 'x' }).success).toBe(true);
  });

  it('avviser ugyldig e-post', () => {
    expect(signInSchema.safeParse({ email: 'ikke-epost', password: 'x' }).success).toBe(false);
  });

  it('krever minst 8 tegn i passord ved registrering', () => {
    const r = signUpSchema.safeParse({
      fullName: 'Ola Nordmann',
      email: 'ola@bygg.no',
      password: 'kort',
    });
    expect(r.success).toBe(false);
  });

  it('krever fullt navn ved registrering', () => {
    const r = signUpSchema.safeParse({
      fullName: 'O',
      email: 'ola@bygg.no',
      password: 'langnokkpassord',
    });
    expect(r.success).toBe(false);
  });

  it('magic link krever gyldig e-post', () => {
    expect(magicLinkSchema.safeParse({ email: '' }).success).toBe(false);
    expect(magicLinkSchema.safeParse({ email: 'ola@bygg.no' }).success).toBe(true);
  });
});
