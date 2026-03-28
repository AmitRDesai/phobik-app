import { orpc } from '@/lib/orpc';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

type Circle = '18-24' | '25-34' | '35-44' | '45-54' | '55+';

export function useCommunityPosts(search: string, circle: string | undefined) {
  return useInfiniteQuery(
    orpc.community.listPosts.infiniteOptions({
      input: (cursor: string | undefined) => ({
        cursor,
        limit: 15 as const,
        search: search || undefined,
        circle: circle as Circle | undefined,
      }),
      initialPageParam: undefined as string | undefined,
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
      refetchOnWindowFocus: true,
    }),
  );
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    ...orpc.community.createPost.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: orpc.community.listPosts.key(),
      });
    },
  });
}

export function useToggleReaction() {
  const queryClient = useQueryClient();
  return useMutation({
    ...orpc.community.toggleReaction.mutationOptions(),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: orpc.community.listPosts.key(),
      });
    },
  });
}
