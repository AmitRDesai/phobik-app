import { rpcClient } from '@/lib/rpc';
import { useMutation } from '@tanstack/react-query';
import type { SoundSource } from './types';

/**
 * Kick off generation on the server. Holds credits server-side before
 * dispatching to the provider — throws on insufficient credits (the caller
 * should gate on balance first) or an in-flight generation (CONFLICT).
 */
export function useGenerateSound() {
  return useMutation({
    mutationFn: async (input: {
      id: string;
      prompt: string;
      style?: string | null;
      source?: SoundSource;
    }) => {
      // Pass prompt + style inline so the server upserts atomically — avoids
      // the race where local SQLite has the latest draft but Postgres doesn't
      // yet (PowerSync upload hasn't flushed).
      return await rpcClient.song.generate({
        id: input.id,
        prompt: input.prompt,
        style: input.style ?? null,
        source: input.source,
      });
    },
  });
}
