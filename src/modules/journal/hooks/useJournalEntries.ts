import { orpc } from '@/lib/orpc';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useJournalEntriesForDate(date: string) {
  return useQuery({
    ...orpc.journal.listEntries.queryOptions({ input: { date } }),
    enabled: !!date,
  });
}

export function useEntryDatesForMonth(month: number, year: number) {
  return useQuery(
    orpc.journal.getEntryDatesForMonth.queryOptions({
      input: { month, year },
    }),
  );
}

export function useJournalEntry(id: string | undefined) {
  return useQuery({
    ...orpc.journal.getEntry.queryOptions({ input: { id: id! } }),
    enabled: !!id,
  });
}

export function useCreateEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    ...orpc.journal.createEntry.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: orpc.journal.listEntries.key({ type: 'query' }),
      });
      queryClient.invalidateQueries({
        queryKey: orpc.journal.getEntryDatesForMonth.key({ type: 'query' }),
      });
      queryClient.invalidateQueries({
        queryKey: orpc.journal.getStats.key({ type: 'query' }),
      });
    },
  });
}

export function useUpdateEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    ...orpc.journal.updateEntry.mutationOptions(),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: orpc.journal.listEntries.key({ type: 'query' }),
        }),
        queryClient.invalidateQueries({
          queryKey: orpc.journal.getEntry.key({ type: 'query' }),
        }),
        queryClient.invalidateQueries({
          queryKey: orpc.journal.getStats.key({ type: 'query' }),
        }),
      ]);
    },
  });
}

export function useDeleteEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    ...orpc.journal.deleteEntry.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: orpc.journal.listEntries.key({ type: 'query' }),
      });
      queryClient.invalidateQueries({
        queryKey: orpc.journal.getEntryDatesForMonth.key({ type: 'query' }),
      });
      queryClient.invalidateQueries({
        queryKey: orpc.journal.getStats.key({ type: 'query' }),
      });
    },
  });
}
