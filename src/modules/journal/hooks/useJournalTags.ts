import { orpc } from '@/lib/orpc';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useJournalTags() {
  return useQuery(orpc.journal.listTags.queryOptions());
}

export function useCreateTag() {
  const queryClient = useQueryClient();
  return useMutation({
    ...orpc.journal.createTag.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: orpc.journal.listTags.key({ type: 'query' }),
      });
    },
  });
}

export function useDeleteTag() {
  const queryClient = useQueryClient();
  return useMutation({
    ...orpc.journal.deleteTag.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: orpc.journal.listTags.key({ type: 'query' }),
      });
    },
  });
}
