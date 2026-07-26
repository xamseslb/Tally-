import { create } from 'zustand';

import { logger } from '@/lib/logger';

import { fetchActiveMembership, type Membership } from '../api/onboarding-api';

export type MembershipStatus = 'loading' | 'none' | 'member';

interface MembershipState {
  status: MembershipStatus;
  membership: Membership | null;
  /** Henter medlemskap for innlogget bruker og oppdaterer status. */
  refresh: (userId: string) => Promise<void>;
  reset: () => void;
}

export const useMembershipStore = create<MembershipState>((set) => ({
  status: 'loading',
  membership: null,

  refresh: async (userId) => {
    const result = await fetchActiveMembership(userId);
    if (!result.ok) {
      logger.error('Henting av medlemskap feilet', { error: result.error });
      set({ status: 'none', membership: null });
      return;
    }
    set({ membership: result.value, status: result.value ? 'member' : 'none' });
  },

  reset: () => set({ status: 'loading', membership: null }),
}));
