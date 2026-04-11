import { db } from '@/lib/powersync/database';
import { useUserId } from '@/lib/powersync/useUserId';
import { useMutation } from '@tanstack/react-query';

export function useCompleteOnboarding() {
  const userId = useUserId();

  return useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error('Not authenticated');

      const now = new Date().toISOString();

      await db
        .updateTable('user_profile')
        .set({ onboarding_completed_at: now, updated_at: now })
        .where('user_id', '=', userId)
        .execute();
    },
  });
}
