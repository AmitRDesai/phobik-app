import { rpcClient } from '@/lib/rpc';
import { useMutation } from '@tanstack/react-query';

export function useGenerateSong() {
  return useMutation({
    mutationFn: async (input: {
      id: string;
      prompt: string;
      style?: string;
    }) => {
      // Pass prompt + style inline so the server upserts atomically —
      // avoids the race where local SQLite has the latest draft but
      // Postgres doesn't yet (PowerSync upload hasn't flushed).
      return await rpcClient.song.generate({
        id: input.id,
        prompt: input.prompt,
        style: input.style ?? null,
      });
    },
  });
}
