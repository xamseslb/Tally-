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

const SignatureSchema = z.object({
  signer_role: z.string(),
  signed_at: z.string(),
  signed_content_hash: z.string(),
});

const ReportDetailSchema = z.object({
  id: z.string(),
  report_date: z.string(),
  status: z.string(),
  work_performed: z.string().nullable(),
  delays: z.string().nullable(),
  hse_notes: z.string().nullable(),
  quality_notes: z.string().nullable(),
  supervisor_comment: z.string().nullable(),
  notes: z.string().nullable(),
  content_hash: z.string().nullable(),
  review_note: z.string().nullable(),
  author_id: z.string(),
  projects: z.object({ name: z.string() }).nullable(),
  signatures: z.array(SignatureSchema),
});
export type ReportDetail = z.infer<typeof ReportDetailSchema>;

const REPORT_DETAIL_COLUMNS =
  'id, report_date, status, work_performed, delays, hse_notes, quality_notes, supervisor_comment, notes, content_hash, review_note, author_id, projects(name), signatures(signer_role, signed_at, signed_content_hash)';

export async function getReport(id: string): Promise<Result<ReportDetail | null>> {
  const { data, error } = await supabase
    .from('daily_reports')
    .select(REPORT_DETAIL_COLUMNS)
    .eq('id', id)
    .is('deleted_at', null)
    .maybeSingle();

  if (error) return err('Could not load the report.');
  if (!data) return ok(null);
  const parsed = ReportDetailSchema.safeParse(data);
  return parsed.success ? ok(parsed.data) : err('Unexpected response from server.');
}

export interface ReportFields {
  workPerformed?: string;
  delays?: string;
  hseNotes?: string;
  qualityNotes?: string;
  supervisorComment?: string;
  notes?: string;
}

export async function updateReport(id: string, input: ReportFields): Promise<Result<void>> {
  const { error } = await supabase
    .from('daily_reports')
    .update({
      work_performed: input.workPerformed || null,
      delays: input.delays || null,
      hse_notes: input.hseNotes || null,
      quality_notes: input.qualityNotes || null,
      supervisor_comment: input.supervisorComment || null,
      notes: input.notes || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);
  return error ? err('Could not save the report. Try again.') : ok(undefined);
}

async function callRpc(fn: string, args: Record<string, unknown>): Promise<Result<void>> {
  const { error } = await supabase.rpc(fn, args);
  return error ? err(error.message || 'Something failed. Try again.') : ok(undefined);
}

export const submitReport = (id: string) => callRpc('submit_report', { p_report_id: id });

export const signReport = (id: string, role: 'performer' | 'approver', signature: string) =>
  callRpc('sign_report', { p_report_id: id, p_signer_role: role, p_signature: signature });

export const rejectReport = (id: string, note: string) =>
  callRpc('reject_report', { p_report_id: id, p_note: note });
