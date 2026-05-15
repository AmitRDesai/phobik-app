import { db } from '@/lib/powersync/database';
import { useMutation } from '@tanstack/react-query';

/**
 * Deletes a song from local SQLite. PowerSync's CRUD batch picks up the
 * DELETE op and forwards it to `rpcClient.song.delete` via the connector,
 * which removes the row from Postgres. S3 audio + artwork are left in place
 * for now (no cleanup endpoint yet — fine for testing).
 */
export function useDeleteSong() {
  return useMutation({
    mutationFn: async (input: { id: string }) => {
      await db.deleteFrom('song').where('id', '=', input.id).execute();
      return { id: input.id };
    },
  });
}
