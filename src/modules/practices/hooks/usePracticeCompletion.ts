import { uuid } from '@/lib/crypto';
import { db } from '@/lib/powersync/database';
import { useUserId } from '@/lib/powersync/useUserId';
import { DOSE_REWARDS, type PracticeType } from '@/constants/dose-rewards';
import { useMutation } from '@tanstack/react-query';

export function useRecordPracticeCompletion() {
  const userId = useUserId();

  return useMutation({
    mutationFn: async (input: {
      practiceType: PracticeType;
      durationSeconds: number;
    }) => {
      if (!userId) throw new Error('Not authenticated');

      const rewards = DOSE_REWARDS[input.practiceType];
      const id = uuid();
      const now = new Date().toISOString();

      await db
        .insertInto('practice_session')
        .values({
          id,
          user_id: userId,
          practice_type: input.practiceType,
          dose_dopamine: rewards.dopamine,
          dose_oxytocin: rewards.oxytocin,
          dose_serotonin: rewards.serotonin,
          dose_endorphins: rewards.endorphins,
          duration_seconds: input.durationSeconds,
          completed_at: now,
          created_at: now,
        })
        .execute();

      return { id };
    },
  });
}
