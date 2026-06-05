import { db } from '@/lib/powersync/database';
import { useUserId } from '@/lib/powersync/useUserId';
import { useMutation } from '@tanstack/react-query';
import type { SoundSource } from './types';

interface UpsertSoundInput {
  id: string;
  /** Set on first write; ignored on update so a song can't be re-tagged. */
  source?: SoundSource;
  prompt?: string;
  style?: string | null;
  title?: string | null;
  isFavorite?: boolean;
  /** Structured draft (AI Studio). Stored as JSON text. */
  inputMeta?: Record<string, unknown> | null;
}

/**
 * Insert or update a draft sound row in local SQLite (synced up via the
 * connector → `song.upsert`). Server-owned fields (status/audio_key/etc.) are
 * never written here.
 */
export function useUpsertSound() {
  const userId = useUserId();

  return useMutation({
    mutationFn: async (input: UpsertSoundInput) => {
      if (!userId) throw new Error('Not authenticated');
      const now = new Date().toISOString();

      const existing = await db
        .selectFrom('song')
        .select('id')
        .where('id', '=', input.id)
        .executeTakeFirst();

      if (existing) {
        const updates: Record<string, unknown> = { updated_at: now };
        if (input.prompt !== undefined) updates.prompt = input.prompt;
        if (input.style !== undefined) updates.style = input.style;
        if (input.title !== undefined) updates.title = input.title;
        if (input.isFavorite !== undefined)
          updates.is_favorite = input.isFavorite ? 1 : 0;
        if (input.inputMeta !== undefined)
          updates.input_meta = input.inputMeta
            ? JSON.stringify(input.inputMeta)
            : null;

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
          source: input.source ?? 'express-yourself',
          prompt: input.prompt ?? '',
          style: input.style ?? null,
          input_meta: input.inputMeta ? JSON.stringify(input.inputMeta) : null,
          status: 'draft',
          provider_job_id: null,
          audio_key: null,
          artwork_key: null,
          title: input.title ?? null,
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
