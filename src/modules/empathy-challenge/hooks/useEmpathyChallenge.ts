import { uuid } from '@/lib/crypto';
import { useLocalMutation } from '@/lib/powersync/useLocalMutation';
import { useUserId } from '@/lib/powersync/useUserId';
import { toCamel } from '@/lib/powersync/utils';
import { usePowerSync, useQuery } from '@powersync/react';
import { useCallback, useMemo } from 'react';

export function useActiveChallenge() {
  const userId = useUserId();

  const { data: challenges, ...challengeRest } = useQuery(
    "SELECT * FROM empathy_challenge WHERE user_id = ? AND status = 'active' LIMIT 1",
    [userId ?? ''],
  );

  const challengeId = (challenges?.[0]?.id as string) ?? '';

  const { data: days } = useQuery(
    'SELECT * FROM empathy_challenge_day WHERE challenge_id = ? ORDER BY day_number ASC',
    [challengeId],
  );

  const challenge = challenges?.[0];

  const data = useMemo(
    () =>
      challenge
        ? { ...toCamel(challenge), days: (days ?? []).map((d) => toCamel(d)) }
        : null,
    [challenge, days],
  );

  return { data, ...challengeRest };
}

export function useStartChallenge() {
  const powersync = usePowerSync();
  const userId = useUserId();

  const fn = useCallback(async () => {
    if (!userId) throw new Error('Not authenticated');

    await powersync.execute(
      "UPDATE empathy_challenge SET status = 'abandoned' WHERE user_id = ? AND status = 'active'",
      [userId],
    );

    const challengeId = uuid();
    const now = new Date().toISOString();

    await powersync.execute(
      `INSERT INTO empathy_challenge (id, user_id, status, started_at, created_at)
       VALUES (?, ?, 'active', ?, ?)`,
      [challengeId, userId, now, now],
    );

    for (let i = 0; i < 7; i++) {
      const dayId = uuid();
      const status = i === 0 ? 'unlocked' : 'locked';
      await powersync.execute(
        `INSERT INTO empathy_challenge_day (id, challenge_id, user_id, day_number, status, dose_oxytocin, dose_serotonin, created_at)
         VALUES (?, ?, ?, ?, ?, 0, 0, ?)`,
        [dayId, challengeId, userId, i + 1, status, now],
      );
    }

    return { id: challengeId };
  }, [powersync, userId]);

  return useLocalMutation(fn);
}

export function useStartDay() {
  const powersync = usePowerSync();

  const fn = useCallback(
    async (input: { dayId: string }) => {
      const now = new Date().toISOString();
      await powersync.execute(
        "UPDATE empathy_challenge_day SET status = 'in_progress', started_at = ? WHERE id = ?",
        [now, input.dayId],
      );
    },
    [powersync],
  );

  return useLocalMutation(fn);
}

export function useCompleteDay() {
  const powersync = usePowerSync();

  const fn = useCallback(
    async (input: { dayId: string; reflection: string }) => {
      const now = new Date().toISOString();

      const day = await powersync.getOptional<Record<string, unknown>>(
        'SELECT * FROM empathy_challenge_day WHERE id = ?',
        [input.dayId],
      );

      if (!day) throw new Error('Day not found');

      await powersync.execute(
        "UPDATE empathy_challenge_day SET status = 'completed', reflection = ?, dose_oxytocin = 10, dose_serotonin = 5, completed_at = ? WHERE id = ?",
        [input.reflection, now, input.dayId],
      );

      const dayNumber = day.day_number as number;
      const challengeId = day.challenge_id as string;

      if (dayNumber && dayNumber < 7) {
        await powersync.execute(
          "UPDATE empathy_challenge_day SET status = 'unlocked' WHERE challenge_id = ? AND day_number = ? AND status = 'locked'",
          [challengeId, dayNumber + 1],
        );
      }

      if (dayNumber === 7) {
        await powersync.execute(
          "UPDATE empathy_challenge SET status = 'completed', completed_at = ? WHERE id = ?",
          [now, challengeId],
        );
      }
    },
    [powersync],
  );

  return useLocalMutation(fn);
}
