import { uuid } from '@/lib/crypto';
import { db } from '@/lib/powersync/database';
import { useUserId } from '@/lib/powersync/useUserId';
import { toJSON } from '@/lib/powersync/utils';
import { orpc } from '@/lib/orpc';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useProfileStatus(enabled: boolean) {
  return useQuery({
    ...orpc.profile.getProfileStatus.queryOptions(),
    enabled,
    retry: 2,
    staleTime: Infinity,
  });
}

export function useSaveProfile() {
  const userId = useUserId();
  const queryClient = useQueryClient();

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

      queryClient.setQueryData(
        orpc.profile.getProfileStatus.key({ type: 'query' }),
        { hasProfile: true, onboardingCompleted: false },
      );
    },
  });
}
