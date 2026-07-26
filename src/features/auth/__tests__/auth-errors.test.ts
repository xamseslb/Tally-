import { mapAuthError } from '../api/auth-errors';

describe('mapAuthError', () => {
  it('oversetter feil legitimasjon til norsk', () => {
    expect(mapAuthError('Invalid login credentials')).toContain('Feil e-post eller passord');
  });

  it('gjenkjenner nettverksfeil', () => {
    expect(mapAuthError('Network request failed')).toContain('nettforbindelse');
  });

  it('faller tilbake til en handlingsrettet melding', () => {
    expect(mapAuthError('helt ukjent feil')).toContain('Innlogging feilet');
  });

  it('sier aldri «Noe gikk galt»', () => {
    expect(mapAuthError('x')).not.toContain('Noe gikk galt');
  });
});
