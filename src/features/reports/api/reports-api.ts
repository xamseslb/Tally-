import { z } from 'zod';

import { err, ok, type Result } from '@/lib/result';
import { supabase } from '@/lib/supabase';

import type { CreateReportInput } from '../model/schemas';

const ReportSchema = z.object({
  id: z.string(),
  report_date: z.string(),
  status: z.string(),
  work_performed: z.string().nullable(),
  projects: z.object({ name: z.string() }).nullable(),
});
export type ReportRow = z.infer<typeof ReportSchema>;

export async function listReports(): Promise<Result<ReportRow[]>> {
  const { data, error } = await supabase
    .from('daily_reports')
    .select('id, report_date, status, work_performed, projects(name)')
    .is('deleted_at', null)
    .order('report_date', { ascending: false });

  if (error) return err('Kunne ikke hente rapporter. Prøv igjen når du har dekning.');
  const parsed = z.array(ReportSchema).safeParse(data ?? []);
  return parsed.success ? ok(parsed.data) : err('Uventet svar fra server.');
}

export async function createDraftReport(input: CreateReportInput): Promise<Result<string>> {
  const { data, error } = await supabase.rpc('create_draft_report', {
    p_project_id: input.projectId,
    p_report_date: null,
    p_work_performed: input.workPerformed,
  });

  if (error) return err(error.message || 'Kunne ikke opprette rapport. Prøv igjen.');
  const parsed = z.string().safeParse(data);
  return parsed.success ? ok(parsed.data) : err('Uventet svar fra server.');
}
