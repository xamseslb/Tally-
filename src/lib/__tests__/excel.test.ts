import { buildXlsxBase64 } from '../excel';

describe('buildXlsxBase64', () => {
  it('bygger en ikke-tom .xlsx (base64) fra rader', () => {
    const b64 = buildXlsxBase64('Reports', [
      { Date: '2026-07-23', Project: 'Bygg A', Status: 'signed', Work: 'Forskaling' },
    ]);
    expect(typeof b64).toBe('string');
    expect(b64.length).toBeGreaterThan(100);
    // .xlsx (zip) starter med "PK" -> base64 begynner med "UEs"
    expect(b64.startsWith('UEs')).toBe(true);
  });
});
