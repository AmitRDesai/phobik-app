import { uuid } from '@/lib/crypto';
import { useLocalMutation } from '@/lib/powersync/useLocalMutation';
import { useUserId } from '@/lib/powersync/useUserId';
import { toCamel } from '@/lib/powersync/utils';
import { usePowerSync, useQuery } from '@powersync/react';
import { useCallback, useMemo } from 'react';

export function useTodaysChallenge() {
  const userId = useUserId();
  const today = new Date().toISOString().slice(0, 10);
  const { data, ...rest } = useQuery(
    'SELECT * FROM mystery_challenge WHERE user_id = ? AND date(completed_at) = ? ORDER BY completed_at DESC LIMIT 1',
    [userId ?? '', today],
  );
  return { data: data?.[0] ? toCamel(data[0]) : null, ...rest };
}

export function useRecordChallenge() {
  const powersync = usePowerSync();
  const userId = useUserId();

  const fn = useCallback(
    async (input: {
      challengeType: string;
      doseDopamine: number;
      doseOxytocin: number;
      doseSerotonin: number;
      doseEndorphins: number;
      durationSeconds: number;
    }) => {
      if (!userId) throw new Error('Not authenticated');

      const id = uuid();
      const now = new Date().toISOString();

      await powersync.execute(
        `INSERT INTO mystery_challenge (id, user_id, challenge_type, dose_dopamine, dose_oxytocin, dose_serotonin, dose_endorphins, duration_seconds, completed_at, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          userId,
          input.challengeType,
          input.doseDopamine,
          input.doseOxytocin,
          input.doseSerotonin,
          input.doseEndorphins,
          input.durationSeconds,
          now,
          now,
        ],
      );

      return { id };
    },
    [powersync, userId],
  );

  return useLocalMutation(fn);
}

export function useChallengeHistory() {
  const userId = useUserId();
  const { data, ...rest } = useQuery(
    'SELECT * FROM mystery_challenge WHERE user_id = ? ORDER BY completed_at DESC LIMIT 20',
    [userId ?? ''],
  );

  const transformed = useMemo(() => data?.map((r) => toCamel(r)), [data]);
  return { data: transformed, ...rest };
}
