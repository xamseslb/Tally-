/** Formaterer ISO-dato (YYYY-MM-DD) til norsk DD.MM.YYYY. */
export function formatReportDate(iso: string): string {
  const parts = iso.split('-');
  const [y, m, d] = parts;
  return y && m && d ? `${d}.${m}.${y}` : iso;
}
