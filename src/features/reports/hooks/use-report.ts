import { useCallback, useState } from 'react';

import { logger } from '@/lib/logger';

import { getReport, type ReportDetail } from '../api/reports-api';

/** Henter én rapport med signaturer. refetch() ved endring/fokus. */
export function useReport(id: string) {
  const [report, setReport] = useState<ReportDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    const result = await getReport(id);
    if (result.ok) setReport(result.value);
    else logger.error('Henting av rapport feilet', { error: result.error });
    setLoading(false);
  }, [id]);

  return { report, loading, refetch };
}
