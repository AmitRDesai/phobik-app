import { db } from '@/lib/powersync/database';
import { useMutation } from '@tanstack/react-query';

/**
 * Deletes a sound from local SQLite. PowerSync forwards the DELETE to
 * `song.delete` via the connector, removing the Postgres row.
 */
export function useDeleteSound() {
  return useMutation({
    mutationFn: async (input: { id: string }) => {
      await db.deleteFrom('song').where('id', '=', input.id).execute();
      return { id: input.id };
    },
  });
}
