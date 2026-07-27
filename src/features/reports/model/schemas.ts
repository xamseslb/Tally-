import { z } from 'zod';

export const createReportSchema = z.object({
  projectId: z.string().min(1, 'Velg et prosjekt'),
  workPerformed: z.string().min(1, 'Skriv hva som ble utført'),
});
export type CreateReportInput = z.infer<typeof createReportSchema>;

export const REPORT_STATUSES = ['draft', 'submitted', 'signed', 'rejected'] as const;
export type ReportStatus = (typeof REPORT_STATUSES)[number];
