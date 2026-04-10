import { db } from '@/lib/powersync/database';
import { useUserId } from '@/lib/powersync/useUserId';
import { orpc } from '@/lib/orpc';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCompleteOnboarding() {
  const userId = useUserId();
  const queryClient = useQueryClient();
  const queryKey = orpc.profile.getProfileStatus.key({ type: 'query' });

  return useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error('Not authenticated');

      const now = new Date().toISOString();

      await db
        .updateTable('user_profile')
        .set({ onboarding_completed_at: now, updated_at: now })
        .where('user_id', '=', userId)
        .execute();

      queryClient.setQueryData(
        queryKey,
        (prev: Record<string, unknown> | undefined) => ({
          ...prev,
          onboardingCompleted: true,
        }),
      );
    },
  });
}
