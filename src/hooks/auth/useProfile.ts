import { uuid } from '@/lib/crypto';
import { db } from '@/lib/powersync/database';
import { useUserId } from '@/lib/powersync/useUserId';
import { toJSON } from '@/lib/powersync/utils';
import { useQuery } from '@powersync/tanstack-react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

const PROFILE_STATUS_KEY = 'profile-status';

/**
 * Profile status for the navigation guard.
 * Reads from PowerSync local SQLite — instant for returning users (no network call).
 * Reactive: auto-updates when user_profile table changes (e.g., after save or sync).
 */
export function useProfileStatus(enabled: boolean) {
  const userId = useUserId();

  const { data, isLoading, error } = useQuery({
    queryKey: [PROFILE_STATUS_KEY, userId],
    query: db
      .selectFrom('user_profile')
      .select(['onboarding_completed_at'])
      .where('user_id', '=', userId ?? '')
      .limit(1),
    enabled: enabled && !!userId,
  });

  const profileStatus = useMemo(() => {
    const row = data?.[0];
    return {
      hasProfile: !!row,
      onboardingCompleted: !!row?.onboarding_completed_at,
    };
  }, [data]);

  return {
    data: profileStatus,
    isPending: isLoading,
    error,
  };
}

export function useSaveProfile() {
  const userId = useUserId();

  return useMutation({
    mutationFn: async (input: {
      ageRange: string | null;
      genderIdentity: string | null;
      goals: string[];
      termsAcceptedAt: string | null;
      privacyAcceptedAt: string | null;
    }) => {
      if (!userId) throw new Error('Not authenticated');

      const id = uuid();
      const now = new Date().toISOString();

      await db
        .insertInto('user_profile')
        .values({
          id,
          user_id: userId,
          age_range: input.ageRange,
          gender_identity: input.genderIdentity,
          goals: toJSON(input.goals),
          terms_accepted_at: input.termsAcceptedAt,
          privacy_accepted_at: input.privacyAcceptedAt,
          created_at: now,
          updated_at: now,
        })
        .execute();
    },
  });
}
