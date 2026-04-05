import { useUserId } from '@/lib/powersync/useUserId';
import { useQuery } from '@powersync/react';

export function useJournalStats() {
  const userId = useUserId();

  const { data: countData, isLoading: isCountLoading } = useQuery<{
    total: number;
  }>('SELECT COUNT(*) as total FROM journal_entry WHERE user_id = ?', [
    userId ?? '',
  ]);

  const { data: dateData, isLoading: isDatesLoading } = useQuery<{
    entry_date: string;
  }>(
    'SELECT DISTINCT entry_date FROM journal_entry WHERE user_id = ? ORDER BY entry_date DESC',
    [userId ?? ''],
  );

  const totalEntries = countData?.[0]?.total ?? 0;

  // Calculate streak: count consecutive days ending at today
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
