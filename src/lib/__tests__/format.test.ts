import { formatReportDate } from '../format';

describe('formatReportDate', () => {
  it('formaterer ISO til DD.MM.YYYY', () => {
    expect(formatReportDate('2026-07-23')).toBe('23.07.2026');
  });

  it('returnerer input uendret ved uventet format', () => {
    expect(formatReportDate('rart')).toBe('rart');
  });
});
