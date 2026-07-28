import * as XLSX from 'xlsx';

/** Bygger en enkel .xlsx (base64) fra flate rader. Ett ark. */
export function buildXlsxBase64(
  sheetName: string,
  rows: Record<string, string | number>[],
): string {
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  return XLSX.write(wb, { type: 'base64', bookType: 'xlsx' }) as string;
}
