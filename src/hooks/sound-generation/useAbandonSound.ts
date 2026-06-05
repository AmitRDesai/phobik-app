import { rpcClient } from '@/lib/rpc';
import { useMutation } from '@tanstack/react-query';

/**
 * Cancel an in-flight generation. The server marks the row `status='failed'`
 * and refunds the reserved credits, freeing the one-at-a-time slot. A late
 * Suno webhook is harmlessly ack'd but won't promote the row back to ready.
 */
export function useAbandonSound() {
  return useMutation({
    mutationFn: async (input: { id: string }) => {
      return await rpcClient.song.abandon({ id: input.id });
    },
  });
}
