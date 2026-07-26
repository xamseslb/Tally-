/**
 * Enkel Result-type for eksplisitt feilhåndtering (CLAUDE.md: ingen naken await).
 * Async-grenser returnerer Result i stedet for å kaste, slik at UI kan vise en
 * feilmelding som sier hva som skjedde og hva brukeren kan gjøre.
 */
export type Result<T> = { ok: true; value: T } | { ok: false; error: string };

export const ok = <T>(value: T): Result<T> => ({ ok: true, value });

export const err = <T = never>(error: string): Result<T> => ({ ok: false, error });
