import { z } from 'zod';

/** Skjemavalidering for innlogging/registrering. Feiltekster på norsk (spec §7). */
export const signInSchema = z.object({
  email: z.email('Skriv en gyldig e-postadresse'),
  password: z.string().min(1, 'Skriv inn passordet'),
});
export type SignInInput = z.infer<typeof signInSchema>;

export const signUpSchema = z.object({
  fullName: z.string().min(2, 'Skriv inn fullt navn'),
  email: z.email('Skriv en gyldig e-postadresse'),
  password: z.string().min(8, 'Passordet må ha minst 8 tegn'),
});
export type SignUpInput = z.infer<typeof signUpSchema>;

export const magicLinkSchema = z.object({
  email: z.email('Skriv en gyldig e-postadresse'),
});
export type MagicLinkInput = z.infer<typeof magicLinkSchema>;
