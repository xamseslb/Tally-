import { useCallback, useState } from 'react';

import { logger } from '@/lib/logger';

import { listReports, type ReportRow } from '../api/reports-api';

/** Henter rapporter. Kall refetch() ved fokus for å oppdatere etter endringer. */
export function useReports() {
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    const result = await listReports();
    if (result.ok) setReports(result.value);
    else logger.error('Henting av rapporter feilet', { error: result.error });
    setLoading(false);
  }, []);

  return { reports, loading, refetch };
}
