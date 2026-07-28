import { useCallback, useState } from 'react';

import { logger } from '@/lib/logger';

import { listMembers, type Member } from '../api/team-api';

export function useMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    const result = await listMembers();
    if (result.ok) setMembers(result.value);
    else logger.error('Henting av team feilet', { error: result.error });
    setLoading(false);
  }, []);

  return { members, loading, refetch };
}
