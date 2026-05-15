import { db } from '@/lib/powersync/database';
import { useUserId } from '@/lib/powersync/useUserId';
import { useMutation } from '@tanstack/react-query';

interface UpsertInput {
  id: string;
  prompt?: string;
  style?: string;
  isFavorite?: boolean;
  title?: string | null;
}

export function useUpsertSong() {
  const userId = useUserId();

  return useMutation({
    mutationFn: async (input: UpsertInput) => {
      if (!userId) throw new Error('Not authenticated');
      const now = new Date().toISOString();

      const existing = await db
        .selectFrom('song')
        .selectAll()
        .where('id', '=', input.id)
        .executeTakeFirst();

      if (existing) {
        const updates: Record<string, unknown> = { updated_at: now };
        if (input.prompt !== undefined) updates.prompt = input.prompt;
        if (input.style !== undefined) updates.style = input.style;
        if (input.title !== undefined) updates.title = input.title;
        if (input.isFavorite !== undefined)
          updates.is_favorite = input.isFavorite ? 1 : 0;

        await db
          .updateTable('song')
          .set(updates)
          .where('id', '=', input.id)
          .execute();
        return { id: input.id };
      }

      await db
        .insertInto('song')
        .values({
          id: input.id,
          user_id: userId,
          prompt: input.prompt ?? '',
          style: input.style ?? null,
          status: 'draft',
          provider_job_id: null,
          audio_key: null,
          artwork_key: null,
          title: null,
          composition_number: null,
          duration_seconds: null,
          analysis_tags: null,
          is_favorite: input.isFavorite ? 1 : 0,
          error_message: null,
          created_at: now,
          updated_at: now,
        })
        .execute();

      return { id: input.id };
    },
  });
}
