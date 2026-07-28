import { useCallback, useState } from 'react';

import { logger } from '@/lib/logger';

import { getProject, type Project } from '../api/projects-api';

export function useProject(id: string) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    const result = await getProject(id);
    if (result.ok) setProject(result.value);
    else logger.error('Henting av prosjekt feilet', { error: result.error });
    setLoading(false);
  }, [id]);

  return { project, loading, refetch };
}
