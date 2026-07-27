import { useCallback, useState } from 'react';

import { logger } from '@/lib/logger';

import { listProjects, type Project } from '../api/projects-api';

/** Henter prosjekter. Kall refetch() ved fokus for å oppdatere etter endringer. */
export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    const result = await listProjects();
    if (result.ok) setProjects(result.value);
    else logger.error('Henting av prosjekter feilet', { error: result.error });
    setLoading(false);
  }, []);

  return { projects, loading, refetch };
}
