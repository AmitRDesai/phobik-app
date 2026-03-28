import { orpc } from '@/lib/orpc';
import { useQuery } from '@tanstack/react-query';

export function useJournalStats() {
  return useQuery(orpc.journal.getStats.queryOptions());
}
