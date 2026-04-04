import { orpc } from '@/lib/orpc';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const todaysChallengeOptions =
  orpc.mysteryChallenge.getTodaysChallenge.queryOptions();

export function useTodaysChallenge() {
  return useQuery(todaysChallengeOptions);
}

export function useRecordChallenge() {
  const queryClient = useQueryClient();
  return useMutation({
    ...orpc.mysteryChallenge.recordChallenge.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: todaysChallengeOptions.queryKey,
      });
    },
  });
}

export function useChallengeHistory() {
  return useQuery(orpc.mysteryChallenge.listChallenges.queryOptions({}));
}
