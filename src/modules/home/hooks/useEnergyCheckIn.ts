import { uuid } from '@/lib/crypto';
import { db } from '@/lib/powersync/database';
import { useUserId } from '@/lib/powersync/useUserId';
import { toCamel } from '@/lib/powersync/utils';
import { useQuery } from '@powersync/tanstack-react-query';
import { useMutation } from '@tanstack/react-query';
import { useMemo } from 'react';

/** Returns YYYY-MM-DD in local time (not UTC) */
function todayLocal(): string {
  return new Date().toLocaleDateString('en-CA');
}

/** Today's most recent energy check-in (null if none set today) */
export function useTodayEnergyCheckIn() {
  const userId = useUserId();
  const today = todayLocal();

  const { data, isLoading, error } = useQuery({
    queryKey: ['energy-check-in-today', userId, today],
    query: db
      .selectFrom('energy_check_in')
      .selectAll()
      .where('user_id', '=', userId ?? '')
      .where('selected_date', '=', today)
      .orderBy('created_at', 'desc')
      .limit(1),
    enabled: !!userId,
  });

  const energyCheckIn = useMemo(
    () => (data?.[0] ? toCamel(data[0]) : null),
    [data],
  );

  return { data: energyCheckIn, isLoading, error };
}

/** Save a new energy check-in for today */
export function useSaveEnergyCheckIn() {
  const userId = useUserId();

  return useMutation({
    mutationFn: async (input: {
      purpose: number;
      mental: number;
      physical: number;
      relationship: number;
    }) => {
      if (!userId) throw new Error('Not authenticated');

      const id = uuid();
      const now = new Date().toISOString();
      const today = todayLocal();
      const energyIndex =
        input.purpose + input.mental + input.physical + input.relationship;

      await db
        .insertInto('energy_check_in')
        .values({
          id,
          user_id: userId,
          purpose: input.purpose,
          mental: input.mental,
          physical: input.physical,
          relationship: input.relationship,
          energy_index: energyIndex,
          selected_date: today,
          created_at: now,
        })
        .execute();

      return { id };
    },
  });
}
