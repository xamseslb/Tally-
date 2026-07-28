import { z } from 'zod';

export const createReportSchema = z.object({
  projectId: z.string().min(1, 'Select a project'),
});
export type CreateReportInput = z.infer<typeof createReportSchema>;

export const editReportSchema = z.object({
  workPerformed: z.string().optional(),
  delays: z.string().optional(),
  hseNotes: z.string().optional(),
  qualityNotes: z.string().optional(),
  supervisorComment: z.string().optional(),
  notes: z.string().optional(),
});
export type EditReportInput = z.infer<typeof editReportSchema>;

export const REPORT_STATUSES = ['draft', 'submitted', 'signed', 'rejected'] as const;
export type ReportStatus = (typeof REPORT_STATUSES)[number];
