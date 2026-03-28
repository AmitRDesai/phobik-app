import { orpc } from '@/lib/orpc';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useCommunityMember() {
  return useQuery(orpc.community.isMember.queryOptions());
}

export function useJoinCommunity() {
  const queryClient = useQueryClient();
  return useMutation({
    ...orpc.community.joinCommunity.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: orpc.community.isMember.key(),
      });
    },
  });
}
