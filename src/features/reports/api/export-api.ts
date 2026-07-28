import { saveBase64File } from '@/lib/download';
import { buildXlsxBase64 } from '@/lib/excel';
import { err, ok, type Result } from '@/lib/result';

import { listReports } from './reports-api';

const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

/** Eksporterer rapportene brukeren ser til en flat Excel-fil (spec §3 FR-7). */
export async function exportReportsToExcel(): Promise<Result<void>> {
  const res = await listReports();
  if (!res.ok) return err(res.error);

  const rows = res.value.map((r) => ({
    Date: r.report_date,
    Project: r.projects?.name ?? '',
    Status: r.status,
    'Work performed': r.work_performed ?? '',
  }));

  try {
    const base64 = buildXlsxBase64('Reports', rows);
    await saveBase64File(base64, `reports-${Date.now()}.xlsx`, XLSX_MIME);
    return ok(undefined);
  } catch {
    return err('Could not create the Excel file.');
  }
}
