import { rpcClient } from '@/lib/rpc';
import { useMutation } from '@tanstack/react-query';

/**
 * Cancel an in-flight generation. Server marks the row `status='failed'`
 * with a "Canceled by user." message, freeing the one-at-a-time slot.
 * A late-arriving Suno webhook is harmlessly ack'd but won't promote the
 * row back to ready.
 */
export function useAbandonSong() {
  return useMutation({
    mutationFn: async (input: { id: string }) => {
      return await rpcClient.song.abandon({ id: input.id });
    },
  });
}
