import { useUserId } from '@/lib/powersync/useUserId';
import { db } from '@/lib/powersync/database';
import { useQuery } from '@powersync/tanstack-react-query';
import { sql } from 'kysely';

export function useJournalStats() {
  const userId = useUserId();

  const { data: countData, isLoading: isCountLoading } = useQuery({
    queryKey: ['journal-stats-count', userId],
    query: db
      .selectFrom('journal_entry')
      .select(sql<number>`count(*)`.as('total'))
      .where('user_id', '=', userId ?? ''),
    enabled: !!userId,
  });

  const { data: dateData, isLoading: isDatesLoading } = useQuery({
    queryKey: ['journal-stats-dates', userId],
    query: db
      .selectFrom('journal_entry')
      .select('entry_date')
      .distinct()
      .where('user_id', '=', userId ?? '')
      .orderBy('entry_date', 'desc'),
    enabled: !!userId,
  });

  const totalEntries = countData?.[0]?.total ?? 0;

  let streak = 0;
  if (dateData) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const row of dateData) {
      const expected = new Date(today);
      expected.setDate(expected.getDate() - streak);
      const expectedStr = expected.toISOString().slice(0, 10);

      if (row.entry_date === expectedStr) {
        streak++;
      } else {
        break;
      }
    }
  }

  return {
    data: { totalEntries, streak },
    isLoading: isCountLoading || isDatesLoading,
  };
}
